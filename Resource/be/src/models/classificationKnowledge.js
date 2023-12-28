import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import constants from '../core/constants';
const { Schema, model, createConnection } = mongoose;
const urlDB = process.env.DB_DEPLOY_URL || process.env.DB_LOCAL_URL;

const connection = createConnection(urlDB);
autoIncrement.initialize(connection);

const ClassificationKnowledgeSchema = new Schema({
    user_course_id: {
        type: mongoose.Types.ObjectId,
        ref: 'users_courses',
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    stg: {
        type: Number,
        default: null
    },
    scg: {
        type: Number,
        default: null
    },
    str: {
        type: Number,
        default: null
    },
    lpr: {
        type: Number,
        default: 0
    },
    peg: {
        type: Number,
        default: 0
    },
    class: {
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

ClassificationKnowledgeSchema.plugin(autoIncrement.plugin, { model: 'classification_knowledges', field: 'id', startAt: 1 });
export default model('classification_knowledges', ClassificationKnowledgeSchema);

