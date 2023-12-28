import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import constants from '../core/constants';
const { Schema, model, createConnection } = mongoose;
const urlDB = process.env.DB_DEPLOY_URL || process.env.DB_LOCAL_URL;

const connection = createConnection(urlDB);
autoIncrement.initialize(connection);

const CategorySchema = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    // image: {
    //     type: String
    // },
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

CategorySchema.plugin(autoIncrement.plugin, { model: 'categories', field: 'id', startAt: 1 });
export default model('categories', CategorySchema);

