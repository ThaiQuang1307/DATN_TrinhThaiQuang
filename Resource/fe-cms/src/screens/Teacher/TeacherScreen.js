import { observer } from 'mobx-react';
import moment from 'moment';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ReactNotifications, Table } from '../../components';
import { FORMAT_DATE_TIME, MSG, ROLE, STATUS, STATUS_KEY_STRING, SYSTEM_PATH, TEACHER_SUBJECT, TOOLTIP } from '../../core/configs/constants';
import { useStore, useTitle } from '../../core/utils/hook';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';

const TeacherScreen = observer(props => {

    // translation
    const { t, i18n: { language } } = useTranslation();

    // other
    useTitle(t('teacherScreen.titleDocument'));
    const navigate = useNavigate();

    // store
    const { 
        userStore: { clean, getAllUser, teacherList, paging, setAttrObservable, updateUser, deleteUser },
        modalStore: { hide, openWarningModal }
    } = useStore();

    // state
    const { register, handleSubmit, getValues } = useForm({ defaultValues: {
        roleId: ROLE.ROLE_TEACHER
    } });

    // lifecycle
    useEffect(() => {
        clean();
        onFetchData();
        return () => {
            clean();
        }
    }, [])
    
    const onShowConfirmChangeStatus = (id, status) => {
        const msg = status === STATUS_KEY_STRING.INACTIVE ? t('teacherScreen.confirmInactiveTeacher') :  t('teacherScreen.confirmActiveTeacher');
        openWarningModal(msg, () => onSubmitUpdate(1, id, { status }));
    }

    const onShowConfirmDeleteAccount = (id) => {
        openWarningModal(t('teacherScreen.confirmDeleteTeacher'), () => onSubmitUpdate(2, id));
    }

    // function
    const onSearch = (data) => {
        clean();
        onFetchData(data);
    }

    const onFetchData = (tableData) => {
        setAttrObservable('paging', tableData, true, false);
        getAllUser({
            ...getValues(),
            ...tableData
        })
    }

    const onSubmitUpdate = async (mode, id, payload = null) => {
        let res;
        if(mode === 1) {
            res = await updateUser(id, payload);
        } else if (mode === 2) {
            res = await deleteUser(id);
        }
        if(res) {
            ReactNotifications('success', mode === 1 ? MSG['inform.success.update'][language] : MSG['inform.success.delete'][language]);
            onFetchData();
            hide();
        } 
    }

    // columns
    const columns = [
        {
            Header: 'ID',
            accessor: 'id',
            disableSortBy: false,
            Cell: ({ row: { original } }) => {
                return (
                    <div>
                        {original?.id}
                    </div>
                );
            },
            width: '5%'
        },
        {
            Header: t('teacherScreen.fullName'),
            accessor: 'name',
            disableSortBy: false,
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
            Header: t('teacherScreen.email'),
            accessor: 'email',
            disableSortBy: false,
            Cell: ({ row: { original } }) => {
                return (
                    <div className={classNames(original?.newEmail && 'text-danger')}>
                        {original?.email}
                    </div>
                );
            },
            width: '15%'
        },
        {
            Header: t('teacherScreen.subject'),
            accessor: 'subject',
            disableSortBy: false,
            Cell: ({ row: { original } }) => {
                return (
                    <div>
                        {original?.subject && TEACHER_SUBJECT[original.subject][language]}
                    </div>
                );
            },
            width: '10%'
        },
        {
            Header: t('columnTable.status'),
            accessor: 'status',
            disableSortBy: false,
            Cell: ({ row: { original } }) => {
                return (
                    <div>
                        {STATUS[original?.status]?.[language]}
                    </div>
                );
            },
            width: '10%'
        },
        {
            Header: t('columnTable.createdAt'),
            accessor: 'created_at',
            disableSortBy: false,
            Cell: ({ row: { original } }) => {
                return (
                    <div>
                        {original?.createdAt ? moment(new Date(original?.createdAt)).format(FORMAT_DATE_TIME) : ''}
                    </div>
                );
            },
            width: '10%'
        },
        {
            Header: t('columnTable.action'),
            accessor: '',
            disableSortBy: true,
            Cell: ({ row: { original } }) => {
                return (
                    <div>
                        {   
                            original?.status !== STATUS_KEY_STRING.NOT_CONFIRM ?
                                original?.status === STATUS_KEY_STRING.INACTIVE ?
                                    <button
                                        data-bs-toggle="tooltip"
                                        title={TOOLTIP.ACTIVE[language]}
                                        type='button' className='btn-icon btn-icon-green mg-r-10' 
                                        onClick={() => onShowConfirmChangeStatus(original?.id, STATUS_KEY_STRING.ACTIVE)}>
                                        <i className='fa-solid fa-check'></i>
                                    </button>
                                    : 
                                    <button
                                        data-bs-toggle="tooltip"
                                        title={TOOLTIP.INACTIVE[language]}
                                        type='button' className='btn-icon btn-icon-red mg-r-10' 
                                        onClick={() => onShowConfirmChangeStatus(original?.id, STATUS_KEY_STRING.INACTIVE)}>
                                        <i className="fa-solid fa-ban"></i>
                                    </button>
                                :
                                <button
                                    data-bs-toggle="tooltip"
                                    type='button' className='btn-icon btn-icon-red mg-r-10 invisible'>
                                    <i className="fa-solid fa-ban"></i>
                                </button>
                        }
                        <button
                            data-bs-toggle="tooltip"
                            title={TOOLTIP.EDIT[language]}
                            type='button'
                            className='btn-icon btn-icon-orange mg-r-10'
                            onClick={() => navigate(`${SYSTEM_PATH.TEACHER_MANAGEMENT }/${original?.id}`)}>
                            <i className='fa-solid fa-pen-to-square'></i>
                        </button>
                        <button
                            data-bs-toggle="tooltip"
                            title={TOOLTIP.DELETE[language]}
                            type='button' className='btn-icon btn-icon-red mg-r-10' onClick={() => onShowConfirmDeleteAccount(original?.id)}>
                            <i className='fa-solid fa-trash-can'></i>
                        </button>
                    </div>
                );
            },
            width: '10%'
        }
    ]

    return(
        <div className='teacher-screen'>
            <div className='container-title'>{t('teacherScreen.titleScreen')}</div>
            <div className='container-search'>
                <form onSubmit={handleSubmit(onSearch)}>
                    <div className='row'>
                        <div className='row col-6 align-items-center'>
                            <label className='col-2-5'>{t('teacherScreen.fullName')}</label>
                            <input {...register('name')} className='col-7' />
                        </div>
                        <div className='row col-6 align-items-center justify-content-end align-items-center'>
                            <label className='col-2-5'>{t('teacherScreen.subject')}</label>
                            <select {...register('subject')} className='col-7'>
                                <option value={''}>{t('common.all')}</option>
                                {
                                    Object.keys(TEACHER_SUBJECT).length > 0 &&
                                    Object.keys(TEACHER_SUBJECT).map(e => <option key={e} value={e}>{TEACHER_SUBJECT[e][language]}</option>)
                                }
                            </select>
                        </div>
                    </div>
                    <div className='row mg-t-20'>
                        <div className='row col-6'>
                            <label className='col-2-5'>{t('teacherScreen.email')}</label>
                            <input {...register('email')} className='col-7' />
                        </div>
                        <div className='row col-6 justify-content-end align-items-center'>
                            <label className='col-2-5'>{t('common.status')}</label>
                            <select {...register('status')} className='col-7'>
                                <option value={''}>{t('common.all')}</option>
                                {   Object.keys(STATUS).map((key, idx) =>
                                    <option key={idx} value={key}>{STATUS[key][language]}</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className='text-center mg-t-20'>
                        <button type={'submit'} className={'btn btn-default-2 text-white width-150'}>
                            <i className='fa-solid fa-magnifying-glass'></i>
                            <span className='mg-l-10'>{t('common.search')}</span>
                        </button>
                    </div>
                </form>
            </div>
            <div className='container-content'>
                <div className='float-end'>
                    <button type={'button'} className={'btn btn-default-2 text-white mg-l-30'}
                        onClick={() => navigate(SYSTEM_PATH.TEACHER_ADD)}>
                        {t('teacherScreen.createTeacher')}
                    </button>
                </div>
                <Table
                    columns={columns}
                    data={teacherList || []}
                    disablePaging={false}
                    enableServerSidePaging={true}
                    initialTableState={paging}
                    onFetch={onFetchData}
                    className='lst-teacher-table'
                />
            </div>
        </div>
    )
})

export default TeacherScreen;