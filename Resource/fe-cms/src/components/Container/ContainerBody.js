import classnames from 'classnames';
import { observer } from 'mobx-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../../core/utils/hook';
import SideBar from './SideBar';
import { useProSidebar } from 'react-pro-sidebar';
import './style.scss';
import { SYSTEM_PATH } from '../../core/configs/constants';
import { useEffect, useState } from 'react';
// import ChangeLanguage from '../Translation/ChangeLanguage';
import { useTranslation } from 'react-i18next';

const ContainerBody = observer(() => {

    // translation
    const { t } = useTranslation();
    const location = useLocation();

    // store
    const { authStore: { userInfo, getInfo } } = useStore();
    const [isPermission, setIsPermission] = useState(false);

    // function
    const { collapsed, collapseSidebar } = useProSidebar();

    // lifecycle
    useEffect(() => {
        getInfo();
    }, [])

    useEffect(() => {
        verifyPermission();
    }, [location.pathname, userInfo?.permissions])

    // function
    const onToggleCollapse = () => {
        localStorage.setItem('collapsedMenu', !collapsed);
        collapseSidebar();
    }

    const verifyPermission = () => {
        let permission = false;

        if (location.pathname === SYSTEM_PATH.DASHBOARD) {
            permission = userInfo?.permissions?.permissions?.dashboard;
        } else if (location.pathname.includes(SYSTEM_PATH.CATEGORY_MANAGEMENT)) {
            permission = userInfo?.permissions?.permissions?.category;
        } else if (location.pathname.includes(SYSTEM_PATH.COURSE_MANAGEMENT)) {
            permission = userInfo?.permissions?.permissions?.course;
        } else if (location.pathname.includes(SYSTEM_PATH.ADMIN_MANAGEMENT)) {
            permission = userInfo?.permissions?.permissions?.admin;
        } else if (location.pathname.includes(SYSTEM_PATH.TEACHER_MANAGEMENT)) {
            permission = userInfo?.permissions?.permissions?.teacher;
        } else if (location.pathname.includes(SYSTEM_PATH.STUDENT_MANAGEMENT)) {
            permission = userInfo?.permissions?.permissions?.student;
        } else if (location.pathname.includes(SYSTEM_PATH.DATA)) {
            permission = userInfo?.permissions?.permissions?.algorithm;
        } else if (location.pathname.includes(SYSTEM_PATH.MAIN_ALGORITHM)) {
            permission = userInfo?.permissions?.permissions?.algorithm;
        } else if (location.pathname.includes(SYSTEM_PATH.OTHER_ALGORITHMS)) {
            permission = userInfo?.permissions?.permissions?.algorithm;
        } else if (location.pathname.includes(SYSTEM_PATH.SETTING_AUTH)) {
            permission = userInfo?.permissions?.permissions?.permission;
        } else {
            permission = true;
        }

        setIsPermission(permission);
    }

    return (
        <div className='wrapper d-flex h-100 w-100'>
            <div className='wrapper-side-bar'>
                <SideBar isShowSideBar={collapsed} />
            </div>
            <div className={classnames('wrapper-container', !collapsed && 'nav-show')}>
                <div className='wrapper-header'>
                    <div role={'button'} onClick={onToggleCollapse}>
                        {
                            !collapsed ?
                                <i className='fa-solid fa-outdent fs-heading-normal'></i>
                                :
                                <i className='fa-solid fa-indent fs-heading-normal'></i>
                        }
                    </div>
                    <div className='d-flex align-items-center'>
                        {/* <ChangeLanguage /> */}
                        <div className='drop-down mg-l-30'>
                            <div className='user-info d-flex align-items-center dropdown-toggle'
                                type='button' id='dropdownMenuInfo' data-bs-toggle='dropdown' aria-expanded='false'>
                                <i className='fa-solid fa-circle-user fs-heading-normal'></i>
                                <span className='pd-l-5 fw-bold'>{userInfo?.name ?? ''}</span>
                            </div>
                            <ul className='dropdown-menu dropdownMenuInfo' aria-labelledby='dropdownMenuInfo'>
                                <li>
                                    <Link className='dropdown-item' to={SYSTEM_PATH.PROFILE}>
                                        <i className='fa-solid fa-circle-info'></i> {t('dropInfo.userInfo')}
                                    </Link>
                                </li>
                                <li>
                                    <Link className='dropdown-item' to={SYSTEM_PATH.CHANGE_PASSWORD}>
                                        <i className='fa-solid fa-key'></i> {t('dropInfo.changePassword')}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='wrapper-content'>
                    {
                        !isPermission ?
                            <div>You do not have access.</div>
                            :
                            <Outlet />
                    }
                </div>
            </div>
        </div>
    )
})

export default ContainerBody;