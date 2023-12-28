import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { GENDER, MSG, SYSTEM_PATH, TEACHER_SUBJECT } from '../../core/configs/constants';
import { useStore } from '../../core/utils/hook';
import yup from '../../core/utils/yupValidate';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import moment from 'moment/moment';
import { CalendarCustom, EditorCustom, ReactNotifications } from '../../components';
import { countries } from 'countries-list';
import { TopContent } from '../../components';
import { useEffect } from 'react';
import { loadFilePreview, loadURLPreview } from '../../core/utils/browser';
import { customToolBarEditorForTeacher } from '../../core/utils/common';

const TeacherProfileScreen = observer(props => {

    // store
    const { authStore: { userInfo, getInfo, updateProfile } } = useStore();

    /// state
    const validateSchema = yup.object().shape({
        name: yup.string().trim().required(MSG['error.required']),
        email: yup.string().email(MSG['error.email_format']).required(MSG['error.required']),
        subject: yup.string().required(MSG['error.required']),
        introduction: yup.string(),
        image: yup.mixed().transform((v) => {
            if (v instanceof FileList) {
                return v.length < 1 ? undefined : v[0];
            } else {
                return v;
            }
        }).required(MSG['error.required']),
        link: yup.object({
            twitter: yup.string().isValidUrl(MSG['error.url']),
            facebook: yup.string().isValidUrl(MSG['error.url']),
            linkedin: yup.string().isValidUrl(MSG['error.url'])
        })
    })

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        getValues,
        setValue,
        trigger,
        watch
    } = useForm({
        resolver: yupResolver(validateSchema), mode: 'onChange', defaultValues: {
            gender: '',
            country: ''
        }
    });

    const watchImage = watch('image');

    // lifecycle
    useEffect(() => {
        getInfo();
    }, [])

    useEffect(() => {
        if (watchImage instanceof FileList) {
            if (watchImage.length > 0) {
                loadFilePreview(watchImage[0], 'preview-image');
            } else {
                loadURLPreview('/images/user-avatar-default.svg', 'preview-image');
            }
        } else if (typeof watchImage === 'string' || watchImage instanceof String) {
            loadURLPreview(watchImage || '/images/user-avatar-default.svg', 'preview-image');
        } else {
            loadURLPreview('/images/user-avatar-default.svg', 'preview-image');
        }
    }, [watchImage])

    useEffect(() => {
        const { name, email, subject, introduction, link, image } = userInfo;
        reset({ name, email, subject, introduction, link, image });
    }, [userInfo])

    // function
    const onUpdateProfile = async (data) => {
        const res = await updateProfile(data);
        if (res) {
            ReactNotifications('success', MSG['inform.success.update']);
            getInfo();
        }
    }

    return (
        <>
            {/* <TopContent namePage={'Profile'} breadcrumb={'Profile'}/> */}
            <TopContent namePage={'Thông tin tài khoản'} breadcrumb={'Thông tin tài khoản'} />
            <div className='container-fluid py-5'>
                <div className='container'>
                    <div className='row justify-content-center'>
                        <div className='col-lg-12'>
                            <form onSubmit={handleSubmit(onUpdateProfile)} name='sentMessage' id='signUpForm' className='mt-4 d-lg-flex'>
                                <div className='col-lg-5 d-flex align-items-center flex-column flex-gap-1'>
                                    <div className='position-relative avatar-user width-200 height-200'>
                                        <img id='preview-image' className='width-255' />
                                    </div>
                                    <input id='image' type={'file'} {...register('image')} accept='image/png, image/jpeg' className='w-100' hidden />
                                    <label htmlFor='image' role='button' className='mg-t-5'>
                                        {/* <i className='fa fa-light fa-upload mg-r-5'></i> <span>Select avatar</span> */}
                                        <i className='fa fa-light fa-upload mg-r-5'></i> <span>Chọn ảnh đại diện</span>
                                    </label>
                                    {
                                        errors.image &&
                                        <div className='text-danger fs-error mg-t-5 pd-0'>{errors.image?.message}</div>
                                    }
                                </div>
                                <div className='col-lg-7'>
                                    <div className='control-group'>
                                        {/* <label className='field-required'>Full name</label> */}
                                        <label className='field-required'>Họ và tên</label>
                                        <input {...register('name')} type='text' className='form-control' />
                                        {
                                            errors?.name &&
                                            <p className='help-block error-validate text-danger'>{errors?.name?.message}</p>
                                        }
                                    </div>
                                    <div className='control-group mg-t-20'>
                                        <label className='field-required'>Email</label>
                                        <input {...register('email')} type='text' className='form-control' />
                                        {
                                            errors?.email &&
                                            <p className='help-block error-validate text-danger'>{errors?.email?.message}</p>
                                        }
                                        {
                                            userInfo?.newEmail &&
                                            <div className='help-block error-validate text-danger mg-t-10'>
                                                <i className='fas fa-info-circle mg-r-5' />
                                                {/* <span>There is a request to change the email to "{userInfo.newEmail}".
                                                    Please check your email inbox for confirmation.
                                                </span> */}
                                                <span>Có yêu cầu thay đổi email thành "{userInfo.newEmail}".
                                                    Vui lòng kiểm tra hộp thư email của bạn để xác nhận.
                                                </span>
                                            </div>
                                        }
                                    </div>
                                    <div className='control-group mg-t-20'>
                                        {/* <label className='field-required'>Subject</label> */}
                                        <label className='field-required'>Bộ môn</label>
                                        <select {...register('subject')} className='form-control'>
                                            {/* <option value={''}>Please select subject</option> */}
                                            <option value={''}>-- Chọn bộ môn --</option>
                                            {
                                                Object.keys(TEACHER_SUBJECT).map(key => <option key={key} value={key}>
                                                    {TEACHER_SUBJECT[key].value}
                                                </option>)
                                            }
                                        </select>
                                        {
                                            errors?.subject &&
                                            <p className='help-block error-validate text-danger'>{errors?.subject?.message}</p>
                                        }
                                    </div>
                                    <div className='control-group mg-t-20'>
                                        {/* <label className='field-required'>Introduction</label> */}
                                        <label className='field-required'>Giới thiệu</label>
                                        <EditorCustom
                                            data={getValues('introduction')}
                                            onChange={(e, editor) => setValue('introduction', editor.getData() || '', { shouldValidate: true })}
                                            toolbarCustomItems={customToolBarEditorForTeacher}
                                        />
                                        {
                                            errors?.introduction &&
                                            <p className='help-block error-validate text-danger'>{errors?.introduction?.message}</p>
                                        }
                                    </div>
                                    <div className='control-group mg-t-20'>
                                        <label className='field-required'>Twitter</label>
                                        <input {...register('link.twitter')} type='text' className='form-control' />
                                        {
                                            errors?.link?.twitter &&
                                            <p className='help-block error-validate text-danger'>{errors?.link?.twitter?.message}</p>
                                        }
                                    </div>
                                    <div className='control-group mg-t-20'>
                                        <label className='field-required'>Facebook</label>
                                        <input {...register('link.facebook')} type='text' className='form-control' />
                                        {
                                            errors?.link?.facebook &&
                                            <p className='help-block error-validate text-danger'>{errors?.link?.facebook?.message}</p>
                                        }
                                    </div>
                                    <div className='control-group mg-t-20'>
                                        <label className='field-required'>Linkedin</label>
                                        <input {...register('link.linkedin')} type='text' className='form-control' />
                                        {
                                            errors?.link?.linkedin &&
                                            <p className='help-block error-validate text-danger'>{errors?.link?.linkedin?.message}</p>
                                        }
                                    </div>
                                    <div className='text-center mt-5'>
                                        <button className='btn btn-primary w-100 py-2' type='submit' id='sendMessageButton'>
                                            {/* Update information */}
                                            Cập nhật thông tin
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})

export default TeacherProfileScreen;