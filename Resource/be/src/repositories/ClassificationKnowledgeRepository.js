import { ClassificationKnowledgeModel } from '../models';
import BaseRepository from './BaseRepository';

class ClassificationKnowledgeRepository extends BaseRepository {
    
    constructor() {
        super();
        this.model = ClassificationKnowledgeModel;
    }
}

export default ClassificationKnowledgeRepository;