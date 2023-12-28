class BaseRepository {

    constructor() {}

    create(data) {
        return this.model.create(data);
    }

    createMany(data) {
        return this.model.insertMany(data);
    }

    update({ option, data }) {
        return this.model.findOneAndUpdate(option, data, { new: true });
    }

    updateMany({ option, data }) {
        return this.model.updateMany(option, data);
    }

    delete(option) {
        return this.model.remove(option);
    }

    deleteMany(option) {
        return this.model.deleteMany(option);
    }

    findAll(condition, sort = { 'created_at': -1 }, populate) {
        return this.model.find({
            ...condition,
            delete_flag: false
        }).sort(sort).populate(populate);
    }

    findOne(option = {}, populate) {
        return this.model.findOne({
            ...option,
            delete_flag: false
        }).populate(populate);
    }

    findLast(option = {}, sort = { 'created_at': -1 }) {
        return this.model.findOne({
            ...option,
            delete_flag: false
        }).sort(sort)
    }

    getCount(option) {
        return this.model.countDocuments(option);
    }

    async paginate({ limit, options, page, populate, sort }) {
        const count = await this.getCount({ ...options, delete_flag: false });
        const perPage = limit && parseInt(limit) > 0 ? parseInt(limit) : count;
        let currentPage = page && parseInt(page) > 0 ? parseInt(page) : 1;
        const totalPage = Math.ceil(count / perPage);
        currentPage = currentPage > totalPage && totalPage > 0 ? totalPage : currentPage;
        const skip = (currentPage - 1) * perPage;
        const data = await this.model
            .find({ ...options, delete_flag: false })
            .sort({ ...sort, ...(Object.keys(sort)?.at(0) !== 'created_at' ? { 'created_at': 1 } : {}) })
            .skip(skip)
            .limit(perPage)
            .populate(populate);
        
        return {
            elements: data,
            paginate: {
                totalPage,
                totalRecord: count,
                size: perPage,
                page: parseInt(currentPage)
            }
        }
    }

    getModel() {
        return this.model;
    }
}


export default BaseRepository;