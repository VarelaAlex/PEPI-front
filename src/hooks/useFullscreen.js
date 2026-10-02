import { useCallback } from "react";

const useFullscreen = () => {
    // Función auxiliar para detectar si es un dispositivo táctil
    const checkIsTouchDevice = () => {
        return (
            navigator.maxTouchPoints > 0 ||
            "ontouchstart" in window ||
            /Android|webOS|iPhone|iPad|iPod|Tablet|Mobile/i.test(navigator.userAgent)
        );
    };

    // Entrar en fullscreen (Solo actúa si es un dispositivo táctil)
    const enterFullscreen = useCallback(() => {
        if (!checkIsTouchDevice()) {
            return;
        }

        if (document.fullscreenEnabled && !document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error entering fullscreen: ${err.message}`);
            });
        }
    }, []);

    // Salir de fullscreen
    const exitFullscreen = useCallback(() => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch((err) => {
                console.error(`Error exiting fullscreen: ${err.message}`);
            });
        }
    }, []);

    return { 
        enterFullscreen, 
        exitFullscreen,
    };
};

export default useFullscreen;