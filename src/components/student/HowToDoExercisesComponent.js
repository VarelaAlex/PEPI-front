import { Card, Col, Divider, Image, Row, Typography, Modal } from "antd";
import React, { useState }                            from "react";
import { useTranslation } from "react-i18next";

const { Title } = Typography;
const { Meta } = Card;

const HowToDoExercises = () => {
	const { t } = useTranslation();
	const [selectedVideo, setSelectedVideo] = useState(null);

	const videos = [
		{
			id:          1,
			title:       t("howToDoExercises.videos.iconic.title"),
			thumbnail:   "/representations/iconicColor.png",
			videoSrc:    "/exerciseExamples/ExampleIconic.mp4",
			description: t("howToDoExercises.videos.iconic.description")
		}, {
			id:          2,
			title:       t("howToDoExercises.videos.mixed.title"),
			thumbnail:   "/representations/mixedColor.png",
			videoSrc:    "/exerciseExamples/ExampleMixed.mp4",
			description: t("howToDoExercises.videos.mixed.description")
		}, {
			id:          3,
			title:       t("howToDoExercises.videos.global.title"),
			thumbnail:   "/representations/globalColor.png",
			videoSrc:    "/exerciseExamples/ExampleGlobal.mp4",
			description: t("howToDoExercises.videos.global.description")
		}, {
			id:          4,
			title:       t("howToDoExercises.videos.symbolic.title"),
			thumbnail:   "/representations/symbolicColor.png",
			videoSrc:    "/exerciseExamples/ExampleSymbolic.mp4",
			description: t("howToDoExercises.videos.symbolic.description")
		}
	];

	const handleVideoClick = (videoId) => {
		setSelectedVideo(videoId);
	};

	const handleCloseModal = () => {
		setSelectedVideo(null);
	};

	const selectedVideoData = selectedVideo ? videos.find((video) => video.id === selectedVideo) : null;

	return (
		<div style={ { width: "70vw", padding: "1vw", overflow: "hidden" } }>
			<Title level={ 2 } style={ { textAlign: "center", marginBottom: "2rem" } }>
				{t("howToDoExercises.title")}
			</Title>
			<Row gutter={[16, 16]} justify="center">
				{ videos.map(video => (
					<Col key={ video.id } xs={ 24 } sm={ 12 } md={ 12 }>
						<Card onClick={() => handleVideoClick(video.id)} style={{ cursor: "pointer" }}>
							<Title level={3} style={{ textAlign: "center", marginBottom: "2rem" }}>
								{video.title}
							</Title>
							<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
								<Image
									width="30%"
									preview={false}
									alt={video.title}
									src={video.thumbnail}
									style={{ borderRadius: "8px" }}
								/>
							</div>
							<Divider />
							<Meta description={video.description} />
						</Card>

					</Col>
				)) }
			</Row>
			<Modal
				title={selectedVideoData?.title}
				open={selectedVideo !== null}
				onCancel={handleCloseModal}
				footer={null}
				width="90%"
				style={{ maxWidth: "1000px" }}
			>
				{selectedVideoData && (
					<div style={{ textAlign: "center" }}>
						<video
							src={selectedVideoData.videoSrc}
							controls
							muted
							style={{
								width: "100%",
								maxHeight: "600px",
								borderRadius: "8px",
								border: "1px solid #f0f0f0"
							}}
						/>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default HowToDoExercises;
