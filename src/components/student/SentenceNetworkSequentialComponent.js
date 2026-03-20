import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Button, Card, Image as AntdImage} from 'antd';
import {HomeOutlined, SoundOutlined} from '@ant-design/icons';
import {DndProvider, useDrop} from 'react-dnd';
import {MultiBackend} from 'dnd-multi-backend';
import {HTML5toTouch} from 'rdndmb-html5-to-touch';
import {useTranslation} from "react-i18next";
import ActivityToolsComponent from "./dnd/ActivityToolsComponent";
import {CustomDragPreview} from "./dnd/CustomDragPreview";
import {DraggableWord} from "./dnd/DraggableWord";
import {StaticWord} from "./dnd/StaticWord";
import '../assets/styles/font.css';
import {sentences} from "./exercises/data";
import {useNavigate} from 'react-router-dom';
import {useAvatar} from "../AvatarContext";
import {NEUTRAL, NEUTRAL_SPEAKING} from "../Avatar";
import {usePlayAudio} from "../../hooks/usePlayAudio";

const ItemTypes = {WORD: 'word'};

const DropZone = ({zone, placedWord, onDrop, canDropHere}) => {
    const [{isOver}, drop] = useDrop({
        accept: ItemTypes.WORD, drop: (item) => {
            onDrop(zone, item.word, item.wordKey, item.image, item.label);
        }, canDrop: () => true, collect: (monitor) => ({
            isOver: monitor.isOver()
        }),
    });

    const backgroundColor = isOver && canDropHere ? '#bae7ff' : '#e6f7ff';

    return (<div ref={drop} style={{
        width: 100,
        height: 80,
        border: '2px dashed #91d5ff',
        borderRadius: 8,
        background: backgroundColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: placedWord ? 'default' : 'pointer'
    }}>
        {placedWord && (<div style={{textAlign: 'center'}}>
            <AntdImage src={placedWord.image} alt={placedWord.text}
                       style={{width: 40, height: 40, objectFit: 'contain'}} preview={false}/>
            <div style={{fontFamily: 'Massallera', fontSize: 14}}>{placedWord.text}</div>
        </div>)}
    </div>);
};

