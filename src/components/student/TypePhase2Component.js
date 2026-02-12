import { HomeOutlined, ReloadOutlined }                                               from "@ant-design/icons";
import { Card, Col, Divider, Flex, Input, Row }                                       from "antd";
import React, { useEffect, useRef, useState }                                         from "react";
import { useTranslation }                                                             from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import { useSession }                                                                 from "../SessionComponent";
import { nexusX, nodes, pathBottom, pathBottom2, pathTop, stopX, viewBoxWidth, X, Y } from "./NetworkProps";
import {finishExperiment, finishTracking, initTracking, registerElement} from "../../scriptTest2";
import {useExerciseProgressUpdater} from "../../hooks/useExerciseProgressUpdater";
import {getNextExercise} from "../../services/getNextExercise";
import {TRAINING_MODES} from "../../Globals";
import GifComponent from "../GifComponent";

let TypePhase2 = () => {

    let {trainingMode} = useParams();

	const INITIAL_ELEMENT = 0;
	const INITIAL_ID = "1-1";

	const updateExerciseProgress = useExerciseProgressUpdater();

	let { setExercise, exercise, feedback, setFeedback } = useSession();
	let startTime = useRef(Date.now());

	useEffect(() => {
		exerciseNodes.forEach((node) => {
			registerElement(`${exercise.title}_${exercise.representation}_${exercise.networkType}.phase2`, 1, document.getElementById(node.id));
		})
		initTracking(`${exercise.title}_${exercise.representation}_${exercise.networkType}.phase2`);
	}, []);

	useEffect(() => {
		if ( feedback?.phase2?.elapsedTime ) {
			saveFeedback(feedback);
		}
	}, [feedback]);

	let saveFeedback = async (feedback) => {
		try {
			await fetch(`${ process.env.REACT_APP_EXERCISES_SERVICE_URL }/statistics`, {
				method:  "POST", headers: {
					"Content-Type": "application/json", Authorization: `Bearer ${ localStorage.getItem("accessToken") }`
				}, body: JSON.stringify({ feedback })
			});
		}
		catch ( e ) {
		}
	};

	let { t } = useTranslation();
	let navigate = useNavigate();
	let exerciseNodes = nodes(exercise);

	const INITIAL_EXTENDED_NODES = [
		{ ...exerciseNodes[ 0 ], order: 0, id: "1-1" },
		{ ...exerciseNodes[ 0 ], order: 1, id: "1-2" },
		...exerciseNodes.slice(1, 3),
		{ ...exerciseNodes[ 5 ], order: 4, id: "6-2", type: "type6-2", bigStop: true },
		{ ...exerciseNodes[ 0 ], order: 5, id: "1-3" },
		...exerciseNodes.slice(3, 5),
		...exerciseNodes.slice(6),
		{ ...exerciseNodes[ 5 ], order: exerciseNodes.length + 2, id: "6-3", type: "type6-3", posX: nexusX(exercise?.networkType) + stopX(exercise?.networkType), bigStop: true }
	];

	let [extendedNodes, setExtendedNodes] = useState(INITIAL_EXTENDED_NODES);

	let [id, setId] = useState(INITIAL_ID);
	let [current, setCurrent] = useState(INITIAL_ELEMENT);
	let [timer, setTimer] = useState(undefined);
	let [showGif, setShowGif] = useState(false);

	let normalize = (word) => {
		return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
	};

	let check = () => {

		let i = document.getElementById(id);

		extendedNodes.forEach((element) => {
			if ( element?.id === i?.id ) {
				let text = t(element.text);
				if ( text.length === i.value.length ) {
					if ( normalize(text.toLowerCase()) === normalize(i.value.toLowerCase()) ) {
						element.failure = false;
						i.readOnly = true;
						element.ok = true;
						setCurrent(current + 1);

						if ( i.id === "6-3" ) {
							let endTime = Date.now();
							setFeedback({
								            phase1: { ...feedback.phase1 }, phase2: {
									...feedback.phase2,
									elapsedTime: (
										             endTime - startTime.current
									             ) / 1000
								}, title:           exercise.title, representation: exercise.representation, networkType: exercise.networkType, date: Date.now()
							            });
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
							}, 3000));
						}
					} else {
						element.failure = true;
						if ( element.shape ) {
							setFeedback({
								            phase1: { ...feedback.phase1 }, phase2: {
									...feedback.phase2, lexicalError: feedback?.phase2?.lexicalError == null ? 1 : feedback?.phase2?.lexicalError + 1
								}
							            });
						} else if ( element.stop || element.bigStop ) {
							setFeedback({
								            phase1: { ...feedback.phase1 }, phase2: {
									...feedback.phase2, syntacticError: feedback?.phase2?.syntacticError == null ? 1 : feedback?.phase2?.syntacticError + 1
								}
							            });
						} else {
							setFeedback({
								            phase1: { ...feedback.phase1 }, phase2: {
									...feedback.phase2, semanticError: feedback?.phase2?.semanticError == null ? 1 : feedback?.phase2?.semanticError + 1
								}
							            });
						}
					}
				}
			}
		});
	};

	let posY = (element) => {
		if ( element.bigStop ) {
			return element.posY + 35;
		}
		if ( element.stop ) {
			return element.posY + 25;
		}
		return element.posY + 35;
	};

	let posX = (element) => {
		if ( element.bigStop ) {
			return element.posX + 210;
		}
		return element.posX + 220;
	};

	let svgWidth = (e) => {
		if(e.text==="and") {
			return "5vmax";
		}
		if ( e.stop ) {
			return "4vmax";
		}
		if ( e.nexus ) {
			return "7.7vmax";
		}
		return "10.2vmax";
	};

	let pathRect = () => {
		if ( "I-I" === exercise?.networkType ) {
			return "220";
		}
		if ( "I-II" === exercise?.networkType ) {
			return "310";
		}
		if ( "I-III" === exercise?.networkType ) {
			return "460";
		}
	};

	let firstNodeX = () => {
		if ( "I-I" === exercise?.networkType ) {
			return 5;
		}
		if ( "I-II" === exercise?.networkType ) {
			return -85;
		}
		if ( "I-III" === exercise?.networkType ) {
			return -235;
		}
	};

	return (
		<Card style={ { height: "100%", width: "95%" } }>
			<div style={ { position: "absolute", top: "10px", right: "10px" } }>
				<ReloadOutlined style={ { fontSize: "45px", cursor: "pointer" } } onClick={ () => {
					setExercise(exercise);
					setExtendedNodes(INITIAL_EXTENDED_NODES);
					setId(INITIAL_ID);
					startTime.current = Date.now();
					setCurrent(INITIAL_ELEMENT);
					setFeedback({ phase1: { ...feedback.phase1 } });
				} }/>
				<HomeOutlined style={ { fontSize: "45px", cursor: "pointer", paddingLeft: "20px" } } onClick={ () => {
					setExercise(undefined);
					setExtendedNodes(undefined);
					setId(undefined);
					startTime.current = undefined;
					setCurrent(undefined);
					setFeedback(undefined);
					clearTimeout(timer);
					navigate(`/students/exercises/${trainingMode}`);
				} }/>
			</div>
			<Flex align="center" vertical>
				<Flex align="center" justify="center">
					<svg height="19vmax" viewBox={ `-2 -2 ${ viewBoxWidth(exercise?.networkType) } 250` }>
						<path d={ `M ${ pathRect(exercise) } 70 L ${ pathRect(exercise) } 85 ${ pathTop(exercise?.networkType) }` } fill="none" stroke="rgb(0, 0, 0)"
						      strokeWidth="3"/>
						<path d={ `M ${ pathRect(exercise) } 70 L ${ pathRect(exercise) } 85 L 60 85 L 60 95` } fill="none" stroke="rgb(0, 0, 0)" strokeWidth="3"/>
						<path d="M 60 150 L 60 165" fill="none" stroke="rgb(0, 0, 0)" strokeWidth="3"/>
						<path d={ `M 350 165 ${ pathBottom(exercise?.networkType) }` } fill="none" stroke="rgb(0, 0, 0)" strokeWidth="3"/>
						{ ["I-II", "I-III"].includes(exercise?.networkType) && <path
							d={ pathBottom2(exercise?.networkType) }
							fill="none"
							stroke="rgb(0, 0, 0)"
							strokeWidth="3"
						/> }

						{ exercise?.networkType === "I-III" && <path
							d="M 570 145 L 570 150 L 790 150 L 790 165"
							fill="none"
							stroke="rgb(0, 0, 0)"
							strokeWidth="3"
						/> }

						{ extendedNodes.slice().sort((a, b) => b.order - a.order).map((element) => {
							if ( element.shape === "rect" ) {
								return (
									<g key={ element.id + element.order }>
										<rect
											x={ X + element.posX - 50 }
											y={ Y + element.posY - 25 }
											width="120"
											height="70"
											fill="rgb(255, 255, 255)"
											stroke="rgb(0, 0, 0)"
											strokeWidth="3"
										/>
										<text
											x={ element.posX + 220 }
											y={ element.posY + 40 }
											width="120"
											height="70"
											fill="black"
											textAnchor="middle"
											fontFamily="Massallera"
										>
											{ element.text }
										</text>
									</g>
								);
							}
							if ( element.shape === "ellipse" ) {
								return (
									<g key={ element.id + element.order }>
										<ellipse
											cx={ X + element.posX + 10 }
											cy={ Y + element.posY + 12 }
											rx="60"
											ry="40"
											fill="white"
											stroke="black"
											strokeWidth="3"
										/>
										<text
											x={ element.posX + 220 }
											y={ element.posY + 42 }
											width="120"
											height="70"
											fill="black"
											textAnchor="middle"
											fontFamily="Massallera"
										>
											{ element.text }
										</text>
									</g>
								);
							} else {
								return (
									<text
										key={ element.id }
										x={ posX(element) }
										y={ posY(element) }
										width="120"
										height="70"
										fill="black"
										textAnchor="middle"
										fontSize={ element.stop ? "1.5vmax" : element.bigStop ? "2.3vmax" : "0.9vmax" }
										fontFamily="Massallera"
									>
										{ t(element.text) }
									</text>
								);
							}

						}) }
					</svg>
				</Flex>
				<Divider style={ { backgroundColor: "grey" } }/>
				<Flex align="start" vertical>
					<Row>
						<Col key={ extendedNodes[ 0 ].id }>
							<svg height="7vmax" width="10.2vmax">
								<g key={ extendedNodes[ 0 ].id + extendedNodes[ 0 ].order }>
									<rect
										x="2"
										y="2"
										width="9.8vmax"
										height="5.5vmax"
										fill="white"
										stroke="black"
										strokeWidth="3"
									/>
									{ extendedNodes[ 0 ].clicked ? (
										<foreignObject
											x={ extendedNodes[ 0 ].posX + firstNodeX() }
											y={ `${ extendedNodes[ 0 ].posY + 1.8 }vmax` }
											width="9.3vmax"
											height="4.5vmax"
										>
											<Input
												autoFocus={ true }
												autoComplete="off"
												id={ extendedNodes[ 0 ].id }
												style={ { textTransform: "uppercase", textAlign: "center", fontSize: "1.1vmax", fontFamily: "Massallera" } }
												onChange={ () => check() }
												value={ extendedNodes[ 0 ].ok ? extendedNodes[ 0 ].text : undefined }
												status={ extendedNodes[ 0 ].failure ? "error" : "" }
											/>
										</foreignObject>
									) : (
										  <rect
											  onClick={ () => {
												  if ( extendedNodes[ 0 ].order === current ) {
													  let updated = extendedNodes.map((e) => {
														  if ( extendedNodes[ 0 ].id === e.id ) {
															  e.clicked = true;
														  }
														  return e;
													  });
													  setId(extendedNodes[ 0 ].id);
													  setExtendedNodes(updated);
												  } else {
													  setFeedback({
														              phase1: { ...feedback.phase1 },
														              phase2: {
															              ...feedback.phase2,
															              orderError: feedback?.phase2?.orderError == null ? 1 : feedback?.phase2?.orderError + 1
														              }
													              });
												  }
											  } }
											  onPointerOver={ (event) => { event.target.style.fill = "#ea9999"; } }
											  onPointerOut={ (event) => { event.target.style.fill = "#f8cecc"; } }
											  x="4.3vmax"
											  y="2.1vmax"
											  width="1.5vmax"
											  height="1.5vmax"
											  fill="#f8cecc"
										  />
									  ) }
								</g>
							</svg>
						</Col>
					</Row>
					<Row>
						{ extendedNodes.slice(1, 5)
						               .map((element) => (
							               <Col key={ element.id } style={ { paddingRight: "0.5vmax" } }>
								               <svg height="7vmax" width={ svgWidth(element) }>
									               <g key={ element.id + element.order }>
										               { element.shape === "rect" && <rect
											               x="2"
											               y="6"
											               width="9.8vmax"
											               height="5.5vmax"
											               fill="white"
											               stroke="black"
											               strokeWidth="3"
										               /> }
										               { element.shape === "ellipse" && <ellipse
											               cx="4.6vmax"
											               cy="3.3vmax"
											               rx="4.5vmax"
											               ry="3.2vmax"
											               fill="white"
											               stroke="black"
											               strokeWidth="3"
										               /> }
										               { element.clicked ? (
											               <foreignObject
												               x={ element.shape === "ellipse" ? "13%" : element.nexus ? "0%" : "4%" }
												               y={ element.bigStop ? "40%" : element.shape === "rect" ? `${ element.posY + 2 }vmax` : "30%" }
												               width={ element.bigStop ? "3vmax" : element.shape === "ellipse" ? "6.5vmax" : element.shape === "rect"
												                                                                                             ? "9.3vmax"
												                                                                                             : "7.4vmax" }
												               height="40px"
											               >
												               <Input
													               autoFocus={ true }
													               autoComplete="off"
													               id={ element.id }
													               style={ {
														               textTransform: element.shape === "rect" ? "uppercase" : "lowercase",
														               textAlign:     "center",
														               fontSize:      "1.1vmax",
														               fontFamily:    "Massallera"
													               } }
													               height={ "40px" }
													               onChange={ () => check() }
													               value={ element.ok ? (
														               element.shape ? element.text : t(element.text)
													               ) : undefined }
													               status={ element.failure ? "error" : "" }
												               />
											               </foreignObject>
										               ) : (
											                 <rect
												                 onClick={ () => {
													                 if ( element.order === current ) {
														                 let updated = extendedNodes.map((e) => {
															                 if ( element.id === e.id ) {
																                 e.clicked = true;
															                 }
															                 return e;
														                 });
														                 setId(element.id);
														                 setExtendedNodes(updated);
													                 } else {
														                 setFeedback({
															                             phase1: { ...feedback.phase1 },
															                             phase2: {
																                             ...feedback.phase2,
																                             orderError: feedback?.phase2?.orderError == null ? 1 : feedback?.phase2?.orderError + 1
															                             }
														                             });
													                 }
												                 } }
												                 onPointerOver={ (event) => { event.target.style.fill = "#ea9999"; } }
												                 onPointerOut={ (event) => { event.target.style.fill = "#f8cecc"; } }
												                 x={ element.shape === "rect" ? "4.2vmax" : element.bigStop ? "1vmax" : element.nexus ? "2.5vmax" : "3.9vmax" }
												                 y={ element.shape === "rect" ? "2.3vmax" : element.bigStop ? "50%" : "33%" }
												                 width="1.5vmax"
												                 height="1.5vmax"
												                 fill="#f8cecc"
											                 />
										                 ) }
									               </g>
								               </svg>
							               </Col>
						               )) }
					</Row>
					<Row>
						{ extendedNodes.slice(5)
						               .map((element) => (
							               <Col key={ element.id } style={ { paddingRight: "0.3vmax" } }>
								               <svg height="7vmax" width={ svgWidth(element) }>
									               <g key={ element.id + element.order }>
										               { element.shape === "rect" && <rect
											               x="2"
											               y="2"
											               width="9.8vmax"
											               height="5.5vmax"
											               fill="white"
											               stroke="black"
											               strokeWidth="3"
										               /> }
										               { element.shape === "ellipse" && <ellipse
											               cx="5.5vmax"
											               cy="3.3vmax"
											               rx="4.5vmax"
											               ry="3.2vmax"
											               fill="white"
											               stroke="black"
											               strokeWidth="3"
										               /> }
										               { element.clicked ? (
											               <foreignObject
												               x={ element.text === "and" ? "0" : element.shape === "ellipse" ? "22%" : element.nexus ? "0%" : "4%" }
												               y={ element.bigStop || element.stop ? "40%" : element.shape === "ellipse" ? "30%" : element.shape === "rect"
												                                                                                                   ? "25%"
												                                                                                                   : "30%" }
												               width={element.text === "and" ? "5vmax" : element.bigStop || element.stop ? "3vmax" : element.shape === "ellipse" ? "6.5vmax" : element.shape
												                                                                                                             === "rect"
												                                                                                                             ? "9.3vmax"
												                                                                                                             : "7.4vmax" }
												               height="10vmax"
											               >
												               <Input
													               autoFocus={ true }
													               autoComplete="off"
													               id={ element.id }
													               style={ {
														               textTransform: element.shape === "rect" ? "uppercase" : "lowercase",
														               textAlign:     "center",
														               fontSize:      "1.1vmax",
														               fontFamily:    "Massallera"
													               } }
													               height={ "10vmax" }
													               onChange={ () => check() }
													               value={ element.ok ? (
														               element.shape ? element.text : t(element.text)
													               ) : undefined }
													               status={ element.failure ? "error" : "" }
												               />
											               </foreignObject>
										               ) : (
											                 <rect
												                 onClick={ () => {
													                 if ( element.order === current ) {
														                 let updated = extendedNodes.map((e) => {
															                 if ( element.id === e.id ) {
																                 e.clicked = true;
															                 }
															                 return e;
														                 });
														                 setId(element.id);
														                 setExtendedNodes(updated);
													                 } else {
														                 setFeedback({
															                             phase1: { ...feedback.phase1 },
															                             phase2: {
																                             ...feedback.phase2,
																                             orderError: feedback?.phase2?.orderError == null ? 1 : feedback?.phase2?.orderError + 1
															                             }
														                             });
													                 }
												                 } }
												                 onPointerOver={ (event) => { event.target.style.fill = "#ea9999"; } }
												                 onPointerOut={ (event) => { event.target.style.fill = "#f8cecc"; } }
												                 x={ element.shape === "rect" ? "41%" : element.bigStop ? "10%" : element.nexus ? "2.5vmax" : element.stop
												                                                                                                              ? "1vmax"
												                                                                                                              : "4.8vmax" }
												                 y={ element.shape === "rect" ? "28%" : element.bigStop ? "50%" : "34%" }
												                 width="1.5vmax"
												                 height="1.5vmax"
												                 fill="#f8cecc"
											                 />
										                 ) }
									               </g>
								               </svg>
							               </Col>
						               )) }
					</Row>
				</Flex>
			</Flex>
			<GifComponent show={showGif}/>
		</Card>
	);
};

export default TypePhase2;