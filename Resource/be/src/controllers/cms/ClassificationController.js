import BaseController from '../BaseController';

class ClassificationController extends BaseController {

    // get
    async asyncGetAllClassification(req, res, next) {
        const TITLE = '[Get all classification]';
        console.log(TITLE, 'start...');
        let result;
        try {
            result = await this.classificationService.asyncGetAllClassification(req);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    async asyncCountClassification(req, res, next) {
        const TITLE = '[Get count classification]';
        console.log(TITLE, 'start...');
        let result;
        try {
            result = await this.classificationService.asyncCountClassification(req);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    async asyncCountStudentsAndCourses(req, res, next) {
        const TITLE = '[Get count student and course]';
        console.log(TITLE, 'start...');
        let result;
        try {
            result = await this.classificationService.asyncCountStudentsAndCourses(req);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }
}

export default ClassificationController;