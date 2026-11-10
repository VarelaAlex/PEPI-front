import {Button, Col, Image, Row, Typography} from "antd";
import {SoundOutlined} from "@ant-design/icons";
import React from "react";

let {Title} = Typography;

function ActivityTools({playAudio, content, playHelp}) {
    return <div>
        <Row gutter={[16, 16]} justify="center" align="middle">
            <Col>
                <Title level={3} style={{margin: 0, fontFamily: "Massallera", color: "#3070a5"}}>{content}</Title>
            </Col>
            <Col>
                <Button icon={<Image preview={false} style={{width: "70%"}} src="/icons/ear.webp"/>} onClick={playHelp}/>
            </Col>
        </Row>
        <Row gutter={[16, 16]} justify="center" align="middle" style={{margin: "2vh"}}>
            <Col>
                {playAudio && <Button icon={<SoundOutlined/>} onClick={playAudio}/>}
            </Col>
        </Row>
    </div>;
}

export default ActivityTools;