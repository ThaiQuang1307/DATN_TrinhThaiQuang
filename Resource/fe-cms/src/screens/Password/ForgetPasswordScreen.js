import { observer } from 'mobx-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { SYSTEM_PATH } from '../../core/configs/constants';
import { useStore, useTitle } from '../../core/utils/hook';
import yup from '../../core/utils/yupValidate';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';

const ForgetPasswordScreen = observer(props => {

    // translation
    const { t } = useTranslation();

    // other
    useTitle(t('forgetPasswordScreen.titleDocument'));
    const navigate = useNavigate();

    // store
    const { authStore: { forgetPassword }, modalStore: { openAlert } } = useStore();

    // state
    const validateSchema = yup.object().shape({
        email: yup.string().email().required(t('forgetPasswordScreen.errorEmailRequired')),
    })
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(validateSchema), mode: 'onChange' });

    // function
    const onForgetPassword = async (data) => {
        const res = await forgetPassword(data);
        if(res) {
            openAlert(t('forgetPasswordScreen.alertSuccess'), () => navigate(SYSTEM_PATH.LOGIN));
        }
    }

    return(
        <div className='forget-password-screen'>
            <div className='forgot-password-screen w-100 d-flex justify-content-center pd-t-50'>
                <div className='min-width-950 col-7'>
                    <h1 className='text-center mg-t-30 fw-bold'>{t('forgetPasswordScreen.titleDocument')}</h1>
                    <form onSubmit={handleSubmit(onForgetPassword)} className='mg-tb-30 col-5 mx-auto'>
                        <div className='input-group'>
                            <input
                                placeholder={t('forgetPasswordScreen.placeholderEmail')}
                                {...register('email')} id='email' type={'text'} className='form-control'/>
                            <button disabled={isSubmitting} type='submit' className="input-group-text btn-default-2">
                                <i className="fa fa-solid fa-right-long"></i>
                            </button>
                        </div>
                        {
                            errors?.email &&
                            <div className='text-danger mg-t-5 fs-error'>{errors.email?.message}</div>
                        }
                    </form>

                    <div className='text-center mg-t-15 hover-underline'>
                        <Link to={SYSTEM_PATH.LOGIN}>{t('forgetPasswordScreen.linkBackLogin')}</Link>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default ForgetPasswordScreen;