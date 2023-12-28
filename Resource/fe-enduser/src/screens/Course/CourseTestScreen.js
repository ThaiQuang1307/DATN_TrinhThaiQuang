/* eslint-disable max-len */
import { observer } from 'mobx-react';
import { useNavigate, useParams } from 'react-router-dom';
import { isNumeric } from '../../core/utils/common';
import { ReactNotifications, TopContent } from '../../components';
import { useEffect, useState } from 'react';
import { useStore } from '../../core/utils/hook';
import NotFoundScreen from '../404/NotFoundScreen';
import { useForm } from 'react-hook-form';
import yup from '../../core/utils/yupValidate';
import { yupResolver } from '@hookform/resolvers/yup';
import { MSG, SYSTEM_PATH } from '../../core/configs/constants';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import moment from 'moment';
import classNames from 'classnames';

const CourseTestScreen = observer(props => {

    // other
    const { id } = useParams();
    const navigate = useNavigate();

    // store
    const {
        authStore: { token, userInfo },
        courseStore: { course, getCourseDetail, submitTestAnswer },
        modalStore: { openAlert }
    } = useStore();

    // state
    const validateSchema = yup.object().shape({
        testQuestions: yup.array().of(
            yup.object().shape({
                question: yup.string(),
                answers: yup.array().of(yup.string()),
                correct: yup.lazy((value) => {
                    if (value === '') {
                        // return yup.string().required('Please choose the answer');
                        return yup.string().required('Hãy chọn câu trả lời');
                    } else return yup.number();
                }),
                isCorrect: yup.boolean().nullable()
            })
        )
    })

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues,
        setValue,
        reset,
        watch,
        trigger
    } = useForm({ resolver: yupResolver(validateSchema), mode: 'onChange', defaultValues: {} });

    const watchTestQuestions = watch('testQuestions');

    const [didTheTest, setDidTheTest] = useState(false);

    // lifecycle
    useEffect(() => {
        const getData = async () => {
            if (id && isNumeric(id)) {
                getCourseDetail(id);
            }
        }

        getData();
    }, [])

    useEffect(() => {
        if (course && course.testQuestions?.length > 0) {
            if (course?.isTeacher) {
                setValue('testQuestions', course.testQuestions);
            } else {
                setValue('testQuestions', course.testQuestions.map(e => ({ ...e, correct: '' })));
            }
        }
    }, [course])

    // function
    const onSubmitTestResult = async (data) => {
        const testQuestions = data?.testQuestions?.map(e => ({
            question: e.question,
            answers: e.answers,
            correct: e.correct
        }))

        if (!course?.isTeacher) {
            if (!didTheTest) {
                // openAlert('Are you sure submit answers?', async () => {
                openAlert('Bạn có chắc chắn gửi câu trả lời?', async () => {
                    const res = await submitTestAnswer(id, { testQuestions });
                    if (res) {
                        ReactNotifications('success', 'Gửi câu trả lời thành công');
                        setDidTheTest(true);
                        setValue('testQuestions', res);
                        getCourseDetail(id, null, true);
                    }
                })
            } else {
                navigate(0);
            }
        }
    }

    if ((id && !isNumeric(id)) || !course?.id) return <NotFoundScreen />

    return (
        <>
            <TopContent namePage={course?.name} breadcrumb={[course?.category?.name, course?.name, 'KIỂM TRA']} />

            <div className='container-fluid py-3'>
                <div className='container py-3'>
                    <div className='d-flex justify-content-center w-100'>
                        <div className='col-lg-8'>
                            {
                                (course?.testDate && !course?.isTeacher) &&
                                <div className='result-test mg-b-50 d-flex flex-column align-items-center flex-gap-10'>
                                    <div style={{ width: '200px', height: '200px' }}>
                                        {/* <CircularProgressbar minValue={0} maxValue={1} value={course?.score || 0} text={`Score: ${course?.score * 10}`} */}
                                        <CircularProgressbar minValue={0} maxValue={1} value={course?.score || 0} text={`Điểm: ${course?.score * 10}`}
                                            styles={buildStyles({
                                                textColor: '#FF6600',
                                                pathColor: '#FF6600',
                                                textSize: '16px'
                                            })} />
                                    </div>
                                    {/* <p>Lastest: {moment(course.testDate).format('DD MMM YYYY, hh:mmA')}</p> */}
                                    <p>Gần nhất: {moment(course.testDate).format('DD MMM YYYY, hh:mmA')}</p>
                                </div>
                            }
                            <form onSubmit={handleSubmit(onSubmitTestResult)}>
                                {
                                    watchTestQuestions?.length > 0 &&
                                    watchTestQuestions.map((tq, idx) => (
                                        <div key={idx} className='test-question'>
                                            <div className='question-index w-100'>{idx + 1}. <span style={{ wordBreak: 'break-word', whiteSpace: 'pre-line' }}>{watchTestQuestions[idx].question}</span></div>
                                            <div className='d-flex align-items-center w-100'>
                                                <div className='w-100'>
                                                    <div className='answer mg-t-10'>
                                                        <div className='w-100'>
                                                            {
                                                                tq.answers?.length > 0 &&
                                                                tq.answers.map((e, idx1) => {
                                                                    const isCheckTrue = getValues(`testQuestions.${idx}.isCorrect`) === true && getValues(`testQuestions.${idx}.beforeCorrect`) == idx1;
                                                                    const isCheckFalse = getValues(`testQuestions.${idx}.isCorrect`) === false && getValues(`testQuestions.${idx}.beforeCorrect`) == idx1;

                                                                    return (
                                                                        <div key={idx1} className='mg-b-10 d-flex align-items-center question-answer'>
                                                                            <input id={`testQuestions.${idx}.correct.${idx1}`} {...register(`testQuestions.${idx}.correct`)} value={idx1} type='radio'
                                                                                className={classNames(
                                                                                    'radio-custom',
                                                                                    ((course?.isTeacher && getValues(`testQuestions.${idx}.correct`) == idx1) || (course?.isJoinCourse)) ? 'visible' : 'invisible',
                                                                                    isCheckTrue && 'accent-color-green',
                                                                                    isCheckFalse && 'accent-color-red'
                                                                                )}
                                                                                disabled={didTheTest}
                                                                                readOnly={didTheTest}
                                                                            />
                                                                            <label htmlFor={`testQuestions.${idx}.correct.${idx1}`}
                                                                                className={classNames(
                                                                                    'mb-0 mg-l-10',
                                                                                    isCheckTrue && 'text-success',
                                                                                    isCheckFalse && 'text-danger'
                                                                                )}
                                                                            >
                                                                                {watchTestQuestions[idx].answers[idx1]}
                                                                            </label>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                            {
                                                                errors?.testQuestions?.[idx]?.correct &&
                                                                <div className='text-danger fs-error mg-t-5 pd-0'>{errors?.testQuestions?.[idx]?.correct?.message}</div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                        </div>
                                    ))
                                }
                                {
                                    !course?.isTeacher &&
                                    <div className='mg-t-20 text-center'>
                                        {
                                            !didTheTest ?
                                                // <button type='submit' className='btn btn-primary px-4 py-2'>Submit</button>
                                                <button type='submit' className='btn btn-primary px-4 py-2'>Nộp bài</button>
                                                :
                                                <div className='d-flex align-items-center justify-content-center flex-gap-20 flex-wrap'>
                                                    {/* <button type='button' className='btn btn-primary-outline px-4 py-2' style={{ 'minWidth': '205px' }} onClick={() => navigate(SYSTEM_PATH.MY_COURSE)}>Go to my courses</button> */}
                                                    <button type='button' className='btn btn-primary-outline px-4 py-2' style={{ 'minWidth': '205px' }} onClick={() => navigate(SYSTEM_PATH.MY_COURSE)}>Các khóa học của tôi</button>
                                                    {/* <button type='submit' className='btn btn-primary px-4 py-2' style={{ 'minWidth': '205px' }}>Take the test again</button> */}
                                                    <button type='submit' className='btn btn-primary px-4 py-2' style={{ 'minWidth': '205px' }}>Làm lại</button>
                                                </div>
                                        }
                                    </div>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})

export default CourseTestScreen