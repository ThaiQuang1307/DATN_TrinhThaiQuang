require('dotenv').config();
import mongoose from 'mongoose';
const urlDB = process.env.DB_DEPLOY_URL || process.env.DB_LOCAL_URL;

// connect database
export const connectDB = async () => {
    try {
        await mongoose.connect(urlDB, {
            // useCreateIndex: true,
            // useFindAndModify: false,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connect database success...');
    } catch (error) {
        console.log('Connect database failed...', error);
    }
}
