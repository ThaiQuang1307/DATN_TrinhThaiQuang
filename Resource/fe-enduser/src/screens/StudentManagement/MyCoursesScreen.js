import { observer } from 'mobx-react';
import { FullPagination, TopContent } from '../../components';
import { useStore } from '../../core/utils/hook';
import { ROLE } from '../../core/configs/constants';
import NotFoundScreen from '../404/NotFoundScreen';
import { useEffect } from 'react';
import JoinCourseCard from './JoinCourseCard';

const MyCoursesScreen = observer(props => {

    // store
    const {
        authStore: { token, userInfo },
        courseStore: { courseList, paging, getJoinCoursesOfStudent, clean }
    } = useStore();

    // lifecycle
    useEffect(() => {
        const getData = () => {
            onPageChange(1);
        }
    
        clean();
        getData();
        return () => {
            clean();
        }
    }, [])

    // function
    const onPageChange = (page) => {
        getJoinCoursesOfStudent({
            size: 10,
            page
        })
    }
    
    if(userInfo?.roleId !== ROLE.ROLE_USER) return <NotFoundScreen/>

    return (
        <>
            <TopContent namePage={'Profile'} breadcrumb={'My courses'}/>
            <div className='container-fluid py-5'>
                <div className='container'>
                    <div className='row justify-content-center'>
                        <div className='col-12 col-lg-10'>
                            {
                                courseList?.length > 0 &&
                                <>
                                    { courseList.map(userCourse => (
                                        <div className='col-12'>
                                            <JoinCourseCard key={userCourse.id} course={userCourse}/>
                                        </div>
                                    )) }

                                    <div className='col-12'>
                                        <FullPagination
                                            siblingCount={0}
                                            totalRecords={paging.totalRecord}
                                            currentPage={paging.page}
                                            pageSize={paging.size}
                                            onPageChange={onPageChange}
                                            previousLabel="«"
                                            nextLabel="»"
                                        />
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})

export default MyCoursesScreen;