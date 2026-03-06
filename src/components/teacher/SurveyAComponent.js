import { Alert, Button, Card, Flex, Form, Radio, Steps, Typography } from "antd";
import {useEffect, useState} from "react";
import { useTranslation }                                            from "react-i18next";
import { useNavigate, useParams }                                    from "react-router-dom";
import TeacherBreadcrumb from "./BreadcrumbComponent";

const { Step } = Steps;

const SurveyA = () => {

	let { studentId, classroomName } = useParams();
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [currentStep, setCurrentStep] = useState(0);
	const [form] = Form.useForm();
	const [message, setMessage] = useState(null);
	const [surveyId, setSurveyId] = useState(null);

	const responseOptions = [
		{ label: t("surveyA.options.never"), value: 0 },
		{ label: t("surveyA.options.almostNever"), value: 1 },
		{ label: t("surveyA.options.fewTimes"), value: 2 },
		{ label: t("surveyA.options.sometimes"), value: 3 },
		{ label: t("surveyA.options.often"), value: 4 },
		{ label: t("surveyA.options.unknown"), value: -1 }
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
			title:   t("surveyA.steps.generalBehavior"),
			content: (
				         <>
					         <Form.Item name="generalBehavior_1" label={t("surveyA.questions.generalBehavior.generalBehavior_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="generalBehavior_2" label={t("surveyA.questions.generalBehavior.generalBehavior_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="generalBehavior_3" label={t("surveyA.questions.generalBehavior.generalBehavior_3")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyA.steps.speechAbility"),
			content: (
				         <>
					         <Form.Item name="speechAbility_1" label={t("surveyA.questions.speechAbility.speechAbility_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="speechAbility_2" label={t("surveyA.questions.speechAbility.speechAbility_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="speechAbility_3" label={t("surveyA.questions.speechAbility.speechAbility_3")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="speechAbility_4" label={t("surveyA.questions.speechAbility.speechAbility_4")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyA.steps.memoryAbility"),
			content: (
				         <>
					         <Form.Item name="memoryAbility_1"
					                    label={t("surveyA.questions.memoryAbility.memoryAbility_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="memoryAbility_2" label={t("surveyA.questions.memoryAbility.memoryAbility_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="memoryAbility_3"
					                    label={t("surveyA.questions.memoryAbility.memoryAbility_3")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="memoryAbility_4" label={t("surveyA.questions.memoryAbility.memoryAbility_4")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="memoryAbility_5" label={t("surveyA.questions.memoryAbility.memoryAbility_5")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="memoryAbility_6" label={t("surveyA.questions.memoryAbility.memoryAbility_6")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="memoryAbility_7"
					                    label={t("surveyA.questions.memoryAbility.memoryAbility_7")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyA.steps.attentionAbility"),
			content: (
				         <>
					         <Form.Item name="attentionAbility_1" label={t("surveyA.questions.attentionAbility.attentionAbility_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="attentionAbility_2"
					                    label={t("surveyA.questions.attentionAbility.attentionAbility_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="attentionAbility_3"
					                    label={t("surveyA.questions.attentionAbility.attentionAbility_3")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyA.steps.sequenceAbility"),
			content: (
				         <>
					         <Form.Item name="sequenceAbility_1" label={t("surveyA.questions.sequenceAbility.sequenceAbility_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="sequenceAbility_2"
					                    label={t("surveyA.questions.sequenceAbility.sequenceAbility_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="sequenceAbility_3" label={t("surveyA.questions.sequenceAbility.sequenceAbility_3")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyA.steps.muscleCoordination"),
			content: (
				         <>
					         <Form.Item name="muscleCoordination_1" label={t("surveyA.questions.muscleCoordination.muscleCoordination_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="muscleCoordination_2" label={t("surveyA.questions.muscleCoordination.muscleCoordination_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="muscleCoordination_3" label={t("surveyA.questions.muscleCoordination.muscleCoordination_3")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="muscleCoordination_4"
					                    label={t("surveyA.questions.muscleCoordination.muscleCoordination_4")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="muscleCoordination_5" label={t("surveyA.questions.muscleCoordination.muscleCoordination_5")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="muscleCoordination_6" label={t("surveyA.questions.muscleCoordination.muscleCoordination_6")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="muscleCoordination_7" label={t("surveyA.questions.muscleCoordination.muscleCoordination_7")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyA.steps.spatialOrientation"),
			content: (
				         <>
					         <Form.Item name="spatialOrientation_1" label={t("surveyA.questions.spatialOrientation.spatialOrientation_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="spatialOrientation_2"
					                    label={t("surveyA.questions.spatialOrientation.spatialOrientation_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("surveyA.steps.emotionsSocialAdaptation"),
			content: (
				         <>
					         <Form.Item name="emotionsSocialAdaptation_1"
					                    label={t("surveyA.questions.emotionsSocialAdaptation.emotionsSocialAdaptation_1")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="emotionsSocialAdaptation_2" label={t("surveyA.questions.emotionsSocialAdaptation.emotionsSocialAdaptation_2")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="emotionsSocialAdaptation_3" label={t("surveyA.questions.emotionsSocialAdaptation.emotionsSocialAdaptation_3")} rules={[{ required: true, message: t("select") }]}>
						         <Radio.Group>
							         { responseOptions.map((option) => (
								         <Radio.Button key={ option.value } value={ option.value }>{ option.label }</Radio.Button>
							         )) }
						         </Radio.Group>
					         </Form.Item>
					         <Form.Item name="emotionsSocialAdaptation_4"
					                    label={t("surveyA.questions.emotionsSocialAdaptation.emotionsSocialAdaptation_4")} rules={[{ required: true, message: t("select") }]}>
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
			.catch(() => setMessage({ error: { type: "surveyA.validationError" } }));
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

	const { Title } = Typography;

	return (
		<div>
			<div style={{ width: "70vw", marginLeft: "auto", marginRight: "auto", marginTop: "2vh" }}>
				<TeacherBreadcrumb />
			</div>
			<Card title={ <Title level={ 3 } style={ { whiteSpace: "normal", wordBreak: "break-word" } }>{ t("surveyA.title") }</Title> } style={ { maxWidth: "70vw" } }>
			{ message?.error?.type && (
				<Alert type="error" message={ t(message?.error?.type) } showIcon style={ { marginBottom: "1vh" } }/>
			) }
			<Steps current={ currentStep } size="small" labelPlacement="vertical" onChange={ (value) => setCurrentStep(value) }>
				{ steps.map((item) => (
					<Step key={ item.title } title={ item.title }/>
				)) }
			</Steps>
			<Flex justify="space-around">
				<Form labelWrap form={ form } name="surveyA" layout="vertical" onFinish={ onFinish } initialValues={ { remember: true } } style={ { marginTop: "2rem" } }>
					{ steps[ currentStep ].content }
					<Flex justify="space-between" gap={ 30 }>
						{ currentStep > 0 && <Button block onClick={ onPrev }>{ t("surveyA.button.prev") }</Button> }
						{ currentStep < steps.length - 1 && <Button block type="primary" onClick={ onNext }>{ t("surveyA.button.next") }</Button> }
						{ currentStep === steps.length - 1 && <Button block type="primary" htmlType="submit">{ t("surveyA.button.submit") }</Button> }
					</Flex>
				</Form>
			</Flex>
		</Card>
		</div>
	);
};

export default SurveyA;