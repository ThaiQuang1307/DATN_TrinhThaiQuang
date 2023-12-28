require('dotenv').config();
import camelcaseKeys from 'camelcase-keys';
import { cloudinary } from '../helpers/upload';
import { courseImageFolder, courseVideoFolder } from '../helpers/upload';
import BaseService from './BaseService';
import moment from 'moment/moment';
import { json2csv } from 'json-2-csv';
import fs from 'fs';
import { join } from 'path';
import axios from 'axios';
import { Readable } from 'stream';
import csv from 'csvtojson';

class CourseService extends BaseService {

    constructor() {
        super();
        this.pathDir = join(process.cwd(), '/files');
    }

    async asyncCreateCourse(payload) {
        const { name, categoryId, teacherId, videoLength, description, image, video, testQuestions } = payload;

        // check category
        const category = await this.categoryRepository.findOne({
            id: categoryId
        })
        // if(!category) return this.result(false, 400, 'Theme does not exist.', null);
        if (!category) return this.result(false, 400, 'Chủ đề không tồn tại.', null);

        // check teacher
        const teacher = await this.userRepository.findOne({
            id: teacherId
        })
        // if(!teacher) return this.result(false, 400, 'Teacher does not exist.', null);
        if (!teacher) return this.result(false, 400, 'Giáo viên không tồn tại.', null);

        await this.courseRepository.create({
            name,
            category_id: category._id,
            image,
            teacher_id: teacher._id,
            video,
            video_length: videoLength,
            description,
            test_questions: testQuestions
        })

        return this.result(true, 200, 'success', null);
    }

    async asyncGetAllCourse(req) {
        // eslint-disable-next-line max-len
        const { size = -1, page = 1,
            name = '',
            status = null,
            categoryId = null, categoryIdInt = null,
            sortKey, sortDir,
            short = false,
            teacherId = null,
            teacherIdInt = null
        } = req.query;

        let existCategory;
        if (categoryIdInt) {
            existCategory = await this.categoryRepository.findOne({ id: categoryIdInt });
            // if(!existCategory) return this.result(false, 404, 'Category does not existed.');
            if (!existCategory) return this.result(false, 404, 'Danh mục không tồn tại.');
        }

        let existTeacher;
        if (teacherIdInt) {
            existTeacher = await this.userRepository.findOne({ id: teacherIdInt, role_id: this.constants.ROLE_TEACHER });
            // if(!existTeacher) return this.result(false, 404, 'Teacher does not existed.');
            if (!existTeacher) return this.result(false, 404, 'Giáo viên không tồn tại.');
        }

        let result;
        const queryData = await this.courseRepository.paginate({
            limit: size,
            page,
            options: {
                name: { $regex: name, $options: 'i' },
                ...(status ? { status } : {}),
                ...(categoryId ? { category_id: categoryId } : {}),
                ...(categoryIdInt ? { category_id: existCategory._id } : {}),
                ...(teacherId ? { teacher_id: teacherId } : {}),
                ...(teacherIdInt ? { teacher_id: existTeacher._id } : {}),
            },
            sort: {
                ...(sortKey && sortDir ? { [sortKey]: sortDir.toLowerCase() } : {})
            },
            populate: [
                {
                    path: 'category_id',
                    select: '-_id id name',
                },
                {
                    path: 'teacher_id',
                    select: '-_id id name'
                }
            ]
        })

        result = queryData;
        if (queryData?.elements?.length > 0) {
            result.elements = await Promise.all(result.elements.map(async course => {
                const numberStudents = await this.userCourseRepository.getCount({
                    course_id: course._id
                });
                return this.responseCourse({
                    ...course._doc,
                    numberStudents
                }, short);
            }))
        }

        return this.result(true, 200, null, result);
    }

