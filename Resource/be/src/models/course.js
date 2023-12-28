import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import constants from '../core/constants';
const { Schema, model, createConnection } = mongoose;
const urlDB = process.env.DB_DEPLOY_URL || process.env.DB_LOCAL_URL;

const connection = createConnection(urlDB);
autoIncrement.initialize(connection);

const CourseSchema = new Schema({
    name: {
        type: String
    },
    category_id: {
        type: mongoose.Types.ObjectId,
        ref: 'categories',
        default: null
    },
    image: {
        type: String
    },
    teacher_id: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        default: null
    },
    description: {
        type: String
    },
    video: {
        type: String
    },
    video_length: {
        type: Number,
        default: 0
    },
    test_questions: {
        type: Array,
        default: []
    },
    status: {
        type: Number,
        enum: constants.STATUS,
        default: constants.STATUS_OB.INACTIVE
    },
    delete_flag: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

CourseSchema.plugin(autoIncrement.plugin, { model: 'courses', field: 'id', startAt: 1 });
export default model('courses', CourseSchema);

