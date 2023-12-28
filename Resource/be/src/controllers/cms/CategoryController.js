import {  uploadCloudCategoryImage } from '../../helpers/upload';
import BaseController from '../BaseController';

class CategoryController extends BaseController {

    // Create
    // async asyncCreateCategory(req, res, next) {
    //     const TITLE = '[Create category]';
    //     console.log(TITLE, 'start...');
    //     try {
    //         uploadCloudCategoryImage(req, res, async err => {
    //             let result;
    //             const { name, description } = req.body;
    //             // validate req body
    //             const { error, value } = this.categoryValidate.createCategory({ name, description });
    //             if(error) return res.status(400).json({data: {} , message: error.details[0].message, success: false});
    //             if(err) return res.status(400).json({data: {}, message: 'Only .png, .jpg and .jpeg format allowed!', success: false});
                
    //             result = await this.categoryService.asyncCreateCategory({
    //                 name, description, image: req?.file?.path
    //             })
                
    //             this.processResponse(res, result);
    //         }) 
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({
    //             ok: false,
    //             data: null,
    //             message: error.message
    //         });
    //     } finally {
    //         console.log(TITLE, 'end...');
    //     }
    // }

    async asyncCreateCategory(req, res, next) {
        const TITLE = '[Create category]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { name, description } = req.body;
            // validate req body
            const { error, value } = this.categoryValidate.createCategory({ name, description });
            if(error) {
                result = this.result(false, 400, error?.details[0]?.message, null);
                return;
            }
            result = await this.categoryService.asyncCreateCategory({
                name, description
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                data: null,
                message: error.message
            });
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // Get
    async asyncGetAllCategory(req, res, next) {
        const TITLE = '[Get all category]';
        console.log(TITLE, 'start...');
        let result;
        try {
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
            result = await this.categoryService.asyncGetCategory(id);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // Update
    // async asyncUpdateCategory(req, res, next) {
    //     const TITLE = '[Update category]';
    //     console.log(TITLE, 'start...');
    //     try {
    //         uploadCloudCategoryImage(req, res, async err => {
    //             let result;
    //             const { id } = req.params;
    //             let { name, description, image, status } = req.body;
    //             if(status === undefined || status === null) {
    //                 // validate req body
    //                 const { error, value } = this.categoryValidate.updateCategory({ name, description });
    //                 if(error) return res.status(400).json({data: {} , message: error.details[0].message, success: false});
    //             }
    //             if(err) return res.status(400).json({data: {}, message: 'Only .png, .jpg and .jpeg format allowed!', success: false});
                
    //             // check file image
    //             if(req.file) {
    //                 image = req.file.path;
    //             }
    //             result = await this.categoryService.asyncUpdateCategory(id, {
    //                 name, description, image, status
    //             })
    //             this.processResponse(res, result);
    //         }) 
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({
    //             ok: false,
    //             data: null,
    //             message: error.message
    //         });
    //     } finally {
    //         console.log(TITLE, 'end...');
    //     }
    // }

    async asyncUpdateCategory(req, res, next) {
        const TITLE = '[Update category]';
        console.log(TITLE, 'start...');
        let result
        try {
            const { id } = req.params;
            let { name, description, status } = req.body;
            if(status === undefined || status === null) {
                // validate req body
                const { error, value } = this.categoryValidate.updateCategory({ name, description });
                if(error) {
                    result = this.result(false, 400, error?.details[0]?.message, null);
                    return;
                }
            }
            result = await this.categoryService.asyncUpdateCategory(id, {
                name, description, status
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                data: null,
                message: error.message
            });
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // Delete
    async asyncDeleteCategory(req, res, next) {
        const TITLE = '[Delete category]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { id } = req.params;
            result = await this.categoryService.asyncDeleteCategory(id);
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