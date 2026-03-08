import {HomeOutlined, ReloadOutlined} from "@ant-design/icons";
import {DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors} from "@dnd-kit/core";
import {Card, Col, Divider, Flex, Row} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useSession} from "../SessionComponent";
import DraggablePhase2 from "./DraggablePhase2Component";
import DroppablePhase2 from "./DroppablePhase2Component";
import {nexusX, nodes, pathBottom, pathBottom2, pathTop, stopX, viewBoxWidth, X, Y} from "./NetworkProps";
import "../assets/fonts/massallera.TTF";
import {finishExperiment, finishTracking, initTracking, registerElement} from "../../scriptTest2";
import {useExerciseProgressUpdater} from "../../hooks/useExerciseProgressUpdater";
import {usePlayAudio} from "../../hooks/usePlayAudio";
import {HAPPY_SPEAKING, NEUTRAL, NEUTRAL_SPEAKING, WORRIED_SPEAKING} from "../Avatar";
import {useAvatar} from "../AvatarContext";
import {getNextExercise} from '../../services/getNextExercise';
import {TRAINING_MODES} from "../../Globals";
import {executeWithProbability} from "../../services/executeWithProbability";
import GifComponent from "../GifComponent";

let DnDPhase2 = () => {

    let {trainingMode} = useParams();

    let playAudio = usePlayAudio();

    const INITIAL_ELEMENT = 0;

    let {setExercise, feedback, setFeedback, exercise} = useSession();
    const updateExerciseProgress = useExerciseProgressUpdater();

    let exerciseNodes = nodes(exercise);

    useEffect(() => {
        exerciseNodes.forEach((node) => {
            registerElement(`${exercise.title}_${exercise.representation}_${exercise.networkType}.phase2`, 1, document.getElementById(node.id));
        })
        initTracking(`${exercise.title}_${exercise.representation}_${exercise.networkType}.phase2`);
    }, []);

    useEffect(() => {
        if (feedback?.phase2?.elapsedTime) {
            saveFeedback(feedback);
        }
    }, [feedback]);

    useEffect(() => {
            // Reproducir las tres frases solo si no hemos llegado a 3 accesos
            let phrases = [
                "¡Muy bien! Has completado la red, ahora vamos a volver al mensaje ¡arrastra los elementos!",
                "¡Buen trabajo! Volvamos a colocar los elementos del mensaje",
                "¡Bien hecho! ¡Arrastra ahora los elementos de la red al mensaje!",
            ]
            let index = Math.floor(Math.random() * phrases.length) + 1;

            changeEmotionSequence([{
                emotionDuring: NEUTRAL_SPEAKING,
                emotionAfter: NEUTRAL,
                text: phrases[index],
                audio: `dnd2-intro${index}`,
                afterDelay: 500
            }]);
    }, []);

    let startTime = useRef(Date.now());

    let navigate = useNavigate();
    let [element, setElement] = useState();

    const INITIAL_EXTENDED_NODES = [{...exerciseNodes[0], order: 0, id: "1-1"}, {
        ...exerciseNodes[0],
        order: 1,
        id: "1-2"
    }, ...exerciseNodes.slice(1, 3), {
        ...exerciseNodes[5],
        order: 4,
        id: "6-2",
        type: "type6-2",
        src: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/8289`,
        bigStop: true
    }, {...exerciseNodes[0], order: 5, id: "1-3"}, ...exerciseNodes.slice(3, 5), ...exerciseNodes.slice(6), {
        ...exerciseNodes[5],
        order: exerciseNodes.length + 2,
        id: "6-3",
        type: "type6-3",
        posX: nexusX(exercise?.networkType) + stopX(exercise?.networkType),
        src: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/8289`,
        bigStop: true
    }];

    let {changeEmotionSequence} = useAvatar();

    let [extendedNodes, setExtendedNodes] = useState(INITIAL_EXTENDED_NODES);

    let [droppableNodes, setDroppableNodes] = useState(JSON.parse(JSON.stringify(INITIAL_EXTENDED_NODES)));
    let [current, setCurrent] = useState(INITIAL_ELEMENT);
    let [timer, setTimer] = useState(undefined);
    let [countErrors, setCountErrors] = useState(0);
    let [showGif, setShowGif] = useState(false);
    let [placedCount, setPlacedCount] = useState({});

    let saveFeedback = async (feedback) => {

        try {
            await fetch(`${process.env.REACT_APP_EXERCISES_SERVICE_URL}/statistics`, {
                method: "POST", headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }, body: JSON.stringify({feedback})
            });
        } catch (e) {

        }
    };

    let handleDragStart = (event) => {
        let {active} = event;
        setElement(active);
        extendedNodes.map((element) => {
            if (element.id === active.id) {
                if (element.order !== current) {
                    setCountErrors(countErrors + 1);
                    if (countErrors < 2) {
                        changeEmotionSequence([{
                            emotionDuring: NEUTRAL,
                            emotionAfter: NEUTRAL,
                            text: "",
                            audio: `error`,
                            afterDelay: 500
                        }]);
                    } else {
                        if ([0, 1, 5].includes(current)) {
                            let phrases = [
                                "Todos nos equivocamos. Yo te ayudo. Debes colocar el título en el rectángulo",
                                "¡No pasa nada! ¡Yo también me equivoco! Recuerda que siempre volvemos al título",
                                "¡Vaya! Estamos aprendiendo y lo estás haciendo muy bien. Equivocarse también es aprender. Recuerda que es importante volver al título. Debes colocar el título en el rectángulo",
                            ]
                            let index = Math.floor(Math.random() * phrases.length) + 1;

                            changeEmotionSequence([{
                                emotionDuring: WORRIED_SPEAKING,
                                emotionAfter: NEUTRAL,
                                text: phrases[index],
                                audio: `rect-order${index}`,
                                onEnd: () => {
                                    setCountErrors(0)
                                },
                                afterDelay: 500
                            }]);
                        } else if ([4, 8, 10, 12].includes(current)) {
                            let phrases = [
                                "¡Vaya! Recuerda parar colocando el STOP antes de ir al otro lado de la red",
                                "Te has olvidado de algo… a mí, a veces, también me pasa. Recuerda que debemos parar antes de ir al otro lado de la red",
                                "¡Ups! Equivocarse es normal, nos ayuda a aprender. Tienes que colocar el STOP en su lugar antes de ir al otro lado de la red",
                            ]
                            let index = Math.floor(Math.random() * phrases.length) + 1;

                            changeEmotionSequence([{
                                emotionDuring: WORRIED_SPEAKING,
                                emotionAfter: NEUTRAL,
                                text: phrases[index],
                                audio: `stop-order${index}`,
                                onEnd: () => {
                                    setCountErrors(0)
                                },
                                afterDelay: 500
                            }]);
                        } else {
                            let phrases = [
                                "No pasa nada, es normal cometer errores.",
                                "Todos nos equivocamos. Lo importante es que te estás esforzando.",
                                "Vaya, parece que no tocaba mover este elemento ahora. No tiene que salirte bien siempre, vamos a seguir intentándolo.",
                            ]
                            let index = Math.floor(Math.random() * phrases.length) + 1;

                            changeEmotionSequence([{
                                emotionDuring: WORRIED_SPEAKING,
                                emotionAfter: NEUTRAL,
                                text: phrases[index],
                                audio: `incorrect-order${index}`,
                                afterDelay: 500
                            }, {
                                emotionDuring: WORRIED_SPEAKING,
                                emotionAfter: NEUTRAL,
                                text: "Piensa, ¿qué elemento tienes que mover ahora a la red?",
                                audio: `incorrect-order-end`,
                                onEnd: () => {
                                    setCountErrors(0)
                                },
                                afterDelay: 500
                            }]);
                        }
                    }
                } else {
                    playAudio(`${extendedNodes.find((node) => node.type === active.data.current.type).sound}`);
                }
            }
        });
    };

    let handleDragEnd = (event) => {
        let {active, over} = event;
        let node = null;
        let correct = false;
        let sintactic = element.data.current.stop || element.data.current.bigStop;
        let semantic = element.data.current.nexus;
        if (over) {
            if (over.data.current.accepts.includes(active.data.current.type)) {
                let updated = extendedNodes.map((element) => {
                    if (element.id === active.id) {
                        if (element.order === current) {
                            element.ok = true;
                            node = element;
                            setCurrent(current + 1);
                            correct = true;

                            // Incrementar el contador de veces que ha sido colocado este elemento
                            setPlacedCount(prev => ({
                                ...prev,
                                [active.id]: (prev[active.id] || 0) + 1
                            }));
                            if (current === 0) {
                                let phrases = [
                                    "Bien hecho! Ese es el título y es muy importante",
                                    "¡Eso es! Debemos colocar el título en primer lugar",
                                    "¡Muy bien! Has colocado el título en el sitio correcto",
                                ]
                                let index = Math.floor(Math.random() * phrases.length) + 1;

                                executeWithProbability(() => {
                                    changeEmotionSequence([{
                                        emotionDuring: WORRIED_SPEAKING,
                                        emotionAfter: NEUTRAL,
                                        text: phrases[index],
                                        audio: `p2-rect1-${index}`,
                                                              afterDelay: 500
                                                              }])
                                });
                            }
                            if (current === 1) {
                                let phrases = [
                                    "¡Eso es! Tenemos que decir de qué vamos a hablar",
                                    "¡Muy bien! Tenemos que decir de qué vamos a hablar",
                                    "¡Exacto! Lo primero es decir de qué vamos a hablar",
                                ]
                                let index = Math.floor(Math.random() * phrases.length) + 1;

                                executeWithProbability(() => {
                                    changeEmotionSequence([{
                                        emotionDuring: WORRIED_SPEAKING,
                                        emotionAfter: NEUTRAL,
                                        text: phrases[index],
                                        audio: `p2-rect2-${index}`,
                                                              afterDelay: 500
                                                              }])
                                });
                            }
                            if ([2, 6].includes(current)) {
                                let phrases = [
                                    "¡Fantástico! Hay que relacionar las ideas",
                                    "¡Eso es! Relacionamos la información con los enlaces",
                                    "¡Muy bien! El enlace nos ayuda a relacionar la información",

                                ]
                                let index = Math.floor(Math.random() * phrases.length) + 1;

                                executeWithProbability(() => {
                                changeEmotionSequence([{
                                        emotionDuring: WORRIED_SPEAKING,
                                        emotionAfter: NEUTRAL,
                                        text: phrases[index],
                                        audio: `p2-nexus-${index}`,
                                                              afterDelay: 500
                                                              }])
                                });
                            }
                            if ([3, 7, 9, 11].includes(current)) {
                                let phrases = [
                                    "¡Muy bien! Has dicho algo sobre ese contenido",
                                    "¡Bien hecho! Ahora nos tocaba decir algo sobre este contenido",
                                    "¡Eso es! Tocaba decir algo importante sobre este contenido.",
                                ]
                                let index = Math.floor(Math.random() * phrases.length) + 1;

                                executeWithProbability(() => {
                                    changeEmotionSequence([{
                                        emotionDuring: WORRIED_SPEAKING,
                                        emotionAfter: NEUTRAL,
                                        text: phrases[index],
                                        audio: `p2-content-${index}`,
                                                              afterDelay: 500
                                                              }])
                                });
                            }
                            if ([4, 8, 10, 12].includes(current) && node?.id !== "6-3") {
                                let phrases = [
                                    "¡Eso es! Debemos pararnos antes de seguir diciendo cosas sobre este contenido",
                                    "¡Muy bien! Hay que parar después de decir cosas importantes",
                                    "¡Exacto! Hacemos una parada después de lo importante",
                                ]
                                let index = Math.floor(Math.random() * phrases.length) + 1;

                                executeWithProbability(() => {
                                    changeEmotionSequence([{
                                        emotionDuring: WORRIED_SPEAKING,
                                        emotionAfter: NEUTRAL,
                                        text: phrases[index],
                                        audio: `p2-stop-${index}`,
                                                              afterDelay: 500
                                                              }])
                                });
                            }
                            if (current === 5) {
                                let phrases = [
                                    "¡Estás trabajando muy bien! Cuando queremos seguir hablando de algo, debemos decir primero sobre qué.",
                                    "¡Fantástico! Siempre volvemos a decir de qué estamos hablando",
                                    "¡Muy bien hecho! Debemos recordar de qué estamos hablando.",
                                ]
                                let index = Math.floor(Math.random() * phrases.length) + 1;

                                executeWithProbability(() => {
                                    changeEmotionSequence([{
                                        emotionDuring: WORRIED_SPEAKING,
                                        emotionAfter: NEUTRAL,
                                        text: phrases[index],
                                        audio: `p2-rect3-${index}`,
                                                              afterDelay: 500
                                                              }])
                                });
                            }
                        } else {
                            setFeedback({
                                phase1: {...feedback.phase1}, phase2: sintactic ? {
                                    ...feedback.phase2,

                                    incorrectOrderSintactic: feedback?.phase2?.incorrectOrderSintactic == null ? 1 : feedback?.phase2?.incorrectOrderSintactic + 1
                                } : semantic ? {
                                    ...feedback.phase2,
                                    incorrectOrderSemantic: feedback?.phase2?.incorrectOrderSemantic == null ? 1 : feedback?.phase2?.incorrectOrderSemantic + 1
                                } : {
                                    ...feedback.phase2,
                                    incorrectOrderLexical: feedback?.phase2?.incorrectOrderLexical == null ? 1 : feedback?.phase2?.incorrectOrderLexical + 1
                                }
                            });
                            setCountErrors(countErrors + 1);
                        }
                    }
                    return element;
                });
                setExtendedNodes(updated);
                correct && setDroppableNodes(updated);
            } else {
                setFeedback({
                    phase1: {...feedback.phase1}, phase2: sintactic ? {
                        ...feedback.phase2,

                        incorrectPosSintactic: feedback?.phase2?.incorrectPosSintactic == null ? 1 : feedback?.phase2?.incorrectPosSintactic + 1
                    } : semantic ? {
                        ...feedback.phase2,
                        incorrectPosSemantic: feedback?.phase2?.incorrectPosSemantic == null ? 1 : feedback?.phase2?.incorrectPosSemantic + 1
                    } : {
                        ...feedback.phase2,
                        incorrectPosLexical: feedback?.phase2?.incorrectPosLexical == null ? 1 : feedback?.phase2?.incorrectPosLexical + 1
                    }
                });
                setCountErrors(countErrors + 1);
                if (countErrors < 2) {
                    changeEmotionSequence([{
                        emotionDuring: WORRIED_SPEAKING,
                        emotionAfter: NEUTRAL,
                        text: "",
                        audio: `error`,
                        afterDelay: 500
                    }]);
                } else {
                    let phrases = [
                        "¡Ups! No pasa nada. Piensa, ¿dónde debo colocar este elemento?",
                        "Vaya, a veces nos equivocamos, es normal. Piensa, ¿cuál es el lugar en el que hay que colocar este elemento?",
                        "Parece que este no es el sitio correcto. Te estás esforzando y eso es lo importante. Sigue así y piensa, ¿dónde debes colocar este elemento?",
                    ]
                    let index = Math.floor(Math.random() * phrases.length) + 1;

                    changeEmotionSequence([{
                        emotionDuring: WORRIED_SPEAKING,
                        emotionAfter: NEUTRAL,
                        text: phrases[index],
                        audio: `incorrect-pos${index}`,
                        afterDelay: 500
                    }]);
                }
            }
        } else {
            setFeedback({
                phase1: {...feedback.phase1}, phase2: sintactic ? {
                    ...feedback.phase2,

                    outOfBoundsSintactic: feedback?.phase2?.outOfBoundsSintactic == null ? 1 : feedback?.phase2?.outOfBoundsSintactic + 1
                } : semantic ? {
                    ...feedback.phase2,
                    outOfBoundsSemantic: feedback?.phase2?.outOfBoundsSemantic == null ? 1 : feedback?.phase2?.outOfBoundsSemantic + 1
                } : {
                    ...feedback.phase2,
                    outOfBoundsLexical: feedback?.phase2?.outOfBoundsLexical == null ? 1 : feedback?.phase2?.outOfBoundsLexical + 1
                }
            });
        }

        if (node?.id === "6-3") {
            let endTime = Date.now();
            setFeedback({
                phase1: {...feedback.phase1},
                phase2: {
                    ...feedback.phase2, elapsedTime: (endTime - startTime.current) / 1000
                },
                title: exercise.title,
                representation: exercise.representation,
                networkType: exercise.networkType,
                trainingMode: trainingMode,
                date: Date.now()
            });
            let phrases = [
                "Has hecho un gran trabajo! ¡Te has esforzado mucho!",
                "¡Buen trabajo! ¡Es genial trabajar contigo!",
                "¡Muy bien hecho! ¡Has organizado muy bien la información!",
            ]
            let index = Math.floor(Math.random() * phrases.length) + 1;

            changeEmotionSequence([{
                emotionDuring: HAPPY_SPEAKING,
                emotionAfter: NEUTRAL,
                text: phrases[index],
                audio: `p2-end-${index}`,
                afterDelay: 0
            }]);
            setShowGif(true);
            setTimer(setTimeout(() => {
                setShowGif(false);
                finishExperiment();
                finishTracking("/students/exercises");
                updateExerciseProgress(exercise.index).then(() => {
                    if (trainingMode.toUpperCase() === TRAINING_MODES.RULED) {
                        getNextExercise(exercise.index).then((nextExercise) => {
                            if (nextExercise) {
                                setExercise(nextExercise);
                                navigate(`/exerciseDnD/phase1/ruled`);
                            } else {
                                // Fin de la secuencia guiada
                                navigate(`/students/exercises/${trainingMode}`);
                            }
                        });
                    } else {
                        navigate(`/students/exercises/${trainingMode}`);
                    }
                });

            }, 4500));
        }
        setElement(null);
    };

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    const getImagePosition = (x, y, nexus, stop, bigStop, shape) => {
        if (nexus) {
            return {x: "1.5vmax", y: "0.6vmax", width: 80, height: 40};
        }
        if (stop) {
            return {x: "0vmax", y: "0vmax", width: "2vmax", height: "2vmax"};
        }
        if (bigStop) {
            return {x: "0vmax", y: "0vmax", width: "3vmax", height: "3vmax"};
        }
        if (shape === "ellipse") {
            return {x: 30, y: 0, width: "55", height: "55"};
        }
        return {x: 38, y: 2, width: "55", height: "55"};
    };

    const getTextPosition = (x, y, bigStop, stop, shape, text, src) => {

        if (!src) {
            if (shape === "ellipse") {
                return {x: 60, y: 45, fontSize: "13"};
            }
            if (shape === "rect") {
                return {x: 60, y: 45, fontSize: "13"};
            }
            if (text === "and") {
                return {x: "1vmax", y: "2vmax", fontSize: "1.3vmax"};
            }
            if (stop) {
                return {x: "1vmax", y: "2vmax", fontSize: "2vmax"};
            }
            return {x: "4.2vmax", y: "2vmax", fontSize: "1.2vmax"};
        }

        if (text === "and") {
            return {x: "3.3vmax", y: "2vmax", fontSize: "1.3vmax"};
        }
        if (stop) {
            return {x: "3vmax", y: "2vmax", fontSize: "2vmax"};
        }
        if (bigStop) {
            return {x: "3.5vmax", y: "3vmax", fontSize: "3vmax"};
        }
        if (shape === "ellipse") {
            return {x: 60, y: 65, fontSize: "12"};
        }
        if (shape === "rect") {
            return {x: 60, y: 68, fontSize: "13"};
        }
        return {x: "4.2vmax", y: "4vmax", fontSize: "1.2vmax"};
    };

    let strokeColor = () => {
        switch (element?.data.current?.type) {
            case "type5":
                return "black";
            case "type8":
                return "black";
            case "type10":
                return "black";
            default:
                return "black";
        }
    };

    let getDragElement = () => {
        if (!element?.data.current) return null;

        if (element.data.current.nexus) {
            return (<g>
                    {element.data.current.src && <image
                        href={element.data.current.src} {...getImagePosition(element.data.current.x, element.data.current.y, element.data.current.nexus, element.data.current.stop, element.data.current.bigStop, element.data.current.shape)} />}
                    <text {...getTextPosition(element.data.current.x, element.data.current.y, element.data.current.bigStop, element.data.current.stop, element.data.current.shape, element.data.current.text, element.data.current.src)}
                          fill="black" textAnchor="middle" fontFamily="Massallera">
                        {element.data.current.text}
                    </text>
                </g>);
        }
        if (element.data.current.shape === "rect") {
            return (<g>
                    <rect width="120" height="75" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)" strokeWidth="3"/>
                    <image
                        href={element.data.current.src} {...getImagePosition(element.data.current.x, element.data.current.y, element.data.current.nexus, element.data.current.stop, element.data.current.bigStop, element.data.current.shape)} />
                    <text {...getTextPosition(element.data.current.x, element.data.current.y, element.data.current.bigStop, element.data.current.stop, element.data.current.shape, element.data.current.text, element.data.current.src)}
                          fill="black" textAnchor="middle" fontFamily="Massallera">
                        {element.data.current.text}
                    </text>
                </g>);
        }
        if (element.data.current.shape === "ellipse") {
            return (<g>
                    <ellipse
                        cx="60"
                        cy="40"
                        rx="60"
                        ry="40"
                        fill="white"
                        stroke={strokeColor()}
                        strokeWidth="3"
                    />
                    <image
                        href={element.data.current.src} {...getImagePosition(element.data.current.x, element.data.current.y, element.data.current.nexus, element.data.current.stop, element.data.current.bigStop, element.data.current.shape)} />
                    <text {...getTextPosition(element.data.current.x, element.data.current.y, element.data.current.bigStop, element.data.current.stop, element.data.current.shape, element.data.current.text, element.data.current.src)}
                          fill="black" textAnchor="middle" fontFamily="Massallera">
                        {element.data.current.text}
                    </text>
                </g>);
        }
        if (element.data.current.stop) {
            return (<g>
                    <image
                        href={element.data.current.src} {...getImagePosition(element.data.current.x, element.data.current.y, element.data.current.nexus, element.data.current.stop, element.data.current.bigStop, element.data.current.shape)} />
                    <text {...getTextPosition(element.data.current.x, element.data.current.y, element.data.current.bigStop, element.data.current.stop, element.data.current.shape, element.data.current.text, element.data.current.src)}
                          fill="black" textAnchor="middle" fontFamily="Massallera">
                        {element.data.current.text}
                    </text>
                </g>);
        }
        if (element.data.current.bigStop) {
            return (<g>
                    <image
                        href={element.data.current.src} {...getImagePosition(element.data.current.x, element.data.current.y, element.data.current.nexus, element.data.current.stop, element.data.current.bigStop, element.data.current.shape)} />
                    <text {...getTextPosition(element.data.current.x, element.data.current.y, element.data.current.bigStop, element.data.current.stop, element.data.current.shape, element.data.current.text, element.data.current.src)}
                          fill="black" textAnchor="middle" fontFamily="Massallera">
                        {element.data.current.text}
                    </text>
                </g>);
        }
    };

    let pathRect = (exercise) => {
        if ("I-I" === exercise?.networkType) {
            return "220";
        }
        if ("I-II" === exercise?.networkType) {
            return "310";
        }
        if ("I-III" === exercise?.networkType) {
            return "460";
        }
    };

    return (<Card style={{height: "53vmax", width: "95%"}}>
            <div style={{position: "absolute", top: "10px", right: "10px"}}>
                <ReloadOutlined style={{fontSize: "45px", cursor: "pointer"}} onClick={() => {
                    setExercise(exercise);
                    setExtendedNodes(INITIAL_EXTENDED_NODES);
                    setDroppableNodes(INITIAL_EXTENDED_NODES);
                    startTime.current = Date.now();
                    setCurrent(INITIAL_ELEMENT);
                    setFeedback({phase1: {...feedback.phase1}});
                    setPlacedCount({});
                }}/>
                <HomeOutlined style={{fontSize: "45px", cursor: "pointer", paddingLeft: "20px"}} onClick={() => {
                    setExercise(undefined);
                    setExtendedNodes(undefined);
                    setDroppableNodes(undefined);
                    startTime.current = undefined;
                    setCurrent(undefined);
                    setFeedback(undefined);
                    clearTimeout(timer);
                    navigate(`/students/exercises/${trainingMode}`);
                }}/>
            </div>
            <Flex align="center" vertical>
                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}
                            autoScroll={false}>
                    <Flex align="center" justify="center">
                        <svg height="20vmax" viewBox={`-2 -2 ${viewBoxWidth(exercise?.networkType)} 250`}>
                            <path
                                d={`M ${pathRect(exercise)} 70 L ${pathRect(exercise)} 85 ${pathTop(exercise?.networkType)}`}
                                fill="none" stroke="black"
                                strokeWidth="3"/>
                            <path d={`M ${pathRect(exercise)} 70 L ${pathRect(exercise)} 85 L 60 85 L 60 95`}
                                  fill="none" stroke="rgb(0, 0, 0)" strokeWidth="3"/>
                            <path d="M 60 150 L 60 165" fill="none" stroke="rgb(0, 0, 0)" strokeWidth="3"/>
                            <path d={`M 350 165 ${pathBottom(exercise?.networkType)}`} fill="none" stroke="black"
                                  strokeWidth="3"/>
                            {["I-II", "I-III"].includes(exercise?.networkType) && <path
                                d={pathBottom2(exercise?.networkType)}
                                fill="none"
                                stroke="black"
                                strokeWidth="3"
                            />}

                            {exercise?.networkType === "I-III" && <path
                                d="M 570 145 L 570 150 L 790 150 L 790 165"
                                fill="none"
                                stroke="black"
                                strokeWidth="3"
                            />}

                            {extendedNodes.slice().sort((a, b) => b.order - a.order).filter((element) => {
                                // El elemento con order 5 solo es visible cuando current >= 5 (después de colocar order 4)
                                if (element.order === 5) {
                                    return current >= 5;
                                }

                                // Si el elemento ha sido colocado 2 veces, ocultarlo a menos que sea su turno de nuevo
                                const placementCount = placedCount[element.id] || 0;
                                if (placementCount >= 2) {
                                    const expectedReturnPosition = element.order + 5;
                                    return current === expectedReturnPosition;
                                }

                                // Todos los demás elementos están siempre visibles
                                return true;
                            }).map((element) => <DraggablePhase2
                                key={element.id}
                                id={element.id}
                                type={element.type}
                                x={X + element.posX}
                                y={Y + element.posY}
                                ok={element.ok}
                                src={element.src}
                                text={element.text}
                                stop={element.stop}
                                bigStop={element.bigStop}
                                nexus={element.nexus}
                                shape={element.shape}
                            />)}
                        </svg>
                        <DragOverlay>
                            {element?.id ? <svg viewBox={element?.data.current.shape ? `-2 -2 125 125` : null}>
                                {getDragElement()}
                            </svg> : null}
                        </DragOverlay>
                    </Flex>
                    <Divider style={{backgroundColor: "grey"}}/>
                    <Flex align="start" vertical style={{padding: "1vmax 0vmax 5vh"}}>
                        <Row>
                            <Col>
                                <DroppablePhase2
                                    id={droppableNodes[0].id}
                                    type={droppableNodes[0].type}
                                    x={X + droppableNodes[0].posX}
                                    y={Y + droppableNodes[0].posY}
                                    ok={droppableNodes[0].ok}
                                    src={droppableNodes[0].src}
                                    text={droppableNodes[0].text}
                                    shape={droppableNodes[0].shape}
                                />
                            </Col>
                        </Row>
                        <Row>
                            {droppableNodes.slice(1, 5)
                                .map((element) => (<Col key={element.id} style={{paddingRight: "0.5vmax"}}>
                                        <DroppablePhase2
                                            id={element.id}
                                            type={element.type}
                                            x={X + element.posX}
                                            y={Y + element.posY}
                                            ok={element.ok}
                                            src={element.src}
                                            text={element.text}
                                            shape={element.shape}
                                            stop={element.stop}
                                            bigStop={element.bigStop}
                                            nexus={element.nexus}
                                        />
                                    </Col>))}
                        </Row>
                        <Row>
                            {droppableNodes.slice(5)
                                .map((element) => (<Col key={element.id} style={{paddingRight: "0.5vmax"}}>
                                        <DroppablePhase2
                                            id={element.id}
                                            type={element.type}
                                            x={X + element.posX}
                                            y={Y + element.posY}
                                            ok={element.ok}
                                            src={element.src}
                                            text={element.text}
                                            shape={element.shape}
                                            stop={element.stop}
                                            bigStop={element.bigStop}
                                            nexus={element.nexus}
                                        />
                                    </Col>))}
                        </Row>
                    </Flex>
                </DndContext>
            </Flex>
        <GifComponent show={showGif}/>
        </Card>);
};

export default DnDPhase2;
