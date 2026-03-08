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

const exercises = [
    {
        activity: "1",
        content: [
            {
                id: 1,
                phraseKey: "dog-animal",
                wordAudio: ["dog", "is", "animal"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6901`
                ]
            },
            {
                id: 2,
                phraseKey: "whale-mammal",
                wordAudio: ["whale", "is", "mammal"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7777`
                ]
            },
            {
                id: 3,
                phraseKey: "house-living",
                wordAudio: ["house", "isFor", "living"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6964`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/11605`
                ]
            },
            {
                id: 4,
                phraseKey: "sun-star",
                wordAudio: ["sun", "is", "star"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7252`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2752`
                ]
            },
            {
                id: 5,
                phraseKey: "summer-year",
                wordAudio: ["summer", "isPartOf", "year"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5604`,
                    "/pictograms/isPartOf.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6903`
                ]
            },
            {
                id: 6,
                phraseKey: "apple-fruit",
                wordAudio: ["apple", "is", "fruit"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2462`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/28339`
                ]
            },
            {
                id: 7,
                phraseKey: "bed-sleeping",
                wordAudio: ["bed", "isFor", "sleeping"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/25900`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6479`
                ]
            },
            {
                id: 8,
                phraseKey: "street-city",
                wordAudio: ["street", "isPartOf", "city"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2299`,
                    "/pictograms/isPartOf.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2704`
                ]
            },
            {
                id: 9,
                phraseKey: "car-traveling",
                wordAudio: ["car", "isFor", "traveling"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2339`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/36974`
                ]
            },
            {
                id: 10,
                phraseKey: "swing-playing",
                wordAudio: ["swing", "isFor", "playing"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/4608`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6537`
                ]
            },
            {
                id: 11,
                phraseKey: "water-drinking",
                wordAudio: ["water", "isFor", "drinking"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2248`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6061`
                ]
            },
            {
                id: 12,
                phraseKey: "sea-bathing",
                wordAudio: ["sea", "isFor", "bathing"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/38782`
                ]
            }
        ]
    },

    {
        activity: "2",
        content: [
            {
                id: 1,
                phraseKey: "dog-tail",
                wordAudio: ["dog", "has", "tail"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`,
                    "/pictograms/has.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5967`
                ]
            },
            {
                id: 2,
                phraseKey: "whale-sea",
                wordAudio: ["whale", "isIn", "sea"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`
                ]
            },
            {
                id: 3,
                phraseKey: "house-living2",
                wordAudio: ["house", "isUsedFor", "living"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6964`,
                    "/pictograms/isUsedFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/11605`
                ]
            },
            {
                id: 4,
                phraseKey: "sun-sky",
                wordAudio: ["sun", "isIn", "sky"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7252`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6978`
                ]
            },
            {
                id: 5,
                phraseKey: "summer-sunbathing",
                wordAudio: [
                    "summer",
                    "isUsedFor",
                    "sunbathing"
                ],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5604`,
                    "/pictograms/isUsedFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/26500`
                ]
            },
            {
                id: 6,
                phraseKey: "apple-fruitBowl",
                wordAudio: ["apple", "isIn", "fruitBowl"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2462`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/16303`
                ]
            },
            {
                id: 7,
                phraseKey: "bed-bedroom",
                wordAudio: ["bed", "isIn", "bedroom"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/25900`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/33068`
                ]
            },
            {
                id: 8,
                phraseKey: "street-city2",
                wordAudio: ["street", "isIn", "city"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2299`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2704`
                ]
            },
            {
                id: 9,
                phraseKey: "car-wheels",
                wordAudio: ["car", "has", "wheels"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2339`,
                    "/pictograms/has.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6209`
                ]
            },
            {
                id: 10,
                phraseKey: "swing-park",
                wordAudio: ["swing", "isIn", "park"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/4608`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2859`
                ]
            },
            {
                id: 11,
                phraseKey: "water-washing",
                wordAudio: ["water", "isUsedFor", "washing"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2248`,
                    "/pictograms/isUsedFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/26803`
                ]
            },
            {
                id: 12,
                phraseKey: "sea-beach",
                wordAudio: ["sea", "isIn", "beach"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/30518`
                ]
            }
        ]
    }
];

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

        if (item.text === phrase[index]) {
            setSlots(prev => {
                const next = [...prev];
                if (!next[index]) next[index] = item.text;
                return next;
            });

            setPool(prev =>
                prev.map(p =>
                    p.id === item.id ? { ...p, used: true } : p
                )
            );
        }
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