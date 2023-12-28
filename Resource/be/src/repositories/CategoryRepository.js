import { CategoryModel } from '../models';
import BaseRepository from './BaseRepository';

class CategoryRepository extends BaseRepository {
    
    constructor() {
        super();
        this.model = CategoryModel;
    }
}

export default CategoryRepository;