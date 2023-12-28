/* eslint-disable no-undef */
/* eslint-disable max-len */
import { observer } from 'mobx-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ROLE, SYSTEM_PATH } from '../../core/configs/constants';
import classNames from 'classnames';
import { useStore } from '../../core/utils/hook';
import { useEffect } from 'react';
import { clickOutsideCollapse } from '../../core/utils/browser';
import { useState } from 'react';

const NavBar = observer((props) => {

    // other
    const location = useLocation();
    const navigate = useNavigate();

    // store
    const {
        authStore: { token, userInfo, getInfo, logout, isTeacherManagementPage },
        categoryStore: { getAllCategory, categoryList },
        courseStore: { setSearchCourse }
    } = useStore();

    //  state
    const [firstCallOnly, setFirstCallOnly] = useState({
        category: false,
        userInfo: false
    });

    // lifecycle
    useEffect(() => {
        getAllCategory({
            size: -1
        });
        if (token) {
            getInfo();
        }
        if (location.pathname !== SYSTEM_PATH.COURSE) {
            setSearchCourse('');
        }
    }, [location])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname])

    useEffect(() => {
        if (token && userInfo && !firstCallOnly.userInfo) {
            clickOutsideCollapse('#navbar-vertical-userinfo');
            setFirstCallOnly(state => ({
                ...state,
                userInfo: true
            }));
        }

        if (!firstCallOnly.category) {
            clickOutsideCollapse('#navbar-vertical-category');
            setFirstCallOnly(state => ({
                ...state,
                category: true
            }));
        }
    }, [token, userInfo, categoryList])

    // function
    const onLogout = async () => {
        const res = await logout();
        if (res) {
            navigate(SYSTEM_PATH.HOME);
            navigate(0);
        }
    }

    const onBackToTop = () => {
        window.$('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    }


    return (
        <div className='container-fluid'>
            <div className='row border-top border-bottom px-xl-5'>
                {
                    !isTeacherManagementPage &&
                    <div className='col-lg-3 d-none d-lg-block'>
                        <a className='d-flex align-items-center justify-content-between bg-secondary w-100 text-decoration-none'
                            data-toggle='collapse' href='#navbar-vertical-category'
                            style={{ height: '67px', padding: '0 30px' }}>
                            {/* <h5 className='text-primary m-0'><i className='fa fa-book-open mr-2' />Categories</h5> */}
                            <h5 className='text-primary m-0'><i className='fa fa-book-open mr-2' />Danh mục</h5>
                            <i className='fa fa-angle-down text-primary' />
                        </a>
                        <nav className='collapse position-absolute navbar navbar-vertical navbar-light align-items-start p-0 border border-top-0 border-bottom-0 bg-light' id='navbar-vertical-category' style={{ width: 'calc(100% - 30px)', zIndex: 9 }}>
                            <div className='navbar-nav w-100'>
                                {
                                    categoryList?.length > 0 &&
                                    categoryList.map(e => <Link key={e.id} to={`${SYSTEM_PATH.COURSE}?categoryId=${e.id}`} className='nav-item nav-link'>{e.name}</Link>)
                                }
                            </div>
                        </nav>
                    </div>
                }
                <div className={classNames(isTeacherManagementPage ? 'col-lg-12 pd-l-0' : 'col-lg-9')}>
                    <nav className='navbar navbar-expand-lg bg-light navbar-light py-3 py-lg-0 px-0'>
                        <a href className='text-decoration-none d-block d-lg-none'>
                            <h1 className='m-0'><span className='text-primary'>QM</span>courses</h1>
                        </a>
                        <button type='button' className='navbar-toggler' data-toggle='collapse' data-target='#navbarCollapse'>
                            <span className='navbar-toggler-icon' />
                        </button>
                        <div className='collapse navbar-collapse justify-content-between' id='navbarCollapse'>
                            <div className='navbar-nav py-0'>
                                <Link to={SYSTEM_PATH.HOME}
                                    className={classNames('nav-item nav-link', location.pathname === SYSTEM_PATH.HOME && 'active')}>
                                    {/* Home */}
                                    Trang chủ
                                </Link>
                                {/* <Link to={SYSTEM_PATH.ABOUT} className={classNames('nav-item nav-link', location.pathname === SYSTEM_PATH.ABOUT && 'active')}>About</Link> */}
                                {/* <Link to={SYSTEM_PATH.COURSE} className={classNames('nav-item nav-link', location.pathname === SYSTEM_PATH.COURSE && 'active')}>Courses</Link> */}
                                <Link to={SYSTEM_PATH.COURSE} className={classNames('nav-item nav-link', location.pathname === SYSTEM_PATH.COURSE && 'active')}>Khóa học</Link>
                                {/* <Link to={SYSTEM_PATH.TEACHER} className={classNames('nav-item nav-link', location.pathname === SYSTEM_PATH.TEACHER && 'active')}>Teachers</Link> */}
                                <Link to={SYSTEM_PATH.TEACHER} className={classNames('nav-item nav-link', location.pathname === SYSTEM_PATH.TEACHER && 'active')}>Giáo viên</Link>
                                {/* <Link to={SYSTEM_PATH.CONTACT} className={classNames('nav-item nav-link', location.pathname === SYSTEM_PATH.CONTACT && 'active')}>Contact</Link> */}
                            </div>
                            {
                                !token ?
                                    // <Link className='btn btn-primary py-2 px-4 ml-auto d-lg-block' to={SYSTEM_PATH.LOGIN}>Join Now</Link>
                                    <Link className='btn btn-primary py-2 px-4 ml-auto d-lg-block' to={SYSTEM_PATH.LOGIN}>Tham gia</Link>
                                    :
                                    <div className='d-block position-relative user-info' style={{ width: 'fit-content' }}>
                                        <div className='d-flex align-items-center justify-content-between w-100' type='button' data-toggle='collapse'
                                            href='#navbar-vertical-userinfo'
                                            style={{ height: '67px' }}>
                                            <div className='avatar-user mg-r-5' style={{ width: '40px', height: '40px', padding: userInfo?.image && '0px' }}>
                                                <img src={userInfo?.image || '/images/user-avatar-default.svg'} alt='avatar-user' />
                                            </div>
                                            <span>{userInfo?.name}</span>
                                            <i className='fa fa-angle-down text-primary mg-l-10' />
                                        </div>
                                        <nav className='collapse position-absolute navbar navbar-vertical navbar-light align-items-start p-0 border border-top-0 border-bottom-0 bg-light'
                                            id='navbar-vertical-userinfo'
                                            style={{ width: '300px', right: '0px', zIndex: 9 }}>
                                            <div className='navbar-nav w-100 flex-column'>
                                                {
                                                    userInfo?.roleId === ROLE.ROLE_TEACHER &&
                                                    <Link className='nav-item nav-link' to={SYSTEM_PATH.DASHBOARD}>
                                                        {/* <i className='far fa-list-alt mg-r-5'></i> <span>My manage</span> */}
                                                        <i className='far fa-list-alt mg-r-5'></i> <span>Quản lý khóa học</span>
                                                    </Link>
                                                }
                                                {
                                                    userInfo?.roleId === ROLE.ROLE_USER &&
                                                    <Link className='nav-item nav-link' to={SYSTEM_PATH.MY_COURSE}>
                                                        {/* <i className='fas fa-layer-group mg-r-5'></i> <span>My courses</span> */}
                                                        <i className='fas fa-layer-group mg-r-5'></i> <span>Khóa học của tôi</span>
                                                    </Link>
                                                }
                                                <Link className='nav-item nav-link' to={SYSTEM_PATH.PROFILE}>
                                                    {/* <i className='fas fa-user mg-r-5'></i> <span>User information</span> */}
                                                    <i className='fas fa-user mg-r-5'></i> <span>Thông tin tài khoản</span>
                                                </Link>
                                                <Link className='nav-item nav-link' to={SYSTEM_PATH.CHANGE_PASSWORD}>
                                                    {/* <i className='fas fa-key mg-r-5'></i> <span>Change password</span> */}
                                                    <i className='fas fa-key mg-r-5'></i> <span>Đổi mật khẩu</span>
                                                </Link>
                                                <div className='nav-item nav-link' role='button' onClick={onLogout}>
                                                    {/* <i className='fas fa-sign-out-alt mg-r-5'></i> <span>Logout</span> */}
                                                    <i className='fas fa-sign-out-alt mg-r-5'></i> <span>Đăng xuất</span>
                                                </div>
                                            </div>
                                        </nav>
                                    </div>

                            }
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    )
})

export default NavBar;