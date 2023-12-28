/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable max-len */
import { observer } from 'mobx-react';
import { COURSE_IMAGE_SIZE, MIN_NUMBER_ANSWER, MSG, ROLE, SCREEN_MODE, STATUS_KEY_STRING, SYSTEM_PATH } from '../../core/configs/constants';
import { useStore, useTitle } from '../../core/utils/hook';
import { useForm } from 'react-hook-form';
import yup from '../../core/utils/yupValidate';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { customToolBarEditorForCourse, isNumeric } from '../../core/utils/common';
import { EditorCustom, ReactNotifications } from '../../components';
import { useEffect } from 'react';
import NotFoundScreen from '../404/NotFoundScreen';
import { useTranslation } from 'react-i18next';
import { loadFilePreview, loadURLPreview } from '../../core/utils/browser';
import './style.scss';

const SettingCourseScreen = observer(props => {

    // translation
    const { t, i18n: { language } } = useTranslation();

    // other
    const { mode } = props;
    const titlePage = mode === SCREEN_MODE.ADD ? t('settingCourseScreen.titleCreateCourse') : t('settingCourseScreen.titleUpdateCourse');
    useTitle(titlePage);
    const navigate = useNavigate();
    const { id } = useParams();

    // store
    const {
        categoryStore: { categoryOptions, getCategoryOptions },
        userStore: { userOptions, getUserOptions },
        courseStore: { createCourse, course, getCourse, setAttrObservable, updateCourse }
    } = useStore();

    // state
    const validateSettingCourseSchema = yup.object().shape({
        name: yup.string().trim().required(MSG['error.required'][language]),
        categoryId: yup.string().required(MSG['error.required'][language]),
        teacherId: yup.string().required(MSG['error.required'][language]),
        image: yup.mixed().transform((v) => {
            if (v instanceof FileList) {
                return v.length < 1 ? undefined : v[0];
            } else {
                return v;
            }
        }).required(MSG['error.required'][language]),
        ratio: yup.lazy((value) => {
            if (value === null || value === undefined) {
                return yup.number().nullable(true)
            }
            return yup.number().checkEqualValue(COURSE_IMAGE_SIZE, 'Please choose a photo with an aspect ratio of 3:2')
        }),
        video: yup.mixed().transform((v) => {
            if (v instanceof FileList) {
                return v.length < 1 ? undefined : v[0];
            } else {
                return v;
            }
        }).required(MSG['error.required'][language]),
        videoLength: yup.number(),
        description: yup.string(),
        testQuestions: yup.array().of(
            yup.object().shape({
                question: yup.string().required(MSG['error.required'][language]),
                answers: yup.array().of(yup.string().required(MSG['error.required'][language])).min(MIN_NUMBER_ANSWER, 'Vui lòng thêm ít nhất 2 câu trả lời!'),
                correct: yup.lazy((value) => {
                    if (value === '') {
                        return yup.string().required('Vui lòng chọn một đáp án đúng!');
                    } else return yup.number();
                })
            })
        ).min(1, 'Vui lòng thêm ít nhất 1 câu hỏi!')
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
        if (watchImage instanceof FileList) {
            if (watchImage.length > 0) {
                loadFilePreview(watchImage[0], 'preview-image', null, (({ width, height }) => setValue('ratio', (width / height).toFixed(1), { shouldValidate: true })));
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

    // lifecycle
    useEffect(() => {
        const getData = async () => {
            await getCategoryOptions({ status: STATUS_KEY_STRING.ACTIVE, short: true });
            await getUserOptions({ status: STATUS_KEY_STRING.ACTIVE, short: true, roleId: ROLE.ROLE_TEACHER });
            if (id && isNumeric(id) && mode === SCREEN_MODE.EDIT) {
                getCourse(id);
            }
        }

        getData();

        return () => {
            setAttrObservable('course', {});
        }
    }, [mode])

    useEffect(() => {
        if (id && isNumeric(id) && mode === SCREEN_MODE.EDIT && course) {
            const { name, categoryId, image, teacherId, video, videoLength, description, testQuestions } = course;
            reset({ name, categoryId: String(categoryId), image, teacherId: String(teacherId), video, videoLength, description, testQuestions });
        }
    }, [course])

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
        const { name, categoryId, image, teacherId, video, videoLength, description, testQuestions } = data;
        let res;
        if (mode === SCREEN_MODE.ADD) {
            res = await createCourse({
                name, categoryId: Number(categoryId), image, teacherId: Number(teacherId), video, videoLength, description, testQuestions
            });
        } else if (mode === SCREEN_MODE.EDIT && id && isNumeric(id)) {
            res = await updateCourse(id, {
                name, categoryId: Number(categoryId), image, teacherId: Number(teacherId), video, videoLength, description, testQuestions
            })
        }

        if (res) {
            ReactNotifications('success', mode === 0 ? MSG['inform.success.create'][language] : MSG['inform.success.update'][language]);
            navigate(SYSTEM_PATH.COURSE_MANAGEMENT);
        }
    }

    if (id && !isNumeric(id)) return <NotFoundScreen />

    return (
        <div className='setting-course-screen'>
            <div className='container-title'>{titlePage}</div>
            <div className='container-content-form'>
                <form onSubmit={handleSubmit(onSubmitSettingCourse)}>
                    <div className='row'>
                        <div className='col-7'>
                            <div className='row'>
                                <label className='field-required col-2-5'>{t('settingCourseScreen.courseName')}</label>
                                <div className='col-9'>
                                    <input {...register('name')} className='w-100' />
                                    {
                                        errors.name &&
                                        <div className='text-danger fs-error mg-t-5 pd-0'>{errors.name?.message}</div>
                                    }
                                </div>
                            </div>
                            <div className='row mg-t-20'>
                                <label className='field-required col-2-5'>{t('settingCourseScreen.category')}</label>
                                <div className='col-9'>
                                    <select {...register('categoryId')} className='col-12'>
                                        <option value={''}>{t('settingCourseScreen.selectCategory')}</option>
                                        {
                                            categoryOptions?.length > 0 &&
                                            categoryOptions.map(e => <option key={e.id} value={e.id}>{e.name}</option>)
                                        }
                                    </select>
                                    {
                                        errors.categoryId &&
                                        <div className='text-danger fs-error mg-t-5 pd-0'>{errors.categoryId?.message}</div>
                                    }
                                </div>
                            </div>
                            <div className='row mg-t-20'>
                                <label className='field-required col-2-5'>{t('settingCourseScreen.teacher')}</label>
                                <div className='col-9'>
                                    <select {...register('teacherId')} className='col-12'>
                                        <option value={''}>{t('settingCourseScreen.selectTeacher')}</option>
                                        {
                                            userOptions?.length > 0 &&
                                            userOptions.map(e => <option key={e.id} value={e.id}>{e.name}</option>)
                                        }
                                    </select>
                                    {
                                        errors.teacherId &&
                                        <div className='text-danger fs-error mg-t-5 pd-0'>{errors.teacherId?.message}</div>
                                    }
                                </div>
                            </div>
                            <div className='row mg-t-20'>
                                <label className='field-required col-2-5'>{t('settingCourseScreen.video')}</label>
                                <div className='col-9'>
                                    <div className='d-flex flex-column align-items-center width-255'>
                                        <div className='position-relative'>
                                            {
                                                ((watchVideo instanceof FileList && watchVideo.length > 0)
                                                    || ((typeof watchVideo === 'string' || watchVideo instanceof String) && watchVideo !== '')) ?
                                                    <>
                                                        <video id='preview-video' width={255} controls>
                                                            Your browser does not support video or video does not exist.
                                                        </video>
                                                        <i onClick={() => onRemoveFile('video')} role='button'
                                                            className='fa fa-light fa-circle-xmark text-danger position-absolute top-0 end-0 font-size-20' />
                                                    </>
                                                    :
                                                    <img src={'/images/video-default.jpg'} className='width-255' />
                                            }
                                        </div>
                                        <input id='video' type={'file'} {...register('video')} accept='video/mp4' className='w-100' hidden />
                                        <label htmlFor='video' className='mg-t-5'>
                                            <i className='fa fa-light fa-upload mg-r-5'></i> {t('common.selectVideo')}
                                        </label>
                                        {
                                            errors.video &&
                                            <div className='text-danger fs-error mg-t-5 pd-0 align-self-start'>{errors.video?.message}</div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='row mg-t-20'>
                                <label className='field-required col-2-5'>{t('settingCourseScreen.videoLength')}</label>
                                <div className='col-9'>
                                    {getValues('videoLength') || 0}s
                                </div>
                            </div>
                            <div className='row mg-t-20'>
                                <label className='col-2-5'>{t('settingCourseScreen.description')}</label>
                                <div className='col-9'>
                                    <EditorCustom
                                        data={getValues('description')}
                                        onChange={(e, editor) => setValue('description', editor.getData() || '', { shouldValidate: true })}
                                        toolbarCustomItems={customToolBarEditorForCourse}
                                    />
                                    {
                                        errors.description &&
                                        <div className='text-danger fs-error mg-t-5 pd-0'>{errors.description?.message}</div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='col-5 d-flex align-items-center flex-column flex-gap-1'>
                            <div className='position-relative'>
                                <img id='preview-image' className='width-255' />
                                {
                                    ((watchImage instanceof FileList && watchImage.length > 0)
                                        || ((typeof watchImage === 'string' || watchImage instanceof String) && watchImage !== '')) &&
                                    <i onClick={() => onRemoveFile('image')} role='button'
                                        className='fa fa-light fa-circle-xmark text-danger position-absolute top-0 end-0 font-size-20' />
                                }
                            </div>
                            <input id='image' type={'file'} {...register('image')} accept='image/png, image/jpeg' className='w-100' hidden />
                            <label htmlFor='image' className='mg-t-5'>
                                <i className='fa fa-light fa-upload mg-r-5'></i> {t('common.selectImage')}
                            </label>
                            {
                                errors.image &&
                                <div className='text-danger fs-error mg-t-5 pd-0'>{errors.image?.message}</div>
                            }
                            {
                                errors.ratio && !errors.image &&
                                <div className='text-danger fs-error mg-t-5 pd-0'>{errors.ratio?.message}</div>
                            }
                        </div>
                    </div>
                    <div className='list-question'>
                        <div className='fs-heading-normal fw-bolder'>Câu hỏi</div>
                        <div className='mg-t-30'>
                            {
                                watchTestQuestions?.length > 0 &&
                                watchTestQuestions.map((tq, idx) => (
                                    <div key={idx} className='test-question'>
                                        <div className='question-index col-7-5'>{idx + 1}.</div>
                                        <div className='row align-items-center'>
                                            <div className='col-7'>
                                                <div className='question row mg-t-10'>
                                                    <div className='field-required col-2-5'>Câu hỏi</div>
                                                    <div className='col-9'>
                                                        <textarea {...register(`testQuestions.${idx}.question`)} className='w-100' />
                                                        {
                                                            errors?.testQuestions?.[idx]?.question &&
                                                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors?.testQuestions?.[idx]?.question?.message}</div>
                                                        }
                                                    </div>
                                                </div>
                                                <div className='answer row mg-t-10'>
                                                    <div className='field-required col-2-5'>Đáp án</div>
                                                    <div className='col-9'>
                                                        {
                                                            tq.answers?.length > 0 &&
                                                            tq.answers.map((e, idx1) =>
                                                                <div key={idx1} className='mg-b-10 d-flex justify-content-between align-items-start'>
                                                                    <input {...register(`testQuestions.${idx}.correct`)} value={idx1} type='radio' className='mg-t-10 scale-radio' />
                                                                    <div className='col-11'>
                                                                        <div className='d-flex justify-content-between align-items-center'>
                                                                            <input {...register(`testQuestions.${idx}.answers.${idx1}`)} className='w-100' />
                                                                            <i className='fa-solid fa-xmark text-danger mg-l-20' role='button' onClick={() => deleteAnswer(idx, idx1)}></i>
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
                                                            <i className='fa-solid fa-circle-plus' style={{ fontSize: '18px' }} /> <span>Thêm đáp án</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col-3'>
                                                <i className='fa-solid fa-trash text-danger' role='button' onClick={() => deleteQuestion(idx)}></i>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className='mg-t-30 d-flex align-items-center flex-gap-5 text-success' role='button' onClick={addNewQuestion}>
                            <i className='fa-solid fa-circle-plus fs-heading-normal' /> <span>Thêm câu hỏi mới</span>
                        </div>
                        {
                            errors?.testQuestions &&
                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors.testQuestions?.message}</div>
                        }
                    </div>
                    <div className='container-form-footer'>
                        <button type='button' className='btn btn-default-1 width-150'
                            onClick={() => navigate(SYSTEM_PATH.COURSE_MANAGEMENT)}>
                            {t('common.cancel')}
                        </button>
                        <button type={'submit'} disabled={isSubmitting}
                            className='btn btn-default-2 mg-l-50 width-150'>
                            {mode === SCREEN_MODE.ADD ? t('common.create') : t('common.update')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
})

export default SettingCourseScreen;