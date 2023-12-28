/* eslint-disable max-len */
import { Route, Routes } from 'react-router-dom';
import { GENERAL_TYPE, SCREEN_MODE, SYSTEM_PATH, USER_TYPE } from '../core/configs/constants';
import ContainerBody from '../components/Container/ContainerBody';
import NotFoundScreen from '../screens/404/NotFoundScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import CourseScreen from '../screens/Course/CourseScreen';
import AboutScreen from '../screens/About/AboutScreen';
import TeacherScreen from '../screens/Teacher/TeacherScreen';
import ContactScreen from '../screens/Contact/ContactScreen';
import CourseDetailScreen from '../screens/Course/CourseDetailScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import ForgotPasswordScreen from '../screens/Password/ForgotPasswordScreen';
import ConfirmEmailScreen from '../screens/ConfirmEmail/ConfirmEmailScreen';
import SetPasswordScreen from '../screens/Password/SetPasswordScreen';
import SignUpScreen from '../screens/SignUp/SignUpScreen';
import { Authentication } from '../components';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import ChangePasswordScreen from '../screens/Password/ChangePasswordScreen';
import CourseTestScreen from '../screens/Course/CourseTestScreen';
import ContainerBodyManagement from '../components/Container/ContainerBodyManagement';
import CourseManagement from '../screens/TeacherManagement/CourseManagement';
import SettingCourseScreen from '../screens/TeacherManagement/SettingCourseScreen';
import CourseInformationScreen from '../screens/TeacherManagement/CourseInformationScreen';
import MyCoursesScreen from '../screens/StudentManagement/MyCoursesScreen';
import DashboardScreen from '../screens/TeacherManagement/DashboardScreen';

const Root = () => {

    return(
        <Routes>
            <Route element={ <ContainerBody/> }>
                <Route path={SYSTEM_PATH.LOGIN} element={ <LoginScreen/> }/>
                <Route path={SYSTEM_PATH.FORGOT_PASSWORD} element={ <ForgotPasswordScreen/> }/>
                <Route path={SYSTEM_PATH.SET_PASSWORD} element={ <SetPasswordScreen/> }/>
                <Route path={SYSTEM_PATH.CONFIRM_EMAIL} element={ <ConfirmEmailScreen/> }/>
                <Route path={SYSTEM_PATH.SIGNUP} element={ <SignUpScreen/> } />
                <Route path={SYSTEM_PATH.HOME} element={ <HomeScreen/> }/>
                <Route path={SYSTEM_PATH.COURSE} element={ <CourseScreen/> }/>
                <Route path={SYSTEM_PATH.COURSE_DETAIL} element={ <CourseDetailScreen/> }/>
                <Route path={SYSTEM_PATH.ABOUT} element={ <AboutScreen/> }/>
                <Route path={SYSTEM_PATH.TEACHER} element={ <TeacherScreen/> }/>
                <Route path={SYSTEM_PATH.CONTACT} element={ <ContactScreen/> }/>

                <Route element={ <Authentication/> }>
                    <Route path={SYSTEM_PATH.PROFILE} element={ <ProfileScreen/> }/>
                    <Route path={SYSTEM_PATH.CHANGE_PASSWORD} element={ <ChangePasswordScreen/> }/>
                    <Route path={SYSTEM_PATH.COURSE_TEST} element={ <CourseTestScreen/> }/>
                    <Route path={SYSTEM_PATH.MY_COURSE} element={ <MyCoursesScreen/> }/>

                    <Route element={ <ContainerBodyManagement/> }>
                        <Route path={SYSTEM_PATH.DASHBOARD} element={ <DashboardScreen/> }/>
                        <Route path={SYSTEM_PATH.COURSE_MANAGEMENT} element={ <CourseManagement/> }/>
                        <Route path={SYSTEM_PATH.COURSE_ADD} element={ <SettingCourseScreen mode={SCREEN_MODE.ADD}/> }/>
                        <Route path={SYSTEM_PATH.COURSE_INFORMATION} element={ <CourseInformationScreen/> }/>
                    </Route>
                </Route>

                <Route path='*' element={ <NotFoundScreen/> }/>
            </Route>
        </Routes>
    )
}

export default Root;