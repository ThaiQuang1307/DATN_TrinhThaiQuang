import ApiService from './ApiService';

class CourseApi extends ApiService {
    constructor() {
        super('course');
    }

    getAllCourse(payload) {
        return this.get('', payload);
    }

    getCourseDetail({ id, payload }) {
        return this.get(id, payload);
    }

    voteCourse({ id, payload }) {
        return this.post(`vote/${id}`, payload);
    }

    joinCourse({ id, payload }) {
        return this.post(`join/${id}`, payload);
    }

    getAllComment({ courseId, payload }) {
        return this.get(`comment/${courseId}`, payload);
    }

    submitComment({ courseId, payload }) {
        return this.post(`comment/${courseId}`, payload);
    }

    submitTestAnswer({ courseId, payload }) {
        return this.post(`test-answer/${courseId}`, payload);
    }

    updateTimeView({ courseId, payload }) {
        return this.put(`update-time-view/${courseId}`, payload);
    }

    // teacher
    getAllCourseForTeacherManagement(payload) {
        return this.get('teacher', payload);
    }

    getCourseInfo({ id, payload }) {
        return this.get(`${id}/info`, payload);
    }

    createCourse(payload) {
        return this.post('', payload, { 'Content-Type': 'multipart/form-data' });
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

    getClassificationStudentKnowledge(payload) {
        return this.get('classifying-student-knowledge', payload);
    }

    getCountClassificationStudentKnowledge(payload) {
        return this.get('count-classifying-student-knowledge', payload);
    }

    getJoinCoursesOfStudent(payload) {
        return this.get('my-course', payload);
    }
}

export default CourseApi;
