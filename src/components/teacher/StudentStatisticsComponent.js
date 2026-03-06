import React, {useEffect, useState} from 'react';
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useTranslation } from "react-i18next"; // Import the plugin
import {useParams} from 'react-router-dom';
import {Card, Divider, Typography} from 'antd';
import TeacherBreadcrumb from './BreadcrumbComponent';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);
let StudentStatistics = ({studentName}) => {
    let {studentId} = useParams();
    const [iconicData, setIconicData] = useState({});
    const [mixedData, setMixedData] = useState({});
    const [symbolicData, setSymbolicData] = useState({});
    let [totalFeedbacks, setTotalFeedbacks] = useState(0);
    let [iconicErrorsTotal, setIconicErrorsTotal] = useState(0);
    let [mixedErrorsTotal, setMixedErrorsTotal] = useState(0);
    let [symbolicErrorsTotal, setSymbolicErrorsTotal] = useState(0);
    let {t} = useTranslation();

    useEffect(() => {
        const labels = ['Lexical', 'Syntactic', 'Semantic'];

        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_EXERCISES_SERVICE_URL}/statistics/student/${studentId}`);
                const data = await response.json();
                if (data) {
                    const {
                        iconicErrors,
                        mixedErrors,
                        symbolicErrors,
                        percentageLexicalIconic,
                        percentageSyntacticIconic,
                        percentageSemanticIconic,
                        percentageLexicalMixed,
                        percentageSyntacticMixed,
                        percentageSemanticMixed,
                        totalFeedbacks,
                        iconicErrorsTotal,
                        mixedErrorsTotal,
                        symbolicErrorsTotal
                    } = data;
                    setTotalFeedbacks(totalFeedbacks);
                    setIconicErrorsTotal(iconicErrorsTotal);
                    setMixedErrorsTotal(mixedErrorsTotal);
                    setSymbolicErrorsTotal(symbolicErrorsTotal);
                    // Prepare datasets for ICONIC and MIXED errors
                    const iconicDatasets = [
                        {
                            label: t("studentStats.incorrectOrder"),
                            data: [
                                iconicErrors.Lexical.incorrectOrder.count,
                                iconicErrors.Syntactic.incorrectOrder.count,
                                iconicErrors.Semantic.incorrectOrder.count
                            ],
                            barPercentage: 1,
                            backgroundColor: 'rgba(255, 99, 132, 1)',
                            datalabels: {
                                display: true,
                                formatter: (value, context) => {
                                    const errorType = labels[context.dataIndex];
                                    return `${value}\n(${iconicErrors[errorType].incorrectOrder.percentage}%)`;
                                },
                                color: '#fff',

                            }
                        },
                        {
                            label: t("studentStats.incorrectPos"),
                            data: [
                                iconicErrors.Lexical.incorrectPos.count,
                                iconicErrors.Syntactic.incorrectPos.count,
                                iconicErrors.Semantic.incorrectPos.count
                            ],
                            barPercentage: 1,
                            backgroundColor: 'rgba(54, 162, 235, 1)',
                            datalabels: {
                                display: true,
                                formatter: (value, context) => {
                                    const errorType = labels[context.dataIndex];
                                    return `${value}\n(${iconicErrors[errorType].incorrectPos.percentage}%)`;
                                },
                                color: '#fff',

                            }
                        },
                        {
                            label: t("studentStats.outOfBounds"),
                            data: [
                                iconicErrors.Lexical.outOfBounds.count,
                                iconicErrors.Syntactic.outOfBounds.count,
                                iconicErrors.Semantic.outOfBounds.count
                            ],
                            barPercentage: 1,
                            backgroundColor: 'rgba(75, 192, 192, 1)',
                            datalabels: {
                                display: true,
                                formatter: (value, context) => {
                                    const errorType = labels[context.dataIndex];
                                    return `${value}\n(${iconicErrors[errorType].outOfBounds.percentage}%)`;
                                },
                                color: '#fff',

                            }
                        }
                    ];

                    const mixedDatasets = [
                        {
                            label: t("studentStats.incorrectOrder"),
                            data: [
                                mixedErrors.Lexical.incorrectOrder.count,
                                mixedErrors.Syntactic.incorrectOrder.count,
                                mixedErrors.Semantic.incorrectOrder.count
                            ],
                            barPercentage: 1,
                            backgroundColor: 'rgba(255, 99, 132, 1)',
                            datalabels: {
                                display: true,
                                formatter: (value, context) => {
                                    const errorType = labels[context.dataIndex];
                                    return `${value}\n(${mixedErrors[errorType].incorrectOrder.percentage}%)`;
                                },
                                color: '#fff',

                            }
                        },
                        {
                            label: t("studentStats.incorrectPos"),
                            data: [
                                mixedErrors.Lexical.incorrectPos.count,
                                mixedErrors.Syntactic.incorrectPos.count,
                                mixedErrors.Semantic.incorrectPos.count
                            ],
                            barPercentage: 1,
                            backgroundColor: 'rgba(54, 162, 235, 1)',
                            datalabels: {
                                display: true,
                                formatter: (value, context) => {
                                    const errorType = labels[context.dataIndex];
                                    return `${value}\n(${mixedErrors[errorType].incorrectPos.percentage}%)`;
                                },
                                color: '#fff',

                            }
                        },
                        {
                            label: t("studentStats.outOfBounds"),
                            data: [
                                mixedErrors.Lexical.outOfBounds.count,
                                mixedErrors.Syntactic.outOfBounds.count,
                                mixedErrors.Semantic.outOfBounds.count
                            ],
                            barPercentage: 1,
                            backgroundColor: 'rgba(75, 192, 192, 1)',
                            datalabels: {
                                display: true,
                                formatter: (value, context) => {
                                    const errorType = labels[context.dataIndex];
                                    return `${value}\n(${mixedErrors[errorType].outOfBounds.percentage}%)`;
                                },
                                color: '#fff',

                            }
                        }
                    ];

                    setIconicData({
                        labels: [`${t("lexical")} (${percentageLexicalIconic}%)`, `${t("syntactic")} (${percentageSyntacticIconic}%)`, `${t("semantic")} (${percentageSemanticIconic}%)`],
                        datasets: iconicDatasets,
                    });

                    setMixedData({
                        labels: [`${t("lexical")} (${percentageLexicalMixed}%)`, `${t("syntactic")} (${percentageSyntacticMixed}%)`, `${t("semantic")} (${percentageSemanticMixed}%)`],
                        datasets: mixedDatasets,
                    });

                    // Prepare data for SYMBOLIC errors
                    setSymbolicData({
                        labels: [t("lexical"), t("syntactic"), t("semantic")],
                        datasets: [
                            {
                                data: [
                                    symbolicErrors.Lexical.count,
                                    symbolicErrors.Syntactic.count,
                                    symbolicErrors.Semantic.count
                                ],
                                barPercentage: 1,
                                backgroundColor: 'rgb(54, 162, 235, 1)',
                                datalabels: {
                                    display: true,
                                    formatter: (value, context) => {
                                        const errorType = labels[context.dataIndex];
                                        return `${value} (${symbolicErrors[errorType].percentage}%)`;
                                    },
                                    color: '#fff',
                                }
                            }
                        ],
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [studentId, t]);
    let {Title} = Typography;
    return (
        <div>
            <div style={{ width: "80%", marginLeft: "auto", marginRight: "auto", marginTop: "2vh" }}>
                <TeacherBreadcrumb />
            </div>
            <Card style={{width: "80%", marginTop: "10px"}} title={<Title>{studentName}</Title>}>
            <h2>{t("studentStats.numberOfExercises")}: {totalFeedbacks}</h2>
            <h3>{t("studentStats.titleIconic")}</h3>
            <div>
                <h4>Total: {iconicErrorsTotal}</h4>
                {iconicData && iconicData.labels && (
                    <Bar
                        data={iconicData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: t("studentStats.errorsByCategoryAndTypeIconic"),
                                },
                                datalabels: {
                                    textAlign: "center",
                                    display: true,
                                },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                )}
            </div>
            <Divider/>
            <h3>{t("studentStats.titleMixed")}</h3>
            <div>
                <h4>Total: {mixedErrorsTotal}</h4>
                {mixedData && mixedData.labels && (
                    <Bar
                        data={mixedData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: t("studentStats.errorsByCategoryAndTypeMixed"),
                                },
                                datalabels: {
                                    textAlign: "center",
                                    display: true,
                                },
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                )}
            </div>
            <Divider/>
            <div style={{marginTop: '50px'}}>
                <h3>{t("studentStats.titleSymbolic")}</h3>
                <h4>Total: {symbolicErrorsTotal}</h4>
                {symbolicData && symbolicData.labels && (
                    <Bar
                        data={symbolicData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                title: {
                                    display: true,
                                    text: t("studentStats.errorsByCategorySymbolic"),
                                },
                                datalabels: {
                                    textAlign: "center",
                                    display: true,
                                },
                            },
                            scales: {
                                x: {
                                    beginAtZero: true,
                                },
                                y: {
                                    beginAtZero: true,
                                },
                            },
                        }}
                    />
                )}
            </div>
        </Card>
        </div>
    );
};
export default StudentStatistics;