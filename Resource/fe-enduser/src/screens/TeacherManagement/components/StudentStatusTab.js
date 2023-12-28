import { observer } from 'mobx-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../../core/utils/hook';
import { useEffect } from 'react';
import moment from 'moment';
import { Table } from '../../../components';
import { isNumeric } from '../../../core/utils/common';
import { COMPARE, TOOLTIP } from '../../../core/configs/constants';
import classNames from 'classnames';
import ClassificationDetail from './ClassificationDetail';

const StudentStatusTab = observer(props => {

    // other
    const { courseId } = props;
    const navigate = useNavigate();
    const id = useParams().id ?? courseId;

    // store
    const {
        courseStore: { classificationKnowledge, paging, getClassificationStudentKnowledge, clean, setAttrObservable },
        modalStore: { show, hide }
    } = useStore();

    // lifecycle
    useEffect(() => {
        clean();
        onFetchDataClassificationKnowledge();

        return () => {
            clean();
        }
    }, [])

    // function
    const onFetchDataClassificationKnowledge = (tableData) => {
        setAttrObservable('paging', tableData, true, false);
        getClassificationStudentKnowledge({
            ...tableData,
            courseId: id
        });
    }

    const onShowClassificationDetail = (student, course, data) => {
        show({
            id: 'modal-setting-student',
            isOpen: true,
            header: '',
            onCancel: () => hide(),
            onRequestClose: () => hide(),
            children: (
                <ClassificationDetail student={student} course={course} data={data} />
            ),
            type: 'large'
        })
    }

    // columns
    const columns = [
        {
            Header: 'Student name',
            accessor: 'studentName',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
                return (
                    <div>
                        {original?.user?.name}
                    </div>
                );
            },
            width: '20%'
        },
        {
            Header: 'STG',
            accessor: 'stg',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
                return (
                    <div className={classNames(original?.stg?.compare === COMPARE.INCREASE && 'text-success',
                        original?.stg?.compare === COMPARE.DECREASE && 'text-danger')}>
                        <span>{original?.stg?.value} </span>
                        <span>
                            {
                                original?.stg?.compare === COMPARE.INCREASE && <i className="fas fa-long-arrow-alt-up"></i>
                            }
                            {
                                original?.stg?.compare === COMPARE.DECREASE && <i className="fas fa-long-arrow-alt-down"></i>
                            }
                        </span>
                    </div>
                );
            },
            width: '8%'
        },
        {
            Header: 'SCG',
            accessor: 'scg',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
                return (
                    <div className={classNames(original?.scg?.compare === COMPARE.INCREASE && 'text-success',
                        original?.scg?.compare === COMPARE.DECREASE && 'text-danger')}>
                        <span>{original?.scg?.value} </span>
                        <span>
                            {
                                original?.scg?.compare === COMPARE.INCREASE && <i className="fas fa-long-arrow-alt-up"></i>
                            }
                            {
                                original?.scg?.compare === COMPARE.DECREASE && <i className="fas fa-long-arrow-alt-down"></i>
                            }
                        </span>
                    </div>
                );
            },
            width: '8%'
        },
        {
            Header: 'PEG',
            accessor: 'peg',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
                return (
                    <div className={classNames(original?.peg?.compare === COMPARE.INCREASE && 'text-success',
                        original?.peg?.compare === COMPARE.DECREASE && 'text-danger')}>
                        <span>{original?.peg?.value} </span>
                        <span>
                            {
                                original?.peg?.compare === COMPARE.INCREASE && <i className="fas fa-long-arrow-alt-up"></i>
                            }
                            {
                                original?.peg?.compare === COMPARE.DECREASE && <i className="fas fa-long-arrow-alt-down"></i>
                            }
                        </span>
                    </div>
                );
            },
            width: '8%'
        },
        {
            Header: 'STR',
            accessor: 'str',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
                return (
                    <div className={classNames(original?.str?.compare === COMPARE.INCREASE && 'text-success',
                        original?.str?.compare === COMPARE.DECREASE && 'text-danger')}>
                        <span>{original?.str?.value} </span>
                        <span>
                            {
                                original?.str?.compare === COMPARE.INCREASE && <i className="fas fa-long-arrow-alt-up"></i>
                            }
                            {
                                original?.str?.compare === COMPARE.DECREASE && <i className="fas fa-long-arrow-alt-down"></i>
                            }
                        </span>
                    </div>
                );
            },
            width: '8%'
        },
        {
            Header: 'LPR',
            accessor: 'lpr',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
                return (
                    <div className={classNames(original?.lpr?.compare === COMPARE.INCREASE && 'text-success',
                        original?.lpr?.compare === COMPARE.DECREASE && 'text-danger')}>
                        <span>{original?.lpr?.value} </span>
                        <span>
                            {
                                original?.lpr?.compare === COMPARE.INCREASE && <i className="fas fa-long-arrow-alt-up"></i>
                            }
                            {
                                original?.lpr?.compare === COMPARE.DECREASE && <i className="fas fa-long-arrow-alt-down"></i>
                            }
                        </span>
                    </div>
                );
            },
            width: '8%'
        },
        {
            Header: 'Class',
            accessor: 'class',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
                return (
                    <div className={classNames(original?.class?.compare === COMPARE.INCREASE && 'text-success',
                        original?.class?.compare === COMPARE.DECREASE && 'text-danger')}>
                        <span>{original?.class?.value} </span>
                        <span>
                            {
                                original?.class?.compare === COMPARE.INCREASE && <i className="fas fa-long-arrow-alt-up"></i>
                            }
                            {
                                original?.class?.compare === COMPARE.DECREASE && <i className="fas fa-long-arrow-alt-down"></i>
                            }
                        </span>
                    </div>
                );
            },
            width: '10%'
        },
        {
            Header: 'Action',
            accessor: '',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
                return (
                    <div>
                        <i className='fas fa-eye text-success btn-icon'
                            data-bs-toggle='tooltip'
                            title={TOOLTIP.VIEW}
                            onClick={() => onShowClassificationDetail(
                                original?.user,
                                original?.course,
                                original.resultClassifyAll ?? [])} />
                    </div>
                );
            },
            width: '10%'
        }
    ]

    if (id && !isNumeric(id)) return <NotFoundScreen />;

    return (
        <div className='student-status-tab mg-t-50'>
            {
                classificationKnowledge?.length > 0 &&
                <div className='mg-b-10 fst-italic'>
                    Gần nhất: {moment(classificationKnowledge[0].createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </div>
                // <div className='mg-b-10 fst-italic'>Lastest: {moment(classificationKnowledge[0].createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
            }
            <Table
                columns={columns}
                data={classificationKnowledge}
                disablePaging={false}
                enableServerSidePaging={true}
                initialTableState={paging}
                onFetch={onFetchDataClassificationKnowledge}
                className='lst-result-classification-table'
            />
        </div>
    )
})

export default StudentStatusTab;