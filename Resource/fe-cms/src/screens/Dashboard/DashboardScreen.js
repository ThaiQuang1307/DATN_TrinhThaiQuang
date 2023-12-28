import { observer } from 'mobx-react';
import ClassificationApplication from './components/ClassificationApplication';
import { useTitle } from '../../core/utils/hook';
import ChartClassificationKnowledge from './components/ChartClassificationKnowledge';
import ChartRateOfStudentLearningProgress from './components/ChartRateOfStudentLearningProgress';
import ChartStudentCourse from './components/ChartStudentCourse';

const DashBoardScreen = observer(props => {

    // other
    // useTitle('Dashboard');
    useTitle('Thống kê');

    return (
        <div className='dashboard-screen'>
            {/* <ClassificationApplication/> */}
            {/* <div className='mg-t-50 row'>
                <div className='col-6'>
                    <ChartClassificationKnowledge/>
                </div>
                <div className='col-6'>
                    <ChartRateOfStudentLearningProgress />
                </div>
            </div> */}
            <div className='mg-t-50'>
                <ChartStudentCourse />
            </div>
        </div>
    )
})

export default DashBoardScreen;