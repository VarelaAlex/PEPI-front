import React, {useEffect, useMemo, useRef, useState} from 'react';
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
import {baseSentences} from "./exercises/data";
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
                onDrop(zone, {token: item.word, text: item.label, image: item.image});
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
    }, [fetchUnlockedPhase]);

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

    const getWordText = (wordData) => t(`sentenceWords.${wordData.audio}`, {defaultValue: wordData.text || ""});

    // fijas que solicitaste (siempre las mismas)
    const leftFixed = [{
        id: 'is',
        word: 'is',
        text: t("pictograms.is"),
        image: '/pictograms/is.png',
        audio: ("is")
    }, {
        id: 'isPartOf',
        word: 'isPartOf',
        text: t("pictograms.isPartOf"),
        image: '/pictograms/isPartOf.png',
        audio: ("isPartOf")
    }, {
        id: 'isFor',
        word: 'isFor',
        text: t("pictograms.isFor"),
        image: '/pictograms/isFor.png',
        audio: ("isFor")
    }];

    const rightFixed = [{
        id: 'has',
        word: 'has',
        text: t("pictograms.has"),
        image: '/pictograms/has.png',
        audio: ("has")
    }, {
        id: 'isIn',
        word: 'isIn',
        text: t("pictograms.isIn"),
        image: '/pictograms/isIn.png',
        audio: ("isIn")
    }, {
        id: 'isUsedFor',
        word: 'isUsedFor',
        text: t("pictograms.isUsedFor"),
        image: '/pictograms/isUsedFor.png',
        audio: ("isUsedFor")
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
            text: t("sentenceNetworkActivity.avatarIntro"),
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
                    const audioToPlay = placedLinks.left ? currentSentences[1]?.phrase[1]?.audio : currentSentences[0]?.phrase[1]?.audio;
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
                        content={t("sentenceNetworkActivity.instructions.listenAndComplete")}
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
                            wordData={{word: leftFixed[0].word, text: leftFixed[0].text, image: leftFixed[0].image}}
                            isPlaced={(placedLinks.left && placedLinks.left.token === leftFixed[0].word) || (placedLinks.right && placedLinks.right.token === leftFixed[0].word)}
                        />
                    </div>
                    <div style={rowStyle}>
                        {leftFixed.slice(1, 3).map((w, i) => (<DraggableWord
                            key={`left-${i}`}
                            wordData={{word: w.word, text: w.text, image: w.image}}
                            isPlaced={(placedLinks.left && placedLinks.left.token === w.word) || (placedLinks.right && placedLinks.right.token === w.word)}
                        />))}
                    </div>
                </div>

                {/* Columna derecha: 2 arriba, 1 abajo */}
                <div style={columnStyle}>
                    <div style={rowStyle}>
                        <DraggableWord
                            key="right-2"
                            wordData={{word: rightFixed[0].word, text: rightFixed[0].text, image: rightFixed[0].image}}
                            isPlaced={(placedLinks.left && placedLinks.left.token === rightFixed[0].word) || (placedLinks.right && placedLinks.right.token === rightFixed[0].word)}
                        />
                    </div>
                    <div style={rowStyle}>
                        {rightFixed.slice(1, 3).map((w, i) => (<DraggableWord
                            key={`right-${i}`}
                            wordData={{word: w.word, text: w.text, image: w.image}}
                            isPlaced={(placedLinks.left && placedLinks.left.token === w.word) || (placedLinks.right && placedLinks.right.token === w.word)}
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
                                       alt={getWordText(currentSentences[0].phrase[0])}
                                       style={{width: 60, height: 60, objectFit: 'contain', marginBottom: 4}}
                                       preview={false}/>
                            <div style={{
                                fontFamily: 'Massallera', fontSize: 15
                            }}>{getWordText(currentSentences[0].phrase[0])}</div>
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
                                  targetWord={currentSentences[0].phrase[1].audio}
                                  onDrop={handleDrop} leftPlaced={!!placedLinks.left}
                                  onDropSuccess={() => play("correct")}
                                  onDropError={() => play("error")}
                                  play={() => play(currentSentences[0].phrase[1].audio)}/>
                    </foreignObject>

                    {/* DropZone derecha */}
                    <foreignObject x="600" y="150" width="110" height="80">
                        <DropZone zone="right" placedWord={placedLinks.right}
                                  targetWord={currentSentences[1].phrase[1].audio}
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
                                       alt={getWordText(currentSentences[0].phrase[2])}
                                       style={{width: 60, height: 60, objectFit: 'contain', marginBottom: 4}}
                                       preview={false}/>
                            <div style={{
                                fontFamily: 'Massallera', fontSize: 14
                            }}>{getWordText(currentSentences[0].phrase[2])}</div>
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
                                       alt={getWordText(currentSentences[1].phrase[2])}
                                       style={{width: 60, height: 60, objectFit: 'contain', marginBottom: 4}}
                                       preview={false}/>
                            <div style={{
                                fontFamily: 'Massallera', fontSize: 14
                            }}>{getWordText(currentSentences[1].phrase[2])}</div>
                        </div>
                    </foreignObject>
                </svg>
            </div>
        </Card>
    </DndProvider>);
};

export default SentenceNetwork;
