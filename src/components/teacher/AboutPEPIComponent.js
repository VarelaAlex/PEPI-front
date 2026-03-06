import React, {useEffect, useLayoutEffect, useState} from "react";
import {Button, Card, Col, Collapse, ConfigProvider, Divider, Image, Layout, Menu, Row, Tag, Typography} from "antd";
import {
    BookOutlined,
    FileTextOutlined,
    GlobalOutlined,
    LeftOutlined,
    MailOutlined,
    QuestionCircleOutlined,
    ReadOutlined,
    RightOutlined,
    SettingOutlined,
    SolutionOutlined,
} from "@ant-design/icons";
import {Trans, useTranslation} from "react-i18next";
import {STOP} from "../student/NetworkProps";
import {Link, useLocation, useNavigate} from "react-router-dom";

const {Sider, Content} = Layout;
const {Title, Paragraph, Text} = Typography;

const ANT_THEME = {
    token: {
        borderRadius: 10, fontSize: 15,
    }, components: {
        Layout: {siderBg: "#ffffff", headerBg: "#ffffff"}
    },
};

const KEY_TO_SECTION = {
    "general.sub1": "general",
    "general.sub2": "general",
    "general.sub3": "general",
    "student.sub1": "student",
    "student.sub2": "student",
    "student.sub3": "student",
    "teacher.faq": "teacher",
    "contactAndPublications": "contactAndPublications",
};

const ORDERED_KEYS = ["general.sub1", "general.sub2", "general.sub3", "student.sub1", "student.sub2", "student.sub3", "teacher.faq", "contactAndPublications",];

const DIVISION_COLORS = ["#2563eb", "#7c3aed", "#0891b2", "#16a34a", "#d97706"];

function renderContent(item, index) {

    if (typeof item === "string") {
        return (<Paragraph key={index} style={{marginBottom: 8}}>
            {item}
        </Paragraph>);
    }

    if (Array.isArray(item)) {
        return (<ul key={index}>
            {item.map((subItem, i) => (<li key={i} style={{marginBottom: 4}}>
                {renderContent(subItem, i)}
            </li>))}
        </ul>);
    }

    if (typeof item === "object" && item !== null) {
        return (<div key={index} style={{marginBottom: 12}}>
            {item.title && (<Paragraph style={{fontWeight: 'bold', fontSize: 16, marginBottom: 8}}>
                {item.title}
            </Paragraph>)}
            {Object.entries(item)
                .filter(([key]) => key !== 'title')
                .map(([key, val], i) => renderContent(val, i))}
        </div>);
    }

    return null;
}

function GeneralContent({sectionKey}) {
    const {t} = useTranslation();

    if (sectionKey === "general.sub3") {
        return <TypeAndNetContent subsectionKey={sectionKey}/>;
    }

    const sectionData = t(sectionKey, {returnObjects: true});

    const content = sectionData.body || sectionData.divisions || sectionData;

    const contentArray = Array.isArray(content) ? content : [content];

    return (<Card
        style={{marginBottom: 28, borderLeft: "4px solid #2563eb"}}
    >
        {contentArray.map((item, i) => renderContent(item, i))}
    </Card>);
}

let ImageGrid = ({images}) => {
    if (!images) return;
    return <Row justify="center" align="middle" gutter={[16, 32]} style={{padding: "20px 0px"}}>
        <Image.PreviewGroup preview={{mask: {blur: true}}}>
            {images.map((img, idx) => (<Col span={12} key={idx}>
                <Image src={img.src} alt={img.alt} style={{border: "2px solid #d9d9d9", borderRadius: 8, padding: 8}}/>
            </Col>))}
        </Image.PreviewGroup>
    </Row>
}

