import joi from 'joi';

class AuthValidate {

    login(data) {
        const schema = joi.object({
            email: joi.string().required(),
            password: joi.string().required(),
            isCms: joi.boolean().optional()
        })
        return schema.validate(data);
    }
}

export default AuthValidate;