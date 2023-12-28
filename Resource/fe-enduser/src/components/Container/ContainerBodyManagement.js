import { observer } from 'mobx-react';
import { Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import './style.scss';
import { useStore } from '../../core/utils/hook';
import { ROLE } from '../../core/configs/constants';
import NotFoundScreen from '../../screens/404/NotFoundScreen';
import { useEffect } from 'react';

const ContainerBodyManagement = observer(props => {

    // store
    const { authStore: { userInfo, setIsTeacherManagementPage } } = useStore();

    // lifecycle
    useEffect(() => {
        if(userInfo?.roleId === ROLE.ROLE_TEACHER) {
            setIsTeacherManagementPage(true);
        }

        return () => {
            setIsTeacherManagementPage(false);
        }
    }, [userInfo])

    if(userInfo?.roleId !== ROLE.ROLE_TEACHER) return <NotFoundScreen/>

    return (
        <div className='d-flex h-100 w-100'>
            <div className='wrapper-side-bar'>
                <SideBar/>
            </div>
            <div className='wrapper-container-with-side-bar py-5 px-5'>
                <Outlet/>
            </div>
        </div>
    )
})

export default ContainerBodyManagement;