import {Card, Col, Row, Typography} from "antd";
import {BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import React, {useEffect, useState} from "react";
import {Bar} from "react-chartjs-2";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import TeacherBreadcrumb from "./BreadcrumbComponent";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

let ClassroomStatistics = ({classroomId}) => {
    let {classroomName} = useParams();
    const [chartDataFree, setChartDataFree] = useState({});
    const [chartDataRuled, setChartDataRuled] = useState({});
    const [totalFree, setTotalFree] = useState(0);
    const [totalRuled, setTotalRuled] = useState(0);
    let {t} = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_EXERCISES_SERVICE_URL}/statistics/classroom/${classroomId}`);
                const data = await response.json();

                if (data && data.groupedData) {
                    const groupedData = data.groupedData;
                    const networkTypeOrder = ["I-I", "I-II", "I-III"];
                    const representations = ["ICONIC", "MIXED", "GLOBAL", "SYMBOLIC"];

                    // Para las leyendas de las gráficas
                    const representationLabels = {
                        "ICONIC": t('representation.iconic'),
                        "MIXED": t('representation.mixed'),
                        "GLOBAL": t('representation.global'),
                        "SYMBOLIC": t('representation.symbolic')
                    };

                    let selectColor = (index) => {
                        switch (index) {
                            case 0:
                                return "rgba(255, 99, 132, 0.8)";
                            case 1:
                                return "rgba(54, 162, 235, 0.8)";
                            case 2:
                                return "rgba(75, 192, 192, 0.8)";
                            case 3:
                                return "rgba(255, 193, 7, 0.8)";
                            default:
                                return "rgba(153, 102, 255, 0.8)";
                        }
                    };

                    // Procesar datos para FREE
                    const datasetsFree = networkTypeOrder.map((networkType, index) => {
                        return {
                            label: networkType, data: representations.map(rep => {
                                return groupedData[networkType]?.representationCounts?.free?.[rep] || 0;
                            }), backgroundColor: selectColor(index), barPercentage: 1, datalabels: {
                                textAlign: "center", display: true, color: "#000", formatter: (value) => {
                                    const totalForRep = representations.reduce((sum, rep) => {
                                        return sum + (groupedData[networkType]?.representationCounts?.free?.[rep] || 0);
                                    }, 0);
                                    const percentage = totalForRep > 0 ? ((value / totalForRep) * 100).toFixed(2) + "%" : "";
                                    return `${value}\n(${percentage})`;
                                }
                            }
                        };
                    });

                    // Procesar datos para RULED
                    const datasetsRuled = networkTypeOrder.map((networkType, index) => {
                        return {
                            label: networkType, data: representations.map(rep => {
                                return groupedData[networkType]?.representationCounts?.ruled?.[rep] || 0;
                            }), backgroundColor: selectColor(index), barPercentage: 1, datalabels: {
                                textAlign: "center", display: true, color: "#000", formatter: (value) => {
                                    const totalForRep = representations.reduce((sum, rep) => {
                                        return sum + (groupedData[networkType]?.representationCounts?.ruled?.[rep] || 0);
                                    }, 0);
                                    const percentage = totalForRep > 0 ? ((value / totalForRep) * 100).toFixed(2) + "%" : "";
                                    return `${value}\n(${percentage})`;
                                }
                            }
                        };
                    });

                    setChartDataFree({"labels": representations.map(rep => representationLabels[rep]), datasets: datasetsFree});
                    setChartDataRuled({
                        "labels": representations.map(rep => representationLabels[rep]),
                        datasets: datasetsRuled
                    });

                    // Calcular totales
                    const totalFreeCount = networkTypeOrder.reduce((sum, nt) => {
                        return sum + representations.reduce((subSum, rep) => {
                            return subSum + (groupedData[nt]?.representationCounts?.free?.[rep] || 0);
                        }, 0);
                    }, 0);

                    const totalRuledCount = networkTypeOrder.reduce((sum, nt) => {
                        return sum + representations.reduce((subSum, rep) => {
                            return subSum + (groupedData[nt]?.representationCounts?.ruled?.[rep] || 0);
                        }, 0);
                    }, 0);

                    setTotalFree(totalFreeCount);
                    setTotalRuled(totalRuledCount);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [classroomId, t]);

    let {Title} = Typography;
    return (
        <div>
            <div style={{width: "100%", marginLeft: "auto", marginRight: "auto", marginTop: "2vh"}}>
                <TeacherBreadcrumb/>
            </div>
            <Card style={{width: "95vw", marginLeft: "auto", marginRight: "auto", marginTop: "2vh", marginBottom: "2vh"}} title={<Title>{classroomName}</Title>}>
                <h2>{t("studentStats.numberOfExercises")}: {totalFree + totalRuled}</h2>
                <Row gutter={[40, 24]} style={{marginTop: "2rem"}}>
                    <Col xs={24} lg={12}>
                        <div style={{
                            backgroundColor: "#fafafa",
                            padding: "1.5rem",
                            borderRadius: "8px",
                            height: "100%"
                        }}>
                            <h3 style={{
                                textAlign: "center",
                                marginBottom: "1rem",
                                fontSize: "1.1em"
                            }}>{t("classroomStats.free.number")}: {totalFree}</h3>
                            <div style={{height: "550px", position: "relative", width: "100%"}}>
                                {chartDataFree && chartDataFree.labels && (
                                    <Bar
                                        data={chartDataFree}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: "top"
                                                },
                                                title: {
                                                    display: true,
                                                    text: t("classroomStats.free.title"),
                                                    font: {size: 14}
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true
                                                }
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </Col>
                    <Col xs={24} lg={12}>
                        <div style={{
                            backgroundColor: "#fafafa",
                            padding: "1.5rem",
                            borderRadius: "8px",
                            height: "100%"
                        }}>
                            <h3 style={{
                                textAlign: "center",
                                marginBottom: "1rem",
                                fontSize: "1.1em"
                            }}>{t("classroomStats.ruled.number")}: {totalRuled}</h3>
                            <div style={{height: "550px", position: "relative", width: "100%"}}>
                                {chartDataRuled && chartDataRuled.labels && (
                                    <Bar
                                        data={chartDataRuled}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: "top"
                                                },
                                                title: {
                                                    display: true,
                                                    text: t("classroomStats.ruled.title"),
                                                    font: {size: 14}
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true
                                                }
                                            }
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default ClassroomStatistics;