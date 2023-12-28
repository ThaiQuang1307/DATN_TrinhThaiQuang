import { observer } from 'mobx-react';
import React, { useEffect, useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { useForm } from 'react-hook-form';
import { useStore } from '../../../core/utils/hook';
import moment from 'moment';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const TYPE = {
    // all: 'Total',
    all: 'Tổng quan',
    // detail: 'Detail'
    detail: 'Theo năm'
}

const ChartStudentCourse = observer(props => {


    // store
    const {
        algorithmStore: { countStudentAndCourse, getCountStudentAndCourse }
    } = useStore();

    // state
    const { register, formState: { errors, isSubmitting }, watch, setValue } = useForm();
    const watchType = watch('type', TYPE.all);
    const watchYear = watch('year');


    // lifecycle
    useEffect(() => {
        if (watchType === TYPE.all) {
            getCountStudentAndCourse({ type: TYPE.all });
        } else {
            setValue('year', moment().year(), { shouldValidate: true });
        }
    }, [watchType])

    useEffect(() => {
        if (watchType === TYPE.detail) {
            getCountStudentAndCourse({ type: TYPE.detail, year: watchYear });
        }
    }, [watchYear])

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                // text: 'Statistics of students and courses',
                text: 'Thống kê số lượng học viên và khóa học',
                font: {
                    size: 16
                }
            }
        }
    };

    // const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'];
    const labels = ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'];

    const data = useMemo(() => {
        return {
            labels,
            datasets: [
                {
                    // label: 'Number of students',
                    label: 'Số lượng học viên',
                    data: countStudentAndCourse?.numStudentByMonthsOfYear ?? [],
                    borderColor: '#6395FA',
                    backgroundColor: '#6395FA'
                },
                {
                    // label: 'Number of students participating in the courses',
                    label: 'Số lượng học viên tham gia khóa học',
                    data: countStudentAndCourse?.numJoinCourseByMonthsOfYear ?? [],
                    borderColor: '#F7C122',
                    backgroundColor: '#F7C122'
                }
            ]
        };
    }, [countStudentAndCourse])

    const labelsTotal = useMemo(() => {
        return countStudentAndCourse?.years ?? []
    }, [countStudentAndCourse]);

    const dataTotal = useMemo(() => {
        return {
            labels: labelsTotal,
            datasets: [
                {
                    // label: 'Number of students',
                    label: 'Số lượng học viên',
                    data: countStudentAndCourse?.numStudentByYears ?? [],
                    backgroundColor: '#6395FA'
                },
                {
                    // label: 'Number of students participating in the courses',
                    label: 'Số lượng học viên tham gia khóa học',
                    data: countStudentAndCourse?.numJoinCourseByYears ?? [],
                    backgroundColor: '#F7C122'
                }
            ]
        }
    }, [countStudentAndCourse])

    return (
        <div className='chart-user'>
            <div className='container-content'>
                <div>
                    <select {...register('type')} className='width-100'>
                        {
                            Object.keys(TYPE).map(e => <option key={e} value={TYPE[e]}>{TYPE[e]}</option>)
                        }
                    </select>
                    {
                        watchType === TYPE.detail && countStudentAndCourse?.years?.length > 0 &&
                        <select {...register('year')} className='width-100 mg-l-20'>
                            {
                                countStudentAndCourse.years.map(e => <option key={e} value={e}>{e}</option>)
                            }
                        </select>
                    }
                </div>
                <div className='mg-t-10'>
                    {/* <strong>Total number of students: {countStudentAndCourse?.totalStudent ?? 0}</strong><br /> */}
                    <strong>Tổng số học viên: {countStudentAndCourse?.totalStudent ?? 0}</strong><br />
                    {/* <strong>Total number of participants in the course: {countStudentAndCourse?.totalJoinCourse ?? 0}</strong> */}
                    <strong>Tổng số học viên tham gia khóa học: {countStudentAndCourse?.totalJoinCourse ?? 0}</strong>
                </div>
                {
                    watchType === TYPE.all ?
                        <Bar options={options} data={dataTotal} />
                        :
                        <Line options={options} data={data} />
                }
            </div>
        </div>
    )
})

export default ChartStudentCourse;