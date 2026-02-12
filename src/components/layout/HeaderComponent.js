import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Row, Col, Button, Dropdown, Space, Layout, Tooltip, Image } from "antd";
import { DownloadOutlined, DownOutlined, TranslationOutlined, UserOutlined } from '@ant-design/icons';
import { Link }       from "react-router-dom";
import { useSession } from "../SessionComponent";

let Header = (props) => {

    let { open, setOpen, isMobile } = props;
    let { login, setLang } = useSession();

    let [highlighted, setHighlighted] = useState(false);
    let [isReadyForInstall, setIsReadyForInstall] = useState(false);
    let [deferredPrompt, setDeferredPrompt] = useState(null);

    let { Header } = Layout;
    let { t, i18n } = useTranslation();

    let items = [
        {
            label: t("language.spanish"),
            key: 'es'
        },
        {
            label: t("language.english"),
            key: 'en'
        }
    ];

    let menuProps = {
        items,
        onClick: (locale) => {
            i18n.changeLanguage(locale.key);
            setLang(locale.key);
        },
    };

    let downloadApp = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            await deferredPrompt.userChoice;
            setDeferredPrompt(null);
            setIsReadyForInstall(false);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("pwaNotificationShown")) {
            setTimeout(() => {
                setHighlighted(false);
            }, 4000);
        }

        window.addEventListener("beforeinstallprompt", (event) => {
            event.preventDefault();
            setDeferredPrompt(event);
            setIsReadyForInstall(true);
        });
    }, []);

    return (
        <Header style={{ padding: "0vh 3vh", display: 'flex', justifyContent: 'space-between' }}>
            <Row gutter={16}>
                {login &&
                    <Col style={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                            ghost
                            size="large"
                            shape="circle"
                            icon={<UserOutlined />}
                            onClick={() => setOpen(!open)}
                            data-testid="menu-button"
                        />
                    </Col>
                }
                <Col style={{ display: 'flex', alignItems: 'center' }}>
                    <Link to="/" >
                        <Image alt="logo" src="/logo_text.png" height="3rem" preview={false} style={{ borderRadius: '0.75vmax' }} />
                    </Link>
                </Col>
            </Row>
            <Row>
                <Col style={{ display: 'flex', alignItems: 'center' }}>
                    {!isMobile ?
                        <Dropdown menu={menuProps}>
                            <Button shape='round' ghost>
                                <Space>
                                    <TranslationOutlined />
                                    {t("language.button")}
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                        :
                        <Tooltip title={t("language.button")} mouseEnterDelay="0.3" trigger={["hover", "focus"]}>
                            <Dropdown menu={menuProps}>
                                <Button shape='round' ghost>
                                    <Space>
                                        <TranslationOutlined />
                                        <DownOutlined />
                                    </Space>
                                </Button>
                            </Dropdown>
                        </Tooltip>
                    }
                </Col>
                <Col style={{ paddingLeft: "1vw" }}>
                    {isReadyForInstall &&
                        <Tooltip title={t("pwa.button")} mouseEnterDelay="0.3" trigger={["hover", "focus"]}>
                            <Button
                                onClick={downloadApp}
                                icon={<DownloadOutlined />}
                                ghost
                                style={highlighted ? { boxShadow: '0vh 0vh 4vh 1vh rgba(255, 221, 0, 1)' } : {}}
                            />
                        </Tooltip>
                    }
                </Col>
            </Row>
        </Header>
    );
};

export default Header;
