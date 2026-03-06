import { Alert, Button, Card, Flex, Form, Radio, Steps, Typography } from "antd";
import { useEffect, useRef, useState } from "react";
import { useTranslation }                                            from "react-i18next";
import { useNavigate, useParams }                                    from "react-router-dom";
import TeacherBreadcrumb from "./BreadcrumbComponent";

const { Step } = Steps;

const SurveyB = () => {

	let { studentId, classroomName } = useParams();
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [currentStep, setCurrentStep] = useState(0);
	const [form] = Form.useForm();
	const [message, setMessage] = useState(null);
	const [surveyId, setSurveyId] = useState(null);

	const stepsContainerRef = useRef(null);

	useEffect(() => {
		if (stepsContainerRef.current) {
			const stepItems = stepsContainerRef.current.querySelectorAll(".ant-steps-item");
			const currentItem = stepItems[currentStep];
			if (currentItem && currentItem.scrollIntoView) {
				currentItem.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
			}
		}
	}, [currentStep]);

	const responseOptions = [
		{ label: t("surveyB.options.never"), value: 0 },
		{ label: t("surveyB.options.almostNever"), value: 1 },
		{ label: t("surveyB.options.fewTimes"), value: 2 },
		{ label: t("surveyB.options.sometimes"), value: 3 },
		{ label: t("surveyB.options.often"), value: 4 },
		{ label: t("surveyB.options.unknown"), value: -1 }
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

				// Campos que NO son respuestas
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


				// Cargamos SOLO lo que exista
				form.setFieldsValue(responses);

			} catch (e) {
				console.error("Error cargando encuesta", e);
			}
		};

		if (studentId) {
			loadSurvey();
		}
	}, [studentId, form]);

	const steps = [
		{
			title:   t("surveyB.steps.reading"),
			content: (
				         <>
					         <Form.Item name="reading_1" label={t("surveyB.questions.reading.reading_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="reading_2" label={t("surveyB.questions.reading.reading_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="reading_3" label={t("surveyB.questions.reading.reading_3")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="reading_4" label={t("surveyB.questions.reading.reading_4")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="reading_5" label={t("surveyB.questions.reading.reading_5")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyB.steps.orthography"),
			content: (
				         <>
					         <Form.Item name="orthography_1" label={t("surveyB.questions.orthography.orthography_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="orthography_2"
					                    label={t("surveyB.questions.orthography.orthography_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="orthography_3" label={t("surveyB.questions.orthography.orthography_3")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyB.steps.writeExpression"),
			content: (
				         <>
					         <Form.Item name="writeExpression_1" label={t("surveyB.questions.writeExpression.writeExpression_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="writeExpression_2" label={t("surveyB.questions.writeExpression.writeExpression_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyB.steps.generalBehavior"),
			content: (
				         <>
					         <Form.Item name="generalBehavior_1" label={t("surveyB.questions.generalBehavior.generalBehavior_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="generalBehavior_2" label={t("surveyB.questions.generalBehavior.generalBehavior_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="generalBehavior_3" label={t("surveyB.questions.generalBehavior.generalBehavior_3")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="generalBehavior_4" label={t("surveyB.questions.generalBehavior.generalBehavior_4")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="generalBehavior_5"
					                    label={t("surveyB.questions.generalBehavior.generalBehavior_5")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyB.steps.mathAbility"),
			content: (
				         <>
					         <Form.Item name="mathAbility_1" label={t("surveyB.questions.mathAbility.mathAbility_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="mathAbility_2" label={t("surveyB.questions.mathAbility.mathAbility_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="mathAbility_3" label={t("surveyB.questions.mathAbility.mathAbility_3")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyB.steps.speechAbility"),
			content: (
				         <>
					         <Form.Item name="speechAbility_1" label={t("surveyB.questions.speechAbility.speechAbility_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="speechAbility_2" label={t("surveyB.questions.speechAbility.speechAbility_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="speechAbility_3" label={t("surveyB.questions.speechAbility.speechAbility_3")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="speechAbility_4" label={t("surveyB.questions.speechAbility.speechAbility_4")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyB.steps.memoryAbility"),
			content: (
				         <>
					         <Form.Item name="memoryAbility_1"
					                    label={t("surveyB.questions.memoryAbility.memoryAbility_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="memoryAbility_2" label={t("surveyB.questions.memoryAbility.memoryAbility_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="memoryAbility_3"
					                    label={t("surveyB.questions.memoryAbility.memoryAbility_3")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="memoryAbility_4" label={t("surveyB.questions.memoryAbility.memoryAbility_4")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="memoryAbility_5" label={t("surveyB.questions.memoryAbility.memoryAbility_5")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="memoryAbility_6" label={t("surveyB.questions.memoryAbility.memoryAbility_6")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="memoryAbility_7"
					                    label={t("surveyB.questions.memoryAbility.memoryAbility_7")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyB.steps.attentionAbility"),
			content: (
				         <>
					         <Form.Item name="attentionAbility_1" label={t("surveyB.questions.attentionAbility.attentionAbility_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="attentionAbility_2"
					                    label={t("surveyB.questions.attentionAbility.attentionAbility_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="attentionAbility_3"
					                    label={t("surveyB.questions.attentionAbility.attentionAbility_3")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyB.steps.sequenceAbility"),
			content: (
				         <>
					         <Form.Item name="sequenceAbility_1" label={t("surveyB.questions.sequenceAbility.sequenceAbility_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="sequenceAbility_2" label={t("surveyB.questions.sequenceAbility.sequenceAbility_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="sequenceAbility_3" label={t("surveyB.questions.sequenceAbility.sequenceAbility_3")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="sequenceAbility_4"
					                    label={t("surveyB.questions.sequenceAbility.sequenceAbility_4")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="sequenceAbility_5" label={t("surveyB.questions.sequenceAbility.sequenceAbility_5")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyB.steps.muscleCoordination"),
			content: (
				         <>
					         <Form.Item name="muscleCoordination_1" label={t("surveyB.questions.muscleCoordination.muscleCoordination_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="muscleCoordination_2" label={t("surveyB.questions.muscleCoordination.muscleCoordination_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="muscleCoordination_3" label={t("surveyB.questions.muscleCoordination.muscleCoordination_3")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="muscleCoordination_4"
					                    label={t("surveyB.questions.muscleCoordination.muscleCoordination_4")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="muscleCoordination_5" label={t("surveyB.questions.muscleCoordination.muscleCoordination_5")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="muscleCoordination_6" label={t("surveyB.questions.muscleCoordination.muscleCoordination_6")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="muscleCoordination_7" label={t("surveyB.questions.muscleCoordination.muscleCoordination_7")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyB.steps.spatialOrientation"),
			content: (
				         <>
					         <Form.Item name="spatialOrientation_1" label={t("surveyB.questions.spatialOrientation.spatialOrientation_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="spatialOrientation_2"
					                    label={t("surveyB.questions.spatialOrientation.spatialOrientation_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyB.steps.emotionsSocialAdaptation"),
			content: (
				         <>
					         <Form.Item name="emotionsSocialAdaptation_1"
					                    label={t("surveyB.questions.emotionsSocialAdaptation.emotionsSocialAdaptation_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="emotionsSocialAdaptation_2"
					                    label={t("surveyB.questions.emotionsSocialAdaptation.emotionsSocialAdaptation_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="emotionsSocialAdaptation_3" label={t("surveyB.questions.emotionsSocialAdaptation.emotionsSocialAdaptation_3")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="emotionsSocialAdaptation_4" label={t("surveyB.questions.emotionsSocialAdaptation.emotionsSocialAdaptation_4")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="emotionsSocialAdaptation_5"
					                    label={t("surveyB.questions.emotionsSocialAdaptation.emotionsSocialAdaptation_5")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}
	];

	const onNext = () => {
		form
			.validateFields()
			.then(() => {
				setMessage(null);
				setCurrentStep(currentStep + 1);
			})
			.catch(() => setMessage({ error: { type: "surveyB.validationError" } }));
	};

	const onPrev = () => {
		setCurrentStep(currentStep - 1);
	};

	const onFinish = async () => {
		const allValues = form.getFieldsValue(true);
		let total = Object.values(allValues).reduce((acc, val) => {
			if ( Number.isInteger(val) && val > 0 ) {
				return acc + val;
			}
			return acc + 0;
		}, 0);
		delete allValues.remember

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

	const { Title } = Typography;

	return (
		<div>
			<div style={{ width: "85vw", marginLeft: "auto", marginRight: "auto", marginTop: "2vh" }}>
				<TeacherBreadcrumb />
			</div>
			<Card title={ <Title level={ 3 } style={ { whiteSpace: "normal", wordBreak: "break-word" } }>{ t("surveyB.title") }</Title> } style={ { maxWidth: "85vw" } }>
			{ message?.error?.type && (
				<Alert type="error" message={ t(message?.error?.type) } showIcon style={ { marginBottom: "1vh" } }/>
			) }
			<div
				ref={stepsContainerRef}
				style={{
					overflowX: "auto",
					maxWidth: "100%",
					paddingBottom: "1rem",
				}}
			>
				<Steps current={ currentStep } size="small" labelPlacement="vertical" onChange={ (value) => setCurrentStep(value) }>
					{ steps.map((item) => (
						<Step key={ item.title } title={ item.title }/>
					)) }
				</Steps>
			</div>
			<Flex justify="space-around">
				<Form labelWrap form={ form } name="surveyB" layout="vertical" onFinish={ onFinish } initialValues={ { remember: true } } style={ { marginTop: "2rem" } }>
					{ steps[ currentStep ].content }
					<Flex justify="space-between" gap={ 30 }>
						{ currentStep > 0 && <Button block onClick={ onPrev }>{ t("surveyB.button.prev") }</Button> }
						{ currentStep < steps.length - 1 && <Button block type="primary" onClick={ onNext }>{ t("surveyB.button.next") }</Button> }
						{ currentStep === steps.length - 1 && <Button block type="primary" htmlType="submit">{ t("surveyB.button.submit") }</Button> }
					</Flex>
				</Form>
			</Flex>
		</Card>
		</div>
	);
};

export default SurveyB;