import {CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, LineChartOutlined, PlusOutlined} from "@ant-design/icons";
import {
    Alert, Button, Card, Cascader, Divider, Empty, Input, Popconfirm, Row, Space, Spin, Table, Typography
} from "antd";
import {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Link, useNavigate, useParams} from "react-router-dom";
import TeacherBreadcrumb from "./BreadcrumbComponent";

let ClassroomDetail = (props) => {

    let {isMobile, setStudentName} = props;
    let {classroomName} = useParams();

    let [students, setStudents] = useState([]);
    let [loading, setLoading] = useState(true);
    let [editing, setEditing] = useState(false);
    let [message, setMessage] = useState(null);
    let [inputName, setInputName] = useState(classroomName);
    let [inputLevel, setInputLevel] = useState([]);

    let navigate = useNavigate();

    let {t} = useTranslation();

    let getStudents = useCallback(async () => {
        setLoading(true);
        let response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/students/list/" + classroomName, {
            method: "GET", headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
        });

        if (response.ok) {
            let jsonData = await response.json();
            for (const student of jsonData) {
                let responseSurvey = await fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/surveys/${student.id}/${(student.age > 5 ? "B" : "A")}`, {
                    method: "GET", headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
                });

                if (responseSurvey.ok) {
                    let jsonDataSurvey = await responseSurvey.json();
                    if (jsonDataSurvey?.id) {
                        student.surveyCompleted = true;
                    }
                }
            }
            setStudents(jsonData);
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
    }, [classroomName]);

    const options = [{
        value: "EI", label: "Educación Infantil", children: [{value: "1", label: "3 años de Educación Infantil"}, {
            value: "2", label: "4 años de Educación Infantil"
        }, {value: "3", label: "5 años de Educación Infantil"}]
    }, {
        value: "EP", label: "Educación Primaria", children: [{value: "1", label: "1º de Educación Primaria"}, {
            value: "2", label: "2º de Educación Primaria"
        }, {value: "3", label: "3º de Educación Primaria"}, {
            value: "4", label: "4º de Educación Primaria"
        }, {value: "5", label: "5º de Educación Primaria"}, {value: "6", label: "6º de Educación Primaria"}]
    }];

    useEffect(() => {
        let getClassroomInfo = async () => {
            let response = null;
            try {
                response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/classrooms/" + classroomName, {
                    method: "GET", headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    }
                });
            } catch (e) {
                setMessage({error: {type: "internalServerError", message: e}});
                return;
            }

            let jsonData = await response?.json();
            if (response?.ok) {
                if (jsonData != null) {
                    const [mainLevel, subLevel] = jsonData[0].level.split("-");
                    setInputLevel([subLevel, mainLevel]);
                }
            } else {
                setMessage({error: jsonData?.error});
            }
        };

        getClassroomInfo();
        getStudents();
    }, [classroomName, getStudents]);

    let deleteStudent = useCallback(async (id) => {
        await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/students/" + id, {
            method: "DELETE", headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
        });
        await getStudents();
    }, [getStudents]);

    const columns = isMobile ? [
        {
            title: t("classrooms.detail.table.studentName"),
            dataIndex: "name",
            render: (name, student) => (
                <Link to={`/teachers/${classroomName}/students/${student.id}`}>
                    <div><strong>{name}</strong></div>
                    <small>{student.username}</small>
                </Link>
            )
        },
        {
            title: t("classrooms.table.actions"),
            dataIndex: "id",
            render: (id, student) => (
                <Space layout="vertical" style={{ width: "100%" }}>
                    {student.surveyCompleted ? (
                        <>
                            <Space size="small">
                                <Typography.Text style={{ fontSize: "0.9rem" }}>
                                    {t("classrooms.detail.table.surveyCompleted")}
                                </Typography.Text>
                                <CheckOutlined style={{ color: "#52c41a" }} />
                            </Space>
                            <Button
                                size="small"
                                block
                                onClick={() => {
                                    setStudentName(student.name);
                                    localStorage.setItem("currentStudentName", student.name);
                                    localStorage.setItem("currentClassroomName", classroomName);
                                    navigate(`/teachers/${classroomName}/students/${student.id}/surveys/${(student.age > 5 ? "B" : "A")}`);
                                }}
                            >
                                {t("classrooms.detail.table.buttons.edit")}
                            </Button>
                        </>
                    ) : (
                        <Button
                            size="small"
                            block
                            onClick={() => {
                                setStudentName(student.name);
                                localStorage.setItem("currentStudentName", student.name);
                                localStorage.setItem("currentClassroomName", classroomName);
                                navigate(`/teachers/${classroomName}/students/${student.id}/surveys/${(student.age > 5 ? "B" : "A")}`);
                            }}
                        >
                            {t("classrooms.detail.table.buttons.survey")}
                        </Button>
                    )}
                    <Button
                        size="small"
                        block
                        onClick={() => {
                            setStudentName(student.name);
                            localStorage.setItem("currentStudentName", student.name);
                            localStorage.setItem("currentClassroomName", classroomName);
                            navigate("/teachers/studentStats/" + id);
                        }}
                        icon={<LineChartOutlined />}
                    >
                        {t("classrooms.detail.table.buttons.seeStatistics")}
                    </Button>
                    <Popconfirm
                        title={t("student.delete.popconfirm.title")}
                        description={t("student.delete.popconfirm.description")}
                        okText={t("student.delete.popconfirm.okText")}
                        okButtonProps={{danger: true}}
                        cancelText={t("student.delete.popconfirm.cancelText")}
                        onConfirm={() => deleteStudent(id)}
                    >
                        <Button
                            size="small"
                            block
                            danger
                            type="primary"
                            icon={<DeleteOutlined />}
                        >
                            {t("classrooms.detail.table.buttons.delete")}
                        </Button>
                    </Popconfirm>
                </Space>
            )
        }
    ] : [
        {
            title: t("classrooms.detail.table.studentUsername"),
            dataIndex: "username",
            render: (username, student) => (
                <Link to={`/teachers/${classroomName}/students/${student.id}`}>{username}</Link>
            )
        },
        {
            title: t("classrooms.detail.table.studentName"),
            dataIndex: "name",
            render: (name) => name
        },
        {
            title: t("classrooms.detail.table.studentLastName"),
            dataIndex: "lastName",
            render: (lastName) => lastName
        },
        {
            title: t("classrooms.detail.table.studentAge"),
            dataIndex: "age",
            render: (age) => age
        },
        {
            title: t("classrooms.table.actions"),
            dataIndex: "id",
            align: "right",
            render: (id, student) => (
                <Space wrap>
                    {student.surveyCompleted ? (
                        <Space size="small">
                            <Typography.Text>{t("classrooms.detail.table.surveyCompleted")}</Typography.Text>
                            <CheckOutlined style={{ color: "#52c41a" }} />
                            <Button
                                size="small"
                                onClick={() => {
                                    setStudentName(student.name);
                                    localStorage.setItem("currentStudentName", student.name);
                                    localStorage.setItem("currentClassroomName", classroomName);
                                    navigate(`/teachers/${classroomName}/students/${student.id}/surveys/${(student.age > 5 ? "B" : "A")}`);
                                }}
                            >
                                {t("classrooms.detail.table.buttons.edit")}
                            </Button>
                        </Space>
                    ) : (
                        <Button
                            size="small"
                            onClick={() => {
                                setStudentName(student.name);
                                localStorage.setItem("currentStudentName", student.name);
                                localStorage.setItem("currentClassroomName", classroomName);
                                navigate(`/teachers/${classroomName}/students/${student.id}/surveys/${(student.age > 5 ? "B" : "A")}`);
                            }}
                        >
                            {t("classrooms.detail.table.buttons.survey")}
                        </Button>
                    )}
                    <Button
                        size="small"
                        onClick={() => {
                            setStudentName(student.name);
                            localStorage.setItem("currentStudentName", student.name);
                            localStorage.setItem("currentClassroomName", classroomName);
                            navigate("/teachers/studentStats/" + id);
                        }}
                        icon={<LineChartOutlined />}
                    >
                        {t("classrooms.detail.table.buttons.seeStatistics")}
                    </Button>
                    <Popconfirm
                        title={t("student.delete.popconfirm.title")}
                        description={t("student.delete.popconfirm.description")}
                        okText={t("student.delete.popconfirm.okText")}
                        okButtonProps={{danger: true}}
                        cancelText={t("student.delete.popconfirm.cancelText")}
                        onConfirm={() => deleteStudent(id)}
                    >
                        <Button
                            size="small"
                            danger
                            type="primary"
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    let changeClassroomName = async () => {

        let response = null;
        try {
            response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/classrooms/" + classroomName, {
                method: "PUT", headers: {
                    "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }, body: JSON.stringify({
                    name: inputName, level: inputLevel[1] + "-" + inputLevel[0]
                })
            });
        } catch (e) {
            setMessage({error: {type: "internalServerError", message: e}});
            return;
        }

        let jsonData = await response?.json();
        if (response?.ok) {
            if (jsonData?.updated != null) {
                setEditing(false);
                navigate("/teachers/classrooms/" + inputName);
            }
        } else {
            setMessage({error: jsonData?.error});
        }
    };

    return (<Spin spinning={loading} size="large">
        <div style={{ width: isMobile ? "95vw" : "90vw", marginLeft: "auto", marginRight: "auto", marginTop: "2vh" }}>
            <TeacherBreadcrumb />
        </div>
        <Card
            title={!editing ? <Space>{classroomName} <EditOutlined onClick={() => setEditing(true)}/></Space> : <>
                <Row>
                    <Typography.Text style={{
                        "color": "red", "fontSize": "11px"
                    }}>
                        {message?.error?.repeatedName ? t(message?.error?.repeatedName) : undefined}
                    </Typography.Text>
                </Row>
                <Row>
                    <Space.Compact style={{width: isMobile ? "100%" : "40%"}}>
                        <Input status={message?.error?.repeatedName && "error"} value={inputName}
                               onChange={(e) => setInputName(e.target.value)}/>
                        <Cascader
                            placeholder={t("classrooms.level.placeholder")}
                            value={inputLevel}
                            onChange={(value) => setInputLevel(value)}
                            options={options}
                            expandTrigger="hover"
                            displayRender={(labels) => labels[labels.length - 1]}
                        />
                        <Button color="primary" variant="outlined"
                                onClick={changeClassroomName}><CheckOutlined/></Button>
                        <Button color="danger" variant="outlined"
                                onClick={() => setEditing(false)}><CloseOutlined/></Button>
                    </Space.Compact>
                </Row>
            </>}
            style={{width: isMobile ? "95vw" : "90vw", marginTop: "2vh", marginBottom: "2vh", marginLeft: "auto", marginRight: "auto"}}
        >
            {message?.error?.type &&
                <Alert type="error" description={t(message?.error?.type)} showIcon style={{marginBottom: "1vh"}}/>}
            {students.length <= 0 ?
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t("classrooms.detail.table.empty")}/> :
                <div style={{overflowX: "auto"}}>
                    <Table
                        bordered
                        columns={columns}
                        dataSource={students}
                        pagination={isMobile ? {pageSize: 5} : {pageSize: 7}}
                        size={isMobile ? "small" : "middle"}
                    />
                </div>
            }
            <Divider style={{margin: "2vh 0"}}/>
            <Row justify="center">
                <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        navigate(`/teachers/classrooms/${classroomName}/students`);
                    }}
                    block={isMobile}
                    style={{
                        minWidth: isMobile ? "100%" : "300px",
                        fontSize: "1rem",
                        fontWeight: "600",
                        height: "45px"
                    }}
                >
                    {t("classrooms.detail.addStudent.button")}
                </Button>
            </Row>
        </Card>
    </Spin>);
};

export default ClassroomDetail;