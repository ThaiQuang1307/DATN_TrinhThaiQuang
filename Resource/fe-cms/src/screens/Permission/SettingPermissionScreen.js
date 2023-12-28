import { observer } from 'mobx-react';
import { useForm } from 'react-hook-form';
import { useStore } from '../../core/utils/hook';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '../../core/utils/yupValidate';
import { MSG, PERMISSIONS } from '../../core/configs/constants';
import { ReactNotifications } from '../../components';
import { useTranslation } from 'react-i18next';

const SettingPermissionScreen = observer((props) => {

    // translation
    const { t, i18n: { language } } = useTranslation();

    // store
    const { modalStore: { hide }, permissionStore: { createPermission, getAllPermissions, setAttrObservable } } = useStore();

    // state
    const validatePermissionSchema = yup.object().shape({
        name: yup.string().required(MSG['error.required'][language]),
        description: yup.string().required(MSG['error.required'][language])
    })
    
    const { 
        register, handleSubmit, 
        formState: { errors, isSubmitting }
    } = useForm({ resolver: yupResolver(validatePermissionSchema), mode: 'onChange' });

    // function
    const onCreatePermission = async (data) => {
        const permissions = PERMISSIONS.reduce((a, v) => ({...a, [v.key]: false}), {});
        const res = await createPermission({...data, permissions});
        if(res) {
            ReactNotifications('success', MSG['inform.success.create'][language]);
            await setAttrObservable('permissions', {});
            getAllPermissions();
            hide();
        }
    }

    return(
        <div className='setting-permission-screen'>
            <form onSubmit={handleSubmit(onCreatePermission)} className='pd-lr-50 pd-tb-20'>
                <label htmlFor={'name'} className='w-100 mg-t-10 field-required'>{t('permissionScreen.name')}</label>
                <input type={'text'} id={'name'} {...register('name')} className='w-100 mg-t-10'/>
                {
                    errors.name &&
                    <div className='text-danger fs-error mg-t-5 pd-0'>{errors.name?.message}</div>
                }
                <label htmlFor={'description'} className='w-100 mg-t-10 field-required'>{t('permissionScreen.description')}</label>
                <textarea type={'text'} id={'description'} {...register('description')} className='w-100 mg-t-10 min-height-100'/>
                {
                    errors.description &&
                    <div className='text-danger fs-error mg-t-5 pd-0'>{errors.description?.message}</div>
                }
                <div className='text-center mg-t-20'>
                    <button type='button' className='btn btn-default-1 width-100 mg-r-20' onClick={hide}>{t('common.cancel')}</button>
                    <button type='submit' className='btn btn-default-2 width-100' disabled={isSubmitting}>{t('common.create')}</button>
                </div>
            </form>
        </div>
    )
})

export default SettingPermissionScreen;