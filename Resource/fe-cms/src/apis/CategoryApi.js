import ApiService from './ApiService';

class CategoryApi extends ApiService {

    constructor() {
        super('category');
    }

    getAllCategory(payload) {
        return this.get('', payload);
    }

    createCategory(payload) {
        return this.post('', payload);
    }

    getCategory({ id, payload }) {
        return this.get(id, payload);
    }

    updateCategory({ id, payload }) {
        return this.put(id, payload);
    }

    deleteCategory({ id, payload }) {
        return this.delete(id, payload);
    }
}

export default CategoryApi;