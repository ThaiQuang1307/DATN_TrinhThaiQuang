import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
const { Schema, model, createConnection } = mongoose;
const urlDB = process.env.DB_DEPLOY_URL || process.env.DB_LOCAL_URL;

const connection = createConnection(urlDB);
autoIncrement.initialize(connection);

const PermissionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    permissions: {
        type: Object,
        default: {},
        required: true
    },
    delete_flag: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

PermissionSchema.plugin(autoIncrement.plugin, { model: 'permissions', field: 'id', startAt: 1 });
export default model('permissions', PermissionSchema);

