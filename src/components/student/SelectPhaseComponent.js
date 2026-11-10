import { Card, Col, Row, Spin, Typography, Image } from "antd";
import { useNavigate } from "react-router-dom";
import { usePretraining } from "../../hooks/usePretraining";
import { useEffect } from "react";
import "../assets/styles/font.css";
import {useAvatar} from "../AvatarContext";
import {NEUTRAL, NEUTRAL_SPEAKING} from "../Avatar";
import {useTranslation} from "react-i18next";

const SelectPhase = () => {

    let {t} = useTranslation();
    const navigate = useNavigate();
    const { maxUnlocked, loading, fetchUnlockedPhase } = usePretraining();

    const navigateMap = {
        1: "/students/pretraining/block/1/activity/1",
        2: "/students/pretraining/block/1/activity/2",
        3: "/students/pretraining/block/2/activity/1",
        4: "/students/pretraining/block/2/activity/2",
        5: "/students/pretraining/block/3/activity/1",
        6: "/students/pretraining/block/3/activity/2",
    };

    useEffect(() => {
        fetchUnlockedPhase();
    }, [fetchUnlockedPhase]);

    const phases = [1, 2, 3, 4, 5, 6];

    let { Title } = Typography;

    let { changeEmotionSequence } =  useAvatar();
    useEffect(() => {

        const hasVisited = localStorage.getItem("hasVisited-pretraining");
        const greeted = localStorage.getItem("greeted-pretraining");

        if(!greeted) {
            if (hasVisited) {
                localStorage.setItem("greeted-pretraining", "true");
                let phrases = [
                    "¡Vamos a seguir trabajando! ¡Voy a seguir enseñándote mis pictogramas!",
                    "¡A trabajar! ¡Vamos a por ello!",
                    "¡Seguimos aprendiendo los pictogramas!",
                    "¡Voy a enseñarte algo más sobre mis pictogramas!",
                ]
                let index = Math.floor(Math.random() * phrases.length) + 1;

                changeEmotionSequence([
                    {
                        emotionDuring: NEUTRAL_SPEAKING,
                        emotionAfter: NEUTRAL,
                        text: phrases[index],
                        audio: `greeting-pretraining${index}`,
                        afterDelay: 500
                    }
                ]);
            } else {
                localStorage.setItem("hasVisited-pretraining", "true");
                localStorage.setItem("greeted-pretraining", "true");

                changeEmotionSequence([
                    {
                        emotionDuring: NEUTRAL_SPEAKING,
                        emotionAfter: NEUTRAL,
                        text: "Te voy a enseñar algunos elementos que tienes que aprender para poder organizar la información.",
                        audio: "intro-pretraining1",
                        afterDelay: 500
                    },
                    {
                        emotionDuring: NEUTRAL_SPEAKING,
                        emotionAfter: NEUTRAL,
                        text: "¡Se llaman pictogramas!",
                        audio: "intro-pretraining2",
                        afterDelay: 500
                    },
                    {
                        emotionDuring: NEUTRAL_SPEAKING,
                        emotionAfter: NEUTRAL,
                        text: "¡Haz cada una de las actividades que te voy a enseñar!",
                        audio: "intro-pretraining3",
                        afterDelay: 500
                    }
                ]);
            }
        }
    }, []);

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    return (
        <Card style={{ maxWidth: "80%"}}>
            <Row gutter={[64, 32]} justify="center" align="middle" style={{ marginBottom: "5vh" }}>
                <Col>
                    <Title style={{ fontFamily: "Massallera", color: "#3070a5" }}>{t("pretraining.select")}</Title>
                </Col>
            </Row>
            <Row gutter={[32, 32]} justify="center" align="middle">
                {phases.map((num) => {
                    const disabled = num > maxUnlocked;

                    return (
                        <Col
                            key={num}
                            span={8}
                            style={{
                                marginLeft: disabled ? "-16px" : "0px",
                                marginRight: disabled ? "-16px" : "0px",
                                transition: "margin 0.3s ease",
                            }}
                        >
                            <Card
                                hoverable={!disabled}
                                style={{
                                    width: "100%",
                                    textAlign: "center",
                                    opacity: disabled ? 0.5 : 1,
                                    transform: disabled ? "scale(0.85)" : "scale(1)",
                                    cursor: disabled ? "not-allowed" : "pointer",
                                }}
                                onClick={() => {
                                    if (!disabled) navigate(navigateMap[num]);
                                }}
                            >
                                <Title
                                    style={{ fontFamily: "Massallera", color: "#3070a5", fontSize: 45 }}
                                >
                                    {num}
                                </Title>
                                {/*<Image src={`/images/activity${num}.webp`} preview={false} height="100%"/>*/}
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </Card>
    );
};

export default SelectPhase;
