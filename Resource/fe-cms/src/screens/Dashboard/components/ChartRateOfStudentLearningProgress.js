import { observer } from 'mobx-react';
import { useMemo } from 'react';
import { useStore } from '../../../core/utils/hook';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartRateOfStudentLearningProgress = observer(props => {

    // store
    const {
        algorithmStore: { countClassificationKnowledge }
    } = useStore();

    const dataPieView = useMemo(() => {

        return {
            // labels: ['Not view', 'Viewed and not test', 'Viewed and tested'],
            labels: ['Chưa xem', 'Đã xem và chưa làm kiểm tra', 'Đã xem và đã làm kiểm tra'],
            datasets: [{
                // label: 'Total',
                label: 'Tổng',
                data: [
                    countClassificationKnowledge.userNotView ?? 0,
                    countClassificationKnowledge.userViewedAndNotTest ?? 0,
                    countClassificationKnowledge.userViewedAndTested ?? 0
                ],
                backgroundColor: [
                    '#6395FA',
                    'rgb(101, 119, 152, 0.6)',
                    '#63DAAB'
                ]
            }]
        }

    }, [countClassificationKnowledge])

    return (
        <div className='chart-rate-of-student-learning-progress h-100'>
            <div className='container-content d-flex justify-content-center align-items-center h-100'>
                <div className='width-350'>
                    <Pie
                        data={dataPieView}
                        options={{
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'bottom'
                                },
                                title: {
                                    display: true,
                                    // text: 'Rate of student learning progress',
                                    text: 'Tỉ lệ tiến độ của học viên',
                                    font: {
                                        size: 16
                                    }
                                }
                            }
                        }} />
                </div>
            </div>
        </div>
    )
})

export default ChartRateOfStudentLearningProgress;