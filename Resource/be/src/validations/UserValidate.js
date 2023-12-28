import joi from 'joi';
import constants from '../core/constants';

class UserValidate {

    createUser(data) {
        const schema = joi.object({
            name: joi.string().required(),
            gender: joi.number().optional().allow('', null),
            birthday: joi.string().optional().allow('', null),
            country: joi.string().optional().allow('', null),
            address: joi.string().optional().allow('', null),
            email: joi.string().email().required(),
            phoneNumber: joi.string().optional().allow('', null),
            roleId: joi.number().valid(...constants.ROLE).required(),
            permissionId: joi.number().optional().allow('', null),
            subject: joi.string().optional().allow('', null),
            introduction: joi.string().optional().allow('', null),
            link: joi.object().optional().allow('', null)
        })
        return schema.validate(data);
    }

    updateUser(data) {
        const schema = joi.object({
            name: joi.string().required(),
            gender: joi.number().optional().allow('', null),
            birthday: joi.string().optional().allow('', null),
            country: joi.string().optional().allow('', null),
            address: joi.string().optional().allow('', null),
            email: joi.string().email().required(),
            phoneNumber: joi.string().optional().allow('', null),
            permissionId: joi.number().optional().allow('', null),
            subject: joi.string().optional().allow('', null),
            introduction: joi.string().optional().allow('', null),
            link: joi.object().optional().allow('', null)
        })
        return schema.validate(data);
    }

    verifyUuid(data) {
        const schema = joi.object({
            uuid: joi.string().required().allow('', null)
        })
        return schema.validate(data);
    }

    setPassword(data) {
        const schema = joi.object({
            uuid: joi.string().required(),
            privateCode: joi.string().required(),
            password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,}$')).min(8).required(),
        })
        return schema.validate(data);
    }

    changePassword(data) {
        const schema = joi.object({
            currentPassword: joi.string().required(),
            password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,}$')).min(8).required(),
        })
        return schema.validate(data);
    }

    forgetPassword(data) {
        const schema = joi.object({
            email: joi.string().required()
        })
        return schema.validate(data);
    }
}

export default UserValidate;