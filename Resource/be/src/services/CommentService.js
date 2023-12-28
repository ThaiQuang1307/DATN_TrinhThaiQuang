import BaseService from './BaseService';

class CommentService extends BaseService {

    async asyncCreateComment(user, courseId, payload) {

        // check course existed
        const existedCourse = await this.courseRepository.findOne({ id: courseId, status: this.constants.STATUS_OB.ACTIVE });

        // if(!existedCourse) return this.result(false, 404, 'Course does not exist.', null);
        if (!existedCourse) return this.result(false, 404, 'Khóa học không tồn tại.', null);

        // check user register before
        const existedUserCourse = await this.userCourseRepository.findOne({ user_id: user._id, course_id: existedCourse._id });

        if (!existedUserCourse && user.role_id !== this.constants.ROLE_TEACHER) {
            // return this.result(false, 400, "You haven't taken this course yet.", null);
            return this.result(false, 400, "Bạn chưa tham gia khóa học này.", null);
        }

        await this.commentRepository.create({
            user_id: user._id,
            course_id: existedCourse._id,
            content: payload?.content ?? ''
        })

        return this.result(true, 200, 'success', null);
    }

    async asyncGetAllComment(courseId, req) {
        // eslint-disable-next-line max-len
        const { size = -1, page = 1, sortKey = 'created_at', sortDir = 'desc' } = req.query;

        // check course existed
        const existedCourse = await this.courseRepository.findOne({ id: courseId, status: this.constants.STATUS_OB.ACTIVE });

        // if (!existedCourse) return this.result(false, 404, 'Course does not exist.', null);
        if (!existedCourse) return this.result(false, 404, 'Khóa học không tồn tại.', null);

        let result;
        const queryData = await this.commentRepository.paginate({
            limit: size,
            page,
            options: {
                course_id: existedCourse._id
            },
            sort: {
                ...(sortKey && sortDir ? { [sortKey]: sortDir.toLowerCase() } : {})
            },
            populate: [
                {
                    path: 'user_id',
                    select: '-_id id name image'
                }
            ]
        })

        result = queryData;
        if (queryData?.elements?.length > 0) {
            result.elements = result.elements.map(e => this.responseComment(e))
        }

        return this.result(true, 200, null, result);
    }

    responseComment(comment) {
        const { id, user_id: user, course_id: courseId, content, created_at: createdAt } = comment;

        return {
            id,
            user,
            courseId,
            content,
            createdAt
        }
    }
}

export default CommentService;