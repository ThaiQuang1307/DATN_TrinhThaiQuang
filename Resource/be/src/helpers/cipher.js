// import CryptoJS from "crypto-js";

// export const encode = (data) => {
//     if(data === "" || data === null || data === undefined) return null;
    
//     console.log(data);

//     return CryptoJS.AES.encrypt(data, 'secret key').toString();
// }

// export const decode = (data) => {
//     if(data === "" || data === null || data === undefined) {
//         return data;
//     }

//     console.log(data);

//     return CryptoJS.AES.decrypt(data, 'secret key').toString(CryptoJS.enc.Utf8)
// }

import crypto from 'crypto';

// Defining algorithm
const algorithm = 'aes-256-cbc';

// Defining key
const key = Buffer.from('Xt6SNlMy7VjsREUr9nNnlYRoclIC8zSK');
 
// Defining iv
const iv = Buffer.from('qk9BPaJ7rbZbFpkA');

export const encode = (data) => {
    if(data === "" || data === null || data === undefined) return null;

    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([ encrypted, cipher.final() ]);

    return encrypted.toString('hex');
}

export const decode = (data) => {
    if(data === "" || data === null || data === undefined) {
        return data;
    }

    const encryptedText = Buffer.from(data, 'hex');

    const cipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted  = cipher.update(encryptedText);
    decrypted = Buffer.concat([ decrypted, cipher.final() ]);

    return decrypted.toString();
}

export const decodeFunction = `
    function (data) {
    if(data === "" || data === null || data === undefined) {
        return data;
    }

    const cipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted  = cipher.update(encryptedText);
    decrypted = Buffer.concat([ decrypted, cipher.final() ]);

    return decrypted.toString();
}`;

// export const FIRST_ENCODE ="01 ";
// export const KEY = "1000111011011110010100101101000011001111100100011001101010000000";

// export const encode = (data) => {
//     if(data === "" || data === null || data === undefined || data?.startsWith(FIRST_ENCODE)) {
//             return data;
//     }

//     const xorData = data.split("").map((c, i) => c.charCodeAt(0) ^ KEY).join(" ");

//     return `${FIRST_ENCODE}${xorData}`
// }

// export const decode = (data) => {
//     if(data === "" || data === null || data === undefined) {
//         return data;
//     }

//     if(data.startsWith(FIRST_ENCODE)) {
//         const encText = data.substring(FIRST_ENCODE.length, data.length);
//         return encText.split(" ").map((c, i) => String.fromCharCode(c ^ KEY)).join("");
//     }

//     return data;
// }