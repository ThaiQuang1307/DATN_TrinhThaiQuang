import constants from "../core/constants";

class HelperUtil {

    generateNumberByDigits(digits = 6) {
        return Math.floor(100000 + Math.random() * 900000);
    }

    getFileNameFormUrl(url) {
        if(!url) return '';
        return url.split('/')?.pop()?.split('.')?.[0]
    }

    compareValue(before, after) {
        if(after > before) return constants.COMPARE.INCREASE;
        if(after < before) return constants.COMPARE.DECREASE;
        return constants.COMPARE.EQUAL
    }
}

export default new HelperUtil();