import { useEffect, useMemo } from 'react';
import { useStore } from '../../core/utils/hook';
import { ROLE, SYSTEM_PATH } from '../../core/configs/constants';
import { Link, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import classNames from 'classnames';

/* eslint-disable max-len */
const Footer = observer((props) => {

    // other
    const location = useLocation();

    // store
    const {
        categoryStore: { categoryList },
        authStore: { isTeacherManagementPage }
    } = useStore();

    // lifecycle
    useEffect(() => {
        // Back to top button
        window.$(window).scroll(function () {
            if (window.$(this).scrollTop() > 100) {
                window.$('.back-to-top').fadeIn('slow');
            } else {
                window.$('.back-to-top').fadeOut('slow');
            }
        });
    }, [])

    // function
    const onBackToTop = () => {
        window.$('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
        return false;
    }

    return (
        <div>
            {/* Footer Start */}
            <div className={classNames('container-fluid bg-dark text-white py-5 px-sm-3 px-lg-5', isTeacherManagementPage && 'mg-t-0')} style={{ marginTop: '90px' }}>
                <div className='row pt-5'>
                    <div className='col-lg-7 col-md-12'>
                        <div className='row'>
                            <div className='col-md-6 mb-5'>
                                {/* <h5 className='text-primary text-uppercase mb-4' style={{ letterSpacing: '5px' }}>Get In Touch</h5> */}
                                <h5 className='text-primary text-uppercase mb-4' style={{ letterSpacing: '5px' }}>Liên hệ</h5>
                                {/* <p><i className='fa fa-map-marker-alt mr-2' />298 Cau Dien, Bac Tu Liem, Ha Noi</p> */}
                                <p><i className='fa fa-map-marker-alt mr-2' />298 Cầu Diễn, Bắc Từ Liêm, Hà Nội</p>
                                <p><i className='fa fa-phone-alt mr-2' />+0343 136 604</p>
                                <p><i className='fa fa-envelope mr-2' />elearing.system@gmail.com</p>
                                <div className='d-flex justify-content-start mt-4'>
                                    <a className='btn btn-outline-light btn-square mr-2' href='https://www.linkedin.com/in/quang-trinh-dev/'><i className='fab fa-twitter' /></a>
                                    <a className='btn btn-outline-light btn-square mr-2' href='https://www.linkedin.com/in/quang-trinh-dev/'><i className='fab fa-facebook-f' /></a>
                                    <a className='btn btn-outline-light btn-square mr-2' href='https://www.linkedin.com/in/quang-trinh-dev/'><i className='fab fa-linkedin-in' /></a>
                                    <a className='btn btn-outline-light btn-square' href='https://www.linkedin.com/in/quang-trinh-dev/'><i className='fab fa-instagram' /></a>
                                </div>
                            </div>
                            <div className='col-md-6 mb-5'>
                                {/* <h5 className='text-primary text-uppercase mb-4' style={{ letterSpacing: '5px' }}>Our Courses</h5> */}
                                <h5 className='text-primary text-uppercase mb-4' style={{ letterSpacing: '5px' }}>Khóa học</h5>
                                <div className='d-flex flex-column justify-content-start'>
                                    {
                                        categoryList?.length > 0 &&
                                        categoryList.slice(0, 6).map(e =>
                                            <Link key={e.id} to={`${SYSTEM_PATH.COURSE}?categoryId=${e.id}`} className='text-white mb-2'><i className='fa fa-angle-right mr-2' />{e.name}</Link>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className='col-lg-5 col-md-12 mb-5'>
                        <h5 className='text-primary text-uppercase mb-4' style={{letterSpacing: '5px'}}>Contact us</h5>
                        <p>We’re always listening to your requests and ideas.</p>
                        <div className='w-100'>
                            <button className='btn btn-primary btn-block border-0 py-3 d-flex justify-content-between align-items-center width-250 pd-lr-20' type='submit'>
                                <span>Contact now</span>
                                <i className='fas fa-chevron-right'></i>
                            </button>
                        </div>
                    </div> */}
                </div>
            </div>
            <div className='container-fluid bg-dark text-white border-top py-4 px-sm-3 px-md-5' style={{ borderColor: 'rgba(256, 256, 256, .1) !important' }}>
                <div className='row'>
                    <div className='col-lg-6 text-center text-md-left mb-3 mb-md-0'>
                        {/* <p className='m-0 text-white'>© <a href='#'>Domain Name</a>. All Rights Reserved. Designed by <a href='https://htmlcodex.com'>HTML Codex</a>
                        </p> */}
                    </div>
                    <div className='col-lg-6 text-center text-md-right copy-right'>
                        {/* <ul className='nav d-inline-flex'>
                            <li className='nav-item'>
                                <a className='nav-link text-white py-0' href='#'>Privacy</a>
                            </li>
                            <li className='nav-item'>
                                <a className='nav-link text-white py-0' href='#'>Terms</a>
                            </li>
                            <li className='nav-item'>
                                <a className='nav-link text-white py-0' href='#'>FAQs</a>
                            </li>
                            <li className='nav-item'>
                                <a className='nav-link text-white py-0' href='#'>Help</a>
                            </li>
                        </ul> */}
                        <div className='text-white py-0 copy-right-content'>
                            Copyright © 2023 QM - courses. Designed By
                            <a className='nav-link text-primary py-0 pd-lr-0' target="_blank" href='https://www.linkedin.com/in/quang-trinh-dev/'>ThaiQuang.dev</a></div>
                    </div>
                </div>
            </div>
            {/* Footer End */}

            {/* Back to Top */}
            <a className='btn btn-lg btn-primary btn-lg-square back-to-top' onClick={onBackToTop} ><i className='fa fa-angle-double-up' /></a>
        </div>

    )
})

export default Footer;