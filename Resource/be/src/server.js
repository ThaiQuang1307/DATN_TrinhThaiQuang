require('dotenv').config();
import express from 'express';
import cors from 'cors';
import { connectDB } from './helpers/database';
import { routers } from './routers';
import UserService from './services/UserService';
import BaseService from './services/BaseService';

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// connect DB
connectDB();

// route server
routers(app);

// start server
app.listen(PORT, () => console.log(`Server is listening at port ${PORT}...`));
