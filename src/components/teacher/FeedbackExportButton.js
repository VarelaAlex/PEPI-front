import {DownloadOutlined} from "@ant-design/icons";
import {Alert, Button} from "antd";
import ExcelJS from "exceljs";
import {useState} from "react";
import {useTranslation} from "react-i18next";

const columnKeys = [
    "date", "studentName", "studentId", "classroomId", "title", "networkType", "representation",
    "trainingMode", "avatarVisible",
    "phase1ElapsedTime", "phase1IncorrectOrderSintactic", "phase1IncorrectOrderSemantic",
    "phase1IncorrectOrderLexical", "phase1IncorrectPosSintactic", "phase1IncorrectPosSemantic",
    "phase1IncorrectPosLexical", "phase1OutOfBoundsSintactic", "phase1OutOfBoundsSemantic",
    "phase1OutOfBoundsLexical", "phase1LexicalError", "phase1SyntacticError", "phase1SemanticError",
    "phase1OrderError", "phase2ElapsedTime", "phase2IncorrectOrderSintactic",
    "phase2IncorrectOrderSemantic", "phase2IncorrectOrderLexical", "phase2IncorrectPosSintactic",
    "phase2IncorrectPosSemantic", "phase2IncorrectPosLexical", "phase2OutOfBoundsSintactic",
    "phase2OutOfBoundsSemantic", "phase2OutOfBoundsLexical", "phase2LexicalError",
    "phase2SyntacticError", "phase2SemanticError", "phase2OrderError"
];

const columnLabels = [
    "Fecha", "Alumno", "ID alumno", "ID clase", "Ejercicio", "Tipo de red", "Representación",
    "Modo de entrenamiento", "Avatar visible",
    "Fase 1 - Tiempo (ms)", "Fase 1 - Orden sintáctico incorrecto",
    "Fase 1 - Orden semántico incorrecto", "Fase 1 - Orden léxico incorrecto",
    "Fase 1 - Posición sintáctica incorrecta", "Fase 1 - Posición semántica incorrecta",
    "Fase 1 - Posición léxica incorrecta", "Fase 1 - Fuera de límites sintáctico",
    "Fase 1 - Fuera de límites semántico", "Fase 1 - Fuera de límites léxico",
    "Fase 1 - Error léxico", "Fase 1 - Error sintáctico", "Fase 1 - Error semántico",
    "Fase 1 - Error de orden", "Fase 2 - Tiempo (ms)", "Fase 2 - Orden sintáctico incorrecto",
    "Fase 2 - Orden semántico incorrecto", "Fase 2 - Orden léxico incorrecto",
    "Fase 2 - Posición sintáctica incorrecta", "Fase 2 - Posición semántica incorrecta",
    "Fase 2 - Posición léxica incorrecta", "Fase 2 - Fuera de límites sintáctico",
    "Fase 2 - Fuera de límites semántico", "Fase 2 - Fuera de límites léxico",
    "Fase 2 - Error léxico", "Fase 2 - Error sintáctico", "Fase 2 - Error semántico",
    "Fase 2 - Error de orden"
];

const phaseFields = [
    "elapsedTime", "incorrectOrderSintactic", "incorrectOrderSemantic", "incorrectOrderLexical",
    "incorrectPosSintactic", "incorrectPosSemantic", "incorrectPosLexical", "outOfBoundsSintactic",
    "outOfBoundsSemantic", "outOfBoundsLexical", "lexicalError", "syntacticError", "semanticError",
    "orderError"
];

const toExcelRow = feedback => {
    const row = {
        date: feedback.date ? new Date(feedback.date) : null,
        studentName: feedback.studentName || "",
        studentId: feedback.student?.studentId ?? "",
        classroomId: feedback.student?.classroomId ?? "",
        title: feedback.title || "",
        networkType: feedback.networkType || "",
        representation: feedback.representation || "",
        trainingMode: feedback.trainingMode || "",
        avatarVisible: feedback.avatarVisible ?? ""
    };

    ["phase1", "phase2"].forEach(phase => {
        phaseFields.forEach(field => {
            row[`${phase}${field[0].toUpperCase()}${field.slice(1)}`] = feedback[phase]?.[field] ?? 0;
        });
    });

    return row;
};

const safeFilename = value => (value || "feedback")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "");

const FeedbackExportButton = ({scope, id, name}) => {
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const download = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${process.env.REACT_APP_EXERCISES_SERVICE_URL}/statistics/export/${scope}/${encodeURIComponent(id)}`,
                {headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}}
            );
            if (!response.ok) {
                throw new Error(t("feedbackExport.error"));
            }

            const {feedbacks, name: resourceName} = await response.json();
            if (!feedbacks?.length) {
                throw new Error(t("feedbackExport.empty"));
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet("Feedback");
            worksheet.columns = columnKeys.map((key, index) => ({
                header: columnLabels[index],
                key,
                width: Math.max(16, columnLabels[index].length + 2)
            }));
            feedbacks.forEach(feedback => worksheet.addRow(toExcelRow(feedback)));
            worksheet.getRow(1).font = {bold: true};
            worksheet.autoFilter = {
                from: "A1",
                to: `${worksheet.getColumn(columnKeys.length).letter}1`
            };
            worksheet.getColumn("date").numFmt = "dd/mm/yyyy hh:mm:ss";

            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = `feedback_${safeFilename(resourceName || name)}_${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (downloadError) {
            setError(downloadError.message || t("feedbackExport.error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{marginBottom: "1rem"}}>
            <Button icon={<DownloadOutlined/>} loading={loading} disabled={!id} onClick={download}>
                {t("feedbackExport.button")}
            </Button>
            {error && <Alert style={{marginTop: "0.75rem"}} type="error" showIcon message={error}/>}
        </div>
    );
};

export default FeedbackExportButton;
