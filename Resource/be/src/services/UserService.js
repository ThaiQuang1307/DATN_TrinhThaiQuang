import snakecaseKeys from 'snakecase-keys';
import { sendMail } from '../helpers/mail';
import BaseService from './BaseService';
import { v4 as uuidv4 } from 'uuid';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { cloudinary, userImageFolder } from '../helpers/upload';

class UserService extends BaseService {

    async asyncCreateUser(payload) {
        let { email, roleId, permissionId } = payload;
        // kiểm tra email 
        const existedEmail = await this.userRepository.findOne({ email, status: { $ne: this.constants.STATUS_OB.NOT_CONFIRM } });
        // if(existedEmail) return this.result(false, 400, 'Email already exists. Please use another email.', null);
        if (existedEmail) return this.result(false, 400, 'Email đã tồn tại. Vui lòng sử dụng email khác.', null);

        // kiểm tra role admin, permission
        let exsitedPermission;
        if (roleId === this.constants.ROLE_ADMIN) {
            exsitedPermission = await this.permissionRepository.findOne({ id: permissionId });
            // if (!exsitedPermission) return this.result(false, 400, 'Authorization does not exist.', null);
            if (!exsitedPermission) return this.result(false, 400, 'Ủy quyền không tồn tại.', null);
        }

        // gender uuid
        const uuid = uuidv4();
        const private_code = this.helper.generateNumberByDigits();

        // html
        // eslint-disable-next-line max-len
        const linkConfirm = `${roleId === this.constants.ROLE_ADMIN ? process.env.APP_CMS_URL : process.env.APP_ENDUSER_URL}/set-password?uuid=${uuid}`;
        const html = `
            <div>
                Thank you for registering an account in the E-Learning system!
            </div>
            <br/>
            <div>
                Please confirm your account and set up a password at the following link:
            </div>
            <br/>
            <a href="${linkConfirm}">${linkConfirm}</a>
            <br/>
            <div>
                Security code: ${private_code}
            </div>
        `;

        // send mail 
        await sendMail(email, 'Confirm E-Learning system account', null, html);

        // delete user have email but not confirm
        const lstUser = await this.userRepository.findAll({
            email,
            status: this.constants.STATUS_OB.NOT_CONFIRM
        })

        if (lstUser?.length > 0) {
            for (let index = 0; index < lstUser.length; ++index) {
                const user = lstUser[index];
                if (user.image) {
                    const fileName = this.helper.getFileNameFormUrl(user.image);
                    await cloudinary.uploader.destroy(`${userImageFolder}/${fileName}`, {
                        resource_type: 'image'
                    });
                }

                await this.userRepository.delete({
                    id: user.id
                })
            }
        }

        // create user
        await this.userRepository.create({
            ...snakecaseKeys(payload),
            permission_id: exsitedPermission?._id || null,
            uuid,
            private_code,
            status: this.constants.STATUS_OB.NOT_CONFIRM
        });

        // return this.result(true, 200, 'Successfully created new user.', null);
        return this.result(true, 200, 'Đã tạo thành công người dùng mới.', null);
    }

    async asyncVerifyUuid(payload) {
        const existedUuid = await this.userRepository.findOne({ uuid: payload.uuid });
        if (!existedUuid) return this.result(false, 400, null, null);

        return this.result(true, 200, null, null);
    }

    async asyncSetPassword(payload) {
        const { uuid, privateCode, password } = payload;

        // kiểm tra uuid
        const existedUuid = await this.userRepository.findOne({ uuid: uuid });
        // if (!existedUuid) return this.result(false, 400, 'Uuid does not exist.', null);
        if (!existedUuid) return this.result(false, 400, 'Uuid không tồn tại.', null);

        // if (existedUuid.private_code !== privateCode) return this.result(false, 400, 'The security code is incorrect.', null);
        if (existedUuid.private_code !== privateCode) return this.result(false, 400, 'Mã bảo mật không chính xác.', null);

        // mã hóa mật khẩu
        const salt = genSaltSync(Number(process.env.SALT_ROUNDS || 10));
        const hassPassword = hashSync(password, salt);

        // lưu mật khẩu
        await this.userRepository.update({
            option: { id: existedUuid.id },
            data: {
                password: hassPassword,
                uuid: null,
                private_code: null,
                status: this.constants.STATUS_OB.ACTIVE
            }
        })

        // return this.result(true, 200, 'Set password successfully.', null);
        return this.result(true, 200, 'Đặt mật khẩu thành công.', null);
    }

