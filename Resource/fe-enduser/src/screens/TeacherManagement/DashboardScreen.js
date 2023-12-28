import { observer } from 'mobx-react';
import { useForm } from 'react-hook-form';
import { useStore } from '../../core/utils/hook';
import { useEffect } from 'react';
import classNames from 'classnames';
import { COMPARE, TOOLTIP } from '../../core/configs/constants';
import ClassificationDetail from './components/ClassificationDetail';
import { Table } from '../../components';
import ChartClassificationKnowledge from './components/ChartClassificationKnowledge';
import ChartRateOfStudentLearningProgress from './components/ChartRateOfStudentLearningProgress';

const DashboardScreen = observer(props => {

    // store
    const {
        categoryStore: {
            categoryOptions, getCategoryOptions
        },
        courseStore: {
            courseOptions, getAllCourseOptions,
            classificationKnowledge,
            getClassificationStudentKnowledge, paging, setAttrObservable, clean, getCountClassificationStudentKnowledge
        },
        modalStore: { show, hide }
    } = useStore();

    // state
    const { register, formState: { errors, isSubmitting }, watch, setValue } = useForm();
    const watchCategory = watch('categoryId');
    const watchCourse = watch('courseId');

    // lifecycle
    useEffect(() => {
        clean();

        return () => {
            clean();
        }
    }, [])

    useEffect(() => {
        getCategoryOptions({ short: true });
    }, [])

    useEffect(() => {
        setValue('courseId', '');
        getAllCourseOptions({ short: true, categoryId: watchCategory || null });
    }, [watchCategory])

    useEffect(() => {
        onFetchDataClassificationKnowledge({ course_id: watchCourse || null, category_id: watchCategory || null, page: 1 });
        getCountClassificationStudentKnowledge({ course_id: watchCourse || null, category_id: watchCategory || null });
    }, [watchCourse, watchCategory])

    // function
    const onFetchDataClassificationKnowledge = (tableData) => {
        setAttrObservable('paging', tableData, true, false);
        getClassificationStudentKnowledge({
            ...tableData,
            course_id: watchCourse || null,
            category_id: watchCategory || null
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
            Header: 'Course name',
            accessor: 'courseName',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
                return (
                    <div>
                        {original?.course?.name}
                    </div>
                );
            },
            width: '20%'
        },
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

    return (
        <div className='dashboard-screen'>
            {/* <h3 className='text-primary'>Students' knowledge classification</h3> */}
            <h3 className='text-primary'>Thống kê</h3>
            <div className='mg-t-20 d-flex align-items-center flex-gap-20'>
                <div className='control-group d-flex align-items-center'>
                    {/* <label>Category</label> */}
                    <label>Danh mục</label>
                    <select {...register('categoryId')} className='width-200 mg-l-10 pd-0 form-control'>
                        {/* <option value={''}>All</option> */}
                        <option value={''}>Tất cả</option>
                        {
                            categoryOptions?.length > 0 &&
                            categoryOptions.map(e => <option key={e.id} value={e._id}>{e.name}</option>)
                        }
                    </select>
                </div>
                <div className='control-group d-flex align-items-center'>
                    {/* <label>Course</label> */}
                    <label>Khóa học</label>
                    <select {...register('courseId')} className='width-200 mg-l-10 pd-0 form-control'>
                        {/* <option value={''}>All</option> */}
                        <option value={''}>Tất cả</option>
                        {
                            courseOptions?.length > 0 &&
                            courseOptions.map(e => <option key={e.id} value={e._id}>{e.name}</option>)
                        }
                    </select>
                </div>
            </div>
            {/* <div className='mg-t-30'>
                <Table
                    columns={columns}
                    data={classificationKnowledge}
                    disablePaging={false}
                    enableServerSidePaging={true}
                    initialTableState={paging}
                    onFetch={onFetchDataClassificationKnowledge}
                    className='lst-result-classification-table'
                />
            </div> */}
            <div className='mg-t-50 row'>
                {/* <div className='col-6'>
                    <ChartClassificationKnowledge />
                </div> */}
                <div className='col-6'>
                    <ChartRateOfStudentLearningProgress />
                </div>
            </div>
        </div>
    )
})

export default DashboardScreen;