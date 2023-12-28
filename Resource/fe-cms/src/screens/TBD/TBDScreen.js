import { useTranslation } from 'react-i18next';

const TBDScreen = () => {

    // translation
    const { t } = useTranslation();

    return (
        // This function is still under development
        <div>
            {t('TBDScreen.textTBD')}<a className='hover-underline' href='/'> {t('TBDScreen.linkBackHome')}</a>
        </div>
    );
}

export default TBDScreen;
