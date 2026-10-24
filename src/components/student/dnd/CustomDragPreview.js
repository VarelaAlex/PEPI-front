import React from 'react';
import {Card, Col, Image as AntdImage, Row} from 'antd';
import {usePreview} from 'react-dnd-preview';

export const CustomDragPreview = () => {
    const {display, item, style} = usePreview();

    if (!display) {
        return null;
    }

    return (<div
        style={{
            ...style,
            pointerEvents: 'none',
            position: 'fixed',
            zIndex: 9999
        }}
    >
        <Card
            size="small"
            style={{
                textAlign: 'center',
                background: '#e6f7ff',
                minWidth: 100,
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                opacity: 0.9,
                fontFamily: "Massallera",
                padding: 8
            }}
        >
            {item.image && (<Row justify="center">
                <Col>
                    <AntdImage
                        src={item.image}
                        alt={item.label ?? item.word}
                        style={{width: 50, height: 50, objectFit: 'contain', marginBottom: 4}}
                        preview={false}
                    />
                </Col>
            </Row>)}
            {item.label ?? item.word}
        </Card>
    </div>);
};