import { createContext, useContext, useState, useRef } from "react";
import {usePlayAudio} from "../hooks/usePlayAudio";
import {runWithLock} from "../services/runWithLock";
import {isAudioLocked, setAudioLocked} from "../services/audioLock.js";

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
    const [emotion, setEmotion] = useState("neutral");
    const [speech, setSpeech] = useState(null);
    const [visible, setVisible] = useState(localStorage.getItem("avatarVisible") === "true");
    const [voiceEnabled, setVoiceEnabled] = useState(localStorage.getItem("avatarVoiceEnabled") === "true");
    const [isBusy, setIsBusy] = useState(false);

    const audioRef = useRef(null);
    const isPlayingRef = useRef(false);
    const playAudioByKey = usePlayAudio({ bypassLock: true });

    const setAudioLock = (locked) => {
        setAudioLocked(locked);
    };

    const playAudio = (audioKey) => {
        return new Promise(resolve => {
            if (!audioKey || !voiceEnabled) return resolve();

            if (audioRef.current) {
                audioRef.current.pause();
            }

            // Bloquear audios desde otros componentes
            setAudioLock(true);

            const audio = playAudioByKey(audioKey);
            audioRef.current = audio;

            if (!audio) {
                setAudioLock(false);
                return resolve();
            }

            audio.onended = () => {
                setAudioLock(false);
                resolve();
            };

            audio.onerror = () => {
                setAudioLock(false);
                resolve();
            };
        });
    };

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }

        setSpeech(null);
        setAudioLock(false);

        if (visible) {
            setEmotion("neutral");
        }

        isPlayingRef.current = false;
    };

    const changeEmotionSequence = async (sequence = []) => {
        if (!Array.isArray(sequence) || sequence.length === 0) return;
        if (isPlayingRef.current) return;

        isPlayingRef.current = true;
        await runWithLock(setIsBusy, async () => {
            for (const step of sequence) {
                if (!isPlayingRef.current) break;

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

                if (visible) setEmotion(emotionAfter);
                setSpeech(null);

                await new Promise(res => setTimeout(res, afterDelay));

                onEnd?.();
            }
        });

        if (visible) setEmotion("neutral");
        isPlayingRef.current = false;
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