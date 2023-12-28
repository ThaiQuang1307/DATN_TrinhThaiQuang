import ApiService from './ApiService';

class CategoryApi extends ApiService {

    constructor() {
        super('category');
    }

    getAllCategory(payload) {
        return this.get('', payload);
    }

    getCategory({ id, payload }) {
        return this.get(id, payload);
    }
}

export default CategoryApi;