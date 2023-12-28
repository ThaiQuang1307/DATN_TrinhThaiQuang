/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable max-len */
import { observer } from 'mobx-react';
import { useForm } from 'react-hook-form';
import yup from '../../core/utils/yupValidate';
import { yupResolver } from '@hookform/resolvers/yup';
import { MIN_NUMBER_ANSWER, MSG, SCREEN_MODE, STATUS, SYSTEM_PATH } from '../../core/configs/constants';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../core/utils/hook';
import { useEffect } from 'react';
import { customToolBarEditorForCourse, isNumeric } from '../../core/utils/common';
import { loadFilePreview, loadURLPreview } from '../../core/utils/browser';
import { EditorCustom, ReactNotifications } from '../../components';

import './style.scss';

const SettingCourseScreen = observer(props => {

    // other
    const { mode, courseId } = props;
    const navigate = useNavigate();
    const id = useParams().id ?? courseId;

    // store
    const {
        categoryStore: { categoryOptions, getCategoryOptions },
        courseStore: { createCourse, course, getCourseInfo, setAttrObservable, updateCourse }
    } = useStore();

    // state
    const validateSettingCourseSchema = yup.object().shape({
        name: yup.string().trim().required(MSG['error.required']),
        categoryId: yup.string().required(MSG['error.required']),
        image: yup.mixed().transform((v) => {
            if (v instanceof FileList) {
                return v.length < 1 ? undefined : v[0];
            } else {
                return v;
            }
        }).required(MSG['error.required']),
        video: yup.mixed().transform((v) => {
            if (v instanceof FileList) {
                return v.length < 1 ? undefined : v[0];
            } else {
                return v;
            }
        }).required(MSG['error.required']),
        videoLength: yup.number(),
        description: yup.string(),
        testQuestions: yup.array().of(
            yup.object().shape({
                question: yup.string().required(MSG['error.required']),
                // answers: yup.array().of(yup.string().required(MSG['error.required'])).min(MIN_NUMBER_ANSWER, 'Please add at least 2 answers'),
                answers: yup.array().of(yup.string().required(MSG['error.required'])).min(MIN_NUMBER_ANSWER, 'Vui lòng thêm ít nhất 2 câu trả lời!'),
                correct: yup.lazy((value) => {
                    if (value === '') {
                        // return yup.string().required('Please choose the correct answer');
                        return yup.string().required('Hãy chọn câu trả lời đúng!');
                    } else return yup.number();
                })
            })
        ).min(1, 'Please add at least 1 question')
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
    } = useForm({
        resolver: yupResolver(validateSettingCourseSchema), mode: 'onChange', defaultValues: {
            testQuestions: []
        }
    });

    const watchImage = watch('image');
    const watchVideo = watch('video');
    const watchTestQuestions = watch('testQuestions');

    // lifecycle
    useEffect(() => {
        const getData = async () => {
            await getCategoryOptions({ status: STATUS.ACTIVE, short: true });
            if (id && isNumeric(id) && mode === SCREEN_MODE.EDIT) {
                getCourseInfo(id);
            }
        }

        getData();

        return () => {
            setAttrObservable('course', {});
        }
    }, [mode])

    useEffect(() => {
        if (id && isNumeric(id) && mode === SCREEN_MODE.EDIT && course.id) {
            const { name, categoryId, image, video, videoLength, description, testQuestions } = course;
            reset({ name, categoryId: String(categoryId), image, video, videoLength, description, testQuestions });
        }
    }, [course])

    useEffect(() => {
        if (watchImage instanceof FileList) {
            if (watchImage.length > 0) {
                loadFilePreview(watchImage[0], 'preview-image');
            } else {
                loadURLPreview('/images/image-default.png', 'preview-image');
            }
        } else if (typeof watchImage === 'string' || watchImage instanceof String) {
            loadURLPreview(watchImage || '/images/image-default.png', 'preview-image');
        } else {
            loadURLPreview('/images/image-default.png', 'preview-image');
        }
    }, [watchImage])

    useEffect(() => {
        if (watchVideo instanceof FileList) {
            if (watchVideo.length > 0) {
                loadFilePreview(watchVideo[0], 'preview-video', (duration => setValue('videoLength', Number(duration ?? 0).toFixed(1), { shouldValidate: true })));
            }
        } else if (typeof watchVideo === 'string' || watchVideo instanceof String) {
            loadURLPreview(watchVideo, 'preview-video');
        }
    }, [watchVideo])

    // function
    const onRemoveFile = (nameField) => {
        setValue(nameField, undefined, { shouldValidate: true });
        if (nameField === 'video') {
            setValue('videoLength', 0);
        }
    }

    const addNewQuestion = () => {
        setValue('testQuestions', [
            ...(watchTestQuestions ?? []),
            {
                question: '',
                answers: Array.from({ length: MIN_NUMBER_ANSWER }, (_, i) => ''),
                correct: ''
            }
        ])
        trigger('testQuestions');
    }

    const deleteQuestion = (index) => {
        setValue('testQuestions', [
            ...watchTestQuestions.slice(0, index),
            ...watchTestQuestions.slice(index + 1)
        ])
        trigger('testQuestions');
    }

    const addNewAnswer = (indexQuestion) => {
        setValue('testQuestions', [
            ...watchTestQuestions.slice(0, indexQuestion),
            {
                ...watchTestQuestions[indexQuestion],
                answers: [
                    ...watchTestQuestions[indexQuestion].answers,
                    ''
                ]
            },
            ...watchTestQuestions.slice(indexQuestion + 1)
        ])
        trigger('testQuestions');
    }

    const deleteAnswer = (indexQuestion, indexAnswer) => {
        if (watchTestQuestions[indexQuestion].correct == indexAnswer) {
            watchTestQuestions[indexQuestion].correct = '';
        }

        setValue('testQuestions', [
            ...watchTestQuestions.slice(0, indexQuestion),
            {
                ...watchTestQuestions[indexQuestion],
                answers: [
                    ...watchTestQuestions[indexQuestion]?.answers?.slice(0, indexAnswer),
                    ...watchTestQuestions[indexQuestion]?.answers?.slice(indexAnswer + 1)
                ]
            },
            ...watchTestQuestions.slice(indexQuestion + 1)
        ])
        trigger('testQuestions');
    }

    const onSubmitSettingCourse = async (data) => {
        const { name, categoryId, image, video, videoLength, description, testQuestions } = data;
        let res;
        if (mode === SCREEN_MODE.ADD) {
            res = await createCourse({
                name, categoryId: Number(categoryId), image, video, videoLength, description, testQuestions
            });
        } else if (mode === SCREEN_MODE.EDIT && id && isNumeric(id)) {
            res = await updateCourse(id, {
                name, categoryId: Number(categoryId), image, video, videoLength, description, testQuestions
            })
        }

        if (res) {
            ReactNotifications('success', mode === 0 ? MSG['inform.success.create'] : MSG['inform.success.update']);
            if (mode === SCREEN_MODE.ADD) {
                navigate(SYSTEM_PATH.COURSE_MANAGEMENT);
            }
        }
    }

    if (id && !isNumeric(id)) return <NotFoundScreen />

    return (
        <div className='setting-course-screen'>
            {
                // mode === SCREEN_MODE.ADD && <h3 className='text-primary'>Create new course</h3>
                mode === SCREEN_MODE.ADD && <h3 className='text-primary'>Thêm khóa học mới</h3>
            }
            <div className='mg-t-50'>
                <form onSubmit={handleSubmit(onSubmitSettingCourse)}>
                    <div className='d-flex'>
                        <div className='col-7 pd-0'>
                            <div className='d-flex control-group'>
                                {/* <label className='field-required col-2-5'>Course name</label> */}
                                <label className='field-required col-2-5'>Tên khóa học</label>
                                <div className='col-9-5'>
                                    <input {...register('name')} className='form-control w-100' />
                                    {
                                        errors.name &&
                                        <p className='help-block error-validate text-danger'>{errors?.name?.message}</p>
                                    }
                                </div>
                            </div>
                            <div className='d-flex control-group mg-t-30'>
                                {/* <label className='field-required col-2-5'>Category</label> */}
                                <label className='field-required col-2-5'>Danh mục</label>
                                <div className='col-9-5'>
                                    <select {...register('categoryId')} className='form-control w-100'>
                                        {/* <option value={''}>Please select category</option> */}
                                        <option value={''}>-- Chọn danh mục --</option>
                                        {
                                            categoryOptions?.length > 0 &&
                                            categoryOptions.map(e => <option key={e.id} value={e.id}>{e.name}</option>)
                                        }
                                    </select>
                                    {
                                        errors.categoryId &&
                                        <p className='help-block error-validate text-danger'>{errors?.categoryId?.message}</p>
                                    }
                                </div>
                            </div>
                            <div className='d-flex control-group mg-t-30'>
                                <label className='field-required col-2-5'>Video</label>
                                <div className='col-9-5'>
                                    <div className='d-flex flex-column align-items-center width-350'>
                                        <div className='position-relative'>
                                            {
                                                ((watchVideo instanceof FileList && watchVideo.length > 0)
                                                    || ((typeof watchVideo === 'string' || watchVideo instanceof String) && watchVideo !== '')) ?
                                                    <>
                                                        <video id='preview-video' width={350} controls>
                                                            {/* Your browser does not support video or video does not exist. */}
                                                            Trình duyệt của bạn không hỗ trợ video hoặc video không tồn tại!
                                                        </video>
                                                        <i onClick={() => onRemoveFile('video')} role='button'
                                                            className='fas fa-times-circle text-danger position-absolute font-size-20'
                                                            style={{ top: '0px', right: '0px' }} />
                                                    </>
                                                    :
                                                    <img src={'/images/video-default.jpg'} className='width-350' />
                                            }
                                        </div>
                                        <input id='video' type={'file'} {...register('video')} accept='video/mp4' className='w-100' hidden />
                                        <label htmlFor='video' className='mg-t-5' role='button'>
                                            {/* <i className='fas fa-upload mg-r-5'></i> Select video */}
                                            <i className='fas fa-upload mg-r-5'></i> Chọn video
                                        </label>
                                        {
                                            errors.video &&
                                            <p className='help-block error-validate text-danger'>{errors?.video?.message}</p>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex control-group mg-t-20'>
                                {/* <label className='field-required col-2-5'>Video length</label> */}
                                <label className='field-required col-2-5'>Thời lượng</label>
                                <div className='col-9-5'>
                                    {getValues('videoLength') || 0}s
                                </div>
                            </div>
                            <div className='d-flex control-group mg-t-30'>
                                {/* <label className='col-2-5'>Description</label> */}
                                <label className='col-2-5'>Mô tả</label>
                                <div className='col-9-5'>
                                    <EditorCustom
                                        data={getValues('description')}
                                        onChange={(e, editor) => setValue('description', editor.getData() || '', { shouldValidate: true })}
                                        toolbarCustomItems={customToolBarEditorForCourse}
                                    />
                                    {
                                        errors.description &&
                                        <p className='help-block error-validate text-danger'>{errors?.description?.message}</p>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='col-5 d-flex align-items-center flex-column flex-gap-1'>
                            <div className='position-relative'>
                                <img id='preview-image' className='max-width-300' />
                                {
                                    ((watchImage instanceof FileList && watchImage.length > 0)
                                        || ((typeof watchImage === 'string' || watchImage instanceof String) && watchImage !== '')) &&
                                    <i onClick={() => onRemoveFile('image')} role='button'
                                        className='fas fa-times-circle text-danger position-absolute font-size-20'
                                        style={{ top: '0px', right: '0px' }} />
                                }
                            </div>
                            <input id='image' type={'file'} {...register('image')} accept='image/png, image/jpeg' className='w-100' hidden />
                            <label htmlFor='image' className='mg-t-5'>
                                {/* <i className='fas fa-upload fa-upload mg-r-5'></i> Select image */}
                                <i className='fas fa-upload fa-upload mg-r-5'></i> Chọn ảnh
                            </label>
                            {
                                errors.image &&
                                <p className='help-block error-validate text-danger'>{errors?.image?.message}</p>
                            }
                        </div>
                    </div>
                    <div className='list-question border-top'>
                        {/* <h4>Questions</h4> */}
                        <h4>Danh sách câu hỏi</h4>
                        <div className='mg-t-30'>
                            {
                                watchTestQuestions?.length > 0 &&
                                watchTestQuestions.map((tq, idx) => (
                                    <div key={idx} className='test-question'>
                                        <div className='question-index col-7-5'>{idx + 1}.</div>
                                        <div className='row align-items-center'>
                                            <div className='col-7 pd-l-60'>
                                                <div className='question row mg-t-10 control-group'>
                                                    <div className='field-required col-2-5'>Câu hỏi</div>
                                                    <div className='col-9-5'>
                                                        <textarea {...register(`testQuestions.${idx}.question`)} className='w-100 form-control' />
                                                        {
                                                            errors?.testQuestions?.[idx]?.question &&
                                                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors?.testQuestions?.[idx]?.question?.message}</div>
                                                        }
                                                    </div>
                                                </div>
                                                <div className='answer row mg-t-10'>
                                                    <div className='field-required col-2-5'>Đáp án</div>
                                                    <div className='col-9-5'>
                                                        {
                                                            tq.answers?.length > 0 &&
                                                            tq.answers.map((e, idx1) =>
                                                                <div key={idx1} className='mg-b-10 d-flex justify-content-between align-items-start control-group'>
                                                                    <input {...register(`testQuestions.${idx}.correct`)} value={idx1} type='radio' className='mg-t-10' />
                                                                    <div className='col-11'>
                                                                        <div className='d-flex justify-content-between align-items-center'>
                                                                            <input {...register(`testQuestions.${idx}.answers.${idx1}`)} className='w-100 form-control' />
                                                                            <i className='fas fa-times text-danger mg-l-20' role='button' onClick={() => deleteAnswer(idx, idx1)}></i>
                                                                        </div>
                                                                        {
                                                                            errors?.testQuestions?.[idx]?.answers?.[idx1] &&
                                                                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors?.testQuestions?.[idx]?.answers?.[idx1]?.message}</div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                        {
                                                            errors?.testQuestions?.[idx]?.answers &&
                                                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors?.testQuestions?.[idx]?.answers?.message}</div>
                                                        }
                                                        {
                                                            errors?.testQuestions?.[idx]?.correct &&
                                                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors?.testQuestions?.[idx]?.correct?.message}</div>
                                                        }
                                                        <div className='mg-t-10 d-flex align-items-center flex-gap-5 text-info' role='button' onClick={() => addNewAnswer(idx)}>
                                                            {/* <i className='fas fa-plus-circle' style={{ fontSize: '18px' }} /> <span>Add new answer</span> */}
                                                            <i className='fas fa-plus-circle' style={{ fontSize: '18px' }} /> <span>Thêm câu trả lời</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-3 pd-l-30'>
                                                <i className='fas fa-trash text-danger' role='button' onClick={() => deleteQuestion(idx)}></i>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className='mg-t-30 d-flex align-items-center flex-gap-5 text-success' role='button' onClick={addNewQuestion}>
                            {/* <i className='fas fa-plus-circle' style={{ fontSize: '24px' }} /> <span>Add new question</span> */}
                            <i className='fas fa-plus-circle' style={{ fontSize: '24px' }} /> <span>Thêm câu hỏi</span>
                        </div>
                        {
                            errors?.testQuestions &&
                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors.testQuestions?.message}</div>
                        }
                    </div>
                    <div className='d-flex justify-content-center flex-gap-50 mg-t-30 border-top pd-t-30'>
                        <button type='button' className='btn btn-secondary py-2 width-150'
                            onClick={() => navigate(SYSTEM_PATH.COURSE_MANAGEMENT)}>
                            {/* Cancel */}
                            Hủy
                        </button>
                        <button type={'submit'} disabled={isSubmitting}
                            className='btn btn-primary py-2 width-150'>
                            {mode === SCREEN_MODE.ADD ? 'Tạo mới' : 'Cập nhật'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
})

export default SettingCourseScreen;