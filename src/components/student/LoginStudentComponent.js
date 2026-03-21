import { useTranslation } from 'react-i18next';
import { Button, Card, Input, Form, Alert } from "antd";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession }  from '../SessionComponent';
import {registerID, startExperiment} from "../../scriptTest2";
import {useAvatar} from "../AvatarContext";

const AVATAR_LOGIN_FLAG_KEY = "avatarLoginFlag";

let LoginStudent = () => {

    let { setLogin } = useSession();

    let { t } = useTranslation();

    let [message, setMessage] = useState(null);

    let navigate = useNavigate();
    let {showAvatar, enableVoice, hideAvatar, disableVoice} = useAvatar();

    let onFinish = async (values) => {
        let { username } = values;

        let response = null;
        try {
            response = await fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/students/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({
                    username
                })
            });
        } catch (e) {
            setMessage({ error: { type: "internalServerError", message: e } });
            return;
        }

        let jsonData = await response?.json();
        if (response?.ok) {
            const avatarEnabled = localStorage.getItem(AVATAR_LOGIN_FLAG_KEY) === "true";

            if (avatarEnabled) {
                showAvatar();
                enableVoice();
            } else {
                hideAvatar();
                disableVoice();
            }

            localStorage.setItem("accessToken", jsonData.accessToken);
            localStorage.setItem("refreshToken", jsonData.refreshToken);
            localStorage.setItem("name", jsonData.name);
            localStorage.setItem("role", "S");
            setLogin(true);
            startExperiment();
            registerID(jsonData.id);
            navigate("/students/selectMode");
        } else {
            setMessage({ error: jsonData?.error });
        }
    };

    return (
        <Card title={t("login.title")} style={{ width: "80vw" }}>
            {message?.error?.type && <Alert type="error" message={t(message?.error?.type)} showIcon style={{ marginBottom: "1vh" }} />}
            <Form
                name="login"
                labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
                wrapperCol={{ xs: { span: 24 }, sm: { span: 18 } }}
                onFinish={onFinish}
                scrollToFirstError
            >
                <Form.Item
                    name="username"
                    label={t("login.form.label.username")}
                    rules={[
                        {
                            required: true,
                            message: t("login.error.username.empty")
                        },
                    ]}
                    validateStatus={message?.error?.username ? 'error' : undefined}
                    help={message?.error?.username ? t(message?.error?.username) : undefined}
                    hasFeedback
                >
                    <Input placeholder={t("login.form.placeholder.username")} onInput={() => setMessage(null)} />
                </Form.Item>
                <Form.Item wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } }}>
                    <Button type="primary" htmlType="submit">
                        {t("login.button")}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default LoginStudent;