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
                    const teacherId = req.user.id;
                    const { name, categoryId, videoLength, description, testQuestions } = req.body;
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
            req.query.status = this.constants.STATUS_OB.ACTIVE;
            result = await this.courseService.asyncGetAllCourseForEndUser(req.query);
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
            result = await this.courseService.asyncGetCourseForEndUser(id, req.user);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    async asyncGetAllCourseForTeacher(req, res, next) {
        const TITLE = '[Get all course for teacher]';
        console.log(TITLE, 'start...');
        let result;
        try {
            req.query.teacherIdInt = req.user.id;
            result = await this.courseService.asyncGetAllCourse(req);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    async asyncGetCourseInfo(req, res, next) {
        const TITLE = '[Get course info]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { id } = req.params;
            const teacherId = req.user._id;
            result = await this.courseService.asyncGetCourse(id, teacherId);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    async asyncGetAllJoinCourseForStudent(req, res, next) {
        const TITLE = '[Get all join course for student]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const studentId = req.user._id;
            result = await this.courseService.asyncGetAllJoinCourseForStudent({
                studentId,
                ...req.query
            });
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
                const teacherId = req.user._id;
                const teacherIdInt = req.user.id;
                let { image, video, status, ...payload } = req.body;
                if(status === undefined || status === null) {
                    // validate req body
                    const { error, value } = this.courseValidate.createUpdateCourse({ ...payload, teacherId: teacherIdInt });
                    if(error) return res.status(400).json({data: {} , message: error.details[0].message, success: false});
                }
                if(err) return res.status(400).json({data: {}, message: 'Only .png, .jpg and .jpeg formats are allowed for images and .mp4 for videos!', success: false});
                
                result = await this.courseService.asyncUpdateCourse(id, {
                    ...payload,
                    teacherId: teacherIdInt,
                    image: req.files.image?.[0]?.path ?? image,
                    video: req.files.video?.[0]?.path ?? video,
                    status
                }, teacherId)

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
            const teacherId = req.user._id;
            const { error, value } = this.courseValidate.updateStatusCourse(req.body);
            if(error) {
                result = this.result(false, 400, error?.details[0]?.message, null);
                return;
            }
            result = await this.courseService.asyncUpdateCourse(id, value, teacherId);
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
            const teacherId = req.user.id;
            result = await this.courseService.asyncDeleteCourse(id, teacherId);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // join
    async asyncJoinCourse(req, res, next) {
        const TITLE = '[Join course]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { id: courseId } = req.params;
            result = await this.courseService.asyncJoinCourse(req.user, courseId);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // update time view course
    async asyncUpdateTimeViewCourse(req, res, next) {
        const TITLE = '[Update time view course]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { id: courseId } = req.params;
            result = await this.courseService.asyncUpdateTimeViewCourse(req.user, courseId, req.body);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // vote
    async asyncVoteCourse(req, res, next) {
        const TITLE = '[Vote course]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { id: courseId } = req.params;
            result = await this.courseService.asyncVoteCourse(req.user, courseId, req.body);
        } catch (error) {
            console.log(error);
            result = this.result(false, 500, error.message, null);
        } finally {
            this.processResponse(res, result);
            console.log(TITLE, 'end...');
        }
    }

    // submit test
    async asyncTestQuestionsResult(req, res, next) {
        const TITLE = '[Test question course]';
        console.log(TITLE, 'start...');
        let result;
        try {
            const { id: courseId } = req.params;
            result = await this.courseService.asyncTestQuestionsResultByCourse(req.user, courseId, req.body);
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