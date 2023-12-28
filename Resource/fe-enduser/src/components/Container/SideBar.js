import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SYSTEM_PATH } from '../../core/configs/constants';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useStore } from '../../core/utils/hook';
import { useState } from 'react';
import classNames from 'classnames';

const SideBar = (props) => {

    // other
    const navigate = useNavigate();
    const location = useLocation();

    // store
    const { authStore: { logout, userInfo } } = useStore();

    // state
    const [showSidebar, setShowSidebar] = useState(true);

    return (
        <Sidebar collapsed={false} width='300px'>
            <Menu className='ps-menu-root-content' closeOnClick={true}>
                {/* <div type='button' 
                    className={classNames('w-100 pd-20', !showSidebar ? 'text-center' : 'text-right')} 
                    onClick={() => setShowSidebar(!showSidebar)}>
                    {
                        !showSidebar ?
                            <i className="fas fa-indent" style={{'fontSize': '24px', 'color': '#FF6600'}}></i>
                            :
                            <i className="fas fa-outdent" style={{'fontSize': '24px', 'color': '#FF6600'}}></i>
                    }
                </div> */}
                <MenuItem icon={<i className='fas fa-chart-line'></i>} component={<Link to={SYSTEM_PATH.DASHBOARD} />}
                    active={location.pathname.includes(SYSTEM_PATH.DASHBOARD)}>
                    {/* Dashboard */}
                    Tổng quan
                </MenuItem>
                <MenuItem icon={<i className='fas fa-layer-group'></i>} component={<Link to={SYSTEM_PATH.COURSE_MANAGEMENT} />}
                    active={[SYSTEM_PATH.COURSE_MANAGEMENT, SYSTEM_PATH.COURSE_ADD].includes(location.pathname)
                        || location.pathname.includes('/course-information')}>
                    {/* Course Management */}
                    Quản lý khóa học
                </MenuItem>
            </Menu>
        </Sidebar>
    )
}

export default SideBar;