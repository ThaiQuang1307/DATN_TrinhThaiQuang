import { observer } from 'mobx-react';
import { useStore } from '../../core/utils/hook';
import { useEffect } from 'react';
import { ROLE } from '../../core/configs/constants';
import StudentProfileScreen from './StudentProfileScreen';
import TeacherProfileScreen from './TeacherProfileScreen';
import NotFoundScreen from '../404/NotFoundScreen';

const ProfileScreen = observer(props => {
    // store
    const { authStore: { userInfo, getInfo, updateProfile }} = useStore();

    // lifecycle
    useEffect(() => {
        getInfo();
    }, [])

    if(userInfo?.roleId === ROLE.ROLE_USER) return <StudentProfileScreen/>
    else if (userInfo?.roleId === ROLE.ROLE_TEACHER) return <TeacherProfileScreen/>
    
    return <NotFoundScreen/>
})

export default ProfileScreen;