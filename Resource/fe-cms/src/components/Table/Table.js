import { useState } from 'react';
import ReactTable from './ReactTable';

import './style.scss';

const Table = (props) => {

    const {
        tblCode,
        columns,
        data,
        rowClass,
        element,
        customSelectedBox,
        hideTableHeader,
        hideTableFooter,
        enableSelectRow,
        disableSelectionPageSize,
        disablePaging = false,
        disableField,
        disableFieldValue = null,
        enableServerSidePaging = false,
        initialTableState,
        className,
        tableFooter,
        onSelectedChange,
        disabledNoData = false,
        isSelectedAll = null,
        selectedRowIds = {},
        disableSubRowSelect = false,
        lstDisabledRowSelect = [],
        checkedDisabledRowSelect = false,
        onFetch,
        rowKey,
        getRowId
    } = props;

    const [ pageIndex, setPageIndex ] = useState(0);

    const tranformTableStateToServerState = (tableState) => {
        const newState = {
            page: tableState.pageIndex + 1,
            size: tableState.pageSize,
            sortKey: tableState.sortBy[0]?.id,
            sortDir: tableState.sortBy[0] ?
                tableState.sortBy[0]?.desc ?
                    'DESC' :
                    'ASC' :
                null
        };
        onFetch(newState);
    };

    const tranformServerStateToTableState = (initialTableState) => {
        return initialTableState ?
            {
                pageIndex: initialTableState.page - 1,
                totalPage: initialTableState.totalPage,
                totalRecord: initialTableState.totalRecord,
                pageSize: initialTableState.size,
                sortBy: initialTableState.sortKey ?
                    [
                        {
                            id: initialTableState.sortKey,
                            desc: initialTableState.sortDir === 'DESC'
                        }
                    ] :
                    []
            } :
            null;
    };

    return(
        <ReactTable
            tblCode={tblCode}
            element={element}
            customSelectedBox={customSelectedBox}
            columns={columns}
            data={data}
            hideTableHeader={hideTableHeader}
            hideTableFooter={hideTableFooter}
            enableSelectRow={enableSelectRow}
            disableSelectionPageSize={disableSelectionPageSize}
            disableFieldValue={disableFieldValue}
            disableField={disableField}
            disablePaging={disablePaging}
            pageIndexProp={pageIndex}
            rowClass={rowClass}
            changePageIndexProp={(pageIndex) => {
                setPageIndex({ pageIndex });
            }}
            enableServerSidePaging={enableServerSidePaging}
            onFetch={tranformTableStateToServerState}
            initialTableState={tranformServerStateToTableState(
                initialTableState
            )}
            className={className}
            tableFooter={tableFooter}
            onSelectedChange={onSelectedChange}
            disabledNoData={disabledNoData}
            isSelectedAll={isSelectedAll}
            selectedRowIds={selectedRowIds}
            disableSubRowSelect={disableSubRowSelect}
            lstDisabledRowSelect={lstDisabledRowSelect}
            checkedDisabledRowSelect={checkedDisabledRowSelect}
            rowKey={rowKey}
            getRowId={getRowId}
        />
    )
}

export default Table;