import { Alert, Button, Card, Form, Radio, Steps, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import TeacherBreadcrumb from "./BreadcrumbComponent";

const SurveyB = () => {

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
		{ label: t("surveyB.options.never"), value: 0 },
		{ label: t("surveyB.options.almostNever"), value: 1 },
		{ label: t("surveyB.options.fewTimes"), value: 2 },
		{ label: t("surveyB.options.sometimes"), value: 3 },
		{ label: t("surveyB.options.often"), value: 4 },
		{ label: t("surveyB.options.unknown"), value: -1 }
	];

	// Definir las categorías y sus preguntas para SurveyB
	const categories = [
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
		},
		{
			name: t("surveyB.steps.general"),
			questions: [
				{ id: "general_1", label: t("surveyB.questions.general.general_1") },
				{ id: "general_2", label: t("surveyB.questions.general.general_2") },
				{ id: "general_3", label: t("surveyB.questions.general.general_3") }
			]
		},
		{
			name: t("surveyB.steps.speech"),
			questions: [
				{ id: "speech_1", label: t("surveyB.questions.speech.speech_1") },
				{ id: "speech_2", label: t("surveyB.questions.speech.speech_2") },
				{ id: "speech_3", label: t("surveyB.questions.speech.speech_3") }
			]
		},
		{
			name: t("surveyB.steps.memory"),
			questions: [
				{ id: "memory_1", label: t("surveyB.questions.memory.memory_1") },
				{ id: "memory_2", label: t("surveyB.questions.memory.memory_2") },
				{ id: "memory_3", label: t("surveyB.questions.memory.memory_3") }
			]
		},
		{
			name: t("surveyB.steps.attention"),
			questions: [
				{ id: "attention_1", label: t("surveyB.questions.attention.attention_1") },
				{ id: "attention_2", label: t("surveyB.questions.attention.attention_2") },
				{ id: "attention_3", label: t("surveyB.questions.attention.attention_3") }
			]
		},
		{
			name: t("surveyB.steps.coordination"),
			questions: [
				{ id: "coordination_1", label: t("surveyB.questions.coordination.coordination_1") },
				{ id: "coordination_2", label: t("surveyB.questions.coordination.coordination_2") },
				{ id: "coordination_3", label: t("surveyB.questions.coordination.coordination_3") }
			]
		},
		{
			name: t("surveyB.steps.emotion"),
			questions: [
				{ id: "emotion_1", label: t("surveyB.questions.emotion.emotion_1") },
				{ id: "emotion_2", label: t("surveyB.questions.emotion.emotion_2") },
				{ id: "emotion_3", label: t("surveyB.questions.emotion.emotion_3") }
			]
		}
	];

	useEffect(() => {
		const loadSurvey = async () => {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_USERS_SERVICE_URL}/surveys/${studentId}/B`,
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
			setCurrentStep(currentStep + 1);
		} else {
			const currentCategory = categories[currentStep - 1];
			const unansweredQuestions = currentCategory.questions.filter(
				question => form.getFieldValue(question.id) === undefined || form.getFieldValue(question.id) === null
			);

			if (unansweredQuestions.length > 0) {
				setMessage({ error: { type: "surveyB.validationError" } });
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
			setMessage({ error: { type: "surveyB.validationError" } });
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
				? `${process.env.REACT_APP_USERS_SERVICE_URL}/surveys/${surveyId}/B`
				: `${process.env.REACT_APP_USERS_SERVICE_URL}/surveys/B`;

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

	const stepsItems = categories.map((cat, index) => ({key: index, title: cat.name}));

	return (
		<div>
			<div style={{ width: "90vw", marginLeft: "auto", marginRight: "auto", marginTop: "2vh" }}>
				<TeacherBreadcrumb />
			</div>
			<Card title={<Title level={3}>{t("surveyB.title")}</Title>} style={{maxWidth: "90vw", marginLeft: "auto", marginRight: "auto"}}>
				{message?.error?.type && (
					<Alert type="error" title={t(message?.error?.type)} showIcon style={{marginBottom: "1vh"}}/>
				)}

				<Steps current={currentStep} size="small" titlePlacement="vertical" onChange={(value) => setCurrentStep(value)} style={{marginBottom: "2rem"}} items={stepsItems}/>

				<Form form={form} name="surveyB" layout="vertical" onFinish={onFinish} style={{marginTop: "2rem"}}>
					{currentStep === 0 ? (
						<div style={{marginBottom: "2rem"}}>
							<ol style={{marginLeft: "1.5rem", lineHeight: "1.8"}}>
								<li>{t("surveyB.instructions.instruction1")}</li>
								<li>{t("surveyB.instructions.instruction2")}</li>
								<li>{t("surveyB.instructions.instruction3")}</li>
								<li>{t("surveyB.instructions.instruction4")}</li>
								<li>{t("surveyB.instructions.instruction5")}</li>
								<li>{t("surveyB.instructions.instruction6")}</li>
							</ol>
						</div>
					) : (
						<div style={{marginBottom: "2rem"}}>
							<h3 style={{fontSize: "1.1em", fontWeight: "bold", marginBottom: "1rem", backgroundColor: "#f0f0f0", padding: "0.5rem"}}>{categories[currentStep - 1].name}</h3>
							<div style={{overflowX: "auto"}}>
								<table style={{width: "100%", borderCollapse: "collapse", border: "1px solid #d9d9d9"}}>
									<thead>
										<tr style={{backgroundColor: "#fafafa"}}>
											<th style={{border: "1px solid #d9d9d9", padding: "0.75rem", textAlign: "left", minWidth: "250px"}}>Ítem</th>
											{responseOptions.map((option) => (
												<th key={option.value} style={{border: "1px solid #d9d9d9", padding: "0.75rem", textAlign: "center", minWidth: "80px"}}>
													{option.label}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{categories[currentStep - 1].questions.map((question) => {
											const isUnanswered = message?.error?.type === "surveyB.validationError" && (form.getFieldValue(question.id) === undefined || form.getFieldValue(question.id) === null);
											return (
												<tr key={question.id}>
													<td style={{border: "1px solid #d9d9d9", padding: "0.75rem", fontWeight: "500", verticalAlign: "top"}}>
														<div>{question.label}</div>
														{isUnanswered && (
															<div style={{color: "#ff4d4f", fontSize: "0.75rem", marginTop: "0.25rem"}}>
																• {t("surveyB.validationError")}
															</div>
														)}
													</td>
													{responseOptions.map((option) => (
														<td key={option.value} style={{border: "1px solid #d9d9d9", padding: "0.75rem", textAlign: "center"}}>
															<Radio
																checked={form.getFieldValue(question.id) === option.value}
																onChange={() => {
																	form.setFieldValue(question.id, option.value);
																	setUpdateTrigger(prev => prev + 1);
																}}
															/>
														</td>
													))}
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
					)}

					<div style={{marginTop: "2rem", display: "flex", justifyContent: currentStep === 0 ? "flex-end" : "space-between", gap: "1rem"}}>
						{currentStep > 0 && <Button size="large" onClick={onPrev}>{t("surveyB.button.prev")}</Button>}
						{currentStep < categories.length && <Button type="primary" size="large" onClick={onNext}>{t("surveyB.button.next")}</Button>}
						{currentStep === categories.length && <Button type="primary" size="large" htmlType="submit">{t("surveyB.button.submit")}</Button>}
					</div>
				</Form>
			</Card>
		</div>
	);
};

export default SurveyB;

