import BaseController from '../BaseController';

class PermissionController extends BaseController {

    // Create
    async asyncCreatePermission(req, res, next) {
        const TITLE = '[Create permission]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { error, value } = this.permissionValidate.createPermission(req.body);
            if(error) {
                result = this.result(false, 400, error?.details[0]?.message, null);
                return;
            }

            result = await this.permissionService.asyncCreatePermission(value);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // get

    async asyncGetAllPermission(req, res, next) {
        const TITLE = '[Get all permission]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { isSearch = null } = req.query;
            result = await this.permissionService.asyncGetAllPermission(isSearch);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    async asyncGetPermission(req, res, next) {
        const TITLE = '[Get permission]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { id } = req.params;
            result = await this.permissionService.asyncGetPermission(id);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // update
    async asyncUpdatePermission(req, res, next) {
        const TITLE = '[Update permission]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { error, value } = this.permissionValidate.updatePermission(req.body);
            if(error) {
                result = this.result(false, 400, error?.details[0]?.message, null);
                return;
            }
            const { id } = req.params;
            result = await this.permissionService.asyncUpdatePermission(id, value);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // delete
    async asyncDeletePermission(req, res, next) {
        const TITLE = '[Delete permission]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { id } = req.params;
            result = await this.permissionService.asyncUpdatePermission(id, { delete_flag: true });
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }
}

export default PermissionController;