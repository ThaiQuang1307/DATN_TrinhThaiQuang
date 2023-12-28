/* eslint-disable no-useless-escape */
import * as yup from 'yup';

yup.addMethod(yup.string, 'noSpecialCharacter', function(message, mapper = a => a) {
    return this.test('noSpecialCharacter', message, function(str) {
        const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if(format.test(str)){
            return false;
        } else {
            return true;
        }
    });
});

yup.addMethod(yup.string, 'isValidUrl', function(message, mapper = a => a) {
    return this.test('isValidUrl', message, function(str) {
        if(!str) return true;
        try {
            new URL(str);
        } catch (error) {
            return false;
        }
        return true;
    })
})

yup.addMethod(yup.number, 'checkEqualValue', function(compareValue, message) {
    return this.test('checkEqualValue', message, function(num) {
        if(num !== compareValue) return false;
        return true;
    })
})

export default yup;