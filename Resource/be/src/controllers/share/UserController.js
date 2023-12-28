import BaseController from '../BaseController';

class UserController extends BaseController {

    // get info
    async asyncGetInfo(req, res, next, typeSystem = this.constants.TYPE_SYSTEM.END_USER) {
        const TITLE = '[Get info]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { id,  email, name, role_id } = req.user;
            if(typeSystem === this.constants.TYPE_SYSTEM.END_USER) {
                result = await this.userService.asyncGetUser(id);
            }
            else {
                result = this.result(true, 200, null, {
                    id, email, name, role_id,
                    permissions: {
                        id: req.permissions?.id,
                        name: req.permissions?.name,
                        permissions: req.permissions?.permissions
                    }
                })
            }
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // Verify uuid
    async asyncVerifyUuid(req, res, next) {
        const TITLE = '[Verify uuid]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { error, value } = this.userValidate.verifyUuid(req.body);
            if(error) {
                result = this.result(false, 400, error?.details[0]?.message, null);
                return;
            }

            result = await this.userService.asyncVerifyUuid(value);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // Set password
    async asyncSetPassword(req, res, next) {
        const TITLE = '[Set password]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { error, value } = this.userValidate.setPassword(req.body);
            if(error) {
                result = this.result(false, 400, error?.details[0]?.message, null);
                return;
            }

            result = await this.userService.asyncSetPassword(value);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // Forget password
    async asyncForgetPassword(req, res, next) {
        const TITLE = '[Forget password]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { error, value } = this.userValidate.forgetPassword(req.body);
            if(error) {
                result = this.result(false, 400, error?.details[0]?.message, null);
                return;
            }

            result = await this.userService.asyncForgetPassword(value);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // Change password
    async asyncChangePassword(req, res, next) {
        const TITLE = '[Change password]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { error, value } = this.userValidate.changePassword(req.body);
            if(error) {
                result = this.result(false, 400, error?.details[0]?.message, null);
                return;
            }

            result = await this.userService.asyncChangePassword(req.user, value);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // confirm email
    async confirmEmail(req, res, next) {
        const LOG_TITLE = `[Confirm email]`;
        console.log(LOG_TITLE, 'Start');

        try {
            const uuid = req.query.uuid;
            const result = await this.userService.confirmEmail(uuid);
            res.status(result.code).json({
                ok: result.success,
                data: result.data,
                message: result.message,
            });
        } catch (error) {
            console.log(LOG_TITLE, error);
            res.status(500).json({
                ok: false,
                data: null,
                message: error.message
            });
        }
        finally {
            console.log(LOG_TITLE, "End");
        }
    }
}

export default UserController;