const SentenceNetworkSequential = ({updateUnlockedPhase}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const getWordText = (wordData) => t(`sentenceWords.${wordData.audio}`, {defaultValue: wordData.text || ""});

    let play = usePlayAudio();
    const audioRef = useRef(null);
    const playRef = useRef(play);
    const hasPlayedInitialAudioRef = useRef(false);
    const isAudioPlayingRef = useRef(false);

    useEffect(() => {
        playRef.current = play;
    }, []);

    const playAudioSequentially = (audioKey) => {
        const audio = play(audioKey);
        audioRef.current = audio;
        if (audio) {
            isAudioPlayingRef.current = true;
            audio.onended = () => {
                isAudioPlayingRef.current = false;
            };
        }
        return audio;
    };

    const initializePlacedWords = () => {
        const initialState = {
            center: null, linkLeft: null, linkRight: null, endLeft: null, endRight: null, dotLeft: null, dotRight: null
        };
        sentences.forEach((sentence, sentenceIdx) => {
            sentence.phrase.forEach((_, wordIdx) => {
                initialState[`s${sentenceIdx}w${wordIdx}`] = null;
            });
        });
        return initialState;
    };

    const [placedWords, setPlacedWords] = useState(initializePlacedWords());
    const [currentStep, setCurrentStep] = useState(0);
    // trioPointer is index into the shuffled trio order
    const [trioPointer, setTrioPointer] = useState(0);
    const [showNetwork, setShowNetwork] = useState(false);
    const [, setCompletedTrios] = useState(0);

    const audioHelpRef = useRef(("sentenceActivity2Help"));
    const closingPhrases = t("sentenceNetworkSequentialActivity.closing", {returnObjects: true});

    // compute trio count and a shuffled order of trio indices (Fisher-Yates)
    const trioCount = Math.floor(sentences.length / 3);
    const trioOrder = useMemo(() => {
        const arr = Array.from({length: trioCount}, (_, i) => i);
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }, [trioCount]);

    // current trio number (0-based trio index in original sentences)
    const currentTrioIndex = trioOrder[trioPointer] ?? 0;

    let {changeEmotionSequence} = useAvatar();
    useEffect(() => {

        changeEmotionSequence([{
            emotionDuring: NEUTRAL_SPEAKING,
            emotionAfter: NEUTRAL,
            text: t("sentenceNetworkSequentialActivity.avatarIntro"),
            audio: "intro-activity6",
            afterDelay: 500,
            onEnd: () => {
                hasPlayedInitialAudioRef.current = true;
                // Reproducir el primer audio a colocar después del intro
                setTimeout(() => {
                    const firstTrioIndex = trioOrder[0] ?? 0;
                    const firstAudio = sentences[firstTrioIndex * 3]?.audio;
                    if (firstAudio) {
                        playRef.current(firstAudio);
                    }
                }, 300);
            }
        }]);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setShowNetwork(true), 1000);
        return () => clearTimeout(timer);
    }, [currentTrioIndex]);

    const firstSentenceIdx = currentTrioIndex * 3;
    const secondSentenceIdx = currentTrioIndex * 3 + 1;
    const thirdSentenceIdx = currentTrioIndex * 3 + 2;

    const placementOrder = useMemo(() => [{
        key: 'center', audio: sentences[firstSentenceIdx].phrase[0].audio, sentence: firstSentenceIdx, wordIdx: 0
    }, {
        key: 'centerReuse', audio: sentences[secondSentenceIdx].phrase[0].audio, sentence: secondSentenceIdx, wordIdx: 0
    }, {
        key: 'linkLeft', audio: sentences[secondSentenceIdx].phrase[1].audio, sentence: secondSentenceIdx, wordIdx: 1
    }, {
        key: 'endLeft', audio: sentences[secondSentenceIdx].phrase[2].audio, sentence: secondSentenceIdx, wordIdx: 2
    }, {key: 'dotLeft', audio: sentences[secondSentenceIdx].phrase[3].audio, sentence: secondSentenceIdx, wordIdx: 3}, {
        key: 'centerReuse2', audio: sentences[thirdSentenceIdx].phrase[0].audio, sentence: thirdSentenceIdx, wordIdx: 0
    }, {
        key: 'linkRight', audio: sentences[thirdSentenceIdx].phrase[1].audio, sentence: thirdSentenceIdx, wordIdx: 1
    }, {
        key: 'endRight', audio: sentences[thirdSentenceIdx].phrase[2].audio, sentence: thirdSentenceIdx, wordIdx: 2
    }, {key: 'dotRight', audio: sentences[thirdSentenceIdx].phrase[3].audio, sentence: thirdSentenceIdx, wordIdx: 3},], [firstSentenceIdx, secondSentenceIdx, thirdSentenceIdx]);

    const handleDrop = (zone, word, wordKey, image, label) => {
        const expectedPlacement = placementOrder[currentStep];
        const isCorrectZone = expectedPlacement && (expectedPlacement.key === zone || (expectedPlacement.key === 'centerReuse' && zone === 'center') || (expectedPlacement.key === 'centerReuse2' && zone === 'center'));
        const isCorrectWord = expectedPlacement && expectedPlacement.audio === word;
        const isCorrectSentence = wordKey === `s${expectedPlacement.sentence}w${expectedPlacement.wordIdx}`;

        if (isCorrectZone && isCorrectWord && isCorrectSentence) {
            const zoneKey = (expectedPlacement.key === 'centerReuse' || expectedPlacement.key === 'centerReuse2') ? 'center' : expectedPlacement.key;
            const updates = {
                [zoneKey]: {token: word, text: label, image: image},
                [wordKey]: {token: word, text: label, image: image}
            };
            setPlacedWords(prev => ({...prev, ...updates}));
            playAudioSequentially("correct");

            if (currentStep === 0 || currentStep === 4) {
                setTimeout(() => {
                    setPlacedWords(prev => ({...prev, center: null}));
                }, 500);
            }

            // If completed this trio (last step)
            if (currentStep === 8) {
                setTimeout(() => {
                    // count this completed trio
                    setCompletedTrios(prev => {
                        const newCount = prev + 1;

                        // if reached 5, call updateUnlockedPhase and navigate
                        if (newCount >= 1) {
                            if (typeof updateUnlockedPhase === 'function') {
                                try {
                                    updateUnlockedPhase();
                                } catch (e) {
                                    // ignore errors from caller
                                }
                            }
                            const availableClosingPhrases = Array.isArray(closingPhrases) ? closingPhrases : [];
                            const selectedIndex = availableClosingPhrases.length > 1
                                ? Math.floor(Math.random() * availableClosingPhrases.length)
                                : 0;
                            const selectedPhrase = availableClosingPhrases[selectedIndex] || "";
                            const audioIndex = selectedIndex + 1;

                            changeEmotionSequence([{
                                emotionDuring: NEUTRAL_SPEAKING,
                                emotionAfter: NEUTRAL,
                                text: selectedPhrase,
                                audio: `preparation-end${audioIndex}`,
                                onEnd: () => {
                                    navigate('/students/selectMode')
                                },
                                afterDelay: 100
                            }]);

                        } else {
                            if (trioPointer < trioOrder.length - 1) {
                                setTrioPointer(prev => prev + 1);
                                setCurrentStep(0);
                                setShowNetwork(false);
                                setPlacedWords(initializePlacedWords());
                            } else {
                                // no more trios - keep UI consistent
                                setShowNetwork(false);
                            }
                        }

                        return newCount;
                    });
                }, 1000);
            } else {
                setCurrentStep(prev => prev + 1);
            }
        } else {
            playAudioSequentially("error");
        }
    };

    const getWordKey = (sentenceIdx, wordIdx) => `s${sentenceIdx}w${wordIdx}`;
    const isWordPlaced = (sentenceIdx, wordIdx) => {
        const wordKey = getWordKey(sentenceIdx, wordIdx);
        return placedWords[wordKey] !== null && placedWords[wordKey] !== undefined;
    };
    const canDropInZone = (zoneKey) => {
        const expectedPlacement = placementOrder[currentStep];
        if (!expectedPlacement) return false;
        if ((expectedPlacement.key === 'centerReuse' || expectedPlacement.key === 'centerReuse2') && zoneKey === 'center') return true;
        return expectedPlacement.key === zoneKey;
    };
    const isSentenceCompleted = (sentenceIdx) => {
        return sentences[sentenceIdx].phrase.every((_, wordIdx) => isWordPlaced(sentenceIdx, wordIdx));
    };

    const playCompleteSentence = (sentenceIdx, idx) => {
        const audio = playAudioSequentially(currentSentences[idx].audio);

        // Si es la primera frase (idx === 0), no reproducir stop
        if (idx === 0) {
            return;
        }

        // Para las otras frases, reproducir stop cuando termine la frase
        if (audio) {
            audio.onended = () => {
                playAudioSequentially("stop");
            };
        }
    };

    const currentSentences = [sentences[firstSentenceIdx], sentences[secondSentenceIdx], sentences[thirdSentenceIdx]];

    // Sistema de reproducción automática continua cada 5 segundos
    useEffect(() => {
        if (!hasPlayedInitialAudioRef.current || currentStep >= placementOrder.length) {
            return;
        }

        // Reproducir el audio cada 5 segundos continuamente
        const intervalId = setInterval(() => {
            if (!isAudioPlayingRef.current && hasPlayedInitialAudioRef.current) {
                const expectedPlacement = placementOrder[currentStep];
                if (expectedPlacement) {
                    // Reproducir solo el audio del elemento que debe colocarse
                    const sentenceToUse = [firstSentenceIdx, secondSentenceIdx, thirdSentenceIdx].find(idx => sentences[idx].phrase.some(p => p.audio === expectedPlacement.audio));
                    if (sentenceToUse !== undefined) {
                        const elementData = sentences[sentenceToUse].phrase.find(p => p.audio === expectedPlacement.audio);
                        if (elementData && elementData.audio) {
                            playRef.current(elementData.audio);
                        }
                    }
                }
            }
        }, 5000);

        return () => {
            clearInterval(intervalId);
        };
    }, [currentStep, placementOrder, firstSentenceIdx, secondSentenceIdx, thirdSentenceIdx]);

    return (<DndProvider backend={MultiBackend} options={HTML5toTouch}>
        <CustomDragPreview/>
        <Card style={{padding: 20, minWidth: 1000, margin: '0 auto', fontFamily: "Massallera"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <div style={{flex: 1}}>
                    <ActivityToolsComponent
                        content={t("sentenceNetworkSequentialActivity.instructions.listenAndPlace")}
                        playHelp={() => playAudioSequentially(audioHelpRef.current)}/>
                </div>
                <HomeOutlined style={{fontSize: "45px", cursor: "pointer", paddingLeft: "20px"}} onClick={() => {
                    navigate("/students/pretraining/");
                }}/>
            </div>

            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12
            }}>
                {currentSentences.map((sentence, idx) => {
                    const sentenceIdx = firstSentenceIdx + idx;
                    return (<div key={sentenceIdx}
                                 style={{display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: 8}}>
                        <div style={{display: 'flex', alignItems: 'center', flexWrap: 'nowrap'}}>
                            {sentence.phrase.map((wordData, wordIdx) => {
                                const wordKey = getWordKey(sentenceIdx, wordIdx);
                                const isPlaced = isWordPlaced(sentenceIdx, wordIdx);
                                const localizedWordData = {...wordData, text: getWordText(wordData)};

                                if (isPlaced) {
                                    return <StaticWord key={wordKey} wordData={localizedWordData}/>;
                                }

                                return <DraggableWord key={wordKey} wordData={localizedWordData} wordKey={wordKey}
                                                      isPlaced={isPlaced}
                                                      onDragStart={() => {
                                                      }}/>;
                            })}
                        </div>
                        {!isSentenceCompleted(sentenceIdx) && (
                            <Button icon={<SoundOutlined style={{fontSize: 50, color: 'black'}}/>}
                                    type="link"
                                    size="large"
                                    onClick={() => playCompleteSentence(sentenceIdx, idx)}/>)}
                    </div>);
                })}
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 20,
                opacity: showNetwork ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out'
            }}>
                <svg width="700" height="300" viewBox="0 0 900 380">
                    <rect x="370" y="20" width="160" height="110" rx="12" fill="white" stroke="black"
                          strokeWidth="2"/>
                    <foreignObject x="400" y="35" width="160" height="110">
                        <DropZone zone="center" placedWord={placedWords.center} onDrop={handleDrop}
                                  canDropHere={canDropInZone('center')}/>
                    </foreignObject>

                    <line x1="450" y1="130" x2="450" y2="155" stroke="#000" strokeWidth="2"/>
                    <line x1="450" y1="155" x2="250" y2="155" stroke="#000" strokeWidth="2"/>
                    <line x1="250" y1="155" x2="250" y2="270" stroke="#000" strokeWidth="2"/>
                    <line x1="450" y1="155" x2="650" y2="155" stroke="#000" strokeWidth="2"/>
                    <line x1="650" y1="155" x2="650" y2="270" stroke="#000" strokeWidth="2"/>

                    <foreignObject x="200" y="170" width="110" height="90">
                        <DropZone zone="linkLeft" placedWord={placedWords.linkLeft} onDrop={handleDrop}
                                  canDropHere={canDropInZone('linkLeft')}/>
                    </foreignObject>

                    <foreignObject x="600" y="170" width="110" height="90">
                        <DropZone zone="linkRight" placedWord={placedWords.linkRight} onDrop={handleDrop}
                                  canDropHere={canDropInZone('linkRight')}/>
                    </foreignObject>

                    <ellipse cx="250" cy="320" rx="90" ry="55" fill="white" stroke="black" strokeWidth="2"/>
                    <foreignObject x="200" y="280" width="130" height="90">
                        <DropZone zone="endLeft" placedWord={placedWords.endLeft} onDrop={handleDrop}
                                  canDropHere={canDropInZone('endLeft')}/>
                    </foreignObject>

                    <foreignObject x="360" y="300" width="110" height="90">
                        <DropZone zone="dotLeft" placedWord={placedWords.dotLeft} onDrop={handleDrop}
                                  canDropHere={canDropInZone('dotLeft')}/>
                    </foreignObject>

                    <ellipse cx="650" cy="320" rx="90" ry="55" fill="white" stroke="black" strokeWidth="2"/>
                    <foreignObject x="600" y="280" width="130" height="90">
                        <DropZone zone="endRight" placedWord={placedWords.endRight} onDrop={handleDrop}
                                  canDropHere={canDropInZone('endRight')}/>
                    </foreignObject>

                    <foreignObject x="760" y="300" width="110" height="90">
                        <DropZone zone="dotRight" placedWord={placedWords.dotRight} onDrop={handleDrop}
                                  canDropHere={canDropInZone('dotRight')}/>
                    </foreignObject>
                </svg>
            </div>
        </Card>
    </DndProvider>);
};

export default SentenceNetworkSequential;
