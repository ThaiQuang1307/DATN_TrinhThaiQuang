import {  uploadCloudCategoryImage } from '../../helpers/upload';
import BaseController from '../BaseController';

class CategoryController extends BaseController {

    // Get
    async asyncGetAllCategory(req, res, next) {
        const TITLE = '[Get all category]';
        console.log(TITLE, 'start...');
        let result;
        try {
            if(!(req.user && req.user.role_id === this.constants.ROLE_TEACHER)) {
                req.query.status = this.constants.STATUS_OB.ACTIVE;
            }
            result = await this.categoryService.asyncGetAllCategory(req);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    async asyncGetCategory(req, res, next) {
        const TITLE = '[Get category]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { id } = req.params;
            result = await this.categoryService.asyncGetCategory(id, true);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }
}

export default CategoryController;