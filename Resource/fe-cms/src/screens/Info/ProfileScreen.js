import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { useStore, useTitle } from '../../core/utils/hook';
import { useTranslation } from 'react-i18next';

const ProfileScreen = observer(props => {

    // translation
    const { t, i18n: { language } } = useTranslation();

    // other
    useTitle(t('profileScreen.titleDocument'));

    // store
    const { authStore: { userInfo, getInfo } } = useStore();

    // lifecycle
    useEffect(() => {
        getInfo();
    }, [])

    return(
        <div className='profile-screen'>
            <div className='container-title'>{t('profileScreen.titleScreen')}</div>
            <div className='mx-auto width-500 pd-30'>
                <div className='row align-items-center'>
                    <span className='fw-bold col-3'>{t('profileScreen.fullName')}:</span>
                    <span className='col-9'>{userInfo?.name}</span>
                </div>
                <div className='row align-items-center mg-t-15'>
                    <span className='fw-bold col-3'>{t('profileScreen.email')}:</span>
                    <span className='col-9'>{userInfo?.email}</span>
                </div>
                <div className='row align-items-center mg-t-15'>
                    <span className='fw-bold col-3'>{t('profileScreen.role')}:</span>
                    <span className='col-9'>Quản trị viên</span>
                </div>
                <div className='row align-items-center mg-t-15'>
                    <span className='fw-bold col-3'>{t('profileScreen.permission')}:</span>
                    <span className='col-9'>{userInfo?.permissions?.name}</span>
                </div>
            </div>
        </div>
    )
})

export default ProfileScreen;