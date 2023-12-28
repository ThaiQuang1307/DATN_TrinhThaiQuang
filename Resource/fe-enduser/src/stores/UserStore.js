import { flow, makeObservable, observable } from 'mobx';
import { UserApi } from '../apis';
import BaseStore from './BaseStore';

class UserStore extends BaseStore {

    teacherList = [];

    constructor(rootStore) {
        super();
        makeObservable(this, {
            teacherList: observable,
            getAllTeacher: flow.bound
        })
        this.rootStore = rootStore;
        this.api = new UserApi();
    }

    *getAllTeacher(searchParams) {
        try {
            const { size, page, sortDir, sortKey } = this.paging;
            const payload = { size, page, sortDir, sortKey, ...searchParams };
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getAllUser, payload);
            if(res?.ok) {
                this.teacherList = res?.data?.elements || [];
                this.setAttrObservable('paging', res?.data?.paginate, true, false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    clean() {
        super.clean();
        this.teacherList = [];
    }
}

export default UserStore;