import {useEffect, useState} from "react";

const getVisualViewportHeight = () =>
    typeof window === "undefined"
        ? 0
        : window.visualViewport?.height ?? window.innerHeight;

export const useVisualViewportHeight = () => {
    const [height, setHeight] = useState(getVisualViewportHeight);

    useEffect(() => {
        const updateHeight = () => setHeight(getVisualViewportHeight());
        const visualViewport = window.visualViewport;

        window.addEventListener("resize", updateHeight);
        visualViewport?.addEventListener("resize", updateHeight);

        return () => {
            window.removeEventListener("resize", updateHeight);
            visualViewport?.removeEventListener("resize", updateHeight);
        };
    }, []);

    return height;
};
