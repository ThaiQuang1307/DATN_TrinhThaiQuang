import BaseController from '../BaseController';

class CommentController extends BaseController {

    // Create
    async asyncCreateComment(req, res, next) {
        const TITLE = '[Create comment]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { id: courseId } = req.params;
            result = await this.commentService.asyncCreateComment(req.user, courseId, req.body);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // Get
    async asyncGetAllComment(req, res, next) {
        const TITLE = '[Get all comment]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { id: course_id } = req.params;
            result = await this.commentService.asyncGetAllComment(course_id, req);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }
}

export default CommentController;