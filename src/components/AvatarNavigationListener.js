import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAvatar } from "./AvatarContext";

const AVATAR_LOGIN_FLAG_KEY = "avatarLoginFlag";

const updateAvatarFlagFromQuery = (search = "") => {
    const params = new URLSearchParams(search);
    const avatarParam = params.get("avatar");

    if (avatarParam === null) return;

    const normalizedValue = avatarParam.trim().toLowerCase();
    if (normalizedValue === "true" || normalizedValue === "false") {
        localStorage.setItem(AVATAR_LOGIN_FLAG_KEY, normalizedValue);
    }
};

const AvatarNavigationListener = () => {
    const location = useLocation();
    const { speech, stopAudio } = useAvatar();

    useEffect(() => {
        updateAvatarFlagFromQuery(location.search);

        if (speech) stopAudio();
    }, [location.pathname]);

    return null;
};

export default AvatarNavigationListener;