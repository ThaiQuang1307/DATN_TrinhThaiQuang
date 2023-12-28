import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ReactNotifications } from '../../components';
import { MSG, PERMISSIONS } from '../../core/configs/constants';
import { useStore, useTitle } from '../../core/utils/hook';
import SettingPermissionScreen from './SettingPermissionScreen';
import { useTranslation } from 'react-i18next';

const PermissionScreen = observer((props) => {

    // translation
    const { t, i18n: { language } } = useTranslation();

    // other
    useTitle(t('permissionScreen.titleDocument'));

    // store
    const {
        permissionStore: { permissionsList, permissions, getAllPermissions, getPermission, updatePermission, deletePermission, setAttrObservable },
        modalStore: { show, hide, openWarningModal }
    } = useStore();

    // state
    const keys = PERMISSIONS.map(e => e.key);
    const { register, handleSubmit, formState: { isSubmitting }, setValue, watch, getValues, reset } = useForm();
    const [isCheckAll, setIsCheckAll] = useState(false);

    const watchPermission = watch('permissions');

    // lifecycle
    useEffect(() => {
        getAllPermissions();
    }, [])

    useEffect(() => {
        if (permissionsList?.length > 0) {
            getPermission(permissions.id ?? permissionsList[0].id);
        }
    }, [permissionsList])

    useEffect(() => {
        reset(toJS(permissions));
    }, [permissions.id])

    useEffect(() => {
        if (Object.values(watchPermission ?? {}).filter(e => e === true).length === keys.length) {
            setIsCheckAll(true);
        } else {
            setIsCheckAll(false);
        }
    }, [watchPermission])

    // function
    const onChangeSelectedAll = (e) => {
        setValue('permissions', keys.reduce((a, v) => ({ ...a, [v]: e.target.checked }), {}));
    }

    const onChangeSelectedPermission = (e, key) => {
        setValue('permissions', {
            ...getValues('permissions'),
            [key]: e.target.checked
        })
    }

    const onUpdatePermission = async (data) => {
        const { id, ...payload } = data;
        const res = await updatePermission(id, payload);
        if (res) {
            ReactNotifications('success', MSG['inform.success.update'][language]);
            if (data.name !== permissions.name) {
                getAllPermissions();
            }
            getPermission(id);
        }
    }

    const onShowSettingPermissionScreen = () => {
        show({
            id: 'setting-permission-modal',
            isOpen: true,
            header: t('permissionScreen.createPermission'),
            onCancel: hide,
            children: (
                <SettingPermissionScreen />
            ),
            type: 'medium'
        })
    }

    const onShowConfirmDeletePermission = () => {
        openWarningModal(language !== 'en' ? `Bạn có muốn xóa phân quyền [${permissions.name}] không?`
            // : `Do you want to remove permission [${permissions.name}]?`, onDeletePermission)
            : `Bạn có muốn xóa phân quyền [${permissions.name}]?`, onDeletePermission)
    }

    const onDeletePermission = async () => {
        const res = await deletePermission(permissions.id);
        if (res) {
            ReactNotifications('success', MSG['inform.success.delete'][language]);
            await setAttrObservable('permissions', {});
            getAllPermissions();
        }
    }

    return (
        <div className='permission-screen'>
            <div className='container-title'>{t('permissionScreen.titleScreen')}</div>
            <div className='container-content'>
                <form onSubmit={handleSubmit(onUpdatePermission)}>
                    <div className='row align-items-center justify-content-between'>
                        <select className='width-200' onChange={(e) => getPermission(e.target.value)}>
                            {
                                permissionsList?.length > 0 &&
                                permissionsList.map(e => (
                                    <option key={e.id} value={e.id}>{e.name}</option>
                                ))
                            }
                        </select>
                        <button type='button' className='btn btn-default-2 width-200'
                            onClick={onShowSettingPermissionScreen}>{t('permissionScreen.createPermission')}</button>
                    </div>
                    <div className='row'>
                        <div className='col-4 mx-auto mg-t-20 border-end pd-r-30'>
                            <label htmlFor={'name'} className='w-100 mg-t-10'>{t('permissionScreen.name')}</label>
                            <input type={'text'} id={'name'} {...register('name')} className='w-100 mg-t-10' />
                            <label htmlFor={'description'} className='w-100 mg-t-10'>{t('permissionScreen.description')}</label>
                            <textarea type={'text'} id={'description'} {...register('description')} className='w-100 mg-t-10 min-height-100' />
                        </div>
                        <div className='col-8 mx-auto mg-t-20 pd-lr-30'>
                            <div className='d-flex align-item-center justify-content-between mg-t-10'>
                                <label htmlFor={'all'}>{t('common.all')}</label>
                                <input type={'checkbox'} id={'all'}
                                    checked={isCheckAll}
                                    onChange={onChangeSelectedAll}
                                />
                            </div>
                            {
                                PERMISSIONS.map(permission => (
                                    <div key={permission.key} className='d-flex align-item-center justify-content-between mg-t-10'>
                                        <label htmlFor={permission.key}>{permission.name[language]}</label>
                                        <input type={'checkbox'}
                                            id={permission.key}
                                            checked={getValues(`permissions.${permission.key}`) ?? false}
                                            onChange={e => onChangeSelectedPermission(e, permission.key)} />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className='text-center mg-t-30'>
                        <button type={'submit'} className='btn btn-default-2 mg-l-50 width-150' disabled={isSubmitting}>{t('common.update')}</button>
                        <button type={'button'} className='btn btn-default-danger  mg-l-50 width-150'
                            onClick={onShowConfirmDeletePermission}>{t('common.delete')}</button>
                    </div>
                </form>
            </div>
        </div>
    )
})

export default PermissionScreen;