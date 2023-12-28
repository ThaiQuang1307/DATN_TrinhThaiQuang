import joi from 'joi';

class CourseValidate {

    createUpdateCourse(data) {
        const schema = joi.object({
            name: joi.string().trim().required(),
            categoryId: joi.number().required(),
            teacherId: joi.number().required(),
            videoLength: joi.number(),
            description: joi.string(),
            testQuestions: joi.array().min(1)
        })
        return schema.validate(data);
    }

    updateStatusCourse(data) {
        const schema = joi.object({
            status: joi.number().valid(0, 1).required()
        })
        return schema.validate(data);
    }
}

export default CourseValidate;