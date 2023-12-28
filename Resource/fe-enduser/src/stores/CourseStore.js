import { action, flow, makeObservable, observable } from 'mobx';
import { CourseApi } from '../apis';
import BaseStore from './BaseStore';

class CourseStore extends BaseStore {

    courseList = [];
    courseOptions = [];
    course = {};
    searchCourse = '';

    commentList = [];

    classificationKnowledge = [];
    countClassificationKnowledge = {};

    constructor(rootStore) {
        super();
        makeObservable(this, {
            courseList: observable,
            courseOptions: observable,
            course: observable,
            commentList: observable,
            searchCourse: observable,
            classificationKnowledge: observable,
            countClassificationKnowledge: observable,
            getAllCourse: flow.bound,
            getCourseDetail: flow.bound,
            voteCourse: flow.bound,
            joinCourse: flow.bound,
            updateTimeView: flow.bound,
            getAllComment: flow.bound,
            submitComment: flow.bound,
            submitTestAnswer: flow.bound,
            getAllCourseForTeacherManagement: flow.bound,
            getAllCourseOptions: flow.bound,
            getCourseInfo: flow.bound,
            createCourse: flow.bound,
            updateCourse: flow.bound,
            deleteCourse: flow.bound,
            getClassificationStudentKnowledge: flow.bound,
            getJoinCoursesOfStudent: flow.bound,
            getCountClassificationStudentKnowledge: flow.bound,
            setSearchCourse: action.bound,
            cleanCourseDetail: action.bound
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
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getAllCourseForTeacherManagement, searchParams);
            if(res?.ok) {
                this.courseOptions = res?.data?.elements || [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    *getCourseDetail(id, payload, updateAfterTest = false) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getCourseDetail, { id, payload });
            if(res?.ok) {
                if(!updateAfterTest) {
                    this.course = res?.data;
                } else {
                    this.course.score = res?.data?.score;
                    this.course.testDate = res?.data?.testDate;
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    *voteCourse(id, payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.voteCourse, { id, payload });
            if(res?.ok) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *joinCourse(id, payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.joinCourse, { id, payload });
            if(res?.ok) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *updateTimeView(courseId, payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.updateTimeView, { courseId, payload }, false, null, true);
            if(res?.ok) {
                this.course = { ...this.course, ...res?.data };
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *getAllComment(courseId, searchParams) {
        try {
            const { size, page, sortDir, sortKey } = this.paging;
            const payload = { size, page, sortDir, sortKey, ...searchParams };
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getAllComment, { courseId, payload });
            if(res?.ok) {
                this.commentList = res?.data?.elements || [];
                this.setAttrObservable('paging', res?.data?.paginate, true, false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    *submitComment(courseId, payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.submitComment, { courseId, payload });
            if(res?.ok) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *submitTestAnswer(courseId, payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.submitTestAnswer, { courseId, payload });
            if(res?.ok) {
                return res?.data?.length > 0 ? res.data.map(e => ({ ...e, correct: String(e.correct), beforeCorrect: String(e.correct)})) : true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *getAllCourseForTeacherManagement(searchParams) {
        try {
            const { size, page, sortDir, sortKey } = this.paging;
            const payload = { size, page, sortDir, sortKey, ...searchParams };
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getAllCourseForTeacherManagement, payload);
            if(res?.ok) {
                this.courseList = res?.data?.elements || [];
                this.setAttrObservable('paging', res?.data?.paginate, true, false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    *getCourseInfo(id, payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getCourseInfo, { id, payload });
            if(res?.ok) {
                this.course = res?.data;
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

    *getClassificationStudentKnowledge(searchParams) {
        try {
            const { size, page, sortDir, sortKey } = this.paging;
            const payload = { size, page, sortDir, sortKey, ...searchParams };
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getClassificationStudentKnowledge, payload);
            if(res?.ok) {
                this.classificationKnowledge = res?.data?.elements || [];
                this.setAttrObservable('paging', res?.data?.paginate, true, false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    *getCountClassificationStudentKnowledge(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getCountClassificationStudentKnowledge, payload);
            if(res?.ok) {
                this.countClassificationKnowledge = res?.data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    *getJoinCoursesOfStudent(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getJoinCoursesOfStudent, payload);
            if(res?.ok) {
                this.courseList = res?.data?.elements || [];
                this.setAttrObservable('paging', res?.data?.paginate, true, false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    setSearchCourse(value) {
        this.searchCourse = value;
    }

    clean() {
        super.clean();
        this.courseList = [];
        this.commentList = [];
        this.classificationKnowledge = [];
    }

    cleanCourseDetail() {
        this.course = {};
    }
}

export default CourseStore;