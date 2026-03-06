import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useTranslation } from "react-i18next";
import {useParams} from 'react-router-dom';
import {Card, Typography} from 'antd';
import TeacherBreadcrumb from './BreadcrumbComponent';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

let StudentStatistics = ({studentName}) => {
    let {studentId} = useParams();
    const [chartDataIconic, setChartDataIconic] = useState({});
    const [chartDataMixed, setChartDataMixed] = useState({});
    const [chartDataSymbolic, setChartDataSymbolic] = useState({});
    const [chartDataGlobal, setChartDataGlobal] = useState({});
    let [totalFeedbacks, setTotalFeedbacks] = useState(0);
    let [iconicErrorsTotal, setIconicErrorsTotal] = useState(0);
    let [mixedErrorsTotal, setMixedErrorsTotal] = useState(0);
    let [symbolicErrorsTotal, setSymbolicErrorsTotal] = useState(0);
    let [globalErrorsTotal, setGlobalErrorsTotal] = useState(0);
    let {t} = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_EXERCISES_SERVICE_URL}/statistics/student/${studentId}`);
                const data = await response.json();
                if (data) {
                    setTotalFeedbacks(data.totalFeedbacks || 0);
                    setIconicErrorsTotal(data.iconicErrorsTotal || 0);
                    setMixedErrorsTotal(data.mixedErrorsTotal || 0);
                    setSymbolicErrorsTotal(data.symbolicErrorsTotal || 0);
                    setGlobalErrorsTotal(data.globalErrorsTotal || 0);

                    // Preparar datos para gráficas de ICONIC (con desglose de errores)
                    if (data.iconicErrors) {
                        const iconicDatasets = [
                            {
                                label: t('studentStats.incorrectOrder'),
                                data: [
                                    data.iconicErrors.Lexical?.incorrectOrder?.count || 0,
                                    data.iconicErrors.Syntactic?.incorrectOrder?.count || 0,
                                    data.iconicErrors.Semantic?.incorrectOrder?.count || 0
                                ],
                                backgroundColor: "rgba(255, 99, 132, 0.8)"
                            },
                            {
                                label: t('studentStats.incorrectPos'),
                                data: [
                                    data.iconicErrors.Lexical?.incorrectPos?.count || 0,
                                    data.iconicErrors.Syntactic?.incorrectPos?.count || 0,
                                    data.iconicErrors.Semantic?.incorrectPos?.count || 0
                                ],
                                backgroundColor: "rgba(54, 162, 235, 0.8)"
                            },
                            {
                                label: t('studentStats.outOfBounds'),
                                data: [
                                    data.iconicErrors.Lexical?.outOfBounds?.count || 0,
                                    data.iconicErrors.Syntactic?.outOfBounds?.count || 0,
                                    data.iconicErrors.Semantic?.outOfBounds?.count || 0
                                ],
                                backgroundColor: "rgba(75, 192, 192, 0.8)"
                            }
                        ];
                        setChartDataIconic({
                            labels: [t('lexical'), t('syntactic'), t('semantic')],
                            datasets: iconicDatasets
                        });
                    }

                    // Preparar datos para gráficas de MIXED (con desglose de errores)
                    if (data.mixedErrors) {
                        const mixedDatasets = [
                            {
                                label: t('studentStats.incorrectOrder'),
                                data: [
                                    data.mixedErrors.Lexical?.incorrectOrder?.count || 0,
                                    data.mixedErrors.Syntactic?.incorrectOrder?.count || 0,
                                    data.mixedErrors.Semantic?.incorrectOrder?.count || 0
                                ],
                                backgroundColor: "rgba(255, 99, 132, 0.8)"
                            },
                            {
                                label: t('studentStats.incorrectPos'),
                                data: [
                                    data.mixedErrors.Lexical?.incorrectPos?.count || 0,
                                    data.mixedErrors.Syntactic?.incorrectPos?.count || 0,
                                    data.mixedErrors.Semantic?.incorrectPos?.count || 0
                                ],
                                backgroundColor: "rgba(54, 162, 235, 0.8)"
                            },
                            {
                                label: t('studentStats.outOfBounds'),
                                data: [
                                    data.mixedErrors.Lexical?.outOfBounds?.count || 0,
                                    data.mixedErrors.Syntactic?.outOfBounds?.count || 0,
                                    data.mixedErrors.Semantic?.outOfBounds?.count || 0
                                ],
                                backgroundColor: "rgba(75, 192, 192, 0.8)"
                            }
                        ];
                        setChartDataMixed({
                            labels: [t('lexical'), t('syntactic'), t('semantic')],
                            datasets: mixedDatasets
                        });
                    }

                    // Preparar datos para gráficas de SYMBOLIC (sin desglose, solo totales)
                    if (data.symbolicErrors) {
                        const symbolicDatasets = [
                            {
                                label: t('representation.symbolic'),
                                data: [
                                    data.symbolicErrors.Lexical?.count || 0,
                                    data.symbolicErrors.Syntactic?.count || 0,
                                    data.symbolicErrors.Semantic?.count || 0
                                ],
                                backgroundColor: "rgba(255, 193, 7, 0.8)"
                            }
                        ];
                        setChartDataSymbolic({
                            labels: [t('lexical'), t('syntactic'), t('semantic')],
                            datasets: symbolicDatasets
                        });
                    }

                    // Preparar datos para gráficas de GLOBAL (con desglose de errores)
                    if (data.globalErrors) {
                        const globalDatasets = [
                            {
                                label: t('studentStats.incorrectOrder'),
                                data: [
                                    data.globalErrors.Lexical?.incorrectOrder?.count || 0,
                                    data.globalErrors.Syntactic?.incorrectOrder?.count || 0,
                                    data.globalErrors.Semantic?.incorrectOrder?.count || 0
                                ],
                                backgroundColor: "rgba(255, 99, 132, 0.8)"
                            },
                            {
                                label: t('studentStats.incorrectPos'),
                                data: [
                                    data.globalErrors.Lexical?.incorrectPos?.count || 0,
                                    data.globalErrors.Syntactic?.incorrectPos?.count || 0,
                                    data.globalErrors.Semantic?.incorrectPos?.count || 0
                                ],
                                backgroundColor: "rgba(54, 162, 235, 0.8)"
                            },
                            {
                                label: t('studentStats.outOfBounds'),
                                data: [
                                    data.globalErrors.Lexical?.outOfBounds?.count || 0,
                                    data.globalErrors.Syntactic?.outOfBounds?.count || 0,
                                    data.globalErrors.Semantic?.outOfBounds?.count || 0
                                ],
                                backgroundColor: "rgba(75, 192, 192, 0.8)"
                            }
                        ];
                        setChartDataGlobal({
                            labels: [t('lexical'), t('syntactic'), t('semantic')],
                            datasets: globalDatasets
                        });
                    }
                }
            }
            catch ( error ) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [studentId, t]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: "top" },
            title: {
                display: true,
                font: { size: 14 }
            }
        },
        scales: {
            y: { beginAtZero: true }
        }
    };

    let {Title} = Typography;
    return (
        <div>
            <div style={{width: "100%", marginLeft: "auto", marginRight: "auto", marginTop: "2vh"}}>
                <TeacherBreadcrumb/>
            </div>
            <div style={{width: "95vw", marginLeft: "auto", marginRight: "auto", marginTop: "2vh", marginBottom: "2vh"}}>
                <Card title={<Title>{studentName}</Title>}>
                    <h2>{t("studentStats.numberOfExercises")}: {totalFeedbacks}</h2>

                    {/* ICONIC */}
                    <div style={{backgroundColor: "#fafafa", padding: "1.5rem", borderRadius: "8px", marginTop: "2rem", marginBottom: "2rem"}}>
                        <h3 style={{textAlign: "center", marginBottom: "1rem", fontSize: "1.1em"}}>{t("representation.iconic")}: {iconicErrorsTotal}</h3>
                        <div style={{height: "400px", position: "relative", width: "100%"}}>
                            {chartDataIconic && chartDataIconic.labels && (
                                <Bar
                                    data={chartDataIconic}
                                    options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: t("representation.iconic")}}}}
                                />
                            )}
                        </div>
                    </div>

                    {/* MIXED */}
                    <div style={{backgroundColor: "#fafafa", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem"}}>
                        <h3 style={{textAlign: "center", marginBottom: "1rem", fontSize: "1.1em"}}>{t("representation.mixed")}: {mixedErrorsTotal}</h3>
                        <div style={{height: "400px", position: "relative", width: "100%"}}>
                            {chartDataMixed && chartDataMixed.labels && (
                                <Bar
                                    data={chartDataMixed}
                                    options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: t("representation.mixed")}}}}
                                />
                            )}
                        </div>
                    </div>

                    {/* GLOBAL */}
                    <div style={{backgroundColor: "#fafafa", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem"}}>
                        <h3 style={{textAlign: "center", marginBottom: "1rem", fontSize: "1.1em"}}>{t("representation.global")}: {globalErrorsTotal}</h3>
                        <div style={{height: "400px", position: "relative", width: "100%"}}>
                            {chartDataGlobal && chartDataGlobal.labels && (
                                <Bar
                                    data={chartDataGlobal}
                                    options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: t("representation.global")}}}}
                                />
                            )}
                        </div>
                    </div>

                    {/* SYMBOLIC */}
                    <div style={{backgroundColor: "#fafafa", padding: "1.5rem", borderRadius: "8px"}}>
                        <h3 style={{textAlign: "center", marginBottom: "1rem", fontSize: "1.1em"}}>{t("representation.symbolic")}: {symbolicErrorsTotal}</h3>
                        <div style={{height: "400px", position: "relative", width: "100%"}}>
                            {chartDataSymbolic && chartDataSymbolic.labels && (
                                <Bar
                                    data={chartDataSymbolic}
                                    options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: t("representation.symbolic")}}}}
                                />
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default StudentStatistics;



