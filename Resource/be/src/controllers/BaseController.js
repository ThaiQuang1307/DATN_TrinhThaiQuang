import { UserService, PermissionService, AuthService, CategoryService, CourseService, CommentService, ClassificationService } from '../services';
import ResponseUtil from '../utils/ResponseUtil';
import { UserValidate, PermissionValidate, AuthValidate, CourseValidate, CategoryValidate } from '../validations';
import constants from '../core/constants';
import fs from 'fs';
import HelperUtil from '../utils/HelperUtil';

class BaseController {

    constructor() {
        // constants
        this.constants = constants;
        // result
        this.result = ResponseUtil.response;
        // helper utils
        this.helper = HelperUtil;
        // service
        this.userService = new UserService();
        this.permissionService = new PermissionService();
        this.authService = new AuthService();
        this.categoryService = new CategoryService();
        this.courseService = new CourseService();
        this.commentService = new CommentService();
        this.classificationService = new ClassificationService();
        // validate
        this.userValidate = new UserValidate();
        this.permissionValidate = new PermissionValidate();
        this.authValidate = new AuthValidate();
        this.courseValidate = new CourseValidate();
        this.categoryValidate = new CategoryValidate();
    }

    processResponse(res, result = null, pathFile = null) {
        if (pathFile) {
            res.download(pathFile, function (err) {
                if (err) {
                    console.log(err);
                }
                fs.unlink(pathFile, () => {});
            });
        }
        else if (result?.success) {
            res.status(200).json({
                ok: true,
                data: result?.data,
                message: 'Success.'
            });
        } else {
            res.status(result?.code ?? 500).json({
                ok: false,
                data: null,
                message: result?.message
            });
        }
    }
}

export default BaseController;