import { observer } from 'mobx-react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import SettingCourseScreen from './SettingCourseScreen';
import { SCREEN_MODE } from '../../core/configs/constants';
import RateCommentsTab from './components/RateCommentsTab';
import { useNavigate, useParams } from 'react-router-dom';
import { isNumeric } from '../../core/utils/common';
import { useEffect, useState } from 'react';
import { useStore } from '../../core/utils/hook';
import StudentStatusTab from './components/StudentStatusTab';


const CourseInformationScreen = observer(props => {

    // other
    const id = useParams().id;

    // store
    const {
        courseStore: { course, getCourseInfo, setAttrObservable }
    } = useStore();

    // state 
    const [indexTab, setIndexTax] = useState(0);

    // lifecycle
    useEffect(() => {
        const getData = async () => {
            if (id && isNumeric(id)) {
                getCourseInfo(id);
            }
        }

        getData();

        return () => {
            setAttrObservable('course', {});
        }
    }, [indexTab])

    if (id && !isNumeric(id) && !course?.id) return <NotFoundScreen />;

    return (
        <div className='course-information-screen'>
            <h3>{course?.name}</h3>
            <div className='tab-course-info mg-t-20'>
                <Tabs defaultIndex={indexTab} onSelect={(index) => setIndexTax(index)}>
                    <TabList>
                        {/* <Tab>Information</Tab> */}
                        <Tab>Thông tin khóa học</Tab>
                        {/* <Tab>Rate & Comments</Tab> */}
                        <Tab>Đánh giá & bình luận</Tab>
                        {/* <Tab>Student Status</Tab> */}
                    </TabList>

                    <TabPanel>
                        <SettingCourseScreen mode={SCREEN_MODE.EDIT} courseId={id} />
                    </TabPanel>
                    <TabPanel>
                        <RateCommentsTab courseId={id} />
                    </TabPanel>
                    <TabPanel>
                        <StudentStatusTab courseId={id} />
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    )
})

export default CourseInformationScreen;