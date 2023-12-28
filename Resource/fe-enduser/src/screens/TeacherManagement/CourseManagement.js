import { observer } from 'mobx-react';
import { MSG, STATUS, STATUS_STRING, SYSTEM_PATH, TOOLTIP } from '../../core/configs/constants';
import { ReactNotifications, Table } from '../../components';
import { useForm } from 'react-hook-form';
import { useStore } from '../../core/utils/hook';
import { useEffect } from 'react';
import moment from 'moment';
import { Link, useNavigate } from 'react-router-dom';

const CourseManagement = observer(props => {

    // other
    const navigate = useNavigate();

    // store
    const {
        categoryStore: { categoryOptions, getCategoryOptions },
        courseStore: { getAllCourseForTeacherManagement, clean, courseList, paging, setAttrObservable, updateCourse, deleteCourse },
        modalStore: { openWarningModal, hide }
    } = useStore();

    // state
    const { register, handleSubmit, formState: { errors, isSubmitting }, getValues, setValue, trigger } = useForm();

    // lifecycle
    useEffect(() => {
        clean();
        getCategoryOptions({ short: true });
        onFetchData();

        return () => {
            clean();
        }
    }, [])

    // modal
    const onShowConfirmChangeStatus = (id, status) => {
        // const msg = status === STATUS.INACTIVE ? 'Confirm lock course?' : 'Confirm unlock course?';
        const msg = status === STATUS.INACTIVE ? 'Xác nhận đóng khóa học này?' : 'Xác nhận mở khóa học này?';
        openWarningModal(msg, () => onSubmitUpdate(1, id, { status }));
    }

    // function
    const onSearch = (data) => {
        clean();
        onFetchData(data);
    }

    const onFetchData = (tableData) => {
        setAttrObservable('paging', tableData, true, false);
        getAllCourseForTeacherManagement({
            ...getValues(),
            ...tableData
        })
    }

    const onSubmitUpdate = async (mode, id, payload = null) => {
        let res;
        if (mode === 1) {
            res = await updateCourse(id, payload, true);
        } else if (mode === 2) {
            res = await deleteCourse(id);
        }
        if (res) {
            ReactNotifications('success', mode === 1 ? MSG['inform.success.update'] : MSG['inform.success.delete']);
            onFetchData();
            hide();
        }
    }

    // columns
    const columns = [
        {
            // Header: '#',
            Header: 'STT',
            accessor: 'id',
            disableSortBy: true,
            Cell: ({ initialState, row }) => {
                return (
                    <div>
                        {initialState?.initialTableState?.pageSize * initialState?.initialTableState?.pageIndex + row.index + 1}
                    </div>
                );
            },
            width: '5%'
        },
        {
            // Header: 'Name',
            Header: 'Tên khóa học',
            accessor: 'name',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
                return (
                    <div>
                        {original?.name}
                    </div>
                );
            },
            width: '15%'
        },
        {
            // Header: 'Category',
            Header: 'Danh mục',
            accessor: 'category_id',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
                return (
                    <div>
                        {original?.category?.name}
                    </div>
                );
            },
            width: '15%'
        },
        {
            // Header: 'Number of students',
            Header: 'Số lượng học viên',
            accessor: 'number_student',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
                return (
                    <div className='link-a-custom' onClick={() => navigate(`/course-information/${original?.id}`)}>
                        {original?.numberStudents ?? 0}
                    </div>
                );
            },
            width: '10%'
        },
        {
            // Header: 'Status',
            Header: 'Trạng thái',
            accessor: 'status',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
                return (
                    <div>
                        {STATUS_STRING[original?.status]}
                    </div>
                );
            },
            width: '10%'
        },
        {
            // Header: 'Created',
            Header: 'Thời gian tạo',
            accessor: 'created_at',
            disableSortBy: false,
            Cell: ({ row: { original } }) => {
                return (
                    <div>
                        {original?.createdAt && moment(original?.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                    </div>
                );
            },
            width: '10%'
        },
        {
            // Header: 'Action',
            Header: 'Hành động',
            accessor: '',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
                return (
                    <div className='d-flex align-items-center justify-content-center flex-gap-15'>
                        {
                            original?.status === STATUS.INACTIVE ?
                                <i className='fas fa-check-circle text-success btn-icon'
                                    data-bs-toggle='tooltip'
                                    title={TOOLTIP.ACTIVE}
                                    onClick={() => onShowConfirmChangeStatus(original?.id, STATUS.ACTIVE)} />
                                :
                                <i className='fas fa-ban text-danger btn-icon'
                                    data-bs-toggle='tooltip'
                                    title={TOOLTIP.INACTIVE}
                                    onClick={() => onShowConfirmChangeStatus(original?.id, STATUS.INACTIVE)} />
                        }
                        <i className='fas fa-info-circle text-warning btn-icon'
                            data-bs-toggle='tooltip'
                            title={TOOLTIP.INFO}
                            onClick={() => navigate(`/course-information/${original?.id}`)} />
                    </div>
                );
            },
            width: '10%'
        }
    ]

    return (
        <div className='course-management-screen'>
            <div className='wrapper-search'>
                <form onSubmit={handleSubmit(onSearch)}>
                    <div className='d-flex'>
                        <div className='control-group d-flex col-6 pd-0 align-items-center'>
                            {/* <label className='col-3 pd-0'>Course name</label> */}
                            <label className='col-3 pd-0'>Tên khóa học</label>
                            <input {...register('name')} type='text' className='col-7 pd-0 form-control' />
                        </div>
                        <div className='control-group d-flex col-6 pd-0 justify-content-end align-items-center'>
                            {/* <label className='col-3 pd-0'>Status</label> */}
                            <label className='col-3 pd-0'>Trạng thái</label>
                            <select {...register('status')} className='col-7 pd-0 form-control'>
                                {/* <option value={''}>All</option> */}
                                <option value={''}>Tất cả</option>
                                {Object.keys(STATUS).filter(key => STATUS[key] !== STATUS.NOT_CONFIRM).map((key, idx) =>
                                    <option key={idx} value={STATUS[key]}>{STATUS_STRING[STATUS[key]]}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className='d-flex mg-t-30'>
                        <div className='control-group d-flex col-6 pd-0 align-items-center'>
                            {/* <label className='col-3 pd-0'>Category</label> */}
                            <label className='col-3 pd-0'>Danh mục</label>
                            <select {...register('categoryId')} className='col-7 pd-0 form-control'>
                                {/* <option value={''}>All</option> */}
                                <option value={''}>Tất cả</option>
                                {
                                    categoryOptions?.length > 0 &&
                                    categoryOptions.map(e => <option key={e.id} value={e._id}>{e.name}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div className='text-center mg-t-30'>
                        <button type={'submit'} className={'btn btn-primary px-4 py-2'}>
                            <i className='fas fa-magnifying-glass'></i>
                            {/* <span className='mg-l-10'>Search</span> */}
                            <span className='mg-l-10'>Tìm kiếm</span>
                        </button>
                    </div>
                </form>
            </div>
            <div className='wrapper-content-with-side-bar'>
                <div className='float-right'>
                    <button type={'button'} className={'btn btn-primary px-4 py-2 mg-b-10'}
                        onClick={() => navigate(SYSTEM_PATH.COURSE_ADD)}>
                        {/* Create new course */}
                        Tạo mới khóa học
                    </button>
                </div>
                <Table
                    columns={columns}
                    data={courseList}
                    disablePaging={false}
                    enableServerSidePaging={true}
                    initialTableState={paging}
                    onFetch={onFetchData}
                    className='lst-admin-table'
                />
            </div>
        </div>
    )
})

export default CourseManagement;