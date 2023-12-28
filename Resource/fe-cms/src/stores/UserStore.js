import { flow, makeObservable, observable } from 'mobx';
import { UserApi } from '../apis';
import { ROLE } from '../core/configs/constants';
import BaseStore from './BaseStore';

class UserStore extends BaseStore {

    adminList = [];
    userList = [];
    teacherList = [];

    userOptions = [];
    user = {};

    constructor(rootStore) {
        super();
        makeObservable(this, {
            adminList: observable,
            userList: observable,
            teacherList: observable,
            userOptions: observable,
            user: observable,
            getAllUser: flow.bound,
            getUserOptions: flow.bound,
            getUser: flow.bound,
            createUser: flow.bound,
            updateUser: flow.bound,
            deleteUser: flow.bound
        })
        this.rootStore = rootStore;
        this.api = new UserApi();
    }

    *getAllUser(searchParams) {
        try {
            const { size, page, sortDir, sortKey } = this.paging;
            const payload = { size, page, sortDir, sortKey, ...searchParams };
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getAllUser, payload);
            if(res?.ok) {
                if(searchParams.roleId === ROLE.ROLE_ADMIN) {
                    this.adminList = res?.data?.elements || [];
                } 
                if(searchParams.roleId === ROLE.ROLE_USER) {
                    this.userList = res?.data?.elements || [];
                }
                if(searchParams.roleId === ROLE.ROLE_TEACHER) {
                    this.teacherList = res?.data?.elements || [];
                }
                this.setAttrObservable('paging', res?.data?.paginate, true, false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    *getUserOptions(searchParams) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getAllUser, searchParams);
            if(res?.ok) {
                this.userOptions = res?.data?.elements || [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    *getUser(id, payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getUser, { id, payload });
            if(res?.ok) {
                this.user = res?.data ?? {};
            }
        } catch (error) {
            console.log(error);
        }
    }

    *createUser(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.createUser, payload);
            if(res?.ok) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *updateUser(id, payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.updateUser, { id, payload } );
            if(res?.ok) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *deleteUser(id, payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.deleteUser, { id, payload });
            if(res?.ok) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    clean() {
        super.clean();
        this.adminList = [];
        this.userList = [];
        this.teacherList = [];
    }
}

export default UserStore;