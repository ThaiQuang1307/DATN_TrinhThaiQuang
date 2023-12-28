import BaseController from "../BaseController";

class AuthController extends BaseController {

    // Login
    async asyncLogin(req, res, next, typeSystem = this.constants.TYPE_SYSTEM.END_USER) {
        const TITLE = '[Login]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { error, value } = this.authValidate.login(req.body);
            if(error) {
                result = this.result(false, 400, error?.details[0]?.message, null);
                return;
            }

            result = await this.authService.asyncLogin(value, typeSystem);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // Logout
    async asyncLogout(req, res, next) {
        const TITLE = '[Logout]';
        console.log(TITLE, 'start...');
        let result;
        try {
            result = await this.authService.asyncLogout(req.token);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }
}

export default AuthController;