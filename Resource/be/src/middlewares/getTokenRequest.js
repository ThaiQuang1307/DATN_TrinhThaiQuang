import { verify } from 'jsonwebtoken';
import AuthService from '../services/AuthService';

export const getTokenRequest = (roles, permission) => async (req, res, next) => {
    let token, user;
    try {
        const authService = new AuthService();
        if (req.headers && req.headers.authorization) {
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
            req.token = token;
        }
    } catch (error) {
        token = user = null;
    } finally {
        next();
    }
}