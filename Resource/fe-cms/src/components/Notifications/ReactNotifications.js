/* eslint-disable indent */
import { Store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css'

const ReactNotifications = (type, message) => {
    switch (type) {
        case 'info':
            Store.addNotification({
                // title: 'Info!', // The 'info' notification doesn't need a title
                message: message,
                type: 'info',
                insert: 'top',
                container: 'top-right',
                animationIn: ['animated', 'fadeIn'],
                animationOut: ['animated', 'fadeOut'],
                dismiss: { duration: 0, showIcon: true }
            });
            break;
        case 'success':
            Store.addNotification({
                // title: 'Success!',
                title: 'Thành công!',
                message: message,
                type: 'success',
                insert: 'top',
                container: 'top-right',
                animationIn: ['animated', 'fadeIn'],
                animationOut: ['animated', 'fadeOut'],
                dismiss: { duration: 1500, showIcon: true }
            });
            break;
        case 'warning':
            Store.addNotification({
                // title: 'Warning!',
                title: 'Cảnh báo!',
                message: message,
                type: 'warning',
                insert: 'top',
                container: 'top-right',
                animationIn: ['animated', 'fadeIn'],
                animationOut: ['animated', 'fadeOut'],
                dismiss: { duration: 1500, showIcon: true }
            });
            break;
        case 'error':
            Store.addNotification({
                // title: 'Error!',
                title: 'Lỗi!',
                message: message,
                type: 'danger',
                insert: 'top',
                container: 'top-right',
                animationIn: ['animated', 'fadeIn'],
                animationOut: ['animated', 'fadeOut'],
                dismiss: { duration: 1500, showIcon: true }
            });
            break;
        default:
            Store.addNotification({
                // title: 'Warning!',
                title: 'Cảnh báo!',
                message: message,
                type: 'warning',
                insert: 'top',
                container: 'top-right',
                animationIn: ['animated', 'fadeIn'],
                animationOut: ['animated', 'fadeOut'],
                dismiss: { duration: 1500, showIcon: true }
            });
    }
};

export default ReactNotifications;
