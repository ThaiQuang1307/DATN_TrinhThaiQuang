import moment from 'moment';
import BaseService from './BaseService';

class ClassificationService extends BaseService {

    async asyncGetAllClassification(req, teacherId) {
        // eslint-disable-next-line max-len
        const { size = -1, page = 1, sortKey = 'id', sortDir = 'asc', courseId = null, course_id = null, category_id = null } = req.query;

        let courseIds = [];
        let userCourseIds = [];

        const listCourseOfCategory = await this.courseRepository.findAll({
            ...(category_id ? { category_id } : {}),
            ...(teacherId ? { teacher_id: teacherId } : {})
        })

        if (listCourseOfCategory?.length > 0) {
            courseIds = listCourseOfCategory.map(e => e._id);
        }

        if (courseId) {
            const existedCourse = await this.courseRepository.findOne({
                id: courseId,
                ...(teacherId ? { teacher_id: teacherId } : {})
            })

            // if(!existedCourse) return this.result(false, 404, 'Course does not exist.', null);
            if (!existedCourse) return this.result(false, 404, 'Khóa học không tồn tại.', null);

            courseIds = [existedCourse._id];
        }

        if (course_id) {
            courseIds = [course_id];
        }

        if (courseIds.length > 0) {
            const listUserCourses = await this.userCourseRepository.findAll({
                course_id: { $in: courseIds }
            })

            if (listUserCourses?.length > 0) {
                userCourseIds = listUserCourses.map(e => e._id);
            }
        }

        const lastTimeClassify = await this.classificationKnowledgeRepository.findLast();

        let result;
        const queryData = await this.classificationKnowledgeRepository.paginate({
            options: {
                ...(lastTimeClassify ? { time: lastTimeClassify.time } : {}),
                user_course_id: { $in: userCourseIds }
            },
            limit: size,
            page,
            sort: {
                ...(sortKey && sortDir ? { [sortKey]: sortDir.toLowerCase() } : {})
            },
            populate: [
                {
                    path: 'user_course_id',
                    populate: [
                        {
                            path: 'user_id',
                            select: '-_id id name'
                        },
                        {
                            path: 'course_id',
                            select: '-_id id name'
                        }
                    ]
                },
            ],
        })

        result = queryData;

        if (queryData?.elements?.length > 0) {
            result.elements = await Promise.all(result.elements.map(async e => {

                const resultClassifyAll = await this.asyncGetAllClassificationByUserCourse(e.user_course_id._id);
                const resultLast = resultClassifyAll?.length > 0 ? resultClassifyAll[resultClassifyAll.length - 1] : {};

                return {
                    resultClassifyAll,
                    ...this.responseClassification(e),
                    ...resultLast
                }
            }))
        }

        return this.result(true, 200, null, {
            ...result,
            totalTime: lastTimeClassify ? lastTimeClassify.time : 0
        });
    }

    async asyncGetAllClassificationByUserCourse(userCourseId) {

        let result = [];

        const query = await this.classificationKnowledgeRepository.findAll(
            {
                user_course_id: userCourseId
            }, {
            time: 1
        }
        )

        if (query?.length > 0) {
            result = query.map((e, index) => {
                const before = query[index - 1];

                return {
                    time: e.time,
                    dateTime: e.created_at,
                    stg: {
                        value: e.stg,
                        compare: before ? this.helper.compareValue(before.stg, e.stg) : this.constants.COMPARE.EQUAL
                    },
                    scg: {
                        value: e.scg,
                        compare: before ? this.helper.compareValue(before.scg, e.scg) : this.constants.COMPARE.EQUAL
                    },
                    str: {
                        value: e.str,
                        compare: before ? this.helper.compareValue(before.str, e.str) : this.constants.COMPARE.EQUAL
                    },
                    lpr: {
                        value: e.lpr,
                        compare: before ? this.helper.compareValue(before.lpr, e.lpr) : this.constants.COMPARE.EQUAL
                    },
                    peg: {
                        value: e.peg,
                        compare: before ? this.helper.compareValue(before.peg, e.peg) : this.constants.COMPARE.EQUAL
                    },
                    class: {
                        value: e.class,
                        compare: before ? this.helper.compareValue(this.constants.CLASSES[before.class], this.constants.CLASSES[e.class]) : this.constants.COMPARE.EQUAL
                    }
                }
            })
        }

        return result;
    }

