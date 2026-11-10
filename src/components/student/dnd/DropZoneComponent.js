import {useDrop} from "react-dnd";
import {Card, Image} from "antd";
import React from "react";

let DropZone = ({blinking, onDrop, forwardRef, droppedPictogram}) => {
    let [, drop] = useDrop(() => ({
        accept: "PICTO",
        drop: (item) => onDrop(item.id)
    }));

    let setRef = (node) => {
        drop(node);
        if (!forwardRef) return;
        if (typeof forwardRef === "function") forwardRef(node);
        else forwardRef.current = node;
    };

    return (
        <div ref={setRef} className={`dropzone ${blinking ? "blink" : ""}`}>
            {droppedPictogram ? (
                <Card
                    hoverable
                    style={{
                        width: 140,
                        height: 140,
                        textAlign: "center"
                    }}
                >
                    <Image
                        alt={droppedPictogram.id}
                        src={`/pictograms/${droppedPictogram.id}.webp`}
                        preview={false}
                    />
                    <div style={{fontWeight: "700", fontFamily: "Massallera"}}>
                        {droppedPictogram.label}
                    </div>
                </Card>
            ) : (
                <Image src="/icons/drag.webp" alt="dragzone" height="5em" preview={false} />
            )}
        </div>
    );
};

export default DropZone;