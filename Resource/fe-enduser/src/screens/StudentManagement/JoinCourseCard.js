import { Link, useNavigate } from 'react-router-dom';
import { SYSTEM_PATH } from '../../core/configs/constants';
import { toHoursAndMinutes } from '../../core/utils/common';
import { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import moment from 'moment';

ChartJS.register(ArcElement, Tooltip, Legend);

const JoinCourseCard = (props) => {

    // other
    const navigate = useNavigate();

    // props
    const {
        course: {
            id, name, image, videoLength = 0, lastTimeViewed = 0, score = 0, testDate,
            teacher: {
                name: teacherName
            }
        }
    } = props;

    const { hours, minutes, seconds } = toHoursAndMinutes(videoLength);

    const dataPieView = useMemo(() => {
        const viewed = lastTimeViewed;
        const notView = lastTimeViewed <= videoLength ? videoLength - lastTimeViewed : 0;

        return {
            labels: ['Viewed', 'Not view'],
            datasets: [{
                label: 'Time',
                data: [viewed, notView],
                backgroundColor: [
                    '#FF6600',
                    '#0077b6'
                ]
            }]
        }

    }, [videoLength, lastTimeViewed])

    return (
        <div className='join-course-card border-top border-bottom py-5'>
            <div className='rounded overflow-hidden mb-2 d-flex flex-column flex-lg-row col-12'>
                <img className='img-fluid pd-0' src={image} alt='' onClick={() => navigate(`${SYSTEM_PATH.COURSE}/${id}`)}
                    style={{ width: '300px', height: '200px' }} />
                <div className='px-4 course-card-content d-flex flex-column' style={{ width: 'calc(100% - 300px)' }}>
                    <div className='d-flex mb-3'>
                        <small className='m-0'><i className='far fa-clock text-primary mr-2' />
                            {hours > 0 && `${hours}h`} {minutes > 0 && `${minutes}m`} {seconds > 0 && hours < 1 && `${seconds}s`}
                        </small>
                    </div>
                    <Link className='h5' role='button' to={`${SYSTEM_PATH.COURSE}/${id}`}>{name}</Link>
                    <div className='mg-t-5'>
                        <small className='m-0'><i className='text-primary' />
                            {teacherName}
                        </small>
                    </div>
                    <div className='chart-info d-flex flex-column flex-xl-row align-items-center' style={{ marginTop: '-10px' }} >
                        <div className='col-xl-6 d-flex flex-column align-items-center justify-content-start flex-gap-10 pd-t-35'>
                            <div style={{ width: '134px', height: '134px' }}>
                                {/* <CircularProgressbar minValue={0} maxValue={1} value={score} text={`Score: ${score * 10}`} */}
                                <CircularProgressbar minValue={0} maxValue={1} value={score} text={`Điểm: ${score * 10}`}
                                    styles={buildStyles({
                                        textColor: '#FF6600',
                                        pathColor: '#FF6600',
                                        textSize: '14px'
                                    })} />
                            </div>
                            {
                                testDate ?
                                    // <small>Lastest: {moment(testDate).format('DD MMM YYYY, hh:mmA')}</small>
                                    <small>Gần nhất: {moment(testDate).format('DD MMM YYYY, hh:mmA')}</small>
                                    :
                                    // <small>Haven't taken the test yet.</small>
                                    <small>Chưa làm bài kiểm tra.</small>
                            }
                        </div>
                        <div className='col-xl-6' style={{ maxWidth: '271px' }}>
                            <Pie
                                data={dataPieView}
                                options={{
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'right'
                                        },
                                        datalabels: {
                                            formatter: Math.round
                                        }
                                    }
                                }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JoinCourseCard;