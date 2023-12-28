export const SYSTEM_PATH = {
    LOGIN: '/login',
    FORGET_PASSWORD: '/forget-password',
    SET_PASSWORD: '/set-password',
    // info
    PROFILE: '/profile',
    CHANGE_PASSWORD: '/change-password',
    // confirm email
    CONFIRM_EMAIL: '/confirm-email',
    // dashboard
    DASHBOARD: '/',
    // thể loại
    CATEGORY_MANAGEMENT: '/category',
    // khóa học
    COURSE_MANAGEMENT: '/course',
    COURSE_ADD: '/course-add',
    COURSE_EDIT: '/course/:id',
    // bài học
    LECTURE_MANAGEMENT: '/lecture',
    LECTURE_ADD: '/lecture/add',
    LECTURE_EDIT: '/lecture/:id',
    // admin
    ADMIN_MANAGEMENT: '/admin',
    // teacher
    TEACHER_MANAGEMENT: '/teacher',
    TEACHER_ADD: '/teacher-add',
    TEACHER_EDIT: '/teacher/:id',
    // học viên
    STUDENT_MANAGEMENT: '/student',
    // tin nhắn
    MESSAGE_MANAGEMENT: '/message',
    MESSAGE_ADD: '/message/add',
    // liên hệ
    INQUIRY_MANAGEMENT: '/inquiry',
    // thuật toán
    DATA: '/data',
    MAIN_ALGORITHM: '/main-algorithm',
    OTHER_ALGORITHMS: '/other-algorithms',
    // cài đặt chung
    SETTING_AUTH: '/setting/auth',
    SETTING_FAQ: '/setting/faq'
};

export const MSG = {
    //#region Api message
    // 'api.response.worng_format': 'Response body is malformed',
    'api.response.worng_format': 'Nội dung phản hồi không đúng định dạng',
    // 'api.response.no_message': 'No error message response',
    'api.response.no_message': 'Không có phản hồi thông báo lỗi',
    'api.response.server_error':
        // 'There was a problem with the server connection. \nPlease try to connect again',
        'Đã xảy ra sự cố với kết nối máy chủ. \nVui lòng thử kết nối lại!',
    'api.response.no_network':
        // 'There was a problem with the server connection. \nPlease try to connect again',
        'Đã xảy ra sự cố với kết nối máy chủ. \nVui lòng thử kết nối lại!',
    // 'api.response.authorization': 'Please log in again',
    'api.response.authorization': 'Xin vui lòng đăng nhập lại!',
    //#endregion Api message

    //#region inform
    'inform.success.create': {
        vi: 'Tạo thành công',
        en: 'Tạo thành công'
        // en: 'Create success'
    },
    'inform.success.update': {
        vi: 'Cập nhật thành công',
        en: 'Cập nhật thành công'
        // en: 'Update success'
    },
    'inform.success.delete': {
        vi: 'Xóa thành công',
        en: 'Xóa thành công'
        // en: 'Delete success'
    },
    'inform.success.import': {
        vi: 'Nhập thành công',
        en: 'Nhập thành công'
        // en: 'Import success'
    },
    //#endregion

    //#region validate error message
    'error.required': {
        vi: 'Vui lòng nhập trường bắt buộc!',
        en: 'Vui lòng nhập trường bắt buộc!'
        // en: 'Please enter required field'
    },
    'error.email_format': {
        vi: 'Email không đúng định dạng!',
        en: 'Email không đúng định dạng!'
        // en: 'Incorrect email format'
    },
    'error.url': {
        vi: 'Url không đúng định dạng!',
        en: 'Url không đúng định dạng!'
        // en: 'Incorrect url format'
    }
    //#endregion
};

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [1, 5, 10, 50, 100, 500, 1000];
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

export const MIN_NUMBER_ANSWER = 2;

export const CATEGORY_IMAGE_SIZE = 1.6;
export const COURSE_IMAGE_SIZE = 1.5;
export const TEACHER_IMAGE_SIZE = 1;

