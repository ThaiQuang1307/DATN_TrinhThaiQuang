/* eslint-disable max-len */
import { observer } from 'mobx-react';
import { MSG, SYSTEM_PATH } from '../../core/configs/constants';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import yup from '../../core/utils/yupValidate';
import { yupResolver } from '@hookform/resolvers/yup';
import { useStore } from '../../core/utils/hook';
import classNames from 'classnames';
import { useEffect } from 'react';

const ForgotPasswordScreen = observer((props) => {

    // other
    const navigate = useNavigate();

    // store
    const { authStore: { forgetPassword, clearAuthentication }, modalStore: { openAlert } } = useStore();

    // state
    const validateSchema = yup.object().shape({
        email: yup.string().email(MSG['error.email_format']).required('Please enter your email address')
    })

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(validateSchema), mode: 'onChange' });

    // lifecycle
    useEffect(() => {
        clearAuthentication();
    }, [])

    // function
    const onForgetPassword = async (data) => {
        const res = await forgetPassword(data);
        if(res) {
            openAlert('We have sent you an email. Please check and follow the steps.', () => navigate(SYSTEM_PATH.LOGIN));
        }
    }

    return (
        <>
            {/* Login Start */}
            <div className='container-fluid py-5'>
                <div className='container py-5'>
                    <div className='row justify-content-center'>
                        <div className='col-lg-8'>
                            <h1 className='text-center'>Forgot Password</h1>
                            <form onSubmit={handleSubmit(onForgetPassword)}  className='mt-4'>
                                <div className='control-group'>
                                    <div className='input-group'>
                                        <input {...register('email')} 
                                            type='text' 
                                            className={classNames('form-control rounded-0 rounded-left', errors?.email && 'border-danger')} 
                                            placeholder='Please enter your email'/>
                                        <button type='submit' disabled={isSubmitting} className="btn btn-primary height-50 width-50 rounded-0 rounded-right">
                                            <i className='fas fa-paper-plane'></i>
                                        </button>
                                    </div>
                                    {
                                        errors?.email &&
                                        <p className='help-block error-validate text-danger'>{errors.email?.message}</p>
                                    }
                                </div>
                            </form>
                            <div className='text-center mt-4'>
                                <Link to={SYSTEM_PATH.HOME}>Back to login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Login End */}
        </>
    )
})

export default ForgotPasswordScreen;