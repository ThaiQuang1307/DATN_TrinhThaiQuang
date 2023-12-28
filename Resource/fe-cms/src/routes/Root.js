import { Route, Routes } from 'react-router-dom';
import ContainerBody from '../components/Container/ContainerBody';
import { SCREEN_MODE, SYSTEM_PATH } from '../core/configs/constants';
import NotFoundScreen from '../screens/404/NotFoundScreen';
import TBDScreen from '../screens/TBD/TBDScreen';
import PermissionScreen from '../screens/Permission/PermissionScreen';
import ProfileScreen from '../screens/Info/ProfileScreen';
import ChangePasswordScreen from '../screens/Info/ChangePasswordScreen';
import AdminScreen from '../screens/Admin/AdminScreen';
import CourseScreen from '../screens/Course/CourseScreen';
import SettingCourseScreen from '../screens/Course/SettingCourseScreen';
import OtherAlgorithmsScreen from '../screens/Algorithm/OtherAlgorithmsScreen';
import MainAlgorithmScreen from '../screens/Algorithm/MainAlgorithmScreen';
import DataScreen from '../screens/Algorithm/DataScreen';
import CategoryScreen from '../screens/Category/CategoryScreen';
import StudentScreen from '../screens/Student/StudentScreen';
import TeacherScreen from '../screens/Teacher/TeacherScreen';
import SettingTeacherScreen from '../screens/Teacher/SettingTeacherScreen';
import DashBoardScreen from '../screens/Dashboard/DashboardScreen';

const Root = () => {

    return (
        <Routes>
            <Route element={<ContainerBody />}>
                {/* info */}
                <Route path={SYSTEM_PATH.PROFILE} element={<ProfileScreen />} />
                <Route path={SYSTEM_PATH.CHANGE_PASSWORD} element={<ChangePasswordScreen />} />

                {/* dashboard */}
                <Route path={SYSTEM_PATH.DASHBOARD} element={<DashBoardScreen />} />

                {/* category */}
                <Route path={SYSTEM_PATH.CATEGORY_MANAGEMENT} element={<CategoryScreen />} />

                {/* course */}
                <Route path={SYSTEM_PATH.COURSE_MANAGEMENT} element={<CourseScreen />} />
                <Route path={SYSTEM_PATH.COURSE_ADD} element={<SettingCourseScreen mode={SCREEN_MODE.ADD} />} />
                <Route path={SYSTEM_PATH.COURSE_EDIT} element={<SettingCourseScreen mode={SCREEN_MODE.EDIT} />} />

                {/* admin */}
                <Route path={SYSTEM_PATH.ADMIN_MANAGEMENT} element={<AdminScreen />} />

                {/* teacher */}
                <Route path={SYSTEM_PATH.TEACHER_MANAGEMENT} element={<TeacherScreen />} />
                <Route path={SYSTEM_PATH.TEACHER_ADD} element={<SettingTeacherScreen mode={SCREEN_MODE.ADD} />} />
                <Route path={SYSTEM_PATH.TEACHER_EDIT} element={<SettingTeacherScreen mode={SCREEN_MODE.EDIT} />} />

                {/* student */}
                <Route path={SYSTEM_PATH.STUDENT_MANAGEMENT} element={<StudentScreen />} />

                {/* message */}
                <Route path={SYSTEM_PATH.MESSAGE_MANAGEMENT} element={<TBDScreen />} />
                <Route path={SYSTEM_PATH.MESSAGE_ADD} element={<TBDScreen />} />

                {/* inquiry */}
                <Route path={SYSTEM_PATH.INQUIRY_MANAGEMENT} element={<TBDScreen />} />

                {/* algorithm */}
                <Route path={SYSTEM_PATH.DATA} element={<DataScreen />} />
                <Route path={SYSTEM_PATH.MAIN_ALGORITHM} element={<MainAlgorithmScreen />} />
                <Route path={SYSTEM_PATH.OTHER_ALGORITHMS} element={<OtherAlgorithmsScreen />} />

                {/* general setting */}
                <Route path={SYSTEM_PATH.SETTING_AUTH} element={<PermissionScreen />} />
                <Route path={SYSTEM_PATH.SETTING_FAQ} element={<TBDScreen />} />

                {/* not found */}
                <Route path='*' element={<NotFoundScreen />} />
            </Route>
        </Routes>
    )
}

export default Root;