import { useTranslation } from 'react-i18next';
import { useTitle } from '../../core/utils/hook';

const NotFoundScreen = () => {

    // translation
    const { t } = useTranslation();

    // other
    useTitle('404');

    return(
        // We could not find the page you were looking for. Meanwhile, you may return to home.
        <div className='not-found-screen'>
            {t('notFoundScreen.textNotFound')}<a className='hover-underline' href='/'> {t('notFoundScreen.linkBackHome')}</a>
        </div>
    )
}

export default NotFoundScreen;