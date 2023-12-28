import { observer } from 'mobx-react';
import moment from 'moment';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ReactNotifications, Table } from '../../components';
import { FORMAT_DATE_TIME, MSG, SCREEN_MODE, STATUS, STATUS_KEY_STRING, TOOLTIP } from '../../core/configs/constants';
import { useStore, useTitle } from '../../core/utils/hook';
import SettingCategoryScreen from './SettingCategoryScreen';
import { useTranslation } from 'react-i18next';

const CategoryScreen = observer(props => {

    // translation
    const { t, i18n: { language } } = useTranslation();

    // other
    useTitle(t('categoryScreen.titleDocument'));

    // store
    const { 
        categoryStore: { clean, getAllCategory, categoryList, paging, setAttrObservable, updateCategory, deleteCategory },
        modalStore: { show, hide, openWarningModal }
    } = useStore();

    // state
    const { register, handleSubmit, getValues } = useForm();

    // lifecycle
    useEffect(() => {
        clean();
        onFetchData();

        return () => {
            clean();
        }
    }, [])

    // modal
    const onShowSettingAdmin = (mode, id) => {
        show({
            id: 'modal-setting-category',
            isOpen: true,
            header: mode === SCREEN_MODE.ADD ? t('settingCategoryScreen.titleCreateCategory') : t('settingCategoryScreen.titleUpdateCategory'),
            onCancel: () => hide(),
            children: (
                <SettingCategoryScreen mode={mode} id={id}/>
            ),
            type: 'medium'
        })
    }

    const onShowConfirmChangeStatus = (id, status) => {
        const msg = status === STATUS_KEY_STRING.INACTIVE ? t('categoryScreen.confirmInactiveCategory') 
            : t('categoryScreen.confirmActiveCategory');
        openWarningModal(msg, () => onSubmitUpdate(1, id, { status }));
    }

    const onShowConfirmDeleteCategory = (id) => {
        openWarningModal(t('categoryScreen.confirmDeleteCategory') , () => onSubmitUpdate(2, id));
    }

    // function
    const onSearch = (data) => {
        clean();
        onFetchData(data);
    }

    const onFetchData = (tableData) => {
        setAttrObservable('paging', tableData, true, false);
        getAllCategory({
            ...getValues(),
            ...tableData
        })
    }

    const onSubmitUpdate = async (mode, id, payload = null) => {
        let res;
        if(mode === 1) {
            res = await updateCategory(id, payload);
        } else if (mode === 2) {
            res = await deleteCategory(id);
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
            Header: t('categoryScreen.categoryName'),
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
            width: '15%'
        },
        {
            Header: t('columnTable.status'),
            accessor: 'status',
            disableSortBy: false,
            Cell: ({ row: { original } }) => {
                return (
                    <div>
                        {STATUS[original?.status][language]}
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
                        }
                        <button
                            data-bs-toggle="tooltip"
                            title={TOOLTIP.EDIT[language]}
                            type='button'
                            className='btn-icon btn-icon-orange mg-r-10' onClick={() => onShowSettingAdmin(SCREEN_MODE.EDIT, original?.id)}>
                            <i className='fa-solid fa-pen-to-square'></i>
                        </button>
                        <button
                            data-bs-toggle="tooltip"
                            title={TOOLTIP.DELETE[language]}
                            type='button' className='btn-icon btn-icon-red mg-r-10' onClick={() => onShowConfirmDeleteCategory(original?.id)}>
                            <i className='fa-solid fa-trash-can'></i>
                        </button>
                    </div>
                );
            },
            width: '10%'
        }
    ]

    return(
        <div className='category-screen'>
            <div className='container-title'>{t('categoryScreen.titleScreen')}</div>
            <div className='container-search'>
                <form onSubmit={handleSubmit(onSearch)}>
                    <div className='row'>
                        <div className='row col-6 align-items-center'>
                            <label className='col-2-5'>{t('categoryScreen.categoryName')}</label>
                            <input {...register('name')} className='col-7' />
                        </div>
                        <div className='row col-6 justify-content-end align-items-center'>
                            <label className='col-2-5'>{t('common.status')}</label>
                            <select {...register('status')} className='col-7'>
                                <option value={''}>{t('common.all')}</option>
                                {   Object.keys(STATUS).filter(key => key != STATUS_KEY_STRING.NOT_CONFIRM).map((key, idx) =>
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
                        onClick={() => onShowSettingAdmin(SCREEN_MODE.ADD)}>
                        {t('categoryScreen.createCategory')}
                    </button>
                </div>
                <Table
                    columns={columns}
                    data={categoryList || []}
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

export default CategoryScreen;