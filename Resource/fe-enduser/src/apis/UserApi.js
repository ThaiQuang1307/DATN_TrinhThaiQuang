import ApiService from './ApiService';

class UserApi extends ApiService {
    constructor() {
        super('user');
    }

    getAllUser(payload) {
        return this.get('', payload);
    }
}

export default UserApi;
