/* eslint-disable max-len */
import { observer } from 'mobx-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { GENDER, MSG, SYSTEM_PATH } from '../../core/configs/constants';
import { useStore } from '../../core/utils/hook';
import { useState } from 'react';
import yup from '../../core/utils/yupValidate';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import moment from 'moment/moment';
import { CalendarCustom } from '../../components';
import { countries } from 'countries-list';

const SignUpScreen = observer((props) => {

    // other
    const navigate = useNavigate();

    // store
    const { authStore: { token, signUp }, modalStore: { openAlert } } = useStore();

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
        address: yup.string().trim().required(MSG['error.required'])
    })

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        getValues,
        setValue,
        trigger
    } = useForm({
        resolver: yupResolver(validateSchema), mode: 'onChange', defaultValues: {
            gender: '',
            country: ''
        }
    });

    // function
    const onSignUp = async (data) => {
        const res = await signUp(data);
        if (res) {
            openAlert('Thank you for creating an account at Ecourses. Please check your email inbox to complete the registration.', () => navigate(SYSTEM_PATH.LOGIN));
        }
    }

    if (token) {
        return <Navigate to={SYSTEM_PATH.HOME} />;
    }

    return (
        <>
            {/* Sign up Start */}
            <div className='container-fluid py-5'>
                <div className='container py-5'>
                    <div className='row justify-content-center'>
                        <div className='col-lg-6'>
                            <div className='sign-up-form bg-secondary rounded py-3 px-3 p-lg-5'>
                                {/* <h1 className='text-center'>SIGN UP</h1> */}
                                <h1 className='text-center'>Đăng ký</h1>
                                <form onSubmit={handleSubmit(onSignUp)} name='sentMessage' id='signUpForm' className='mt-4'>
                                    <div className='control-group'>
                                        {/* <label className='field-required'>Full name</label> */}
                                        <label className='field-required'>Họ và tên</label>
                                        <input {...register('name')} type='text' className='form-control border-0' />
                                        {
                                            errors?.name &&
                                            <p className='help-block error-validate text-danger'>{errors?.name?.message}</p>
                                        }
                                    </div>
                                    <div className='control-group mg-t-20'>
                                        {/* <label className='field-required'>Gender</label> */}
                                        <label className='field-required'>Giới tính</label>
                                        <select {...register('gender')} className='form-control border-0'>
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
                                            classNameInput='form-control border-0'
                                        />
                                        {
                                            errors?.birthday &&
                                            <p className='help-block error-validate text-danger'>{errors?.birthday?.message}</p>
                                        }
                                    </div>
                                    <div className='control-group mg-t-20'>
                                        <label className='field-required'>Email</label>
                                        <input {...register('email')} type='text' className='form-control border-0' />
                                        {
                                            errors?.email &&
                                            <p className='help-block error-validate text-danger'>{errors?.email?.message}</p>
                                        }
                                    </div>
                                    <div className='control-group mg-t-20'>
                                        {/* <label className='field-required'>Phone number</label> */}
                                        <label className='field-required'>Điện thoại</label>
                                        <input {...register('phoneNumber')} type='text' className='form-control border-0' />
                                        {
                                            errors?.phoneNumber &&
                                            <p className='help-block error-validate text-danger'>{errors?.phoneNumber?.message}</p>
                                        }
                                    </div>
                                    <div className='control-group mg-t-20'>
                                        {/* <label className='field-required'>Country</label> */}
                                        <label className='field-required'>Quốc gia</label>
                                        <select {...register('country')} className='form-control border-0'>
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
                                        <input {...register('address')} type='text' className='form-control border-0' />
                                        {
                                            errors?.address &&
                                            <p className='help-block error-validate text-danger'>{errors?.address?.message}</p>
                                        }
                                    </div>
                                    <div className='text-center mt-5'>
                                        {/* <button className='btn btn-primary w-100 py-2' type='submit' id='sendMessageButton'>Sign up</button> */}
                                        <button className='btn btn-primary w-100 py-2' type='submit' id='sendMessageButton'>Đăng ký</button>
                                    </div>
                                </form>
                                <div className='text-center mt-4'>
                                    {/* <p>if you already have an account <Link to={SYSTEM_PATH.LOGIN}>Login now</Link></p> */}
                                    <p>nếu bạn đã có tài khoản <Link to={SYSTEM_PATH.LOGIN}>Đăng nhập</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Sign up */}
        </>
    )
})

export default SignUpScreen;