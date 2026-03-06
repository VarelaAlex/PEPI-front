import {DeleteOutlined, LineChartOutlined, PlusOutlined} from "@ant-design/icons";
import {Alert, Button, Card, Cascader, Divider, Empty, Form, Input, Popconfirm, Space, Spin, Table} from "antd";
import {useEffect, useState, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Link, useNavigate} from "react-router-dom";
import ExcelJS from "exceljs";
import TeacherBreadcrumb from "./BreadcrumbComponent";

let ClassroomsList = (props) => {

    let {isMobile, setClassroomId} = props;

    let [loading, setLoading] = useState(true);
    let [classrooms, setClassrooms] = useState([]);
    let [message, setMessage] = useState(null);
    let [showAddForm, setShowAddForm] = useState(false);

    const formRef = useRef(null);

    let {t} = useTranslation();
    let navigate = useNavigate();

    const [form] = Form.useForm();

    const options = [{
        value: "EI",
        label: t("classrooms.addClassroom.level.EI.label"),
        children: Object.entries(t("classrooms.addClassroom.level.EI.stage", {returnObjects: true}))
            .map(([key, value]) => ({
                    value: key, label: value
                }))
    }, {
        value: "EP",
        label: t("classrooms.addClassroom.level.EP.label"),
        children: Object.entries(t("classrooms.addClassroom.level.EP.stage", {returnObjects: true}))
            .map(([key, value]) => ({
                    value: key, label: value
                }))
    }];

    useEffect(() => {
        getClassrooms();
    }, []);

    let generateReport = async (classroomName) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/classrooms/report/${classroomName}`, {
                method: "GET", headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                setMessage({error: {type: "internalServerError", message: errorData}});
                return;
            }

            const {result} = await response.json();

            const formattedData = result.map(row => ({
                "Aula": row.classroomName,
                "Nombre de usuario": row.username,
                "Edad": row.age,
                "Nivel socioeconómico": row.socioEconomicLevel,
                "Origen nacional": row.nationalOrigin,
                "Riesgo lectura": row.learningReadingRisk,
                "Riesgo escritura": row.learningWritingRisk,
                "Necesidades específicas de apoyo": row.specificSupportNeeds,
                "Otras necesidades específicas": row.otherSpecificSupportNeeds,
                "Antecedentes familiares": row.familyBackground,
                "Dificultades diagnosticadas": row.learningDiagnosedDifficulties,
                "Apoyo educativo": row.educationalSupport,
                "Otro apoyo": row.otherEducationalSupport,
                "Primeras palabras": row.firstWords,
                "Puntuación encuesta": row.score,
                "Código encuesta": row.surveyCode,
            }));

            // Crear workbook
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Informe");

            // Definir columnas dinámicamente
            const columns = Object.keys(formattedData[0] || {}).map(key => ({
                header: key, key, width: Math.max(15, key.length + 2),
            }));

            worksheet.columns = columns;

            // Añadir filas
            formattedData.forEach(row => worksheet.addRow(row));

            // Estilo básico para cabecera (opcional pero recomendable)
            worksheet.getRow(1).font = {bold: true};

            // Generar archivo en navegador
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `informe_${classroomName}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (e) {
            setMessage({error: {type: "internalServerError", message: e}});
        }
    };


    const columns = isMobile ? [
        {
            title: t("classrooms.table.className"),
            dataIndex: "name",
            render: (name, classroom) => (
                <Link to={"/teachers/classrooms/" + name}>
                    <div><strong>{name}</strong></div>
                    <small>{classroom.numberStudents} {t("classrooms.table.students")}</small>
                </Link>
            )
        },
        {
            title: t("classrooms.table.actions"),
            dataIndex: "id",
            render: (id, classroom) => (
                <Space layout="vertical" style={{ width: "100%" }}>
                    <Button
                        size="small"
                        block
                        onClick={() => {
                            setClassroomId(classroom.id);
                            navigate("/teachers/classroomStats/" + classroom.name);
                        }}
                        icon={<LineChartOutlined />}
                    >
                        {t("classrooms.table.buttons.seeStatistics")}
                    </Button>
                    <Button
                        size="small"
                        block
                        onClick={() => generateReport(classroom.name)}
                    >
                        {t("classrooms.table.buttons.generateReport")}
                    </Button>
                    <Popconfirm
                        title={t("classrooms.delete.popconfirm.title")}
                        description={t("classrooms.delete.popconfirm.description")}
                        okText={t("classrooms.delete.popconfirm.okText")}
                        okButtonProps={{danger: true}}
                        cancelText={t("classrooms.delete.popconfirm.cancelText")}
                        onConfirm={() => deleteClassroom(classroom.name)}
                    >
                        <Button
                            size="small"
                            block
                            danger
                            type="primary"
                            icon={<DeleteOutlined />}
                        >
                            {t("classrooms.table.buttons.delete")}
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ] : [
        {
            title: t("classrooms.table.className"),
            dataIndex: "name",
            render: (name) => <Link to={"/teachers/classrooms/" + name}>{name}</Link>
        },
        {
            title: t("classrooms.table.number"),
            dataIndex: "numberStudents",
            align: "center"
        },
        {
            title: t("classrooms.table.actions"),
            dataIndex: "name",
            align: "right",
            render: (name, classroom) => (
                <Space wrap>
                    <Button
                        size="small"
                        onClick={() => {
                            setClassroomId(classroom.id);
                            navigate("/teachers/classroomStats/" + name);
                        }}
                        icon={<LineChartOutlined/>}
                    >
                        {t("classrooms.table.buttons.seeStatistics")}
                    </Button>
                    <Button
                        size="small"
                        onClick={() => generateReport(name)}
                    >
                        {t("classrooms.table.buttons.generateReport")}
                    </Button>
                    <Popconfirm
                        title={t("classrooms.delete.popconfirm.title")}
                        description={t("classrooms.delete.popconfirm.description")}
                        okText={t("classrooms.delete.popconfirm.okText")}
                        okButtonProps={{danger: true}}
                        cancelText={t("classrooms.delete.popconfirm.cancelText")}
                        onConfirm={() => deleteClassroom(name)}
                    >
                        <Button
                            size="small"
                            danger
                            type="primary"
                            icon={<DeleteOutlined/>}
                        >
                            {t("classrooms.table.buttons.delete")}
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    let getClassrooms = async () => {
        setLoading(true);
        let response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/classrooms/list", {
            method: "GET", headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
        });

        if (response.ok) {
            let jsonData = await response.json();
            setClassrooms(jsonData);
        } else {
            let jsonData = await response.json();
            if (Array.isArray(jsonData.error)) {
                setMessage(jsonData.error);
            } else {
                let finalError = [];
                finalError.push(jsonData.error);
                setMessage(finalError);
            }
        }
        setLoading(false);
    };

    let onFinish = async (values) => {
        let {name, level} = values;

        let levelValue = level[1] + "-" + level[0];

        let response = null;
        try {
            response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/classrooms", {
                method: "POST", headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }, body: JSON.stringify({
                    name, level: levelValue
                })
            });
        } catch (e) {
            setMessage({error: {type: "internalServerError", message: e}});
            return;
        }

        let jsonData = await response?.json();
        if (response?.ok) {
            if (jsonData?.classroom != null) {
            }
        } else {
            setMessage({error: jsonData?.error});
        }
        form.resetFields();
        getClassrooms();
    };

    let deleteClassroom = async (name) => {
        await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/classrooms/" + name, {
            method: "DELETE", headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
        });
        getClassrooms();
    };

    return (
        <Spin spinning={loading} size="large">
            <div style={{ width: isMobile ? "95vw" : "90vw", marginLeft: "auto", marginRight: "auto", marginTop: "2vh" }}>
                <TeacherBreadcrumb />
            </div>
            <Card
                title={
                    <Space size="middle">
                        {t("classrooms.table.title")}
                    </Space>
                }
                style={{
                    width: isMobile ? "95vw" : "90vw",
                    marginTop: "2vh",
                    marginBottom: "2vh",
                    marginLeft: "auto",
                    marginRight: "auto",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    borderRadius: "8px"
                }}
                styles={{ body: { padding: isMobile ? "1.5rem" : "2rem" } }}
            >
                {classrooms.length <= 0 ?
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("classrooms.table.empty")}/> :
                    <div style={{overflowX: "auto"}}>
                        <Table
                            bordered
                            columns={columns}
                            dataSource={classrooms}
                            pagination={isMobile ? {pageSize: 5} : {pageSize: 7}}
                            size={isMobile ? "small" : "middle"}
                            style={{ borderRadius: "8px" }}
                        />
                    </div>
                }

                {!showAddForm && <div style={{
                    display: "flex",
                    justifyContent: "center",
                }}>
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined/>}
                        onClick={() => {
                            setShowAddForm(!showAddForm);
                            if (!showAddForm) {
                                setTimeout(() => {
                                    formRef.current?.scrollIntoView({behavior: "smooth", block: "start"});
                                }, 100);
                            }
                        }}
                        style={{
                            minWidth: isMobile ? "100%" : "300px",
                            fontWeight: "600",
                            height: "45px",
                            borderRadius: "6px"
                        }}
                    >
                        {t("classrooms.addClassroom.button")}
                    </Button>
                </div>}

                {showAddForm && (
                    <>
                        <Divider style={{margin: "2.5rem 0"}}/>

                        <div
                            ref={formRef}
                            style={{
                                backgroundColor: "#fafafa",
                                padding: isMobile ? "1.5rem" : "2rem",
                                borderRadius: "8px",
                                border: "1px solid #f0f0f0"
                            }}
                        >
                            <h3 style={{marginTop: 0, marginBottom: "1.5rem", fontWeight: "600", color: "#262626"}}>
                                {t("classrooms.addClassroom.divider")}
                            </h3>

                            {message?.error?.type &&
                                <Alert
                                    type="error"
                                    description={t(message?.error?.type)}
                                    showIcon
                                    style={{marginBottom: "1.5rem"}}
                                    closable
                                />
                            }

                            <Form
                                form={form}
                                name="addClassroom"
                                labelCol={{xs: {span: 24}, sm: {span: 6}}}
                                wrapperCol={{xs: {span: 24}, sm: {span: 18}}}
                                onFinish={onFinish}
                                scrollToFirstError
                                layout={isMobile ? "vertical" : "horizontal"}
                            >
                                <Form.Item
                                    name="name"
                                    label={t("classrooms.addClassroom.label")}
                                    rules={[{
                                        required: true, message: t("classrooms.addClassroom.error")
                                    }]}
                                    validateStatus={message?.error?.name ? "error" : undefined}
                                    help={message?.error?.name ? t(message?.error?.name) : undefined}
                                    hasFeedback
                                >
                                    <Input
                                        placeholder={t("classrooms.addClassroom.placeholder")}
                                        onInput={() => setMessage(null)}
                                        style={{ borderRadius: "6px" }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="level"
                                    label={t("classrooms.addClassroom.level.label")}
                                    rules={[{required: true, message: t("signup.error.level.empty")}]}
                                >
                                    <Cascader
                                        placeholder={t("classrooms.addClassroom.level.placeholder")}
                                        options={options}
                                        expandTrigger="hover"
                                        displayRender={(labels) => labels[labels.length - 1]}
                                        style={{ borderRadius: "6px" }}
                                    />
                                </Form.Item>
                                <Form.Item wrapperCol={{xs: {span: 24, offset: 0}, sm: {span: 16, offset: 6}}}>
                                    <Space style={{ width: "100%", gap: "1rem" }} wrap>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                            icon={<PlusOutlined />}
                                            style={{
                                                minWidth: isMobile ? "100%" : "200px",
                                                fontWeight: "600",
                                                height: "40px",
                                                borderRadius: "6px",
                                                flex: isMobile ? "1 1 auto" : "0 1 auto"
                                            }}
                                        >
                                            {t("classrooms.addClassroom.button")}
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setShowAddForm(false);
                                                form.resetFields();
                                                setMessage(null);
                                            }}
                                            style={{
                                                minWidth: isMobile ? "100%" : "200px",
                                                fontSize: "1rem",
                                                fontWeight: "600",
                                                height: "40px",
                                                borderRadius: "6px",
                                                flex: isMobile ? "1 1 auto" : "0 1 auto"
                                            }}
                                        >
                                            {t("signup.button.prev")}
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </div>
                    </>
                )}
            </Card>
        </Spin>
    );
};

export default ClassroomsList;