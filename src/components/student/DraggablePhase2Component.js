import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import '../assets/fonts/massallera.TTF';
import { useSession } from '../SessionComponent';

const DraggablePhase2 = ({ id, type, ok, shape, src, stop, bigStop, nexus, text, x, y }) => {

    let { exercise } = useSession();
    let { t } = useTranslation();

    const getImageProps = () => {
        if (nexus) return { x: x - 20, y: y - (exercise.representation === "ICONIC" ? 10 : 20), width: 60, height: 30 };
        if (stop) return { x: x - 15, y: y, width: "25", height: "25" };
        if (bigStop) return { x: x - 5, y: y - 20, width: "40", height: "40" };
        if (shape === "ellipse") return { x: x - 15, y: y - 27, width: "50", height: "50" };
        return { x: x - 15, y: y - 22, width: "50", height: "50" };
    };

    const getTextProps = () => {
        if(!src) {
            if (nexus) return { x: x + 10, y: y + 15, fontSize: "15" };
            if(text==="and") return {x: x + 30, y: y + 25, fontSize: "15"};
            if (stop) return { x: x + 22, y: y + 22, fontSize: "25" };
            if (shape === "ellipse") return { x: x + 11, y: y + 18, fontSize: "13" };
            return { x: x + 10, y: y + 18, fontSize: "13" };
        }
        if (nexus) return { x: x + 10, y: y + 27, fontSize: "15" };
        if(text==="and") return {x: x + 30, y: y + 25, fontSize: "15"};
        if (stop) return { x: x + 22, y: y + 22, fontSize: "25" };
        if (bigStop) return { x: x + 38, y: y + 20, fontSize: "40" };
        if (shape === "ellipse") return { x: x + 11, y: y + 34, fontSize: "12" };
        return { x: x + 10, y: y + 38, fontSize: "13" };
    };

    const imageProps = getImageProps();
    const textProps = getTextProps();

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
        data: { type, src, imageProps, text: t(text), textProps, stop, bigStop, nexus, ok, shape },
        disabled: ok
    });

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

    return (
        <g id={id} style={ok ? { visibility: "hidden" } : transform && { visibility: "hidden" }} ref={setNodeRef} {...listeners} {...attributes}>
            {shape === "rect" &&
                <rect x={x - 50}
                    y={y - 25}
                    width="120"
                    height="70"
                    fill="rgb(255, 255, 255)"
                    stroke="rgb(0, 0, 0)"
                    strokeWidth="3"
                />
            }
            {shape === "ellipse" &&
                <ellipse
                    cx={x + 10}
                    cy={y + 12}
                    rx="60"
                    ry="40"
                    fill="white"
                    stroke={strokeColor()}
                    strokeWidth="3"
                />
            }
            {src && <image href={src} {...imageProps} />}
            <text {...textProps} fill="black" textAnchor="middle" fontFamily='Massallera'>
                {t(text)}
            </text>
        </g>
    );
};

export default DraggablePhase2;
