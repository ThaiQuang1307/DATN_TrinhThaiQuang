class ResponseUtil {
    constructor() {
    }

    response(isSuccess = false, statusCode = 400, message = null, data = null) {
        const ret = {
            success: isSuccess,
            code: statusCode,
            message: message,
            data: data
        }
        return ret;
    }
}

export default new ResponseUtil();