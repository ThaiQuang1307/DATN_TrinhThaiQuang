import './style.scss';

const PagingInfo = (props) => {

    const { tableState } = props;
    const from = tableState?.pageIndex * tableState?.pageSize;
    let to = from + tableState?.pageSize;
    if (to > tableState?.totalRecord) {
        to = tableState?.totalRecord;
    }

    return (
        <span className='paging-info'>
            {/* Display {from + 1}~{to} out of {tableState?.totalRecord} records */}
            Hiển thị {from + 1}~{to} của {tableState?.totalRecord} bản ghi
        </span>
    )
}

export default PagingInfo;