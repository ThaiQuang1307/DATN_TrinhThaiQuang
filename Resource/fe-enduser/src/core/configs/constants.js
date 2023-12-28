export const SYSTEM_PATH = {
    LOGIN: '/login',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    SET_PASSWORD: '/set-password',
    // info
    PROFILE: '/profile',
    CHANGE_PASSWORD: '/change-password',
    // home
    HOME: '/',
    // about us
    ABOUT: '/about',
    // course
    COURSE: '/course',
    COURSE_DETAIL: '/course/:id',
    COURSE_TEST: '/course-test/:id',
    // teacher: 
    TEACHER: '/teacher',
    // contact
    CONTACT: '/contact',
    // confirm email
    CONFIRM_EMAIL: '/confirm-email',
    // teacher management
    DASHBOARD: '/dashboard',
    COURSE_MANAGEMENT: '/course-management',
    COURSE_ADD: '/course-add',
    COURSE_INFORMATION: '/course-information/:id',
    // student
    MY_COURSE: '/my-courses'
};

export const MSG = {
    //#region Api message
    // 'api.response.worng_format': 'Response body is malformed',
    'api.response.worng_format': 'Nội dung phản hồi không đúng định dạng',
    // 'api.response.no_message': 'No error message response',
    'api.response.no_message': 'Không có phản hồi thông báo lỗi',
    'api.response.server_error':
        // 'There was a problem with the server connection. \nPlease try to connect again',
        'Đã xảy ra sự cố với kết nối máy chủ. \nHãy thử kết nối lại',
    'api.response.no_network':
        // 'There was a problem with the server connection. \nPlease try to connect again',
        'Đã xảy ra sự cố với kết nối máy chủ. \nHãy thử kết nối lại',
    // 'api.response.authorization': 'Please log in again',
    'api.response.authorization': 'Xin vui lòng đăng nhập lại',
    //#endregion Api message

    //#region inform
    // 'inform.success.create': 'Create success',
    'inform.success.create': 'Thông báo hành động tạo',
    // 'inform.success.update': 'Update success',
    'inform.success.update': 'Thông báo hành động cập nhật',
    // 'inform.success.delete': 'Delete success',
    'inform.success.delete': 'Thông báo hành động xóa',
    // 'inform.success.import': 'Import success',
    'inform.success.import': 'Thông báo hành động import',
    //#endregion

    //#region validate error message
    // 'error.required': 'Please enter required field',
    'error.required': 'Vui lòng điền đủ thông tin!',
    // 'error.email_format': 'Incorrect email format',
    'error.email_format': 'Định dạng email không chính xác!',
    // 'error.url': 'Incorrect url format'
    'error.url': 'Định dạng url không chính xác!'
    //#endregion
};

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [1, 5, 10, 50, 100, 500, 1000];
export const MIN_NUMBER_ANSWER = 2;
// There are alot of table in system. Example: Document, Form difinition, User, Tenant.
export const TABLE_CODE = {
    DOCUMENT: 0
}

export const SCREEN_MODE = {
    ADD: 0,
    EDIT: 1,
    DETAIL: 2
}

export const WIDTH_COLUMN_SELECT_TABLE = '50px';

export const FORMAT_DATE = 'YYYY/MM/DD';
export const FORMAT_DATE_TIME = 'YYYY/MM/DD HH:mm:ss';

export const ROLE = {
    ROLE_ADMIN: 0,
    ROLE_USER: 1,
    ROLE_TEACHER: 2
}

export const GENDER = {
    0: 'Male',
    1: 'Female'
}

export const STATUS = {
    INACTIVE: 0,
    ACTIVE: 1,
    NOT_CONFIRM: 2
}

export const STATUS_STRING = {
    // 0: 'Inactive',
    // 1: 'Active',
    // 2: 'Wait for confirm'
    0: 'Dừng hoạt động',
    1: 'Hoạt động',
    2: 'Chờ xác nhận'
}

export const CONFIRM_EMAIL_STATUS = {
    CONFIRM_EMAIL_SUCCESS: 1,
    CONFIRM_EMAIL_NOT_EXISTED_OR_EXPIRED_OR_ALREADY_CONFIRM: 2,
    CONFIRM_EMAIL_ALREADY_USE: 3
}

export const CONFIRM_EMAIL_STATUS_STRING = {
    1: 'Your email address has been updated. From now on, you can log in with your new email address and use the system.',
    2: 'This link has expired or has already been used.',
    3: 'This email address is already used by another account. Please update your new email address.'
}

export const TEACHER_SUBJECT = {
    INFORMATION_SYSTEM: {
        key: 'INFORMATION_SYSTEM',
        // value: 'Information system'
        value: 'Hệ thống thông tin'
    },
    COMPUTER_SCIENCE: {
        key: 'COMPUTER_SCIENCE',
        // value: 'Computer science'
        value: 'Khoa học máy tính'
    },
    COMPUTER_ENGINEERING: {
        key: 'COMPUTER_ENGINEERING',
        // value: 'Computer engineering'
        value: 'Kỹ thuật máy tính'
    },
    SOFTWARE_TECHNOLOGY: {
        key: 'SOFTWARE_TECHNOLOGY',
        // value: 'Software technology'
        value: 'Công nghệ phần mềm'
    }
}

export const TOOLTIP = {
    // ACTIVE: 'Active',
    // INACTIVE: 'Inactive',
    // EDIT: 'Edit',
    // DELETE: 'Delete',
    // VIEW: 'View',
    // INFO: 'Information'
    ACTIVE: 'Hoạt động',
    INACTIVE: 'Dừng hoạt động',
    EDIT: 'Sửa',
    DELETE: 'Xóa',
    VIEW: 'Xem',
    INFO: 'Thông tin'
}

export const COMPARE = {
    DECREASE: 'DECREASE',
    EQUAL: 'EQUAL',
    INCREASE: 'INCREASE'
}