    async asyncGetAllCourseForEndUser(payload) {
        let { size, page, sortby = this.constants.SORT_COURSE_OPTIONS.PARTICIPATION, status = null, name = '', categoryId = null } = payload;

        let existCategory, conditionCategory = {
            $match: {}
        };
        if (categoryId) {
            existCategory = await this.categoryRepository.findOne({ id: categoryId });
            // if (!existCategory) return this.result(false, 404, 'Category does not existed.');
            if (!existCategory) return this.result(false, 404, 'Danh mục không tồn tại.');

            conditionCategory = {
                $match: {
                    'category_id.id': { $eq: Number(categoryId) }
                }
            }
        }

        let conditionSort;

        switch (sortby) {
            case this.constants.SORT_COURSE_OPTIONS.PARTICIPATION:
                conditionSort = { $sort: { numberStudents: -1 } }
                break;
            case this.constants.SORT_COURSE_OPTIONS.RATING:
                conditionSort = { $sort: { rate: -1 } }
                break;
            case this.constants.SORT_COURSE_OPTIONS.ASCENDING_NAME:
                conditionSort = { $sort: { name: 1 } }
                break;
            case this.constants.SORT_COURSE_OPTIONS.DESCENDING_NAME:
                conditionSort = { $sort: { name: -1 } }
                break;
            default:
                conditionSort = { $sort: { numberStudents: -1 } }
                break;
        }

        const optionsAll = [
            {
                $match: {
                    name: { $regex: name, $options: 'i' },
                    ...(status ? { status } : {})
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'teacher_id',
                    foreignField: '_id',
                    as: 'teacher_id'
                }
            },
            {
                "$unwind": "$teacher_id"
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category_id',
                    foreignField: '_id',
                    as: 'category_id'
                }
            },
            {
                "$unwind": "$category_id"
            },
            {
                $lookup: {
                    from: 'users_courses',
                    localField: '_id',
                    foreignField: 'course_id',
                    as: 'users_courses'
                }
            },
            {
                $addFields: {
                    numberStudents: {
                        $size: '$users_courses'
                    },
                    users_courses_votes: {
                        $filter: {
                            input: '$users_courses',
                            as: 'user_course',
                            cond: {
                                $and: [
                                    { $ne: ['$$user_course.vote', null] },
                                    { $ne: ['$$user_course.vote', 0] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    numberVotes: {
                        $size: '$users_courses_votes'
                    },
                    totalVotes: {
                        $reduce: {
                            input: '$users_courses_votes',
                            initialValue: 0,
                            in: {
                                $add: ['$$value', '$$this.vote']
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    rate: {
                        $cond: [
                            { $eq: ["$numberVotes", 0] },
                            0,
                            { $divide: ['$totalVotes', '$numberVotes'] }
                        ]
                    }
                }
            },
            conditionCategory,
            conditionSort
        ]

        let queryAll = await this.courseRepository.getModel().aggregate(optionsAll);

        if (queryAll?.length > 0) {
            queryAll = queryAll.map(e => this.responseCourse(e, false, false, true))
        }

        let queryData;

        if (size > 0) {
            queryData = queryAll?.slice((page - 1) * size, page * size);
        }

        const count = queryAll.length;
        const perPage = size ? size > 0 ? Number(size) : null : count;
        let currentPage = page ? page > 0 ? Number(page) : null : 1;
        const totalPage = perPage ? Math.ceil(count / perPage) : 1;
        currentPage = currentPage != null ? currentPage > totalPage && totalPage > 0 ? totalPage : currentPage : null;

        const result = {
            elements: size > 0 ? queryData : queryAll,
            paginate: {
                totalPage,
                totalRecord: count,
                size: perPage,
                page: currentPage,
            }
        };

        return this.result(true, 200, null, result);
    }

    async asyncGetCourse(id, teacherId) {
        let result = await this.courseRepository.findOne({
            id,
            ...(teacherId ? { teacherId } : {})
        }, [
            {
                path: 'category_id',
                select: '-_id id name'
            },
            {
                path: 'teacher_id',
                select: '-_id id name'
            }
        ]);
        // if (!result) return this.result(false, 404, 'Course does not exist.', null);
        if (!result) return this.result(false, 404, 'Khóa học không tồn tại.', null);

        result = this.responseCourse(result, false, true);

        return this.result(true, 200, null, result);
    }

    async asyncGetCourseForEndUser(id, user) {
        const existedCourse = await this.courseRepository.findOne({
            id,
            status: this.constants.STATUS_OB.ACTIVE
        }, [
            {
                path: 'category_id',
                select: '-_id -status -delete_flag -__v -updated_at'
            },
            {
                path: 'teacher_id',
                select: '-_id name link subject image introduction'
            }
        ]);
        // if (!existedCourse) return this.result(false, 404, 'Course does not exist.', null);
        if (!existedCourse) return this.result(false, 404, 'Khóa học không tồn tại.', null);

        let isJoinCourse = false, existedUserCourse = null, isTeacher = false;
        if (user) {
            existedUserCourse = await this.userCourseRepository.findOne({ user_id: user._id, course_id: existedCourse._id });
            if (existedUserCourse) {
                isJoinCourse = true;
            }
            if (user.role_id === this.constants.ROLE_TEACHER) {
                isTeacher = true;
            }
        }

        let rate = 0, numberVotes = 0;
        const numberUsersVoteCourse = await this.userCourseRepository.findAll({
            course_id: existedCourse._id,
            vote: { $nin: [null, 0] }
        });
        if (numberUsersVoteCourse?.length > 0) {
            numberVotes = numberUsersVoteCourse.length;
            rate = numberUsersVoteCourse.reduce((total, e) => total + e.vote, 0) / numberVotes;
        }

        const result = this.responseCourse({
            ...existedCourse._doc,
            rate,
            numberVotes,
            isJoinCourse,
            userCourse: existedUserCourse,
            isTeacher
        });

        return this.result(true, 200, null, result);
    }

    async asyncUpdateCourse(id, payload, teacher_id) {
        const { name, categoryId, teacherId, videoLength, description, image, video, status, testQuestions } = payload;
        const existedCourse = await this.courseRepository.findOne({
            id,
            ...(teacher_id ? { teacher_id } : {})
        }, [
            {
                path: 'category_id',
                select: '-_id id name'
            },
            {
                path: 'teacher_id',
                select: '-_id id name'
            }
        ]);
        // if (!existedCourse) return this.result(false, 404, 'Course does not exist.', null);
        if (!existedCourse) return this.result(false, 404, 'Khóa học không tồn tại.', null);

        // check change category
        let category;
        if (categoryId && existedCourse.category_id?.id !== categoryId) {
            category = await this.categoryRepository.findOne({
                id: categoryId
            })

            // if (!category) return this.result(false, 400, 'Theme does not exist.', null);
            if (!category) return this.result(false, 400, 'Chủ đề không tồn tại.', null);
        }

        // check change teacher
        let teacher;
        if (teacherId && existedCourse.teacher_id?.id !== teacherId) {
            teacher = await this.userRepository.findOne({
                id: teacherId
            })

            // if (!teacher) return this.result(false, 400, 'Teacher does not exist.', null);
            if (!teacher) return this.result(false, 400, 'Giáo viên không tồn tại.', null);
        }

        if (image && image !== existedCourse.image) {
            const fileName = this.helper.getFileNameFormUrl(existedCourse.image);
            await cloudinary.uploader.destroy(`${courseImageFolder}/${fileName}`, {
                resource_type: 'image'
            });
        }

        if (video && video !== existedCourse.video) {
            const fileName = this.helper.getFileNameFormUrl(existedCourse.video);
            await cloudinary.uploader.destroy(`${courseVideoFolder}/${fileName}`, {
                resource_type: 'video'
            });
        }

        await this.courseRepository.update({
            option: { id },
            data: {
                name: name ?? existedCourse.name,
                category_id: category ? category._id : existedCourse.category_id?._id,
                teacher_id: teacher ? teacher._id : existedCourse.teacher_id?._id,
                image: image ?? existedCourse.image,
                video: video ?? existedCourse.video,
                video_length: videoLength ?? existedCourse.video_length,
                description: description ?? existedCourse.description,
                test_questions: testQuestions ?? existedCourse.test_questions,
                status: status ?? existedCourse.status
            }
        })

        return this.result(true, 200, 'success.', null);
    }

    async asyncDeleteCourse(id) {
        const existedCourse = await this.courseRepository.findOne({ id });
        // if (!existedCourse) return this.result(false, 404, 'Course does not exist.', null);
        if (!existedCourse) return this.result(false, 404, 'Khóa học không tồn tại.', null);
        await this.courseRepository.update({
            option: { id },
            data: { delete_flag: true }
        })

        return this.result(true, 200, 'Xóa thành công.', null);
    }

    async asyncJoinCourse(user, courseId) {

        // check course existed
        const existedCourse = await this.courseRepository.findOne({ id: courseId, status: this.constants.STATUS_OB.ACTIVE });

        // if (!existedCourse) return this.result(false, 404, 'Course does not exist.', null);
        if (!existedCourse) return this.result(false, 404, 'Khóa học không tồn tại.', null);

        // check user register before
        const existedUserCourse = await this.userCourseRepository.findOne({ user_id: user._id, course_id: existedCourse._id });

        if (existedUserCourse) {
            // return this.result(false, 400, 'You have taken the course before.', null);
            return this.result(false, 400, 'Bạn đã tham gia khóa học trước đây.', null);
        }

        await this.userCourseRepository.create({
            user_id: user._id,
            course_id: existedCourse._id,
            start_date: moment().format('YYYY-MM-DD'),
            score: 0,
            last_time_viewed: 0
        })

        return this.result(true, 200, 'success', null);
    }

    async asyncUpdateTimeViewCourse(user, courseId, payload) {

        const userId = user._id;
        const { timeView = 0 } = payload;

        const userCourse = await this.userCourseRepository.findOne({
            user_id: userId,
            course_id: courseId
        }, [
            {
                path: 'course_id'
            }
        ]);

        // if (!userCourse) return this.result(false, 404, 'You have not taken the course yet.', null);
        if (!userCourse) return this.result(false, 404, 'Bạn chưa tham gia khóa học.', null);

        let lastTimeViewed = timeView?.toFixed(1);
        let end_date = null;
        const currentDate = moment().format('YYYY-MM-DD');

        if (Math.abs(userCourse.course_id?.video_length - timeView) < 1) {
            lastTimeViewed = userCourse.course_id?.video_length;
            end_date = currentDate;
        }

        await this.userCourseRepository.update({
            option: {
                id: userCourse.id
            },
            data: {
                last_time_viewed: lastTimeViewed,
                end_date
            }
        })

        return this.result(true, 200, 'success', { lastTimeViewed: Number(lastTimeViewed) });
    }

    async asyncVoteCourse(user, courseId, payload) {

        // check course existed
        const existedCourse = await this.courseRepository.findOne({ id: courseId, status: this.constants.STATUS_OB.ACTIVE });

        // if (!existedCourse) return this.result(false, 404, 'Course does not exist.', null);
        if (!existedCourse) return this.result(false, 404, 'Khóa học không tồn tại.', null);

        // check user register before
        const existedUserCourse = await this.userCourseRepository.findOne({ user_id: user._id, course_id: existedCourse._id });

        if (!existedUserCourse) {
            // return this.result(false, 400, "You haven't taken this course yet.", null);
            return this.result(false, 400, "Bạn chưa tham gia khóa học này.", null);
        }

        await this.userCourseRepository.update({
            option: {
                id: existedUserCourse.id
            },
            data: {
                vote: payload.vote ?? null
            }
        })

        return this.result(true, 200, 'success', null);
    }

    async asyncTestQuestionsResultByCourse(user, courseId, payload) {

        const testQuestionsResult = payload.testQuestions;
        // if (testQuestionsResult?.length < 0) return this.result(false, 400, 'No answers yet.', null);
        if (testQuestionsResult?.length < 0) return this.result(false, 400, 'Chưa có câu trả lời nào.', null);

        // check course existed
        const existedCourse = await this.courseRepository.findOne({ id: courseId, status: this.constants.STATUS_OB.ACTIVE });

        // if (!existedCourse) return this.result(false, 404, 'Course does not exist.', null);
        if (!existedCourse) return this.result(false, 404, 'Khóa học không tồn tại.', null);

        // check user register before
        const existedUserCourse = await this.userCourseRepository.findOne({ user_id: user._id, course_id: existedCourse._id });

        if (!existedUserCourse) {
            // return this.result(false, 400, "You haven't taken this course yet.", null);
            return this.result(false, 400, "Bạn chưa tham gia khóa học này.", null);
        }

        const testQuestionsCourse = existedCourse._doc.test_questions;

        const testQuestionsNoCorrect = testQuestionsCourse.map(e => ({ question: e.question, answers: e.answers }));
        const testQuestionsResultNoCorrect = testQuestionsResult.map(e => ({ question: e.question, answers: e.answers }));

        if (JSON.stringify(testQuestionsNoCorrect) !== JSON.stringify(testQuestionsResultNoCorrect)) {
            // return this.result(false, 400, 'The test has a change in the set of questions and answers. Please F5 site.', null);
            return this.result(false, 400, 'Đề thi có sự thay đổi về bộ câu hỏi và đáp án. Vui lòng F5 trang web.', null);
        }

        let numberCorrect = 0;
        const resultTest = testQuestionsResult.map((qa, index) => {
            let isCorrect = false;
            if (Number(qa.correct) === Number(testQuestionsCourse[index].correct)) {
                numberCorrect += 1;
                isCorrect = true;
            }
            return {
                ...qa,
                isCorrect
            }
        })

        await this.userCourseRepository.update({
            option: {
                id: existedUserCourse.id
            },
            data: {
                score: (numberCorrect / testQuestionsCourse.length).toFixed(2),
                test_date: moment()
            }
        })

        return this.result(true, 200, 'success', resultTest);
    }

    async asyncClassifyingStudentKnowledge(payload) {

        // find all user course for all user
        const userCoursesForAllUser = await this.userCourseRepository.findAll({}, { user_id: 1, created_at: 1 }, [
            {
                path: 'course_id'
            }
        ]);

        const studentLearningBehaviorData = [];

        if (userCoursesForAllUser.length > 0) {
            for (let index = 0; index < userCoursesForAllUser.length; ++index) {
                const userCourse = userCoursesForAllUser[index];

                const STG = (userCourse.last_time_viewed && userCourse.course_id.video_length) ? (userCourse.last_time_viewed / userCourse.course_id.video_length).toFixed(2) : 0;
                const SCG = (userCourse.last_time_viewed && userCourse.course_id.video_length) ? (Math.ceil(userCourse.last_time_viewed / 10) / Math.ceil(userCourse.course_id.video_length / 10)).toFixed(2) : 0;
                const PEG = userCourse.score || 0;

                let STR = 0, LPR = 0;
                // related course
                const relatedCourseList = await this.courseRepository.findAll({
                    category_id: userCourse.course_id.category_id,
                    id: { $ne: userCourse.course_id.id }
                })

                if (relatedCourseList.length > 0) {
                    for (let index1 = 0; index1 < relatedCourseList.length; ++index1) {
                        const relatedCourse = relatedCourseList[index1];
                        const relatedUserCourse = await this.userCourseRepository.findOne({
                            user_id: userCourse.user_id,
                            course_id: relatedCourse._id
                        }, [
                            {
                                path: 'course_id'
                            }
                        ])

                        if (relatedUserCourse) {
                            STR += Number((relatedUserCourse.last_time_viewed && relatedUserCourse.course_id.video_length) ? (relatedUserCourse.last_time_viewed / relatedUserCourse.course_id.video_length).toFixed(2) : 0);
                            LPR += Number(relatedUserCourse.score || 0);
                        }
                    }

                    STR = (STR / relatedCourseList.length).toFixed(2);
                    LPR = (LPR / relatedCourseList.length).toFixed(2);
                }

                studentLearningBehaviorData.push({
                    course_id: String(userCourse.course_id._id),
                    user_id: String(userCourse.user_id),
                    STG: Number(STG),
                    SCG: Number(SCG),
                    STR: Number(STR),
                    LPR: Number(LPR),
                    PEG: Number(PEG)
                })
            }

            const time = Date.now();
            const dataCSV = await json2csv(studentLearningBehaviorData);
            const fileName = `classification_input_${time}.csv`;
            const pathFile = `${this.pathDir}/${fileName}`;
            // save file csv to files folder
            fs.writeFileSync(pathFile, '\ufeff' + dataCSV, { encoding: 'utf8' });

            const fileDataStream = fs.createReadStream(pathFile);

            const res = await axios.put(`${process.env.APP_AI_URL}/subclass-ai/`, {
                file_data: fileDataStream
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                responseType: 'blob'
            })

            const streamDataRes = Readable.from(res.data);

            await streamDataRes.pipe(fs.createWriteStream(`${this.pathDir}/classification_output_${time}.csv`));

            const dataResults = await csv().fromStream(streamDataRes);

            const lastTimeClassify = await this.classificationKnowledgeRepository.findLast();

            const dataResultsFormat = dataResults.map((e, index) => ({
                user_course_id: userCoursesForAllUser[index]._id,
                time: lastTimeClassify?.time ? lastTimeClassify.time + 1 : 1,
                stg: Number(e.STG),
                scg: Number(e.SCG),
                str: Number(e.STR),
                lpr: Number(e.LPR),
                peg: Number(e.PEG),
                class: e.Class
            }));

            // await this.classificationKnowledgeRepository.deleteMany();
            await this.classificationKnowledgeRepository.create(dataResultsFormat);
            fs.unlinkSync(pathFile);
            fs.unlinkSync(`${this.pathDir}/classification_output_${time}.csv`);
        }

        return this.result(true, 200, null, null);
    }

    async asyncGetAllJoinCourseForStudent(payload) {
        const { size = -1, page = 1, sortKey = 'created_at', sortDir = 'asc', studentId } = payload;

        const queryData = await this.userCourseRepository.paginate({
            limit: size,
            page,
            options: {
                ...(studentId ? { user_id: studentId } : {})
            },
            sort: {
                ...(sortKey && sortDir ? { [sortKey]: sortDir.toLowerCase() } : {})
            },
            populate: [
                {
                    path: 'user_id',
                },
                {
                    path: 'course_id',
                    populate: [
                        {
                            path: 'category_id',
                            select: '-_id id name'
                        },
                        {
                            path: 'teacher_id',
                            select: '-_id id name'
                        }
                    ]
                }
            ]
        })

        const result = queryData;

        if (queryData.elements?.length > 0) {
            result.elements = result.elements.map(userCourse => {


                return this.responseJoinCourse({
                    ...userCourse._doc
                })
            })
        }

        return this.result(true, 200, null, result);
    }

    responseCourse(course, short = false, info = false, aggregate = false) {
        const {
            _id,
            id,
            name,
            category_id: category,
            image,
            teacher_id: teacher,
            video,
            video_length: videoLength,
            description,
            status,
            created_at: createdAt,
            rate,
            numberVotes,
            test_questions: testQuestions,
            numberStudents,
            isJoinCourse,
            userCourse,
            isTeacher
        } = course;
        if (short) return { id, name, _id };
        if (info) return { id, name, categoryId: category?.id, image, teacherId: teacher?.id, video, videoLength, description, testQuestions };
        return {
            id,
            name,
            category: camelcaseKeys(!aggregate ? category?._doc : category),
            teacher: camelcaseKeys(!aggregate ? teacher?._doc : teacher),
            description,
            status,
            createdAt,
            image,
            videoLength,
            rate: rate ? rate > 0 ? rate.toFixed(1) : 0 : 0,
            numberVotes,
            isJoinCourse,
            isTeacher,
            numberStudents,
            ...(isJoinCourse ? { ...camelcaseKeys(userCourse._doc), testQuestions: this.removeCorrectAnswer(testQuestions), video } : { vote: null }),
            ...(isTeacher ? { video, testQuestions } : {})
        };
    }

    responseJoinCourse(userCourse) {
        const {
            start_date: startDate,
            end_date: endDate,
            score,
            last_time_viewed: lastTimeViewed,
            test_date: testDate,
            course_id: {
                id,
                name,
                image,
                category_id: category,
                teacher_id: teacher,
                video_length: videoLength
            }
        } = userCourse;
        return { id, name, image, category: camelcaseKeys(category._doc), teacher: camelcaseKeys(teacher._doc), startDate, endDate, testDate, score, videoLength, lastTimeViewed }
    }

    removeCorrectAnswer(listQuestion) {
        if (listQuestion?.length < 1) return [];

        return listQuestion.map(e => ({ question: e.question, answers: e.answers }));
    }
}

export default CourseService;