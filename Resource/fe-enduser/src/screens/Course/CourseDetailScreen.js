/* eslint-disable max-len */
import { observer } from 'mobx-react';
import { FullPagination, ReactNotifications, TopContent, VideoJS } from '../../components';
import { useStore } from '../../core/utils/hook';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { extractContent, isNumeric, toHoursAndMinutes, truncateByWords } from '../../core/utils/common';
import { useEffect, useMemo } from 'react';
import moment from 'moment';
import { MSG, SYSTEM_PATH } from '../../core/configs/constants';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { set, useForm } from 'react-hook-form';
import yup from '../../core/utils/yupValidate';
import { yupResolver } from '@hookform/resolvers/yup';
import NotFoundScreen from '../404/NotFoundScreen';

const CourseDetailScreen = observer((props) => {

    // other
    const { id } = useParams();
    const navigate = useNavigate();

    // store
    const {
        authStore: { token, userInfo },
        courseStore: { course, getCourseDetail, joinCourse, voteCourse, commentList, paging, getAllComment, clean, submitComment, updateTimeView, cleanCourseDetail },
        categoryStore: { categoryList },
        modalStore: { openAlert }
    } = useStore();

    // state
    const validateSchema = yup.object().shape({
        content: yup.string().required(MSG['error.required'])
    })

    const { handleSubmit, register, formState: { errors, isSubmitting }, setValue, watch } = useForm({
        resolver: yupResolver(validateSchema), mode: 'onChange', defaultValues: {
            vote: null
        }
    });
    const watchVote = watch('vote');

    const videoJsOptions = useMemo(() => {
        return {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            sources: [{
                src: course?.video,
                type: 'video/mp4'
            }]
        }
    }, [course?.video])

    const { hours, minutes, seconds } = useMemo(() => {
        if (course.lastTimeViewed) {
            return toHoursAndMinutes(course.lastTimeViewed)
        }
        return { hours: 0, minutes: 0, seconds: 0 }
    }, [course.lastTimeViewed]);

    // lifecycle
    useEffect(() => {
        const getData = async () => {
            if (id && isNumeric(id)) {
                getCourseDetail(id);
                onCommentPageChange(1);
            }
        }

        clean();
        cleanCourseDetail();
        getData();
        return () => {
            clean();
            cleanCourseDetail();
        }
    }, [])

    useEffect(() => {
        if (id && isNumeric(id) && course.id && course.vote) {
            setValue('vote', String(course.vote));
        }
    }, [course])

    useEffect(() => {
        if (id && isNumeric(id) && course.id && watchVote && watchVote != course.vote) {
            if (!token) {
                // openAlert(
                //     `<div>
                //         <div>Please login before voting.</div> 
                //         <div>If you don't have an account <a href='${SYSTEM_PATH.SIGNUP}'>Sign up now</a></div>
                //     </div>`
                //     , () => navigate(SYSTEM_PATH.LOGIN), 'small', 'Login', true);
                openAlert(
                    `<div>
                        <div>Vui lòng đăng nhập trước khi bình chọn.</div>
                        <div>Nếu bạn không có tài khoản <a href='${SYSTEM_PATH.SIGNUP}'>Đăng ký/a></div>
                    </div>`
                    // , () => navigate(SYSTEM_PATH.LOGIN), 'small', 'Login', true);
                    , () => navigate(SYSTEM_PATH.LOGIN), 'small', 'Đăng nhập', true);
            } else if (!course?.isJoinCourse) {
                // openAlert("You haven't taken this course yet");
                openAlert('Bạn chưa tham gia khóa học này');
                setValue('vote', null);
            } else {
                // openAlert('Are you sure submit a vote?', async () => {
                openAlert('Bạn có chắc chắn gửi đánh giá không?', async () => {
                    const res = await voteCourse(Number(id), {
                        vote: Number(watchVote)
                    });
                    if (res) {
                        // ReactNotifications('success', 'Vote submitted successfully');
                        ReactNotifications('success', 'Đã gửi phiếu bầu thành công');
                        getCourseDetail(id);
                    }
                })
            }
        }
    }, [watchVote])

    // function
    const onJoinCourse = async () => {
        if (!token) {
            // openAlert(
            //     `<div>
            //         <div>Please login to take this course.</div> 
            //         <div>If you don't have an account <a href='${SYSTEM_PATH.SIGNUP}'>Sign up now</a></div>
            //     </div>`
            //     , () => navigate(SYSTEM_PATH.LOGIN), 'small', 'Login', true);
            openAlert(
                `<div>
                    <div>Vui lòng đăng nhập để tham gia khóa học này.</div>
                    <div>Nếu bạn không có tài khoản <a href='${SYSTEM_PATH.SIGNUP}'>Đăng ký</a></div>
                </div>`
                // , () => navigate(SYSTEM_PATH.LOGIN), 'small', 'Login', true);
                , () => navigate(SYSTEM_PATH.LOGIN), 'small', 'Đăng nhập', true);
        } else {
            // openAlert('Are you sure take this course?', async () => {
            openAlert('Bạn có chắc chắn tham gia khóa học này không?', async () => {
                const res = await joinCourse(Number(id));
                if (res) {
                    // ReactNotifications('success', 'Join the course successfully');
                    ReactNotifications('success', 'Tham gia khóa học thành công');
                    getCourseDetail(id);
                }
                // }, 'small', 'Join now')
            }, 'small', 'Tham gia')
        }
    }

    const onSubmitComment = async (data) => {
        const { content } = data;
        if (!token) {
            // openAlert(
            //     `<div>
            //         <div>Please login before comment.</div> 
            //         <div>If you don't have an account <a href='${SYSTEM_PATH.SIGNUP}'>Sign up now</a></div>
            //     </div>`
            //     , () => navigate(SYSTEM_PATH.LOGIN), 'small', 'Login', true);
            openAlert(
                `<div>
                    <div>Vui lòng đăng nhập trước khi bình luận.</div>
                    <div>Nếu bạn không có tài khoản <a href='${SYSTEM_PATH.SIGNUP}'>Đăng ký</a></div>
                </div>`
                // , () => navigate(SYSTEM_PATH.LOGIN), 'small', 'Login', true);
                , () => navigate(SYSTEM_PATH.LOGIN), 'small', 'Đăng nhập', true);
        } else if (!course?.isJoinCourse && !course?.isTeacher) {
            // openAlert("You haven't taken this course yet");
            openAlert('Bạn chưa tham gia khóa học này');
        } else {
            const res = await submitComment(Number(id), {
                content
            });
            if (res) {
                // ReactNotifications('success', 'Comment submitted successfully');
                ReactNotifications('success', 'Đã gửi bình luận thành công');
                setValue('content', '');
                onCommentPageChange(1);
            }
        }
    }

    const onCommentPageChange = (page) => {
        getAllComment(Number(id), { page });
    }

    const onUpdateTime = (time) => {
        if (course?.id) {
            updateTimeView(course?.courseId, { timeView: time });
        }
    }

    if ((id && !isNumeric(id)) || !course?.id) return <NotFoundScreen />

    return (
        <>
            <TopContent namePage={course?.name} breadcrumb={[course?.category?.name, course?.name]} />

            {/* Detail Start */}
            <div className='container-fluid py-5'>
                <div className='container py-5'>
                    <div className='row'>
                        <div className='col-lg-8'>
                            <div className='mb-5'>
                                <div className='mb-3'>
                                    <div className='mb-2 d-flex align-items-center justify-content-between'>
                                        <h6 className='text-primary mg-0'>{moment(course?.createdAt).format('MMM DD, YYYY')}</h6>
                                        {
                                            (!course?.isJoinCourse && !course?.isTeacher) ?
                                                // <button className='btn btn-primary px-4 py-2' onClick={onJoinCourse}>Join</button>
                                                <button className='btn btn-primary px-4 py-2' onClick={onJoinCourse}>Tham gia</button>
                                                :
                                                (course?.testQuestions?.length > 0 && course?.lastTimeViewed > 0) &&
                                                // <button className='btn btn-primary px-4 py-2' onClick={() => navigate(`/course-test/${id}`)}>Take a test</button>
                                                <button className='btn btn-primary px-4 py-2' onClick={() => navigate(`/course-test/${id}`)}>Làm kiểm tra</button>

                                        }
                                    </div>
                                    <h1 className='text-break'>{course?.name}</h1>
                                </div>
                                {
                                    (!course?.isJoinCourse && !course?.isTeacher) ?
                                        <img className='img-fluid rounded w-100 mb-4' src={course?.image} alt='Image' />
                                        :
                                        <div className='mb-4'>
                                            {
                                                (course?.lastTimeViewed > 0 && !course?.isTeacher) &&
                                                // <small className='font-italic mg-b-5'>Watched: {hours > 0 && `${hours}h`} {minutes > 0 && `${minutes}m`} {seconds > 0 && hours < 1 && `${seconds}s`}</small>
                                                <small className='font-italic mg-b-5'>Đã xem: {hours > 0 && `${hours}h`} {minutes > 0 && `${minutes}m`} {seconds > 0 && hours < 1 && `${seconds}s`}</small>
                                            }
                                            <VideoJS
                                                options={videoJsOptions}
                                                isTimeUpdate={true && !course?.isTeacher}
                                                afterTime={10}
                                                disableForward={true && !course?.isTeacher}
                                                lastTimeViewed={course?.lastTimeViewed}
                                                onUpdateTime={onUpdateTime}
                                            />
                                        </div>
                                }
                                <div dangerouslySetInnerHTML={{ __html: course?.description }}></div>
                            </div>

                            {/* Rating */}
                            <div className='mb-5'>
                                {/* <h3 className='text-uppercase mb-4' style={{ letterSpacing: '5px' }}>Rating</h3> */}
                                <h3 className='mb-4' style={{ letterSpacing: '5px' }}>Đánh giá</h3>
                                <div className='d-flex align-items-center flex-wrap mg-t-20 flex-gap-10'>
                                    <div style={{ width: '75px', height: '75px' }}>
                                        <CircularProgressbar minValue={0} maxValue={5} value={course?.rate || 0} text={course?.rate && `${course.rate}☆`}
                                            styles={buildStyles({
                                                textColor: '#FF6600',
                                                pathColor: '#FF6600',
                                                textSize: '20px'
                                            })} />
                                    </div>
                                    {/* <div className='d-block d-sm-none'>({course?.numberVotes || 0} votes)</div> */}
                                    <div className='d-block d-sm-none'>({course?.numberVotes || 0} lượt)</div>
                                    {
                                        !course?.isTeacher &&
                                        <div className='rating'>
                                            <input type='radio' {...register('vote')} value={5} id='5' /><label className='mg-b-0' for='5'>☆</label>
                                            <input type='radio' {...register('vote')} value={4} id='4' /><label className='mg-b-0' for='4'>☆</label>
                                            <input type='radio' {...register('vote')} value={3} id='3' /><label className='mg-b-0' for='3'>☆</label>
                                            <input type='radio' {...register('vote')} value={2} id='2' /><label className='mg-b-0' for='2'>☆</label>
                                            <input type='radio' {...register('vote')} value={1} id='1' /><label className='mg-b-0' for='1'>☆</label>
                                        </div>
                                    }
                                    {/* <div className='d-none d-sm-block'>({course?.numberVotes || 0} votes)</div> */}
                                    <div className='d-none d-sm-block'>({course?.numberVotes || 0} lượt)</div>
                                </div>
                            </div>

                            {/* Comment List */}
                            <div className='mb-5'>
                                {/* <h3 className='text-uppercase mb-4' style={{ letterSpacing: '5px' }}>{commentList?.length || 0} Comments</h3> */}
                                <h3 className='text-uppercase mb-4' style={{ letterSpacing: '5px' }}>{commentList?.length || 0} Bình luận</h3>
                                {/* {/* Comment Form */}
                                <div className='bg-secondary rounded p-5 mb-4'>
                                    {/* <h3 className='text-uppercase mb-4' style={{ letterSpacing: '5px' }}>Leave a comment</h3> */}
                                    <h3 className='mb-4' style={{ letterSpacing: '5px' }}>Để lại bình luận</h3>
                                    <form onSubmit={handleSubmit(onSubmitComment)}>
                                        <div className='form-group'>
                                            <textarea {...register('content')} id='message' cols={30} rows={5} className='form-control border-0' />
                                            {
                                                errors?.content &&
                                                <p className='help-block error-validate text-danger'>{errors?.content?.message}</p>
                                            }
                                        </div>
                                        <div className='form-group mb-0'>
                                            {/* <button type='submit' disabled={isSubmitting} className='btn btn-primary py-md-2 px-md-4 font-weight-semi-bold'>Submit</button> */}
                                            <button type='submit' disabled={isSubmitting} className='btn btn-primary py-md-2 px-md-4 font-weight-semi-bold'>Gửi</button>
                                        </div>
                                    </form>
                                </div>
                                {
                                    commentList?.length > 0 &&
                                    commentList.map(e => (
                                        <div className='media mb-4' key={e.id}>
                                            <img src={e.user?.image || '/images/user-avatar-default.svg'} alt='Image' className='img-fluid rounded-circle mr-3 mt-1' style={{ width: '45px', height: '45px' }} />
                                            <div className='media-body'>
                                                {/* <h6>{userInfo?.id === e.user?.id ? 'You' : e.user?.name} <small><i>{moment(e.createdAt).format('DD MMM YYYY [-] hh:mmA')}</i></small></h6> */}
                                                <h6>{userInfo?.id === e.user?.id ? 'Bạn' : e.user?.name} <small><i>{moment(e.createdAt).format('DD MMM YYYY [-] hh:mmA')}</i></small></h6>
                                                <p>{e.content}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                                <div className='col-12'>
                                    <FullPagination
                                        siblingCount={0}
                                        totalRecords={paging.totalRecord}
                                        currentPage={paging.page}
                                        pageSize={paging.size}
                                        onPageChange={onCommentPageChange}
                                        previousLabel="«"
                                        nextLabel="»"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-4 mt-5 mt-lg-0'>
                            {/* Author Bio */}
                            <div className='d-flex flex-column text-center bg-dark rounded mb-5 py-5 px-4'>
                                <img src={course?.teacher?.image} className='img-fluid rounded-circle mx-auto mb-3' style={{ width: '100px' }} />
                                <h5 className='text-primary mb-3'>{course?.teacher?.name}</h5>
                                <div className='text-white text-justify'>{truncateByWords(extractContent(course?.teacher?.introduction), 300)?.text}</div>
                            </div>
                            {/* Category List */}
                            {
                                categoryList?.length > 0 &&
                                <div className='mb-5'>
                                    {/* <h3 className='text-uppercase mb-4' style={{letterSpacing: '5px'}}>Categories</h3> */}
                                    <h3 className='text-uppercase mb-4' style={{ letterSpacing: '5px' }}>Danh mục</h3>
                                    <ul className='list-group list-group-flush'>
                                        {
                                            categoryList.map(e => (
                                                <li key={e.id} className='list-group-item d-flex justify-content-between align-items-center px-0'>
                                                    <Link to={`${SYSTEM_PATH.COURSE}?categoryId=${e.id}`} className='text-decoration-none h6 m-0'>{e?.name}</Link>
                                                    <span className='badge badge-primary badge-pill'>{e?.numberCourses || 0}</span>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            }

                            {/* Recent Post */}
                            {/* <div className='mb-5'>
                                <h3 className='text-uppercase mb-4' style={{letterSpacing: '5px'}}>Recent Post</h3>
                                <a className='d-flex align-items-center text-decoration-none mb-3' href>
                                    <img className='img-fluid rounded' src='/images/blog-80x80.jpg' alt='' />
                                    <div className='pl-3'>
                                        <h6 className='m-1'>Diam lorem dolore justo eirmod lorem dolore</h6>
                                        <small>Jan 01, 2050</small>
                                    </div>
                                </a>
                                <a className='d-flex align-items-center text-decoration-none mb-3' href>
                                    <img className='img-fluid rounded' src='/images/blog-80x80.jpg' alt='' />
                                    <div className='pl-3'>
                                        <h6 className='m-1'>Diam lorem dolore justo eirmod lorem dolore</h6>
                                        <small>Jan 01, 2050</small>
                                    </div>
                                </a>
                                <a className='d-flex align-items-center text-decoration-none mb-3' href>
                                    <img className='img-fluid rounded' src='/images/blog-80x80.jpg' alt='' />
                                    <div className='pl-3'>
                                        <h6 className='m-1'>Diam lorem dolore justo eirmod lorem dolore</h6>
                                        <small>Jan 01, 2050</small>
                                    </div>
                                </a>
                            </div> */}
                            {/* Tag Cloud */}
                            {/* <div className='mb-5'>
                                <h3 className='text-uppercase mb-4' style={{letterSpacing: '5px'}}>Tag Cloud</h3>
                                <div className='d-flex flex-wrap m-n1'>
                                    <a href className='btn btn-outline-primary m-1'>Design</a>
                                    <a href className='btn btn-outline-primary m-1'>Development</a>
                                    <a href className='btn btn-outline-primary m-1'>Marketing</a>
                                    <a href className='btn btn-outline-primary m-1'>SEO</a>
                                    <a href className='btn btn-outline-primary m-1'>Writing</a>
                                    <a href className='btn btn-outline-primary m-1'>Consulting</a>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
            {/* Detail End */}

        </>
    )
})

export default CourseDetailScreen;