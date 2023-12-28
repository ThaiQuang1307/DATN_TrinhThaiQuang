import createHttpError from 'http-errors';
import { verify } from 'jsonwebtoken';
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';
import AuthService from '../services/AuthService';

export const authorization = (roles, permission) => async (req, res, next) => {
    const authService = new AuthService();
    let token;
    try {
        if (!req.headers || !req.headers.authorization) {
            throw createHttpError(403, 'Unauthorized token!');
        }

        token = req.headers.authorization;
        if (token.startsWith('Bearer ')) {
            token = token.substring(7, token.length);
        }

        const decode = verify(
            token,
            process.env.JSON_WEB_TOKEN_KEY || 'jsonwebtoken'
        );

        // check user
        const result = await authService.asyncAuthorization(roles, permission, decode, token);

        req.user = result.user;
        req.permissions = result.permissions;
        req.token = token;
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
            error.status = 401;
            // error.message = 'Login session has expired. Please log in again.';
            error.message = 'Phiên đăng nhập đã hết hạn. Xin vui lòng đăng nhập lại.';
        }

        if ((error?.status === 401 || error?.status === 403) && token) {
            await authService.asyncLogout(token);
        }

        res.status(error?.status || 500).json({
            success: false,
            code: error.status,
            message: error?.message,
            data: null
        })
    }
}