import { cloudinary, categoryImageFolder } from '../helpers/upload';
import BaseService from './BaseService';

class CategoryService extends BaseService {

    async asyncCreateCategory(payload) {
        const { name, description } = payload;

        // check name exited
        const existedCategory = await this.categoryRepository.findOne({ name });
        // if (existedCategory) return this.result(false, 400, 'The category name already exists.', null);
        if (existedCategory) return this.result(false, 400, 'Tên danh mục đã tồn tại!', null);

        // create
        await this.categoryRepository.create({ name, description });

        return this.result(true, 200, 'success', null);
    }

    async asyncGetAllCategory(req) {
        // eslint-disable-next-line max-len
        const { size = -1, page = 1, name = '', status = null, sortKey = 'created_at', sortDir = 'asc', short = false } = req.query;

        let result;
        const queryData = await this.categoryRepository.paginate({
            limit: size,
            page,
            options: {
                name: { $regex: name, $options: 'i' },
                ...(status ? { status } : {})
            },
            sort: {
                ...(sortKey && sortDir ? { [sortKey]: sortDir.toLowerCase() } : {})
            }
        })

        result = queryData;
        if (queryData?.elements?.length > 0) {
            result.elements = await Promise.all(result.elements.map(async category => {
                const numberCourses = await this.courseRepository.getCount({
                    category_id: category._id,
                    status: this.constants.STATUS_OB.ACTIVE
                });
                return this.responseCategory({ ...category._doc, numberCourses }, short);
            }))
        }

        return this.result(true, 200, null, result);
    }

    async asyncGetCategory(id, short = false) {
        let result = await this.categoryRepository.findOne({ id });
        // if (!result) return this.result(false, 404, 'Category does not exist.', null);
        if (!result) return this.result(false, 404, 'Danh mục không tồn tại!', null);

        result = this.responseCategory(result, short);

        return this.result(true, 200, null, result);
    }

    async asyncUpdateCategory(id, payload) {
        const { name, description, image, status } = payload;

        const existedCategory = await this.categoryRepository.findOne({ id });
        // if (!existedCategory) return this.result(false, 404, 'Category does not exist.', null);
        if (!existedCategory) return this.result(false, 404, 'Danh mục không tồn tại!', null);

        if (name && name !== existedCategory.name) {
            const existedCategoryName = await this.categoryRepository.findOne({ name: name });
            // if (existedCategoryName) return this.result(false, 400, 'The category name already exists.', null);
            if (existedCategoryName) return this.result(false, 400, 'Tên danh mục đã tồn tại!', null);
        }

        // if(image && image !== existedCategory.image) {
        //     const fileName = this.helper.getFileNameFormUrl(existedCategory.image);
        //     await cloudinary.uploader.destroy(`${categoryImageFolder}/${fileName}`, {
        //         resource_type: 'image'
        //     });
        // }

        await this.categoryRepository.update({
            option: { id },
            data: {
                name: name ?? existedCategory.name,
                description: description ?? existedCategory.description,
                // image: image ?? existedCategory.image,
                status: status ?? existedCategory.status
            }
        })

        return this.result(true, 200, 'success', null);
    }

    async asyncDeleteCategory(id) {
        const existedCategory = await this.categoryRepository.findOne({ id });
        // if (!existedCategory) return this.result(false, 404, 'Category does not exist.', null);
        if (!existedCategory) return this.result(false, 404, 'Danh mục không tồn tại!', null);

        // check course
        const courses = await this.courseRepository.findOne({
            category_id: existedCategory._id
        })

        if (courses) {
            // return this.result(false, 404, 'There are courses in category.', null);
            return this.result(false, 404, 'Có khóa học trong danh mục này!', null);
        }

        // const fileName = this.helper.getFileNameFormUrl(existedCategory.image);
        // await cloudinary.uploader.destroy(`${categoryImageFolder}/${fileName}`, {
        //     resource_type: 'image'
        // });

        await this.categoryRepository.update({
            option: { id },
            data: { delete_flag: true }
        })

        return this.result(true, 200, 'success', null);
    }

    responseCategory(category, short = false) {
        const { id, name, description, image, status, created_at: createdAt, _id, numberCourses } = category;
        if (short) return { id, name, _id };
        return { id, name, description, image, status, createdAt, numberCourses };
    }
}

export default CategoryService;