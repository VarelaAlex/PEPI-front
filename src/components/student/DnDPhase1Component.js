import {HomeOutlined, ReloadOutlined} from "@ant-design/icons";
import {DndContext, MouseSensor, TouchSensor, useSensor, useSensors} from "@dnd-kit/core";
import {Card, Col, Divider, Flex, Row} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {usePlayAudio} from "../../hooks/usePlayAudio";
import {finishTracking, initTracking, registerElement} from "../../scriptTest2";
import {useSession} from "../SessionComponent";
import DraggablePhase1 from "./DraggablePhase1Component";
import DroppablePhase1 from "./DroppablePhase1Component";
import {nexusX, nodes, pathBottom, pathBottom2, pathTop, STOP, stopX, viewBoxWidth, X, Y} from "./NetworkProps";
import {useAvatar} from "../AvatarContext";
import {HAPPY_SPEAKING, NEUTRAL, WORRIED_SPEAKING} from "../Avatar";
import {executeWithProbability} from "../../services/executeWithProbability";
import GifComponent from "../GifComponent";

let DnDPhase1 = () => {

    let {trainingMode} = useParams();

    let {changeEmotionSequence} = useAvatar();

    const INITIAL_ELEMENT = 0;
    let {setExercise, exercise, feedback, setFeedback} = useSession();
    let exerciseNodes = nodes(exercise);
    let [countErrors, setCountErrors] = useState(0);

    let playAudio = usePlayAudio();

    useEffect(() => {
        exerciseNodes.forEach((node) => {
            registerElement(`${exercise.title}_${exercise.representation}_${exercise.networkType}.phase1`, node.id, document.getElementById(node.id));
        })
        initTracking(`${exercise.title}_${exercise.representation}_${exercise.networkType}.phase1`);

        // Function to scroll the page
        const hideHeader = () => {
            window.scrollTo({
                top: 100, // Adjust this value to match your header's height
                behavior: "smooth" // Smooth scrolling effect
            });
        };

        // Scroll on component mount
        hideHeader();
    }, []);

    let startTime = useRef(Date.now());

    let navigate = useNavigate();

    const INITIAL_EXTENDED_NODES = [{...exerciseNodes[0], order: 0, id: "1-1"}, {
        ...exerciseNodes[0],
        order: 1,
        id: "1-2"
    }, ...exerciseNodes.slice(1, 3), {
        ...exerciseNodes[5],
        order: 4,
        id: "6-2",
        type: "type6-2",
        src: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`,
        bigStop: true
    }, {...exerciseNodes[0], order: 5, id: "1-3"}, ...exerciseNodes.slice(3, 5), ...exerciseNodes.slice(6), {
        ...exerciseNodes[5],
        order: exerciseNodes.length + 2,
        id: "6-3",
        type: "type6-3",
        posX: nexusX(exercise?.networkType) + stopX(exercise?.networkType),
        src: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`,
        bigStop: true
    }];

    let [element, setElement] = useState();
    let [extendedNodes, setExtendedNodes] = useState(INITIAL_EXTENDED_NODES);
    let [timer, setTimer] = useState(undefined);
    let [showGif, setShowGif] = useState(false);

    let [droppableNodes, setDroppableNodes] = useState(JSON.parse(JSON.stringify(INITIAL_EXTENDED_NODES)));
    let [current, setCurrent] = useState(INITIAL_ELEMENT);

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
                                onEnd: ()=>{setCountErrors(0)},
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
                                onEnd: ()=>{setCountErrors(0)},
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
                                onEnd: ()=>{setCountErrors(0)},
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
        let semantic = element.data.current.type === "type2" || element.data.current.type === "type4";
        if (over) {
            if (over.data.current.accepts.includes(active.data.current.type)) {
                let updated = extendedNodes.map((element) => {
                    if (element.id === active.id) {
                        if (element.order === current) {
                            element.ok = true;
                            node = element;
                            setCurrent(current + 1);
                            correct = true;
                            if(current === 0) {
                                let phrases = [
                                    "¡Bien hecho! El título es muy importante, se coloca en el rectángulo",
                                    "¡Eso es! El título se coloca en el rectángulo",
                                    "¡Muy bien! Has colocado el título en el sitio correcto, en el rectángulo",
                                ]
                                let index = Math.floor(Math.random() * phrases.length) + 1;

                                executeWithProbability(() => {
                                    changeEmotionSequence([{
                                        emotionDuring: WORRIED_SPEAKING,
                                        emotionAfter: NEUTRAL,
                                        text: phrases[index],
                                        audio: `p1-rect1-${index}`,
                                                              afterDelay: 500
                                                              }])
                                });
                            }
                            if(current === 1) {
                                let phrases = [
                                    "¡Eso es! Vamos a seguir hablando de este contenido, tenemos que volver a colocar el título",
                                    "¡Muy bien! Tenemos que recordar de qué vamos a hablar",
                                    "¡Exacto! Siempre volvemos al título",
                                ]
                                let index = Math.floor(Math.random() * phrases.length) + 1;

                                executeWithProbability(() => {
                                    changeEmotionSequence([{
                                        emotionDuring: WORRIED_SPEAKING,
                                        emotionAfter: NEUTRAL,
                                        text: phrases[index],
                                        audio: `p1-rect2-${index}`,
                                                              afterDelay: 500
                                                              }])
                                });
                            }
                            if([2, 6].includes(current)) {
                                let phrases = [
                                    "¡Muy bien! Aquí es donde se colocan los enlaces para relacionar la información importante.",
                                    "¡Bravo! Los enlaces son muy importantes",
                                    "¡Eso es! Debemos colocar los enlaces y así relacionar la información.",
                                ]
                                let index = Math.floor(Math.random() * phrases.length) + 1;

                                executeWithProbability(() => {
                                    changeEmotionSequence([{
                                        emotionDuring: WORRIED_SPEAKING,
                                        emotionAfter: NEUTRAL,
                                        text: phrases[index],
                                        audio: `p1-nexus-${index}`,
                                                              afterDelay: 500
                                                              }])
                                });
                            }
                            if([3, 7, 9, 11].includes(current)) {
                                let phrases = [
                                    "¡Fantástico! Lo importante lo ponemos en los bolos",
                                    "¡Muy bien! La información importante va en los bolos",
                                    "¡Eso es! Bien hecho",
                                ]
                                let index = Math.floor(Math.random() * phrases.length) + 1;

                                executeWithProbability(() => {
                                    changeEmotionSequence([{
                                        emotionDuring: WORRIED_SPEAKING,
                                        emotionAfter: NEUTRAL,
                                        text: phrases[index],
                                        audio: `p1-content-${index}`,
                                                              afterDelay: 500
                                                              }])
                                });
                            }
                            if([4, 8, 10, 12].includes(current) && (node?.id !== "6-3" || node?.order !== current)) {
                                let phrases = [
                                    "¡Muy bien! Cuando terminamos de decir cosas importantes nos paramos",
                                    "¡Eso es! Nos paramos cuando terminamos de decir lo importante",
                                    "¡Bien hecho! Tenemos que parar después de decir cosas importantes.",
                                ]
                                let index = Math.floor(Math.random() * phrases.length) + 1;

                                executeWithProbability(() => {
                                    changeEmotionSequence([{
                                        emotionDuring: WORRIED_SPEAKING,
                                        emotionAfter: NEUTRAL,
                                        text: phrases[index],
                                        audio: `p1-stop-${index}`,
                                                              afterDelay: 500
                                                              }])
                                });
                            }
                            if(current === 5) {
                                let phrases = [
                                    "¡Bien hecho! Debemos volver al título para seguir hablando de este contenido",
                                    "¡Muy bien! Volvemos al título para recordar de qué estamos hablando",
                                    "¡Eso es! Siempre volvemos al título.",
                                ]
                                let index = Math.floor(Math.random() * phrases.length) + 1;

                                executeWithProbability(() => {
                                    changeEmotionSequence([{
                                        emotionDuring: WORRIED_SPEAKING,
                                        emotionAfter: NEUTRAL,
                                        text: phrases[index],
                                        audio: `p1-rect3-${index}`,
                                                              afterDelay: 500
                                                              }])
                                });
                            }
                        } else {
                            setFeedback({
                                phase1: sintactic ? {
                                    ...feedback.phase1,
                                    incorrectOrderSintactic: feedback?.phase1?.incorrectOrderSintactic == null ? 1 : feedback?.phase1?.incorrectOrderSintactic + 1
                                } : semantic ? {
                                    ...feedback.phase1,
                                    incorrectOrderSemantic: feedback?.phase1?.incorrectOrderSemantic == null ? 1 : feedback?.phase1?.incorrectOrderSemantic + 1
                                } : {
                                    ...feedback.phase1,
                                    incorrectOrderLexical: feedback?.phase1?.incorrectOrderLexical == null ? 1 : feedback?.phase1?.incorrectOrderLexical + 1
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
                    phase1: sintactic ? {
                        ...feedback.phase1,

                        incorrectPosSintactic: feedback?.phase1?.incorrectPosSintactic == null ? 1 : feedback?.phase1?.incorrectPosSintactic + 1
                    } : semantic ? {
                        ...feedback.phase1,
                        incorrectPosSemantic: feedback?.phase1?.incorrectPosSemantic == null ? 1 : feedback?.phase1?.incorrectPosSemantic + 1
                    } : {
                        ...feedback.phase1,
                        incorrectPosLexical: feedback?.phase1?.incorrectPosLexical == null ? 1 : feedback?.phase1?.incorrectPosLexical + 1
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
                        onEnd: ()=>{setCountErrors(0)},
                        afterDelay: 500
                    }]);
                }
            }
        } else {
            setFeedback({
                phase1: sintactic ? {
                    ...feedback.phase1,
                    outOfBoundsSintactic: feedback?.phase1?.outOfBoundsSintactic == null ? 1 : feedback?.phase1?.outOfBoundsSintactic + 1
                } : semantic ? {
                    ...feedback.phase1,
                    outOfBoundsSemantic: feedback?.phase1?.outOfBoundsSemantic == null ? 1 : feedback?.phase1?.outOfBoundsSemantic + 1
                } : {
                    ...feedback.phase1,
                    outOfBoundsLexical: feedback?.phase1?.outOfBoundsLexical == null ? 1 : feedback?.phase1?.outOfBoundsLexical + 1
                }
            });
        }

        if (["1-1", "6-2"].includes(node?.id) && node?.order === current) {
            setTimeout(() => {
                setDroppableNodes(droppableNodes.map(node => node.type === "type1" ? {...node, ok: false} : node));
            }, 500);
        }

        if (node?.id === "6-3" && node?.order === current) {
            let endTime = Date.now();
            setFeedback({
                phase1: {
                    ...feedback.phase1, elapsedTime: (endTime - startTime.current) / 1000
                }
            });
            let phrases = [
                "¡Has hecho un gran trabajo!",
                "¡Muy bien hecho! ¡Enhorabuena!",
                "¡Buen trabajo! ¡Lo has hecho fenomenal!",
            ]
            let index = Math.floor(Math.random() * phrases.length) + 1;

            changeEmotionSequence([{
                emotionDuring: HAPPY_SPEAKING,
                emotionAfter: NEUTRAL,
                text: phrases[index],
                audio: `p1-end-${index}`,
                afterDelay: 0
            }]);
            setShowGif(true);
            setTimer(setTimeout(() => {
                setShowGif(false);
                finishTracking("/exerciseDnD/phase2");
                navigate(`/exerciseDnD/phase2/${trainingMode}`);
            }, 4500));
        }
    };

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

    let rectX = (exercise) => {
        if ("I-I" === exercise?.networkType) {
            return "160";
        }
        if ("I-II" === exercise?.networkType) {
            return "250";
        }
        if ("I-III" === exercise?.networkType) {
            return "400";
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
                    setFeedback({});
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
                    <Flex align="start" vertical style={{paddingTop: "10px"}}>
                        <Row>
                            <Col>
                                <DraggablePhase1
                                    id={extendedNodes[0].id}
                                    type={extendedNodes[0].type}
                                    x={X + extendedNodes[0].posX}
                                    y={Y + extendedNodes[0].posY}
                                    ok={extendedNodes[0].ok}
                                    src={extendedNodes[0].src}
                                    text={extendedNodes[0].text}
                                    shape={extendedNodes[0].shape}
                                />
                            </Col>
                        </Row>
                        <Row>
                            {extendedNodes.slice(1, 5)
                                .map((element) => (<Col key={element.id} style={{paddingRight: "0.5vmax"}}>
                                        <DraggablePhase1
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
                            {extendedNodes.slice(5)
                                .map((element) => (<Col key={element.id} style={{paddingRight: "0.5vmax"}}>
                                        <DraggablePhase1
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
                    <Divider style={{backgroundColor: "grey"}}/>
                    <Flex align="center" justify="center" style={{height: "90%", width: "90%"}}>
                        <svg height="20vmax" viewBox={`-2 0 ${viewBoxWidth(exercise?.networkType)} 250`}>
                            <rect x={rectX(exercise)} y="1" width="120" height="70" fill="rgb(255, 255, 255)"
                                  stroke="rgb(0, 0, 0)" strokeWidth="3"/>
                            <ellipse cx="60" cy="205" rx="60" ry="40" fill="rgb(255, 255, 255)" stroke="rgb(0, 0, 0)"
                                     strokeWidth="3"/>
                            <ellipse cx="350" cy="205" rx="60" ry="40" fill="rgb(255, 255, 255)" stroke="black"
                                     strokeWidth="3"/>
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
                            {["I-II", "I-III"].includes(exercise?.networkType) && <ellipse
                                cx={exercise?.networkType === "I-II" ? "610" : "570"}
                                cy="205"
                                rx="60"
                                ry="40"
                                fill="rgb(255, 255, 255)"
                                stroke="black"
                                strokeWidth="3"
                            />}
                            {exercise?.networkType === "I-III" && <path
                                d="M 570 145 L 570 150 L 790 150 L 790 165"
                                fill="none"
                                stroke="black"
                                strokeWidth="3"
                            />}
                            {exercise?.networkType === "I-III" && <ellipse
                                cx="790"
                                cy="205"
                                rx="60"
                                ry="40"
                                fill="rgb(255, 255, 255)"
                                stroke="black"
                                strokeWidth="3"
                            />}
                            {droppableNodes.filter((value, index, self) => index === self.findIndex((t) => (t.type === value.type))).map((element) =>
                                <DroppablePhase1
                                    key={element.id}
                                    id={element.id}
                                    type={element.type}
                                    x={X + element.posX}
                                    y={Y + element.posY}
                                    ok={element.ok}
                                    shape={element.shape}
                                    src={element.src}
                                    text={element.text}
                                    stop={element.stop}
                                    bigStop={element.bigStop}
                                    nexus={element.nexus}
                                />)}
                        </svg>
                    </Flex>
                </DndContext>
            </Flex>
        <GifComponent show={showGif}/>
        </Card>);
};

export default DnDPhase1;