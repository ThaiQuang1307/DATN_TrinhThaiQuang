import { action, makeObservable, observable } from 'mobx';
import { ReactNotifications } from '../components';
import { MSG } from '../core/configs/constants';

class ApiStore {

    requestCount = 0;
    loading = false;
    dataBody = {};

    constructor(rootStore) {
        makeObservable(this, {
            loading: observable,
            dataBody: observable,
            showLoading: action.bound,
            hideLoading: action.bound,
            setLoading: action.bound
        })
        this.rootStore = rootStore;
    }

    showLoading() {
        this.loading = true;
    }

    hideLoading() {
        this.loading = false;
    }

    setLoading(loading) {
        this.loading = loading;
    }

    handlerGeneralResponseSuccess = (response, returnAll = false) => {
        if (response) {
            if (response?.status === 200) {
                if (!returnAll) return response?.data;
                return response;
            }
            ReactNotifications('error', MSG['api.response.worng_format']);
            // this.rootStore.modalStore.openErrorModal('Error', MSG['api.response.worng_format']);
        }

        throw response;
    }

    handlerGeneralResponseError = async (response, handleErrorByChild, fb = null, disableAlertError = false) => {
        if (handleErrorByChild) {
            throw response;
        }

        try {
            if (response?.status === 401 || response?.status === 403) {
                this.rootStore.authStore.clearAuthentication();
                if (response?.data?.message) {
                    ReactNotifications('error', response?.data?.message);
                    // this.rootStore.modalStore.openErrorModal('Error', response?.data?.message);
                } else {
                    ReactNotifications('error', MSG['api.response.authorization']);
                    // this.rootStore.modalStore.openErrorModal('Error', MSG['api.response.server_error']);
                }
                return;
            }
            else if (response?.status >= 500) {
                if (response?.data?.message) {
                    ReactNotifications('error', response?.data?.message);
                    // this.rootStore.modalStore.openErrorModal('Error', response?.data?.message);
                } else {
                    ReactNotifications('error', MSG['api.response.server_error']);
                    // this.rootStore.modalStore.openErrorModal('Error', MSG['api.response.server_error']);
                }
                return;
            } else if (response?.status) {
                if (!disableAlertError) {
                    let parseBlob;
                    if (response?.data instanceof Blob) {
                        parseBlob = JSON.parse(await response?.data?.text());
                    }
                    if (parseBlob?.message) {
                        ReactNotifications('error', parseBlob?.message);
                        // this.rootStore.modalStore.openErrorModal('Error', parseBlob?.message);
                    } else {
                        ReactNotifications('error', response?.data?.message || MSG['api.response.no_message']);
                        // this.rootStore.modalStore.openErrorModal('Error', response?.data?.message || MSG['api.response.no_message']);
                    }
                }

                fb && fb();

                return response?.data;
            }
        } catch {
            ReactNotifications('error', MSG['api.response.no_network']);
            // this.rootStore.modalStore.openErrorModal('Error', MSG['api.response.no_network']);
        }
    }

    call(context, request, payload = null, handleErrorByChild = false, fb = null, disableLoading = false,
        returnAll = false, disableAlertError = false) {
        this.requestCount += 1;
        if (!disableLoading) this.showLoading();
        return request.apply(context, Object.prototype.toString.call(payload) === '[object Array]' ? payload : [payload])
            .then(response => this.handlerGeneralResponseSuccess(response, returnAll))
            .catch(response => this.handlerGeneralResponseError(response?.response, handleErrorByChild, fb, disableAlertError))
            .finally(() => {
                this.requestCount -= 1;
                if (this.requestCount === 0) {
                    this.hideLoading();
                }
            })
    }
}

export default ApiStore;
