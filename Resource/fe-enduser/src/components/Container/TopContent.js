import { Link, useNavigate } from 'react-router-dom';
import { SYSTEM_PATH } from '../../core/configs/constants';
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../../core/utils/hook';

const TopContent = observer((props) => {

    // other
    const navigate = useNavigate();

    // props
    const { isHome, breadcrumb, namePage } = props;

    // store
    const { courseStore: { searchCourse, setSearchCourse } } = useStore();

    // function
    const onChangeSearchCourse = (e) => {
        setSearchCourse(e.target.value);
    }

    const onSearchCourse = () => {
        navigate(SYSTEM_PATH.COURSE);
    }

    return (
        isHome ?
            <div className='container-fluid p-0 pb-5 mb-5'>
                <div id='header-carousel' className='carousel slide carousel-fade' data-ride='carousel'>
                    <ol className='carousel-indicators'>
                        <li data-target='#header-carousel' data-slide-to={0} className='active' />
                        <li data-target='#header-carousel' data-slide-to={1} />
                        <li data-target='#header-carousel' data-slide-to={2} />
                    </ol>
                    <div className='carousel-inner'>
                        <div className='carousel-item active' style={{ minHeight: '300px' }}>
                            <img className='position-relative w-100' src='/images/banner1.jpg' style={{ minHeight: '300px', objectFit: 'cover' }} />
                            <div className='carousel-caption d-flex align-items-center justify-content-center'>
                                <div className='p-5' style={{ width: '100%', maxWidth: '900px' }}>
                                    {/* <h5 className='text-white text-uppercase mb-md-3'>Best Online Courses</h5> */}
                                    <h5 className='text-white text-uppercase mb-md-3'>Khóa học trực tuyến tốt nhất</h5>
                                    {/* <h1 className='display-3 text-white mb-md-4'>Best Education From Your Home</h1> */}
                                    <h1 className='display-3 text-white mb-md-4'>Nền tảng học tập trực tuyến tốt nhất</h1>
                                    {/* <a href className='btn btn-primary py-md-2 px-md-4 font-weight-semi-bold mt-2'>Learn More</a> */}
                                    <div className='input-group max-width-500'>
                                        <input
                                            type='text'
                                            className={'form-control p-4 rounded-0 rounded-left'}
                                            placeholder='Tìm kiếm'
                                            value={searchCourse}
                                            onChange={onChangeSearchCourse} />
                                        <button type='button'
                                            className="btn btn-primary height-50 width-50 rounded-0 rounded-right"
                                            onClick={onSearchCourse}>
                                            <i className='fas fa-search'></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='carousel-item' style={{ minHeight: '300px' }}>
                            <img className='position-relative w-100' src='/images/banner2.jpg' style={{ minHeight: '300px', objectFit: 'cover' }} />
                            <div className='carousel-caption d-flex align-items-center justify-content-center'>
                                <div className='p-5' style={{ width: '100%', maxWidth: '900px' }}>
                                    {/* <h5 className='text-white text-uppercase mb-md-3'>Best Online Courses</h5> */}
                                    <h5 className='text-white text-uppercase mb-md-3'>Khóa học trực tuyến tốt nhất</h5>
                                    {/* <h1 className='display-3 text-white mb-md-4'>Best Online Learning Platform</h1> */}
                                    <h1 className='display-3 text-white mb-md-4'>Học tập ở mọi nơi</h1>
                                    {/* <a href className='btn btn-primary py-md-2 px-md-4 font-weight-semi-bold mt-2'>Learn More</a> */}
                                    <div className='input-group max-width-500'>
                                        <input
                                            type='text'
                                            className={'form-control p-4 rounded-0 rounded-left'}
                                            placeholder='Tìm kiếm'
                                            value={searchCourse}
                                            onChange={onChangeSearchCourse} />
                                        <button type='button' className="btn btn-primary height-50 width-50 rounded-0 rounded-right">
                                            <i className='fas fa-search'></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='carousel-item' style={{ minHeight: '300px' }}>
                            <img className='position-relative w-100' src='/images/carousel1.jpg' style={{ minHeight: '300px', objectFit: 'cover' }} />
                            <div className='carousel-caption d-flex align-items-center justify-content-center'>
                                <div className='p-5' style={{ width: '100%', maxWidth: '900px' }}>
                                    {/* <h5 className='text-white text-uppercase mb-md-3'>Best Online Courses</h5> */}
                                    <h5 className='text-white text-uppercase mb-md-3'>Khóa học trực tuyến tốt nhất</h5>
                                    {/* <h1 className='display-3 text-white mb-md-4'>New Way To Learn From Home</h1> */}
                                    <h1 className='display-3 text-white mb-md-4'>Cách mới để học ở nhà</h1>
                                    {/* <a href className='btn btn-primary py-md-2 px-md-4 font-weight-semi-bold mt-2'>Learn More</a> */}
                                    <div className='input-group max-width-500'>
                                        <input
                                            type='text'
                                            className={'form-control p-4 rounded-0 rounded-left'}
                                            placeholder='Tìm kiếm'
                                            value={searchCourse}
                                            onChange={onChangeSearchCourse} />
                                        <button type='button' className="btn btn-primary height-50 width-50 rounded-0 rounded-right">
                                            <i className='fas fa-search'></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            :
            <div className="container-fluid page-header" style={{ marginBottom: '90px' }}>
                <div className="container">
                    <div className="d-flex flex-column justify-content-center" style={{ minHeight: '300px' }}>
                        <h3 className="display-4 text-white text-uppercase">{namePage}</h3>
                        {
                            breadcrumb &&
                            <div className="d-inline-flex text-white">
                                <p className="m-0 text-uppercase"><Link className="text-white" to={SYSTEM_PATH.HOME}>Trang chủ</Link></p>
                                {
                                    Array.isArray(breadcrumb) ?
                                        breadcrumb.map(e => (
                                            <React.Fragment key={e}>
                                                <i className="fa fa-angle-double-right pt-1 px-3" />
                                                <p className="m-0 text-uppercase">{e}</p>
                                            </React.Fragment>
                                        ))
                                        :
                                        <>
                                            <i className="fa fa-angle-double-right pt-1 px-3" />
                                            <p className="m-0 text-uppercase">{breadcrumb}</p>
                                        </>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>

    )
})

export default TopContent;