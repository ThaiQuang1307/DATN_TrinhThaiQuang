import BaseService from './BaseService';
import { compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import createHttpError from 'http-errors';

class AuthService extends BaseService {

    async asyncLogin(payload, typeSystem) {

        const { email, password } = payload;

        // kiểm tra email
        const existedEmail = await this.userRepository.findOne({
            email,
            ...(typeSystem === this.constants.TYPE_SYSTEM.CMS ? { role_id: this.constants.ROLE_ADMIN } : { role_id: { $ne: this.constants.ROLE_ADMIN } })
        }, { path: 'permission_id' });
        // if(!existedEmail) return this.result(false, 400, 'Email or password is incorrect.', null);
        if (!existedEmail) return this.result(false, 400, 'Email hoặc mật khẩu không đúng.', null);

        // kiểm tra status
        // if(existedEmail.status === this.constants.STATUS_OB.INACTIVE) return this.result(false, 400, 'Account has been locked.', null);
        if (existedEmail.status === this.constants.STATUS_OB.INACTIVE) return this.result(false, 400, 'Tài khoản đã bị khóa.', null);
        // if(existedEmail.status === this.constants.STATUS_OB.NOT_CONFIRM) return this.result(false, 400, 'Unconfirmed account.', null);
        if (existedEmail.status === this.constants.STATUS_OB.NOT_CONFIRM) return this.result(false, 400, 'Tài khoản chưa được xác nhận.', null);

        // kiểm tra mật khẩu
        const checkPassword = compareSync(password, existedEmail.password);
        // if (!checkPassword) return this.result(false, 400, 'Email or password is incorrect.', null);
        if (!checkPassword) return this.result(false, 400, 'Email hoặc mật khẩu không đúng.', null);

        // kiểm tra quyền đối với role admin
        let permissions;
        if (typeSystem === this.constants.TYPE_SYSTEM.CMS) {
            permissions = existedEmail.permission_id;
            // if (!permissions) return this.result(false, 400, 'Account does not have access.', null);
            if (!permissions) return this.result(false, 400, 'Tài khoản không có quyền truy cập.', null);
            let isExistPermission = false;
            for (const [key, value] of Object.entries(permissions.permissions ?? {})) {
                if (value === true) {
                    isExistPermission = true;
                    break;
                }
            }
            // if (!isExistPermission) return this.result(false, 400, 'Account does not have access.', null);
            if (!isExistPermission) return this.result(false, 400, 'Tài khoản không có quyền truy cập.', null);
        }

        // sinh token
        const token = sign({
            id: existedEmail.id,
            email: existedEmail.email,
            roleId: existedEmail.role_id,
            ...(typeSystem === this.constants.TYPE_SYSTEM.CMS ? { permissions: permissions.permissions ?? {} } : {})
        }, process.env.JSON_WEB_TOKEN_KEY || 'jsonwebtoken', { expiresIn: '48h' });

        await this.tokenRepository.create({
            user_id: existedEmail._id,
            token
        })

        const result = {
            user: {
                id: existedEmail.id,
                name: existedEmail.name,
                roleId: existedEmail.role_id
            },
            token: 'Bearer ' + token
        }

        return this.result(true, 200, null, result);
    }


    async asyncAuthorization(roles, permission, decode, token) {
        const { id, email } = decode;

        // kiểm tra token
        const existedToken = await this.tokenRepository.findOne({ token });
        // if (!existedToken) throw createHttpError(403, 'Login session has expired.');
        if (!existedToken) throw createHttpError(403, 'Phiên đăng nhập đã hết hạn.');

        // kiểm tra id
        const user = await this.userRepository.findOne({ id }, { path: 'permission_id' });
        if (!user) throw createHttpError(403, 'Authorization.');

        // if (user.status !== this.constants.STATUS_OB.ACTIVE) throw createHttpError(403, 'Login session has expired.');
        if (user.status !== this.constants.STATUS_OB.ACTIVE) throw createHttpError(403, 'Phiên đăng nhập đã hết hạn.');

        // if (user.email !== email) throw createHttpError(403, 'Account information has changed. Please log in again.');
        if (user.email !== email) throw createHttpError(403, 'Thông tin tài khoản đã thay đổi. Xin vui lòng đăng nhập lại.');

        if (roles?.includes(this.constants.ROLE_ADMIN) && user.role_id !== this.constants.ROLE_ADMIN) {
            // throw createHttpError(403, 'Account does not have access.');
            throw createHttpError(403, 'Tài khoản không có quyền truy cập.');
        }

        let permissions;
        if (roles?.includes(this.constants.ROLE_ADMIN)) {
            // get permissions
            permissions = user.permission_id;

            if (!permissions) {
                // throw createHttpError(403, 'Account does not have access.');
                throw createHttpError(403, 'Tài khoản không có quyền truy cập.');
            }

            let isExistPermission = false;
            for (const [key, value] of Object.entries(permissions?.permissions ?? {})) {
                if (value === true) {
                    isExistPermission = true;
                    break;
                }
            }

            if (!isExistPermission) {
                // throw createHttpError(403, 'Account does not have access.');
                throw createHttpError(403, 'Tài khoản không có quyền truy cập.');
            }

            const permissionDecoded = decode?.permissions;

            if (JSON.stringify(permissions?.permissions) !== JSON.stringify(permissionDecoded)) {
                // throw createHttpError(403, 'Account information has changed. Please log in again.');
                throw createHttpError(403, 'Thông tin tài khoản đã thay đổi. Xin vui lòng đăng nhập lại.');
            }

            if (permission) {
                if (!Array.isArray(permission)) {
                    if (!permissions?.permissions?.[permission]) {
                        // throw createHttpError(403, 'Account does not have access.');
                        throw createHttpError(403, 'Tài khoản không có quyền truy cập.');
                    }
                } else {
                    let havePermission = false;
                    permission.forEach(e => {
                        if (permissions?.permissions?.[e]) {
                            havePermission = true;
                        }
                    })
                    if (!havePermission) {
                        // throw createHttpError(403, 'Account does not have access.');
                        throw createHttpError(403, 'Tài khoản không có quyền truy cập.');
                    }
                }
            }
        }

        return {
            user,
            permissions
        }
    }


    async asyncLogout(token) {
        await this.tokenRepository.update({
            option: { token },
            data: { delete_flag: true }
        })

        // return this.result(true, 200, 'Sign out successful.', null);
        return this.result(true, 200, 'Đăng xuất thành công.', null);
    }
}

export default AuthService;