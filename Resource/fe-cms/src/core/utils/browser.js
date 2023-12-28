export const getSavedInfo = fieldName => {
    return localStorage.getItem(fieldName) || sessionStorage.getItem(fieldName) || null;
};

export const getSavedInfoParse = fieldName => {
    return JSON.parse(localStorage.getItem(fieldName)) || JSON.parse(sessionStorage.getItem(fieldName)) || null;
};

export const reloadEventsDOMContentLoaded = () => {

    document.dispatchEvent(new Event('DOMContentLoaded', {

        bubbles: true,

        cancelable: true

    }));

}

export const loadFilePreview = (file, output, cb1 = null, cb2 = null) => {
    if(!file || !output || !(file instanceof File)) return;
    
    const outElement = document.getElementById(output);
    outElement.src = URL.createObjectURL(file);
    outElement.onloadedmetadata = () => {
        cb1 && cb1(outElement.duration);
    }
    outElement.onload = () => {
        cb2 && cb2({ width: outElement.naturalWidth , height: outElement.naturalHeight });
        URL.revokeObjectURL(outElement.src); // free memory
    }
}


export const loadURLPreview = (url, output, cb = null) => {
    const outElement = document.getElementById(output);
    outElement?.setAttribute('src', url);
    cb && cb();
}