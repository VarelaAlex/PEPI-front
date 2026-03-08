import React from 'react';
import {Card, Col, Image as AntdImage, Row} from 'antd';

export const StaticWord = ({wordData}) => {
    let size = wordData.text !== "." ? '' : 20;
    return (<div style={{display: 'inline-block', margin: 4}}>
        <Card size="small" style={{
            textAlign: 'center',
            minWidth: 90,
            height: 75,
            fontFamily: "Massallera",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size
        }}>
            <div>
                <Row justify="center">
                    <Col>
                        <AntdImage
                            src={wordData.image}
                            alt={wordData.text}
                            style={{width: 35, height: 35, objectFit: "contain", marginBottom: 4}}
                            preview={false}
                        />
                    </Col>
                </Row>
                {wordData.text !== "." && wordData.text}
            </div>
        </Card>
    </div>);
};