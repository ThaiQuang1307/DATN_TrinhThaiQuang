import { observer } from 'mobx-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SYSTEM_PATH } from '../../core/configs/constants';
import { useStore, useTitle } from '../../core/utils/hook';
import yup from '../../core/utils/yupValidate';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useEffect } from 'react';
import { TopContent } from '../../components';

const ChangePasswordScreen = observer(props => {

    // other
    const navigate = useNavigate();

    // store
    const { authStore: { changePassword, logout }, modalStore: { openAlert } } = useStore();

    // state
    const validateSchema = yup.object().shape({
        currentPassword: yup.string().required(),
        password: yup.string().required().matches(new RegExp('^[a-zA-Z0-9]{8,}$')),
        passwordConfirm: yup.string().oneOf([yup.ref('password')], '').required()
    })
    const { register, handleSubmit, formState: { errors, isSubmitting }, trigger
    } = useForm({ resolver: yupResolver(validateSchema), mode: 'onChange' });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    // lifecycle
    useEffect(() => {
        trigger();
    }, [])

    // function
    const onChangePassword = async (data) => {
        const { currentPassword, password } = data;
        const res = await changePassword({ currentPassword, password });
        if (res) {
            // openAlert('Change password password successfully. Please log in again.', onLogout);
            openAlert('Đổi mật khẩu mật khẩu thành công. Xin vui lòng đăng nhập lại.', onLogout);
        }
    }

    const onLogout = async () => {
        const res = await logout();
        if (res) {
            navigate(SYSTEM_PATH.LOGIN);
            navigate(0);
        }
    }

    return (
        <>
            <TopContent namePage={'Đổi mật khẩu'} breadcrumb={'Đổi mật khẩu'} />
            <div className='set-password-screen d-flex flex-column align-items-center pd-t-50'>
                <div className='pd-lr-10'>
                    <div>
                        <div className='row flex-xl-row flex-column-reverse mg-lr-0'>
                            <form className='col-12 col-xl-8' onSubmit={handleSubmit(onChangePassword)}>
                                <div className='control-group row mg-lr-0'>
                                    {/* <label htmlFor='password' className='field-required col-12 col-xl-4 pd-0 fw-bold'>Current password</label> */}
                                    <label htmlFor='password' className='field-required col-12 col-xl-4 pd-0 fw-bold'>Mật khẩu hiện tại</label>
                                    <div className='col-12 col-xl-8 pd-0'>
                                        <input {...register('currentPassword')} id='password' type={!showPassword ? 'password' : 'text'}
                                            className='w-100 form-control' autoComplete='off'
                                            onCopy={(e) => e.preventDefault()}
                                            onPaste={(e) => e.preventDefault()}
                                            onCut={(e) => e.preventDefault()}
                                        />
                                        <button type='button' className='btn-icon-input' onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                            {
                                                showCurrentPassword ?
                                                    <i className='fas fa-eye'></i>
                                                    :
                                                    <i className='fas fa-eye-slash'></i>
                                            }
                                        </button>
                                    </div>
                                </div>
                                <div className='control-group row mg-lr-0 mg-t-20'>
                                    {/* <label htmlFor='password' className='field-required col-12 col-xl-4 pd-0 fw-bold'>New password</label> */}
                                    <label htmlFor='password' className='field-required col-12 col-xl-4 pd-0 fw-bold'>Mật khẩu mới</label>
                                    <div className='col-12 col-xl-8 pd-0'>
                                        <input {...register('password')} id='password' type={!showPassword ? 'password' : 'text'}
                                            className='w-100 form-control' autoComplete='off'
                                            onCopy={(e) => e.preventDefault()}
                                            onPaste={(e) => e.preventDefault()}
                                            onCut={(e) => e.preventDefault()}
                                        />
                                        <button type='button' className='btn-icon-input' onClick={() => setShowPassword(!showPassword)}>
                                            {
                                                showPassword ?
                                                    <i className='fas fa-eye'></i>
                                                    :
                                                    <i className='fas fa-eye-slash'></i>
                                            }
                                        </button>
                                    </div>
                                </div>
                                <div className='control-group row mg-lr-0 mg-t-20'>
                                    <label htmlFor='passwordConfirm'
                                        // className='field-required col-12 col-xl-4 pd-0 fw-bold'>Confirm new password</label>
                                        className='field-required col-12 col-xl-4 pd-0 fw-bold'>Xác nhận mật khẩu mới</label>
                                    <div className='col-12 col-xl-8 pd-0'>
                                        <input {...register('passwordConfirm')} id='passwordConfirm'
                                            type={!showPasswordConfirm ? 'password' : 'text'}
                                            className='w-100 form-control' autoComplete='off'
                                            onCopy={(e) => e.preventDefault()}
                                            onPaste={(e) => e.preventDefault()}
                                            onCut={(e) => e.preventDefault()}
                                        />
                                        <button type='button' className='btn-icon-input' onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                                            {
                                                showPasswordConfirm ?
                                                    <i className='fas fa-eye'></i>
                                                    :
                                                    <i className='fas fa-eye-slash'></i>
                                            }
                                        </button>
                                    </div>
                                </div>
                                <div className='mg-t-20 col-12 col-xl-12 pd-0 text-center'>
                                    {/* <button type='submit' className='btn btn-primary width-200 mg-t-20 py-2'
                                        disabled={isSubmitting}>Change password</button> */}
                                    <button type='submit' className='btn btn-primary width-200 mg-t-20 py-2'
                                        disabled={isSubmitting}>Đổi mật khẩu</button>
                                </div>
                            </form>
                            <div className='warning col-12 col-xl-4 mg-b-20'>
                                <div>
                                    {
                                        errors?.currentPassword ?
                                            <i className='fas fa-times-circle text-danger'></i>
                                            :
                                            <i className='fas fa-check-circle text-success'></i>
                                    }
                                    {/* <span className='mg-l-10'>Enter current password</span> */}
                                    <span className='mg-l-10'>Nhập mật khẩu hiện tại</span>
                                </div>
                                <div className='mg-t-5'>
                                    {
                                        errors?.password ?
                                            <i className='fas fa-times-circle text-danger'></i>
                                            :
                                            <i className='fas fa-check-circle text-success'></i>
                                    }
                                    <span className='mg-l-10'>
                                        {/* New password contains at least 8 characters containing only numbers, characters */}
                                        Mật khẩu mới chứa ít nhất 8 ký tự chỉ chứa số, chữ cái
                                    </span>
                                </div>
                                <div className='mg-t-5'>
                                    {
                                        errors?.passwordConfirm ?
                                            <i className='fas fa-times-circle text-danger'></i>
                                            :
                                            <i className='fas fa-check-circle text-success'></i>
                                    }
                                    {/* <span className='mg-l-10'>Confirm new password match</span> */}
                                    <span className='mg-l-10'>Xác nhận khớp mật khẩu mới</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})

export default ChangePasswordScreen;