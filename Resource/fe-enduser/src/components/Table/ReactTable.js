import { toJS } from 'mobx';
import React, { forwardRef, useEffect, useRef } from 'react';
import { useTable, usePagination, useSortBy, useRowSelect } from 'react-table';
import { PAGE_SIZE_OPTIONS, TABLE_CODE, WIDTH_COLUMN_SELECT_TABLE } from '../../core/configs/constants';
import PagingInfo from './PagingInfo';
import ReactPaging from './ReactPaging';
import SelectPageSize from './SelectPageSize';
import './style.scss';

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
    const defaultRef = useRef();
    const resolvedRef = ref || defaultRef;

    useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
        <>
            <input type='checkbox' ref={resolvedRef} {...rest} />
        </>
    );
});

const isOrderByStateChange = (newState, OldState) => {
    return (
        newState.sortBy[0]?.id !== OldState?.sortBy[0]?.id ||
        newState.sortBy[0]?.desc !== OldState?.sortBy[0]?.desc
    );
}

const ReactTable = ({
    tblCode,
    columns,
    data,
    enableSelectRow,
    disableSelectionPageSize,
    disablePaging,
    disableField,
    disableFieldValue,
    element,
    customSelectedBox,
    pageIndexProp,
    changePageIndexProp,
    enableServerSidePaging,
    onFetch,
    rowClass,
    initialTableState,
    hideTableHeader,
    hideTableFooter,
    className,
    tableFooter,
    onSelectedChange,
    disabledNoData,
    isSelectedAll,
    selectedRowIds,
    disableSubRowSelect,
    lstDisabledRowSelect,
    checkedDisabledRowSelect,
    rowKey,
    getRowId
}) => {

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        rows,
        pageOptions,
        gotoPage,
        setPageSize,
        selectedFlatRows,
        toggleAllRowsSelected,
        // state: { pageIndex, pageSize },
        setSortBy,
        state
    } = useTable(
        {
            columns,
            data,
            initialState: { initialTableState, selectedRowIds},
            manualSortBy: enableServerSidePaging,
            getRowId: getRowId || ((row, relativeIndex, parent) => {
                const rowData = toJS(row);
                const rowId = rowKey && rowData ? rowData[rowKey] : relativeIndex;
                const id = parent ? [parent.id, relativeIndex].join('.') : rowId;
                return id;
            })
        },
        useSortBy,
        usePagination,
        useRowSelect,
        (hooks) => {

            hooks.visibleColumns.push((columns) => {
                return enableSelectRow ?
                    [
                        // Let's make a column for selection
                        {
                            id: 'selection',
                            width: WIDTH_COLUMN_SELECT_TABLE,
                            // The header can use the table's getToggleAllRowsSelectedProps method
                            // to render a checkbox
                            Header: (({ getToggleAllRowsSelectedProps }) => {
                                if(disableSubRowSelect && !lstDisabledRowSelect.includes(false) && !checkedDisabledRowSelect) {
                                    return (
                                        <div>
                                            <IndeterminateCheckbox
                                                disabled={true}
                                                readOnly={true}
                                            />
                                        </div>
                                    )
                                } else return (
                                    <div>
                                        <IndeterminateCheckbox
                                            {...getToggleAllRowsSelectedProps()}
                                            id={'selectedAll'}
                                        />
                                    </div>
                                )
                            }),
                            // The cell can use the individual row's getToggleRowSelectedProps method
                            // to the render a checkbox
                            Cell: ((props) => {
                                const row = props.row;
                                if (disableSubRowSelect && lstDisabledRowSelect.at(row.index)) {
                                    return (
                                        <div>
                                            <IndeterminateCheckbox
                                                disabled={true}
                                                readOnly={true}
                                                checked={checkedDisabledRowSelect}
                                            />
                                        </div>)
                                }
                                else {
                                    const rowProps = row.getToggleRowSelectedProps();
                                    return (
                                        <div>
                                            <IndeterminateCheckbox
                                                {...rowProps}
                                            />
                                        </div>
                                    )
                                }
                            })
                        },
                        ...columns
                    ] :
                    columns;
            });

        //   // disable row selected
        // if (disableSubRowSelect) {
        //   hooks.getToggleAllRowsSelectedProps = [
        //     (props, { instance }) => [
        //       props,
        //       {
        //         onChange: () => {
        //           instance.rows.forEach((row) =>
        //             row.toggleRowSelected(
        //               !instance.rows.every((row) => row.isSelected)
        //             )
        //           );
        //         },
        //         style: {cursor: 'pointer'},
        //         checked: instance.rows.every((row) => row.isSelected),
        //         title: 'Toggle All Rows Selected',
        //         indeterminate: Boolean(
        //           !instance.isAllRowsSelected &&
        //             Object.keys(instance.state.selectedRowIds).length
        //         ),
        //       },
        //     ],
        //   ];
        // }
        }
    );

    //old effect sort
    useEffect(() => {
        if (
            enableServerSidePaging && isOrderByStateChange(state, initialTableState)
        ) {
            if(data.length > 0) {
                onFetch(state);
            }
        }
    }, [
        onFetch,
        state,
        initialTableState,
        enableServerSidePaging
    ]);

    useEffect(() => {
        state.selectedRowIds = selectedRowIds;
    }, [selectedRowIds])

    // New Effect sort 
    // useEffect(() => {
    //     console.log('state:',state)
    //     if(!state?.sortBy) return;
    //     if (
    //         enableServerSidePaging
    //     ) {
    //         onFetch(state);
    //     }
    // }, [
        
    //     ///initialTableState,
    //     state?.sortBy,
    // ]);

    useEffect(() => {
        if (initialTableState) state.pageSize = Number(initialTableState.pageSize);
    }, [initialTableState]);

    useEffect(() => {
        if (enableSelectRow && onSelectedChange) {
            const rows = [];
            const tableData = toJS(data);
            Object.keys(state.selectedRowIds).forEach(idx => {
                if (rowKey && state.selectedRowIds[idx]) {
                    const row = tableData.find(item => item[rowKey] === (rowKey === 'id' ? Number(idx) : idx));
                    if (row) {
                        rows.push(row);
                    }
                } 
                if (!rowKey && state.selectedRowIds[idx]) {
                    if (tableData[Number(idx)]) {
                        rows.push(tableData[Number(idx)]);
                    }
                }
            })

            onSelectedChange(state.selectedRowIds, rows)
        }
    }, [selectedFlatRows.length])

    useEffect(() => {
        if (isSelectedAll !== null) {
            toggleAllRowsSelected(isSelectedAll);
        }
    }, [isSelectedAll])


    // Render the UI for your table
    let renderITems = disablePaging ? rows : page;
    if (data.length > 0) {
        if (pageIndexProp + 1 <= pageOptions.length) {
            if (pageIndexProp !== state.pageIndex) {
                gotoPage(pageIndexProp);
            }
        } else {
            changePageIndexProp(0);
            return '';
        }
    }
    disablePaging = disablePaging && data.length > 0;

    // Listen for changes in pagination and use the state to fetch our new data
    return (
        <div className={'react-table ' + className}>
            {!disablePaging && (
                <div className='selection-header' style={{ display: disableSelectionPageSize ? 'none' : '' }}>
                    <SelectPageSize
                        value={state.pageSize}
                        onChange={(e) => {
                            if (enableServerSidePaging) {
                                state.pageIndex = 0;
                                state.pageSize = Number(e.target.value);
                                onFetch(state);
                            } else {
                                changePageIndexProp(0);
                                setPageSize(Number(e.target.value));
                            }
                        }}
                        values={customSelectedBox ? customSelectedBox : PAGE_SIZE_OPTIONS}
                    />
                    {element}
                </div>
            )}
            <table
                {...getTableProps()}
                className='table table-bordered'
            >
                {!hideTableHeader && 
            <thead>
                {headerGroups.map((headerGroup, i) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                        {headerGroup.headers.map((column, k) => (
                            <th
                                {...column.getHeaderProps(
                                    column.canSort ? column.getSortByToggleProps({
                                        title: 'Change sort'
                                    }) : ''
                                )}
                                width={column.width}
                                key={'row_' + i + '_' + k}
                                className={
                                    'cansort_' + column.canSort + '_sorted_' + column.isSorted + ' ' + column?.headerClassName
                                }
                            >
                                {column.render('Header')}
                                {   column.canSort &&
                            <span className='mg-l-5'>
                                {
                                    column.isSorted ?
                                        column.isSortedDesc ? 
                                            <i className='fas fa-long-arrow-alt-down'></i>                                
                                            :
                                            <i className='fas fa-long-arrow-alt-up'></i>                                
                                        : 
                                        <i className='fas fa-exchange-alt fa-rotate-90'></i>
                                }
                            </span>
                                }
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
                }
                <tbody {...getTableBodyProps()}>
                    {renderITems.length > 0 &&
                renderITems.map((row, i) => {
                    prepareRow(row);
                    let customRowClass = '';
                    if (rowClass) customRowClass = rowClass(row);
                    return (
                        <tr
                            key={i}
                            className={
                                // disableFieldValue &&
                                //   row.original[disableField] !== disableFieldValue
                                //   ? 'disable ' + customRowClass
                                //   : customRowClass
                                getRowClass(tblCode, row, customRowClass, disableField, disableFieldValue)
                            }
                        >
                            {row.cells.map((cell, k) => {
                                return (
                                    <td
                                        width={cell?.column?.width}
                                        className={cell?.column?.className}
                                        {...cell.getCellProps()}
                                        key={i + '_' + k}
                                    >
                                        {cell.render('Cell')}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
                </tbody>
                <tfoot>
                    {tableFooter && tableFooter}
                </tfoot>
            </table>
            {!hideTableFooter &&
            <div className='table-footer'>
                {data.length !== 0 ? (
                    !disablePaging && (
                        <>
                            <PagingInfo
                                tableState={enableServerSidePaging ? initialTableState : state}
                            />
                            <ReactPaging
                                forcePage={enableServerSidePaging ? initialTableState.pageIndex : state.pageIndex}
                                pageCount={Math.ceil(
                                    (enableServerSidePaging ? initialTableState?.totalRecord : rows.length) / state.pageSize
                                )}
                                onPageChange={({ selected }) => {
                                    if (enableServerSidePaging) {
                                        state.pageIndex = selected;
                                        onFetch(state);
                                    } else {
                                        gotoPage(selected);
                                        changePageIndexProp(selected);
                                    }
                                }}
                            />
                        </>
                    )
                ) : (
                    <div className='table-no-data w-100'>
                        {!disabledNoData && <p>No data</p>}
                    </div>
                )}
            </div>
            }
        </div>
    );
}

function getRowClass(tblCode, row, customRowClass, disableField, disableFieldValue) {
    if (tblCode === TABLE_CODE.DOCUMENT) {
        const obj = disableField;
        if (obj.documentId != null) {
            if (obj.configFileEdition !== row.original.configFileEdition) {
                return 'disable ' + customRowClass;
            }
            if (row.original.configFileEdition === 'Item') {
                if (obj.formGroupId !== row.original.formGroupId) {
                    return 'disable ' + customRowClass;
                }
            }
            else if (obj.configFileCode !== row.original.configFileCode) {
                return 'disable ' + customRowClass;
            }
        }
    }
    else {
        if (disableFieldValue && row.original[disableField] !== disableFieldValue) {
            return 'disable ' + customRowClass;
        }
        return customRowClass;
    }
    return customRowClass;
}

export default ReactTable;
