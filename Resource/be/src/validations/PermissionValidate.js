import joi from 'joi';

class PermissionValidate {

    createPermission(data) {
        const schema = joi.object({
            name: joi.string().required(),
            description: joi.string().required(),
            permissions: joi.object().required()
        })
        return schema.validate(data);
    }

    updatePermission(data) {
        const schema = joi.object({
            name: joi.string().required(),
            description: joi.string().required(),
            permissions: joi.object().required()
        })
        return schema.validate(data);
    }
}

export default PermissionValidate;