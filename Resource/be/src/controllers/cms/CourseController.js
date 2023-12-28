import { uploadCloudCourse } from '../../helpers/upload';
import BaseController from '../BaseController';

class CourseController extends BaseController {

    // Create
    async asyncCreateCourse(req, res, next) {
        const TITLE = '[Create course]';
        console.log(TITLE, 'start...');
        try {
            uploadCloudCourse(req, res, async err => {
                let result;
                const { name, categoryId, teacherId, videoLength, description, testQuestions } = req.body;
                // validate req body
                const { error, value } = this.courseValidate.createUpdateCourse({ name, categoryId, teacherId, videoLength, description, testQuestions });
                if(error) return res.status(400).json({data: {} , message: error.details[0].message, success: false});
                if(err) return res.status(400).json({data: {}, message: 'Only .png, .jpg and .jpeg formats are allowed for images and .mp4 for videos!', success: false});

                result = await this.courseService.asyncCreateCourse({
                    ...value, 
                    image: req.files.image?.[0]?.path ?? '',
                    video: req.files.video?.[0]?.path ?? '',
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

    // Get
    async asyncGetAllCourse(req, res, next) {
        const TITLE = '[Get all course]';
        console.log(TITLE, 'start...');
        let result;
        try {
            result = await this.courseService.asyncGetAllCourse(req);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    async asyncGetCourse(req, res, next) {
        const TITLE = '[Get course]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { id } = req.params;
            result = await this.courseService.asyncGetCourse(id);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // Update
    async asyncUpdateCourse(req, res, next) {
        const TITLE = '[Update course]';
        console.log(TITLE, 'start...');
        try {
            uploadCloudCourse(req, res, async err => {
                let result;
                const { id } = req.params;
                let { image, video, status, ...payload } = req.body;
                if(status === undefined || status === null) {
                    // validate req body
                    const { error, value } = this.courseValidate.createUpdateCourse(payload);
                    if(error) return res.status(400).json({data: {} , message: error.details[0].message, success: false});
                }
                if(err) return res.status(400).json({data: {}, message: 'Only .png, .jpg and .jpeg formats are allowed for images and .mp4 for videos!', success: false});
                
                result = await this.courseService.asyncUpdateCourse(id, {
                    ...payload,
                    image: req.files.image?.[0]?.path ?? image,
                    video: req.files.video?.[0]?.path ?? video,
                    status
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

    async asyncUpdateStatusCourse(req, res, next) {
        const TITLE = '[Update status course]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { id } = req.params;
            const { error, value } = this.courseValidate.updateStatusCourse(req.body);
            if(error) {
                result = this.result(false, 400, error?.details[0]?.message, null);
                return;
            }
            result = await this.courseService.asyncUpdateCourse(id, value);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // Delete
    async asyncDeleteCourse(req, res, next) {
        const TITLE = '[Delete course]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { id } = req.params;
            result = await this.courseService.asyncDeleteCourse(id);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // classifying student knowledge
    async asyncClassifyingStudentKnowledge(req, res, next) {
        const TITLE = '[Classifying student knowledge]';
        console.log(TITLE, 'start...');
        let result;
        try {
            result = await this.courseService.asyncClassifyingStudentKnowledge();
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }
}

export default CourseController;