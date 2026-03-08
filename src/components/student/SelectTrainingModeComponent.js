import { Button, Flex, Image } from "antd";
import { useTranslation }      from "react-i18next";
import { useNavigate }         from "react-router-dom";
import {useAvatar} from "../AvatarContext";
import {useEffect} from "react";
import {NEUTRAL, NEUTRAL_SPEAKING} from "../Avatar";

let SelectTrainingMode = () => {

    let { t } = useTranslation();

    let navigate = useNavigate();

    let { changeEmotionSequence } =  useAvatar();
    useEffect(() => {

        const hasVisited = localStorage.getItem("hasVisited-training");
        const greeted = localStorage.getItem("greeted-training");

        if(!greeted) {
            if (hasVisited) {
                localStorage.setItem("greeted-training", "true");
                let phrases = [
                    "¡Vamos a seguir entrenando!",
                    "¡Allá vamos! ¡Seguimos trabajando!",
                    "¡Vamos a trabajar!",
                    "¡A por ello! Vamos a seguir entrenando.",

                ]
                let index = Math.floor(Math.random() * phrases.length) + 1;

                changeEmotionSequence([
                    {
                        emotionDuring: NEUTRAL_SPEAKING,
                        emotionAfter: NEUTRAL,
                        text: phrases[index],
                        audio: `greeting-training${index}`,
                        afterDelay: 500
                    }
                ]);
            } else {
                localStorage.setItem("hasVisited-training", "true");
                localStorage.setItem("greeted-training", "true");

                changeEmotionSequence([
                    {
                        emotionDuring: NEUTRAL_SPEAKING,
                        emotionAfter: NEUTRAL,
                        text: "¡Vamos a empezar a entrenar! Es mejor que lo hagas siguiendo un orden, pero también puedes trabajar de forma libre. Empieza por el entrenamiento cerrado y cuando lo termines pasa al abierto.",
                        audio: "intro-training1",
                        afterDelay: 500
                    },
                ]);
            }
        }
    }, []);

    return (
        <Flex justify="space-evenly" align="flex-start" style={ { width: "100%" } }>
            <Button size="large" color="primary" variant="solid" block
                    style={ { width: "40%", height: "25vh", fontSize: "5vmin" } }
                    onClick={ () => navigate("/students/exercises/ruled") }>
                <Flex vertical align="center" justify="space-between" gap={ 20 } style={ { paddingTop: "1vmax" } }>
                    <Image alt={t("student.trainingMode.ruled")} src="/icons/locked.png" height="13vmin" width="13vmin" preview={ false }/>
                    { t("student.trainingMode.ruled").toUpperCase() }
                </Flex>
            </Button>
            <Button  size="large" color="primary" variant="solid" block
                     style={ { width: "40%", height: "25vh", fontSize: "5vmin" } }
                     onClick={ () => navigate("/students/exercises/free") }>
                <Flex vertical align="center" justify="space-between" gap={ 20 } style={ { paddingTop: "1vmax" } }>
                    <Image alt={t("student.trainingMode.free")} src="/icons/unlocked.png" height="13vmin" width="13vmin" preview={ false }/>
                    { t("student.trainingMode.free").toUpperCase() }
                </Flex>
            </Button>
        </Flex>
    );
};

export default SelectTrainingMode;