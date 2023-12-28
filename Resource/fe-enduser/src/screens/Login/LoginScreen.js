/* eslint-disable max-len */
import { observer } from 'mobx-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { MSG, SYSTEM_PATH } from '../../core/configs/constants';
import { useStore } from '../../core/utils/hook';
import { useState } from 'react';
import yup from '../../core/utils/yupValidate';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

const LoginScreen = observer((props) => {

    // other
    const navigate = useNavigate();

    // store
    const { authStore: { token, login } } = useStore();

    /// state
    const [showPassword, setShowPassword] = useState(false);

    const validateLoginSchema = yup.object().shape({
        email: yup.string().required(MSG['error.required']),
        password: yup.string().required(MSG['error.required'])
    })
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(validateLoginSchema), mode: 'onChange' });

    // function
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const onLogin = async (data) => {
        const res = await login(data);
        if (res) {
            navigate(SYSTEM_PATH.HOME);
        }
    }

    if (token) {
        return <Navigate to={SYSTEM_PATH.HOME} />;
    }

    return (
        <>
            {/* Login Start */}
            <div className='container-fluid py-5'>
                <div className='container py-5'>
                    <div className='row justify-content-center'>
                        <div className='col-lg-6'>
                            <div className='login-form bg-secondary rounded p-5'>
                                {/* <h1 className='text-center'>LOGIN</h1> */}
                                <h1 className='text-center'>Đăng nhập</h1>
                                <form onSubmit={handleSubmit(onLogin)} name='sentMessage' id='loginForm' className='mt-4'>
                                    <div className='control-group'>
                                        <label>Email</label>
                                        <input {...register('email')} type='text' className='form-control border-0' />
                                        {
                                            errors?.email &&
                                            <p className='help-block error-validate text-danger'>{errors?.email?.message}</p>
                                        }
                                    </div>
                                    <div className='control-group mg-t-20'>
                                        {/* <label>Password</label> */}
                                        <label>Mật khẩu</label>
                                        <input {...register('password')} type={!showPassword ? 'password' : 'text'} className='form-control border-0' />
                                        <button type='button' className='btn-icon-input' onClick={toggleShowPassword}>
                                            {
                                                showPassword ?
                                                    <i className='fas fa-eye'></i>
                                                    :
                                                    <i className='fas fa-eye-slash'></i>
                                            }
                                        </button>
                                        {
                                            errors?.password &&
                                            <p className='help-block error-validate text-danger'>{errors?.password?.message}</p>
                                        }
                                    </div>
                                    <Link to={SYSTEM_PATH.FORGOT_PASSWORD} className='link-custom'>
                                        {/* <p className='text-right mg-t-5'>Forgot password?</p> */}
                                        <p className='text-right mg-t-5'>Quên mật khẩu?</p>
                                    </Link>
                                    <div className='text-center mt-4'>
                                        <button className='btn btn-primary w-100 py-2' type='submit' id='sendMessageButton'>Login</button>
                                    </div>
                                </form>
                                <div className='text-center mt-4'>
                                    {/* <p>Or <Link to={SYSTEM_PATH.SIGNUP}>Sign up now</Link></p> */}
                                    <p>hoặc <Link to={SYSTEM_PATH.SIGNUP}>Đăng ký</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Login End */}
        </>
    )
})

export default LoginScreen;