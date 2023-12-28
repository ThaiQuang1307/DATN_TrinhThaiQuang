import { saveAs } from 'file-saver';
import { flow, makeObservable, observable } from 'mobx';
import { AlgorithmApi, OtherApi } from '../apis';
import BaseStore from './BaseStore';

class AlgorithmStore extends BaseStore {

    totalTimeClassify = 0;
    classificationKnowledge = [];
    countClassificationKnowledge = {};
    countStudentAndCourse= {};

    constructor(rootStore) {
        super();
        makeObservable(this, {
            totalTimeClassify: observable,
            classificationKnowledge: observable,
            countClassificationKnowledge: observable,
            countStudentAndCourse: observable,
            splitData: flow.bound,
            subclassAI: flow.bound,
            randomForest: flow.bound,
            svm: flow.bound,
            decisionTree: flow.bound,
            ld: flow.bound,
            nb: flow.bound,
            knn: flow.bound,
            xgb: flow.bound,
            createFakeData: flow.bound,
            dataClassification: flow.bound,
            classifyingStudentKnowledge: flow.bound,
            getClassificationStudentKnowledge: flow.bound,
            getCountClassificationStudentKnowledge: flow.bound,
            getCountStudentAndCourse: flow.bound
        })
        this.rootStore = rootStore;
        this.api = new AlgorithmApi();
        this.otherApi = new OtherApi();
    }

    *splitData(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.splitData, payload);
            saveAs(res, 'split_data.zip'); 
        } catch (error) {
            console.log(error);
        }
    }

    *createFakeData(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.otherApi, this.otherApi.createFakeData, payload);
            saveAs(res, 'fake_data.csv'); 
        } catch (error) {
            console.log(error);
        }
    }

    *dataClassification(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.dataClassification, payload);
            if(res) {
                saveAs(res, 'data_classification.csv'); 
            }
        } catch (error) {
            console.log(error);
        }
    }

    *subclassAI(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.subclassAI, payload);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    *randomForest(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.randomForest, payload);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    *svm(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.svm, payload);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    *decisionTree(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.decisionTree, payload);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    *ld(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.ld, payload);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    *nb(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.nb, payload);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    *knn(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.knn, payload);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    *xgb(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.xgb, payload);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    *classifyingStudentKnowledge(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.otherApi, this.otherApi.classifyingStudentKnowledge, payload);

        } catch (error) {
            console.log(error);
        }
    }

    *getClassificationStudentKnowledge(searchParams) {
        try {
            const { size, page, sortDir, sortKey } = this.paging;
            const payload = { size, page, sortDir, sortKey, ...searchParams };
            const res = yield this.rootStore.apiStore.call(this.otherApi, this.otherApi.getClassificationStudentKnowledge, payload);
            if(res?.ok) {
                this.totalTimeClassify = res?.data?.totalTime ?? 0;
                this.classificationKnowledge = res?.data?.elements || [];
                this.setAttrObservable('paging', res?.data?.paginate, true, false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    *getCountClassificationStudentKnowledge(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.otherApi, this.otherApi.getCountClassificationStudentKnowledge, payload);
            if(res?.ok) {
                this.countClassificationKnowledge = res?.data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    *getCountStudentAndCourse(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.otherApi, this.otherApi.getCountStudentAndCourse, payload);
            if(res?.ok) {
                this.countStudentAndCourse = res?.data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    clean() {
        super.clean();
        this.classificationKnowledge = [];
    }
}

export default AlgorithmStore;