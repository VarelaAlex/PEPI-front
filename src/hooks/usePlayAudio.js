import {useTranslation} from "react-i18next";
import {useRef} from "react";
import {audioMap} from "../audioMap";
import {isAudioLocked} from "../services/audioLock.js";

export function usePlayAudio(options = {}) {
	const { bypassLock = false } = options;
	const audioRef = useRef(null);
	const { i18n } = useTranslation();

	return (audioKey) => {
		if (!audioKey) return null;

		const lang = i18n.language.startsWith("en") ? "en" : "es";
		const src = audioMap[lang][audioKey];

		if (!src) {
			console.warn("Audio key not found:", audioKey);
			return null;
		}

		if (!audioRef.current || audioRef.current.src !== window.location.origin + src) {
			audioRef.current = new Audio(src);
		}

		audioRef.current.currentTime = 0;

		if (!bypassLock && isAudioLocked()) {
			return null;
		}

		audioRef.current.play().catch(() => {});

		return audioRef.current;
	};
}

