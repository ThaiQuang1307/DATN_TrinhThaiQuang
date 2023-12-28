import { observer } from 'mobx-react';
import { FullPagination, TeacherCard, TopContent } from '../../components';
import { useStore } from '../../core/utils/hook';
import { useEffect } from 'react';
import { ROLE, TEACHER_SUBJECT } from '../../core/configs/constants';

const TeacherScreen = observer((props) => {

    // store
    const {
        userStore: { teacherList, getAllTeacher, clean, paging }
    } = useStore();


    // ifecycle
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
        getAllTeacher({
            roleId: ROLE.ROLE_TEACHER,
            size: 8,
            page
        });
    }

    return (
        <>
            <TopContent namePage={'Giáo viên'} breadcrumb={'Giáo viên'} />

            {/* Team Start */}
            <div className="container-fluid py-5">
                <div className="container pt-5 pb-3">
                    <div className="text-center mb-5">
                        {/* <h5 className='text-primary text-uppercase mb-3' style={{ letterSpacing: '5px' }}>Teachers</h5> */}
                        <h5 className='text-primary text-uppercase mb-3' style={{ letterSpacing: '5px' }}>Giáo viên</h5>
                        {/* <h1>Meet Our Teachers</h1> */}
                        <h1>Đội ngũ giáo viên</h1>
                    </div>
                    <div className="row">
                        {
                            teacherList.map(e => <TeacherCard key={e.id} teacher={{
                                name: e.name,
                                subject: TEACHER_SUBJECT[e.subject].value,
                                image: e.image,
                                link: e.link
                            }} />)
                        }
                    </div>
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
                </div>
            </div>
            {/* Team End */}

        </>
    )
})

export default TeacherScreen;