import {HomeOutlined, ReloadOutlined} from "@ant-design/icons";
import {Card, Col, Divider, Flex, Input, Row} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import {useSession} from "../SessionComponent";
import {nexusX, nodes, pathBottom, pathBottom2, pathTop, stopX, viewBoxWidth, X, Y} from "./NetworkProps";
import "../assets/styles/font.css";
import {finishTracking, initTracking, registerElement} from "../../scriptTest2";
import GifComponent from "../GifComponent";
import {NEUTRAL, NEUTRAL_SPEAKING} from "../Avatar";
import {useAvatar} from "../AvatarContext";

let TypePhase1 = () => {

    let {trainingMode} = useParams();

    const INITIAL_ELEMENT = 0;
    const INITIAL_ID = "1-1";
    let {setExercise, exercise, feedback, setFeedback} = useSession();
    let exerciseNodes = nodes(exercise);

    let {changeEmotionSequence} = useAvatar();

    useEffect(() => {
        exerciseNodes.forEach((node) => {
            registerElement(`${exercise.title}_${exercise.representation}_${exercise.networkType}.phase1`, node.id, document.getElementById(node.id));
        })
        initTracking(`${exercise.title}_${exercise.representation}_${exercise.networkType}.phase1`);
    }, []);

    useEffect(() => {
        // Reproducir las tres frases solo si no hemos llegado a 3 accesos
        let phrases = [
			"¡Ahora toca escribir las palabras del mensaje en la red!",
			"¡Escribe las palabras del mensaje en el lugar correspondiente de la red!",
			"¡Vamos a escribir! Recuerda empezar por el título"
		]

        let typeEnd = "Pulsa en el cuadrado rojo del elemento de la red donde quieras escribir."
        let index = Math.floor(Math.random() * phrases.length) + 1;

        changeEmotionSequence([{
            emotionDuring: NEUTRAL_SPEAKING,
            emotionAfter: NEUTRAL,
            text: phrases[index],
            audio: `type1-intro${index}`,
            afterDelay: 500
        }, {
            emotionDuring: NEUTRAL_SPEAKING,
			emotionAfter: NEUTRAL,
			text: typeEnd,
			audio: `type-end`,
			afterDelay: 500
        }]);
    }, []);

    let startTime = useRef(Date.now());

    let {t} = useTranslation();
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
        bigStop: true
    }, {
        ...exerciseNodes[0],
        order: 5,
        id: "1-3"
    }, ...exerciseNodes.slice(3, 5), ...exerciseNodes.slice(6), {
        ...exerciseNodes[5],
        order: exerciseNodes.length + 2,
        id: "6-3",
        type: "type6-3",
        posX: nexusX(exercise?.networkType) + stopX(exercise?.networkType),
        bigStop: true
    }];

    let [extendedNodes, setExtendedNodes] = useState(INITIAL_EXTENDED_NODES);

    const getTextPosition = (bigStop, stop, shape) => {
        if (bigStop) {
            return {x: "1.5vmax", y: "5vmax", fontSize: "2.3vmax"};
        }
        if (stop) {
            return {x: "2.75vmax", y: "4vmax", fontSize: "1.8vmax"};
        }
        if (shape === "rect") {
            return {x: "4.7vmax", y: "3.2vmax", fontSize: "1vmax"};
        }
        if (shape === "ellipse") {
            return {x: "4.6vmax", y: "3.5vmax", fontSize: "1vmax"};
        }
        return {x: "4vmax", y: "3.2vmax", fontSize: "1.1vmax"};
    };

    let normalize = (word) => {
        return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    let [id, setId] = useState(INITIAL_ID);
    let [current, setCurrent] = useState(INITIAL_ELEMENT);
    let [timer, setTimer] = useState(undefined);
    let [showGif, setShowGif] = useState(false);

    let check = () => {

        let i = document.getElementById(id);

        extendedNodes.forEach((element) => {
            if (element?.id === i?.id) {
                let text = t(element.text);
                if (text.length === i.value.length) {
                    if (normalize(text.toLowerCase()) === normalize(i.value.toLowerCase())) {
                        element.failure = false;
                        if (current === 0 || current === 4) {
                            setTimeout(() => {
                                setExtendedNodes(extendedNodes.map(node => node.type === "type1" ? {
                                    ...node,
                                    clicked: false,
                                    ok: false
                                } : node));
                            }, 500);
                        }
                        element.ok = true;
                        i.readOnly = true;
                        setCurrent(current + 1);

                        if (i?.id === "6-3") {
                            let endTime = Date.now();
                            setFeedback({
                                phase1: {
                                    ...feedback.phase1, elapsedTime: (endTime - startTime.current) / 1000
                                }
                            });
                            setShowGif(true);
                            setTimer(setTimeout(() => {
                                setShowGif(false);
                                finishTracking("/exerciseType/phase2");
                                navigate(`/exerciseType/phase2/${trainingMode}`);
                            }, 3000));
                        }
                    } else {
                        element.failure = true;
                        if (element.shape) {
                            setFeedback({
                                phase1: {
                                    ...feedback.phase1,
                                    lexicalError: feedback?.phase1?.lexicalError == null ? 1 : feedback?.phase1?.lexicalError + 1
                                }
                            });
                        } else if (element.stop || element.bigStop) {
                            setFeedback({
                                phase1: {
                                    ...feedback.phase1,
                                    syntacticError: feedback?.phase1?.syntacticError == null ? 1 : feedback?.phase1?.syntacticError + 1
                                }
                            });
                        } else {
                            setFeedback({
                                phase1: {
                                    ...feedback.phase1,
                                    semanticError: feedback?.phase1?.semanticError == null ? 1 : feedback?.phase1?.semanticError + 1
                                }
                            });
                        }
                    }
                }
            }
            return element;
        });
    };

    let svgWidth = (e) => {
        if (e.stop) {
            return "5vmax";
        }
        if (e.nexus) {
            return "8vmax";
        }
        return "9.2vmax";
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

    return (<Card style={{height: "55vmax", width: "95%"}}>
            <div style={{position: "absolute", top: "10px", right: "10px"}}>
                <ReloadOutlined style={{fontSize: "45px", cursor: "pointer"}} onClick={() => {
                    setExercise(exercise);
                    setExtendedNodes(INITIAL_EXTENDED_NODES);
                    setId(INITIAL_ID);
                    startTime.current = Date.now();
                    setCurrent(INITIAL_ELEMENT);
                    setFeedback({});
                }}/>
                <HomeOutlined style={{fontSize: "45px", cursor: "pointer", paddingLeft: "20px"}} onClick={() => {
                    setExercise(undefined);
                    setExtendedNodes(undefined);
                    setId(undefined);
                    startTime.current = undefined;
                    setCurrent(undefined);
                    setFeedback(undefined);
                    clearTimeout(timer);
                    navigate(`/students/exercises/${trainingMode}`);
                }}/>
            </div>
            <Flex align="center" vertical>
                <Flex align="start" vertical style={{paddingTop: "20px"}}>
                    <Row>
                        <Col key={extendedNodes[0].id}>
                            <svg height="6.5vmax" width={svgWidth(extendedNodes[0])}>
                                <rect
                                    x="2"
                                    y="6"
                                    width="9vmax"
                                    height="4.7vmax"
                                    fill="white"
                                    stroke="black"
                                    strokeWidth="3"
                                />
                                <text
                                    {...getTextPosition(extendedNodes[0].bigStop, extendedNodes[0].stop, extendedNodes[0].shape)}
                                    fill="black"
                                    textAnchor="middle"
                                    fontFamily="Massallera"
                                >
                                    {extendedNodes[0].text}
                                </text>
                            </svg>
                        </Col>
                    </Row>
                    <Row>
                        {extendedNodes.slice(1, 5)
                            .map((element) => (<Col key={element.id} style={{paddingRight: "0.5vmax"}}>
                                    <svg height="6.5vmax" width={svgWidth(element)}>
                                        {element.shape === "rect" && <rect
                                            x="2"
                                            y="6"
                                            width="9vmax"
                                            height="4.7vmax"
                                            fill="white"
                                            stroke="black"
                                            strokeWidth="3"
                                        />}
                                        {element.shape === "ellipse" && <ellipse
                                            cx="4.6vmax"
                                            cy="3.1vmax"
                                            rx="4.5vmax"
                                            ry="3vmax"
                                            fill="white"
                                            stroke="black"
                                            strokeWidth="3"
                                        />}
                                        <text
                                            {...getTextPosition(element.bigStop, element.stop, element.shape)}
                                            fill="black"
                                            textAnchor="middle"
                                            fontFamily="Massallera"
                                        >
                                            {t(element.text)}
                                        </text>
                                    </svg>
                                </Col>))}
                    </Row>
                    <Row>
                        {extendedNodes.slice(5)
                            .map((element) => (<Col key={element.id} style={{paddingRight: "0.5vmax"}}>
                                    <svg height="6.5vmax" width={svgWidth(element)}>
                                        {element.shape === "rect" && <rect
                                            x="2"
                                            y="6"
                                            width="9vmax"
                                            height="4.7vmax"
                                            fill="white"
                                            stroke="black"
                                            strokeWidth="3"
                                        />}
                                        {element.shape === "ellipse" && <ellipse
                                            cx="4.6vmax"
                                            cy="3.1vmax"
                                            rx="4.5vmax"
                                            ry="3vmax"
                                            fill="white"
                                            stroke="black"
                                            strokeWidth="3"
                                        />}
                                        <text
                                            {...getTextPosition(element.bigStop, element.stop, element.shape)}
                                            fill="black"
                                            textAnchor="middle"
                                            fontFamily="Massallera"
                                        >
                                            {t(element.text)}
                                        </text>
                                    </svg>
                                </Col>))}
                    </Row>
                </Flex>
                <Divider style={{backgroundColor: "grey"}}/>
                <Flex align="center" justify="center" style={{height: "90%", width: "90%"}}>
                    <svg height="19vmax" viewBox={`-2 -2 ${viewBoxWidth(exercise?.networkType)} 250`}>
                        <path
                            d={`M ${pathRect(exercise)} 70 L ${pathRect(exercise)} 85 ${pathTop(exercise?.networkType)}`}
                            fill="none" stroke="rgb(0, 0, 0)"
                            strokeWidth="3"/>
                        <path d={`M ${pathRect(exercise)} 70 L ${pathRect(exercise)} 85 L 60 85 L 60 95`} fill="none"
                              stroke="rgb(0, 0, 0)" strokeWidth="3"/>
                        <path d="M 60 150 L 60 165" fill="none" stroke="rgb(0, 0, 0)" strokeWidth="3"/>
                        <path d={`M 350 165 ${pathBottom(exercise?.networkType)}`} fill="none" stroke="rgb(0, 0, 0)"
                              strokeWidth="3"/>
                        {["I-II", "I-III"].includes(exercise?.networkType) && <path
                            d={pathBottom2(exercise?.networkType)}
                            fill="none"
                            stroke="rgb(0, 0, 0)"
                            strokeWidth="3"
                        />}

                        {exercise?.networkType === "I-III" && <path
                            d="M 570 145 L 570 150 L 790 150 L 790 165"
                            fill="none"
                            stroke="rgb(0, 0, 0)"
                            strokeWidth="3"
                        />}

                        {extendedNodes.slice().sort((a, b) => b.order - a.order).map((element) => {
                            if (element.shape === "rect") {
                                return (<g key={element.id + element.order}>
                                        <rect
                                            x={X + element.posX - 60}
                                            y={Y + element.posY - 25}
                                            width="141"
                                            height="75"
                                            fill="rgb(255, 255, 255)"
                                            stroke="rgb(0, 0, 0)"
                                            strokeWidth="3"
                                        />
                                        {element.clicked ? (<foreignObject
                                                x={X + element.posX - 57}
                                                y={Y + element.posY - 4}
                                                width="135"
                                                height="3vmax"
                                            >
                                                <Input
                                                    id={element.id}
                                                    style={{
                                                        textTransform: "uppercase",
                                                        textAlign: "center",
                                                        fontFamily: "Massallera"
                                                    }}
                                                    onChange={() => check()}
                                                    autoFocus={true}
                                                    autoComplete="off"
                                                    value={extendedNodes[0].ok ? extendedNodes[0].text : undefined}
                                                    status={element.failure ? "error" : ""}
                                                />
                                            </foreignObject>) : (<rect
                                                onClick={() => {
                                                    if (current === 0 || current === 1 || current === 5) {
                                                        let updated = extendedNodes.map((e) => {
                                                            if (element.id === e.id) {
                                                                e.clicked = true;
                                                            }
                                                            return e;
                                                        });
                                                        setId(element.id);
                                                        setExtendedNodes(updated);
                                                    } else {
                                                        setFeedback({
                                                            phase1: {
                                                                ...feedback.phase1,
                                                                orderError: feedback?.phase1?.orderError == null ? 1 : feedback?.phase1?.orderError + 1
                                                            }
                                                        });
                                                    }
                                                }}
                                                onPointerOver={(event) => {
                                                    event.target.style.fill = "#ea9999";
                                                }}
                                                onPointerOut={(event) => {
                                                    event.target.style.fill = "#f8cecc";
                                                }}
                                                x={X + element.posX}
                                                y={Y + element.posY}
                                                width="1.5vmax"
                                                height="1.5vmax"
                                                fill="#f8cecc"
                                            />)}
                                    </g>);
                            }
                            if (element.shape === "ellipse") {
                                return (<g key={element.id + element.order}>
                                        <ellipse
                                            cx={X + element.posX + 10}
                                            cy={Y + element.posY + 12}
                                            rx="60"
                                            ry="40"
                                            fill="white"
                                            stroke="black"
                                            strokeWidth="3"
                                        />
                                        {element.clicked ? (<foreignObject
                                                x={X + element.posX - 42}
                                                y={Y + element.posY - 4}
                                                width="105"
                                                height="3vmax"
                                            >
                                                <Input
                                                    id={element.id}
                                                    style={{
                                                        textTransform: "uppercase",
                                                        textAlign: "center",
                                                        fontFamily: "Massallera"
                                                    }}
                                                    onChange={() => check()}
                                                    autoFocus={true}
                                                    autoComplete="off"
                                                    value={element.ok ? element.text : undefined}
                                                    status={element.failure ? "error" : ""}
                                                />

                                            </foreignObject>) : (<rect
                                                onClick={() => {
                                                    if (element.order === current) {
                                                        let updated = extendedNodes.map((e) => {
                                                            if (element.id === e.id) {
                                                                e.clicked = true;
                                                            }
                                                            return e;
                                                        });
                                                        setId(element.id);
                                                        setExtendedNodes(updated);
                                                    } else {
                                                        setFeedback({
                                                            phase1: {
                                                                ...feedback.phase1,
                                                                orderError: feedback?.phase1?.orderError == null ? 1 : feedback?.phase1?.orderError + 1
                                                            }
                                                        });
                                                    }
                                                }}
                                                onPointerOver={(event) => {
                                                    event.target.style.fill = "#ea9999";
                                                }}
                                                onPointerOut={(event) => {
                                                    event.target.style.fill = "#f8cecc";
                                                }}
                                                x={X + element.posX}
                                                y={Y + element.posY}
                                                width="1.5vmax"
                                                height="1.5vmax"
                                                fill="#f8cecc"
                                            />)}
                                    </g>);
                            }
                            if (element.bigStop) {
                                return (element.clicked ? (<foreignObject
                                            x={X + element.posX}
                                            y={Y + element.posY - 4}
                                            width="50"
                                            height="3vmax"
                                        >
                                            <Input
                                                id={element.id}
                                                style={{
                                                    textTransform: "lowercase",
                                                    textAlign: "center",
                                                    fontFamily: "Massallera"
                                                }}
                                                onChange={() => check()}
                                                autoFocus={true}
                                                autoComplete="off"
                                                value={element.ok ? t(element.text) : undefined}
                                                status={element.failure ? "error" : ""}
                                            />
                                        </foreignObject>) : (<rect
                                            key={element.id + element.order}
                                            onClick={() => {
                                                if (element.order === current) {
                                                    let updated = extendedNodes.map((e) => {
                                                        if (element.id === e.id) {
                                                            e.clicked = true;
                                                        }
                                                        return e;
                                                    });
                                                    setId(element.id);
                                                    setExtendedNodes(updated);
                                                } else {
                                                    setFeedback({
                                                        phase1: {
                                                            ...feedback.phase1,
                                                            orderError: feedback?.phase1?.orderError == null ? 1 : feedback?.phase1?.orderError + 1
                                                        }
                                                    });
                                                }
                                            }}
                                            onPointerOver={(event) => {
                                                event.target.style.fill = "#ea9999";
                                            }}
                                            onPointerOut={(event) => {
                                                event.target.style.fill = "#f8cecc";
                                            }}
                                            x={X + element.posX}
                                            y={Y + element.posY}
                                            width="1.5vmax"
                                            height="1.5vmax"
                                            fill="#f8cecc"
                                        />)

                                );
                            }
                            if (element.stop) {
                                return (element.clicked ? (<foreignObject
                                            x={X + element.posX - 30}
                                            y={Y + element.posY - 4}
                                            width="60"
                                            height="3vmax"
                                        >
                                            <Input
                                                id={element.id}
                                                style={{
                                                    textTransform: "lowercase",
                                                    textAlign: "center",
                                                    fontFamily: "Massallera"
                                                }}
                                                onChange={() => check()}
                                                autoFocus={true}
                                                autoComplete="off"
                                                value={element.ok ? t(element.text) : undefined}
                                                status={element.failure ? "error" : ""}
                                            />
                                        </foreignObject>) : (<rect
                                            key={element.id + element.order}
                                            onClick={() => {
                                                if (element.order === current) {
                                                    let updated = extendedNodes.map((e) => {
                                                        if (element.id === e.id) {
                                                            e.clicked = true;
                                                        }
                                                        return e;
                                                    });
                                                    setId(element.id);
                                                    setExtendedNodes(updated);
                                                } else {
                                                    setFeedback({
                                                        phase1: {
                                                            ...feedback.phase1,
                                                            orderError: feedback?.phase1?.orderError == null ? 1 : feedback?.phase1?.orderError + 1
                                                        }
                                                    });
                                                }
                                            }}
                                            onPointerOver={(event) => {
                                                event.target.style.fill = "#ea9999";
                                            }}
                                            onPointerOut={(event) => {
                                                event.target.style.fill = "#f8cecc";
                                            }}
                                            x={X + element.posX}
                                            y={Y + element.posY}
                                            width="1.5vmax"
                                            height="1.5vmax"
                                            fill="#f8cecc"
                                        />)

                                );
                            } else {
                                return (element.clicked ? (<foreignObject
                                            x={X + element.posX - 50}
                                            y={Y + element.posY - 9}
                                            width="116"
                                            height="3vmax"
                                        >
                                            <Input
                                                id={element.id}
                                                style={{
                                                    textTransform: "lowercase",
                                                    textAlign: "center",
                                                    fontFamily: "Massallera"
                                                }}
                                                onChange={() => check()}
                                                autoFocus={true}
                                                autoComplete="off"
                                                value={element.ok ? t(element.text) : undefined}
                                                status={element.failure ? "error" : ""}
                                            />
                                        </foreignObject>) : (<rect
                                            key={element.id + element.order}
                                            onClick={() => {
                                                if (element.order === current) {
                                                    let updated = extendedNodes.map((e) => {
                                                        if (element.id === e.id) {
                                                            e.clicked = true;
                                                        }
                                                        return e;
                                                    });
                                                    setId(element.id);
                                                    setExtendedNodes(updated);
                                                } else {
                                                    setFeedback({
                                                        phase1: {
                                                            ...feedback.phase1,
                                                            orderError: feedback?.phase1?.orderError == null ? 1 : feedback?.phase1?.orderError + 1
                                                        }
                                                    });
                                                }
                                            }}
                                            onPointerOver={(event) => {
                                                event.target.style.fill = "#ea9999";
                                            }}
                                            onPointerOut={(event) => {
                                                event.target.style.fill = "#f8cecc";
                                            }}
                                            x={X + element.posX}
                                            y={Y + element.posY - 5}
                                            width="1.5vmax"
                                            height="1.5vmax"
                                            fill="#f8cecc"
                                        />)

                                );
                            }

                        })}
                    </svg>
                </Flex>
            </Flex>
            <GifComponent show={showGif}/>
        </Card>);
};

export default TypePhase1;