import { flow, makeObservable, observable } from 'mobx';
import { CourseApi } from '../apis';
import BaseStore from './BaseStore';

class CourseStore extends BaseStore {

    // list
    courseList = [];
    courseOptions = [];

    course = {};

    constructor(rootStore) {
        super();
        makeObservable(this, {
            courseList: observable,
            courseOptions: observable,
            course: observable,
            createCourse: flow.bound,
            getAllCourse: flow.bound,
            getAllCourseOptions: flow.bound,
            getCourse: flow.bound,
            updateCourse: flow.bound,
            deleteCourse: flow.bound
        })
        this.rootStore = rootStore;
        this.api = new CourseApi();
    }

    *getAllCourse(searchParams) {
        try {
            const { size, page, sortDir, sortKey } = this.paging;
            const payload = { size, page, sortDir, sortKey, ...searchParams };
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getAllCourse, payload);
            if(res?.ok) {
                this.courseList = res?.data?.elements || [];
                this.setAttrObservable('paging', res?.data?.paginate, true, false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    *getAllCourseOptions(searchParams) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getAllCourse, searchParams);
            if(res?.ok) {
                this.courseOptions = res?.data?.elements || [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    *createCourse(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.createCourse, payload);
            if(res?.ok) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *getCourse(id, payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getCourse, { id, payload });
            if(res?.ok) {
                this.course = res?.data ?? {};
            }
        } catch (error) {
            console.log(error);
        }
    }

    *updateCourse(id, payload, isChangeStatus = false) {
        try {
            let res;
            if(!isChangeStatus) {
                res = yield this.rootStore.apiStore.call(this.api, this.api.updateCourse, { id, payload } );
            } else {
                res = yield this.rootStore.apiStore.call(this.api, this.api.updateCourseStatus, { id, payload } );
            }
            if(res?.ok) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *deleteCourse(id, payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.deleteCourse, { id, payload });
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
        this.courseList = [];
        this.course = {};
    }
}

export default CourseStore;