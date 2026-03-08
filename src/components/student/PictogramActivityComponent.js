import {Card, Col, Row} from "antd";
import {HomeOutlined} from "@ant-design/icons";
import React, {useEffect, useRef, useState} from "react";
import {DndProvider} from "react-dnd";
import {MultiBackend} from "dnd-multi-backend";
import {useNavigate, useParams} from "react-router-dom";
import CustomDragLayer from "./dnd/CustomDragLayerComponent";
import "../assets/styles/PictogramActivity.css";
import '../assets/styles/font.css'
import {HTML5toTouch} from "rdndmb-html5-to-touch";
import DraggablePictogram from "./dnd/DraggablePictogramComponent";
import DropZone from "./dnd/DropZoneComponent";
import ActivityToolsComponent from "./dnd/ActivityToolsComponent";
import {useTranslation} from "react-i18next";
import { usePretraining } from "../../hooks/usePretraining";
import {useAvatar} from "../AvatarContext";
import {NEUTRAL, NEUTRAL_SPEAKING} from "../Avatar";
import {usePlayAudio} from "../../hooks/usePlayAudio";

let pictograms = [{
    activity: "1",
    content: [{id: "is", label: "es", audio: "is"}, {
        id: "isFor",
        label: "es para",
        audio: "isFor"
    }, {id: "isPartOf", label: "es parte de", audio: "isPartOf"}]
}, {
    activity: "2",
    content: [{id: "has", label: "tiene", audio: "has"}, {
        id: "isUsedFor",
        label: "sirve para",
        audio: "isUsedFor"
    }, {id: "isIn", label: "está en", audio: "isIn"}]
}];

