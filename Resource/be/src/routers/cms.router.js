/* eslint-disable max-len */
import express from 'express';
import constants from '../core/constants';
import { pickerHandler } from '../helpers/routeHandler';
import { authorization } from '../middlewares/authorization';
const CMSRouter = express.Router();

// share
CMSRouter.post('/login', pickerHandler('AuthController@share@asyncLogin', constants.TYPE_SYSTEM.CMS));
CMSRouter.post('/verify-uuid', pickerHandler('UserController@share@asyncVerifyUuid'));
CMSRouter.post('/set-password', pickerHandler('UserController@share@asyncSetPassword'));
CMSRouter.post('/forget-password', pickerHandler('UserController@share@asyncForgetPassword'));
CMSRouter.post('/logout', authorization(), pickerHandler('AuthController@share@asyncLogout'));

// Confirm email
CMSRouter.get('/confirm-email', pickerHandler("UserController@share@confirmEmail"));

// data
CMSRouter.post('/create-fake-data', authorization(), pickerHandler('DataController@share@asyncCreateFakeData'));

// profile
CMSRouter.get('/profile', authorization([constants.ROLE_ADMIN]), pickerHandler('UserController@share@asyncGetInfo', constants.TYPE_SYSTEM.CMS));
CMSRouter.post('/change-password', authorization([constants.ROLE_ADMIN]), pickerHandler('UserController@share@asyncChangePassword'));

// user
CMSRouter.get('/user', authorization([constants.ROLE_ADMIN]), pickerHandler('UserController@cms@asyncGetAllUser'));
CMSRouter.post('/user', authorization([constants.ROLE_ADMIN], [ 'admin', 'teacher', 'student' ]), pickerHandler('UserController@cms@asyncCreateUser'));
CMSRouter.get('/user/:id', authorization([constants.ROLE_ADMIN], [ 'admin', 'teacher', 'student' ]), pickerHandler('UserController@cms@asyncGetUser'));
CMSRouter.put('/user/:id', authorization([constants.ROLE_ADMIN], [ 'admin', 'teacher', 'student' ]), pickerHandler('UserController@cms@asyncUpdateUser'));
CMSRouter.delete('/user/:id', authorization([constants.ROLE_ADMIN], [ 'admin', 'teacher', 'student' ]), pickerHandler('UserController@cms@asyncDeleteUser'));

// category
CMSRouter.get('/category', authorization([constants.ROLE_ADMIN]), pickerHandler('CategoryController@cms@asyncGetAllCategory'));
CMSRouter.post('/category', authorization([constants.ROLE_ADMIN], 'category'), pickerHandler('CategoryController@cms@asyncCreateCategory'));
CMSRouter.get('/category/:id', authorization([constants.ROLE_ADMIN], 'category'), pickerHandler('CategoryController@cms@asyncGetCategory'));
CMSRouter.put('/category/:id', authorization([constants.ROLE_ADMIN], 'category'), pickerHandler('CategoryController@cms@asyncUpdateCategory'));
CMSRouter.delete('/category/:id', authorization([constants.ROLE_ADMIN], 'category'), pickerHandler('CategoryController@cms@asyncDeleteCategory'));

// course
CMSRouter.get('/course', authorization([constants.ROLE_ADMIN]), pickerHandler('CourseController@cms@asyncGetAllCourse'));
CMSRouter.post('/course', authorization([constants.ROLE_ADMIN], 'course'), pickerHandler('CourseController@cms@asyncCreateCourse'));
CMSRouter.get('/course/:id', authorization([constants.ROLE_ADMIN], 'course'), pickerHandler('CourseController@cms@asyncGetCourse'));
CMSRouter.put('/course/:id', authorization([constants.ROLE_ADMIN], 'course'), pickerHandler('CourseController@cms@asyncUpdateCourse'));
CMSRouter.put('/course/:id/status', authorization([constants.ROLE_ADMIN], 'course'), pickerHandler('CourseController@cms@asyncUpdateStatusCourse'));
CMSRouter.delete('/course/:id', authorization([constants.ROLE_ADMIN], 'course'), pickerHandler('CourseController@cms@asyncDeleteCourse'));

// classifying student knowledge
CMSRouter.post('/classifying-student-knowledge', authorization([constants.ROLE_ADMIN]), pickerHandler('CourseController@cms@asyncClassifyingStudentKnowledge'));
CMSRouter.get('/classifying-student-knowledge', authorization([constants.ROLE_ADMIN]), pickerHandler('ClassificationController@cms@asyncGetAllClassification'));
CMSRouter.get('/count-classifying-student-knowledge', authorization([constants.ROLE_ADMIN]), pickerHandler('ClassificationController@cms@asyncCountClassification'));
CMSRouter.get('/count-student-course', authorization([constants.ROLE_ADMIN]), pickerHandler('ClassificationController@cms@asyncCountStudentsAndCourses'));

// permission
CMSRouter.get('/permission', authorization([constants.ROLE_ADMIN]), pickerHandler('PermissionController@cms@asyncGetAllPermission'));
CMSRouter.post('/permission', authorization([constants.ROLE_ADMIN], 'permission'), pickerHandler('PermissionController@cms@asyncCreatePermission'));
CMSRouter.get('/permission/:id', authorization([constants.ROLE_ADMIN], 'permission'), pickerHandler('PermissionController@cms@asyncGetPermission'));
CMSRouter.put('/permission/:id', authorization([constants.ROLE_ADMIN], 'permission'), pickerHandler('PermissionController@cms@asyncUpdatePermission'));
CMSRouter.delete('/permission/:id', authorization([constants.ROLE_ADMIN], 'permission'), pickerHandler('PermissionController@cms@asyncDeletePermission'));


export default CMSRouter;
