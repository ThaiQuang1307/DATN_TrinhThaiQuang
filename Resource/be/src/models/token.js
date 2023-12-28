import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
const { Schema, model, createConnection } = mongoose;
const urlDB = process.env.DB_DEPLOY_URL || process.env.DB_LOCAL_URL;

const connection = createConnection(urlDB);
autoIncrement.initialize(connection);

const TokenSchema = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    token: {
        type: String
    },
    delete_flag: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

TokenSchema.plugin(autoIncrement.plugin, { model: 'tokens', field: 'id', startAt: 1 });
export default model('tokens', TokenSchema);

