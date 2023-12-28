import ApiService from './ApiService';

class CourseApi extends ApiService {

    constructor() {
        super('course');
    }

    createCourse(payload) {
        return this.post('', payload, { 'Content-Type': 'multipart/form-data' });
    }

    getAllCourse(payload) {
        return this.get('', payload);
    }

    getCourse({ id, payload }) {
        return this.get(id, payload);
    }

    updateCourse({ id, payload }) {
        return this.put(id, payload, { 'Content-Type': 'multipart/form-data' });
    }

    updateCourseStatus({ id, payload }) {
        return this.put(`${id}/status`, payload);
    }

    deleteCourse({ id, payload }) {
        return this.delete(id, payload);
    }
}

export default CourseApi;