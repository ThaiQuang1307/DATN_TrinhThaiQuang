export const getStringAfterLastSlash = (str = '', char = '.', removeQuery = false) => {
    if (!str) return '';
    const n = str.lastIndexOf(char);
    let converted = str.substring(n + 1);
    if (removeQuery && converted.includes('?')) {
        converted = converted.split('?')[0] || ''
    }
    return converted;
};

export const customToolBarEditor = ['bold', 'italic', 'strikethrough',  'underline', '|',
    'fontfamily', 'fontsize', 'fontColor', 'fontBackgroundColor', '|', 
    'alignment', 'outdent', 'indent', '|', 'bulletedList', 'numberedList', '|', 
    'link', '|', 'undo', 'redo'];

export const customToolBarEditorForTeacher = ['bold', 'italic', 'strikethrough',  'underline', '|',
    'fontfamily', 'fontColor', 'fontBackgroundColor', '|', 
    'alignment', 'outdent', 'indent', '|', 'bulletedList', 'numberedList', '|', 
    'link', '|', 'undo', 'redo'];

export const customToolBarEditorForCourse = ['bold', 'italic', 'strikethrough',  'underline', '|',
    'fontfamily', 'fontColor', 'fontBackgroundColor', '|', 
    'alignment', 'outdent', 'indent', '|', 'bulletedList', 'numberedList', '|', 
    'link', '|', 'undo', 'redo'];

export const isNumeric = (value) => {
    return /^\d+$/.test(value);
}

export const countCharacterOfNumber = (num) => {
    if(!num || !isNumeric(num)) return 0;

    return String(num).length;
}