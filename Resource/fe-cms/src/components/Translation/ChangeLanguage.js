import { useState } from 'react';
import './style.scss';
import { useTranslation } from 'react-i18next';

const ChangeLanguage = () => {

    // translation
    const { t, i18n } = useTranslation();

    // state
    const [language, setLanguage] = useState(localStorage.getItem('language') === 'vi' ? 'vi' : 'en');

    // function
    const changeLanguage = (e) => {
        const value = e.target.value;
        setLanguage(value);
        localStorage.setItem('language', value);
        i18n.changeLanguage(value);
    }

    return (
        <select className='select-language' value={language} onChange={changeLanguage}>
            <option value='en'>{t('language.en')}</option>
            <option value='vi'>{t('language.vi')}</option>
        </select>
    )
}

export default ChangeLanguage;