function TypeAndNetContent({subsectionKey}) {
    const {t} = useTranslation();
    const divisions = t(`${subsectionKey}.divisions`, {returnObjects: true});

    return (<div style={{
        display: "grid", gridTemplateColumns: "1fr", gap: 22, alignItems: "start"
    }}>
        {divisions.map((div, idx) => {
            const color = DIVISION_COLORS[idx % DIVISION_COLORS.length];

            return (<Card
                key={idx}
                title={<div style={{display: "flex", alignItems: "center", gap: 8}}>
                                    <span style={{
                                        width: 10, height: 10, borderRadius: "50%", background: color
                                    }}/>
                    <Text strong style={{fontSize: 16}}>{div.title}</Text>
                </div>}
                style={{borderLeft: `3px solid ${color}`, minHeight: 180}}
            >
                {div.body && <Paragraph style={{color: "#64748b", marginBottom: 12}}>{div.body}</Paragraph>}

                {div.steps?.length > 0 && (<ul style={{paddingLeft: 20, margin: 0}}>
                    {div.steps.map((step, i) => (<li key={i} style={{marginBottom: 6}}>
                        <Text><Trans
                            i18nKey={div.steps[i]}
                            components={{
                                code: <code/>, smallStop: <img
                                    src={`${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`}
                                    alt="STOP"
                                    style={{
                                        height: "1.75em", width: "auto", verticalAlign: "middle", margin: "0 2px"
                                    }}
                                />, bigStop: <img
                                    src={`${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`}
                                    alt="STOP"
                                    style={{
                                        height: "2.5em", width: "auto", verticalAlign: "middle", margin: "0 2px"
                                    }}
                                />
                            }}
                        /></Text>
                    </li>))}
                </ul>)}
                {idx === 0 && <ImageGrid images={[{src: "/images/red1-1.png", alt: "Red 1-1"}, {
                    src: "/images/red1-2.png", alt: "Red 1-2"
                }, {src: "/images/red1-3.png", alt: "Red 1-3"}]}
                />}
                {idx === 2 && <>
                    <ImageGrid images={[{src: "/images/iconica.png", alt: "Icónica"}, {
                        src: "/images/combinada.png", alt: "Combinada"
                    }]}/>
                    {div.descriptions?.length > 0 && renderContent(div.descriptions[0], 0)}
                    <ImageGrid images={[{src: "/images/global.png", alt: "Global"}, {
                        src: "/images/simbolica.png", alt: "Simbólica"
                    }]}/>
                </>}
                {div.descriptions?.slice(1).map((desc, index) => (<Paragraph key={index}>
                    <Trans
                        key={index}
                        i18nKey={desc}
                        components={{bold: <b/>, linkWorkWithPepi: <Link to="#student.sub1"/>}}
                    />
                </Paragraph>))}
                {idx === 3 && <ImageGrid images={[{src: "/images/Pictogramas.png", alt: "Pictogramas"}]}/>}
            </Card>);
        })}
    </div>);
}

function TeacherContent() {
    const {t} = useTranslation();
    const faqs = t("teacher.faq.items", {returnObjects: true});

    // Ensure faqs is an array
    const faqsArray = Array.isArray(faqs) ? faqs : [];

    return (<Card style={{maxWidth: 780}}>
        <Collapse
            accordion
            ghost
            expandIcon={({isActive}) => (<RightOutlined
                style={{
                    color: "#2563eb",
                    transform: isActive ? "rotate(90deg)" : "rotate(0deg)",
                    transition: "transform 0.2s"
                }}
            />)}
            items={faqsArray.map((faq, i) => ({
                key: String(i), label: <Text strong>{faq.q}</Text>, children: <Paragraph>{faq.a}</Paragraph>
            }))}
        />
    </Card>);
}


function ContactAndPublicationsContent() {
    const {t} = useTranslation();

    const root = t("contactAndPublications", {returnObjects: true}) || {};
    const contact = root.contact || {};
    const publications = root.publications || {};

    const cTitle = contact.title || t("contactAndPublications.title");
    const cIntro = contact.intro;
    const means = contact.means || [];

    const renderMedio = (medio, i) => {
        const {type, label, value} = medio || {};
        const prefix = label ? <Text strong>{label}: </Text> : null;

        if (type === "email") {
            return (<li key={`email-${i}`}>
                {prefix}
                <a href={`mailto:${value}`}>{value}</a>
            </li>);
        }
        if (type === "web") {
            return (<li key={`web-${i}`}>
                {prefix}
                <a href={value} target="_blank" rel="noopener noreferrer">
                    {value}
                </a>
            </li>);
        }
        return (<li key={`other-${i}`}>
            {prefix}
            <Text>{value}</Text>
        </li>);
    };

    const pTitle = publications.title || t("contactAndPublications.title");
    const pIntro = publications.intro;
    const items = publications.items || [];

    return (<>
        <Card
            title={cTitle}
            style={{borderLeft: `3px solid ${DIVISION_COLORS[0]}`, minHeight: 180}}
        >
            {cIntro && <Paragraph>{cIntro}</Paragraph>}
            <ul style={{paddingLeft: 20}}>
                {means.map((m, i) => renderMedio(m, i))}
            </ul>
        </Card>

        <Divider/>

        <Card
            title={pTitle}
            style={{borderLeft: `3px solid ${DIVISION_COLORS[1]}`, minHeight: 180}}
        >
            {pIntro && <Paragraph>{pIntro}</Paragraph>}
            <ul style={{paddingLeft: 20}}>
                {items.map((p, i) => (<li key={`pub-${i}`}>
                    <Text>{p.ref}</Text>{" "}
                    {p.url && (<a href={p.url} target="_blank" rel="noopener noreferrer">
                        {p.url}
                    </a>)}
                </li>))}
            </ul>
        </Card>
    </>);
}

