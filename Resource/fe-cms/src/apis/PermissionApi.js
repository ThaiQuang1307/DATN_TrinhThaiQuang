import ApiService from './ApiService';

class PermissionApi extends ApiService {
    constructor() {
        super('permission');
    }

    createPermission(payload) {
        return this.post('', payload);
    }

    getAllPermissions(payload) {
        return this.get('', payload);
    }

    getPermission(id, payload) {
        return this.get(id, payload);
    }

    updatePermission({id, payload}) {
        return this.put(id, payload);
    }

    deletePermission({id, payload}) {
        return this.delete(id, payload);
    }
}

export default PermissionApi;
