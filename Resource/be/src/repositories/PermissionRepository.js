import { PermissionModel } from '../models';
import BaseRepository from './BaseRepository';

class PermissionRepository extends BaseRepository {
    
    constructor() {
        super();
        this.model = PermissionModel;
    }
}

export default PermissionRepository;