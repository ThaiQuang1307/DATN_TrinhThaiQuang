require('dotenv').config();
import constants from '../core/constants';
import { UserRepository, PermissionRepository, TokenRepository, CategoryRepository, CourseRepository, UserCourseRepository, CommentRepository, ClassificationKnowledgeRepository } from '../repositories';
import HelperUtil from '../utils/HelperUtil';
import ResponseUtil from '../utils/ResponseUtil';
import jwt from 'jsonwebtoken';
import Cloudinary from 'cloudinary';
import fs from 'fs';
import mongoose from 'mongoose';
const cloudinary = Cloudinary.v2;

class BaseService {

    constructor() {
        // constants
        this.constants = constants;
        // result
        this.result = ResponseUtil.response;
        // helper
        this.helper = HelperUtil;
        // repository
        this.userRepository = new UserRepository();
        this.permissionRepository = new PermissionRepository();
        this.tokenRepository = new TokenRepository();
        this.categoryRepository = new CategoryRepository();
        this.courseRepository = new CourseRepository();
        this.userCourseRepository = new UserCourseRepository();
        this.commentRepository = new CommentRepository();
        this.classificationKnowledgeRepository = new ClassificationKnowledgeRepository()

    }

    async encryptToken(payload, time = this.constants.EMAIL_EXPIRED_TIME) {
        let token = null;
        try {
            if (!payload) {
                return token;
            }

            const algorithm = process.env.JWT_ALGORITHM || 'HS256';

            if (time) {
                token = jwt.sign(
                    {
                        payload
                    },
                    process.env.JWT_SECRET || 'token#secretKey',
                    {
                        expiresIn: time,
                        algorithm: algorithm
                    }
                )
            } else {
                token = jwt.sign(
                    {
                        payload
                    },
                    process.env.JWT_SECRET || 'token#secretKey'
                )
            }

        } catch (error) {
            console.log(`Encrypt Token: ${payload} and TIME: ${time}`, error);
        }
        return token;
    }

    async verifyToken(token, userId, data) {
        try {
            if (!token) {
                return false;
            }
            // Verify the token
            const secret = process.env.JWT_SECRET;
            const decode =  jwt.verify(token, secret, {
                algorithms: process.env.JWT_ALGORITHM
            });
            return decode;
        } catch (error) {
            if(userId && data) {
                await this.userRepository.update({
                    option: {
                        id: userId
                    },
                    data
                })
            }
            return false;
        }
    }

    generateSignedUrl(assetFolder) {
        const timestamp = Date.now();
        const signature = cloudinary.utils.api_sign_request({
            timestamp
        }, process.env.CLOUDINARY_SECRET)

        return `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/${assetFolder}/upload?api_key=${process.env.CLOUDINARY_KEY}&timestamp=${timestamp}&signature=${signature}`
    }

    async deleteAllCollection() {
        mongoose.connection.db.dropDatabase();
        console.log('delete all');
    }

    async initData() {
        
        const collections = [
            {
                name: 'categories',
                repository: this.categoryRepository,
                import: true
            },
            {
                name: 'courses',
                repository: this.courseRepository,
                import: true
            },
            {
                name: 'permissions',
                repository: this.permissionRepository,
                import: true
            },
            {
                name: 'users',
                repository: this.userRepository,
                import: true
            }
        ]

        // check not user => init data
        const user = await this.userCourseRepository.findOne();
        if(!user) {
            for(let index = 0; index < collections.length; ++index) {

                const collection = collections[index];

                if(['categories', 'courses', 'permissions'].includes(collection.name)) {
                    // delete data
                    await collection.repository.deleteMany();

                    // import data
                    if(collection.import) {
                        const dataFile = JSON.parse(fs.readFileSync(`files/${collection.name}.json`, 'utf-8'));
                        for(let index = 0; index < dataFile.length; ++index) {
                            await collection.repository.create(dataFile[index]);
                        }
                    }
                }

                if(collection.name === 'users') {
                    // delete data
                    await collection.repository.deleteMany();

                    // find permissions
                    const permissions = await this.permissionRepository.findAll({}, { created_at: 1 });

                    // import data
                    if(collection.import) {
                        const dataFile = JSON.parse(fs.readFileSync(`files/${collection.name}.json`, 'utf-8'));
                        if(dataFile.length > 0) {
                            if(dataFile[0]) {
                                dataFile[0].permission_id = permissions?.[0]?._id;
                            }
                            if(dataFile[1]) {
                                dataFile[1].permission_id = permissions?.[1]?._id;
                            }
                        }
                        for(let index = 0; index < dataFile.length; ++index) {
                            await collection.repository.create(dataFile[index]);
                        }
                    }
                }
            }

            console.log('import data success');
        }
    }
}

export default BaseService;