import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SYSTEM_PATH } from './core/configs/constants';
import Root from './routes/Root';
import { ReactNotifications } from 'react-notifications-component';
import LoginScreen from './screens/Login/LoginScreen';
import { Authentication, Loading, ReactModal } from './components';
import Modal from 'react-modal';
import ForgetPasswordScreen from './screens/Password/ForgetPasswordScreen';
import SetPasswordScreen from './screens/Password/SetPasswordScreen';
import ContainerNotAuthentication from './components/Container/ContainerNotAuthentication';

import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'animate.css';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import './App.scss';
import ConfirmEmailScreen from './screens/ConfirmEmail/ConfirmEmailScreen';


// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

const App = () => {
    return (
        <div className='app'>
            <Suspense fallback=''>
                <ReactNotifications isMobile={true} breakpoint={500}/>
                <BrowserRouter>
                    <Routes>
                        <Route>
                            {/* public route - with out authenticate */}
                            <Route element={ <ContainerNotAuthentication/> }>
                                <Route path={SYSTEM_PATH.LOGIN} element={ <LoginScreen/> }/>
                                <Route path={SYSTEM_PATH.FORGET_PASSWORD} element={ <ForgetPasswordScreen/> }/>
                                <Route path={SYSTEM_PATH.SET_PASSWORD} element={ <SetPasswordScreen/> }/>
                                <Route path={SYSTEM_PATH.CONFIRM_EMAIL} element={ <ConfirmEmailScreen/> }/>
                            </Route>
                            {/* <Route exact path='/test' component={Tests} /> */}
                            {/* private route - with authenticate and base layout*/}
                            <Route element={ <Authentication/> }>
                                <Route path='/*' element={ <Root/> }/>
                            </Route> 
                        </Route>
                    </Routes>
                </BrowserRouter>
                <Loading/>
                <ReactModal/>
            </Suspense>
        </div>
    );
}

export default App;
