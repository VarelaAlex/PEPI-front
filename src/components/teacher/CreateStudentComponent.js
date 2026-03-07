import {MinusCircleOutlined, PlusOutlined, UserAddOutlined} from "@ant-design/icons";
import {
    Alert, Button, Card, Checkbox, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space, Steps
} from "antd";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate, useParams} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import TeacherBreadcrumb from "./BreadcrumbComponent";

const CreateStudent = () => {

    let {classroomName} = useParams();
    const [currentStep, setCurrentStep] = useState(0);
    const [form] = Form.useForm();
    const [message, setMessage] = useState(null);
    const [showOtherSupportNeeds, setShowOtherSupportNeeds] = useState(false);
    const [showOtherEducationalSupport, setShowOtherEducationalSupport] = useState(false);
    const [showNEAE, setShowNEAE] = useState(false);
    const [showOtherNationalOrigin, setShowOtherNationalOrigin] = useState(false);
    const [showEducationalSupport, setShowEducationalSupport] = useState(false);
    const [generatedUsername, setGeneratedUsername] = useState("");
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const navigate = useNavigate();
    const {t} = useTranslation();

    // Función para generar el username: nombrealumno_idprofesor_numero3digitosaleatorio
    const generateUsername = async (studentName) => {
        if (!studentName || studentName.trim() === "") {
            setGeneratedUsername("");
            setUsernameAvailable(null);
            return;
        }

        try {
            const accessToken = localStorage.getItem("accessToken");
            const decodedToken = jwtDecode(accessToken);
            const teacherId = decodedToken.id || decodedToken.sub;
            const randomNumber = Math.floor(Math.random() * 900) + 100; // Número de 3 dígitos (100-999)
            const username = `${studentName.toLowerCase()}${teacherId}${randomNumber}`;
            setGeneratedUsername(username);

            // Validar si el username ya existe
            try {
                const response = await fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/students/checkUsername`, {
                    method: "POST", headers: {
                        "Content-Type": "application/json", Authorization: `Bearer ${accessToken}`
                    }, body: JSON.stringify({username})
                });

                if (response.ok) {
                    const data = await response.json();
                    setUsernameAvailable(!data.exists);
                } else {
                    // Si hay error en la validación, asumimos que está disponible
                    setUsernameAvailable(true);
                }
            } catch (error) {
                console.error("Error checking username availability:", error);
                // Si hay error de conexión, asumimos que está disponible
                setUsernameAvailable(true);
            }
        } catch (error) {
            console.error("Error generating username:", error);
            setGeneratedUsername("");
            setUsernameAvailable(null);
        }
    };

    const steps = [{
        title: t("signup.student.steps.basicInformation"),
        fields: ['name', 'lastName', 'age', 'sex', 'birthDate', 'classroomNumber', 'school'],
        content: (<>
                <Form.Item
                    name="name"
                    label={t("signup.form.label.name")}
                    rules={[{required: true, message: t("signup.error.name")}]}
                >
                    <Input
                        placeholder={t("signup.error.name")}
                        onChange={(e) => {
								generateUsername(e.target.value)
						}}
                        size="large"
                        style={{borderRadius: "6px"}}
                    />
                </Form.Item>

                {generatedUsername && (<Form.Item style={{marginBottom: "1rem"}}>
                        <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
                            {
								<span style={{color: "#52c41a", fontWeight: "500", fontSize: "0.9rem"}}>
									<span style={{fontSize: "0.95rem", fontWeight: "500"}}>
										{t("signup.form.label.username")}: <span style={{fontWeight: "bold"}}>{generatedUsername}</span>
									</span>
								</span>
							}
                        </div>
                    </Form.Item>)}

                <Form.Item
                    name="lastName"
                    label={t("signup.form.label.lastName")}
                    rules={[{required: true, message: t("signup.error.lastName")}]}
                >
                    <Input
                        placeholder={t("signup.error.lastName")}
                        size="large"
                        style={{borderRadius: "6px"}}
                    />
                </Form.Item>

                <Row justify="start" gutter={32}>
                    <Col>
                        <Form.Item
                            name="age"
                            label={t("signup.form.label.age")}
                            rules={[{required: true, type: "number", message: t("signup.error.age")}]}
                        >
                            <InputNumber
                                style={{minWidth: "16rem", borderRadius: "6px"}}
                                placeholder={t("signup.error.age")}
                                size="large"
                            />
                        </Form.Item>
                    </Col>

                    <Col>
                        <Form.Item
                            name="birthDate"
                            label={t("signup.form.label.birthDate")}
                            rules={[{required: true, message: t("signup.error.birthDate")}]}
                        >
                            <DatePicker
                                style={{minWidth: "20rem", borderRadius: "6px"}}
                                placeholder={t("signup.error.birthDate")}
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row justify="start" gutter={32}>
                    <Col>
                        <Form.Item
                            name="sex"
                            label={t("signup.form.label.sex")}
                            rules={[{required: true, message: t("signup.error.sex")}]}
                            style={{minWidth: "16rem"}}
                        >
                            <Select
                                placeholder={t("select")}
                                allowClear
                                size="large"
                                options={[{value: "M", label: t("students.sex.male")}, {
                                    value: "F",
                                    label: t("students.sex.female")
                                }]}
                            />
                        </Form.Item>
                    </Col>

                    <Col>
                        <Form.Item
                            name="classroomNumber"
                            label={t("signup.form.label.classroomNumber")}
                            rules={[{required: true, type: "number", message: t("signup.error.classroomNumber")}]}
                        >
                            <InputNumber
                                style={{minWidth: "20rem", borderRadius: "6px"}}
                                placeholder={t("signup.error.classroomNumber")}
                                size="large"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="school"
                    label={t("signup.form.label.school")}
                    rules={[{required: true, message: t("signup.error.school")}]}
                >
                    <Input
                        placeholder={t("signup.error.school")}
                        size="large"
                        style={{borderRadius: "6px"}}
                    />
                </Form.Item>
            </>)
    }, {
        title: t("signup.student.steps.familyBackground"), fields: [], content: (<>
                <Form.Item
                    name="socioEconomicLevel"
                    label={t("signup.form.label.socioEconomicLevel")}
                >
                    <Select
                        placeholder={t("select")}
                        allowClear
                        size="large"
                        options={[{value: "bajo", label: t("students.socioeconomicLevel.low")}, {
                            value: "medio",
                            label: t("students.socioeconomicLevel.medium")
                        }, {value: "alto", label: t("students.socioeconomicLevel.high")}]}
                    />
                </Form.Item>
                <Form.Item
                    name="nationalOrigin"
                    label={t("signup.form.label.nationalOrigin")}
                >
                    <Select
                        placeholder={t("select")}
                        onChange={(value) => setShowOtherNationalOrigin(value === "otro")}
                        allowClear
                        size="large"
                        options={[{value: "espania", label: t("students.nationalOrigin.spain")}, {
                            value: "europeo",
                            label: t("students.nationalOrigin.european")
                        }, {value: "africano", label: t("students.nationalOrigin.african")}, {
                            value: "asiatico",
                            label: t("students.nationalOrigin.asian")
                        }, {
                            value: "norteamericano",
                            label: t("students.nationalOrigin.northAmerican")
                        }, {
                            value: "latinoamericano",
                            label: t("students.nationalOrigin.latinAmerican")
                        }, {value: "otro", label: t("students.nationalOrigin.other")}]}
                    />
                </Form.Item>
                {showOtherNationalOrigin && (<Form.Item name="otherNationalOrigin" label="Especifique el País">
                        <Input
                            size="large"
                            style={{borderRadius: "6px"}}
                        />
                    </Form.Item>)}
            </>)
    }, {
        title: t("signup.student.steps.educationalNeeds"), fields: [], // Paso sin campos requeridos
        content: (<>
                <Form.Item
                    name="learningReadingRisk"
                    label={t("signup.form.label.learningReadingRisk")}
                >
                    <Select
                        placeholder={t("select")}
                        allowClear
                        size="large"
                        options={[{value: "si", label: t("yes")}, {value: "no", label: t("no")}]}
                    />
                </Form.Item>
                <Form.Item
                    name="learningWritingRisk"
                    label={t("signup.form.label.learningWritingRisk")}
                >
                    <Select
                        placeholder={t("select")}
                        allowClear
                        size="large"
                        options={[{value: "si", label: t("yes")}, {value: "no", label: t("no")}]}
                    />
                </Form.Item>
                <Form.Item
                    name="familyBackground"
                    label={t("signup.form.label.familyBackground")}
                >
                    <Select
                        placeholder={t("select")}
                        allowClear
                        size="large"
                        options={[{value: "padre", label: t("students.familyBackground.father")}, {
                            value: "madre",
                            label: t("students.familyBackground.mother")
                        }, {value: "ambos", label: t("students.familyBackground.both")}, {
                            value: "ninguno",
                            label: t("students.familyBackground.none")
                        }]}
                    />
                </Form.Item>
                <Form.Item
                    name="neae"
                    label={t("signup.form.label.neae")}
                >
                    <Select
                        placeholder={t("select")}
                        onChange={(value) => setShowNEAE(value === "si")}
                        allowClear
                        size="large"
                        options={[{value: "si", label: t("yes")}, {value: "no", label: t("no")}]}
                    />
                </Form.Item>
                {showNEAE && (<Form.Item
                        name="specificSupportNeeds"
                        label={t("signup.form.label.specificSupportNeeds")}
                    >
                        <Checkbox.Group
                            onChange={(checkedValues) => setShowOtherSupportNeeds(checkedValues.includes("otro"))}>
                            <Row gutter={[8, 16]}>
                                <Col span={8}><Checkbox
                                    value="trastornoLenguaje">{t("students.specificSupportNeeds.languageDisorder")}</Checkbox></Col>
                                <Col span={8}><Checkbox
                                    value="tdah">{t("students.specificSupportNeeds.adhd")}</Checkbox></Col>
                                <Col span={8}><Checkbox
                                    value="autismo">{t("students.specificSupportNeeds.asd")}</Checkbox></Col>
                                <Col span={16}><Checkbox
                                    value="pendienteEvaluacion">{t("students.specificSupportNeeds.awaitingEvaluation")}</Checkbox></Col>
                                <Col span={8}><Checkbox
                                    value="altasCapacidades">{t("students.specificSupportNeeds.highAbilities")}</Checkbox></Col>
                                <Col span={8}><Checkbox
                                    value="discapacidadCognitiva">{t("students.specificSupportNeeds.cognitiveDisability")}</Checkbox></Col>
                                <Col span={8}><Checkbox
                                    value="discapacidadFisica">{t("students.specificSupportNeeds.physicalDisability")}</Checkbox></Col>
                                <Col span={8}><Checkbox
                                    value="dificultadesEspecificas">{t("students.specificSupportNeeds.specificLearningDisability")}</Checkbox></Col>
                                <Col span={8}><Checkbox
                                    value="otro">{t("students.specificSupportNeeds.other")}</Checkbox></Col>
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>)}
                {showOtherSupportNeeds && (<Form.List name="otherSpecificSupportNeeds">
                        {(fields, {add, remove}) => (<>
                                {fields.map(({key, name, ...restField}) => (<Space
                                        key={key}
                                        style={{
                                            display: "flex", marginBottom: 8
                                        }}
                                        align="baseline"
                                    >
                                        <Form.Item
                                            name={name}
                                            {...restField}
                                        >
                                            <Space>{t("signup.form.label.specificSupportNeeds")}<Input size="large"
                                                                                                       style={{borderRadius: "6px"}}/></Space>
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)}/>
                                    </Space>))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block
                                            icon={<PlusOutlined/>}>
                                        {t("addField")}
                                    </Button>
                                </Form.Item>
                            </>)}
                    </Form.List>)}
                <Form.Item
                    name="learningDiagnosedDifficulties"
                    label={t("signup.form.label.learningDiagnosedDifficulties")}
                >
                    <Checkbox.Group>
                        <Checkbox value="lectura">{t("students.learningDiagnosedDifficulties.reading")}</Checkbox>
                        <Checkbox value="escritura">{t("students.learningDiagnosedDifficulties.writing")}</Checkbox>
                        <Checkbox value="matematicas">{t("students.learningDiagnosedDifficulties.math")}</Checkbox>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item
                    name="needEducationalSupport"
                    label={t("signup.form.label.needEducationalSupport")}
                >
                    <Select
                        placeholder={t("select")}
                        onChange={(value) => setShowEducationalSupport(value === "si")}
                        allowClear
                        size="large"
                        options={[{value: "si", label: t("yes")}, {value: "no", label: t("no")}]}
                    />
                </Form.Item>
                {showEducationalSupport && <Form.Item
                    name="educationalSupport"
                    label={t("signup.form.label.educationalSupport")}
                >
                    <Checkbox.Group
                        onChange={(checkedValues) => setShowOtherEducationalSupport(checkedValues.includes("otros"))}>
                        <Checkbox value="PT">{t("students.educationalSupport.pt")}</Checkbox>
                        <Checkbox value="AL">{t("students.educationalSupport.al")}</Checkbox>
                        <Checkbox value="otros">{t("students.educationalSupport.other")}</Checkbox>
                    </Checkbox.Group>
                </Form.Item>}
                {showOtherEducationalSupport && (<Form.List name="otherEducationalSupport">
                        {(fields, {add, remove}) => (<>
                                {fields.map(({key, name, ...restField}) => (<Space
                                        key={key}
                                        style={{
                                            display: "flex", marginBottom: 8
                                        }}
                                        align="baseline"
                                    >
                                        <Form.Item
                                            name={name}
                                            {...restField}
                                        >
                                            <Space>{t("signup.form.label.otherSpecialists")}<Input size="large"
                                                                                                   style={{borderRadius: "6px"}}/></Space>
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)}/>
                                    </Space>))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block
                                            icon={<PlusOutlined/>}>
                                        {t("addField")}
                                    </Button>
                                </Form.Item>
                            </>)}
                    </Form.List>)}
                <Form.Item
                    name="firstWords"
                    label={t("signup.form.label.firstWords")}
                >
                    <Select
                        placeholder={t("select")}
                        allowClear
                        size="large"
                        options={[{
                            value: "antesUno",
                            label: t("students.firstWords.before12Months")
                        }, {
                            value: "entreUnoYUnoMedio",
                            label: t("students.firstWords.between12And18Months")
                        }, {
                            value: "entreUnoMedioYDos",
                            label: t("students.firstWords.between18And24Months")
                        }, {
                            value: "entreDosYDosMedio",
                            label: t("students.firstWords.between24And30Months")
                        }, {value: "despuesDos", label: t("students.firstWords.after30Months")}, {
                            value: "noComunica",
                            label: t("students.firstWords.dontComunicate")
                        }]}
                    />
                </Form.Item>
            </>)
    }];

    const stepsItems = steps.map((step, index) => ({key: index, title: step.title}));

    const next = async () => {
        try {
            // Validar solo los campos del paso actual
            const currentFields = steps[currentStep].fields;
            if (currentFields && currentFields.length > 0) {
                await form.validateFields(currentFields);
            }
            setCurrentStep(currentStep + 1);
            setMessage(null);
        } catch (error) {
            // Los errores de validación se mostrarán automáticamente en los campos
            console.log('Validation failed:', error);
        }
    };

    const prev = () => {
        setCurrentStep(currentStep - 1);
        setMessage(null);
    };

    let onFinish = async () => {
        // Validar todos los campos requeridos antes de enviar
        try {
            await form.validateFields(['name', 'lastName', 'age', 'sex', 'birthDate', 'classroomNumber', 'school']);
        } catch (error) {
            setMessage({error: {message: t("signup.validationError")}});
            setCurrentStep(0);
            return;
        }

        let {
            name,
            lastName,
            age,
            sex,
            school,
            classroomNumber,
            birthDate,
            socioEconomicLevel,
            nationalOrigin,
            otherNationalOrigin,
            learningReadingRisk,
            learningWritingRisk,
            familyBackground,
            specificSupportNeeds,
            otherSpecificSupportNeeds,
            learningDiagnosedDifficulties,
            educationalSupport,
            otherEducationalSupport,
            firstWords
        } = form.getFieldsValue(true);

        // Handle specific support needs: convert array to a string or process 'Otro' case
        if (specificSupportNeeds && specificSupportNeeds.includes("otro") && !otherSpecificSupportNeeds) {
            setMessage({
                error: {
                    type: "validationError", message: t("signup.error.neae")
                }
            });
            return;
        }

        // Handle educational support: convert array to a string or process 'Otros especialistas' case
        if (educationalSupport && educationalSupport.includes("otros") && !otherEducationalSupport) {
            setMessage({
                error: {
                    type: "validationError", message: t("signup.error.specialists")
                }
            });
            return;
        }

        // Handle 'Otro' national origin case
        if (nationalOrigin === "otro" && !otherNationalOrigin) {
            setMessage({
                error: {type: "validationError", message: t("signup.error.nationalOrigin")}
            });
            return;
        }

        // Prepare payload for the API request
        const payload = {
            name,
            lastName,
            age,
            sex,
            birthDate,
            school,
            classroomNumber,
            socioEconomicLevel: socioEconomicLevel || "",
            nationalOrigin: nationalOrigin === "otro" ? otherNationalOrigin : (nationalOrigin || ""),
            learningReadingRisk,
            learningWritingRisk,
            familyBackground,
            specificSupportNeeds: specificSupportNeeds || [],
            otherSpecificSupportNeeds: otherSpecificSupportNeeds || "",
            classroomName,
            learningDiagnosedDifficulties,
            educationalSupport: educationalSupport || [],
            otherEducationalSupport: otherEducationalSupport || "",
            firstWords
        };

        let response = null;
        try {
            response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/students", {
                method: "POST", headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }, body: JSON.stringify(payload)
            });
        } catch (e) {
            setMessage({error: {type: "internalServerError", message: e.message}});
            return;
        }

        if (response?.ok) {
            navigate("/teachers/classrooms/" + classroomName);
        } else {
            let jsonData = await response?.json();
            setMessage({error: jsonData?.error || {type: "unknownError", message: t("signup.form.unknownError")}});
        }
    };

    return (<div>
            <div style={{width: "90vw", marginLeft: "auto", marginRight: "auto", marginTop: "2vh"}}>
                <TeacherBreadcrumb/>
            </div>
            <Card
                title={<Space size="middle" style={{fontSize: "1.2rem", fontWeight: "600"}}>
                    <UserAddOutlined style={{fontSize: "1.5rem", color: "#1890ff"}}/>
                    {t("signup.student.title")}
                </Space>}
                style={{
                    width: typeof window !== "undefined" && window.innerWidth < 768 ? "95vw" : "70vw",
                    marginTop: "2vh",
                    marginBottom: "2vh",
                    marginLeft: "auto",
                    marginRight: "auto",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    borderRadius: "8px"
                }}
                styles={{body: {padding: "2rem"}}}
            >
                {message && (Array.isArray(message) ? (message.map((msg, index) => (<Alert
                                key={index}
                                type="error"
                                description={msg.error?.message || msg.message || t("signup.validationError")}
                                showIcon
                                closable
                                style={{marginBottom: "1.5rem"}}
                            />))) : (<Alert
                            type="error"
                            description={message.error?.message || message.message || t("signup.validationError")}
                            showIcon
                            closable
                            style={{marginBottom: "1.5rem"}}
                        />))}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{maxWidth: "100%"}}
                >
                    <Steps
                        current={currentStep}
                        titlePlacement="vertical"
                        items={stepsItems}
                        style={{marginBottom: "2rem"}}
                    />

                    <div style={{marginTop: "1.5rem", marginBottom: "2rem"}}>
                        {steps[currentStep].content}
                    </div>

                    <Form.Item>
                        <Space style={{marginTop: "2rem", display: "flex", justifyContent: currentStep === 0 ? "flex-end" : "space-between", gap: "1rem"}}>
                            {currentStep > 0 && (<Button
                                    onClick={prev}
                                    style={{
                                        flex: "1 1 auto",
                                        minWidth: "120px",
                                        height: "40px",
                                        fontSize: "1rem",
                                        fontWeight: "600"
                                    }}
                                >
                                    {t("signup.button.prev")}
                                </Button>)}
                            {currentStep < steps.length - 1 && (<Button
                                    type="primary"
                                    onClick={next}
                                    style={{
                                        flex: "1 1 auto",
                                        minWidth: "120px",
                                        height: "40px",
                                        fontSize: "1rem",
                                        fontWeight: "600"
                                    }}
                                >
                                    {t("signup.button.next")}
                                </Button>)}
                            {currentStep === steps.length - 1 && (<Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    style={{
                                        flex: "1 1 auto",
                                        minWidth: "120px",
                                        height: "40px",
                                        fontSize: "1rem",
                                        fontWeight: "600"
                                    }}
                                >
                                    {t("signup.button.submit")}
                                </Button>)}
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>);
};

export default CreateStudent;