import {useTranslation} from "react-i18next";
import {useCallback, useRef} from "react";
import {audioMap} from "../audioMap";
import {isAudioLocked} from "../services/audioLock.js";

const preloadedAudio = new Map();
const MAX_PRELOADED_AUDIO = 8;

export function usePlayAudio(options = {}) {
	const { bypassLock = false } = options;
	const audioRef = useRef(null);
	const { i18n } = useTranslation();
	const lang = i18n.language.startsWith("en") ? "en" : "es";

	const preload = useCallback((audioKeys) => {
		const keys = Array.isArray(audioKeys) ? audioKeys : [audioKeys];
		keys.filter(Boolean).forEach((audioKey) => {
			const src = audioMap[lang][audioKey];
			if (!src || preloadedAudio.has(src)) return;

			while (preloadedAudio.size >= MAX_PRELOADED_AUDIO) {
				const [oldestSrc, oldestAudio] = preloadedAudio.entries().next().value;
				oldestAudio.pause();
				oldestAudio.removeAttribute("src");
				oldestAudio.load();
				preloadedAudio.delete(oldestSrc);
			}

			const audio = new Audio();
			audio.preload = "auto";
			audio.src = src;
			audio.load();
			preloadedAudio.set(src, audio);
		});
	}, [lang]);

	const playAudio = useCallback((audioKey, onPlaybackError) => {
		if (!audioKey) return null;

		const src = audioMap[lang][audioKey];

		if (!src) {
			console.warn("Audio key not found:", audioKey);
			return null;
		}

		if (!audioRef.current || audioRef.current.src !== window.location.origin + src) {
			audioRef.current = preloadedAudio.get(src) || new Audio(src);
			preloadedAudio.delete(src);
		}

		audioRef.current.currentTime = 0;

		if (!bypassLock && isAudioLocked()) {
			return null;
		}

		audioRef.current.play().catch((error) => {
			console.warn(`Audio playback failed for "${audioKey}":`, error);
			onPlaybackError?.(error);
		});

		return audioRef.current;
	}, [bypassLock, lang]);

	playAudio.preload = preload;
	return playAudio;
}
