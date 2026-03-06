import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

let TeacherBreadcrumb = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Función para decodificar nombres que contienen %20 u otros caracteres codificados
    const decodePathSegment = (segment) => {
        try {
            return decodeURIComponent(segment);
        } catch (e) {
            return segment;
        }
    };

    // Mapeo de rutas a labels y breadcrumbs
    const getBreadcrumbItems = () => {
        const pathname = location.pathname;
        const items = [
            {
                title: (
                    <span
                        onClick={() => navigate("/teachers/menuTeacher")}
                        style={{
                            cursor: "pointer",
                            color: "#1890ff",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#40a9ff"}
                        onMouseLeave={(e) => e.target.style.color = "#1890ff"}
                    >
                        <HomeOutlined />
                    </span>
                )
            }
        ];

        // Menu de aulas (mis aulas)
        if (pathname === "/teachers/menuTeacher") {
            items.push({
                title: t("sider.teacher.classrooms")
            });
            return items;
        }

        // Detalle de aula
        if (pathname.match(/^\/teachers\/classrooms\/[^/]+$/)) {
            const classroomName = decodePathSegment(pathname.split("/").pop());
            items.push({
                title: (
                    <span
                        onClick={() => navigate("/teachers/menuTeacher")}
                        style={{
                            cursor: "pointer",
                            color: "#1890ff",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#40a9ff"}
                        onMouseLeave={(e) => e.target.style.color = "#1890ff"}
                    >
                        {t("sider.teacher.classrooms")}
                    </span>
                )
            });
            items.push({
                title: classroomName
            });
            return items;
        }

        // Crear alumno
        if (pathname.match(/^\/teachers\/classrooms\/[^/]+\/students$/)) {
            const classroomName = decodePathSegment(pathname.split("/")[3]);
            items.push({
                title: (
                    <span
                        onClick={() => navigate("/teachers/menuTeacher")}
                        style={{
                            cursor: "pointer",
                            color: "#1890ff",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#40a9ff"}
                        onMouseLeave={(e) => e.target.style.color = "#1890ff"}
                    >
                        {t("sider.teacher.classrooms")}
                    </span>
                )
            });
            items.push({
                title: (
                    <span
                        onClick={() => navigate(`/teachers/classrooms/${classroomName}`)}
                        style={{
                            cursor: "pointer",
                            color: "#1890ff",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#40a9ff"}
                        onMouseLeave={(e) => e.target.style.color = "#1890ff"}
                    >
                        {classroomName}
                    </span>
                )
            });
            items.push({
                title: t("signup.student.title")
            });
            return items;
        }

        // Detalle de alumno
        if (pathname.match(/^\/teachers\/[^/]+\/students\/[^/]+$/)) {
            const classroomName = decodePathSegment(pathname.split("/")[2]);
            const studentName = localStorage.getItem("currentStudentName") || "Student";

            items.push({
                title: (
                    <span
                        onClick={() => navigate("/teachers/menuTeacher")}
                        style={{
                            cursor: "pointer",
                            color: "#1890ff",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#40a9ff"}
                        onMouseLeave={(e) => e.target.style.color = "#1890ff"}
                    >
                        {t("sider.teacher.classrooms")}
                    </span>
                )
            });
            items.push({
                title: (
                    <span
                        onClick={() => navigate(`/teachers/classrooms/${classroomName}`)}
                        style={{
                            cursor: "pointer",
                            color: "#1890ff",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#40a9ff"}
                        onMouseLeave={(e) => e.target.style.color = "#1890ff"}
                    >
                        {classroomName}
                    </span>
                )
            });
            items.push({
                title: studentName
            });
            return items;
        }

        // Encuesta A
        if (pathname.match(/^\/teachers\/[^/]+\/students\/[^/]+\/surveys\/A$/)) {
            const classroomName = decodePathSegment(pathname.split("/")[2]);
            const studentName = localStorage.getItem("currentStudentName");

            items.push({
                title: (
                    <span
                        onClick={() => navigate("/teachers/menuTeacher")}
                        style={{
                            cursor: "pointer",
                            color: "#1890ff",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#40a9ff"}
                        onMouseLeave={(e) => e.target.style.color = "#1890ff"}
                    >
                        {t("sider.teacher.classrooms")}
                    </span>
                )
            });
            items.push({
                title: (
                    <span
                        onClick={() => navigate(`/teachers/classrooms/${classroomName}`)}
                        style={{
                            cursor: "pointer",
                            color: "#1890ff",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#40a9ff"}
                        onMouseLeave={(e) => e.target.style.color = "#1890ff"}
                    >
                        {classroomName}
                    </span>
                )
            });

            if (studentName) {
                items.push({
                    title: studentName
                });
            }

            items.push({
                title: t("survey.title")
            });
            return items;
        }

        // Encuesta B
        if (pathname.match(/^\/teachers\/[^/]+\/students\/[^/]+\/surveys\/B$/)) {
            const classroomName = decodePathSegment(pathname.split("/")[2]);
            const studentName = localStorage.getItem("currentStudentName");

            items.push({
                title: (
                    <span
                        onClick={() => navigate("/teachers/menuTeacher")}
                        style={{
                            cursor: "pointer",
                            color: "#1890ff",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#40a9ff"}
                        onMouseLeave={(e) => e.target.style.color = "#1890ff"}
                    >
                        {t("sider.teacher.classrooms")}
                    </span>
                )
            });
            items.push({
                title: (
                    <span
                        onClick={() => navigate(`/teachers/classrooms/${classroomName}`)}
                        style={{
                            cursor: "pointer",
                            color: "#1890ff",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#40a9ff"}
                        onMouseLeave={(e) => e.target.style.color = "#1890ff"}
                    >
                        {classroomName}
                    </span>
                )
            });

            if (studentName) {
                items.push({
                    title: studentName
                });
            }

            items.push({
                title: t("survey.title")
            });
            return items;
        }

        // Ejercicios (mis ejercicios)
        if (pathname === "/teachers/manageExercises") {
            items.push({
                title: t("sider.teacher.exercises")
            });
            return items;
        }

        // Crear ejercicio
        if (pathname === "/teachers/create") {
            items.push({
                title: (
                    <span
                        onClick={() => navigate("/teachers/manageExercises")}
                        style={{
                            cursor: "pointer",
                            color: "#1890ff",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#40a9ff"}
                        onMouseLeave={(e) => e.target.style.color = "#1890ff"}
                    >
                        {t("sider.teacher.exercises")}
                    </span>
                )
            });
            items.push({
                title: t("exercise.create.title")
            });
            return items;
        }

        // Editar ejercicio
        if (pathname.match(/^\/teachers\/exercise\/[^/]+\/edit$/)) {
            items.push({
                title: (
                    <span
                        onClick={() => navigate("/teachers/manageExercises")}
                        style={{
                            cursor: "pointer",
                            color: "#1890ff",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#40a9ff"}
                        onMouseLeave={(e) => e.target.style.color = "#1890ff"}
                    >
                        {t("sider.teacher.exercises")}
                    </span>
                )
            });
            items.push({
                title: t("exercise.edit.title")
            });
            return items;
        }

        // Estadísticas del aula
        if (pathname.match(/^\/teachers\/classroomStats\/[^/]+$/)) {
            const classroomName = decodePathSegment(pathname.split("/").pop());
            items.push({
                title: (
                    <span
                        onClick={() => navigate("/teachers/menuTeacher")}
                        style={{
                            cursor: "pointer",
                            color: "#1890ff",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#40a9ff"}
                        onMouseLeave={(e) => e.target.style.color = "#1890ff"}
                    >
                        {t("sider.teacher.classrooms")}
                    </span>
                )
            });
            items.push({
                title: (
                    <span
                        onClick={() => navigate(`/teachers/classrooms/${classroomName}`)}
                        style={{
                            cursor: "pointer",
                            color: "#1890ff",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#40a9ff"}
                        onMouseLeave={(e) => e.target.style.color = "#1890ff"}
                    >
                        {classroomName}
                    </span>
                )
            });
            items.push({
                title: t("statistics.title")
            });
            return items;
        }

        // Estadísticas del alumno
        if (pathname.match(/^\/teachers\/studentStats\/[^/]+$/)) {
            // Para obtener el nombre del alumno y aula, usamos localStorage si está disponible
            // Si no, mostramos solo la ruta sin el nombre
            const classroomName = localStorage.getItem("currentClassroomName");
            const studentName = localStorage.getItem("currentStudentName");

            items.push({
                title: (
                    <span
                        onClick={() => navigate("/teachers/menuTeacher")}
                        style={{
                            cursor: "pointer",
                            color: "#1890ff",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#40a9ff"}
                        onMouseLeave={(e) => e.target.style.color = "#1890ff"}
                    >
                        {t("sider.teacher.classrooms")}
                    </span>
                )
            });

            if (classroomName) {
                items.push({
                    title: (
                        <span
                            onClick={() => navigate(`/teachers/classrooms/${classroomName}`)}
                            style={{
                                cursor: "pointer",
                                color: "#1890ff",
                                transition: "color 0.3s"
                            }}
                            onMouseEnter={(e) => e.target.style.color = "#40a9ff"}
                            onMouseLeave={(e) => e.target.style.color = "#1890ff"}
                        >
                            {classroomName}
                        </span>
                    )
                });
            }

            if (studentName) {
                items.push({
                    title: (
                        <span
                            style={{
                                cursor: "pointer",
                                color: "#1890ff",
                                transition: "color 0.3s"
                            }}
                            onMouseEnter={(e) => e.target.style.color = "#40a9ff"}
                            onMouseLeave={(e) => e.target.style.color = "#1890ff"}
                        >
                            {studentName}
                        </span>
                    )
                });
            }

            items.push({
                title: t("statistics.title")
            });
            return items;
        }

        // Perfil
        if (pathname === "/teachers/profile") {
            items.push({
                title: t("sider.teacher.profile")
            });
            return items;
        }

        // Acerca de PEPI
        if (pathname === "/teachers/aboutEPI") {
            items.push({
                title: t("sider.about")
            });
            return items;
        }

        return items;
    };

    return (
        <Breadcrumb
            items={getBreadcrumbItems()}
            style={{
                marginBottom: "1.5rem",
                padding: "0.75rem 0"
            }}
        />
    );
};

export default TeacherBreadcrumb;


