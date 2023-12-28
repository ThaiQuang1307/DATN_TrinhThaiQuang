import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import constants from '../core/constants';
const { Schema, model, createConnection } = mongoose;
const urlDB = process.env.DB_DEPLOY_URL || process.env.DB_LOCAL_URL;

const connection = createConnection(urlDB);
autoIncrement.initialize(connection);

const UserCourseSchema = new Schema({
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
    start_date: {
        type: String,
        default: null
    },
    end_date: {
        type: String,
        default: null
    },
    test_date: {
        type: Date,
        default: null
    },
    score: {
        type: Number,
        default: 0
    },
    last_time_viewed: {
        type: Number,
        default: 0
    },
    vote: {
        type: Number,
        default: null
    },
    delete_flag: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

UserCourseSchema.plugin(autoIncrement.plugin, { model: 'users_courses', field: 'id', startAt: 1 });
export default model('users_courses', UserCourseSchema);

