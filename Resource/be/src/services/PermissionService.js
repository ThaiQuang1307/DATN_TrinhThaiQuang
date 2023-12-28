import snakecaseKeys from 'snakecase-keys';
import BaseService from './BaseService';

class PermissionService extends BaseService {

    async asyncCreatePermission(payload) {
        // kiểm tra tên
        const existedName = await this.permissionRepository.findOne({ name: payload.name });
        // if(existedName) return this.result(false, 400, 'The authorization name already exists.', null);
        if (existedName) return this.result(false, 400, 'Tên ủy quyền đã tồn tại.', null);

        // create
        await this.permissionRepository.create(snakecaseKeys(payload, { deep: true }));

        return this.result(true, 200, null, null);
    }

    async asyncGetAllPermission(isSearch = null) {
        let result = await this.permissionRepository.findAll({}, {});

        if (result?.length > 0) {
            result = result.map(e => this.responsePermission(e, isSearch));
        }

        return this.result(true, 200, null, result ?? []);
    }

    async asyncGetPermission(id) {
        const result = await this.permissionRepository.findOne({ id });

        // if(!result) return this.result(false, 404, 'Authorization does not exist.', null);
        if (!result) return this.result(false, 404, 'Ủy quyền không tồn tại.', null);

        return this.result(true, 200, null, this.responsePermission(result));
    }

    async asyncUpdatePermission(id, payload) {
        const existedPermission = await this.permissionRepository.findOne({ id });
        // if(!existedPermission) return this.result(false, 404, 'Authorization does not exist.', null);
        if (!existedPermission) return this.result(false, 404, 'Ủy quyền không tồn tại.', null);

        await this.permissionRepository.update({
            option: { id },
            data: payload
        })

        return this.result(true, 200, null, null);
    }

    responsePermission(permission, isSearch = null) {
        if (isSearch) {
            return {
                _id: permission._id,
                id: permission.id,
                name: permission.name,
                description: permission.description
            }
        }
        return {
            id: permission.id,
            name: permission.name,
            description: permission.description,
            permissions: permission.permissions
        }
    }
}

export default PermissionService;