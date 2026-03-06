import { MinusCircleOutlined, PlusOutlined }                                                                         from "@ant-design/icons";
import { Alert, Button, Card, Checkbox, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space, Spin, Steps } from "antd";
import moment                                                                                                        from "moment";
import React, { useEffect, useState }                                                                                from "react";
import { useTranslation }                                                                                            from "react-i18next";
import { useNavigate, useParams }                                                                                    from "react-router-dom";
import TeacherBreadcrumb from "./BreadcrumbComponent";

const { Step } = Steps;
const { Option } = Select;

const StudentDetail = () => {
	const { studentId, classroomName } = useParams();
	const [form] = Form.useForm();
	const [currentStep, setCurrentStep] = useState(0);
	const [classrooms, setClassrooms] = useState([]);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState(null);
	const [showOtherSupportNeeds, setShowOtherSupportNeeds] = useState(false);
	const [showOtherEducationalSupport, setShowOtherEducationalSupport] = useState(false);
	const [showNEAE, setShowNEAE] = useState(false);
	const [showOtherNationalOrigin, setShowOtherNationalOrigin] = useState(false);
	const [showEducationalSupport, setShowEducationalSupport] = useState(false);
	const navigate = useNavigate();
	const { t } = useTranslation();

	const steps = [
		{
			title:   "Información Básica",
			content: (
				         <>
					         <Form.Item
						         name="name"
						         label="Nombre"
						         rules={ [{ required: true, message: "Por favor, ingrese el nombre" }] }
					         >
						         <Input/>
					         </Form.Item>
					         <Form.Item
						         name="lastName"
						         label="Apellido"
						         rules={ [{ required: true, message: "Por favor, ingrese el apellido" }] }
					         >
						         <Input/>
					         </Form.Item>
							 <Form.Item
								 name="sex"
								 label={t("signup.form.label.sex")}
								 rules={[{ required: true,  message: t("signup.error.sex") }]}
								 style={{ minWidth: "16rem" }}>
								 <Select placeholder={t("select")} allowClear
										 options={[{ value: "M", label: t("students.sex.male")},
											 { value: "F", label: t("students.sex.female")}]}
								 />
							 </Form.Item>
					         <Form.Item style={ { margin: "0" } }>
						         <Form.Item
							         name="age"
							         label="Edad"
							         rules={ [
								         {
									         required: true, type: "number", message: "Por favor, ingrese la edad"
								         }
							         ] }
							         style={ {
								         display: "inline-block"
							         } }
						         >
							         <InputNumber style={ { width: "10rem" } }/>
						         </Form.Item>
						         <span style={ { display: "inline-block", margin: "2rem 2rem 0 2rem" } }>-</span>
						         <Form.Item
							         name="birthDate"
							         label="Fecha de Nacimiento"
							         rules={ [{ required: true, message: "Seleccione la fecha de nacimiento" }] }
							         style={ {
								         display: "inline-block"
							         } }
						         >
							         <DatePicker style={ { width: "10rem" } }/>
						         </Form.Item>
						         <span style={ { display: "inline-block", margin: "2rem 2rem 0 2rem" } }>-</span>
						         <Form.Item
							         name="classroomNumber"
							         label="Número de Clase"
							         rules={ [
								         {
									         required: true, type: "number", message: "Por favor, ingrese el número de clase"
								         }
							         ] }
							         style={ {
								         display: "inline-block"
							         } }
						         >
							         <InputNumber style={ { width: "10rem" } }/>
						         </Form.Item>
					         </Form.Item>
					         <Form.Item
						         name="school"
						         label="Colegio"
						         rules={ [{ required: true, message: "Por favor, ingrese el colegio" }] }
					         >
						         <Input/>
					         </Form.Item>
					         <Form.Item name="classroom" label="Clase"
					                    rules={ [{ required: true, message: "Por favor, ingrese el apellido" }] }>
						         <Select placeholder="Seleccione">
							         { classrooms.map((classroom) => (
								         <Option key={ classroom.id } value={ classroom.name }>
									         { classroom.name }
								         </Option>
							         )) }
						         </Select>
					         </Form.Item>
				         </>
			         )
		}, {
			title:   "Contexto Familiar",
			content: (
				         <>
					         <Form.Item
						         name="socioEconomicLevel"
						         label="Nivel Socioeconómico"
					         >
						         <Select placeholder="Seleccione" allowClear>
							         <Option value="bajo">Bajo</Option>
							         <Option value="medio">Medio</Option>
							         <Option value="alto">Alto</Option>
						         </Select>
					         </Form.Item>
					         <Form.Item
						         name="nationalOrigin"
						         label="Origen Nacional"
					         >
						         <Select
							         placeholder="Seleccione"
							         onChange={ (value) => setShowOtherNationalOrigin(value === "otro") }
							         allowClear
						         >
							         <Option value="espania">España</Option>
							         <Option value="europeo">Otro país europeo</Option>
							         <Option value="africano">País africano</Option>
							         <Option value="asiatico">País asiático</Option>
							         <Option value="norteamericano">País norteamericano</Option>
							         <Option value="latinoamericano">País latinoamericano</Option>
							         <Option value="otro">Otro</Option>
						         </Select>
					         </Form.Item>
					         { showOtherNationalOrigin && (
						         <Form.Item name="otherNationalOrigin" label="Especifique el País">
							         <Input/>
						         </Form.Item>
					         ) }
				         </>
			         )
		}, {
			title:   "Necesidades Educativas",
			content: (
				         <>
					         <Form.Item
						         name="learningReadingRisk"
						         label="Dificultades de Aprendizaje de Lectura"
					         >
						         <Select placeholder="Seleccione" allowClear>
							         <Option value="si">Sí</Option>
							         <Option value="no">No</Option>
						         </Select>
					         </Form.Item>
					         <Form.Item
						         name="learningWritingRisk"
						         label="Dificultades de Aprendizaje de Escritura"
					         >
						         <Select placeholder="Seleccione" allowClear>
							         <Option value="si">Sí</Option>
							         <Option value="no">No</Option>
						         </Select>
					         </Form.Item>
					         <Form.Item
						         name="familyBackground"
						         label="Alguno de los progenitores del alumno presentó dificultades de aprendizaje de la lectura o la escritura"
					         >
						         <Select placeholder="Seleccione" allowClear>
							         <Option value="padre">Sí, el padre</Option>
							         <Option value="madre">Sí, la madre</Option>
							         <Option value="ambos">Sí, ambos progenitores</Option>
							         <Option value="ninguno">No</Option>
						         </Select>
					         </Form.Item>
					         <Form.Item
						         name="neae"
						         label="El alumno presenta Necesidades Específicas de Apoyo Educativo (NEAE)"
					         >
						         <Select placeholder="Seleccione"
						                 onChange={ (value) => setShowNEAE(value === "si") }
						                 allowClear>
							         <Option value="si">Sí</Option>
							         <Option value="no">No</Option>
						         </Select>
					         </Form.Item>
					         { showNEAE && (
						         <Form.Item
							         name="specificSupportNeeds"
							         label="Necesidades Específicas"
						         >
							         <Checkbox.Group onChange={ (checkedValues) => setShowOtherSupportNeeds(checkedValues.includes("otro")) }>
								         <Row gutter={ [8, 16] }>
									         <Col span={ 8 }><Checkbox value="trastornoLenguaje">Trastorno del desarrollo del lenguaje y la comunicación</Checkbox></Col>
									         <Col span={ 8 }><Checkbox value="tdah">Trastorno por déficit de atención con hiperactividad</Checkbox></Col>
									         <Col span={ 8 }><Checkbox value="autismo">Trastorno del espectro del autismo</Checkbox></Col>
									         <Col span={ 16 }><Checkbox value="pendienteEvaluacion">Alumno pendiente de evaluación psicopedagógica</Checkbox></Col>
									         <Col span={ 8 }><Checkbox value="altasCapacidades">Altas capacidades</Checkbox></Col>
									         <Col span={ 8 }><Checkbox value="discapacidadCognitiva">Discapacidad cognitiva</Checkbox></Col>
									         <Col span={ 8 }><Checkbox value="discapacidadFisica">Discapacidad física</Checkbox></Col>
									         <Col span={ 8 }><Checkbox value="dificultadesEspecificas">Dificultades Específicas de Aprendizaje</Checkbox></Col>
									         <Col span={ 8 }><Checkbox value="otro">Otro</Checkbox></Col>
								         </Row>
							         </Checkbox.Group>
						         </Form.Item>
					         ) }
					         { showOtherSupportNeeds && (
						         <Form.List name="otherSpecificSupportNeeds">
							         { (fields, { add, remove }) => (
								         <>
									         { fields.map(({ key, name, ...restField }) => (
										         <Space
											         key={ key }
											         style={ {
												         display: "flex", marginBottom: 8
											         } }
											         align="baseline"
										         >
											         <Form.Item
												         name={ name }
												         { ...restField }
											         >
														 <Space>{t("signup.student.steps.educationalNeeds")}<Input/></Space>
											         </Form.Item>
											         <MinusCircleOutlined onClick={ () => remove(name) }/>
										         </Space>
									         )) }
									         <Form.Item>
										         <Button type="dashed" onClick={ () => add() } block
										                 icon={ <PlusOutlined/> }>
											         Add field
										         </Button>
									         </Form.Item>
								         </>
							         ) }
						         </Form.List>
					         ) }
					         <Form.Item
						         name="learningDiagnosedDifficulties"
						         label="Dificultades de Aprendizaje Diagnosticadas"
					         >
						         <Checkbox.Group>
							         <Checkbox value="lectura">En lectura</Checkbox>
							         <Checkbox value="escritura">En escritura</Checkbox>
							         <Checkbox value="matematicas">En matemáticas</Checkbox>
						         </Checkbox.Group>
					         </Form.Item>
					         <Form.Item
						         name="needEducationalSupport"
						         label="El alumno recibe apoyo educativo"
					         >
						         <Select placeholder="Seleccione"
						                 onChange={ (value) => setShowEducationalSupport(value === "si") }
						                 allowClear>
							         <Option value="si">Sí</Option>
							         <Option value="no">No</Option>
						         </Select>
					         </Form.Item>
					         { showEducationalSupport && <Form.Item
						         name="educationalSupport"
						         label="Apoyo educativo"
					         >
						         <Checkbox.Group
							         onChange={ (checkedValues) => setShowOtherEducationalSupport(checkedValues.includes("otros")) }>
							         <Checkbox value="PT">PT</Checkbox>
							         <Checkbox value="AL">AL</Checkbox>
							         <Checkbox value="otros">Otros especialistas</Checkbox>
						         </Checkbox.Group>
					         </Form.Item> }
					         { showOtherEducationalSupport && (
						         <Form.List name="otherEducationalSupport">
							         { (fields, { add, remove }) => (
								         <>
									         { fields.map(({ key, name, ...restField }) => (
										         <Space
											         key={ key }
											         style={ {
												         display: "flex", marginBottom: 8
											         } }
											         align="baseline"
										         >
											         <Form.Item
												         name={ name }
												         { ...restField }
											         >
														 <Space.Compact>Otros especialistas<Input/></Space.Compact>
											         </Form.Item>
											         <MinusCircleOutlined onClick={ () => remove(name) }/>
										         </Space>
									         )) }
									         <Form.Item>
										         <Button type="dashed" onClick={ () => add() } block
										                 icon={ <PlusOutlined/> }>
											         Add field
										         </Button>
									         </Form.Item>
								         </>
							         ) }
						         </Form.List>
					         ) }
					         <Form.Item
						         name="firstWords"
						         label="La emisión de las primeras palabras se inició "
					         >
						         <Select placeholder="Seleccione" allowClear>
							         <Option value="antesUno">Antes del año</Option>
							         <Option value="entreUnoYUnoMedio">Entre el año y el año y medio</Option>
							         <Option value="entreUnoMedioYDos">Entre el año y medio y los dos años</Option>
							         <Option value="entreDosYDosMedio">Entre los dos años y los dos años y
								         medio</Option>
							         <Option value="despuesDos">Después de los dos años y medio</Option>
							         <Option value="noComunica">No se comunica oralmente</Option>
						         </Select>
					         </Form.Item>
				         </>
			         )
		}
	];

	useEffect(() => {
		const fetchStudentData = async () => {
			try {
				const classroomResponse = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/classrooms/list", {
					method: "GET", headers: { Authorization: `Bearer ${ localStorage.getItem("accessToken") }` }
				});
				const classroomsData = await classroomResponse.json();
				setClassrooms(classroomsData);

				const studentResponse = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/students/" + studentId, {
					method: "GET", headers: {
						Authorization: `Bearer ${ localStorage.getItem("accessToken") }`
					}
				});
				const studentData = await studentResponse.json();

				// Guardar el nombre del estudiante en localStorage para breadcrumbs
				localStorage.setItem("currentStudentName", studentData.name);
				localStorage.setItem("currentClassroomName", classroomName);

				if ( studentData.otherSpecificSupportNeeds ) {
					studentData.otherSpecificSupportNeeds = studentData.otherSpecificSupportNeeds.split(";");
				}

				if ( studentData.specificSupportNeeds ) {
					studentData.specificSupportNeeds = studentData.specificSupportNeeds.split(";");
				}

				if ( studentData.otherEducationalSupport ) {
					studentData.otherEducationalSupport = studentData.otherEducationalSupport.split(";");
				}

				if ( studentData.educationalSupport ) {
					studentData.educationalSupport = studentData.educationalSupport.split(";");
				}

				if ( studentData.otherSpecificSupportNeeds && studentData.specificSupportNeeds && studentData.otherSpecificSupportNeeds.length !== 0 ) {
					studentData.specificSupportNeeds.push("otro");
					setShowOtherSupportNeeds(true);
					setShowNEAE(true);
				}

				if ( studentData.otherEducationalSupport && studentData.educationalSupport && studentData.otherEducationalSupport.length !== 0 ) {
					studentData.educationalSupport.push("otros");
					setShowEducationalSupport(true);
					setShowOtherEducationalSupport(true);
				}

				if ( studentData.learningReadingRisk !== null && studentData.learningReadingRisk !== undefined ) {
					studentData.learningReadingRisk = studentData.learningReadingRisk ? "si" : "no";
				}

				if ( studentData.learningWritingRisk !== null && studentData.learningWritingRisk !== undefined ) {
					studentData.learningWritingRisk = studentData.learningWritingRisk ? "si" : "no";
				}

				let neae = undefined;
				if ( studentData.specificSupportNeeds !== null && studentData.specificSupportNeeds !== undefined ) {
					neae = studentData.specificSupportNeeds ? "si" : "no";
				}

				let needEducationalSupport = undefined;
				if ( studentData.educationalSupport !== null && studentData.educationalSupport !== undefined ) {
					needEducationalSupport = studentData.educationalSupport ? "si" : "no";
				}

				if ( studentData.learningDiagnosedDifficulties ) {
					studentData.learningDiagnosedDifficulties = studentData.learningDiagnosedDifficulties.split(";");
				}

				form.setFieldsValue({
					                    ...studentData,
					                    neae,
					                    needEducationalSupport,
					                    classroom: classroomsData.find((c) => c.id === studentData.classroomId)?.name,
					                    birthDate: studentData.birthDate ? moment(studentData.birthDate) : null
				                    });
			}
			catch ( error ) {
				setMessage({ error: { type: "internalError", message: error.message } });
			}
			finally {
				setLoading(false);
			}
		};
		fetchStudentData();
	}, [studentId, form]);

	const onFinish = async () => {
		try {
			let values = form.getFieldsValue(true);
			const payload = {
				...values, classroomId: classrooms.find((c) => c.name === values.classroom).id, birthDate: values.birthDate ? values.birthDate.format("YYYY-MM-DD") : null
			};

			const response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/students/" + studentId, {
				method:  "PUT", headers: {
					"Content-Type": "application/json", Authorization: `Bearer ${ localStorage.getItem("accessToken") }`
				}, body: JSON.stringify(payload)
			});

			if ( response.ok ) {
				navigate("/teachers/classrooms/" + classroomName);
			} else {
				const errorData = await response.json();
				setMessage(errorData.error || { type: "unknownError", message: "Error desconocido" });
			}
		}
		catch ( error ) {
			setMessage({ error: { type: "internalError", message: error.message } });
		}
	};

	const next = () => setCurrentStep((prev) => prev + 1);
	const prev = () => setCurrentStep((prev) => prev - 1);

	if ( loading ) {
		return (
			<div style={ { textAlign: "center", marginTop: "20vh" } }>
				<Spin/>
			</div>
		);
	}

	return (
		<div>
			<div style={{ width: "90vw", marginLeft: "auto", marginRight: "auto", marginTop: "2vh" }}>
				<TeacherBreadcrumb />
			</div>
			<Card title="Modificar Estudiante" style={ { margin: "auto", marginTop: "2vh", marginBottom: "2vh" } }>
			{ message && <Alert type="error" title={ message } showIcon style={ { marginBottom: "1vh" } }/> }
			<Form form={ form }
			      layout="vertical"
			      onFinish={ onFinish }
			      style={ { width: "40rem" } }>
				<Steps current={ currentStep } titlePlacement="vertical" onChange={ value => setCurrentStep(value) }>
					{ steps.map((item) => (
						<Step key={ item.title } title={ item.title }/>
					)) }
				</Steps>
				<div style={ { marginTop: "1.5rem" } }>{ steps[ currentStep ].content }</div>
				<Form.Item>
					<div style={ { display: "flex", gap: "1rem" } }>
						{ currentStep > 0 && (
							<Button block onClick={ prev } style={ { flex: "100%" } }>
								Anterior
							</Button>
						) }
						{ currentStep < steps.length - 1 && (
							<Button block type="primary" onClick={ next } style={ { flex: "100%" } }>
								Siguiente
							</Button>
						) }
						{ currentStep === steps.length - 1 && (
							<Button block type="primary" htmlType="submit" style={ { flex: "100%" } }>
								Guardar cambios
							</Button>
						) }
					</div>
				</Form.Item>
			</Form>
		</Card>
		</div>
	);
};

export default StudentDetail;