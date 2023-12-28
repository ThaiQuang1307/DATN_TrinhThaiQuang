import { observer } from 'mobx-react';
import { COMPARE, SYSTEM_PATH, TOOLTIP } from '../../../core/configs/constants';
import moment from 'moment';
import { useStore } from '../../../core/utils/hook';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Table } from '../../../components';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

const ClassificationApplication = observer(props => {

    // translation
    const { t, i18n: { language } } = useTranslation();

    // store
    const {
        categoryStore: {
            categoryOptions, getCategoryOptions
        },
        courseStore: {
            courseOptions, getAllCourseOptions
        },
        algorithmStore: {
            totalTimeClassify,
            classifyingStudentKnowledge, classificationKnowledge,
            getClassificationStudentKnowledge, paging, setAttrObservable, clean, getCountClassificationStudentKnowledge },
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

    const onClassifyingStudentKnowledge = async () => {
        await classifyingStudentKnowledge();
        onFetchDataClassificationKnowledge({ course_id: watchCourse || null, category_id: watchCategory || null });
        getCountClassificationStudentKnowledge({ course_id: watchCourse || null, category_id: watchCategory || null });
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
                        <Link to={`${SYSTEM_PATH.COURSE_MANAGEMENT}/${original?.course?.id}`}>{original?.course?.name}</Link>
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
                        <Link to={SYSTEM_PATH.STUDENT_MANAGEMENT}>{original?.user?.name}</Link>
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
                                original?.stg?.compare === COMPARE.INCREASE && <i class="fa-solid fa-up-long"></i>
                            }
                            {
                                original?.stg?.compare === COMPARE.DECREASE && <i class="fa-solid fa-down-long"></i>
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
                                original?.scg?.compare === COMPARE.INCREASE && <i class="fa-solid fa-up-long"></i>
                            }
                            {
                                original?.scg?.compare === COMPARE.DECREASE && <i class="fa-solid fa-down-long"></i>
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
                                original?.peg?.compare === COMPARE.INCREASE && <i class="fa-solid fa-up-long"></i>
                            }
                            {
                                original?.peg?.compare === COMPARE.DECREASE && <i class="fa-solid fa-down-long"></i>
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
                                original?.str?.compare === COMPARE.INCREASE && <i class="fa-solid fa-up-long"></i>
                            }
                            {
                                original?.str?.compare === COMPARE.DECREASE && <i class="fa-solid fa-down-long"></i>
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
                                original?.lpr?.compare === COMPARE.INCREASE && <i class="fa-solid fa-up-long"></i>
                            }
                            {
                                original?.lpr?.compare === COMPARE.DECREASE && <i class="fa-solid fa-down-long"></i>
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
                                original?.class?.compare === COMPARE.INCREASE && <i class="fa-solid fa-up-long"></i>
                            }
                            {
                                original?.class?.compare === COMPARE.DECREASE && <i class="fa-solid fa-down-long"></i>
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
                        <button
                            data-bs-toggle="tooltip"
                            title={TOOLTIP.VIEW[language]}
                            type='button' className='btn-icon btn-icon-green mg-r-10'
                            onClick={() => onShowClassificationDetail(
                                original?.user,
                                original?.course,
                                original.resultClassifyAll ?? [])}>
                            <i className='fa-solid fa-eye'></i>
                        </button>
                    </div>
                );
            },
            width: '10%'
        }
    ]

    return (
        <div className='classification-application'>
            <div className='container-title'>Students' knowledge classification</div>
            <div className='container-content'>
                <div className='mg-b-20 d-flex align-items-center flex-gap-20'>
                    <div>
                        <label>Category</label>
                        <select {...register('categoryId')} className='width-200 mg-l-10'>
                            <option value={''}>All</option>
                            {
                                categoryOptions?.length > 0 &&
                                categoryOptions.map(e => <option key={e.id} value={e._id}>{e.name}</option>)
                            }
                        </select>
                    </div>
                    <div>
                        <label>Course</label>
                        <select {...register('courseId')} className='width-200 mg-l-10'>
                            <option value={''}>All</option>
                            {
                                courseOptions?.length > 0 &&
                                courseOptions.map(e => <option key={e.id} value={e._id}>{e.name}</option>)
                            }
                        </select>
                    </div>
                </div>
                <div className='mg-b-10 fst-italic'>Total number of classifications: {totalTimeClassify}</div>
                {
                    classificationKnowledge?.length > 0 &&
                    <div className='mg-b-10 fst-italic'>Lastest: {moment(classificationKnowledge[0].createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
                }
                <div className='float-end'>
                    <button type={'button'} className={'btn btn-default-2 text-white'} onClick={onClassifyingStudentKnowledge}>
                        Classify students' knowledge
                    </button>
                </div>
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
        </div>
    )
})


const ClassificationDetail = (({ student, course, data }) => {

    const columns = [
        {
            Header: '#',
            accessor: 'time',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
                return (
                    <div>
                        {original?.time}
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
                        {original?.dateTime ? moment(original.dateTime).format('YYYY-MM-DD HH:mm:ss') : ''}
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
                                original?.stg?.compare === COMPARE.INCREASE && <i class="fa-solid fa-up-long"></i>
                            }
                            {
                                original?.stg?.compare === COMPARE.DECREASE && <i class="fa-solid fa-down-long"></i>
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
                                original?.scg?.compare === COMPARE.INCREASE && <i class="fa-solid fa-up-long"></i>
                            }
                            {
                                original?.scg?.compare === COMPARE.DECREASE && <i class="fa-solid fa-down-long"></i>
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
                                original?.peg?.compare === COMPARE.INCREASE && <i class="fa-solid fa-up-long"></i>
                            }
                            {
                                original?.peg?.compare === COMPARE.DECREASE && <i class="fa-solid fa-down-long"></i>
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
                                original?.str?.compare === COMPARE.INCREASE && <i class="fa-solid fa-up-long"></i>
                            }
                            {
                                original?.str?.compare === COMPARE.DECREASE && <i class="fa-solid fa-down-long"></i>
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
                                original?.lpr?.compare === COMPARE.INCREASE && <i class="fa-solid fa-up-long"></i>
                            }
                            {
                                original?.lpr?.compare === COMPARE.DECREASE && <i class="fa-solid fa-down-long"></i>
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
                                original?.class?.compare === COMPARE.INCREASE && <i class="fa-solid fa-up-long"></i>
                            }
                            {
                                original?.class?.compare === COMPARE.DECREASE && <i class="fa-solid fa-down-long"></i>
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
                    <a href={SYSTEM_PATH.STUDENT_MANAGEMENT}>{student?.name}</a>
                </div>
                <div className='mg-t-10'>
                    <strong>Course name: </strong>
                    <a href={`${SYSTEM_PATH.COURSE_MANAGEMENT}/${course?.id}`}>{course?.name}</a>
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

export default ClassificationApplication;