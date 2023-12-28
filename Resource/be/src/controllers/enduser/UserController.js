import { uploadCloudUserImage } from '../../helpers/upload';
import BaseController from '../BaseController';

class UserController extends BaseController {

    // Get
    async asyncGetAllUser(req, res, next) {
        const TITLE = '[Get all user]';
        console.log(TITLE, 'start...');
        let result;
        try {
            req.query.status = this.constants.STATUS_OB.ACTIVE;
            result = await this.userService.asyncGetAllUser(req);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // Create
    async asyncCreateUser(req, res, next) {
        const TITLE = '[Create user]';
        console.log(TITLE, 'start...');
        try {
            uploadCloudUserImage(req, res, async err => {
                let result, image;
                // validate req body
                req.body.roleId = this.constants.ROLE_STUDENT;
                const { error, value } = this.userValidate.createUser(req.body);
                if(error) return res.status(400).json({data: {} , message: error.details[0].message, success: false});
                if(err) return res.status(400).json({data: {}, message: 'Only .png, .jpg and .jpeg format allowed!', success: false});
                
                // check file image
                if(req.file) {
                    image = req.file.path;
                }
                result = await this.userService.asyncCreateUser({
                    ...value, 
                    image
                })
                this.processResponse(res, result);
            }) 
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                data: null,
                message: error.message
            });
        } finally {
            console.log(TITLE, 'end...');
        }
    }

    // Update
    async asyncUpdateUser(req, res, next) {
        const TITLE = '[Update user]';
        console.log(TITLE, 'start...');
        try {
            uploadCloudUserImage(req, res, async err => {
                let result;
                const { id } = req.user;
                let { image, ...payload } = req.body;
                // validate req body
                const { error, value } = this.userValidate.updateUser(payload);
                if(error) return res.status(400).json({data: {} , message: error.details[0].message, success: false});
                if(err) return res.status(400).json({data: {}, message: 'Only .png, .jpg and .jpeg format allowed!', success: false});
                
                // check file image
                if(req.file) {
                    image = req.file.path;
                }
                result = await this.userService.asyncUpdateUser(id, {
                    ...payload,
                    image
                })
                this.processResponse(res, result);
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                data: null,
                message: error.message
            });
        } finally {
            console.log(TITLE, 'end...');
        }
    }
}

export default UserController;