import { Button, Flex, Image } from "antd";
import { useTranslation }      from "react-i18next";
import { useNavigate }         from "react-router-dom";
import {useEffect} from "react";
import {useAvatar} from "../AvatarContext";
import {NEUTRAL, NEUTRAL_SPEAKING} from "../Avatar";

let SelectMode = () => {

    let { t } = useTranslation();

    let navigate = useNavigate();


    let { changeEmotionSequence } =  useAvatar();
    useEffect(() => {

        const hasVisited = localStorage.getItem("hasVisited-main");
        const greeted = localStorage.getItem("greeted-main");

        if(!greeted) {
            if (hasVisited) {
                localStorage.setItem("greeted-main", "true");
                let phrases = [
                    "¡Hola de nuevo! ¡Me alegra volver a verte!",
                    "¡Qué bien que estés aquí! ¡Vamos a trabajar!",
                    "¡Hola! ¡Trabajemos un rato juntos!",
                    "¡Me alegra verte! ¡Vamos a entrenar!",
                    "¡Qué bien que hayas vuelto! ¡Organicemos la información!",
                    "¡Hola de nuevo! ¡Vamos a trabajar!",
                    "¡Me encanta verte de nuevo! ¡Trabajemos juntos!",
                ]
                let index = Math.floor(Math.random() * phrases.length) + 1;

                changeEmotionSequence([
                    {
                        emotionDuring: NEUTRAL_SPEAKING,
                        emotionAfter: NEUTRAL,
                        text: phrases[index],
                        audio: `greeting${index}`,
                        afterDelay: 500
                    }
                ]);
            } else {
                localStorage.setItem("hasVisited-main", "true");
                localStorage.setItem("greeted-main", "true");

                changeEmotionSequence([
                    {
                        emotionDuring: NEUTRAL_SPEAKING,
                        emotionAfter: NEUTRAL,
                        text: "¡Hola! ¡Yo soy PEPI! Y voy a ayudarte a aprender a organizar la información.",
                        audio: "intro1",
                        afterDelay: 500
                    },
                    {
                        emotionDuring: NEUTRAL_SPEAKING,
                        emotionAfter: NEUTRAL,
                        text: "A veces, te saldrá a la primera. Otras, nos equivocaremos, pero cometer errores es normal, forma parte del aprendizaje.",
                        audio: "intro2",
                        afterDelay: 500
                    },
                    {
                        emotionDuring: NEUTRAL_SPEAKING,
                        emotionAfter: NEUTRAL,
                        text: "Lo importante es seguir intentándolo, así que, juntos, vamos a hacerlo lo mejor que podamos.",
                        audio: "intro3",
                        afterDelay: 500
                    },
                    {
                        emotionDuring: NEUTRAL_SPEAKING,
                        emotionAfter: NEUTRAL,
                        text: "Primero tienes que prepararte para luego empezar a entrenar. ¡Empieza por la preparación!",
                        audio: "intro4",
                        afterDelay: 500
                    }
                ]);
            }
        }
    }, []);

    return (
        <Flex justify="space-evenly" align="flex-start" style={ { width: "100%" } }>
            <Button  size="large" color="primary" variant="solid" block
                     style={ { width: "40%", height: "25vh", fontSize: "5vmin" } }
                     onClick={ () => navigate("/students/pretraining") }>
                <Flex vertical align="center" justify="space-between" gap={ 20 } style={ { paddingTop: "1vmax" } }>
                    <Image alt={t("student.mode.pretraining")} src="/icons/crawl.webp" height="13vmin" width="13vmin" preview={ false }/>
                    { t("student.mode.pretraining").toUpperCase() }
                </Flex>
            </Button>
            <Button size="large" color="primary" variant="solid" block
                    style={ { width: "40%", height: "25vh", fontSize: "5vmin" } }
                    onClick={ () => navigate("/students/trainingMode") }>
                <Flex vertical align="center" justify="space-between" gap={ 20 } style={ { paddingTop: "1vmax" } }>
                    <Image alt={t("student.mode.training")} src="/icons/running.webp" height="13vmin" width="13vmin" preview={ false }/>
                    { t("student.mode.training").toUpperCase() }
                </Flex>
            </Button>
        </Flex>
    );
};

export default SelectMode;