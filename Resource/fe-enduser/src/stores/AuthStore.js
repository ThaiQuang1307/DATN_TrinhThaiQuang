import { action, flow, makeObservable, observable } from 'mobx';
import { AuthApi } from '../apis';
import { getSavedInfo, getSavedInfoParse } from '../core/utils/browser';

class AuthStore {

    userInfo = getSavedInfoParse('user');
    token = getSavedInfo('token');
    isTeacherManagementPage = false;

    constructor(rootStore) {
        makeObservable(this, {
            userInfo: observable,
            token: observable,
            isTeacherManagementPage: observable,
            clearAuthentication: action.bound,
            login: flow.bound,
            logout: flow.bound,
            forgetPassword: flow.bound,
            verifyUuid: flow.bound,
            setPassword: flow.bound,
            getInfo: flow.bound,
            changePassword: flow.bound,
            confirmEmail: flow.bound,
            signUp: flow.bound,
            updateProfile: flow.bound,
            setIsTeacherManagementPage: action.bound
        })
        this.rootStore = rootStore;
        this.api = new AuthApi();
    }

    saveUserInfo(data) {
        if (!data) {
            return;
        }

        if (data.token) {
            this.token = data.token;
            localStorage.setItem('token', data.token);
        }

        if(data.user) {
            this.userInfo = data.user;
            localStorage.setItem('user', JSON.stringify(data.user));
        }
    }

    *login(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.login, payload);
            if(res?.ok) {
                this.saveUserInfo(res?.data);
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *logout(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.logout, payload);
            if(res?.ok) {
                this.clearAuthentication();
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *forgetPassword(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.forgetPassword, payload);
            if(res?.ok) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *verifyUuid(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.verifyUuid, payload);
            if(res?.ok) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *setPassword(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.setPassword, payload);
            if(res?.ok) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *getInfo(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getInfo, payload);
            if(res?.ok) {
                this.userInfo = { ...this.user, ...(res?.data ?? {}) };
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *changePassword(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.changePassword, payload);
            if(res?.ok) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *confirmEmail(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.confirmEmail, payload, false, null, false, false, true);
            if(res?.data) {
                return res?.data;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *signUp(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.signUp, payload);
            if(res?.ok) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *updateProfile(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.updateProfile, payload);
            if(res?.ok) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    setIsTeacherManagementPage(value) {
        this.isTeacherManagementPage = value;
    }

    clearAuthentication() {
        localStorage.clear();
        sessionStorage.clear();
        this.token = null;
        this.userInfo = null;
    }
}

export default AuthStore;