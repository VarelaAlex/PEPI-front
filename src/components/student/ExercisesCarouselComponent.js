import {Alert, Card, Col, Divider, Empty, Flex, Image, Row, Spin, Typography} from "antd";
import {useCallback, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {CATEGORIES, EXERCISE_RULES, REPRESENTATION} from "../../Globals";
import i18n from "../../i18n";
import {useSession} from "../SessionComponent";
import {useAvatar} from "../AvatarContext";
import {NEUTRAL, NEUTRAL_SPEAKING} from "../Avatar";

let ExercisesCarousel = () => {
    let {setExercise, setFeedback, lang, setLang} = useSession();

    let [exercises, setExercises] = useState([]);
    let [message, setMessage] = useState(null);
    let [loading, setLoading] = useState(true);
    let [selectedImage, setSelectedImage] = useState(0);
    let [selectedRepresentation, setSelectedRepresentation] = useState(0);
    let [category, setCategory] = useState(CATEGORIES.BODY_AND_FOOD);
    let [representation, setRepresentation] = useState(REPRESENTATION.ICONIC);

    let navigate = useNavigate();
    let {t} = useTranslation();

    const carouselRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const velocity = useRef(0);
    const lastX = useRef(0);
    const lastTime = useRef(0);
    const requestId = useRef(null);
    let guidedIndexRef = useRef(null);

    function matchesCondition(item, condition) {
        return condition.networks.includes(item.networkType) && condition.representations.includes(item.representation);
    }

    function isItemEnabled(item, exerciseId) {
        const rule = EXERCISE_RULES[exerciseId];

        if (!rule) {
            return true;
        }

        if (rule.networks && rule.representations) {
            return rule.networks.includes(item.networkType) && rule.representations.includes(item.representation);
        }

        if (rule.conditions) {
            return rule.conditions.some(condition => matchesCondition(item, condition));
        }

        return false;
    }

    const getExercises = useCallback(async () => {
        setLoading(true);
        let response = null;
        try {
            response = await fetch(`${process.env.REACT_APP_EXERCISES_SERVICE_URL}/exercises/list/${lang.split("-")[0]}`, {
                method: "POST", headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }, body: JSON.stringify({category, representation})
            });
        } catch (error) {
        }

        let jsonData = await response?.json();
        if (response?.ok) {
            const sortOrder = {
                "I-I": 0, "I-II": 1, "I-III": 2
            };
            jsonData.sort((a, b) => {
                const networkTypeComparison = sortOrder[a.networkType] - sortOrder[b.networkType];

                if (networkTypeComparison === 0) {
                    return a.title.localeCompare(b.title);
                }

                return networkTypeComparison;
            });
            jsonData.map((item) => {
                item.enabled = isItemEnabled(item, guidedIndexRef.current);
            });
            setExercises(jsonData);
        } else {
            setMessage({error: jsonData?.error});
        }
        setLoading(false);
    }, [lang, category, representation]);

    let {changeEmotionSequence} = useAvatar();

	useEffect(() => {
        const greeted = localStorage.getItem("greeted-open");

        if(!greeted) {
            let openIntro = "¡Elige un ejercicio y vamos a trabajar!"

            changeEmotionSequence([{
                emotionDuring: NEUTRAL_SPEAKING,
                emotionAfter: NEUTRAL,
                text: openIntro,
                audio: `openIntro`,
                afterDelay: 500
            }]);
            localStorage.setItem("greeted-open", "true");
        }
	}, []);

    useEffect(() => {
        getExercises();
    }, [getExercises, category, representation]);

    let handleImageClick = (category, index) => {
        setSelectedImage(index);
        setCategory(category);
    };

    let handleRepresentationClick = (representation, index) => {
        setSelectedRepresentation(index);
        setRepresentation(representation);
    };

    const startDrag = (e) => {
        isDragging.current = true;
        startX.current = e.pageX - carouselRef.current.offsetLeft;
        scrollLeft.current = carouselRef.current.scrollLeft;
        velocity.current = 0;
        lastX.current = startX.current;
        lastTime.current = Date.now();
        cancelAnimationFrame(requestId.current);
    };

    const stopDrag = () => {
        isDragging.current = false;
        const inertiaScroll = () => {
            if (Math.abs(velocity.current) > 0) {
                if (Math.abs(velocity.current) < 0.25) {
                    velocity.current = 0;
                }
                if (velocity.current > 0) {
                    velocity.current -= 0.25;
                } else {
                    velocity.current += 0.25;
                }
                carouselRef.current.scrollLeft -= velocity.current;
                requestId.current = requestAnimationFrame(inertiaScroll);
            }
        };
        inertiaScroll();
    };

    const drag = (e) => {
        if (!isDragging.current) {
            return;
        }
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX.current) * 2;
        carouselRef.current.scrollLeft = scrollLeft.current - walk;

        const now = Date.now();
        const elapsed = now - lastTime.current;
        const deltaX = x - lastX.current;
        velocity.current = deltaX / (elapsed + 1) * 2;

        lastX.current = x;
        lastTime.current = now;

        requestId.current = requestAnimationFrame(() => drag(e));
    };

    let {Meta} = Card;

    let {Text, Title} = Typography;
    let networkTypeColors = {
        "I-I": "#ffc464", "I-II": "#16e8df", "I-III": "#cf8ffc"
    };
    return (<Spin spinning={loading} description="Loading" size="large">
            <div style={{width: "100vw", padding: "1vw", overflow: "hidden"}}>
                <Flex style={{position: "absolute", top: "1vmax", right: "3vmax", gap: "1rem"}}>
                    <Image
                        src={lang.startsWith("es") ? "/icons/es.png" : "/icons/es-bw.png"}
                        alt="Español"
                        width={70}
                        preview={false}
                        style={{cursor: "pointer"}}
                        onClick={() => {
                            setLang("es");
                            i18n.changeLanguage("es");
                        }}
                    />
                    <Image
                        src={lang.startsWith("en") ? "/icons/en.png" : "/icons/en-bw.png"}
                        alt="English"
                        width={70}
                        preview={false}
                        style={{cursor: "pointer"}}
                        onClick={() => {
                            setLang("en");
                            i18n.changeLanguage("en");
                        }}
                    />
                </Flex>
                {message?.error?.type &&
                    <Alert type="error" message={t(message?.error?.type)} showIcon style={{marginBottom: "1vh"}}/>}
                <Row justify="center" gutter={15} style={{marginBottom: "1vmax"}}>
                    {Object.values(REPRESENTATION)
                        .map((representation, index) => (<Col key={index}>
                                <div
                                    style={{cursor: "pointer"}}
                                >
                                    <Flex vertical align="center">
                                        <Image
                                            alt={t(`representation.${representation.toLocaleLowerCase()}`)}
                                            draggable={false}
                                            preview={false}
                                            src={`/representations/${representation.toLocaleLowerCase()}${selectedRepresentation === index ? "Color" : "BW"}.png`}
                                            width="6vmax"
                                            onClick={() => handleRepresentationClick(representation, index)}
                                        />
                                        {t(`representation.${representation.toLocaleLowerCase()}`)}
                                    </Flex>
                                </div>
                            </Col>))}
                </Row>
                <Row justify="center" gutter={15} style={{marginBottom: "1vmax", marginTop: "5vmax"}}>
                    {Object.values(CATEGORIES)
                        .map((category, index) => (<Col key={index}>
                                <div
                                    style={{cursor: "pointer"}}
                                >
                                    <Flex vertical align="center">
                                        <Image
                                            alt={t(`categories.${category.toLocaleLowerCase()}`)}
                                            draggable={false}
                                            preview={false}
                                            src={`/categories/${category.toLocaleLowerCase()}${selectedImage === index ? "Color" : "BW"}.png`}
                                            width="6vmax"
                                            onClick={() => handleImageClick(category, index)}
                                        />
                                        {t(`categories.${category.toLocaleLowerCase()}`)}
                                    </Flex>
                                </div>
                            </Col>))}
                </Row>
                {exercises.length > 0 ? (<div
                        ref={carouselRef}
                        onMouseDown={startDrag}
                        onMouseLeave={stopDrag}
                        onMouseUp={stopDrag}
                        onMouseMove={drag}
                        style={{
                            overflowX: "auto",
                            padding: "3vmax",
                            msOverflowStyle: "none",
                            scrollbarWidth: "none",
                            display: "flex",
                            flexDirection: "row",
                            gap: "1rem",
                            cursor: "grab"
                        }}
                    >
                        {exercises.map((card, index) => (["ICONIC", "MIXED"].includes(representation) ? <Card
                                key={index}
                                hoverable={card.enabled}
                                size="small"
                                style={{
                                    textAlign: "center",
                                    userSelect: "none",
                                    minWidth: "20vmax",
                                    height: "25vmax",
                                    alignItems: "center",
                                    opacity: card.enabled ? 1 : 0.7
                                }}
                                title={<Title level={4}
                                              style={{fontSize: "1.3vmax", textAlign: "center"}}>{card.title}</Title>}
                                onClick={() => {
                                    if (velocity.current === 0 && card.enabled) {
                                        card.representation = representation;
                                        setExercise(card);
                                        setFeedback({});
                                        navigate(`/exerciseDnD/phase1/free`);
                                    }
                                }}
                            >

                                <Image alt={card.title} draggable={false} preview={false} width="15vmax"
                                       src={`${process.env.REACT_APP_ARASAAC_URL}/pictograms/${card.mainImage}`}/>
                                <Divider style={{marginTop: "1vmax", marginBottom: "1vmax"}}/>
                                <Meta
                                    style={{backgroundColor: networkTypeColors[card.networkType], borderRadius: "12px"}}
                                    title={<Text style={{
                                        fontSize: "1.5vmax",
                                        textAlign: "center",
                                        color: "black"
                                    }}>{card.networkType}</Text>}/>
                            </Card> : <Card
                                key={index}
                                hoverable={card.enabled}
                                size="small"
                                style={{
                                    textAlign: "center",
                                    userSelect: "none",
                                    minWidth: "20vmax",
                                    height: "25vmax",
                                    alignItems: "center",
                                    opacity: card.enabled ? 1 : 0.7
                                }}
                                title={null}
                                onClick={() => {
                                    if (velocity.current === 0 && card.enabled) {
                                        card.representation = representation;
                                        setExercise(card);
                                        setFeedback({});
                                        if (representation === REPRESENTATION.SYMBOLIC) {
                                            navigate(`/exerciseType/phase1/free`);
                                        }
                                        if (representation === REPRESENTATION.GLOBAL) {
                                            navigate(`/exerciseDnD/phase1/free`);
                                        }
                                    }
                                }}
                            >
                                <Title style={{
                                    fontSize: "2.3vmax",
                                    textAlign: "center",
                                    marginTop: "8vmax"
                                }}>{card.title}</Title>
                                <Divider style={{marginTop: "9.45vmax", marginBottom: "1vmax"}}/>
                                <Meta
                                    style={{backgroundColor: networkTypeColors[card.networkType], borderRadius: "12px"}}
                                    title={<Text style={{
                                        fontSize: "1.5vmax",
                                        textAlign: "center",
                                        color: "black"
                                    }}>{card.networkType}</Text>}/>
                            </Card>))}
                    </div>) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("exercise.carousel.empty")}/>)}
            </div>
        </Spin>);
};

export default ExercisesCarousel;
