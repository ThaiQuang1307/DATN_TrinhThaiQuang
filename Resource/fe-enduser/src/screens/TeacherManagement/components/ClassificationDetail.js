import moment from 'moment';
import { COMPARE, TOOLTIP } from '../../../core/configs/constants';
import classNames from 'classnames';
import { Table } from '../../../components';

const ClassificationDetail = (({ student, course, data }) => {

    const columns = [
        {
            Header: '#',
            accessor: 'time',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
                return (
                    <div>
                        { original?.time }
                    </div>
                );
            },
            width: '10%'
        },
        {
            Header: 'Date time',
            accessor: 'dateTime',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
                return (
                    <div>
                        { original?.dateTime ? moment(original.dateTime).format('YYYY-MM-DD HH:mm:ss') : '' }
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
            width: '10%'
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
            width: '10%'
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
            width: '10%'
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
            width: '10%'
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
            width: '10%'
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
        }
    ]

    return (
        <div className='pd-20'>
            <div className='mg-b-20'>
                <div>
                    <strong>Student name: </strong> 
                    <span>{student?.name}</span>
                </div>
                <div className='mg-t-10'>
                    <strong>Course name: </strong> 
                    <span>{course?.name}</span>
                </div>
            </div>
            <Table
                columns={columns}
                data={data}
                disablePaging={true}
                enableServerSidePaging={false}
                className='lst-result-classification-table'
            />
        </div>
    )
})

export default ClassificationDetail;