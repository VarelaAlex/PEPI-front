import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, matchPath, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Layout, notification, Flex, Image, Spin, Typography } from "antd";
import Header from './components/layout/HeaderComponent';
import Sider from "./components/layout/SiderComponent";
import { UserOutlined, InfoCircleOutlined, LogoutOutlined, FormOutlined, ExperimentOutlined, DollarOutlined, FullscreenOutlined } from "@ant-design/icons";
import ClassroomOutlined from './components/icons/ClassroomOutlined';
import { useSession } from './components/SessionComponent';
import { jwtDecode } from 'jwt-decode';
import useFullscreen from "./hooks/useFullscreen";
import AudioPermissionModal from "./components/AudioPermissionModalComponent";
import { useAvatar } from "./components/AvatarContext";
import AvatarNavigationListener from "./components/AvatarNavigationListener";
import InteractionBlocker from "./components/InteractionBlockerComponent";
import TeacherHelpButton from "./components/TeacherHelpButtonComponent";
import { usePullToRefreshBlocker } from "./hooks/usePullToRefreshBlocker";
import { endSession, finishSubsceneTracking, isTrackingActive } from "./tracker";

const SelectRole = lazy(() => import('./components/SelectRoleComponent'));
const HowToDoExercises = lazy(() => import("./components/student/HowToDoExercisesComponent"));
const PhrasesActivity = lazy(() => import("./components/student/PhrasesActivityComponent"));
const PictogramActivity = lazy(() => import("./components/student/PictogramActivityComponent"));
const CreateStudent = lazy(() => import("./components/teacher/CreateStudentComponent"));
const LoginTeacher = lazy(() => import('./components/teacher/LoginTeacherComponent'));
const SignupTeacher = lazy(() => import('./components/teacher/SignupTeacherComponent'));
const ClassroomsList = lazy(() => import('./components/teacher/ClassroomsListComponent'));
const ExercisesList = lazy(() => import('./components/teacher/ExercisesListComponent'));
const CreateExercise = lazy(() => import('./components/teacher/CreateExerciseComponent'));
const LoginStudent = lazy(() => import('./components/student/LoginStudentComponent'));
const DnDPhase1 = lazy(() => import('./components/student/DnDPhase1Component'));
const DnDPhase2 = lazy(() => import('./components/student/DnDPhase2Component'));
const TypePhase1 = lazy(() => import('./components/student/TypePhase1Component'));
const TypePhase2 = lazy(() => import('./components/student/TypePhase2Component'));
const ExercisesCarousel = lazy(() => import('./components/student/ExercisesCarouselComponent'));
const NotFound = lazy(() => import('./components/NotFoundComponent'));
const ClassroomDetail = lazy(() => import('./components/teacher/ClassroomDetailComponent'));
const StudentDetail = lazy(() => import('./components/teacher/StudentDetailComponent'));
const BlankPage = lazy(() => import('./components/BlankPageComponent'));
const Profile = lazy(() => import('./components/teacher/ProfileComponent'));
const ClassroomStatistics = lazy(() => import('./components/teacher/ClassroomStatisticsComponent'));
const StudentStatistics = lazy(() => import('./components/teacher/StudentStatisticsComponent'));
const AboutEPI = lazy(() => import('./components/teacher/AboutPEPIComponent'));
const SurveyA = lazy(() => import("./components/teacher/SurveyAComponent"));
const SurveyB = lazy(() => import("./components/teacher/SurveyBComponent"));
const SelectMode = lazy(() => import("./components/student/SelectModeComponent"));
const SentenceNetwork = lazy(() => import("./components/student/SentenceNetworkComponent"));
const SentenceNetworkSequential = lazy(() => import("./components/student/SentenceNetworkSequentialComponent"));
const SelectPhase = lazy(() => import("./components/student/SelectPhaseComponent"));
const Funding = lazy(() => import("./components/FundingComponent"));
const SelectTrainingMode = lazy(() => import("./components/student/SelectTrainingModeComponent"));
const ClosedExercisesSelector = lazy(() => import("./components/student/ClosedExercisesSelectorComponent"));
const EditExercise = lazy(() => import("./components/teacher/EditExerciseComponent"));