    async asyncCountClassification(req, teacherId) {
        // eslint-disable-next-line max-len
        const { course_id = null, category_id = null } = req.query;

        const result = {
            veryLow: 0,
            low: 0,
            middle: 0,
            high: 0,
            userNotView: 0,
            userViewedAndNotTest: 0,
            userViewedAndTested: 0
        }

        let courseIds = [];
        let userCourseIds = [];

        const listCourseOfCategory = await this.courseRepository.findAll({
            ...(category_id ? { category_id } : {}),
            ...(teacherId ? { teacher_id: teacherId } : {})
        })

        if (listCourseOfCategory?.length > 0) {
            courseIds = listCourseOfCategory.map(e => e._id);
        }

        if (course_id) {
            courseIds = [course_id];
        }

        if (courseIds.length > 0) {
            const listUserCourses = await this.userCourseRepository.findAll({
                course_id: { $in: courseIds }
            })

            if (listUserCourses?.length > 0) {
                userCourseIds = listUserCourses.map(e => e._id);
            }
        }

        const lastTimeClassify = await this.classificationKnowledgeRepository.findLast();

        result.veryLow = await this.classificationKnowledgeRepository.getCount({
            ...(lastTimeClassify ? { time: lastTimeClassify.time } : {}),
            user_course_id: { $in: userCourseIds },
            class: 'Very Low'
        })

        result.low = await this.classificationKnowledgeRepository.getCount({
            ...(lastTimeClassify ? { time: lastTimeClassify.time } : {}),
            user_course_id: { $in: userCourseIds },
            class: 'Low'
        })

        result.middle = await this.classificationKnowledgeRepository.getCount({
            ...(lastTimeClassify ? { time: lastTimeClassify.time } : {}),
            user_course_id: { $in: userCourseIds },
            class: 'Middle'
        })

        result.high = await this.classificationKnowledgeRepository.getCount({
            ...(lastTimeClassify ? { time: lastTimeClassify.time } : {}),
            user_course_id: { $in: userCourseIds },
            class: 'High'
        })

        result.userNotView = await this.userCourseRepository.getCount({
            course_id: { $in: courseIds },
            last_time_viewed: 0,
            test_date: null
        })

        result.userViewedAndNotTest = await this.userCourseRepository.getCount({
            course_id: { $in: courseIds },
            last_time_viewed: { $gt: 0 },
            test_date: null
        })

        result.userViewedAndTested = await this.userCourseRepository.getCount({
            course_id: { $in: courseIds },
            last_time_viewed: { $gt: 0 },
            test_date: { $ne: null }
        })

        return this.result(true, 200, null, result);
    }

    async asyncCountStudentsAndCourses(req) {

        const TYPE = {
            all: 'Total',
            detail: 'Detail'
        }

        const { type = TYPE.all, year = moment().year() } = req.query;

        const result = {
            totalStudent: 0,
            totalJoinCourse: 0,
            years: [],
            numStudentByYears: [],
            numJoinCourseByYears: [],
            numStudentByMonthsOfYear: [],
            numJoinCourseByMonthsOfYear: []
        }

        result.totalStudent = await this.userRepository.getCount({
            role_id: this.constants.ROLE_STUDENT
        })

        result.totalJoinCourse = await this.userCourseRepository.getCount()

        const currentYear = moment().year();
        const years = Array.from({ length: 5 }, (_, i) => currentYear - i).reverse();

        result.years = years;

        if (type === TYPE.all) {
            result.numStudentByYears = await Promise.all(years.map(async year => {
                return await this.userRepository.getCount({
                    role_id: this.constants.ROLE_STUDENT,
                    created_at: { $gte: `${year}-01-01T00:00:00Z`, $lte: `${year}-12-30T23:59:59Z` }
                })
            }))

            result.numJoinCourseByYears = await Promise.all(years.map(async year => {
                return await this.userCourseRepository.getCount({
                    created_at: { $gte: `${year}-01-01T00:00:00Z`, $lte: `${year}-12-30T23:59:59Z` }
                })
            }))
        } else {
            const months = Array.from({ length: 12 }, (_, i) => {
                const month = i + 1;
                const monthStr = month < 10 ? `0${month}` : month;
                return {
                    month: monthStr,
                    days: moment(`${year}-${month}`).daysInMonth()
                }
            });

            result.numStudentByMonthsOfYear = await Promise.all(months.map(async monthDays => {
                return await this.userRepository.getCount({
                    role_id: this.constants.ROLE_STUDENT,
                    created_at: { $gte: `${year}-${monthDays.month}-01T00:00:00Z`, $lte: `${year}-${monthDays.month}-${monthDays.days}T23:59:59Z` }
                })
            }))

            result.numJoinCourseByMonthsOfYear = await Promise.all(months.map(async monthDays => {
                return await this.userCourseRepository.getCount({
                    created_at: { $gte: `${year}-${monthDays.month}-01T00:00:00Z`, $lte: `${year}-${monthDays.month}-${monthDays.days}T23:59:59Z` }
                })
            }))
        }

        return this.result(true, 200, null, result);
    }

    responseClassification(classification) {
        const { id, user_course_id: { user_id: user, course_id: course }, stg, scg, str, lpr, peg, created_at: createdAt } = classification;

        return {
            id, user, course, stg, scg, str, lpr, peg, createdAt, class: classification.class
        }
    }
}

export default ClassificationService;