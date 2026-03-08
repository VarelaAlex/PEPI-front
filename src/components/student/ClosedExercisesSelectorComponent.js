import React, {useEffect, useRef, useState} from 'react';
import {Alert, Card, Col, Divider, Flex, Image, Row, Spin, Typography} from 'antd';
import {CheckCircleOutlined, LockOutlined} from '@ant-design/icons';
import {useSession} from "../SessionComponent";
import {useNavigate} from "react-router-dom";
import {REPRESENTATION} from "../../Globals";
import {useTranslation} from "react-i18next";
import {getGuidedIndex} from "../../services/getGuidedIndex";
import {NEUTRAL, NEUTRAL_SPEAKING} from "../Avatar";
import {useAvatar} from "../AvatarContext";

const ClosedExercisesSelector = () => {
    const {setExercise, setFeedback, lang} = useSession();

    const [exercises, setExercises] = useState([]);
    const [guidedIndex, setGuidedIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const lastEnabledRef = useRef(null);
    const scrollContainerRef = useRef(null);

    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [scrollTop, setScrollTop] = useState(0);

    const navigate = useNavigate();
    const {t} = useTranslation();
    const {Text, Title} = Typography;
    const {Meta} = Card;

    let {changeEmotionSequence} = useAvatar();

    useEffect(() => {
        const greeted = localStorage.getItem("greeted-closed");

        if(!greeted) {
            let closedIntro = "Te voy a ayudar para que puedas entrenar de la mejor forma posible, empieza por el primer ejercicio y yo te iré mostrando nuevas actividades"

            changeEmotionSequence([{
                emotionDuring: NEUTRAL_SPEAKING,
                emotionAfter: NEUTRAL,
                text: closedIntro,
                audio: `closedIntro`,
                afterDelay: 500
            }]);
            localStorage.setItem("greeted-closed", "true");
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                getGuidedIndex().then((progressData) => {
                    setGuidedIndex(progressData.guidedIndex);
                })

                const exercisesRes = await fetch(`${process.env.REACT_APP_EXERCISES_SERVICE_URL}/exercises/guided/${lang.split('-')[0]}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

                if (!exercisesRes.ok) throw new Error("Error al obtener ejercicios");

                const exercisesData = await exercisesRes.json();
                setExercises(exercisesData);

            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [lang]);

    useEffect(() => {
        if (lastEnabledRef.current && scrollContainerRef.current && !loading) {
            lastEnabledRef.current.scrollIntoView({
                behavior: 'smooth', block: 'center'
            });
        }
    }, [guidedIndex, loading]);

    const getCardStyle = (index) => {
        if (index < guidedIndex) {
            return {backgroundColor: '#eefff3', borderColor: '#c3e6cb'};
        }
        if (index === guidedIndex) {
            return {backgroundColor: '#fff4d2', borderColor: '#ffc107'};
        }
        return {};
    };

    const conditionalCursorStyle = isDragging ? 'grabbing' : 'grab';
    const combinedScrollStyles = {
        flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingRight: '10px', cursor: conditionalCursorStyle
    }

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartY(e.pageY - scrollContainerRef.current.offsetTop);
        setScrollTop(scrollContainerRef.current.scrollTop);
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const y = e.pageY - scrollContainerRef.current.offsetTop;
        scrollContainerRef.current.scrollTop = scrollTop - (y - startY);
    };

    const handleMouseUp = () => setIsDragging(false);

    const representationColors = {
        ICONIC: "#FFADAD", MIXED: "#7DE28F", GLOBAL: "#FFD7A8", SYMBOLIC: "#8FD1FF"
    };

    const networkTypeColors = {
        "I-I": "#ffc464", "I-II": "#16e8df", "I-III": "#cf8ffc"
    };

    if (loading) return <Spin size="large" style={{marginTop: 100}}/>;
    if (error) return <Alert type="error" message={error}/>;

    return (<div style={{
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '70vmax',
        margin: '0 auto',
        padding: '2vmax'
    }}>
        <div
            ref={scrollContainerRef}
            style={combinedScrollStyles}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <Row gutter={[16, 16]}>
                {exercises.map((exercise, index) => {
                    const enabled = index <= guidedIndex;
                    const completed = index < guidedIndex;
                    const isLast = index === guidedIndex;

                    return (<Col span={8} key={`${exercise._id}-${exercise.representation}`}>
                        <Card
                            ref={isLast ? lastEnabledRef : null}
                            hoverable={enabled}
                            style={{
                                ...getCardStyle(index),
                                opacity: enabled ? 1 : 0.5,
                                cursor: enabled ? 'pointer' : 'not-allowed',
                                textAlign: "center"
                            }}
                            onClick={() => {
                                if (!enabled) return;
                                setExercise(exercise);
                                setFeedback({});
                                if (exercise.representation === REPRESENTATION.SYMBOLIC) {
                                    navigate(`/exerciseType/phase1/ruled`);
                                } else {
                                    navigate(`/exerciseDnD/phase1/ruled`);
                                }
                            }}
                            extra={completed ? <CheckCircleOutlined style={{color: '#28a745'}}/> : !enabled ?
                                <LockOutlined/> : <div/>}
                        >
                            <Title level={4}
                                   style={{fontSize: "1.3vmax", textAlign: "center"}}>{exercise.title}</Title>
                            <Image alt={exercise.title} draggable={false} preview={false} width="15vmax"
                                   src={`${process.env.REACT_APP_ARASAAC_URL}/pictograms/${exercise.mainImage}`}/>
                            <Divider style={{marginTop: "1vmax", marginBottom: "1vmax"}}/>
                            <Flex style={{width: '100%'}} justify='center' align='center' gap='small'>
                                <Meta style={{
                                    backgroundColor: representationColors[exercise.representation],
                                    borderRadius: "12px",
                                    width: '100%'
                                }}
                                      title={<Text style={{
                                          fontSize: "1.5vmax", textAlign: "center", color: "black"
                                      }}>{t(`exercise.${exercise.representation}`)}</Text>}/>
                                <Meta style={{
                                    backgroundColor: networkTypeColors[exercise.networkType],
                                    borderRadius: "12px",
                                    width: '100%'
                                }}
                                      title={<Text style={{
                                          fontSize: "1.5vmax", textAlign: "center", color: "black"
                                      }}>{exercise.networkType}</Text>}/>
                            </Flex>
                        </Card>
                    </Col>);
                })}
            </Row>
        </div>
    </div>);
};

export default ClosedExercisesSelector;