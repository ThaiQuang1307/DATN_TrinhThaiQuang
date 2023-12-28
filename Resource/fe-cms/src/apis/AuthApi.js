import ApiService from './ApiService';

class AuthApi extends ApiService {

    login(payload) {
        return this.post('login', payload);
    }

    logout(payload) {
        return this.post('logout', payload);
    }

    forgetPassword(payload) {
        return this.post('forget-password', payload);
    }

    verifyUuid(payload) {
        return this.post('verify-uuid', payload);
    }

    setPassword(payload) {
        return this.post('set-password', payload);
    }

    getInfo(payload) {
        return this.get('profile', payload);
    }

    changePassword(payload) {
        return this.post('change-password', payload);
    }

    confirmEmail(payload) {
        return this.get('confirm-email', payload);
    }
}

export default AuthApi;