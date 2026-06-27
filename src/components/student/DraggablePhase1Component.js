import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import '../assets/styles/font.css'

const DraggablePhase1 = ({ id, type, ok, shape, src, stop, bigStop, nexus, text }) => {

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        data: { type, stop, bigStop },
        disabled: ok
    });
    let { t } = useTranslation();

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
    } : undefined;

    const getImagePosition = () => {
        if (nexus) return { x: "0.7vmax", y: "1.5vmax", width: "6vmax", height: "2.5vmax" };
        if (stop) return { x: "0.5vmax", y: "2.5vmax", width: "2vmax", height: "2vmax" };
        if (bigStop) return { x: "0vmax", y: " 2.5vmax", width: "3vmax", height: "3vmax" };
        if (shape === "rect") return { x: "2.7vmax", y: "0.6vmax", width: "4.5vmax", height: "4.5vmax" };
        if (shape === "ellipse") return { x: "3.4vmax", y: "0.3vmax", width: "4.5vmax", height: "4.5vmax" };
        return {};
    };

    const getTextPosition = () => {
        if(!src) {
            if (shape === "ellipse") return { x: "5.7vmax", y: "4.1vmax", fontSize: "1vmax" };
            if (shape === "rect") return { x: "5.2vmax", y: "4.1vmax", fontSize: "1vmax" };
            if(text==="and") return {x: "2.4vmax", y: "5.2vmax", fontSize: "1.3vmax"};
            if (stop) return { x: "2vmax", y: "5vmax", fontSize: "1.8vmax" };
            return { x: "3.8vmax", y: "4.2vmax", fontSize: "1.1vmax" };
        }
        if (bigStop) return { x: "3.4vmax", y: "5.9vmax", fontSize: "2.3vmax" };
        if(text==="and") return {x: "2.4vmax", y: "5.2vmax", fontSize: "1.3vmax"};
        if (stop) return { x: "3vmax", y: "5vmax", fontSize: "1.8vmax" };
        if (shape === "ellipse") return { x: "5.7vmax", y: "5.9vmax", fontSize: "1.1vmax" };
        if (shape === "rect") return { x: "5.2vmax", y: "6.1vmax", fontSize: "1.1vmax" };
        return { x: "3.8vmax", y: "5.3vmax", fontSize: "1.1vmax" };
    };

    const imagePosition = getImagePosition();
    const textPosition = getTextPosition();

    let strokeColor = () => {
        switch (id) {
            case "5":
                return "black";
            case "8":
                return "black";
            case "10":
                return "black";
            default:
                return "black";
        }
    };

    let svgWidth = () => {
        if (stop) return "4vmax";
        if (nexus) return "8vmax";
        if (shape==="ellipse") return "12vmax";
        else return "11vmax";
    };

    return (
        <div id={id} ref={setNodeRef} style={ok ? { visibility: "hidden" } : style} {...listeners} {...attributes}>
            <svg height="7.5vmax" width={svgWidth()}>
                {shape === "rect" &&
                    <rect
                        x="0.1vmax"
                        y="0.5vmax"
                        width="10vmax"
                        height="6vmax"
                        fill="white"
                        stroke="black"
                        strokeWidth="3"
                    />
                }
                {shape === "ellipse" &&
                    <ellipse
                        cx="5.7vmax"
                        cy="3.7vmax"
                        rx="5.5vmax"
                        ry="3.5vmax"
                        fill="white"
                        stroke={strokeColor()}
                        strokeWidth="3"
                    />
                }
                {src && <image
                    x={imagePosition.x}
                    y={imagePosition.y}
                    width={imagePosition.width}
                    height={imagePosition.height}
                    href={src}
                />}

                <text
                    x={textPosition.x}
                    y={textPosition.y}
                    fill="black"
                    fontSize={textPosition.fontSize}
                    textAnchor="middle"
                    fontFamily="Massallera"
                >
                    {t(text)}
                </text>
            </svg>
        </div>
    );
};

export default DraggablePhase1;
