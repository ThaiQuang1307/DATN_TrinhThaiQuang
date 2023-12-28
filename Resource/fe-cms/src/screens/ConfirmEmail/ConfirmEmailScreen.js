import { observer } from 'mobx-react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NotFoundScreen from '../404/NotFoundScreen';
import { CONFIRM_EMAIL_STATUS, CONFIRM_EMAIL_STATUS_STRING, SYSTEM_PATH } from '../../core/configs/constants';
import { useStore } from '../../core/utils/hook';

const ConfirmEmailScreen = observer((props) => {

    // params
    const [searchParams] = useSearchParams();
    const uuid = searchParams.get('uuid');
    
    // store
    const {
        authStore: {  confirmEmail }
    } = useStore();

    const [confirmEmailStatus, setConfirmEmailStatus] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        onConfirmEmail();
    }, [])

    const onConfirmEmail = async () => {
        const res = await confirmEmail({ uuid });
        if (res) {
            setConfirmEmailStatus(res);
        }
        setLoading(false);
    };
    
    if (loading) return null;

    if (!uuid) return (
        <div style={{ margin: '50px auto', textAlign: 'center' }}>
            <NotFoundScreen/>
        </div>
    )

    return (
        <div id='main' className='wrapper'>
            <div className='mg-t-80 d-flex justify-content-center align-items-center flex-column'>
                {
                    confirmEmailStatus === CONFIRM_EMAIL_STATUS.CONFIRM_EMAIL_SUCCESS ?
                        <i className='fa-solid fa-circle-check text-success font-size-70'></i>
                        :
                        <i className='fa-solid fa-circle-xmark text-danger font-size-70'></i>
                }
                <div className='mg-t-50 fw-bolder pd-lr-20'>{CONFIRM_EMAIL_STATUS_STRING[confirmEmailStatus]}</div>
                <button className='mg-t-50 btn btn-default-2 px-4' onClick={() => navigate(SYSTEM_PATH.LOGIN)}>Go to log in</button>
            </div>
        </div>
    );
});

export default ConfirmEmailScreen;
