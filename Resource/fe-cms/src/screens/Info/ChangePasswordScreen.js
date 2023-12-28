import { observer } from 'mobx-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SYSTEM_PATH } from '../../core/configs/constants';
import { useStore, useTitle } from '../../core/utils/hook';
import yup from '../../core/utils/yupValidate';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useEffect } from 'react';
import { ReactNotifications } from '../../components';
import { useTranslation } from 'react-i18next';

const ChangePasswordScreen = observer(props => {

    // translation
    const { t, i18n: { language } } = useTranslation();

    // other
    useTitle(t('changePasswordScreen.titleDocument'));
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
    const [ showCurrentPassword, setShowCurrentPassword ] = useState(false);
    const [ showPassword, setShowPassword ] = useState(false);
    const [ showPasswordConfirm, setShowPasswordConfirm ] = useState(false);
    
    // lifecycle
    useEffect(() => {
        trigger();
    }, [])

    // function
    const onChangePassword = async (data) => {
        const { currentPassword, password } = data;
        const res = await changePassword({ currentPassword, password });
        if(res) {
            openAlert(t('changePasswordScreen.alertChangeSuccess'), onLogout);
        }
    }

    const onLogout = async () => {
        const res = await logout();
        if(res) {
            navigate(SYSTEM_PATH.LOGIN);
            navigate(0);
        }
    }

    return(
        <div className='profile-screen'>
            <div className='container-title'>{t('changePasswordScreen.titleScreen')}</div>
            <div className='d-flex justify-content-center mg-t-20'>
                <form className='col-8' onSubmit={handleSubmit(onChangePassword)}>
                    <div className='row align-items-center'>
                        <label htmlFor='currentPassword' className='field-required col-3-5 fw-bold'>
                            {t('changePasswordScreen.currentPassword')}
                        </label>
                        <div className='col-7-5'>
                            <input {...register('currentPassword')} id='currentPassword' type={!showCurrentPassword ? 'password' : 'text'} 
                                className='col-12' autoComplete='off'
                                onCopy={(e) =>  e.preventDefault()}  
                                onPaste={(e) => e.preventDefault()}  
                                onCut={(e) =>   e.preventDefault()}
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
                    <div className='row align-items-center mg-t-10'>
                        <label htmlFor='password' className='field-required col-3-5 fw-bold'>{t('changePasswordScreen.newPassword')}</label>
                        <div className='col-7-5'>
                            <input {...register('password')} id='password' type={!showPassword ? 'password' : 'text'} 
                                className='col-12' autoComplete='off'
                                onCopy={(e) =>  e.preventDefault()}  
                                onPaste={(e) => e.preventDefault()}  
                                onCut={(e) =>   e.preventDefault()}
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
                    <div className='row align-items-center mg-t-10'>
                        <label htmlFor='passwordConfirm' className='field-required col-3-5 fw-bold'>
                            {t('changePasswordScreen.confirmNewPassword')}
                        </label>
                        <div className='col-7-5'>
                            <input {...register('passwordConfirm')} id='passwordConfirm' 
                                type={!showPasswordConfirm ? 'password' : 'text'} 
                                className='col-12' autoComplete='off'
                                onCopy={(e) =>  e.preventDefault()}  
                                onPaste={(e) => e.preventDefault()}  
                                onCut={(e) =>   e.preventDefault()}
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
                    <div className='mg-t-20 text-center'>
                        <button type='submit' className='btn btn-default-2 width-200 mg-t-20' disabled={isSubmitting}>
                            {t('changePasswordScreen.changePassword')}
                        </button>
                    </div>
                </form>
                <div className='warning'>
                    <div>
                        {
                            errors?.currentPassword ?
                                <i className='fa-solid fa-circle-xmark text-danger'></i> 
                                :
                                <i className='fa-solid fa-circle-check text-success'></i> 
                        }
                        <span className='text-secondary mg-l-10'>
                            {t('changePasswordScreen.valid1')}
                        </span>
                    </div>
                    <div className='mg-t-5'>
                        {
                            errors?.password ?
                                <i className='fa-solid fa-circle-xmark text-danger'></i> 
                                :
                                <i className='fa-solid fa-circle-check text-success'></i> 
                        }
                        <span className='text-secondary mg-l-10'>
                            {t('changePasswordScreen.valid2')}
                        </span>
                    </div>
                    <div className='mg-t-5'>
                        {
                            errors?.passwordConfirm ?
                                <i className='fa-solid fa-circle-xmark text-danger'></i> 
                                :
                                <i className='fa-solid fa-circle-check text-success'></i> 
                        }
                        <span className='text-secondary mg-l-10'>
                            {t('changePasswordScreen.valid3')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default ChangePasswordScreen;