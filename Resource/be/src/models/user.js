import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import constants from '../core/constants';
const { Schema, model, createConnection } = mongoose;
const urlDB = process.env.DB_DEPLOY_URL || process.env.DB_LOCAL_URL;

const connection = createConnection(urlDB);
autoIncrement.initialize(connection);

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: Number,   // 0: male, 1: female,
        default: null
    },
    birthday: {
        type: String,
        default: null
    },
    country: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true
    },
    // verify
    uuid: {
        type: String,
        default: null
    },
    // verify change email
    uuid_email: {
        type: String,
        default: null
    },
    private_code: {
        type: String,
        default: null
    },
    phone_number: {
        type: String,
        default: null
    },
    password: {
        type: String,
        default: null
    },
    // #region teacher
    introduction: {
        type: String,
        default: null
    },
    image: {
        type: String,
        default: null
    },
    subject: {
        type: String,
        default: null
    },
    link: {
        type: Object,
        default: null
    },
    // #endregion reacher
    role_id: {
        type: Number,
        default: constants.ROLE_STUDENT
    },
    permission_id: {
        type: mongoose.Types.ObjectId,
        ref: 'permissions',
        default: null
    },
    status: {
        type: Number,
        enum: constants.STATUS,
        default: constants.STATUS_OB.NOT_CONFIRM
    },
    delete_flag: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

UserSchema.plugin(autoIncrement.plugin, { model: 'users', field: 'id', startAt: 1 });
export default model('users', UserSchema);

