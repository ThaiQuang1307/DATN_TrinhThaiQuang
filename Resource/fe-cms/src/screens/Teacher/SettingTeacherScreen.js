import { observer } from 'mobx-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '../../core/utils/yupValidate';
import { useStore, useTitle } from '../../core/utils/hook';
import { MSG, SCREEN_MODE, ROLE, TEACHER_SUBJECT, SYSTEM_PATH, TEACHER_IMAGE_SIZE } from '../../core/configs/constants';
import { useEffect } from 'react';
import { EditorCustom, ReactNotifications } from '../../components';
import { useTranslation } from 'react-i18next';
import { customToolBarEditor, customToolBarEditorForTeacher, isNumeric } from '../../core/utils/common';
import { useNavigate, useParams } from 'react-router-dom';
import { loadFilePreview, loadURLPreview } from '../../core/utils/browser';

const SettingTeacherScreen = observer((props) => {

    // translation
    const { t, i18n: { language } } = useTranslation();

    // props
    const { mode } = props;
    const titlePage = mode === SCREEN_MODE.ADD ? t('settingTeacherScreen.titleCreateTeacher') : t('settingTeacherScreen.titleUpdateTeacher');
    useTitle(titlePage);
    const navigate = useNavigate();
    const { id } = useParams();

    // store
    const {
        userStore: { createUser, clean, getUser, user, setAttrObservable, updateUser },
        modalStore: { hide }
    } = useStore();

    // state
    const validateSchema = yup.object().shape({
        name: yup.string().trim().required(MSG['error.required'][language]),
        email: yup.string().email(MSG['error.email_format'][language]).required(MSG['error.required'][language]),
        subject: yup.string().required(MSG['error.required'][language]),
        introduction: yup.string(),
        image: yup.mixed().transform((v) => {
            if(v instanceof FileList) {
                return v.length < 1 ? undefined : v[0];
            } else {
                return v;
            }
        }).required(MSG['error.required'][language]),
        ratio: yup.lazy((value) => {
            if(value === null || value === undefined) {
                return yup.number().nullable(true)
            } 
            return yup.number().checkEqualValue(TEACHER_IMAGE_SIZE, 'Please choose a photo with an aspect ratio of 1:1')
        }),
        link: yup.object({
            twitter: yup.string().isValidUrl(MSG['error.url'][language]),
            facebook: yup.string().isValidUrl(MSG['error.url'][language]),
            linkedin: yup.string().isValidUrl(MSG['error.url'][language])
        }),
        roleId: yup.number().required(MSG['error.required'][language])
    })

    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting }, 
        reset,
        getValues,
        setValue,
        watch
    } = useForm({ resolver: yupResolver(validateSchema), mode: 'onChange' });

    const watchImage = watch('image');

    // lifecycle
    useEffect(() => {
        if(watchImage instanceof FileList) {
            if(watchImage.length > 0) {
                loadFilePreview(watchImage[0], 'preview-image', 
                    null, (({ width, height }) => setValue('ratio', (width/height).toFixed(1), { shouldValidate: true })));
            } else {
                loadURLPreview('/images/image-default.png', 'preview-image');
            }
        } else if(typeof watchImage === 'string' || watchImage instanceof String) {
            loadURLPreview(watchImage || '/images/image-default.png', 'preview-image');
        } else {
            loadURLPreview('/images/image-default.png', 'preview-image');
        }
    }, [watchImage])

    useEffect(() => {
        if(id && isNumeric(id) && mode === SCREEN_MODE.EDIT) {
            getUser(id);
        }
        return () => {
            setAttrObservable('user', {});
        }
    }, [mode])

    useEffect(() => {
        const { name, email, subject, introduction, link, image } = user;
        reset((user && mode === SCREEN_MODE.EDIT && id && isNumeric(id)) ? 
            { name, email, subject, introduction, link, image, roleId: ROLE.ROLE_TEACHER } 
            : 
            { subject: '', roleId: ROLE.ROLE_TEACHER });
    }, [user])

    // function
    const onRemoveImage = () => {
        setValue('image', undefined, { shouldValidate: true });
    }

    const onSubmitSettingTeacher = async (data) => {
        const { name, email, subject, introduction, image, link, roleId } = data;
        let res;
        if(mode === SCREEN_MODE.ADD) {
            res = await createUser({ name, email, subject, introduction, image, link, roleId });
        } else if (mode === SCREEN_MODE.EDIT) {
            res = await updateUser(id, { name, email, subject, introduction, image, link });
        }

        if(res) {
            ReactNotifications('success', mode === 0 ? MSG['inform.success.create'][language] : MSG['inform.success.update'][language]);
            if(mode === SCREEN_MODE.ADD) clean();
            navigate(SYSTEM_PATH.TEACHER_MANAGEMENT);
        }
    }

    if(id && !isNumeric(id)) return <NotFoundScreen/>

    return(
        <div className='setting-teacher-screen pd-30'>
            <div className='container-title'>{titlePage}</div>
            <div className='container-content-form'>
                <form onSubmit={handleSubmit(onSubmitSettingTeacher)}>
                    <div className='row'>
                        <div className='col-7'>
                            <div className='row'>
                                <label className='field-required col-2-5'>{t('settingTeacherScreen.fullName')}</label>
                                <div className='col-9'>
                                    <input {...register('name')} className='w-100'/>
                                    {
                                        errors.name &&
                                <div className='text-danger fs-error mg-t-5 pd-0'>{errors.name?.message}</div>
                                    }
                                </div>
                            </div>
                            <div className='row mg-t-20'>
                                <label className='field-required col-2-5'>{t('settingTeacherScreen.email')}</label>
                                <div className='col-9'>
                                    <input {...register('email')} className='w-100'/>
                                    {
                                        errors.email &&
                                        <div className='text-danger fs-error mg-t-5 pd-0'>{errors.email?.message}</div>
                                    }
                                    {
                                        user?.newEmail &&
                                        <div className='text-danger fs-error mg-t-5 pd-0'>
                                            <i className='fa-solid fa-circle-info mg-r-5'/>
                                            {
                                                language === 'en' ? 
                                                    <span>There is a request to change the email to "{user.newEmail}". 
                                                        Please check your email inbox for confirmation.
                                                    </span>
                                                    :
                                                    <span>Có yêu cầu thay đổi email thành "{user.newEmail}". 
                                                        Vui lòng kiểm tra hộp thư đến email của bạn để xác nhận.
                                                    </span>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className='row mg-t-20'>
                                <label className='field-required col-2-5'>{t('settingTeacherScreen.subject')}</label>
                                <div className='col-9'>
                                    <select {...register('subject')} className='w-100'>
                                        <option value={''}>{t('settingTeacherScreen.selectSubject')}</option>
                                        {
                                            Object.keys(TEACHER_SUBJECT)?.length > 0 &&
                                            Object.keys(TEACHER_SUBJECT).map(e => <option key={e} value={e}>{TEACHER_SUBJECT[e][language]}</option>)
                                        }
                                    </select>
                                    {
                                        errors.subject &&
                                <div className='text-danger fs-error mg-t-5 pd-0'>{errors.subject?.message}</div>
                                    }
                                </div>
                            </div>
                            <div className='row mg-t-20'>
                                <label className='col-2-5'>{t('settingTeacherScreen.introduction')}</label>
                                <div className='col-9'>
                                    <EditorCustom
                                        data={getValues('introduction')}
                                        onChange={(e, editor) => setValue('introduction', editor.getData() || '', { shouldValidate: true })}
                                        toolbarCustomItems={customToolBarEditorForTeacher}
                                    />
                                    {
                                        errors.introduction &&
                                <div className='text-danger fs-error mg-t-5 pd-0'>{errors.introduction?.message}</div>
                                    }
                                </div>
                            </div>
                            <div className='row mg-t-20'>
                                <label className='col-2-5'>{t('settingTeacherScreen.twitter')}</label>
                                <div className='col-9'>
                                    <input {...register('link.twitter')} className='w-100'/>
                                    {
                                        errors.link?.twitter &&
                                <div className='text-danger fs-error mg-t-5 pd-0'>{errors.link.twitter?.message}</div>
                                    }
                                </div>
                            </div>
                            <div className='row mg-t-20'>
                                <label className='col-2-5'>{t('settingTeacherScreen.facebook')}</label>
                                <div className='col-9'>
                                    <input {...register('link.facebook')} className='w-100'/>
                                    {
                                        errors.link?.facebook &&
                                <div className='text-danger fs-error mg-t-5 pd-0'>{errors.link.facebook?.message}</div>
                                    }
                                </div>
                            </div>
                            <div className='row mg-t-20'>
                                <label className='col-2-5'>{t('settingTeacherScreen.linkedin')}</label>
                                <div className='col-9'>
                                    <input {...register('link.linkedin')} className='w-100'/>
                                    {
                                        errors.link?.linkedin &&
                                <div className='text-danger fs-error mg-t-5 pd-0'>{errors.link.linkedin?.message}</div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='col-5 d-flex align-items-center flex-column flex-gap-1'>
                            <div className='position-relative'>
                                <img id='preview-image' className='width-255'/>
                                {
                                    (( watchImage instanceof FileList && watchImage.length > 0 ) 
                                        || ((typeof watchImage === 'string' || watchImage instanceof String ) && watchImage !== '')) &&
                                        <i onClick={onRemoveImage} role='button' 
                                            className='fa fa-light fa-circle-xmark text-danger position-absolute top-0 end-0 font-size-20'/>
                                }
                            </div>
                            <input id='image' type={'file'} {...register('image')} accept='image/png, image/jpeg' className='w-100' hidden/>
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
                    <div className='d-flex justify-content-center align-items-center mg-t-40'>
                        <button type='button' className='btn btn-default-1 width-150' onClick={hide}>{t('common.cancel')}</button>
                        <button type='submit' className='btn btn-default-2 width-150 mg-l-50' disabled={isSubmitting}>
                            {SCREEN_MODE.ADD === mode ? t('common.create') : t('common.update')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
})

export default SettingTeacherScreen;