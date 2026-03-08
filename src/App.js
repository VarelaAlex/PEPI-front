import React, { useCallback, useEffect, useState } from 'react';
import {Trans, useTranslation} from 'react-i18next';
import { Link, matchPath, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {Layout, notification, Flex, Image, Typography} from "antd";
import SelectRole from './components/SelectRoleComponent';
import Header from './components/layout/HeaderComponent';
import Sider from "./components/layout/SiderComponent";
import { UserOutlined, InfoCircleOutlined, LogoutOutlined, FormOutlined, ExperimentOutlined, DollarOutlined } from "@ant-design/icons";
import ClassroomOutlined from './components/icons/ClassroomOutlined';
import HowToDoExercises           from "./components/student/HowToDoExercisesComponent";
import PhrasesActivity from "./components/student/PhrasesActivityComponent";
import PictogramActivity from "./components/student/PictogramActivityComponent";
import CreateStudent              from "./components/teacher/CreateStudentComponent";
import LoginTeacher from './components/teacher/LoginTeacherComponent';
import SignupTeacher from './components/teacher/SignupTeacherComponent';
import ClassroomsList from './components/teacher/ClassroomsListComponent';
import ExercisesList from './components/teacher/ExercisesListComponent';
import CreateExercise from './components/teacher/CreateExerciseComponent';
import LoginStudent from './components/student/LoginStudentComponent';
import DnDPhase1 from './components/student/DnDPhase1Component';
import DnDPhase2 from './components/student/DnDPhase2Component';
import TypePhase1 from './components/student/TypePhase1Component';
import TypePhase2 from './components/student/TypePhase2Component';
import ExercisesCarousel from './components/student/ExercisesCarouselComponent';
import { useSession }    from './components/SessionComponent';
import { jwtDecode }     from 'jwt-decode';
import NotFound from './components/NotFoundComponent';
import ClassroomDetail from './components/teacher/ClassroomDetailComponent';
import StudentDetail from './components/teacher/StudentDetailComponent';
import BlankPage from './components/BlankPageComponent';
import Profile from './components/teacher/ProfileComponent';
import ClassroomStatistics from './components/teacher/ClassroomStatisticsComponent';
import StudentStatistics from './components/teacher/StudentStatisticsComponent';
import AboutEPI from './components/teacher/AboutPEPIComponent';
import SurveyA from "./components/teacher/SurveyAComponent";
import SurveyB from "./components/teacher/SurveyBComponent";
import SelectMode from "./components/student/SelectModeComponent";
import SentenceNetwork from "./components/student/SentenceNetworkComponent";
import SentenceNetworkSequential from "./components/student/SentenceNetworkSequentialComponent";
import SelectPhase from "./components/student/SelectPhaseComponent";
import Funding from "./components/FundingComponent";
import SelectTrainingMode from "./components/student/SelectTrainingModeComponent";
import useFullscreen from "./hooks/useFullscreen";
import AudioPermissionModal from "./components/AudioPermissionModalComponent";
import {useAvatar} from "./components/AvatarContext";
import ClosedExercisesSelector from "./components/student/ClosedExercisesSelectorComponent";
import AvatarNavigationListener from "./components/AvatarNavigationListener";
import InteractionBlocker from "./components/InteractionBlockerComponent";
import EditExercise from "./components/teacher/EditExerciseComponent";
import TeacherHelpButton from "./components/TeacherHelpButtonComponent";
import {usePullToRefreshBlocker} from "./hooks/usePullToRefreshBlocker";

let App = () => {

	let { login, setLogin, setFeedback, setExercise } = useSession();
	let {hideAvatar, disableVoice} = useAvatar();
    let exitFullscreen = useFullscreen();
	usePullToRefreshBlocker();

	const MOBILE_BREAKPOINT = 430;

	let [open, setOpen] = useState(false);
	let [api, contextHolder] = notification.useNotification();
	let [isMobile, setIsMobile] = useState(false);
	let [classroomId, setClassroomId] = useState();
	let [studentName, setStudentName] = useState();

	let { t } = useTranslation();
	let navigate = useNavigate();
	let location = useLocation();
	const { isBusy } = useAvatar();
	let { Content, Footer } = Layout;

	let disconnect = useCallback(() => {
		logout();
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

	let isTokenExpired = (token) => {
		if (!token) return true;
		try {
			const decodedToken = jwtDecode(token);
			const currentTime = Date.now() / 1000;
			return decodedToken.exp < currentTime;
		} catch (error) {
			console.error('Error decoding token:', error);
			return true;
		}
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
            label: <Link to="/selectRole" onClick={disconnect}>{t("sider.disconnect")}</Link>,
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
						italic: <i/>
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
            icon: <ExperimentOutlined/>
        },
        {
            key: "training",
            label: <Link to="/students/trainingMode" onClick={() => setOpen(false)}>{t("sider.student.training")}</Link>,
            danger: false,
            icon: <FormOutlined/>
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
					return await response.json();
				} catch (e) {
					disconnect();
					navigate("/selectRole");
				}
			}
		};

		const interval = setInterval(async () => {
			if (localStorage.getItem("refreshToken")) {
				localStorage.setItem("accessToken", await refresh());
			}
		}, 0.5 * 60 * 1000);

		return () => clearInterval(interval);
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

    let {Text} = Typography;

	const hideHeaderFooterRoutes = [
		"/exerciseDnD",
		"/exerciseType",
		"/students"
	];

	const shouldHideHeaderFooter = hideHeaderFooterRoutes.some(route =>
		location.pathname.startsWith(route)
	);

	return (
		<>
			{contextHolder}
            <AudioPermissionModal/>
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
				<Content style={{ overflowY: "auto", background: "url(/bg.png)", backgroundSize: "cover" }} >
						<Flex align="center" justify="center" style={{ minHeight: "100%" }}>
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
								<Route path="/students/pretraining/block/1/activity/:activity" element={<PictogramActivity key={location.pathname}/>} />
                                <Route path="/students/pretraining/block/2/activity/:activity" element={<PhrasesActivity key={location.pathname}/>} />
                                <Route path="/students/pretraining/block/3/activity/1" element={<SentenceNetwork />} />
                                <Route path="/students/pretraining/block/3/activity/2" element={<SentenceNetworkSequential />} />
                                <Route path="/students/pretraining/" element={<SelectPhase />} />
                                <Route path="/students/howTo" element={<HowToDoExercises />} />
                                <Route path="/loginTeacher" element={<LoginTeacher />} />
								<Route path="/registerTeacher" element={<SignupTeacher />} />
								<Route path="/teachers/menuTeacher" element={<ClassroomsList isMobile={isMobile} setClassroomId={setClassroomId} />} />
								<Route path="/teachers/classrooms/:classroomName" element={<ClassroomDetail isMobile={isMobile} setStudentName={setStudentName} />} />
								<Route path="/teachers/:classroomName/students/:studentId" element={<StudentDetail />} />
								<Route path="/teachers/classrooms/:classroomName/students" element={<CreateStudent />} />
								<Route path="/teachers/manageExercises" element={<ExercisesList />} />
								<Route path="/teachers/create" element={<CreateExercise isMobile={isMobile} />} />
								<Route path="/teachers/exercise/:exerciseId/edit" element={<EditExercise />} />
								<Route path='/teachers/profile' element={<Profile />} />
								<Route path='/teachers/classroomStats/:classroomName' element={<ClassroomStatistics classroomId={classroomId} />} />
								<Route path='/teachers/studentStats/:studentId' element={<StudentStatistics studentName={studentName} />} />
								<Route path='/teachers/:classroomName/students/:studentId/surveys/A' element={<SurveyA/>} />
								<Route path='/teachers/:classroomName/students/:studentId/surveys/B' element={<SurveyB/>} />
								<Route path='/teachers/aboutEPI' element={<AboutEPI />} />
								<Route path='/' element={<BlankPage />} />
								<Route path="*" element={<NotFound />} />
							</Routes>
						</Flex>
					</Content>
				</Layout>
				{!shouldHideHeaderFooter && <Footer style={{backgroundColor: "#001628", color: "white", padding: 10}}>
					<Flex align="center" justify="center" style={{minHeight: "100%"}}>
						<Text style={{color: "white"}}>PEPI @ 2025 Made with ❤️ by <Typography.Link
							href="https://github.com/VarelaAlex" style={{color: "white"}}
							underline>Álex</Typography.Link> & <Typography.Link href="https://grupoadir.es/"
																				style={{color: "white"}}
																				underline>ADIR</Typography.Link> – based
							on <Typography.Link href="https://www.unioviedo.es/hyper/" style={{color: "white"}}
												underline>Hyper</Typography.Link></Text>
						<Link to="https://creativecommons.org/licenses/by-nc-sa/4.0/">
							<Image
								src="https://static.arasaac.org/images/by-nc-sa.svg"
								alt="Creative Commons license CC BY-NC-SA"
								title="ARASAAC creative commons license CC BY-NC-SA"
								preview={false}
								style={{padding: "0px 10px"}}
							/>
						</Link>
						<Typography.Link href="/funding" style={{color: "white"}}
										 underline>Financiación</Typography.Link>
					</Flex>
				</Footer>}
			</Layout>
			<TeacherHelpButton />
		</>
	);
};

export default App;