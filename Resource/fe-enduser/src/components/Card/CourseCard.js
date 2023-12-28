import { Link, useNavigate } from 'react-router-dom';
import { toHoursAndMinutes } from '../../core/utils/common';
import { SYSTEM_PATH } from '../../core/configs/constants';

const CourseCard = (props) => {

    const navigate = useNavigate();

    const { course: { id, name, image, numberStudents = 0, time = 0, rate = 0, numberVotes = 0, teacherName } } = props;

    const { hours, minutes, seconds } = toHoursAndMinutes(time);

    return (
        <div className='col-lg-4 col-md-6 mb-4 course-card'>
            <div className='rounded overflow-hidden mb-2'
                style={{ 'boxShadow': 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px' }}>
                <img className='img-fluid' src={image} alt='' onClick={() => navigate(`${SYSTEM_PATH.COURSE}/${id}`)} />
                <div className='bg-secondary p-4 course-card-content d-flex flex-column'>
                    <div className='d-flex justify-content-between mb-3'>
                        {/* <small className='m-0'><i className='fa fa-users text-primary mr-2' />{numberStudents} Students</small> */}
                        <small className='m-0'><i className='fa fa-users text-primary mr-2' />{numberStudents} Học viên</small>
                        <small className='m-0'><i className='far fa-clock text-primary mr-2' />
                            {hours > 0 && `${hours}h`} {minutes > 0 && `${minutes}m`} {seconds > 0 && hours < 1 && `${seconds}s`}
                        </small>
                    </div>
                    <Link className='h5' role='button' to={`${SYSTEM_PATH.COURSE}/${id}`}>{name}</Link>
                    <div className='mt-auto'>
                        <div className='mg-t-5'>
                            <small className='m-0'><i className='text-primary' />
                                {teacherName}
                            </small>
                        </div>
                        <div className='border-top mg-t-5 pt-4'>
                            <div className='d-flex justify-content-start'>
                                <h6 className='m-0'><i className='fa fa-star text-primary mr-2' />{rate} <small>({numberVotes})</small></h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default CourseCard;