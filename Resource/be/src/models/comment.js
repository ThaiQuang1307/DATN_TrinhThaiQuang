import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import constants from '../core/constants';
const { Schema, model, createConnection } = mongoose;
const urlDB = process.env.DB_DEPLOY_URL || process.env.DB_LOCAL_URL;

const connection = createConnection(urlDB);
autoIncrement.initialize(connection);

const CommentSchema = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    course_id: {
        type: mongoose.Types.ObjectId,
        ref: 'courses',
        required: true
    },
    content: {
        type: String,
        default: null
    },
    delete_flag: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

CommentSchema.plugin(autoIncrement.plugin, { model: 'comments', field: 'id', startAt: 1 });
export default model('comments', CommentSchema);

