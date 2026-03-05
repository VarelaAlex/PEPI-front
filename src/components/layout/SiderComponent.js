import { Drawer, Menu, Typography, } from "antd";
import { CloseOutlined } from '@ant-design/icons';
import { useTranslation } from "react-i18next";

let Sider = (props) => {

    let { open, setOpen, menu, drawerFooter } = props;

    let { t } = useTranslation();
    let { Text } = Typography;

    return (
        <Drawer
            title={<Text style={{ color: "white", fontSize: "2vh" }}>{localStorage.getItem("name") ? t("sider.teacher.welcomeMessage") + ", " + localStorage.getItem("name") : t("sider.anonymous.welcomeMessage")}</Text>}
            open={open}
            onClose={() => setOpen(false)}
            placement="left"
            styles={{
                header: { backgroundColor: "#001628" },
                footer: { fontSize: "2vh" }
            }}
            closeIcon={<CloseOutlined style={{ color: "white" }} />}
            footer={<Menu mode="vertical" items={drawerFooter} />}
        >
            <Menu mode="vertical" items={menu} defaultSelectedKeys={menu[0]?.key} />
        </Drawer>
    );
};

export default Sider;