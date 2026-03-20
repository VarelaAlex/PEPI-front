import {Col, Row, Card} from "antd";
import {HomeOutlined} from "@ant-design/icons";
import React, {useEffect, useRef, useState} from "react";
import {DndProvider} from "react-dnd";
import {MultiBackend} from "react-dnd-multi-backend";
import {useNavigate, useParams} from "react-router-dom";
import "../assets/styles/font.css";
import {useTranslation} from "react-i18next";
import CustomDragLayer from "./dnd/CustomDragLayerComponent";
import DraggableCard from "./dnd/DraggableCardComponent";
import DropSlot from "./dnd/DropSlotComponent";
import {HTML5toTouch} from "rdndmb-html5-to-touch";
import ActivityToolsComponent from "./dnd/ActivityToolsComponent";
import {usePretraining} from "../../hooks/usePretraining";
import {useAvatar} from "../AvatarContext";
import {NEUTRAL, NEUTRAL_SPEAKING} from "../Avatar";
import {usePlayAudio} from "../../hooks/usePlayAudio";
import {exercises} from "./exercises/data";

function shuffledArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function PhrasesActivity() {

    let {t} = useTranslation();
    let {activity} = useParams();
    const navigate = useNavigate();

    const { maxUnlocked, updateUnlockedPhase, fetchUnlockedPhase } = usePretraining();
    let { changeEmotionSequence } =  useAvatar();
    const playAudio = usePlayAudio();

    const [exerciseIndex, setExerciseIndex] = useState(0);
    const [slots, setSlots] = useState([]);
    const [pool, setPool] = useState([]);
    const [completedCount, setCompletedCount] = useState(0);
    let [started, setStarted] = useState(false);

    const timeoutRef = useRef(null);
    const maxUnlockedRef = useRef(maxUnlocked);

    const exercisesForActivity =
        exercises.find(e => e.activity === activity)?.content ?? [];

    const shuffledExercises = useRef(shuffledArray(exercisesForActivity));

    const playIntro = () => {
        changeEmotionSequence([
            {
                emotionDuring: NEUTRAL_SPEAKING,
                emotionAfter: NEUTRAL,
                text:
                    activity === "1"
                        ? t("phrasesActivity.intro1")
                        : t("phrasesActivity.intro2"),
                audio:
                    activity === "1"
                        ? "intro-activity3"
                        : "intro-activity4",
                onEnd: () => setStarted(true),
                afterDelay: 500
            }
        ]);
    };

    useEffect(() => {
        playIntro();

        const resetTimeout = () => {
            clearTimeout(timeoutRef.current);
            const ex = shuffledExercises.current[exerciseIndex];
            timeoutRef.current = setTimeout(()=>playAudio(ex.phraseKey), 5000);
        };

        const events = ["click", "keydown", "touchstart", "mousemove"];
        events.forEach(e => window.addEventListener(e, resetTimeout));

        resetTimeout();

        return () => {
            clearTimeout(timeoutRef.current);
            events.forEach(e => window.removeEventListener(e, resetTimeout));
        };
    }, []);

    useEffect(() => {
        fetchUnlockedPhase();
    }, []);

    useEffect(() => {
        maxUnlockedRef.current = maxUnlocked;
    }, [maxUnlocked]);

    useEffect(() => {
        setCompletedCount(0);
    }, [activity]);

    useEffect(() => {
        if (!started) return;

        const ex = shuffledExercises.current[exerciseIndex];
        if (!ex) return;

        const phrase = t(`phrasesActivity.phrases.${ex.phraseKey}`, {
            returnObjects: true
        });

        setSlots(Array(phrase.length).fill(null));

        const base = phrase.map((text, i) => ({
            id: `${exerciseIndex}-${i}`,
            text,
            used: false,
            audio: ex.wordAudio?.[i] ?? null,
            image: ex.image?.[i] ?? null
        }));

        setPool(shuffledArray(base));

        playAudio(ex.phraseKey);
    }, [exerciseIndex, started]);

    function handleDrop(index, item) {
        const ex = shuffledExercises.current[exerciseIndex];
        if (!ex) return;

        const phrase = t(`phrasesActivity.phrases.${ex.phraseKey}`, {
            returnObjects: true
        });

        // 1. Validar que el elemento sea el correcto para esta posición
        if (item.text !== phrase[index]) {
            playAudio("error");
            return;
        }

        // 2. Validar que no haya elemento ya colocado en esta posición
        if (slots[index] !== null && slots[index] !== undefined) {
            playAudio("error");
            return;
        }

        // 3. Validar orden secuencial - todos los anteriores deben estar llenos
        for (let i = 0; i < index; i++) {
            if (slots[i] === null || slots[i] === undefined) {
                playAudio("error");
                return;
            }
        }

        // Si todo es correcto, reproducir sonido y colocar el elemento
        playAudio("correct");

        setSlots(prev => {
            const next = [...prev];
            next[index] = item.text;
            return next;
        });

        setPool(prev =>
            prev.map(p =>
                p.id === item.id ? { ...p, used: true } : p
            )
        );
    }

    useEffect(() => {
        const ex = shuffledExercises.current[exerciseIndex];
        if (!ex) return;

        const phrase = t(`phrasesActivity.phrases.${ex.phraseKey}`, {
            returnObjects: true
        });

        const completed =
            slots.length > 0 &&
            slots.every((s, i) => s === phrase[i]);

        if (!completed) return;

        setTimeout(() => {
            setCompletedCount(c => c + 1);

            if (completedCount + 1 < 5) {
                setExerciseIndex(i => i + 1);
            } else {
                if (parseInt(activity) + 2 >= maxUnlockedRef.current) {
                    updateUnlockedPhase(maxUnlockedRef.current + 1);
                }

                navigate(
                    activity === "1"
                        ? "/students/pretraining/block/2/activity/2"
                        : "/students/pretraining/block/3/activity/1"
                );
            }
        }, 600);
    }, [slots]);

    const currentExercise = shuffledExercises.current[exerciseIndex];
    if (!currentExercise) return null;

    const visiblePool = pool.filter((p) => !p.used);

    return (<DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <CustomDragLayer/>
        <Card style={{padding: "2vh", width: "80%"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1vh"}}>
                <div style={{flex: 1}}>
                    <ActivityToolsComponent
                        playAudio={() => playAudio(currentExercise.phraseKey)}
                        content={t("phrasesActivity.help")}
                        playHelp={() => playAudio("phraseActivityHelp")}
                    />
                </div>
                <HomeOutlined style={{fontSize: "45px", cursor: "pointer", paddingLeft: "20px"}} onClick={() => {
                    navigate("/students/pretraining/");
                }}/>
            </div>
            <Row gutter={[16, 16]} justify="center" style={{marginBottom: 40}}>
                {visiblePool.map(({id, text, audio, image}) => (<Col key={id}>
                    <DraggableCard id={id} text={text} audio={audio} image={image}/>
                </Col>))}
            </Row>

            <Row justify="center">
                {t(`phrasesActivity.phrases.${currentExercise.phraseKey}`, {
                    returnObjects: true
                }).map((expected, i) => (
                    <DropSlot
                        key={i}
                        index={i}
                        expectedText={expected}
                        value={slots[i]}
                        image={currentExercise.image?.[i]}
                        enabled={i === 0 ? true : !!slots[i - 1]}
                        onDrop={handleDrop}
                    />
                ))}
            </Row>
        </Card>
    </DndProvider>);
}