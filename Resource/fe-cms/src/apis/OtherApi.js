import ApiService from './ApiService';

class OtherApi extends ApiService {

    createFakeData(payload) {
        return this.post('create-fake-data', payload, null, 'blob');
    }

    classifyingStudentKnowledge(payload) {
        return this.post('classifying-student-knowledge', payload);
    }

    getClassificationStudentKnowledge(payload) {
        return this.get('classifying-student-knowledge', payload);
    }

    getCountClassificationStudentKnowledge(payload) {
        return this.get('count-classifying-student-knowledge', payload);
    }

    getCountStudentAndCourse(payload) {
        return this.get('count-student-course', payload);
    }

    uploadToCloudinary({ url, payload }) {
        return this.post('', payload, { 'Content-Type': 'multipart/form-data' }, null, url);
    }
}

export default OtherApi;