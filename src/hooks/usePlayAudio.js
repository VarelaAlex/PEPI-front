import {useTranslation} from "react-i18next";
import {useRef} from "react";
import {audioMap} from "../audioMap";

export function usePlayAudio() {
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

		// Verificar si AvatarContext está reproduciendo audio
		// Usar dynamic import para evitar circular dependencies
		try {
			const { isAudioLocked } = require("../components/AvatarContext");
			if (typeof isAudioLocked === 'function' && isAudioLocked()) {
				console.log("Audio bloqueado por AvatarContext");
				return audioRef.current;
			}
		} catch (e) {
			// Si hay error al verificar, proceder normalmente
		}

		audioRef.current.play().catch(() => {});

		return audioRef.current;
	};
}

