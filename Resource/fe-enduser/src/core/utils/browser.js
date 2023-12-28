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

export const loadFilePreview = (file, output, cb) => {
    if(!file || !output || !(file instanceof File)) return;
    
    const outElement = document.getElementById(output);
    outElement.src = URL.createObjectURL(file);
    outElement.onloadedmetadata = () => {
        cb && cb(outElement.duration);
    }
    outElement.onload = () => {
        URL.revokeObjectURL(outElement.src); // free memory
    }
}


export const loadURLPreview = (url, output) => {
    const outElement = document.getElementById(output);
    outElement?.setAttribute('src', url);
}

export const formatHeightElements = (className) => {
    let maxHeight = 0;
    for(let i=0; i< window.$(className).length; i++){
        if(window.$(className).eq(i)){
            var currentHeight = window.$(className).eq(i).height();
            if(currentHeight >= maxHeight){
                maxHeight = currentHeight;
            }
        }
        else{
            break;
        }
    }
    window.$(className).height(maxHeight);
}

export const clickOutsideCollapse = (idElementNav) => {
    window.$(document).click(function (event) {
        const _opened = window.$(idElementNav).hasClass('show');
        if (_opened === true) {
            window.$(idElementNav).removeClass('show');
        }
    });
}