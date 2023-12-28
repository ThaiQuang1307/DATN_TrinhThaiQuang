import logo from './logo.svg';
import { Suspense } from 'react';
import { ReactNotifications } from 'react-notifications-component';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Authentication, Loading, ReactModal } from './components';
import Root from './routes/Root';

import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import 'react-circular-progressbar/dist/styles.css';
import 'react-tabs/style/react-tabs.css';
import 'video.js/dist/video-js.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.scss';
import './custom.scss';

function App() {
    return (
        <div className='app'>
            <Suspense fallback=''>
                <ReactNotifications isMobile={true} breakpoint={500}/>
                <BrowserRouter>
                    <Routes>
                        <Route>
                            <Route path='/*' element={ <Root/> }/>
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