let PictogramActivity = () => {

    let playAudio = usePlayAudio();
    const { maxUnlocked, updateUnlockedPhase, fetchUnlockedPhase } = usePretraining();

    let {t} = useTranslation();
    let [help, setHelp] = useState(false);
    let [escapingId, setEscapingId] = useState(null);
    let [highlightId, setHighlightId] = useState(null);
    let [started, setStarted] = useState(false);

    let [droppedPictogram, setDroppedPictogram] = useState(null);
    let [hiddenId, setHiddenId] = useState(null);

    let [targetId, setTargetId] = useState("es");
    let targetRef = useRef(targetId);
    const maxUnlockedRef = useRef(maxUnlocked);

    useEffect(() => {
        maxUnlockedRef.current = maxUnlocked;
    }, [maxUnlocked]);


    useEffect(() => {
        fetchUnlockedPhase();
    }, []);

    useEffect(() => {
        targetRef.current = targetId;
    }, [targetId]);

    let { changeEmotionSequence } =  useAvatar();
    useEffect(() => {

        if(activity === "1") {
            changeEmotionSequence([
                {
                    emotionDuring: NEUTRAL_SPEAKING,
                    emotionAfter: NEUTRAL,
                    text: "Vamos a aprender cómo representamos es, es para y es parte de. ¡Fíjate!",
                    audio: "intro-activity1-1",
                    afterDelay: 500
                },
                {
                    emotionDuring: NEUTRAL_SPEAKING,
                    emotionAfter: NEUTRAL,
                    text: "Este pictograma significa “ES”.",
                    audio: "intro-activity1-2",
                    onStart: () => setHighlightId("is"),
                    onEnd: () => setHighlightId(null),
                    afterDelay: 500
                },
                {
                    emotionDuring: NEUTRAL_SPEAKING,
                    emotionAfter: NEUTRAL,
                    text: "Este significa “ES PARA”.",
                    audio: "intro-activity1-3",
                    onStart: () => setHighlightId("isFor"),
                    onEnd: () => setHighlightId(null),
                    afterDelay: 500
                },
                {
                    emotionDuring: NEUTRAL_SPEAKING,
                    emotionAfter: NEUTRAL,
                    text: "Y este significa “ES PARTE DE”.",
                    audio: "intro-activity1-4",
                    onStart: () => setHighlightId("isPartOf"),
                    onEnd: () => setHighlightId(null),
                    afterDelay: 500
                },
                {
                    emotionDuring: NEUTRAL_SPEAKING,
                    emotionAfter: NEUTRAL,
                    text: "Cuando oigas el sonido del pictograma, arrástralo al cuadrado.",
                    audio: "intro-activity-5",
                    onEnd: () => setStarted(true),
                    afterDelay: 2000
                }
            ]);
        } else {
            changeEmotionSequence([
                {
                    emotionDuring: NEUTRAL_SPEAKING,
                    emotionAfter: NEUTRAL,
                    text: "Vamos a aprender cómo representamos tiene, sirve para y está en. ¡Mira la pantalla!",
                    audio: "intro-activity2-1",

                    afterDelay: 500
                },
                {
                    emotionDuring: NEUTRAL_SPEAKING,
                    emotionAfter: NEUTRAL,
                    text: "Este pictograma significa “TIENE”.",
                    audio: "intro-activity2-2",
                    onStart: () => setHighlightId("has"),
                    onEnd: () => setHighlightId(null),
                    afterDelay: 500
                },
                {
                    emotionDuring: NEUTRAL_SPEAKING,
                    emotionAfter: NEUTRAL,
                    text: "Este significa “SIRVE PARA”.",
                    audio: "intro-activity2-3",
                    onStart: () => setHighlightId("isUsedFor"),
                    onEnd: () => setHighlightId(null),
                    afterDelay: 500
                },
                {
                    emotionDuring: NEUTRAL_SPEAKING,
                    emotionAfter: NEUTRAL,
                    text: "Y este significa “ESTÁ EN”.",
                    audio: "intro-activity2-4",
                    onStart: () => setHighlightId("isIn"),
                    onEnd: () => setHighlightId(null),
                    afterDelay: 500
                },
                {
                    emotionDuring: NEUTRAL_SPEAKING,
                    emotionAfter: NEUTRAL,
                    text: "Cuando oigas el sonido del pictograma, arrástralo al cuadrado.",
                    audio: "intro-activity-5",
                    onEnd: () => setStarted(true),
                    afterDelay: 2000
                }
            ]);
        }
    }, []);

    let pictogramRefs = useRef({});
    let dropRef = useRef(null);
    let handRef = useRef(null);
    let attemptsRef = useRef(0);
    let successStreakRef = useRef(0);

    let audiosRef = useRef({});
    let audioHelpRef = useRef(("pictogramActivityHelp"));
    let repeatTimerRef = useRef(null);

    let {activity} = useParams();

    let navigate = useNavigate();

    useEffect(() => {
        if(started){
            successStreakRef.current = 0;
            attemptsRef.current = 0;
            setHelp(false);
            setEscapingId(null);

            let newTarget = pictograms.find(p => p.activity === activity)?.content[0]?.id;
            setTargetId(newTarget || "");

            audiosRef.current = {};
            pictograms.find(p => p.activity === activity)?.content.forEach((p) => {
                audiosRef.current[p.id] = (p.audio);
            });

            return () => {
                if (repeatTimerRef.current) {
                    clearInterval(repeatTimerRef.current);
                }
            };
        }
    }, [activity, started]);


    useEffect(() => {
        if(started) {
            playAudio(targetId);

            if (repeatTimerRef.current) {
                clearInterval(repeatTimerRef.current);
            }
            repeatTimerRef.current = setInterval(() => {
                if (!help) {
                    playAudio(targetId);
                }
            }, 6000);

            return () => {
                if (repeatTimerRef.current) {
                    clearInterval(repeatTimerRef.current);
                }
            };
        }
    }, [targetId, help, started]);



    let handleDrop = (draggedId) => {
        const currentTarget = targetRef.current;
        const draggedPictogram = pictograms
            .find(p => p.activity === activity)
            ?.content.find(p => p.id === draggedId);

        if (draggedId === currentTarget) {
            playAudio("correct");
            attemptsRef.current = 0;
            setHelp(false);
            setEscapingId(null);

            setHiddenId(draggedId);
            setDroppedPictogram(draggedPictogram);

            successStreakRef.current++;

            setTimeout(() => {
                setDroppedPictogram(null);
                setHiddenId(null);

                if (successStreakRef.current >= 5) {
                    console.log(maxUnlocked)
                    // Incrementamos pretrainingPhase solo si la fase actual es igual a la máxima desbloqueada
                    if (parseInt(activity) >= maxUnlockedRef.current) {
                        updateUnlockedPhase(maxUnlockedRef.current + 1)
                            .then(() => console.log("Fase desbloqueada actualizada"))
                            .catch((err) => console.error(err));
                    }

                    if (activity === "1") {
                        navigate("/students/pretraining/block/1/activity/2");
                        return;
                    } else {
                        navigate("/students/pretraining/block/2/activity/1");
                        return;
                    }
                }

                let nextIds = pictograms.find(p => p.activity === activity)
                    ?.content.map(p => p.id)
                    .filter(id => id !== currentTarget);
                setTargetId(nextIds[Math.floor(Math.random() * nextIds.length)]);
            }, 1000);

        } else {
            playAudio("error")
            setEscapingId(draggedId);
            setTimeout(() => setEscapingId(null), 700);

            successStreakRef.current = 0;
            attemptsRef.current = attemptsRef.current + 1;

            if (attemptsRef.current >= 5) {
                setHelp(true);
                setTimeout(() => animateHandGuide(), 50);
            }
        }
    };

    let animateHandGuide = () => {
        let handEl = handRef.current;
        let pictEl = pictogramRefs.current[targetRef.current];
        let dropEl = dropRef.current;
        if (!handEl || !pictEl || !dropEl) {
            return;
        }

        let pictRect = pictEl.getBoundingClientRect();
        let dropRect = dropEl.getBoundingClientRect();
        let containerRect = handEl.parentElement.getBoundingClientRect();

        let startX = pictRect.left - containerRect.left + pictRect.width / 2;
        let startY = pictRect.top - containerRect.top + pictRect.height / 2;
        let endX = dropRect.left - containerRect.left + dropRect.width / 2;
        let endY = dropRect.top - containerRect.top + dropRect.height / 2;

        let dx = endX - startX;
        let dy = endY - startY;

        handEl.style.left = `${startX}px`;
        handEl.style.top = `${startY}px`;
        handEl.style.opacity = "1";
        handEl.style.transition = "none";
        handEl.style.transform = "translate(-50%, -50%)";

        let count = 0;
        let doMove = () => {
            handEl.style.transition = "transform 1.5s ease-in-out";
            handEl.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
            count++;
            if (count < 3) {
                setTimeout(() => {
                    handEl.style.transition = "none";
                    handEl.style.transform = "translate(-50%, -50%)";
                    setTimeout(doMove, 300);
                }, 1500);
            } else {
                setTimeout(() => {
                    handEl.style.transition = "opacity 1500ms";
                    handEl.style.opacity = "0";
                    setTimeout(() => setHelp(false), 300);
                }, 1500);
            }
        };
        setTimeout(doMove, 90);
    };

    return (<DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <CustomDragLayer/>
        <Card style={{padding: "2vh", width: "80%"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1vh"}}>
                <div style={{flex: 1}}>
                    <ActivityToolsComponent content={t("Escucha y coloca el elemento correcto en el cuadrado inferior")}
                                            playHelp={()=>playAudio(audioHelpRef.current)}/>
                </div>
                <HomeOutlined style={{fontSize: "45px", cursor: "pointer", paddingLeft: "20px"}} onClick={() => {
                    navigate("/students/pretraining/");
                }}/>
            </div>
            <Row justify="center" gutter={[16, 16]} style={{marginBottom: 24}}>
                {pictograms.find(p => p.activity === activity)?.content.map((p) => (<Col key={p.id}>
                        <DraggablePictogram
                            pictogram={p}
                            isBlinking={p.id === targetId}
                            isEscaping={escapingId === p.id}
                            isHighlighted={highlightId === p.id}
                            forwardRef={(el) => {
                                pictogramRefs.current[p.id] = el;
                            }}
                            hidden={p.id === hiddenId}
                        />
                    </Col>))}
            </Row>

            <Row justify="center">
                <Col>
                    <DropZone
                        blinking={started}
                        forwardRef={dropRef}
                        onDrop={handleDrop}
                        droppedPictogram={droppedPictogram}
                    />
                </Col>
            </Row>

            {help && <span ref={handRef} className="hand-guide">🖐️</span>}
        </Card>
    </DndProvider>);
};

export default PictogramActivity;