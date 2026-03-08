import {useDrop} from "react-dnd";
import {Card, Col, Image, Row} from "antd";
import React from "react";
import {ItemTypes} from "./ItemTypes";

function DropSlot({index, expectedText, value, image, enabled, onDrop}) {
    const [{isOver}, drop] = useDrop(() => ({
        accept: ItemTypes.WORD,
        drop: (item) => onDrop(index, item),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }), [enabled, onDrop]);

    const isFilled = !!value;

    return (<div ref={drop} style={{margin: "0 8px"}}>
        <Card
            style={{
                width: 150,
                height: 120,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                borderColor: isFilled ? "green" : isOver ? "blue" : "#d9d9d9",
                backgroundColor: isFilled ? "#d4edda" : "#fafafa",
                fontWeight: 600,
                fontFamily: "Massallera",
                textAlign: "center",
            }}
        >
            <Row justify="center">
                <Col>
                    {isFilled && image && (<Image
                        src={image}
                        alt=" "
                        style={{
                            width: 50, height: 50, objectFit: "contain", marginBottom: 4,
                        }}
                        preview={false}
                    />)}
                </Col>
            </Row>
            {isFilled ? value : "⎯⎯"}
        </Card>
    </div>);
}

export default DropSlot;