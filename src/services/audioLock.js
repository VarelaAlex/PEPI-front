let audioLocked = false;

export function setAudioLocked(locked) {
    audioLocked = Boolean(locked);
}

export function isAudioLocked() {
    return audioLocked;
}