import { Alert, Button, Card, Form, Radio, Steps, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import TeacherBreadcrumb from "./BreadcrumbComponent";

const SurveyA = () => {

	let { studentId, classroomName } = useParams();
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [currentStep, setCurrentStep] = useState(0);
	const [form] = Form.useForm();
	const [message, setMessage] = useState(null);
	const [surveyId, setSurveyId] = useState(null);
	const [, setUpdateTrigger] = useState(0);

	const { Title } = Typography;

	const responseOptions = [
		{ label: t("surveyA.options.never"), value: 0 },
		{ label: t("surveyA.options.almostNever"), value: 1 },
		{ label: t("surveyA.options.fewTimes"), value: 2 },
		{ label: t("surveyA.options.sometimes"), value: 3 },
		{ label: t("surveyA.options.often"), value: 4 },
		{ label: t("surveyA.options.unknown"), value: -1 }
	];

	// Definir las categorías y sus preguntas
	const categories = [
		{
			name: t("surveyA.steps.general"),
			questions: [
				{ id: "general_1", label: t("surveyA.questions.general.general_1") },
				{ id: "general_2", label: t("surveyA.questions.general.general_2") },
				{ id: "general_3", label: t("surveyA.questions.general.general_3") }
			]
		},
		{
			name: t("surveyA.steps.speech"),
			questions: [
				{ id: "speech_1", label: t("surveyA.questions.speech.speech_1") },
				{ id: "speech_2", label: t("surveyA.questions.speech.speech_2") },
				{ id: "speech_3", label: t("surveyA.questions.speech.speech_3") }
			]
		},
		{
			name: t("surveyA.steps.memory"),
			questions: [
				{ id: "memory_1", label: t("surveyA.questions.memory.memory_1") },
				{ id: "memory_2", label: t("surveyA.questions.memory.memory_2") },
				{ id: "memory_3", label: t("surveyA.questions.memory.memory_3") }
			]
		},
		{
			name: t("surveyA.steps.attention"),
			questions: [
				{ id: "attention_1", label: t("surveyA.questions.attention.attention_1") },
				{ id: "attention_2", label: t("surveyA.questions.attention.attention_2") },
				{ id: "attention_3", label: t("surveyA.questions.attention.attention_3") }
			]
		},
		{
			name: t("surveyA.steps.motricity"),
			questions: [
				{ id: "motricity_1", label: t("surveyA.questions.motricity.motricity_1") },
				{ id: "motricity_2", label: t("surveyA.questions.motricity.motricity_2") },
				{ id: "motricity_3", label: t("surveyA.questions.motricity.motricity_3") }
			]
		},
		{
			name: t("surveyA.steps.emotion"),
			questions: [
				{ id: "emotion_1", label: t("surveyA.questions.emotion.emotion_1") },
				{ id: "emotion_2", label: t("surveyA.questions.emotion.emotion_2") },
				{ id: "emotion_3", label: t("surveyA.questions.emotion.emotion_3") }
			]
		},
		{
			name: t("surveyB.steps.reading"),
			questions: [
				{ id: "reading_1", label: t("surveyB.questions.reading.reading_1") },
				{ id: "reading_2", label: t("surveyB.questions.reading.reading_2") },
				{ id: "reading_3", label: t("surveyB.questions.reading.reading_3") }
			]
		},
		{
			name: t("surveyB.steps.writing"),
			questions: [
				{ id: "writing_1", label: t("surveyB.questions.writing.writing_1") },
				{ id: "writing_2", label: t("surveyB.questions.writing.writing_2") },
				{ id: "writing_3", label: t("surveyB.questions.writing.writing_3") }
			]
		}
	];

	useEffect(() => {
		const loadSurvey = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_USERS_SERVICE_URL}/surveys/${studentId}/A`,
					{
						headers: {
							Authorization: `Bearer ${localStorage.getItem("accessToken")}`
						}
					}
				);

				if (!response.ok) return;

				const data = await response.json();

				const {
					id,
					studentId: responseStudentId,
					teacherId,
					score,
					date,
					surveyCode,
					...responses
				} = data;

				setSurveyId(data.id);
				form.setFieldsValue(responses);

			} catch (e) {
				console.error("Error cargando encuesta", e);
			}
		};

		if (studentId) {
			loadSurvey();
		}
	}, [studentId, form]);

	const onNext = () => {
		if (currentStep === 0) {
			// En el step de instrucciones, simplemente pasar al siguiente
			setCurrentStep(currentStep + 1);
		} else {
			// Validar que todas las preguntas del step actual estén respondidas
			const currentCategory = categories[currentStep - 1];
			const unansweredQuestions = currentCategory.questions.filter(
				question => form.getFieldValue(question.id) === undefined || form.getFieldValue(question.id) === null
			);

			if (unansweredQuestions.length > 0) {
				setMessage({ error: { type: "surveyA.validationError" } });
			} else {
				setMessage(null);
				setCurrentStep(currentStep + 1);
			}
		}
	};

	const onPrev = () => {
		setCurrentStep(currentStep - 1);
	};

	const onFinish = async () => {
		try {
			await form.validateFields();
		} catch (e) {
			setMessage({ error: { type: "surveyA.validationError" } });
			return;
		}

		const allValues = form.getFieldsValue(true);
		let total = Object.values(allValues).reduce((acc, val) => {
			if ( Number.isInteger(val) && val > 0 ) {
				return acc + val;
			}
			return acc + 0;
		}, 0);
		delete allValues.remember;

		let response = null;
		try {
			const url = surveyId
				? `${process.env.REACT_APP_USERS_SERVICE_URL}/surveys/${surveyId}/A`
				: `${process.env.REACT_APP_USERS_SERVICE_URL}/surveys/A`;

			const method = surveyId ? "PUT" : "POST";

			response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("accessToken")}`
				},
				body: JSON.stringify({
					studentId,
					score: total,
					responses: allValues
				})
			});
		}
		catch ( e ) {
			setMessage({ error: { type: "internalServerError", message: e.message } });
			return;
		}

		if ( response?.ok ) {
			navigate("/teachers/classrooms/" + classroomName);
		} else {
			let jsonData = await response?.json();
			setMessage({ error: jsonData?.error || { type: "unknownError", message: "Error desconocido" } });
		}
	};

	// Crear items para Steps incluyendo instrucciones
	const stepsItems = [
		{ key: 0, title: t("surveyA.instructions.title") },
		...categories.map((cat, index) => ({ key: index + 1, title: cat.name }))
	];

	// Generar columnas para Table
	const getTableColumns = () => {
		const columns = [
			{
				title: t("survey.table.item") || "Ítem",
				dataIndex: "label",
				key: "label",
				width: 250,
				render: (text, record) => {
					const isUnanswered = message?.error?.type === "surveyA.validationError" && (form.getFieldValue(record.id) === undefined || form.getFieldValue(record.id) === null);
					return (
						<div>
							<div>{text}</div>
							{isUnanswered && (
								<div style={{color: "#ff4d4f", fontSize: "0.75rem", marginTop: "0.25rem"}}>
									• {t("surveyA.validationError")}
								</div>
							)}
						</div>
					);
				}
			}
		];

		responseOptions.forEach((option) => {
			columns.push({
				title: option.label,
				dataIndex: option.value,
				key: option.value,
				width: 80,
				align: "center",
				render: (_, record) => (
					<Radio
						checked={form.getFieldValue(record.id) === option.value}
						onChange={() => {
							form.setFieldValue(record.id, option.value);
							setUpdateTrigger(prev => prev + 1);
						}}
					/>
				)
			});
		});

		return columns;
	};

	return (
		<div>
			<div style={{ width: "90vw", marginLeft: "auto", marginRight: "auto", marginTop: "2vh" }}>
				<TeacherBreadcrumb />
			</div>
			<Card title={<Title level={3}>{t("surveyA.title")}</Title>} style={{maxWidth: "90vw", marginLeft: "auto", marginRight: "auto"}}>
				{message?.error?.type && (
					<Alert type="error" title={t(message?.error?.type)} showIcon style={{marginBottom: "1vh"}}/>
				)}

				<Steps current={currentStep} titlePlacement="vertical" size="small" items={stepsItems} onChange={(value) => setCurrentStep(value)} style={{marginBottom: "2rem"}}/>

				<Form form={form} name="surveyA" layout="vertical" onFinish={onFinish} style={{marginTop: "2rem"}}>
					{currentStep === 0 ? (
						<div style={{marginBottom: "2rem"}}>
							<ol style={{marginLeft: "1.5rem", lineHeight: "1.8"}}>
								<li>{t("surveyA.instructions.instruction1")}</li>
								<li>{t("surveyA.instructions.instruction2")}</li>
								<li>{t("surveyA.instructions.instruction3")}</li>
								<li>{t("surveyA.instructions.instruction4")}</li>
								<li>{t("surveyA.instructions.instruction5")}</li>
								<li>{t("surveyA.instructions.instruction6")}</li>
							</ol>
						</div>
					) : (
						<div style={{marginBottom: "2rem"}}>
							<h3 style={{fontSize: "1.1em", fontWeight: "bold", marginBottom: "1rem", backgroundColor: "#f0f0f0", padding: "0.5rem"}}>{categories[currentStep - 1].name}</h3>
							<Table
								columns={getTableColumns()}
								dataSource={categories[currentStep - 1].questions}
								rowKey="id"
								pagination={false}
								bordered
								size="small"
								scroll={{ x: true }}
							/>
						</div>
					)}

					<div style={{marginTop: "2rem", display: "flex", justifyContent: currentStep === 0 ? "flex-end" : "space-between", gap: "1rem"}}>
						{currentStep > 0 && <Button size="large" onClick={onPrev}>{t("surveyA.button.prev")}</Button>}
						{currentStep < stepsItems.length - 1 && <Button type="primary" size="large" onClick={onNext}>{t("surveyA.button.next")}</Button>}
						{currentStep === stepsItems.length - 1 && <Button type="primary" size="large" htmlType="submit">{t("surveyA.button.submit")}</Button>}
					</div>
				</Form>
			</Card>
		</div>
	);
};

export default SurveyA;







