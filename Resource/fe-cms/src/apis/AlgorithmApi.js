import ApiService from './ApiService';

class AlgorithmApi extends ApiService {
    constructor() {
        super(null, null, true);
    }

    subclassAI(payload) {
        return this.post('subclass-ai/', payload, { 'Content-Type': 'multipart/form-data' });
    }

    splitData(payload) {
        return this.post('split-data/', payload, { 'Content-Type': 'multipart/form-data' }, 'blob');
    }

    randomForest(payload) {
        return this.post('random-forest/', payload, { 'Content-Type': 'multipart/form-data' })
    }

    svm(payload) {
        return this.post('svm/', payload, { 'Content-Type': 'multipart/form-data' })
    }

    decisionTree(payload) {
        return this.post('decision-tree/', payload, { 'Content-Type': 'multipart/form-data' })
    }

    ld(payload) {
        return this.post('ld/', payload, { 'Content-Type': 'multipart/form-data' })
    }

    nb(payload) {
        return this.post('nb/', payload, { 'Content-Type': 'multipart/form-data' })
    }

    knn(payload) {
        return this.post('knn/', payload, { 'Content-Type': 'multipart/form-data' })
    }

    xgb(payload) {
        return this.post('xgb/', payload, { 'Content-Type': 'multipart/form-data' })
    }


    dataClassification(payload) {
        return this.put('subclass-ai/', payload, { 'Content-Type': 'multipart/form-data' }, 'blob');
    }
}

export default AlgorithmApi;