    async asyncChangePassword(user, payload) {
        const { currentPassword, password } = payload;

        // Kiểm tra mật khẩu
        const checkPassword = compareSync(currentPassword, user.password);
        if (!checkPassword) return this.result(false, 400, 'Mật khẩu hiện tại không đúng.', null);

        // mã hóa mật khẩu
        const salt = genSaltSync(Number(process.env.SALT_ROUNDS || 10));
        const hassPassword = hashSync(password, salt);

        // lưu mật khẩu
        await this.userRepository.update({
            option: { id: user.id },
            data: {
                password: hassPassword
            }
        })

        // return this.result(true, 200, 'Change password successfully.', null);
        return this.result(true, 200, 'Đổi mật khẩu thành công.', null);
    }

    async asyncForgetPassword(payload) {
        const { email } = payload;
        // kiểm tra email 
        const existedEmail = await this.userRepository.findOne({ email });
        if (existedEmail) {
            // gender uuid
            const uuid = uuidv4();
            const private_code = this.helper.generateNumberByDigits();

            // html
            // eslint-disable-next-line max-len
            const linkConfirm = `${existedEmail.role_id === this.constants.ROLE_ADMIN ? process.env.APP_CMS_URL : process.env.APP_ENDUSER_URL}/set-password?uuid=${uuid}`;
            const html = `
            <div>
                You are requesting a password reset for this account at the E-Learning system!
            </div>
            <br/>
            <div>
                Please reset your password at the following link:
            </div>
            <br/>
            <a href="${linkConfirm}">${linkConfirm}</a>
            <br/>
            <div>
                Security code: ${private_code}
            </div>
        `;

            // send mail 
            await sendMail(email, 'Instructions for recovering E-Learning system password', null, html);

            await this.userRepository.update({
                option: { email },
                data: {
                    uuid,
                    private_code
                }
            })
        }
        return this.result(true, 200, null, null);
    }

    async asyncGetAllUser(req) {
        // eslint-disable-next-line max-len
        const { size = -1, page = 1, name = '', email = '', gender = '', subject = '', permissionId = null, status = null, roleId = this.constants.ROLE_STUDENT, sortKey, sortDir, short = false } = req.query;

        let result;
        const queryData = await this.userRepository.paginate({
            limit: size,
            page,
            options: {
                name: { $regex: name, $options: 'i' },
                email: { $regex: email, $options: 'i' },
                ...(subject ? { subject } : {}),
                ...(roleId == this.constants.ROLE_ADMIN && permissionId ? { permission_id: permissionId } : {}),
                ...(status ? { status } : {}),
                ...(roleId == this.constants.ROLE_STUDENT && gender !== '' ? { gender } : {}),
                role_id: Number(roleId)
            },
            ...(roleId == this.constants.ROLE_ADMIN ? {
                populate: {
                    path: 'permission_id',
                    select: '-_id id name'
                },
            } : {}),
            sort: {
                ...(sortKey && sortDir ? { [sortKey]: sortDir.toLowerCase() } : {})
            }
        })

        result = queryData;
        if (queryData?.elements?.length > 0) {
            result.elements = await Promise.all(result.elements.map(async user => {
                let newEmail = null;
                if (user.uuid_email) {
                    const verifyUuidEmail = await this.verifyToken(user.uuid_email, user.id, { uuid_email: null });
                    if (verifyUuidEmail) {
                        newEmail = verifyUuidEmail.payload.newEmail;
                    }
                }
                return this.responseUser({
                    ...user._doc,
                    newEmail
                }, short)
            }));
        }

        return this.result(true, 200, null, result);
    }

    async asyncGetUser(id) {
        let result = await this.userRepository.findOne({ id }, { path: 'permission_id', select: '-_id id name' });
        // if (!result) return this.result(false, 404, 'Account does not exist.', null);
        if (!result) return this.result(false, 404, 'Tài khoản không tồn tại.', null);

        let newEmail = null;
        if (result.uuid_email) {
            const verifyUuidEmail = await this.verifyToken(result.uuid_email, result.id, { uuid_email: null });
            if (verifyUuidEmail) {
                newEmail = verifyUuidEmail.payload.newEmail;
            }
        }

        result = this.responseUser({
            ...result._doc,
            newEmail
        });

        return this.result(true, 200, null, result);
    }

