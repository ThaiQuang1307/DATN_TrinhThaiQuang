import joi from 'joi';

class CategoryValidate {

    createCategory(data) {
        const schema = joi.object({
            name: joi.string().required(),
            description: joi.string().allow('', null)
        })
        return schema.validate(data);
    }

    updateCategory(data) {
        const schema = joi.object({
            name: joi.string().required(),
            description: joi.string().allow('', null)
        })
        return schema.validate(data);
    }
}

export default CategoryValidate;