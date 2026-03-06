import { Alert, Button, Card, Form, Input, InputNumber, Select } from "antd";
import { useForm }                                               from "antd/es/form/Form";
import { useEffect, useState }                      from "react";
import { useTranslation }                           from "react-i18next";
import { useNavigate }                              from "react-router-dom";
import { COMMUNITIES }                              from "../../Globals";
import TeacherBreadcrumb from "./BreadcrumbComponent";

const { Option } = Select;

let Profile = () => {
	const [form] = useForm();
	const [message, setMessage] = useState(null);

	const navigate = useNavigate();
	const { t } = useTranslation();

	useEffect(() => {
		const getProfile = async () => {
			try {
				const response = await fetch(`${ process.env.REACT_APP_USERS_SERVICE_URL }/teachers/profile`, {
					method: "GET", headers: { Authorization: `Bearer ${ localStorage.getItem("accessToken") }` }
				});
				const jsonData = await response.json();

				if ( response.ok ) {
					form.setFieldsValue({
						                    name:            jsonData.name,
						                    lastName:        jsonData.lastName,
						                    email:           jsonData.email,
						                    teachingStage:   jsonData.teachingStage,
						                    schoolType:      jsonData.schoolType,
						                    schoolLocation:  jsonData.schoolLocation,
						                    gender:          jsonData.gender,
						                    experienceYears: jsonData.experienceYears,
						                    community:       jsonData.community
					                    });
				} else {
					setMessage(Array.isArray(jsonData.error) ? jsonData.error : [jsonData.error]);
				}
			}
			catch ( error ) {
				setMessage({ error: { type: "internalServerError", message: error.message } });
			}
		};

		getProfile();
	}, [form]);

	const onFinish = async (values) => {
		try {
			const response = await fetch(`${ process.env.REACT_APP_USERS_SERVICE_URL }/teachers/profile`, {
				method:  "PUT", headers: {
					"Content-Type": "application/json", Authorization: `Bearer ${ localStorage.getItem("accessToken") }`
				}, body: JSON.stringify(values)
			});

			const jsonData = await response.json();

			if ( response.ok ) {
				navigate("/menuTeacher");
			} else {
				setMessage({ error: jsonData.error });
			}
		}
		catch ( e ) {
			setMessage({ error: { type: "internalServerError", message: e.message } });
		}
	};

	return (
		<div>
			<div style={{ width: "90vw", marginLeft: "auto", marginRight: "auto", marginTop: "2vh" }}>
				<TeacherBreadcrumb />
			</div>
			<Card title={ t("profile.title") } style={ { width: "90vw", marginTop: "2vh", marginBottom: "2vh" } }>
			{ message?.error?.type && (
				<Alert
					type="error"
					message={ t(message?.error?.type) }
					showIcon
					style={ { marginBottom: "1vh" } }
				/>
			) }
			<Form
				form={ form }
				name="modifyProfile"
				labelCol={ { xs: { span: 24 }, sm: { span: 6 } } }
				wrapperCol={ { xs: { span: 14 }, sm: { span: 6 } } }
				onFinish={ onFinish }
				scrollToFirstError
			>
				{/* Basic Info */ }
				<Form.Item
					name="name"
					label={ t("profile.label.name") }
					rules={ [{ required: true, message: t("profile.error.name"), whitespace: true }] }
				>
					<Input placeholder={ t("profile.placeholder.name") }/>
				</Form.Item>
				<Form.Item
					name="lastName"
					label={ t("profile.label.lastName") }
					rules={ [{ required: true, message: t("profile.error.lastName"), whitespace: true }] }
				>
					<Input placeholder={ t("profile.placeholder.lastName") }/>
				</Form.Item>
				<Form.Item
					name="email"
					label={ t("profile.label.email") }
					rules={ [
						{ type: "email", message: t("profile.error.email.format") }, { required: true, message: t("profile.error.email.empty") }
					] }
				>
					<Input placeholder={ t("profile.placeholder.email") }/>
				</Form.Item>

				{/* Additional Info */ }
				<Form.Item
					name="teachingStage"
					label={ t("profile.label.teachingStage") }
					rules={ [{ required: true, message: t("profile.error.teachingStage") }] }
				>
					<Select placeholder={ t("profile.placeholder.teachingStage") } allowClear>
						<Option value="infantil">{ t("profile.options.infant") }</Option>
						<Option value="primaria">{ t("profile.options.primary") }</Option>
						<Option value="secundaria">{ t("profile.options.secondary") }</Option>
					</Select>
				</Form.Item>
				<Form.Item
					name="schoolType"
					label={ t("profile.label.schoolType") }
					rules={ [{ required: true, message: t("profile.error.schoolType") }] }
				>
					<Select placeholder={ t("profile.placeholder.schoolType") } allowClear>
						<Option value="public">{ t("profile.options.public") }</Option>
						<Option value="concertado">{ t("profile.options.concerted") }</Option>
						<Option value="private">{ t("profile.options.private") }</Option>
					</Select>
				</Form.Item>
				<Form.Item
					name="schoolLocation"
					label={ t("profile.label.schoolLocation") }
					rules={ [{ required: true, message: t("profile.error.schoolLocation") }] }
				>
					<Select placeholder={ t("profile.placeholder.schoolLocation") } allowClear>
						<Option value="rural">{ t("profile.options.rural") }</Option>
						<Option value="urban">{ t("profile.options.urban") }</Option>
					</Select>
				</Form.Item>
				<Form.Item
					name="gender"
					label={ t("profile.label.gender") }
					rules={ [{ required: true, message: t("profile.error.gender") }] }
				>
					<Select placeholder={ t("profile.placeholder.gender") } allowClear>
						<Option value="male">{ t("profile.options.man") }</Option>
						<Option value="female">{ t("profile.options.woman") }</Option>
						<Option value="nonBinary">{ t("profile.options.nonBinary") }</Option>
						<Option value="preferNotToSay">{ t("profile.options.preferNotToSay") }</Option>
					</Select>
				</Form.Item>

				{/* Final Info */ }
				<Form.Item
					name="experienceYears"
					label={ t("profile.label.experienceYears") }
					rules={ [{ required: true, message: t("profile.error.experienceYears") }, { type: "number", min: 0, message: t("profile.error.experienceYearsMin") }] }
				>
					<InputNumber placeholder={ t("profile.placeholder.experienceYears") } min={0}/>
				</Form.Item>
				<Form.Item
					name="community"
					label={ t("profile.label.community") }
					rules={ [{ required: true, message: t("profile.error.community") }] }
				>
					<Select placeholder={ t("profile.placeholder.community") } allowClear>
						{ COMMUNITIES.map((community) => (
							<Select.Option key={ community.key } value={ community.content }>
								{ community.content }
							</Select.Option>
						)) }
					</Select>
				</Form.Item>

				<Form.Item wrapperCol={ { xs: { span: 24, offset: 0 }, sm: { span: 16, offset: 6 } } }>
					<Button type="primary" htmlType="submit">
						{ t("profile.button") }
					</Button>
				</Form.Item>
			</Form>
		</Card>
		</div>
	);
};

export default Profile;