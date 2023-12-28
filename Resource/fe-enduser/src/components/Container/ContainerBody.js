import { observer } from 'mobx-react';
import { Outlet } from 'react-router-dom';
import { useStore } from '../../core/utils/hook';
import { useTranslation } from 'react-i18next';
import TopBar from './TopBar';
import NavBar from './Navbar';
import Footer from './Footer';

const ContainerBody = observer(() => {

    // translation
    const { t } = useTranslation();

    return(
        <div className='wrapper'>
            <div className='wrapper-header'>
                <TopBar/>
                <NavBar/>
            </div>
            <div className='wrapper-content'>
                <Outlet/>
            </div>
            <div className='wrapper-footer'>
                <Footer/>
            </div>
        </div>
    )
})

export default ContainerBody;