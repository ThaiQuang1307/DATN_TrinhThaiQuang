import BaseController from '../BaseController';

class ClassificationController extends BaseController {

    // get
    async asyncGetAllClassification(req, res, next) {
        const TITLE = '[Get all classification]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const teacherId = req.user._id;
            result = await this.classificationService.asyncGetAllClassification(req, teacherId);
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
            const teacherId = req.user._id;
            result = await this.classificationService.asyncCountClassification(req, teacherId);
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