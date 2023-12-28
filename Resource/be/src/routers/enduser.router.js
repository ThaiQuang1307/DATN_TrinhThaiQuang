import express from 'express';
import { pickerHandler } from '../helpers/routeHandler';
import constants from '../core/constants';
import { authorization } from '../middlewares/authorization';
import { getTokenRequest } from '../middlewares/getTokenRequest';
const EndUserRouter = express.Router();

// share
EndUserRouter.post('/login', pickerHandler('AuthController@share@asyncLogin', constants.TYPE_SYSTEM.END_USER));
EndUserRouter.post('/verify-uuid', pickerHandler('UserController@share@asyncVerifyUuid'));
EndUserRouter.post('/set-password', pickerHandler('UserController@share@asyncSetPassword'));
EndUserRouter.post('/forget-password', pickerHandler('UserController@share@asyncForgetPassword'));
EndUserRouter.post('/logout', authorization(), pickerHandler('AuthController@share@asyncLogout'));
EndUserRouter.post('/sign-up', pickerHandler('UserController@enduser@asyncCreateUser'));

// Confirm email
EndUserRouter.get('/confirm-email', pickerHandler("UserController@share@confirmEmail"));

// profile
EndUserRouter.get('/profile', authorization([constants.ROLE_STUDENT, constants.ROLE_TEACHER]), pickerHandler('UserController@share@asyncGetInfo', constants.TYPE_SYSTEM.END_USER));
EndUserRouter.put('/profile', authorization([constants.ROLE_STUDENT, constants.ROLE_TEACHER]), pickerHandler('UserController@enduser@asyncUpdateUser'));
EndUserRouter.post('/change-password', authorization([constants.ROLE_STUDENT, constants.ROLE_TEACHER]), pickerHandler('UserController@share@asyncChangePassword'));

// category
EndUserRouter.get('/category', getTokenRequest(), pickerHandler('CategoryController@enduser@asyncGetAllCategory'));
EndUserRouter.get('/category/:id', pickerHandler('CategoryController@enduser@asyncGetCategory'));

// user
EndUserRouter.get('/user', pickerHandler('UserController@enduser@asyncGetAllUser'));

// course
EndUserRouter.get('/course', pickerHandler('CourseController@enduser@asyncGetAllCourse'));
EndUserRouter.post('/course', authorization([constants.ROLE_TEACHER]), pickerHandler('CourseController@enduser@asyncCreateCourse'));
EndUserRouter.get('/course/my-course', authorization([ constants.ROLE_STUDENT ]), pickerHandler('CourseController@enduser@asyncGetAllJoinCourseForStudent'));
EndUserRouter.get('/course/teacher', authorization([ constants.ROLE_TEACHER ]), pickerHandler('CourseController@enduser@asyncGetAllCourseForTeacher'));
EndUserRouter.get('/course/classifying-student-knowledge', authorization([ constants.ROLE_TEACHER ]), pickerHandler('ClassificationController@enduser@asyncGetAllClassification'));
EndUserRouter.get('/course/count-classifying-student-knowledge', authorization([constants.ROLE_TEACHER]), pickerHandler('ClassificationController@enduser@asyncCountClassification'));
EndUserRouter.post('/course/vote/:id', authorization([ constants.ROLE_STUDENT ]), pickerHandler('CourseController@enduser@asyncVoteCourse'));
EndUserRouter.post('/course/join/:id', authorization([ constants.ROLE_STUDENT ]), pickerHandler('CourseController@enduser@asyncJoinCourse'));
// comment
EndUserRouter.post('/course/comment/:id', authorization([ constants.ROLE_STUDENT, constants.ROLE_TEACHER ]), pickerHandler('CommentController@enduser@asyncCreateComment'));
EndUserRouter.get('/course/comment/:id', pickerHandler('CommentController@enduser@asyncGetAllComment'));
// test question
EndUserRouter.post('/course/test-answer/:id', authorization([ constants.ROLE_STUDENT ]), pickerHandler('CourseController@enduser@asyncTestQuestionsResult'));

EndUserRouter.get('/course/:id/info', authorization([constants.ROLE_TEACHER]), pickerHandler('CourseController@enduser@asyncGetCourseInfo'));
EndUserRouter.get('/course/:id', getTokenRequest(), pickerHandler('CourseController@enduser@asyncGetCourse'));
EndUserRouter.put('/course/:id', authorization([constants.ROLE_TEACHER]), pickerHandler('CourseController@enduser@asyncUpdateCourse'));
EndUserRouter.put('/course/:id/status', authorization([constants.ROLE_TEACHER]), pickerHandler('CourseController@enduser@asyncUpdateStatusCourse'));
EndUserRouter.delete('/course/:id', authorization([constants.ROLE_TEACHER]), pickerHandler('CourseController@enduser@asyncDeleteCourse'));

// update time view
EndUserRouter.put('/course/update-time-view/:id', authorization([ constants.ROLE_STUDENT ]), pickerHandler('CourseController@enduser@asyncUpdateTimeViewCourse'));

export default EndUserRouter;
