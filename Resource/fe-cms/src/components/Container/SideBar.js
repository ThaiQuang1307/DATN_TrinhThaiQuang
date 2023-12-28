import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SYSTEM_PATH } from '../../core/configs/constants';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useStore } from '../../core/utils/hook';
import { useTranslation } from 'react-i18next';

const SideBar = (props) => {

    // translation
    const { t } = useTranslation();

    // other
    const navigate = useNavigate();
    const location = useLocation();

    // store
    const { authStore: { logout, userInfo } } = useStore();

    // function
    const onLogout = async () => {
        const res = await logout();
        if (res) {
            navigate(0);
        }
    }

    return (
        <Sidebar width='265px' defaultCollapsed={localStorage.getItem('collapsedMenu') === 'true' ? true : false}
        >
            <Menu>
                <MenuItem className='ps-menu-logo'>
                    CMS
                </MenuItem>
            </Menu>
            <Menu className='ps-menu-root-content' closeOnClick={true}>
                {
                    userInfo?.permissions?.permissions?.dashboard &&
                    <MenuItem icon={<i className='fa-solid fa-chart-line'></i>} component={<Link to={SYSTEM_PATH.DASHBOARD} />}
                        active={location.pathname === SYSTEM_PATH.DASHBOARD}>
                        {t('sideBar.dashboard')}
                    </MenuItem>
                }
                {
                    userInfo?.permissions?.permissions?.category &&
                    <MenuItem icon={<i className='fa-solid fa-list'></i>} component={<Link to={SYSTEM_PATH.CATEGORY_MANAGEMENT} />}
                        active={location.pathname.includes(SYSTEM_PATH.CATEGORY_MANAGEMENT)}>
                        {t('sideBar.category')}
                    </MenuItem>
                }
                {
                    userInfo?.permissions?.permissions?.course &&
                    <MenuItem icon={<i className='fa-solid fa-layer-group'></i>} component={<Link to={SYSTEM_PATH.COURSE_MANAGEMENT} />}
                        active={location.pathname.includes(SYSTEM_PATH.COURSE_MANAGEMENT)}>
                        {t('sideBar.course')}
                    </MenuItem>
                }
                {
                    (userInfo?.permissions?.permissions?.admin ||
                        userInfo?.permissions?.permissions?.teacher ||
                        userInfo?.permissions?.permissions?.student) &&
                    <SubMenu icon={<i className='fa-solid fa-user-group'></i>} label={t('sideBar.user')}>
                        {
                            userInfo?.permissions?.permissions?.admin &&
                            <MenuItem component={<Link to={SYSTEM_PATH.ADMIN_MANAGEMENT} />}
                                active={location.pathname.includes(SYSTEM_PATH.ADMIN_MANAGEMENT)}>
                                {t('sideBar.admin')}
                            </MenuItem>
                        }
                        {
                            userInfo?.permissions?.permissions?.teacher &&
                            <MenuItem component={<Link to={SYSTEM_PATH.TEACHER_MANAGEMENT} />}
                                active={location.pathname.includes(SYSTEM_PATH.TEACHER_MANAGEMENT)}>
                                {t('sideBar.teacher')}
                            </MenuItem>
                        }
                        {
                            userInfo?.permissions?.permissions?.student &&
                            <MenuItem component={<Link to={SYSTEM_PATH.STUDENT_MANAGEMENT} />}
                                active={location.pathname.includes(SYSTEM_PATH.STUDENT_MANAGEMENT)}>
                                {t('sideBar.student')}
                            </MenuItem>
                        }
                    </SubMenu>
                }
                {/* {
                    userInfo?.permissions?.permissions?.algorithm &&
                    <SubMenu icon={<i className='fa-solid fa-microchip'></i>} label={t('sideBar.algorithm')}>
                        <MenuItem component={<Link to={SYSTEM_PATH.DATA} />}
                            active={location.pathname.includes(SYSTEM_PATH.DATA)}>
                            {t('sideBar.data')}
                        </MenuItem>
                        <MenuItem component={<Link to={SYSTEM_PATH.MAIN_ALGORITHM} />}
                            active={location.pathname.includes(SYSTEM_PATH.MAIN_ALGORITHM)}>
                            {t('sideBar.mainAlgorithm')}
                        </MenuItem>
                        <MenuItem component={<Link to={SYSTEM_PATH.OTHER_ALGORITHMS} />}
                            active={location.pathname.includes(SYSTEM_PATH.OTHER_ALGORITHMS)}>
                            {t('sideBar.otherAlgorithms')}
                        </MenuItem>
                    </SubMenu>
                } */}
                {
                    userInfo?.permissions?.permissions?.permission &&
                    <SubMenu icon={<i className='fa-solid fa-gears'></i>} label={t('sideBar.settingGeneral')}>
                        {
                            userInfo?.permissions?.permissions?.permission &&
                            <MenuItem component={<Link to={SYSTEM_PATH.SETTING_AUTH} />}
                                active={location.pathname.includes(SYSTEM_PATH.SETTING_AUTH)}>
                                {t('sideBar.permission')}
                            </MenuItem>
                        }
                    </SubMenu>
                }
            </Menu>
            <Menu>
                <MenuItem icon={<i className='fa-solid fa-right-from-bracket'></i>} onClick={onLogout}>
                    {t('sideBar.logout')}
                </MenuItem>
            </Menu>
        </Sidebar>
    )
}

export default SideBar;