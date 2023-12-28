import { observer } from 'mobx-react';
import './style.scss';
import { Outlet } from 'react-router-dom';
// import ChangeLanguage from '../Translation/ChangeLanguage';
import { useStore } from '../../core/utils/hook';
import { useEffect } from 'react';

const ContainerNotAuthentication = observer(() => {

    // store
    const { authStore: { clearAuthentication } } = useStore();

    useEffect(() => {
        clearAuthentication();
    }, [])

    return (
        <div className='container-not-authentication h-100 w-100'>
            <div className='change-language'>
                {/* <ChangeLanguage/> */}
            </div>
            <Outlet />
        </div>
    )
})

export default ContainerNotAuthentication;