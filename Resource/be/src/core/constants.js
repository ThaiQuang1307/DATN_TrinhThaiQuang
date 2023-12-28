class Constants {
    ROLE = [0, 1, 2];
    ROLE_ADMIN = 0;
    ROLE_STUDENT = 1;
    ROLE_TEACHER = 2;

    STATUS = [0, 1, 2];
    STATUS_OB = {
        INACTIVE: 0,
        ACTIVE: 1,
        NOT_CONFIRM: 2
    }

    TYPE_SYSTEM = {
        CMS: 1,
        END_USER: 2
    }

    EMAIL_EXPIRED_TIME = '1d'

    MESSAGE = {
        
        // common
        CREATE_SUCCESS: 'Create success',
        UPDATE_SUCCESS: 'Update success',
        DELETE_SUCCESS: 'Delete success',
        SUCCESS: 'Success',
        ERROR: 'Error',

        // confirm email
        CONFIRM_EMAIL_SUCCESS: 1,
        CONFIRM_EMAIL_NOT_EXISTED_OR_EXPIRED_OR_ALREADY_CONFIRM: 2,
        CONFIRM_EMAIL_ALREADY_USE: 3
    }

    COMPARE = {
        DECREASE: 'DECREASE',
        EQUAL: 'EQUAL',
        INCREASE: 'INCREASE'
    }

    CLASSES = {
        'Very Low': 1,
        'Low': 2,
        'Middle': 3,
        'High': 4
    }

    SORT_COURSE_OPTIONS = {
        PARTICIPATION: 'participation',
        RATING: 'rating',
        ASCENDING_NAME: 'ascending_name',
        DESCENDING_NAME: 'descending_name'
    }
}

export default new Constants();