import { observer } from 'mobx-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '../../core/utils/yupValidate';
import { useStore } from '../../core/utils/hook';
import { MSG, SCREEN_MODE, ROLE } from '../../core/configs/constants';
import { useEffect } from 'react';
import { ReactNotifications } from '../../components';
import { useTranslation } from 'react-i18next';

const SettingAdminScreen = observer((props) => {

    // translation
    const { t, i18n: { language } } = useTranslation();

    // props
    const { mode, id } = props;

    // store
    const {
        permissionStore: { permissionsList, getAllPermissions },
        userStore: { createUser, getAllUser, clean, getUser, user, setAttrObservable, updateUser },
        modalStore: { hide }
    } = useStore();

    // state
    const validateSchema = yup.object().shape({
        name: yup.string().trim().required(MSG['error.required'][language]),
        email: yup.string().email(MSG['error.email_format'][language]).required(MSG['error.required'][language]),
        permissionId: yup.lazy((value) => {
            if(value === '') {
                return yup.string().required(MSG['error.required'][language]);
            }
            return yup.number()
        }),
        roleId: yup.number().required(MSG['error.required'][language])
    })
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting }, 
        reset
    } = useForm({ resolver: yupResolver(validateSchema), mode: 'onChange' });

    // lifecycle
    useEffect(() => {
        const getData = async () => {
            await getAllPermissions({ isSearch: true });
            if(mode === SCREEN_MODE.EDIT) {
                getUser(id);
            }
        }
        getData();

        return () => {
            setAttrObservable('user', {});
        }
    }, [mode])

    useEffect(() => {
        const { name, email, permission } = user;
        reset((user && mode === SCREEN_MODE.EDIT && id) ? 
            { name, email, permissionId: permission?.id, roleId: ROLE.ROLE_ADMIN } 
            : 
            { permissionId: '', roleId: ROLE.ROLE_ADMIN });
    }, [user])

    // function

    const onSubmitSettingAdmin = async (data) => {
        let res;
        if(mode === SCREEN_MODE.ADD) {
            res = await createUser(data);
        } else if (mode === SCREEN_MODE.EDIT) {
            const { name, email, permissionId } = data;
            res = await updateUser(id, { name, email, permissionId });
        }

        if(res) {
            ReactNotifications('success', mode === 0 ? MSG['inform.success.create'][language] : MSG['inform.success.update'][language]);
            if(mode === SCREEN_MODE.ADD) clean();
            await getAllUser({ roleId: ROLE.ROLE_ADMIN  });
            hide();
        }
    }

    return(
        <div className='setting-admin-screen pd-30'>
            <form onSubmit={handleSubmit(onSubmitSettingAdmin)}>
                <div className='row'>
                    <label className='field-required col-3-5'>{t('settingAdminScreen.fullName')}</label>
                    <div className='col-8 pd-0'>
                        <input {...register('name')} className='w-100'/>
                        {
                            errors.name &&
                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors.name?.message}</div>
                        }
                    </div>
                </div>
                <div className='row mg-t-15'>
                    <label className='field-required col-3-5'>{t('settingAdminScreen.email')}</label>
                    <div className='col-8 pd-0'>
                        <input {...register('email')} className='w-100'/>
                        {
                            errors.email &&
                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors.email?.message}</div>
                        }
                        {
                            user?.newEmail &&
                            <div className='text-danger fs-error mg-t-5 pd-0'>
                                <i className='fa-solid fa-circle-info mg-r-5'/>
                                {
                                    language === 'en' ? 
                                        <span>There is a request to change the email to "{user.newEmail}". 
                                            Please check your email inbox for confirmation.
                                        </span>
                                        :
                                        <span>Có yêu cầu thay đổi email thành "{user.newEmail}". 
                                            Vui lòng kiểm tra hộp thư đến email của bạn để xác nhận.
                                        </span>
                                }
                            </div>
                        }
                    </div>
                </div>
                <div className='row mg-t-15'>
                    <label className='field-required col-3-5'>{t('settingAdminScreen.permission')}</label>
                    <div className='col-8 pd-0'>
                        <select {...register('permissionId')} className='w-100'>
                            <option value={''}>{t('settingAdminScreen.selectPermission')}</option>
                            {
                                permissionsList?.length > 0 &&
                                permissionsList.map(e => <option key={e.id} value={e.id}>{e.name}</option>)
                            }
                        </select>
                        {
                            errors.permissionId &&
                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors.permissionId?.message}</div>
                        }
                    </div>
                </div>
                <div className='d-flex justify-content-center align-items-center mg-t-40'>
                    <button type='button' className='btn btn-default-1 width-150' onClick={hide}>{t('common.cancel')}</button>
                    <button type='submit' className='btn btn-default-2 width-150 mg-l-50' disabled={isSubmitting}>
                        {SCREEN_MODE.ADD === mode ? t('common.create') : t('common.update')}
                    </button>
                </div>
            </form>
        </div>
    )
})

export default SettingAdminScreen;