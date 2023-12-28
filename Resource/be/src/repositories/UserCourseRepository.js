import { UserCourseModel } from '../models';
import BaseRepository from './BaseRepository';

class UserCourseRepository extends BaseRepository {
    
    constructor() {
        super();
        this.model = UserCourseModel;
    }
}

export default UserCourseRepository;