let NavigateBar = ({activeKey, setActiveKey, t}) => {

    const currentIndex = ORDERED_KEYS.indexOf(activeKey);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < ORDERED_KEYS.length - 1;

    const goToPrev = () => {
        if (hasPrev) setActiveKey(ORDERED_KEYS[currentIndex - 1]);
    };

    const goToNext = () => {
        if (hasNext) setActiveKey(ORDERED_KEYS[currentIndex + 1]);
    };

    return <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16,
    }}>
        <Button
            icon={<LeftOutlined/>}
            onClick={goToPrev}
            disabled={!hasPrev}
            type="default"
        >
            {hasPrev ? t(`${ORDERED_KEYS[currentIndex - 1]}.title`) : ""}
        </Button>

        <Text type="secondary" style={{fontSize: 13}}>
            {currentIndex + 1} / {ORDERED_KEYS.length}
        </Text>

        <Button
            iconPlacement="end"
            icon={<RightOutlined/>}
            onClick={goToNext}
            disabled={!hasNext}
            type="default"
        >
            {hasNext ? t(`${ORDERED_KEYS[currentIndex + 1]}.title`) : ""}
        </Button>
    </div>
}

const getKeyFromHash = (hash) => {
    const key = hash.replace("#", "");
    return ORDERED_KEYS.includes(key) ? key : "general.sub1";
};

function StudentContent({subsectionKey}) {
    const {t} = useTranslation();

    // Sección de preparación
    if (subsectionKey === "student.sub2") {
        return <StudentDivisionContent subsectionKey={subsectionKey}/>;
    }

    // Sección de entrenamiento
    if (subsectionKey === "student.sub3") {
        return <StudentDivisionContent subsectionKey={subsectionKey}/>;
    }

    // Vista normal (intro: solo Primeros pasos)
    const divisions = t(`${subsectionKey}.divisions`, {returnObjects: true});
    return (<div style={{display: "grid", gridTemplateColumns: "1fr", gap: 22}}>
        {[divisions[0]].map((div, idx) => (<StudentDivisionCard key={idx} div={div} idx={idx}/>))}
    </div>);
}

function StudentDivisionContent({subsectionKey}) {
    const {t} = useTranslation();
    const divisions = t(`${subsectionKey}.divisions`, {returnObjects: true});

    return (<div style={{display: "grid", gridTemplateColumns: "1fr", gap: 22}}>
        {divisions.map((div, i) => <StudentDivisionCard div={div} idx={i}/>)}
    </div>);
}

function StudentDivisionCard({div, idx}) {
    const color = DIVISION_COLORS[idx % DIVISION_COLORS.length];
    return (<Card
        title={<div style={{display: "flex", alignItems: "center", gap: 8}}>
            <span style={{width: 10, height: 10, borderRadius: "50%", background: color}}/>
            <Text strong style={{fontSize: 15}}>{div.title}</Text>
        </div>}
        style={{borderLeft: `3px solid ${color}`}}
    >
        {div.body && <Paragraph style={{color: "#64748b", marginBottom: 12}}>{div.body}</Paragraph>}

        {div.intro?.length > 0 && div.intro.map((step, i) => (<Paragraph key={i}>
            <Trans i18nKey={step} components={{
                bold: <b/>, linkPreparation: <Link to="#student.sub2"/>, linkTraining: <Link to="#student.sub3"/>
            }}/>
        </Paragraph>))}
        <ImageGrid images={div.imgs}/>
        {div.presentation?.length > 0 && div.presentation.map((pre, i) => (<>
            <Title level={5}>
                {pre.title}
            </Title>
            <Text>
                <Trans i18nKey={pre.text} components={{bold: <b/>}}/>
            </Text>
            <ul style={{paddingLeft: 20, margin: 0}}>
                {pre.steps.map((step, j) => (<li key={j} style={{marginBottom: 6}}>
                    <Text>
                        <Trans i18nKey={step} components={{bold: <b/>}}/>
                    </Text>
                </li>))}
            </ul>
        </>))}
        {div.descriptions?.length > 0 && div.descriptions.map((desc, i) => (<div key={i}>
            <Title level={5}>
                <Trans i18nKey={desc.title} components={{bold: <b/>}}/>
            </Title>
            {desc.content?.map((item, j) => (<Paragraph key={j}>
                <Trans i18nKey={item} components={{bold: <b/>}}/>
            </Paragraph>))}
        </div>))}
    </Card>);
}

