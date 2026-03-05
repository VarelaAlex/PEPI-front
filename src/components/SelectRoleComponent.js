import { Button, Flex, Image } from "antd";
import { useTranslation }      from "react-i18next";
import { useNavigate }         from "react-router-dom";

let SelectRole = () => {

	let { t } = useTranslation();

	let navigate = useNavigate();

	return (
		<Flex justify="space-evenly" align="flex-start" style={ { width: "100%" } }>
			<Button  size="large" color="primary" variant="solid" block
			        style={ { width: "40%", height: "25vh", fontSize: "4vmin", padding: "1rem" } }
			        onClick={ () => navigate("/loginTeacher") }>
				<Flex vertical align="center" justify="center" gap={ 10 } style={ { height: "100%", width: "100%" } }>
					<Image alt={t("role.teacher")} src="icons/teacher.png" height="10vmin" width="10vmin" preview={ false }/>
					<div style={ { textAlign: "center", lineHeight: "1.1", fontSize: "3.5vmin" } }>
						<div>{ t("role.teacherMale").toUpperCase() }</div>
						<div>{ t("role.teacherFemale").toUpperCase() }</div>
					</div>
				</Flex>
			</Button>
			<Button size="large" color="primary" variant="solid" block
			        style={ { width: "40%", height: "25vh", fontSize: "4vmin", padding: "1rem" } }
			        onClick={ () => navigate("/loginStudent") }>
				<Flex vertical align="center" justify="center" gap={ 10 } style={ { height: "100%", width: "100%" } }>
					<Image alt={t("role.student")} src="icons/student.png" height="10vmin" width="10vmin" preview={ false }/>
					<div style={ { textAlign: "center", lineHeight: "1.1", fontSize: "3.5vmin" } }>
						<div>{ t("role.studentMale").toUpperCase() }</div>
						<div>{ t("role.studentFemale").toUpperCase() }</div>
					</div>
				</Flex>
			</Button>
		</Flex>
	);
};

export default SelectRole;