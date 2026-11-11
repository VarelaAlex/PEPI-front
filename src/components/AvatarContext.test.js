import React, {useEffect} from "react";
import {act, render, screen} from "@testing-library/react";
import {AvatarProvider, useAvatar} from "./AvatarContext";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({i18n: {language: "es"}})
}));

const MockAudio = jest.fn().mockImplementation(function (src) {
    this.src = src || "";
    this.currentTime = 0;
    this.pause = jest.fn();
    this.play = jest.fn(() => Promise.reject(new Error("Audio unavailable")));
});

const AvatarControls = ({onReady}) => {
    const avatar = useAvatar();

    useEffect(() => {
        onReady(avatar);
    }, [avatar, onReady]);

    return <span data-testid="busy">{String(avatar.isBusy)}</span>;
};

describe("Avatar audio playback", () => {
    let avatar;
    let warn;

    beforeEach(() => {
        localStorage.setItem("avatarVoiceEnabled", "true");
        window.Audio = MockAudio;
        MockAudio.mockClear();
        warn = jest.spyOn(console, "warn").mockImplementation(() => {});
        avatar = null;
    });

    afterEach(() => {
        warn.mockRestore();
        localStorage.clear();
    });

    it("releases the interaction lock when play() rejects", async () => {
        render(
            <AvatarProvider>
                <AvatarControls onReady={(controls) => { avatar = controls; }} />
            </AvatarProvider>
        );

        await act(async () => {
            await avatar.changeEmotionSequence([{audio: "correct", afterDelay: 0}]);
        });

        expect(screen.getByTestId("busy")).toHaveTextContent("false");
        expect(avatar.isAudioLocked()).toBe(false);
    });

    it("unblocks the interaction when the avatar audio is stopped", async () => {
        const neverEndingAudio = new Promise(() => {});
        MockAudio.mockImplementation(function (src) {
            this.src = src || "";
            this.currentTime = 0;
            this.pause = jest.fn();
            this.play = jest.fn(() => neverEndingAudio);
        });

        render(
            <AvatarProvider>
                <AvatarControls onReady={(controls) => { avatar = controls; }} />
            </AvatarProvider>
        );

        let sequence;
        await act(async () => {
            sequence = avatar.changeEmotionSequence([{audio: "correct", afterDelay: 0}]);
            await Promise.resolve();
            avatar.stopAudio();
            await sequence;
        });

        expect(screen.getByTestId("busy")).toHaveTextContent("false");
        expect(avatar.isAudioLocked()).toBe(false);
    });
});
