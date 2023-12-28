/* eslint-disable max-len */
import { observer } from 'mobx-react';
import { useNavigate, useParams } from 'react-router-dom';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { useStore } from '../../../core/utils/hook';
import { useEffect } from 'react';
import { isNumeric } from '../../../core/utils/common';
import moment from 'moment';
import { FullPagination } from '../../../components';

const RateCommentsTab = observer(props => {

    // other
    const { courseId } = props;
    const navigate = useNavigate();
    const id = useParams().id ?? courseId;

    // store
    const {
        authStore: { token, userInfo },
        courseStore: { course, getCourseDetail, commentList, paging, getAllComment, clean }
    } = useStore();

    // lifecycle
    useEffect(() => {
        const getData = async () => {
            if (id && isNumeric(id)) {
                getCourseDetail(id);
                onCommentPageChange(1);
            }
        }

        clean();
        getData();
        return () => {
            clean();

        }
    }, [])

    // function
    const onCommentPageChange = (page) => {
        getAllComment(Number(id), { page });
    }

    return (
        <div className='rate-comments-tab mg-t-50 d-flex'>
            {/* Rating */}
            <div className='col-4'>
                {/* <h3 className='text-uppercase mb-4' style={{letterSpacing: '5px'}}>Rating</h3> */}
                <h3 className='mb-4' style={{ letterSpacing: '5px' }}>Đánh giá</h3>
                <div className='d-flex align-items-center flex-wrap mg-t-20 flex-gap-10'>
                    <div style={{ width: '150px', height: '150px' }}>
                        <CircularProgressbar minValue={0} maxValue={5} value={course?.rate || 0} text={course?.rate && `${course.rate}☆`}
                            styles={buildStyles({
                                textColor: '#FF6600',
                                pathColor: '#FF6600',
                                textSize: '20px'
                            })} />
                    </div>
                    {/* <div>({course?.numberVotes || 0} votes)</div> */}
                    <div>({course?.numberVotes || 0} lượt)</div>
                </div>
            </div>

            {/* Comment List */}
            <div className='col-7'>
                {/* <h3 className='text-uppercase mb-4' style={{ letterSpacing: '5px' }}>{commentList?.length || 0} Comments</h3> */}
                <h3 className='mb-4' style={{ letterSpacing: '5px' }}>{commentList?.length || 0} Bình luận</h3>
                {
                    commentList?.length > 0 &&
                    commentList.map(e => (
                        <div className='media mb-4' key={e.id}>
                            <img src={e.user?.image || '/images/user-avatar-default.svg'} alt='Image' className='img-fluid rounded-circle mr-3 mt-1' style={{ width: '45px', height: '45px' }} />
                            <div className='media-body'>
                                <h6>{userInfo?.id === e.user?.id ? 'You' : e.user?.name} <small><i>{moment(e.createdAt).format('DD MMM YYYY [at] hh:mmA')}</i></small></h6>
                                <p>{e.content}</p>
                            </div>
                        </div>
                    ))
                }
                <div className='col-12'>
                    <FullPagination
                        siblingCount={0}
                        totalRecords={paging.totalRecord}
                        currentPage={paging.page}
                        pageSize={paging.size}
                        onPageChange={onCommentPageChange}
                        previousLabel="«"
                        nextLabel="»"
                    />
                </div>
            </div>
        </div>
    )
});

export default RateCommentsTab;