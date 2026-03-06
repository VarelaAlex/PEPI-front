import { Card, Typography }                                                                 from "antd";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import ChartDataLabels                                                                      from "chartjs-plugin-datalabels";
import React, { useEffect, useState }                                                       from "react";
import { Bar }                                                                              from "react-chartjs-2";
import { useTranslation }                                                                   from "react-i18next";
import { useParams }                                                                        from "react-router-dom";
import TeacherBreadcrumb from "./BreadcrumbComponent";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

let ClassroomStatistics = ({ classroomId }) => {
	let { classroomName } = useParams();
	const [chartData, setChartData] = useState({});
	const [total, setTotal] = useState(0);
	let { t } = useTranslation();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`${ process.env.REACT_APP_EXERCISES_SERVICE_URL }/statistics/classroom/${ classroomId }`);
				const data = await response.json();

				if ( data && data.groupedData ) {
					setTotal(data.totalFeedbacks);
					const groupedData = data.groupedData;

					const networkTypeOrder = ["I-I", "I-II", "I-III"];
					const labels = ["ICONIC", "MIXED", "SYMBOLIC"];

					let selectColor = (index) => {
						switch ( index ) {
							case 0:
								return "rgba(255, 99, 132, 1)";
							case 1:
								return "rgba(54, 162, 235, 1)";
							case 2:
								return "rgba(75, 192, 192, 1)";
							default:
								return "rgba(255, 206, 86, 1)";
						}
					};

					// Transform groupedData into chartData
					const datasets = networkTypeOrder.map((networkType, index) => {
						return {
							label:           networkType,
							data:            labels.map(rep => groupedData[ networkType ].representationCounts[ rep ] || 0),
							backgroundColor: selectColor(index),
							barPercentage:   1,
							datalabels:      {
								textAlign: "center", display: true, color: "#fff", formatter: (value) => {
									const totalForRep = labels.reduce((sum, rep) => sum + groupedData[ networkType ].representationCounts[ rep ] || 0, 0);
									const percentage = totalForRep > 0 ? (
										                                     (
											                                     value / totalForRep
										                                     ) * 100
									                                     ).toFixed(2) + "%" : "";
									return `${ value }\n(${ percentage })`;
								}
							}
						};
					});

					setChartData({ "labels": [t("iconic").toUpperCase(), t("mixed").toUpperCase(), t("symbolic").toUpperCase()], datasets });
				}
			}
			catch ( error ) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, [classroomId, t]);

	let { Title } = Typography;
	return (
		<div>
			<div style={{ width: "80%", marginLeft: "auto", marginRight: "auto", marginTop: "2vh" }}>
				<TeacherBreadcrumb />
			</div>
			<Card style={ { width: "80%" } } title={ <Title>{ classroomName }</Title> }>
			<h2>Total: { total }</h2>
			<div>
				{ chartData && chartData.labels && (
					<Bar
						data={ chartData }
						options={ {
							responsive: true, plugins: {
								legend:   {
									position: "top"
								}, title: {
									display: true, text: t("classroomStats.title")
								}
							}, scales:  {
								y: {
									beginAtZero: true
								}
							}
						} }
					/>
				) }
			</div>
		</Card>
		</div>
	);
};

export default ClassroomStatistics;