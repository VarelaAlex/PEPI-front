import React, {useEffect, useRef} from "react";
import {useDrag} from "react-dnd";
import {getEmptyImage} from "react-dnd-html5-backend";
import {Card, Col, Image, Row} from "antd";

const DraggablePictogram = ({pictogram, isBlinking, isEscaping, isHighlighted, onPlay, forwardRef, hidden, disabled}) => {
    const audioRef = useRef(null);

    useEffect(() => {
        if (pictogram.audio) audioRef.current = pictogram.audio;
    }, [pictogram.audio]);


    const [{isDragging}, drag, preview] = useDrag(() => ({
        type: "PICTO", item: {
            id: pictogram.id, text: pictogram.label, image: `/pictograms/${pictogram.id}.webp`, audio: pictogram.audio,
        }, collect: (monitor) => ({isDragging: !!monitor.isDragging()}), canDrag: () => !disabled,
    }));

    useEffect(() => {
        preview(getEmptyImage(), {captureDraggingState: true});
    }, [preview]);

    const handleMouseDown = () => {
        if (onPlay) onPlay(pictogram.id);
    };

    const handleTouchStart = (e) => {
        if (e.cancelable) e.preventDefault();
        handleMouseDown();
    };

    const handlePointerDown = (e) => {
        if (e.pointerType === "touch" && e.cancelable) e.preventDefault();
    };

    const setRef = (node) => {
        drag(node);
        if (!forwardRef) return;
        if (typeof forwardRef === "function") forwardRef(node); else forwardRef.current = node;
    };

    const visibilityStyle = hidden ? {visibility: "hidden", pointerEvents: "none"} : {};

    return (<div
            ref={setRef}
            className={`pictogram-card ${isBlinking ? "blink" : ""} ${isEscaping ? "escape" : ""} ${isHighlighted ? "highlight" : ""}`}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onPointerDown={handlePointerDown}
            style={{
                opacity: isDragging ? 0 : 1,
                transition: "opacity 0.2s ease",
                cursor: disabled ? "not-allowed" : "grab",
                touchAction: "none", ...visibilityStyle,
            }}
        >
            <Card
                hoverable
                style={{
                    width: 140,
                    height: 140,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    fontFamily: "Massallera",
                    fontWeight: 700,
                    opacity: disabled ? 0.5 : 1,
                }}
            >
                <Row justify="center">
                    <Col>
                        <Image
                            src={`/pictograms/${pictogram.id}.webp`}
                            alt={pictogram.label}
                            style={{width: 60, height: 60, objectFit: "contain", marginBottom: 6}}
                            preview={false}
                        />
                    </Col>
                </Row>
                {pictogram.label}
            </Card>
        </div>);
};

export default DraggablePictogram;