export const PERMISSIONS = [
    {
        key: 'dashboard',
        name: {
            vi: 'Thống kê',
            // en: 'Dashboard'
            en: 'Thống kê'
        }
    },
    {
        key: 'category',
        name: {
            vi: 'Quản lý thể loại',
            en: 'Quản lý thể loại'
            // en: 'Category Management'
        }
    },
    {
        key: 'course',
        name: {
            vi: 'Quản lý khóa học',
            en: 'Quản lý khóa học'
            // en: 'Course Management'
        }
    },
    // {
    //     key: 'lecture',
    //     name: 'Bài học'
    // },
    {
        key: 'admin',
        name: {
            vi: 'Quản lý quản trị viên',
            en: 'Quản lý quản trị viên'
            // en: 'Admin Management'
        }
    },
    {
        key: 'teacher',
        name: {
            vi: 'Quản lý giáo viên',
            en: 'Quản lý giáo viên'
            // en: 'Teacher Management'
        }
    },
    {
        key: 'student',
        name: {
            vi: 'Quản lý học viên',
            en: 'Quản lý học viên'
            // en: 'Student Management'
        }
    },
    {
        key: 'algorithm',
        name: {
            vi: 'Thuật toán',
            en: 'Thuật toán'
            // en: 'Algorithm'
        }
    },
    {
        key: 'permission',
        name: {
            vi: 'Quản lý phân quyền',
            en: 'Quản lý phân quyền'
            // en: 'Permission Management'
        }
    }
]

export const ROLE = {
    ROLE_ADMIN: 0,
    ROLE_USER: 1,
    ROLE_TEACHER: 2
}

export const STATUS = {
    0: {
        vi: 'Bị khóa',
        en: 'Bị khóa'
        // en: 'Inactive'
    },
    1: {
        vi: 'Đang hoạt động',
        en: 'Đang hoạt động'
        // en: 'Active'
    },
    2: {
        vi: 'Chờ xác nhận',
        en: 'Chờ xác nhận'
        // en: 'Wait for confirm'
    }
}

export const STATUS_KEY_STRING = {
    INACTIVE: 0,
    ACTIVE: 1,
    NOT_CONFIRM: 2
}

export const TOOLTIP = {
    ACTIVE: {
        vi: 'Mở khóa',
        en: 'Mở khóa'
        // en: 'Active'
    },
    INACTIVE: {
        vi: 'Khóa',
        en: 'Khóa'
        // en: 'Inactive'
    },
    EDIT: {
        vi: 'Chỉnh sửa',
        en: 'Chỉnh sửa'
        // en: 'Edit'
    },
    DELETE: {
        vi: 'Xóa',
        en: 'Xóa'
        // en: 'Delete'
    },
    VIEW: {
        vi: 'Xem chi tiết',
        en: 'Xem chi tiết'
        // en: 'View detail'
    }
}

export const GENDER = {
    0: {
        vi: 'Nam',
        en: 'Nam'
        // en: 'Male'
    },
    1: {
        vi: 'Nữ',
        en: 'Nữ'
        // en: 'Female'
    }
}

export const MODAL = {
    TITLE_WARNING_MODAL: {
        vi: 'Xác nhận',
        en: 'Xác nhận'
        // en: 'Confirm'
    },
    CANCEL_BTN: {
        vi: 'Hủy',
        en: 'Hủy'
        // en: 'Cancel'
    }
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
        vi: 'Hệ thống thông tin',
        en: 'Hệ thống thông tin'
        // en: 'Information system'
    },
    COMPUTER_SCIENCE: {
        key: 'COMPUTER_SCIENCE',
        vi: 'Khoa học máy tính',
        en: 'Khoa học máy tính'
        // en: 'Computer science'
    },
    COMPUTER_ENGINEERING: {
        key: 'COMPUTER_ENGINEERING',
        vi: 'Kỹ thuật máy tính',
        en: 'Kỹ thuật máy tính'
        // en: 'Computer engineering'
    },
    SOFTWARE_TECHNOLOGY: {
        key: 'SOFTWARE_TECHNOLOGY',
        vi: 'Công nghệ phần mềm',
        en: 'Công nghệ phần mềm'
        // en: 'Software technology'
    }
}

export const COMPARE = {
    DECREASE: 'DECREASE',
    EQUAL: 'EQUAL',
    INCREASE: 'INCREASE'
}