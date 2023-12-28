import { yupResolver } from '@hookform/resolvers/yup';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { SYSTEM_PATH } from '../../core/configs/constants';
import { useStore, useTitle } from '../../core/utils/hook';
import yup from '../../core/utils/yupValidate';
import { useTranslation } from 'react-i18next';

const LoginScreen = observer(() => {

    // translation
    const { t } = useTranslation();

    // other
    useTitle(t('loginScreen.titleDocument'));
    const navigate = useNavigate();

    // store
    const { authStore: { token, login } } = useStore();

    /// state
    const [ showPassword, setShowPassword ] = useState(false);

    const validateLoginSchema = yup.object().shape({
        email: yup.string().required(t('loginScreen.errorEmailRequired')),
        password: yup.string().required(t('loginScreen.errorPasswordRequired'))
    })
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({resolver: yupResolver(validateLoginSchema), mode: 'onChange'});

    // function
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const onLogin = async (data) => {
        const res = await login(data);
        if(res) {
            navigate(SYSTEM_PATH.DASHBOARD);
        }
    }

    if(token) {
        return <Navigate to={SYSTEM_PATH.DASHBOARD}/>;
    }

    return(
        <div className='login-screen vw-100 vh-100 d-flex justify-content-center align-items-center'>
            <div className='container-form width-500 pd-tb-35 border shadow-box p-3 mb-5 bg-body radius-div'>
                <div className='text-center fw-bold fs-heading-large'>{t('loginScreen.titleScreen')}</div>
                <form onSubmit={handleSubmit(onLogin)} className='mg-lr-15 mg-t-20 mg-b-30'>
                    <div>
                        <label htmlFor='email' className='field-required col-12 fw-bold'>{t('loginScreen.labelEmail')}</label>
                        <input {...register('email')} id='email' type={'text'} className='mg-t-10 col-12'/>
                        <div className='btn-icon-input'>
                            <i className='fa-regular fa-envelope login-icon'></i>
                        </div>
                        {
                            errors?.email &&
                            <div className='text-danger mg-t-5 fs-error'>{errors.email?.message}</div>
                        }
                    </div>
                    <div className='mg-t-30'>
                        <label htmlFor='password' className='field-required col-12 fw-bold'>{t('loginScreen.labelPassword')}</label>
                        <input {...register('password')} id='password' type={!showPassword ? 'password' : 'text'} 
                            className='mg-t-10 col-12' autoComplete='off'/>
                        <button type='button' className='btn-icon-input' onClick={toggleShowPassword}>
                            {
                                showPassword ? 
                                    <i className='fas fa-eye login-icon'></i>                                
                                    :
                                    <i className='fas fa-eye-slash login-icon'></i>
                            }
                        </button>
                        {
                            errors?.password &&
                            <div className='text-danger mg-t-5 fs-error'>{errors.password?.message}</div>
                        }
                    </div>
                    <div className='text-end mg-t-15'>
                        <Link to={SYSTEM_PATH.FORGET_PASSWORD} className='hover-underline'>{t('loginScreen.linkForgetPassword')}</Link>
                    </div>
                    <div className='text-center'>
                        <button type='submit' className='btn btn-default-2 width-200 mg-t-30' 
                            disabled={isSubmitting}>{t('loginScreen.buttonLogin')}</button>
                    </div>
                </form>
            </div>
        </div>
    )
})

export default LoginScreen;