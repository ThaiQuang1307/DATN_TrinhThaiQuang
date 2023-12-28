/* eslint-disable max-len */
import { observer } from 'mobx-react';
import { CourseCard, SortCourseSelect, TeacherCard, CategoryCard, TopContent, CategoryCardList } from '../../components';
import { useStore } from '../../core/utils/hook';
import { useEffect } from 'react';
import { ROLE, STATUS, SYSTEM_PATH, TEACHER_SUBJECT } from '../../core/configs/constants';
import { formatHeightElements } from '../../core/utils/browser';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import Slider from 'react-slick';

const HomeScreen = observer((props) => {

    // other
    const navigate = useNavigate();

    // store
    const {
        authStore: { token },
        categoryStore: { categoryList },
        userStore: { teacherList, getAllTeacher, clean: cleanUserStore },
        courseStore: { courseList, getAllCourse, clean: cleanCourseStore }
    } = useStore();

    // lifecycle
    useEffect(() => {
        const getData = () => {
            getAllTeacher({
                roleId: ROLE.ROLE_TEACHER,
                size: 16,
                page: 1
            });
        }

        cleanStore();
        getData();
        return () => {
            cleanStore();
        }
    }, [])

    useEffect(() => {
        if (courseList?.length > 0) {
            formatHeightElements('.course-card-content');
        }
    }, [courseList])

    // function
    const cleanStore = () => {
        {
            cleanUserStore();
            cleanCourseStore();
        }
    }

    const onChangeSort = (value) => {
        getAllCourse({
            sortby: value,
            size: 12,
            page: 1
        })
    }

    return (
        <>
            <TopContent isHome={true} />

            {/* About Start */}
            {/* <div className='container-fluid py-5'>
                <div className='container py-5'>
                    <div className='row align-items-center'>
                        <div className='col-lg-5'>
                            <img className='img-fluid rounded mb-4 mb-lg-0' src='/images/about.jpg' alt='' />
                        </div>
                        <div className='col-lg-7'>
                            <div className='text-left mb-4'>
                                <h5 className='text-primary text-uppercase mb-3' style={{letterSpacing: '5px'}}>About Us</h5>
                                <h1>Innovative Way To Learn</h1>
                            </div>
                            <p>Aliquyam accusam clita nonumy ipsum sit sea clita ipsum clita, ipsum dolores amet voluptua duo dolores et sit ipsum rebum, sadipscing et erat eirmod diam kasd labore clita est. Diam sanctus gubergren sit rebum clita amet, sea est sea vero sed et. Sadipscing labore tempor at sit dolor clita consetetur diam. Diam ut diam tempor no et, lorem dolore invidunt no nonumy stet ea labore, dolor justo et sit gubergren diam sed sed no ipsum. Sit tempor ut nonumy elitr dolores justo aliquyam ipsum stet</p>
                            <a href className='btn btn-primary py-md-2 px-md-4 font-weight-semi-bold mt-2'>Learn More</a>
                        </div>
                    </div>
                </div>
            </div> */}
            {/* About End */}

            {/* Subject Start */}
            {
                categoryList?.length > 0 &&
                <div className='container-fluid py-5'>
                    <div className='container pt-5 pb-3'>
                        <div className='text-center mb-5'>
                            {/* <h5 className='text-primary text-uppercase mb-3' style={{letterSpacing: '5px'}}>Categories</h5> */}
                            <h5 className='text-primary text-uppercase mb-3' style={{ letterSpacing: '5px' }}>Danh mục</h5>
                            {/* <h1>Explore Top Categories</h1> */}
                            <h1>Các danh mục hàng đầu</h1>
                        </div>
                        <div className='row'>
                            <CategoryCardList data={categoryList.slice(0, 8)} />
                            {/* {
                                categoryList.slice(0, 8).map(e => 
                                    <CategoryCard key={e.id} theme={{
                                        id: e.id,
                                        name: e.name,
                                        image: e.image,
                                        numberCourses: e.numberCourses
                                    }}/>
                                )
                            } */}
                        </div>
                    </div>
                </div>
            }
            {/* Subject Start */}

            {/* Courses Start */}
            <div className='container-fluid py-5'>
                <div className='container py-5'>
                    <div className='text-center mb-5'>
                        {/* <h5 className='text-primary text-uppercase mb-3' style={{ letterSpacing: '5px' }}>Courses</h5> */}
                        <h5 className='text-primary text-uppercase mb-3' style={{ letterSpacing: '5px' }}>Khóa học</h5>
                        {/* <h1>Our Popular Courses</h1> */}
                        <h1>Khóa học phổ biến</h1>
                    </div>
                    <div className='mb-5 d-flex justify-content-end'>
                        <SortCourseSelect
                            className='pd-0 col-12 col-sm-12 col-md-6 col-lg-4'
                            onChange={onChangeSort}
                            onReady={onChangeSort}
                        />
                    </div>
                    {
                        courseList?.length > 0 ?
                            <>
                                <div className='row'>
                                    {
                                        courseList.map(e => (
                                            <CourseCard key={e.id} course={{
                                                id: e.id,
                                                name: e.name,
                                                image: e.image,
                                                numberStudents: e.numberStudents,
                                                teacherName: e.teacher?.name,
                                                time: e.videoLength,
                                                rate: e.rate,
                                                numberVotes: e.numberVotes
                                            }} />
                                        ))
                                    }
                                </div>
                                {/* <Link to={SYSTEM_PATH.COURSE} className='text-center d-block'>View more</Link> */}
                                <Link to={SYSTEM_PATH.COURSE} className='text-center d-block'>Xem thêm</Link>
                            </>
                            :
                            // <div className='text-center h5 font-weight-normal'>There are no courses on the site yet. Please come back later.</div>
                            <div className='text-center h5 font-weight-normal'> Chưa có khóa học nào. Vui lòng quay lại sau.</div>
                    }
                </div>
            </div>
            {/* Courses End */}

            {/* Registration Start */}
            <div className='container-fluid bg-registration py-5' style={{ margin: '90px 0' }}>
                <div className='container py-5'>
                    <div className='row align-items-center'>
                        <div className='col-lg-7 mb-5 mb-lg-0'>
                            <div className='mb-4'>
                                {/* <h5 className='text-primary text-uppercase mb-3' style={{ letterSpacing: '5px' }}>Need Any Courses</h5> */}
                                <h5 className='text-primary text-uppercase mb-3' style={{ letterSpacing: '5px' }}>Bất kỳ khóa học nào</h5>
                                {/* <h1 className='text-white'>Join our courses now</h1> */}
                                <h1 className='text-white'>Hãy tham gia ngay khóa học của chúng tôi</h1>
                            </div>
                            <ul className='list-inline text-white m-0'>
                                {/* <li className='py-2'><i className='fa fa-check text-primary mr-3' />The courses are completely free</li> */}
                                <li className='py-2'><i className='fa fa-check text-primary mr-3' />Hoàn toàn miễn phí</li>
                                {/* <li className='py-2'><i className='fa fa-check text-primary mr-3' />High Quality</li> */}
                                <li className='py-2'><i className='fa fa-check text-primary mr-3' />Chất lượng cao</li>
                                {/* <li className='py-2'><i className='fa fa-check text-primary mr-3' />Good team of teachers.</li> */}
                                <li className='py-2'><i className='fa fa-check text-primary mr-3' />Đội ngũ giáo viên tuyển chọn</li>
                            </ul>
                        </div>
                        {
                            !token &&
                            <div className='col-lg-5'>
                                <button className='btn btn-primary btn-block border-0 py-3 d-flex justify-content-between align-items-center width-250 pd-lr-20'
                                    type='submit'
                                    onClick={() => navigate(SYSTEM_PATH.SIGNUP)}
                                >
                                    {/* <span>Sign Up Now</span> */}
                                    <span>Đăng ký ngay</span>
                                    <i className='fas fa-chevron-right'></i>
                                </button>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {/* Registration End */}

            {/* Team Start */}
            {
                teacherList?.length > 0 &&
                <div className='container-fluid py-5'>
                    <div className='container pt-5 pb-3'>
                        <div className='text-center mb-5'>
                            {/* <h5 className='text-primary text-uppercase mb-3' style={{ letterSpacing: '5px' }}>Teachers</h5> */}
                            <h5 className='text-primary text-uppercase mb-3' style={{ letterSpacing: '5px' }}>Giáo viên</h5>
                            {/* <h1>Meet Our Teachers</h1> */}
                            <h1>Đội ngũ giáo viên</h1>
                        </div>
                        <Slider
                            dots={true}
                            infinite={true}
                            speed={750}
                            slidesToShow={4}
                            slidesToScroll={4}
                            autoplay={true}
                            autoplaySpeed={3000}
                            responsive={[
                                {
                                    breakpoint: 1200,
                                    settings: {
                                        slidesToShow: 3,
                                        slidesToScroll: 3,
                                        infinite: true,
                                        dots: true
                                    }
                                },
                                {
                                    breakpoint: 920,
                                    settings: {
                                        slidesToShow: 2,
                                        slidesToScroll: 2,
                                        infinite: true,
                                        dots: true
                                    }
                                },
                                {
                                    breakpoint: 500,
                                    settings: {
                                        slidesToShow: 1,
                                        slidesToScroll: 1
                                    }
                                }
                            ]}>
                            {
                                teacherList.map(e => (
                                    <TeacherCard
                                        key={e.id}
                                        teacher={{
                                            name: e.name,
                                            subject: TEACHER_SUBJECT[e.subject].value,
                                            image: e.image,
                                            link: e.link
                                        }}
                                        className='text-center col-12'
                                    />
                                ))
                            }
                        </Slider>
                    </div>
                </div>
            }
            {/* Team End */}

        </>
    )
})

export default HomeScreen;