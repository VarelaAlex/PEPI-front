import React from "react";
import { useAvatar } from "./AvatarContext";
import "./assets/styles/avatar.css";

import neutral from "./assets/avatar/neutral.png"
import neutral_speaking from "./assets/avatar/neutral_speaking.png"
import worried from "./assets/avatar/neutral.png"
import worried_speaking from "./assets/avatar/neutral_speaking.png"
import happy from "./assets/avatar/happy.png"
import happy_speaking from "./assets/avatar/happy_speaking.png"
import surprised from "./assets/avatar/surprised.png"
import love_speaking from "./assets/avatar/love_speaking.png"

export const NEUTRAL = "neutral";
export const NEUTRAL_SPEAKING = "neutral_speaking";
export const WORRIED = "worried";
export const WORRIED_SPEAKING = "worried_speaking";
export const HAPPY = "happy";
export const HAPPY_SPEAKING = "happy_speaking";
export const SURPRISED = "surprised";
export const LOVE_SPEAKING = "love_speaking";

const avatarImages = {
    neutral,
    neutral_speaking,
    worried,
    worried_speaking,
    happy,
    happy_speaking,
    surprised,
    love_speaking,
};

export default function Avatar() {
    const { emotion, visible } = useAvatar();

    if (!visible) return null;

    return (
        <div className="avatar-container">
            <img
                src={avatarImages[emotion] || avatarImages.neutral}
                alt="avatar"
                className="avatar-img"
            />
        </div>
    );
}