const AboutEPI = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const [activeKey, setActiveKeyState] = useState(() => getKeyFromHash(location.hash));

    const setActiveKey = (key) => {
        setActiveKeyState(key);
        navigate(`#${key}`, {replace: true});
    };

    useEffect(() => {
        setActiveKeyState(getKeyFromHash(location.hash));
    }, [location.hash]);

    useLayoutEffect(() => {
        setTimeout(() => {
            document.querySelector(".ant-layout-content")?.scrollTo({top: 0, behavior: "smooth"});
        }, 0);
    }, [activeKey]);

    const activeSection = KEY_TO_SECTION[activeKey] ?? "general";
    const {t} = useTranslation();

    const getField = (field) => {
        return t(`${activeKey}.${field}`);
    };

    const getSectionLabel = () => {
        return t(`${activeSection}.title`);
    };

    const menuItems = [{
        key: "general", icon: <GlobalOutlined/>, label: t("general.title"), children: [{
            key: "general.sub1", icon: <GlobalOutlined/>, label: t("general.sub1.title")
        }, {
            key: "general.sub2", icon: <SettingOutlined/>, label: t("general.sub2.title")
        }, {
            key: "general.sub3", icon: <BookOutlined/>, label: t("general.sub3.title")
        }]
    }, {
        key: "student", icon: <ReadOutlined/>, label: t("student.title"), children: [{
            key: "student.sub1", icon: <FileTextOutlined/>, label: t("student.sub1.title")
        }, {key: "student.sub2", label: t("student.sub2.title")}, {key: "student.sub3", label: t("student.sub3.title")}]
    }, {
        key: "teacher", icon: <SolutionOutlined/>, label: t("teacher.title"), children: [{
            key: "teacher.faq", icon: <QuestionCircleOutlined/>, label: t("teacher.faq.title")
        }]
    }, {
        key: "contactAndPublications", icon: <MailOutlined/>, label: t("contactAndPublications.title")
    }];

    return (<ConfigProvider theme={ANT_THEME}>
        <Layout style={{height: '100%', background: "None"}}>
            <Sider width="35vh" breakpoint={"lg"}
                   style={{overflowY: "auto", position: "sticky", top: 0, alignSelf: "flex-start", maxHeight: "100vh"}}>
                <Menu mode="inline" selectedKeys={[activeKey]}
                      defaultOpenKeys={["general", "student", "teacher"]} items={menuItems}
                      onClick={({key}) => {
                          if (KEY_TO_SECTION[key] !== undefined) setActiveKey(key);
                      }}
                />
            </Sider>
            <Content style={{
                padding: "32px 44px", overflowY: "auto", height: "100%", minHeight: "100vh"

            }}>
                <NavigateBar t={t} activeKey={activeKey} setActiveKey={setActiveKey}/>
                <Divider style={{borderColor: "#bfdbfe", marginTop: 0}}/>
                <div style={{display: "flex", alignItems: "center", gap: 12, marginBottom: 6}}>
                    <Title level={2} style={{margin: 0}}>{getField("title")}</Title>
                    <Tag color="blue">{getSectionLabel()}</Tag>
                </div>
                <Paragraph style={{fontSize: 16, color: "#64748b", fontStyle: "italic", marginBottom: 24}}>
                    {getField("intro")}
                </Paragraph>
                <Divider style={{borderColor: "#bfdbfe", marginTop: 0}}/>
                {activeSection === "general" && <GeneralContent sectionKey={activeKey}/>}
                {activeSection === "student" && <StudentContent subsectionKey={activeKey}/>}
                {activeSection === "teacher" && <TeacherContent/>}
                {activeSection === "contactAndPublications" && <ContactAndPublicationsContent/>}
                <Divider style={{borderColor: "#bfdbfe", marginTop: 0}}/>
                <NavigateBar t={t} activeKey={activeKey} setActiveKey={setActiveKey}/>
            </Content>
        </Layout>
    </ConfigProvider>);
};

export default AboutEPI;