    async asyncUpdateUser(id, payload) {
        const { name, email, permissionId, status, gender, birthday, phoneNumber, country, address, introduction, image, subject, link } = payload;
        const existedUser = await this.userRepository.findOne({ id }, { path: 'permission_id' });
        // if (!existedUser) return this.result(false, 404, 'Account does not exist.', null);
        if (!existedUser) return this.result(false, 404, 'Tài khoản không tồn tại.', null);

        let exsitedPermission;
        if (existedUser?.role_id === this.constants.ROLE_ADMIN && permissionId && permissionId !== existedUser.permission_id?.id) {
            exsitedPermission = await this.permissionRepository.findOne({ id: permissionId });
            // if (!exsitedPermission) return this.result(false, 400, 'Authorization does not exist.', null);
            if (!exsitedPermission) return this.result(false, 400, 'Ủy quyền không tồn tại.', null);
        }

        let uuid_email = null;
        if (email && email !== existedUser.email) {

            const exitsUserByEmail = await this.userRepository.findOne({
                email
            });

            if (exitsUserByEmail) {
                // return this.result(false, 400, 'Email already exists. Please use another email.', null);
                return this.result(false, 400, 'Email đã tồn tại. Vui lòng sử dụng email khác.', null);
            }

            // gender uuid
            const uuid = uuidv4();
            uuid_email = await this.encryptToken({
                uuid,
                newEmail: email
            });

            // html
            // eslint-disable-next-line max-len
            const linkConfirm = `${existedUser?.role_id === this.constants.ROLE_ADMIN ? process.env.APP_CMS_URL : process.env.APP_ENDUSER_URL}/confirm-email?uuid=${uuid_email}`;
            const html = `
                <div>
                    You have changed your email at the E-Learning system from ${existedUser?.email} to ${email}
                </div>
                <br/>
                <div>
                    Please confirm your email at the following link:
                </div>
                <br/>
                <a href="${linkConfirm}">${linkConfirm}</a>
                <br/>
            `;

            // send mail 
            await sendMail(email, 'Confirm email change of E-Learning system account', null, html);
        }

        if (image && image !== existedUser.image) {
            const fileName = this.helper.getFileNameFormUrl(existedUser.image);
            await cloudinary.uploader.destroy(`${userImageFolder}/${fileName}`, {
                resource_type: 'image'
            });
        }

        await this.userRepository.update({
            option: { id },
            data: {
                name: name ?? existedUser.name,
                permission_id: exsitedPermission?._id ? exsitedPermission?._id : existedUser?.permission_id?._id ?? null,
                status: status ?? existedUser.status,
                gender: gender ?? existedUser.gender,
                birthday: birthday ?? existedUser.birthday,
                phone_number: phoneNumber ?? existedUser.phoneNumber,
                country: country ?? existedUser.country,
                address: address ?? existedUser.address,
                introduction: introduction ?? existedUser.introduction,
                image: image ?? existedUser.image,
                subject: subject ?? existedUser.subject,
                link: link ?? existedUser.link,
                uuid_email
            }
        })

        // return this.result(true, 200, 'Update successful.', null);
        return this.result(true, 200, 'Cập nhật thành công..', null);
    }

    async asyncDeleteUser(id) {
        const existedUser = await this.userRepository.findOne({ id });
        // if (!existedUser) return this.result(false, 404, 'Account does not exist.', null);
        if (!existedUser) return this.result(false, 404, 'Tài khoản không tồn tại.', null);
        await this.userRepository.update({
            option: { id },
            data: { delete_flag: true }
        })

        // return this.result(true, 200, 'Delete successfully.', null);
        return this.result(true, 200, 'Xóa thành công.', null);
    }

