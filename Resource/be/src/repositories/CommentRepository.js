import { CommentModel } from '../models';
import BaseRepository from './BaseRepository';

class CommentRepository extends BaseRepository {
    
    constructor() {
        super();
        this.model = CommentModel;
    }
}

export default CommentRepository;