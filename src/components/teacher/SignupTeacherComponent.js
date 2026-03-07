import { Alert, Button, Card, Form, Input, Select, Steps } from "antd";
import { useState }                                        from "react";
import { useTranslation }                                  from "react-i18next";
import { useNavigate }                                     from "react-router-dom";
import { COMMUNITIES }                                     from "../../Globals";

const SignupTeacher = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [currentStep, setCurrentStep] = useState(0);
	const [form] = Form.useForm();
	const [message, setMessage] = useState(null);

	const steps = [
		{
			title:   t("signup.steps.basicInfo"),
			content: (
				         <>
					         <Form.Item
						         name="name"
						         label={ t("signup.form.label.name") }
						         rules={ [
							         { required: true, message: t("signup.error.name"), whitespace: true }
						         ] }
					         >
						         <Input placeholder={ t("signup.form.placeholder.name") }/>
					         </Form.Item>
					         <Form.Item
						         name="lastName"
						         label={ t("signup.form.label.lastName") }
						         rules={ [
							         { required: true, message: t("signup.error.lastName"), whitespace: true }
						         ] }
					         >
						         <Input placeholder={ t("signup.form.placeholder.lastName") }/>
					         </Form.Item>
					         <Form.Item
						         name="email"
						         label={ t("signup.form.label.email") }
						         rules={ [
							         { type: "email", message: t("signup.error.email.format") }, { required: true, message: t("signup.error.email.empty") }
						         ] }
					         >
						         <Input placeholder={ t("signup.form.placeholder.email") }/>
					         </Form.Item>
					         <Form.Item
						         name="password"
						         label={ t("signup.form.label.password") }
						         rules={ [
							         { required: true, message: t("signup.error.password.empty") }, {
								         pattern: /^(?=.*[\d])(?=.*[!@#$%&*])[\w!@#$%&*]{8,12}$/, message: t("signup.error.password.format")
							         }
						         ] }
					         >
						         <Input.Password placeholder="******"/>
					         </Form.Item>
					         <Form.Item
						         name="confirm"
						         label={ t("signup.form.label.confirm") }
						         dependencies={ ["password"] }
						         rules={ [
							         { required: true, message: t("signup.error.password.confirm") },
							         ({ getFieldValue }) => (
								         {
									         validator(_, value) {
										         if ( !value || getFieldValue("password") === value ) {
											         return Promise.resolve();
										         }
										         return Promise.reject(new Error(t("signup.error.password.unmatch")));
									         }
								         }
							         )
						         ] }
					         >
						         <Input.Password placeholder="******"/>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("signup.steps.additionalInfo"),
			content: (
				         <>
					         <Form.Item
						         name="teachingStage"
						         label={ t("signup.form.label.teachingStage") }
						         rules={ [{ required: true, message: t("signup.error.teachingStage") }] }
					         >
						         <Select placeholder={ t("signup.form.placeholder.teachingStage") }
								 options={[
									 { value: "infantil", label: t("signup.form.options.infantil") },
									 { value: "primaria", label: t("signup.form.options.primaria") },
									 { value: "secundaria", label: t("signup.form.options.secundaria") }
								 ]}
								 />
					         </Form.Item>
					         <Form.Item
						         name="schoolType"
						         label={ t("signup.form.label.schoolType") }
						         rules={ [{ required: true, message: t("signup.error.schoolType") }] }
					         >
						         <Select placeholder={ t("signup.form.placeholder.schoolType") }
								 options={[
									 { value: "public", label: t("signup.form.options.public") },
									 { value: "concertado", label: t("signup.form.options.concertado") },
									 { value: "private", label: t("signup.form.options.private") }
								 ]}
								 />
					         </Form.Item>
					         <Form.Item
						         name="schoolLocation"
						         label={ t("signup.form.label.schoolLocation") }
						         rules={ [{ required: true, message: t("signup.error.schoolLocation") }] }
					         >
						         <Select placeholder={ t("signup.form.placeholder.schoolLocation") }
								 options={[
									 { value: "rural", label: t("signup.form.options.rural") },
									 { value: "urban", label: t("signup.form.options.urban") }
								 ]}
								 />
					         </Form.Item>
					         <Form.Item
						         name="gender"
						         label={ t("signup.form.label.gender") }
						         rules={ [{ required: true, message: t("signup.error.gender") }] }
					         >
						         <Select placeholder={ t("signup.form.placeholder.gender") }
								 options={[
									 { value: "male", label: t("signup.form.options.male") },
									 { value: "female", label: t("signup.form.options.female") },
									 { value: "nonBinary", label: t("signup.form.options.nonBinary") },
									 { value: "preferNotToSay", label: t("signup.form.options.preferNotToSay") }
								 ]}
								 />
					         </Form.Item>
				         </>
			         )
		}, {
			title:   t("signup.steps.finalInfo"),
			content: (
				         <>
					         <Form.Item
						         name="experienceYears"
						         label={ t("signup.form.label.experienceYears") }
						         rules={ [
							         { required: true, message: t("signup.error.experienceYears") }
						         ] }
					         >
						         <Input type="number" placeholder={ t("signup.form.placeholder.experienceYears") }/>
					         </Form.Item>
					         <Form.Item
						         name="community"
						         label={ t("signup.form.label.community") }
						         rules={ [{ required: true, message: t("signup.error.community.empty") }] }
					         >
						         <Select placeholder={ t("signup.form.placeholder.community") }>
							         { COMMUNITIES.map((community) => (
								         <Select.Option key={ community.key } value={ community.content }>
									         { community.content }
								         </Select.Option>
							         )) }
						         </Select>
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
			.catch(() => setMessage({ error: { type: "validationError" } }));
	};

	const onPrev = () => {
		setCurrentStep(currentStep - 1);
	};

	const onFinish = async () => {
		const {
			      name, lastName, email, password, teachingStage, schoolType, schoolLocation, gender, experienceYears, community
		      } = form.getFieldsValue(true);

		let response = null;

		try {
			// Llamada al servicio para registrar al profesor
			response = await fetch(`${ process.env.REACT_APP_USERS_SERVICE_URL }/teachers`, {
				method:  "POST", headers: {
					"Content-Type": "application/json", Authorization: `Bearer ${ localStorage.getItem("accessToken") }` // Token de autenticación
				}, body: JSON.stringify({
					                        name, lastName, email, password, teachingStage, schoolType, schoolLocation, gender, experienceYears: parseInt(experienceYears, 10), // Asegurarse
				                                                                                                                                                                // de
				                                                                                                                                                                // que
				                                                                                                                                                                // sea
				                                                                                                                                                                // un
				                                                                                                                                                                // número
					                        community
				                        })
			});
		}
		catch ( error ) {
			console.error("Error al intentar conectarse al servidor:", error);
			setMessage({ error: { type: "internalServerError", message: error.message } });
			return;
		}

		// Parsear la respuesta del servidor
		let jsonData;
		try {
			jsonData = await response.json();
		}
		catch ( error ) {
			console.error("Error al intentar parsear la respuesta del servidor:", error);
			setMessage({ error: { type: "invalidServerResponse", message: error.message } });
			return;
		}

		// Manejo de la respuesta del servidor
		if ( response.ok ) {
			setMessage(null); // Limpia cualquier mensaje previo
			console.log("Usuario creado exitosamente:", jsonData);
			navigate("/loginTeacher"); // Redirige al login de profesor
		} else {
			console.error("Error al crear usuario:", jsonData);
			setMessage({ error: jsonData?.error || { type: "unknownError" } });
		}
	};

	const stepsItems = steps.map((step, index) => ({key: index, title: step.title}));

	return (
		<Card title={ t("signup.title") } style={ { width: "80vw" } }>
			{ message?.error?.type && (
				<Alert
					type="error"
					title={ t(message?.error?.type) }
					showIcon
					style={ { marginBottom: "1vh" } }
				/>
			) }
			<Steps current={ currentStep } items={stepsItems} />
			<Form
				form={ form }
				name="signup"
				layout="vertical"
				onFinish={ onFinish }
				initialValues={ { remember: true } }
				style={ { marginTop: "2rem" } }
			>
				{ steps[ currentStep ].content }
				<div style={ { display: "flex", justifyContent: "space-between", marginTop: "2rem" } }>
					{ currentStep > 0 && (
						<Button onClick={ onPrev }>{ t("signup.button.prev") }</Button>
					) }
					{ currentStep < steps.length - 1 && (
						<Button type="primary" onClick={ onNext }>
							{ t("signup.button.next") }
						</Button>
					) }
					{ currentStep === steps.length - 1 && (
						<Button type="primary" htmlType="submit">
							{ t("signup.button.submit") }
						</Button>
					) }
				</div>
			</Form>
		</Card>
	);
};

export default SignupTeacher;
