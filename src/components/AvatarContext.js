import { createContext, useContext, useState, useRef } from "react";
import {usePlayAudio} from "../hooks/usePlayAudio";
import {runWithLock} from "../services/runWithLock";
import {isAudioLocked, setAudioLocked} from "../services/audioLock.js";

const AvatarContext = createContext();
const AUDIO_PLAYBACK_TIMEOUT_MS = 15000;

export const AvatarProvider = ({ children }) => {
    const [emotion, setEmotion] = useState("neutral");
    const [speech, setSpeech] = useState(null);
    const [visible, setVisible] = useState(localStorage.getItem("avatarVisible") === "true");
    const [voiceEnabled, setVoiceEnabled] = useState(localStorage.getItem("avatarVoiceEnabled") === "true");
    const [isBusy, setIsBusy] = useState(false);

    const audioRef = useRef(null);
    const finishAudioRef = useRef(null);
    const isPlayingRef = useRef(false);
    const sequenceIdRef = useRef(0);
    const playAudioByKey = usePlayAudio({ bypassLock: true });

    const setAudioLock = (locked) => {
        setAudioLocked(locked);
    };

    const playAudio = (audioKey) => {
        return new Promise(resolve => {
            if (!audioKey || !voiceEnabled) return resolve();

            finishAudioRef.current?.();
            if (audioRef.current) {
                audioRef.current.pause();
            }

            setAudioLock(true);

            let audio = null;
            let settled = false;
            const finish = () => {
                if (settled) return;
                settled = true;
                clearTimeout(timeout);
                if (audio) {
                    audio.onended = null;
                    audio.onerror = null;
                }
                if (finishAudioRef.current === finish) {
                    finishAudioRef.current = null;
                }
                setAudioLock(false);
                resolve();
            };
            const timeout = setTimeout(() => {
                audio?.pause();
                finish();
            }, AUDIO_PLAYBACK_TIMEOUT_MS);

            try {
                audio = playAudioByKey(audioKey, finish);
            } catch (error) {
                console.warn(`Could not start avatar audio "${audioKey}":`, error);
                finish();
                return;
            }

            if (!audio || settled) return finish();
            audioRef.current = audio;
            finishAudioRef.current = finish;
            audio.onended = finish;
            audio.onerror = finish;
        });
    };

    const stopAudio = () => {
        finishAudioRef.current?.();
        if (audioRef.current) {
            audioRef.current.pause();
            try {
                audioRef.current.currentTime = 0;
            } catch (error) {
                console.warn("Could not reset stopped avatar audio:", error);
            }
            audioRef.current = null;
        }

        setSpeech(null);
        setAudioLock(false);

        if (visible) {
            setEmotion("neutral");
        }

        isPlayingRef.current = false;
        sequenceIdRef.current += 1;
    };

    const changeEmotionSequence = async (sequence = []) => {
        if (!Array.isArray(sequence) || sequence.length === 0) return;
        if (isPlayingRef.current) return;

        isPlayingRef.current = true;
        const sequenceId = ++sequenceIdRef.current;
        try {
            await runWithLock(setIsBusy, async () => {
                for (const step of sequence) {
                    if (sequenceIdRef.current !== sequenceId) break;

                    const {
                        audio,
                        text,
                        emotionDuring = "neutral",
                        emotionAfter = "neutral",
                        afterDelay = 500,
                        onStart,
                        onEnd
                    } = step;

                    if (visible) setEmotion(emotionDuring);
                    setSpeech(text || null);

                    onStart?.();

                    await playAudio(audio);
                    if (sequenceIdRef.current !== sequenceId) break;

                    if (visible) setEmotion(emotionAfter);
                    setSpeech(null);

                    await new Promise(res => setTimeout(res, afterDelay));

                    onEnd?.();
                }
            });
        } finally {
            if (sequenceIdRef.current === sequenceId) {
                if (visible) setEmotion("neutral");
                setSpeech(null);
                isPlayingRef.current = false;
            }
        }
    };

    // Funciones para controlar visibilidad y voz
    const hideAvatar = () => {
        setVisible(false);
        localStorage.setItem("avatarVisible", "false");
    };

    const showAvatar = () => {
        setVisible(true);
        localStorage.setItem("avatarVisible", "true");
    };

    const disableVoice = () => {
        setVoiceEnabled(false);
        localStorage.setItem("avatarVoiceEnabled", "false");
    };

    const enableVoice = () => {
        setVoiceEnabled(true);
        localStorage.setItem("avatarVoiceEnabled", "true");
    };

    return (
        <AvatarContext.Provider value={{
            emotion,
            speech,
            changeEmotionSequence,
            visible,
            voiceEnabled,
            hideAvatar,
            showAvatar,
            disableVoice,
            enableVoice,
            stopAudio,
            isBusy,
            isAudioLocked,
            setAudioLock
        }}>
            {children}
        </AvatarContext.Provider>
    );
};

export const useAvatar = () => useContext(AvatarContext);