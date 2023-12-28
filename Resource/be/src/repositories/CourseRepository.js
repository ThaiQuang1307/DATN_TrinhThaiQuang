import { CourseModel } from '../models';
import BaseRepository from './BaseRepository';

class CourseRepository extends BaseRepository {
    
    constructor() {
        super();
        this.model = CourseModel;
    }
}

export default CourseRepository;