let App = () => {

	let { login, setLogin, setFeedback, setExercise } = useSession();
	let { hideAvatar, disableVoice } = useAvatar();
	let { exitFullscreen, enterFullscreen } = useFullscreen();
	usePullToRefreshBlocker();

	const MOBILE_BREAKPOINT = 430;

	let [open, setOpen] = useState(false);
	let [api, contextHolder] = notification.useNotification();
	let [isMobile, setIsMobile] = useState(false);
	let [studentName, setStudentName] = useState();

	let { t } = useTranslation();
	let navigate = useNavigate();
	let location = useLocation();
	const { isBusy } = useAvatar();
	let { Content, Footer } = Layout;

	let disconnect = useCallback(async () => {
		logout();
		const tracking = isTrackingActive();
		if (tracking) await finishSubsceneTracking();
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("name");
		localStorage.removeItem("role");
		localStorage.removeItem("user");
		localStorage.removeItem("greeted-main");
		localStorage.removeItem("greeted-pretraining");
		localStorage.removeItem("greeted-training");
		localStorage.removeItem("greeted-open");
		localStorage.removeItem("greeted-closed");
		setLogin(false);
		setFeedback({});
		setExercise({});
		hideAvatar();
		disableVoice();
		exitFullscreen();
		if (tracking) endSession("/selectRole");
	}, [setExercise, setFeedback, setLogin]);

	let logout = async () => {
		let refreshToken = localStorage.getItem("refreshToken");

		try {
			await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/logout",
				{
					method: "POST",
					body: JSON.stringify({ token: refreshToken }),
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("accessToken")}`
					}
				}
			);
		} catch (e) {
		}
	};

	let getTokenExpiration = (token) => {
		if (!token) return null;
		try {
			const decodedToken = jwtDecode(token);
			return typeof decodedToken.exp === "number" ? decodedToken.exp * 1000 : null;
		} catch (error) {
			console.error('Error decoding token:', error);
			return null;
		}
	};

	let isTokenExpired = (token) => {
		const expiration = getTokenExpiration(token);
		return expiration === null || expiration <= Date.now();
	};

	const drawerFooter = [
		{
			key: "team",
			label: <Link to="/funding" onClick={() => setOpen(false)}>{t("sider.funding")}</Link>,
			danger: false,
			icon: <DollarOutlined />
		},
		{
			key: "menuDisconnect",
			label: <Link to="/selectRole" onClick={async (e) => {
				if (isTrackingActive()) e.preventDefault();
				await disconnect();
			}}>
				{t("sider.disconnect")}
			</Link>,
			danger: true,
			icon: <LogoutOutlined />
		}
	];

	const anonymousMenuFooter = [
		{
			key: "team",
			label: <Link to="/funding" onClick={() => setOpen(false)}>{t("sider.funding")}</Link>,
			danger: false,
			icon: <DollarOutlined />
		}
	];

	let anonymousMenuItems = [
		{
			key: "selectRole",
			label: <Link to="/selectRole" onClick={() => setOpen(false)}>{t("sider.selectRole")}</Link>,
			danger: false,
			icon: <UserOutlined />
		},
		{
			key: "about",
			label: <Link to="/aboutEPI" onClick={() => setOpen(false)}>{t("sider.about")}</Link>,
			danger: false,
			icon: <InfoCircleOutlined />
		}
	];

	let teacherMenuItems = [
		{
			key: "classrooms",
			label: <Link to="/teachers/menuTeacher" onClick={() => setOpen(false)}>{t("sider.teacher.classrooms")}</Link>,
			danger: false,
			icon: <ClassroomOutlined />
		},
		{
			key: "exercises",
			label: <Link to="/teachers/manageExercises" onClick={() => setOpen(false)}>{t("sider.teacher.exercises")}</Link>,
			danger: false,
			icon: <FormOutlined />
		},
		{
			key: "about",
			label: <Link to="/teachers/aboutEPI" onClick={() => setOpen(false)}>
				<Trans
					i18nKey="sider.teacher.about"
					components={{
						italic: <i />
					}}
				/></Link>,
			danger: false,
			icon: <InfoCircleOutlined />
		},
		{
			key: "profile",
			label: <Link to="/teachers/profile" onClick={() => setOpen(false)}>{t("sider.teacher.profile")}</Link>,
			danger: false,
			icon: <UserOutlined />
		},
	];

	let studentMenuItems = [
		{
			key: "preparation",
			label: <Link to="/students/pretraining" onClick={() => setOpen(false)}>{t("sider.student.preparation")}</Link>,
			danger: false,
			icon: <ExperimentOutlined />
		},
		{
			key: "training",
			label: <Link to="/students/trainingMode" onClick={() => setOpen(false)}>{t("sider.student.training")}</Link>,
			danger: false,
			icon: <FormOutlined />
		},
		{
			key: "howto",
			label: <Link to="/students/howTo" onClick={() => setOpen(false)}>{t("sider.student.howto")}</Link>,
			danger: false,
			icon: <InfoCircleOutlined />
		},
		{
			key: "about",
			label: <Link to="/aboutEPI" onClick={() => setOpen(false)}>{t("sider.about")}</Link>,
			danger: false,
			icon: <InfoCircleOutlined />
		},
		{
			key: "fullscreen",
			label: t("sider.fullscreen"),
			onClick: enterFullscreen,
			danger: false,
			icon: <FullscreenOutlined />
		}
	];

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {

		let refresh = async () => {

			let refreshToken = localStorage.getItem("refreshToken");

			if (refreshToken) {
				if (isTokenExpired(refreshToken)) {
					disconnect();
					navigate('/selectRole');
					return false;
				}

				let response;
				try {
					response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/token",
						{
							method: "POST",
							body: JSON.stringify({ refreshToken }),
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${localStorage.getItem("accessToken")}`
							}
						}
					);
						if (localStorage.getItem("refreshToken") !== refreshToken) {
							return false;
						}
						if (response.status === 401 || response.status === 403) {
							disconnect();
						navigate('/selectRole');
						return false;
					}
					if (!response.ok) {
						throw new Error(`Token refresh failed with status ${response.status}`);
					}
					const accessToken = await response.json();
					if (localStorage.getItem("refreshToken") !== refreshToken) {
						return false;
					}
					if (typeof accessToken !== "string" || !accessToken) {
						throw new Error("Token refresh returned an invalid access token");
					}
					return accessToken;
				} catch (e) {
					console.error("Error refreshing access token; retrying:", e);
					return null;
				}
			}
		};

		let refreshTimeout;
		let retryCount = 0;
		const scheduleRefresh = (delay) => {
			clearTimeout(refreshTimeout);
			refreshTimeout = setTimeout(refreshIfNeeded, delay);
		};
		const refreshIfNeeded = async () => {
			if (!localStorage.getItem("refreshToken")) return;

			const expiration = getTokenExpiration(localStorage.getItem("accessToken"));
			const delay = expiration === null
				? 0
				: expiration - Date.now() - 60 * 1000;
			if (delay > 0) {
				scheduleRefresh(delay);
				return;
			}

			const accessToken = await refresh();
			if (accessToken === false) return;
			if (accessToken) {
				localStorage.setItem("accessToken", accessToken);
				retryCount = 0;
				const newExpiration = getTokenExpiration(accessToken);
				scheduleRefresh(newExpiration === null
					? 0
					: Math.max(newExpiration - Date.now() - 60 * 1000, 0));
				return;
			}

			retryCount += 1;
			scheduleRefresh(Math.min(1000 * 2 ** (retryCount - 1), 30 * 1000));
		};

		refreshIfNeeded();
		return () => clearTimeout(refreshTimeout);
	}, [disconnect, navigate]);

	useEffect(() => {

		let checkLogin = async () => {

			let accessToken = localStorage.getItem("accessToken");

			if (accessToken) {
				if (isTokenExpired(accessToken)) {
					disconnect();
					navigate('/selectRole');
				}

				let response = null;
				let role = localStorage.getItem("role");
				if (role === "T") {
					response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/teachers/checkLogin",
						{
							method: "GET",
							headers: {
								Authorization: `Bearer ${accessToken}`
							}
						}
					);
				}

				if (role === "S") {
					response = await fetch(process.env.REACT_APP_USERS_SERVICE_URL + "/students/checkLogin", {
						method: "GET",
						headers: {
							Authorization: `Bearer ${accessToken}`
						}
					});
				}

				if (response?.status === 200) {
					setLogin(true);

					if (role === "T") {

						const isAllowedPath = matchPath("/teachers/:path/*", location.pathname) || location.pathname.startsWith("/funding") || location.pathname.startsWith("/aboutEPI");

						if (!isAllowedPath) {
							navigate("/teachers/menuTeacher");
						}
					}

					if (role === "S") {

						const isAllowedPath = matchPath("/students/:path/*", location.pathname) || location.pathname.startsWith("/exercise") || location.pathname.startsWith("/funding") || location.pathname.startsWith("/aboutEPI");

						if (!isAllowedPath) {
							navigate("/students/selectMode");
						}
					}
				} else {
					disconnect();
					navigate("/selectRole");
				}
			} else {
				if (!["/loginTeacher", "/loginStudent", "/registerTeacher", "/selectRole", "/funding", "/aboutEPI"].includes(location.pathname)) {
					disconnect();
					navigate("/selectRole");
				}
			}
		};

		checkLogin();
	}, [location.pathname, navigate, setLogin, disconnect]);

	useEffect(() => {
		if (!localStorage.getItem("pwaNotificationShown")) {
			api.info({
				message: t("pwa.notificationMessage"),
				description: t("pwa.notificationDescription"),
				duration: "4"
			});
			localStorage.setItem("pwaNotificationShown", true);
		}
	}, [api, t]);

	let { Text } = Typography;

	const hideHeaderFooterRoutes = [
		"/exerciseDnD",
		"/exerciseType",
		"/students"
	];

	const shouldHideHeaderFooter = hideHeaderFooterRoutes.some(route =>
		location.pathname.startsWith(route)
	);

	const noiseSvg = `
		<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
			<filter id='n' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>
				<feTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='2' seed='3' stitchTiles='stitch'/>
				<feColorMatrix values='0.16 0 0 0 0.79
										0.16 0 0 0 0.8298
										0.08 0 0 0 0.9522
										0    0 0 0 1'/>
			</filter>
			<rect width='100%' height='100%' filter='url(#n)'/>
		</svg>`;

	const paperBg = {
		backgroundColor: "#d2dfff",
		backgroundImage: [
			"linear-gradient(135deg, rgba(255,255,255,0.04), rgba(0,0,0,0.01))",
			`url("data:image/svg+xml,${encodeURIComponent(noiseSvg)}")`,
		].join(", "),
		backgroundSize: "100% 100%, 400px 400px",
	};

	return (
		<>
			{contextHolder}
			<AudioPermissionModal />
			<AvatarNavigationListener />
			<InteractionBlocker active={isBusy} />
			<Layout style={{ height: "100vh" }}>
				{<Header
					login={login}
					open={open}
					setOpen={setOpen}
					isMobile={isMobile}
				/>}
				<Layout hasSider>
					{login ?
						<Sider
							login={login}
							setLogin={setLogin}
							open={open}
							setOpen={setOpen}
							menu={localStorage.getItem("role") === "T" ? teacherMenuItems : studentMenuItems}
							drawerFooter={drawerFooter}
						/>
						:
						<Sider
							login={login}
							setLogin={setLogin}
							open={open}
							setOpen={setOpen}
							menu={anonymousMenuItems}
							drawerFooter={anonymousMenuFooter}
						/>
					}
					<Content style={{ overflowY: "auto", ...paperBg }}>
						<Flex align="center" justify="center" style={{ minHeight: "100%" }}>
							<Suspense fallback={<Flex align="center" justify="center" style={{ minHeight: "50vh", width: "100%" }}><Spin size="large" /></Flex>}>
							<Routes>
								<Route path="/selectRole" element={<SelectRole />} />
								<Route path="/loginStudent" element={<LoginStudent />} />
								<Route path="/funding" element={<Funding />} />
								<Route path="/aboutEPI" element={<AboutEPI />} />
								<Route path="/exerciseDnD/phase1/:trainingMode" element={<DnDPhase1 />} />
								<Route path="/exerciseDnD/phase2/:trainingMode" element={<DnDPhase2 />} />
								<Route path="/exerciseType/phase1/:trainingMode" element={<TypePhase1 />} />
								<Route path="/exerciseType/phase2/:trainingMode" element={<TypePhase2 />} />
								<Route path="/students/exercises/free" element={<ExercisesCarousel />} />
								<Route path="/students/exercises/ruled" element={<ClosedExercisesSelector />} />
								<Route path="/students/trainingMode" element={<SelectTrainingMode />} />
								<Route path="/students/selectMode" element={<SelectMode />} />
								<Route path="/students/pretraining/block/1/activity/:activity" element={<PictogramActivity key={location.pathname} />} />
								<Route path="/students/pretraining/block/2/activity/:activity" element={<PhrasesActivity key={location.pathname} />} />
								<Route path="/students/pretraining/block/3/activity/1" element={<SentenceNetwork />} />
								<Route path="/students/pretraining/block/3/activity/2" element={<SentenceNetworkSequential />} />
								<Route path="/students/pretraining/" element={<SelectPhase />} />
								<Route path="/students/howTo" element={<HowToDoExercises />} />
								<Route path="/loginTeacher" element={<LoginTeacher />} />
								<Route path="/registerTeacher" element={<SignupTeacher />} />
								<Route path="/teachers/menuTeacher" element={<ClassroomsList isMobile={isMobile} />} />
								<Route path="/teachers/classrooms/:classroomName" element={<ClassroomDetail isMobile={isMobile} setStudentName={setStudentName} />} />
								<Route path="/teachers/:classroomName/students/:studentId" element={<StudentDetail />} />
								<Route path="/teachers/classrooms/:classroomName/students" element={<CreateStudent />} />
								<Route path="/teachers/manageExercises" element={<ExercisesList />} />
								<Route path="/teachers/create" element={<CreateExercise isMobile={isMobile} />} />
								<Route path="/teachers/exercise/:exerciseId/edit" element={<EditExercise />} />
								<Route path='/teachers/profile' element={<Profile />} />
								<Route path='/teachers/classroomStats/:classroomName' element={<ClassroomStatistics />} />
								<Route path='/teachers/studentStats/:studentId' element={<StudentStatistics studentName={studentName} />} />
								<Route path='/teachers/:classroomName/students/:studentId/surveys/A' element={<SurveyA />} />
								<Route path='/teachers/:classroomName/students/:studentId/surveys/B' element={<SurveyB />} />
								<Route path='/teachers/aboutEPI' element={<AboutEPI />} />
								<Route path='/' element={<BlankPage />} />
								<Route path="*" element={<NotFound />} />
							</Routes>
							</Suspense>
						</Flex>
					</Content>
				</Layout>
				{!shouldHideHeaderFooter && <Footer style={{ backgroundColor: "#001628", color: "white", padding: 10 }}>
					<Flex align="center" justify="center" style={{ minHeight: "100%" }}>
						<Text style={{ color: "white" }}>{t("footer.about", { heart: "\u2665" })} <Typography.Link
							href="https://github.com/VarelaAlex" style={{ color: "white" }}
							underline>Álex</Typography.Link> & <Typography.Link href="https://grupoadir.es/"
								style={{ color: "white" }}
								underline>ADIR</Typography.Link> · {t("footer.based")} <Typography.Link href="https://www.unioviedo.es/hyper/" style={{ color: "white" }}
									underline>Hyper</Typography.Link></Text>
						<Link to="https://creativecommons.org/licenses/by-nc-sa/4.0/">
							<Image
								src="https://static.arasaac.org/images/by-nc-sa.svg"
								alt="Creative Commons license CC BY-NC-SA"
								title="ARASAAC creative commons license CC BY-NC-SA"
								preview={false}
								style={{ padding: "0px 10px" }}
							/>
						</Link>
						<Typography.Link href="/funding" style={{ color: "white" }}
							underline>{t("footer.funding")}</Typography.Link>
					</Flex>
				</Footer>}
			</Layout>
			<TeacherHelpButton />
		</>
	);
};

export default App;