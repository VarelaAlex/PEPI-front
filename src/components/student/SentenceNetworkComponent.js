import React, {useEffect, useRef, useState, useMemo} from 'react';
import {Card, Image as AntdImage} from 'antd';
import {HomeOutlined} from '@ant-design/icons';
import {DndProvider, useDrop} from 'react-dnd';
import {MultiBackend} from 'dnd-multi-backend';
import {HTML5toTouch} from 'rdndmb-html5-to-touch';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import ActivityToolsComponent from "./dnd/ActivityToolsComponent";
import {CustomDragPreview} from "./dnd/CustomDragPreview";
import {DraggableWord} from "./dnd/DraggableWord";
import {usePretraining} from "../../hooks/usePretraining";
import {STOP} from "./NetworkProps";
import '../assets/styles/font.css';
import {useAvatar} from "../AvatarContext";
import {NEUTRAL, NEUTRAL_SPEAKING} from "../Avatar";
import {usePlayAudio} from "../../hooks/usePlayAudio";

const ItemTypes = {WORD: 'word'};

const DropZone = ({zone, placedWord, targetWord, onDrop, leftPlaced, onDropSuccess, onDropError}) => {
    // DropZone no longer manages unlocking — that's handled at parent level
    const [{isOver, canDrop}, drop] = useDrop({
        accept: ItemTypes.WORD, drop: (item) => {
            const isCorrect = item.word === targetWord;

            if (isCorrect) {
                onDrop(zone, {text: item.word, image: item.image});
                onDropSuccess();
            } else {
                onDropError();
            }
        }, canDrop: (item) => {
            // la zona right solo acepta si left ya está colocado (si quieres otra política modifícalo)
            if (zone === 'right' && !leftPlaced) return false;
            return item.word === targetWord;
        }, collect: (monitor) => ({
            isOver: monitor.isOver(), canDrop: monitor.canDrop()
        }), hover: (item, monitor) => {
            if (!monitor.canDrop()) {
                onDropError();
            }
        },
    });

    const backgroundColor = isOver && canDrop ? '#bae7ff' : '#e6f7ff';

    return (<div
        ref={drop}
        style={{
            width: 100,
            height: 80,
            border: '2px dashed #91d5ff',
            borderRadius: 8,
            background: backgroundColor,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}
    >
        {placedWord && (<div style={{textAlign: 'center'}}>
            <AntdImage
                src={placedWord.image}
                alt={placedWord.text}
                style={{width: 40, height: 40, objectFit: 'contain'}}
                preview={false}
            />
            <div style={{fontFamily: 'Massallera', fontSize: 14}}>
                {placedWord.text}
            </div>
        </div>)}
    </div>);
};

const SentenceNetwork = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    let play = usePlayAudio();
    const {maxUnlocked, updateUnlockedPhase, fetchUnlockedPhase} = usePretraining();

    const maxUnlockedRef = useRef(maxUnlocked);
    useEffect(() => {
        maxUnlockedRef.current = maxUnlocked;
    }, [maxUnlocked]);

    useEffect(() => {
        fetchUnlockedPhase();
    }, []);

    // base sentences (unchanged order inside each adjacent pair)
    const baseSentences = [{
        id: 1,
        phrase: [{
            text: "El perro",
            image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`,
            audio: ("dog")
        }, {text: "es", image: "/pictograms/is.png", audio: ("is"), draggable: true}, {
            text: "un animal",
            image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6901`,
            audio: ("animal")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("dog-animal")
    }, {
        id: 2,
        phrase: [{
            text: "El perro",
            image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`,
            audio: ("dog")
        }, {text: "tiene", image: "/pictograms/has.png", audio: ("has"), draggable: true}, {
            text: "cola",
            image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5967`,
            audio: ("tail")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("dog-tail")
    }, {
        id: 3,
        phrase: [{
            text: "La ballena",
            image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`,
            audio: ("whale")
        }, {text: "es", image: "/pictograms/is.png", audio: ("is"), draggable: true}, {
            text: "un mamífero",
            image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7777`,
            audio: ("mammal")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("whale-mammal")
    }, {
        id: 4,
        phrase: [{
            text: "La ballena",
            image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`,
            audio: ("whale")
        }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
            text: "el mar",
            image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`,
            audio: ("sea")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("whale-sea")
    }, // ... rest unchanged (kept as in original)
        {
            id: 5,
            phrase: [{
                text: "La casa",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6964`,
                audio: ("house")
            }, {text: "es para", image: "/pictograms/isFor.png", audio: ("isFor"), draggable: true}, {
                text: "vivir",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/11605`,
                audio: ("living")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("house-living")
        }, {
            id: 6,
            phrase: [{
                text: "La casa",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6964`,
                audio: ("house")
            }, {
                text: "sirve para",
                image: "/pictograms/isUsedFor.png",
                audio: ("isUsedFor"),
                draggable: true
            }, {
                text: "vivir",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/11605`,
                audio: ("living")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("house-living2")
        }, {
            id: 7,
            phrase: [{
                text: "El sol",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7252`,
                audio: ("sun")
            }, {text: "es", image: "/pictograms/is.png", audio: ("is"), draggable: true}, {
                text: "una estrella",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2752`,
                audio: ("star")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("sun-star")
        }, {
            id: 8,
            phrase: [{
                text: "El sol",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7252`,
                audio: ("sun")
            }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
                text: "el cielo",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6978`,
                audio: ("sunbathing")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("sun-sunbathing")
        }, {
            id: 9,
            phrase: [{
                text: "El verano",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5604`,
                audio: ("summer")
            }, {
                text: "es parte de",
                image: "/pictograms/isPartOf.png",
                audio: ("isPartOf"),
                draggable: true
            }, {
                text: "el año",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6903`,
                audio: ("year")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("summer-year")
        }, {
            id: 10,
            phrase: [{
                text: "El verano",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5604`,
                audio: ("summer")
            }, {
                text: "sirve para",
                image: "/pictograms/isUsedFor.png",
                audio: ("isUsedFor"),
                draggable: true
            }, {
                text: "tomar el sol",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/26500`,
                audio: ("sunbathing")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("summer-sunbathing")
        }, {
            id: 11,
            phrase: [{
                text: "La manzana",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2462`,
                audio: ("apple")
            }, {text: "es", image: "/pictograms/is.png", audio: ("is"), draggable: true}, {
                text: "una fruta",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/28339`,
                audio: ("fruit")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("apple-fruit")
        }, {
            id: 12,
            phrase: [{
                text: "La manzana",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2462`,
                audio: ("apple")
            }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
                text: "el frutero",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/16303`,
                audio: ("fruitBowl")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("apple-fruitBowl")
        }, {
            id: 13,
            phrase: [{
                text: "La cama",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/25900`,
                audio: ("bed")
            }, {text: "es para", image: "/pictograms/isFor.png", audio: ("isFor"), draggable: true}, {
                text: "dormir",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6479`,
                audio: ("sleeping")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("bed-sleeping")
        }, {
            id: 14,
            phrase: [{
                text: "La cama",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/25900`,
                audio: ("bed")
            }, {
                text: "está en",
                image: "/pictograms/isIn.png",
                audio: ("isIn"),
                draggable: true
            }, {
                text: "la habitación",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/33068`,
                audio: ("bedroom")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("bed-bedroom")
        }, {
            id: 15,
            phrase: [{
                text: "La calle",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2299`,
                audio: ("street")
            }, {
                text: "es parte de",
                image: "/pictograms/isPartOf.png",
                audio: ("isPartOf"),
                draggable: true
            }, {
                text: "la ciudad",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2704`,
                audio: ("city")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("street-city")
        }, {
            id: 16,
            phrase: [{
                text: "La calle",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2299`,
                audio: ("street")
            }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
                text: "la ciudad",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2704`,
                audio: ("city")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("street-city2")
        }, {
            id: 17,
            phrase: [{
                text: "El coche",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2339`,
                audio: ("car")
            }, {text: "es para", image: "/pictograms/isFor.png", audio: ("isFor"), draggable: true}, {
                text: "viajar",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/36974`,
                audio: ("traveling")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("car-traveling")
        }, {
            id: 18,
            phrase: [{
                text: "El coche",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2339`,
                audio: ("car")
            }, {text: "tiene", image: "/pictograms/has.png", audio: ("has"), draggable: true}, {
                text: "ruedas",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6209`,
                audio: ("wheels")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("car-wheels")
        }, {
            id: 19,
            phrase: [{
                text: "El columpio",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/4608`,
                audio: ("swing")
            }, {text: "es para", image: "/pictograms/isFor.png", audio: ("isFor"), draggable: true}, {
                text: "jugar",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6537`,
                audio: ("playing")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("swing-playing")
        }, {
            id: 20,
            phrase: [{
                text: "El columpio",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/4608`,
                audio: ("swing")
            }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
                text: "el parque",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2859`,
                audio: ("park")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("swing-park")
        }, {
            id: 21,
            phrase: [{
                text: "El agua",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2248`,
                audio: ("water")
            }, {text: "es para", image: "/pictograms/isFor.png", audio: ("isFor"), draggable: true}, {
                text: "beber",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6061`,
                audio: ("drinking")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("water-drinking")
        }, {
            id: 22,
            phrase: [{
                text: "El agua",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2248`,
                audio: ("water")
            }, {
                text: "sirve para",
                image: "/pictograms/isUsedFor.png",
                audio: ("isUsedFor"),
                draggable: true
            }, {
                text: "lavarse",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/26803`,
                audio: ("washing")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("water-drinking")
        }, {
            id: 23,
            phrase: [{
                text: "El mar",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`,
                audio: ("sea")
            }, {text: "es para", image: "/pictograms/isFor.png", audio: ("isFor"), draggable: true}, {
                text: "bañarse",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/38782`,
                audio: ("bathing")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("sea-bathing")
        }, {
            id: 24,
            phrase: [{
                text: "El mar",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`,
                audio: ("sea")
            }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
                text: "la playa",
                image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/30518`,
                audio: ("beach")
            }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
            audio: ("sea-beach")
        }];

    // Build pairs and shuffle pairs while keeping internal pair order
    const shuffledSentences = useMemo(() => {
        const pairs = [];
        for (let i = 0; i < baseSentences.length; i += 2) {
            const second = baseSentences[i + 1];
            // ensure there's a second (defensive)
            if (second) pairs.push([baseSentences[i], second]);
        }
        // Fisher-Yates shuffle on pairs
        for (let i = pairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
        }
        return pairs.flat();
    }, []); // run once on mount

    // fijas que solicitaste (siempre las mismas)
    const leftFixed = [{
        text: 'es', image: '/pictograms/is.png', audio: ("is")
    }, {
        text: 'es parte de', image: '/pictograms/isPartOf.png', audio: ("isPartOf")
    }, {text: 'es para', image: '/pictograms/isFor.png', audio: ("isFor")}];

    const rightFixed = [{
        text: 'tiene', image: '/pictograms/has.png', audio: ("has")
    }, {text: 'está en', image: '/pictograms/isIn.png', audio: ("isIn")}, {
        text: 'sirve para', image: '/pictograms/isUsedFor.png', audio: ("isUsedFor")
    }];

    // estado de colocación en las zonas
    const [placedLinks, setPlacedLinks] = useState({left: null, right: null});
    const [currentPairIndex, setCurrentPairIndex] = useState(0);
    const [showNetwork, setShowNetwork] = useState(false);

    // track completed pairs correctly
    const [completedPairs, setCompletedPairs] = useState(0);
    const unlockAppliedRef = useRef(false);

    // audio central: arranca con la primera frase del par actual
    const currentAudioRef = useRef(shuffledSentences[0]?.audio || null);

    // zona actual: par de frases (two sentences) - DEFINIR AQUÍ ANTES DE USARLO
    const currentSentences = shuffledSentences.slice(currentPairIndex, currentPairIndex + 2);

    // Inactividad: reproducir audio del pictograma a mover tras 5 segundos
    const inactivityTimerRef = useRef(null);
    const playRef = useRef(play);
    const hasPlayedInitialAudioRef = useRef(false);

    useEffect(() => {
        playRef.current = play;
    }, [play]);

    let {changeEmotionSequence} = useAvatar();
    useEffect(() => {
        changeEmotionSequence([{
            emotionDuring: NEUTRAL_SPEAKING,
            emotionAfter: NEUTRAL,
            text: "¡Ahora vamos a colocar los pictogramas en mi red! ¿ves que tiene dos lados? Escucha y coloca el pictograma a cada lado de la red.",
            audio: "intro-activity5",
            afterDelay: 500,
            onEnd: () => {
                hasPlayedInitialAudioRef.current = true;
                // Reproducir el primer audio a colocar después del intro
                setTimeout(() => {
                    const audioToPlay = shuffledSentences[0]?.phrase[1]?.audio;
                    if (audioToPlay) {
                        playRef.current(audioToPlay);
                    }
                }, 300);
            }
        }]);
    }, []);

    // ...existing code...

    useEffect(() => {
        currentAudioRef.current = shuffledSentences[currentPairIndex]?.audio;
    }, [currentPairIndex, shuffledSentences]);

    useEffect(() => {
        const timer = setTimeout(() => setShowNetwork(true), 200);
        return () => clearTimeout(timer);
    }, [currentPairIndex]);

    useEffect(() => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
        }
        const resetTimeout = () => {
            clearTimeout(inactivityTimerRef.current);
            if (hasPlayedInitialAudioRef.current && (!placedLinks.left || !placedLinks.right)) {
                inactivityTimerRef.current = setTimeout(() => {
                    // Reproducir el audio del pictograma que debe colocarse
                    const audioToPlay = placedLinks.left
                        ? currentSentences[1]?.phrase[1]?.audio
                        : currentSentences[0]?.phrase[1]?.audio;
                    if (audioToPlay) {
                        playRef.current(audioToPlay);
                    }
                }, 5000);
            }
        };

        const events = ["click", "keydown", "touchstart", "mousemove"];
        events.forEach(e => window.addEventListener(e, resetTimeout));

        resetTimeout();

        return () => {
            if (inactivityTimerRef.current) {
                clearTimeout(inactivityTimerRef.current);
            }
            events.forEach(e => window.removeEventListener(e, resetTimeout));
        };
    }, [placedLinks.left, placedLinks.right, currentSentences]);

    // Reproducir audio después de colocar el primer pictograma
    useEffect(() => {
        if (hasPlayedInitialAudioRef.current && placedLinks.left && !placedLinks.right) {
            // Pequeño delay para que el usuario perciba el cambio
            const timer = setTimeout(() => {
                const audioToPlay = currentSentences[1]?.phrase[1]?.audio;
                if (audioToPlay) {
                    playRef.current(audioToPlay);
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [placedLinks.left, placedLinks.right, currentSentences]);

    // Reproducir audio del primer pictograma cuando se cambia de red
    useEffect(() => {
        if (hasPlayedInitialAudioRef.current && !placedLinks.left && !placedLinks.right) {
            // Pequeño delay cuando se cambia de red
            const timer = setTimeout(() => {
                const audioToPlay = currentSentences[0]?.phrase[1]?.audio;
                if (audioToPlay) {
                    playRef.current(audioToPlay);
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentPairIndex, placedLinks.left, placedLinks.right, currentSentences]);

    // when completedPairs reaches 5, run update + navigate (once)
    useEffect(() => {
        if (completedPairs === 5 && !unlockAppliedRef.current) {
            unlockAppliedRef.current = true;
            if (maxUnlockedRef.current <= 5) {
                updateUnlockedPhase(maxUnlockedRef.current + 1)
                    .then(() => console.log("Fase desbloqueada actualizada"))
                    .catch((err) => console.error(err));
            }
            setTimeout(() => navigate("/students/pretraining/block/3/activity/2"), 1200);
        }
    }, [completedPairs, updateUnlockedPhase, navigate]);

    const handleNextPair = () => {
        const nextPairStart = currentPairIndex + 2;
        if (nextPairStart >= shuffledSentences.length - 1) {
            // if not more pairs, navigate as before (keep the same route)
            setTimeout(() => navigate("/students/pretraining/block/3/activity/2"), 1200);
        } else {
            setPlacedLinks({left: null, right: null});
            setShowNetwork(false);
            setCurrentPairIndex(prev => prev + 2);
        }
    };

    const handleDrop = (zone, word) => {
        setPlacedLinks(prev => {
            const newLinks = {...prev, [zone]: word};

            // cuando colocas en la izquierda correctamente, cambiamos audio central al de la segunda frase
            if (zone === 'left') {
                currentAudioRef.current = shuffledSentences[currentPairIndex + 1]?.audio || currentAudioRef.current;
            }

            if (newLinks.left && newLinks.right) {
                // both placed correctly: increment completedPairs and move to next pair
                setCompletedPairs(prev => prev + 1);
                setTimeout(() => handleNextPair(), 800);
            }

            return newLinks;
        });
    };

    // estilo compactado verticalmente
    const columnStyle = {
        display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginTop: 8
    };

    const rowStyle = {
        display: 'flex', gap: 12, justifyContent: 'center'
    };

    return (<DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <CustomDragPreview/>
        <Card style={{padding: 20, minWidth: 900, marginTop: '2vw', fontFamily: "Massallera"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1vh"}}>
                <div style={{flex: 1}}>
                    <ActivityToolsComponent
                        content={t("Escucha y completa la red")}
                        playHelp={() => play(("sentenceActivity1Help"))}
                    />
                </div>
                <HomeOutlined style={{fontSize: "45px", cursor: "pointer", paddingLeft: "20px"}} onClick={() => {
                    navigate("/students/pretraining/");
                }}/>
            </div>

            {/* Pictogramas izquierda - play central - pictogramas derecha */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 24,
                marginTop: 6,
                marginBottom: 6
            }}>
                {/* Columna izquierda: 2 arriba, 1 abajo */}
                <div style={columnStyle}>
                    <div style={rowStyle}>
                        <DraggableWord
                            key="left-2"
                            wordData={{word: leftFixed[0].text, text: leftFixed[0].text, image: leftFixed[0].image}}
                            isPlaced={(placedLinks.left && placedLinks.left.text === leftFixed[0].text) || (placedLinks.right && placedLinks.right.text === leftFixed[0].text)}
                        />
                    </div>
                    <div style={rowStyle}>
                        {leftFixed.slice(1, 3).map((w, i) => (<DraggableWord
                                key={`left-${i}`}
                                wordData={{word: w.text, text: w.text, image: w.image}}
                                isPlaced={(placedLinks.left && placedLinks.left.text === w.text) || (placedLinks.right && placedLinks.right.text === w.text)}
                            />))}
                    </div>
                </div>

                {/* Columna derecha: 2 arriba, 1 abajo */}
                <div style={columnStyle}>
                    <div style={rowStyle}>
                        <DraggableWord
                            key="right-2"
                            wordData={{word: rightFixed[0].text, text: rightFixed[0].text, image: rightFixed[0].image}}
                            isPlaced={(placedLinks.left && placedLinks.left.text === rightFixed[0].text) || (placedLinks.right && placedLinks.right.text === rightFixed[0].text)}
                        />
                    </div>
                    <div style={rowStyle}>
                        {rightFixed.slice(1, 3).map((w, i) => (<DraggableWord
                                key={`right-${i}`}
                                wordData={{word: w.text, text: w.text, image: w.image}}
                                isPlaced={(placedLinks.left && placedLinks.left.text === w.text) || (placedLinks.right && placedLinks.right.text === w.text)}
                            />))}
                    </div>
                </div>
            </div>

            {/* Red SVG + DropZones (más cerca de pictogramas, menos separación) */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 10,
                opacity: showNetwork ? 1 : 0,
                transition: 'opacity 0.25s ease-in-out'
            }}>
                <svg width="900" height="380" viewBox="0 0 900 380">
                    {/* Nodo central */}
                    <rect x="370" y="12" width="160" height="100" rx="12" fill="white" stroke="black"
                          strokeWidth="2"/>
                    <foreignObject x="370" y="12" width="160" height="100">
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <AntdImage src={currentSentences[0].phrase[0].image}
                                       alt={currentSentences[0].phrase[0].text}
                                       style={{width: 60, height: 60, objectFit: 'contain', marginBottom: 4}}
                                       preview={false}/>
                            <div style={{
                                fontFamily: 'Massallera', fontSize: 15
                            }}>{currentSentences[0].phrase[0].text}</div>
                        </div>
                    </foreignObject>

                    {/* líneas */}
                    <line x1="450" y1="112" x2="450" y2="138" stroke="#000" strokeWidth="2"/>
                    <line x1="450" y1="138" x2="250" y2="138" stroke="#000" strokeWidth="2"/>
                    <line x1="250" y1="138" x2="250" y2="250" stroke="#000" strokeWidth="2"/>
                    <line x1="450" y1="138" x2="650" y2="138" stroke="#000" strokeWidth="2"/>
                    <line x1="650" y1="138" x2="650" y2="250" stroke="#000" strokeWidth="2"/>

                    {/* DropZone izquierda */}
                    <foreignObject x="200" y="150" width="110" height="80">
                        <DropZone zone="left" placedWord={placedLinks.left}
                                  targetWord={currentSentences[0].phrase[1].text}
                                  onDrop={handleDrop} leftPlaced={!!placedLinks.left}
                                  onDropSuccess={() => play("correct")}
                                  onDropError={() => play("error")}
                                  play={() => play(currentSentences[0].phrase[1].audio)}/>
                    </foreignObject>

                    {/* DropZone derecha */}
                    <foreignObject x="600" y="150" width="110" height="80">
                        <DropZone zone="right" placedWord={placedLinks.right}
                                  targetWord={currentSentences[1].phrase[1].text}
                                  onDrop={handleDrop} leftPlaced={!!placedLinks.left}
                                  onDropSuccess={() => play("correct")}
                                  onDropError={() => play("error")}
                                  play={() => play(currentSentences[1].phrase[1].audio)}/>
                    </foreignObject>

                    {/* STOP pictograms bajo nodos */}
                    <image x="350" y="280" style={{height: '2.8vmax'}}
                           href={`${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`}/>
                    <ellipse cx="250" cy="290" rx="80" ry="46" fill="white" stroke="black" strokeWidth="2"/>
                    <foreignObject x="185" y="245" width="130" height="80">
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <AntdImage src={currentSentences[0].phrase[2].image}
                                       alt={currentSentences[0].phrase[2].text}
                                       style={{width: 60, height: 60, objectFit: 'contain', marginBottom: 4}}
                                       preview={false}/>
                            <div style={{
                                fontFamily: 'Massallera', fontSize: 14
                            }}>{currentSentences[0].phrase[2].text}</div>
                        </div>
                    </foreignObject>

                    <image x="750" y="280" style={{height: '2.8vmax'}}
                           href={`${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`}/>
                    <ellipse cx="650" cy="290" rx="80" ry="46" fill="white" stroke="black" strokeWidth="2"/>
                    <foreignObject x="585" y="245" width="130" height="80">
                        <div style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <AntdImage src={currentSentences[1].phrase[2].image}
                                       alt={currentSentences[1].phrase[2].text}
                                       style={{width: 60, height: 60, objectFit: 'contain', marginBottom: 4}}
                                       preview={false}/>
                            <div style={{
                                fontFamily: 'Massallera', fontSize: 14
                            }}>{currentSentences[1].phrase[2].text}</div>
                        </div>
                    </foreignObject>
                </svg>
            </div>
        </Card>
    </DndProvider>);
};

export default SentenceNetwork;
