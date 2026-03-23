import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAvatar } from "./AvatarContext";


const AvatarNavigationListener = () => {
    const location = useLocation();
    const { speech, stopAudio } = useAvatar();

    useEffect(() => {
        if (speech) stopAudio();
    }, [location.pathname]);

    return null;
};

export default AvatarNavigationListener;