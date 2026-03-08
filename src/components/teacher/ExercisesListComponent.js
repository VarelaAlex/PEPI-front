import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import { Alert, Button, Card, Divider, Empty, Popconfirm, Spin, Table, Tooltip } from "antd";
import { useEffect, useState }                                                   from "react";
import { useTranslation }                                                        from "react-i18next";
import { useNavigate }                                                           from "react-router-dom";
import TeacherBreadcrumb from "./BreadcrumbComponent";

let ExercisesList = (props) => {

	let { isMobile } = props;

	let [loading, setLoading] = useState(true);
	let [exercises, setExercises] = useState([]);
	let [message, setMessage] = useState(null);

	let { t } = useTranslation();
	let navigate = useNavigate();

	useEffect(() => {
		getExercises();
	}, []);

	const columns = [
		{
			title: t("exercise.table.name"), dataIndex: "title", align: "center", fixed: "left"
		}, {
			title: t("exercise.table.category"), dataIndex: "category", align: "center"
		}, {
			title: t("exercise.table.networkType"), dataIndex: "networkType", align: "center"
		}, {
			title: t("exercise.table.representation"), dataIndex: "representation", align: "center"
		}, {
			title: t("exercise.table.language"), dataIndex: "language", align: "center"
		}, {
			title:     t("exercise.table.actions"),
			dataIndex: "_id",
			align:     "center",
			render:    (_id) => (
				isMobile ? <>
					<Tooltip title={t("exercise.table.tooltips.edit")} mouseEnterDelay="0.3" trigger={["hover", "focus"]}>
					 <Button onClick={() => navigate(`/teachers/exercise/${_id}/edit`)} icon={<EditOutlined />} style={{ marginRight: "1vmax" }} />
					 </Tooltip>
					<Tooltip title={ t("exercise.table.tooltips.delete") } mouseEnterDelay="0.3" trigger={ ["hover", "focus"] }>
						<Popconfirm
							title={ t("exercise.delete.popconfirm.title") }
							description={ t("exercise.delete.popconfirm.description") }
							okText={ t("exercise.delete.popconfirm.okText") }
							okButtonProps={ { danger: true } }
							cancelText={ t("exercise.delete.popconfirm.cancelText") }
							onConfirm={ () => deleteExercise(_id) }
						>
							<Button danger type="primary" icon={ <DeleteOutlined/> }/>
						</Popconfirm>
					</Tooltip>
				</> : <>
					<Button onClick={() => navigate(`/teachers/exercise/${_id}/edit`)} style={{ marginRight: "1vmax" }}> {t("exercise.table.buttons.edit")}</Button >
					<Popconfirm
						title={ t("exercise.delete.popconfirm.title") }
						description={ t("exercise.delete.popconfirm.description") }
						okText={ t("exercise.delete.popconfirm.okText") }
						okButtonProps={ { danger: true } }
						cancelText={ t("exercise.delete.popconfirm.cancelText") }
						onConfirm={ () => deleteExercise(_id) }
					>
						<Button danger type="primary"> { t("exercise.table.buttons.delete") }</Button>
					</Popconfirm>
				</>
			)
		}
	];

	let deleteExercise = async (id) => {
		await fetch(`${process.env.REACT_APP_EXERCISES_SERVICE_URL}/exercises/${id}`, {
			method: "DELETE", headers: { Authorization: `Bearer ${ localStorage.getItem("accessToken") }` }
		});
		getExercises();
	};

	let getExercises = async () => {
		setLoading(true);
		let response = await fetch(`${process.env.REACT_APP_EXERCISES_SERVICE_URL}/exercises/teacher`, {
			method: "GET", headers: { Authorization: `Bearer ${ localStorage.getItem("accessToken") }` }
		});

		if ( response.ok ) {
			let jsonData = await response.json();
			jsonData.map(exercise => exercise.key = exercise.title);
			setExercises(jsonData);
		} else {
			let jsonData = await response.json();
			if ( Array.isArray(jsonData.error) ) {
				setMessage(jsonData.error);
			} else {
				let finalError = [];
				finalError.push(jsonData.error);
				setMessage(finalError);
			}
		}
		setLoading(false);
	};

	return (
		<Spin spinning={ loading } description="Loading" size="large">
			<div style={{ width: "90vw", marginLeft: "auto", marginRight: "auto", marginTop: "2vh" }}>
				<TeacherBreadcrumb />
			</div>
			<Card title={ t("exercise.table.title") } style={ { width: "90vw" } }>
				{ exercises.length <= 0 ? <Empty image={ Empty.PRESENTED_IMAGE_SIMPLE } description={ t("exercise.table.empty") }/> : <Table size="small" bordered
				                                                                                                                             columns={ columns }
				                                                                                                                             dataSource={ exercises }
				                                                                                                                             scroll={ { x: 900, y: 300 } }
				                                                                                                                             pagination={ { pageSize: 5 } }/> }
				<Divider orientation="left">{ t("exercise.create.addExercise.divider") }</Divider>
				{ message?.error?.type && <Alert type="error" message={ t(message?.error?.type) } showIcon style={ { marginBottom: "1vh" } }/> }
				<Button type="primary" onClick={ () => { navigate("/teachers/create"); } }>{ t("exercise.create.addExercise.button") }</Button>
			</Card>
		</Spin>
	);
};

export default ExercisesList;