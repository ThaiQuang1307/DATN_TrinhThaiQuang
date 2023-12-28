import ApiService from './ApiService';

class UserApi extends ApiService {
    constructor() {
        super('user');
    }

    getAllUser(payload) {
        return this.get('', payload);
    }

    getUser({ id, payload }) {
        return this.get(id, payload);
    }

    createUser(payload) {
        return this.post('', payload, { 'Content-Type': 'multipart/form-data' });
    }

    updateUser({ id, payload }) {
        return this.put(id, payload, { 'Content-Type': 'multipart/form-data' });
    }

    deleteUser({ id, payload }) {
        return this.delete(id, payload);
    }
}

export default UserApi;
