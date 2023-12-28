import { flow, makeObservable, observable } from 'mobx';
import { PermissionApi } from '../apis';
import BaseStore from './BaseStore';

class PermissionStore extends BaseStore {

    permissionsList = []; 
    permissions = {};

    constructor(rootStore) {
        super();
        makeObservable(this, {
            permissionsList: observable,
            permissions: observable,
            createPermission: flow.bound,
            getAllPermissions: flow.bound,
            getPermission: flow.bound,
            updatePermission: flow.bound,
            deletePermission: flow.bound
        })
        this.rootStore = rootStore;
        this.api = new PermissionApi();
    }

    *createPermission(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.createPermission, payload);
            if(res?.ok) {
                return res;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *getAllPermissions(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getAllPermissions, payload);
            if(res?.ok) {
                this.permissionsList = res?.data || [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    *getPermission(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getPermission, payload);
            if(res?.ok) {
                this.permissions = res?.data || [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    *updatePermission(id, payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.updatePermission, { id, payload });
            if(res?.ok) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *deletePermission(id, payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.deletePermission, { id, payload });
            if(res?.ok) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }
}

export default PermissionStore;