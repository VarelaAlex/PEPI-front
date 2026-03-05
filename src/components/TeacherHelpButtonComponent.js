import { Button, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

let TeacherHelpButton = () => {
	let { t } = useTranslation();
	let navigate = useNavigate();
	let location = useLocation();

	// Solo mostrar el botón en rutas de profesor, selectRole y registerTeacher
	const isTeacherRoute = location.pathname.startsWith("/teachers") ||
		location.pathname === "/selectRole" ||
		location.pathname === "/registerTeacher" ||
		location.pathname === "/loginTeacher";

	if (!isTeacherRoute) {
		return null;
	}

	const handleHelpClick = () => {
		navigate("/aboutEPI#teacher.faq");
	};

	return (
		<Tooltip title={t("teacher.help.tooltip")}>
			<Button
				type="primary"
				shape="circle"
				icon={<QuestionCircleOutlined />}
				size="large"
				onClick={handleHelpClick}
				style={{
					position: "fixed",
					bottom: "2rem",
					right: "2rem",
					width: "3.5rem",
					height: "3.5rem",
					fontSize: "1.5rem",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					zIndex: 1000,
					boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)"
				}}
			/>
		</Tooltip>
	);
};

export default TeacherHelpButton;

