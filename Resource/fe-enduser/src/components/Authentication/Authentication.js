import { observer } from 'mobx-react';
import { Navigate, Outlet } from 'react-router-dom';
import { SYSTEM_PATH } from '../../core/configs/constants';
import { useStore } from '../../core/utils/hook';

const Authentication = observer(() => {

    const { authStore: { token } } = useStore();

    if(token == null) return <Navigate to={SYSTEM_PATH.LOGIN}/>

    return <Outlet/>
})

export default Authentication;