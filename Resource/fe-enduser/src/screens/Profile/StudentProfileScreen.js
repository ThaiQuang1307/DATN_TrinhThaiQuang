import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { GENDER, MSG, SYSTEM_PATH } from '../../core/configs/constants';
import { useStore } from '../../core/utils/hook';
import yup from '../../core/utils/yupValidate';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import moment from 'moment/moment';
import { CalendarCustom, ReactNotifications } from '../../components';
import { countries } from 'countries-list';
import { TopContent } from '../../components';
import { useEffect } from 'react';
import { loadFilePreview, loadURLPreview } from '../../core/utils/browser';

const StudentProfileScreen = observer(props => {

    // store
    const { authStore: { userInfo, getInfo, updateProfile } } = useStore();

    /// state
    const validateSchema = yup.object().shape({
        name: yup.string().trim().required(MSG['error.required']),
        gender: yup.lazy((value) => {
            if (value === '') {
                return yup.string().required(MSG['error.required']);
            }
            return yup.number()
        }),
        birthday: yup.lazy((value) => {
            if (value === null) {
                return yup.mixed().required(MSG['error.required']);
            }
            return yup.string().required(MSG['error.required'])
        }),
        email: yup.string().email(MSG['error.email_format']).required(MSG['error.required']),
        phoneNumber: yup.string().trim().required(MSG['error.required']),
        country: yup.string().required(MSG['error.required']),
        address: yup.string().trim().required(MSG['error.required']),
        image: yup.mixed().transform((v) => {
            if (v instanceof FileList) {
                return v.length < 1 ? undefined : v[0];
            } else {
                return v;
            }
        }).required(MSG['error.required'])
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
        const { name, email, gender, birthday, phoneNumber, country, address, image } = userInfo;
        reset({ name, email, gender, birthday, phoneNumber, country, address, image });
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
                        <div className='col-lg-10'>
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
                                        {/* <label className='field-required'>Gender</label> */}
                                        <label className='field-required'>Giới tính</label>
                                        <select {...register('gender')} className='form-control'>
                                            {/* <option value={''}>Please select gender</option> */}
                                            <option value={''}>-- Chọn --</option>
                                            {
                                                Object.keys(GENDER).map(e => <option key={e} value={e} >{GENDER[e]}</option>)
                                            }
                                        </select>
                                        {
                                            errors?.gender &&
                                            <p className='help-block error-validate text-danger'>{errors?.gender?.message}</p>
                                        }
                                    </div>
                                    <div className='control-group mg-t-20'>
                                        {/* <label className='field-required'>Birthday</label> */}
                                        <label className='field-required'>Ngày sinh</label>
                                        <CalendarCustom
                                            date={getValues('birthday') || null}
                                            displayMode={'date'}
                                            maxDate={new Date()}
                                            onChange={date => {
                                                setValue('birthday', date ? moment(date).format('YYYY/MM/DD') : null);
                                                trigger('birthday');
                                            }}
                                            classNameInput='form-control'
                                        />
                                        {
                                            errors?.birthday &&
                                            <p className='help-block error-validate text-danger'>{errors?.birthday?.message}</p>
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
                                        {/* <label className='field-required'>Phone number</label> */}
                                        <label className='field-required'>Số điện thoại</label>
                                        <input {...register('phoneNumber')} type='text' className='form-control' />
                                        {
                                            errors?.phoneNumber &&
                                            <p className='help-block error-validate text-danger'>{errors?.phoneNumber?.message}</p>
                                        }
                                    </div>
                                    <div className='control-group mg-t-20'>
                                        {/* <label className='field-required'>Country</label> */}
                                        <label className='field-required'>Quốc tịch</label>
                                        <select {...register('country')} className='form-control'>
                                            {/* <option value={''}>Please select country</option> */}
                                            <option value={''}>-- Chọn --</option>
                                            {
                                                Object.keys(countries).map(key => <option key={key} value={key}>{countries[key].name}</option>)
                                            }
                                        </select>
                                        {
                                            errors?.country &&
                                            <p className='help-block error-validate text-danger'>{errors?.country?.message}</p>
                                        }
                                    </div>
                                    <div className='control-group mg-t-20'>
                                        {/* <label className='field-required'>Address</label> */}
                                        <label className='field-required'>Địa chỉ</label>
                                        <input {...register('address')} type='text' className='form-control' />
                                        {
                                            errors?.address &&
                                            <p className='help-block error-validate text-danger'>{errors?.address?.message}</p>
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

export default StudentProfileScreen;