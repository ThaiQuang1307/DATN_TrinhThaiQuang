import { observer } from 'mobx-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { SYSTEM_PATH } from '../../core/configs/constants';
import { useStore, useTitle } from '../../core/utils/hook';
import yup from '../../core/utils/yupValidate';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useEffect } from 'react';
import NotFoundScreen from '../404/NotFoundScreen';
import { ReactNotifications } from '../../components';
import { useTranslation } from 'react-i18next';

const SetPasswordScreen = observer(props => {

    // translation
    const { t, i18n: { language } } = useTranslation();

    // other
    useTitle(t('setUpPasswordScreen.titleDocument'));
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // params
    const uuid = searchParams.get('uuid');

    // store
    const { authStore: { verifyUuid, setPassword } } = useStore();

    // state
    const validateSchema = yup.object().shape({
        privateCode: yup.string().required(),
        password: yup.string().required().matches(new RegExp('^[a-zA-Z0-9]{8,}$')),
        passwordConfirm: yup.string().oneOf([yup.ref('password')], '').required()
    })
    const { register, handleSubmit, formState: { errors, isSubmitting }, trigger 
    } = useForm({ resolver: yupResolver(validateSchema), mode: 'onChange' });
    const [ existedUuid, setExistedUuid ] = useState(false);
    const [ showPrivateCode, setShowPrivateCode ] = useState(false);
    const [ showPassword, setShowPassword ] = useState(false);
    const [ showPasswordConfirm, setShowPasswordConfirm ] = useState(false);

    // lifecycle
    useEffect(() => {
        if(uuid) {
            onVerifyUuid();
        }
        trigger();
    }, [])

    // function
    const onVerifyUuid = async () => {
        const res = await verifyUuid({uuid: uuid ?? ''});
        setExistedUuid(res);
    }

    const onSetPassword = async (data) => {
        const { privateCode, password } = data;
        const res = await setPassword({ uuid, privateCode, password });
        if(res) {
            ReactNotifications('success', t('setUpPasswordScreen.success'));
            navigate(SYSTEM_PATH.LOGIN);
        }
    }

    if(!existedUuid || !uuid) {
        return (
            <div className='text-center mg-t-50'>
                <NotFoundScreen/>
            </div>
        )
        
    }

    return(
        <div className='set-password-screen w-100 d-flex justify-content-center pd-t-50'>
            <div className='min-width-950 col-7'>
                <div className='title fs-heading-large fw-bolder'>{t('setUpPasswordScreen.titleScreen')}</div>
                <div className='mg-t-20'>
                    <div className='d-flex justify-content-center mg-t-20'>
                        <form className='col-8' onSubmit={handleSubmit(onSetPassword)}>
                            <div className='row align-items-center'>
                                <label htmlFor='privateCode' className='field-required col-3-5 fw-bold'>{t('setUpPasswordScreen.privateCode')}</label>
                                <div className='col-7-5'>
                                    <input {...register('privateCode')} id='privateCode' type={!showPrivateCode ? 'password' : 'text'} 
                                        className='col-12' autoComplete='off'
                                    />
                                    <button type='button' className='btn-icon-input' onClick={() => setShowPrivateCode(!showPrivateCode)}>
                                        {
                                            showPrivateCode ? 
                                                <i className='fas fa-eye'></i>                                
                                                :
                                                <i className='fas fa-eye-slash'></i>
                                        }
                                    </button>
                                </div>
                            </div>
                            <div className='row align-items-center mg-t-10'>
                                <label htmlFor='password' className='field-required col-3-5 fw-bold'>{t('setUpPasswordScreen.newPassword')}</label>
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
                                    {t('setUpPasswordScreen.confirmNewPassword')}
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
                                    {t('setUpPasswordScreen.setPassword')}
                                </button>
                            </div>
                        </form>
                        <div className='warning'>
                            <div>
                                {
                                    errors?.privateCode ?
                                        <i className='fa-solid fa-circle-xmark text-danger'></i> 
                                        :
                                        <i className='fa-solid fa-circle-check text-success'></i> 
                                }
                                <span className='text-secondary mg-l-10'>{t('setUpPasswordScreen.valid1')}</span>
                            </div>
                            <div className='mg-t-5'>
                                {
                                    errors?.password ?
                                        <i className='fa-solid fa-circle-xmark text-danger'></i> 
                                        :
                                        <i className='fa-solid fa-circle-check text-success'></i> 
                                }
                                <span className='text-secondary mg-l-10'>{t('setUpPasswordScreen.valid2')}</span>
                            </div>
                            <div className='mg-t-5'>
                                {
                                    errors?.passwordConfirm ?
                                        <i className='fa-solid fa-circle-xmark text-danger'></i> 
                                        :
                                        <i className='fa-solid fa-circle-check text-success'></i> 
                                }
                                <span className='text-secondary mg-l-10'>{t('setUpPasswordScreen.valid3')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default SetPasswordScreen;