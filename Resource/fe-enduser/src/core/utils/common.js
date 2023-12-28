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

export const toHoursAndMinutes = (totalSeconds) => {
    const totalMinutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
  
    return { hours, minutes, seconds };
}

export const extractContent = (html = null) => {
    if(!html) return ''; 

    return new DOMParser()
        .parseFromString(html, 'text/html')
        .documentElement.textContent;
}

export function truncateByWords(str = '', index = 120) {
    if (!str) {
        return {
            showMore: false,
            text: ''
        };
    }

    return {
        showMore: str.length > index,
        text: str.length > index ?  str.substring(0, index) + '...' : str
    }
}

export const countCharacterOfNumber = (num) => {
    if(!num || !isNumeric(num)) return 0;

    return String(num).length;
}