    async confirmEmail(uuid) {
        // check existed student by uuid_email
        const existedUserByUuidEmail = await this.userRepository.findOne({ uuid_email: uuid });
        if (!existedUserByUuidEmail) {
            return this.result(false, 400, null, this.constants.MESSAGE.CONFIRM_EMAIL_NOT_EXISTED_OR_EXPIRED_OR_ALREADY_CONFIRM);
        }

        const verifyUuidEmail = await this.verifyToken(uuid, existedUserByUuidEmail.id, { uuid_email: null });
        if (!verifyUuidEmail) {
            return this.result(false, 400, null, this.constants.MESSAGE.CONFIRM_EMAIL_NOT_EXISTED_OR_EXPIRED_OR_ALREADY_CONFIRM);
        }

        const { newEmail } = verifyUuidEmail?.payload;

        if (!newEmail) {
            return this.result(false, 400, null, this.constants.MESSAGE.CONFIRM_EMAIL_NOT_EXISTED_OR_EXPIRED_OR_ALREADY_CONFIRM);
        }

        // check existed user by new email
        const exitsUserByNewEmail = await this.userRepository.findOne({ email: newEmail });
        if (exitsUserByNewEmail) {
            return this.result(false, 400, null, this.constants.MESSAGE.CONFIRM_EMAIL_ALREADY_USE);
        }

        // update email
        await this.userRepository.update({
            option: {
                id: existedUserByUuidEmail.id
            },
            data: {
                email: newEmail,
                uuid_email: null
            }
        })

        return this.result(true, 200, this.constants.MESSAGE.SUCCESS, this.constants.MESSAGE.CONFIRM_EMAIL_SUCCESS);
    }

    async importStudents() {
        let data = [
            {
                name: "Nguyễn Quang Anh",
                gender: 0,
                birthday: "2000/06/22",
                email: "anh.nq180012@sis.hust.edu.vn"
            }
        ]

        data = data.map(user => {

            return {
                ...user,
                country: "VN",
                address: "Hà Nội",
                password: "$2b$09$WfsLE4sqXZRqILvmei.gMOaq2cBq07hqGQ.0ohIrTMCrrPpl6hWH6",
                role_id: this.constants.ROLE_STUDENT,
                status: this.constants.STATUS_OB.ACTIVE
            }
        })

        // for(let index = 0; index < data.length; ++index) {
        //     await this.userRepository.create(data[index]);
        // }
    }

    async importJoinCourseStudent() {
        const courses = await this.courseRepository.findAll();

        const students = await this.userRepository.findAll({
            role_id: this.constants.ROLE_STUDENT
        })

        const data = [];
        const dataComments = [];

        const comments = [
            "Khóa học rất bổ ích.",
            "Nội dung bài giảng rất hay.",
            "Giáo viên dạy hay và dễ hiểu.",
            "Rất hay và bổ ích.",
            "Khóa học chất lượng"
        ]

        for (let index = 0; index < students.length; ++index) {
            const studentInfo = students[index];

            const randomCourses = courses?.sort(() => 0.5 - Math.random())?.slice(0, Math.floor(Math.random() * 6) + 2);

            randomCourses?.forEach((course, index) => {

                const isStart = index !== 3 ? 1 : 0;
                const score = (Math.floor(Math.random() * 9) + 1) / 10;
                const times = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110];
                const getTime = Math.floor(Math.random() * 11);
                const votes = [4, 5];
                const getVote = Math.floor(Math.random() * 2);
                const getComment = Math.floor(Math.random() * 5);

                data.push({
                    user_id: studentInfo._id,
                    course_id: course._id,
                    start_date: "2023-07-29",
                    ...(isStart === 1 ? {
                        test_date: new Date(),
                        score,
                        last_time_viewed: times[getTime],
                        vote: votes[getVote]
                    } : {
                        last_time_viewed: 0,
                        score: 0
                    })
                })

                dataComments.push({
                    user_id: studentInfo._id,
                    course_id: course._id,
                    content: comments[getComment],
                })
            })
        }

        for (let index = 0; index < data.length; ++index) {
            await this.userCourseRepository.create(data[index]);
        }

        for (let index = 0; index < dataComments.length; ++index) {
            await this.commentRepository.create(dataComments[index]);
        }

        console.log('import data success');
    }

    responseUser(user, short = false) {
        const {
            _id,
            id,
            name,
            email,
            gender,
            birthday,
            country,
            address,
            phone_number: phoneNumber,
            created_at: createdAt,
            status,
            permission_id: permission,
            role_id: roleId,
            subject,
            introduction,
            link,
            image,
            newEmail
        } = user;
        if (short) return { id, name, _id };
        if (roleId === this.constants.ROLE_ADMIN) return { id, name, email, newEmail, createdAt, status, permission };
        if (roleId === this.constants.ROLE_STUDENT) return { id, name, email, gender, newEmail, birthday, phoneNumber, country, address, createdAt, status, image, roleId };
        if (roleId === this.constants.ROLE_TEACHER) return { id, name, email, subject, newEmail, image, introduction, link, createdAt, status, roleId }
    }
}

export default UserService;