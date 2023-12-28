import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'mobx-react';
import RootStore from './stores';
import { ProSidebarProvider } from 'react-pro-sidebar';
import { I18nextProvider } from 'react-i18next';
import i18n from './core/utils/i18n';

// plugin css
import 'video.js/dist/video-js.css';

// global css
import './index.scss';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={new RootStore()}>
        <I18nextProvider i18n={i18n}>
            <ProSidebarProvider>
                <App />
            </ProSidebarProvider>
        </I18nextProvider>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
