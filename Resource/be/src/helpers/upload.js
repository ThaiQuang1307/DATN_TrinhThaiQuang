require('dotenv').config();
import Cloudinary from 'cloudinary';
const cloudinary = Cloudinary.v2;
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const categoryImageFolder = 'ecourses/category-images';

const storageCategoryImage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: categoryImageFolder,
        allowedFormats: ['jpg', 'png', 'jpeg']
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadCloudCategoryImage = multer({ storage: storageCategoryImage }).single('image');

const userImageFolder = 'ecourses/user-images';

const storageUserImage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: userImageFolder,
        allowedFormats: ['jpg', 'png', 'jpeg']
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadCloudUserImage = multer({ storage: storageUserImage }).single('image');

const courseImageFolder = 'ecourses/course-images';
const courseVideoFolder = 'ecourses/course-videos';

const storageCourse = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        if (file.fieldname === 'video') {
            return {
                folder: courseVideoFolder,
                format: 'mp4',
                allowedFormats: ['mp4'],
                resource_type: 'video'
            }
        }
        return {
            folder: courseImageFolder,
            allowedFormats: ['jpg', 'png', 'jpeg'],
            resource_type: 'image'
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const uploadCloudCourse = multer({ storage: storageCourse, limits: { fieldSize: '100mb' } }).fields([
    {
        name: 'image',
        maxCount: 1
    },
    {
        name: 'video',
        maxCount: 1
    }
])

export {
    cloudinary,
    categoryImageFolder,
    uploadCloudCategoryImage,
    userImageFolder,
    uploadCloudUserImage,
    courseImageFolder,
    courseVideoFolder,
    uploadCloudCourse
};