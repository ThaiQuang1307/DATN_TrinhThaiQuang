import { useTranslation } from 'react-i18next';
import './style.scss';

const PagingInfo = (props) => {

    // translation
    const { i18n } = useTranslation();

    const { tableState } = props;
    const from = tableState?.pageIndex * tableState?.pageSize;
    let to = from + tableState?.pageSize;
    if (to > tableState?.totalRecord) {
        to = tableState?.totalRecord;
    }

    return (
        <span className='paging-info'>
            {
                i18n.language === 'vi' ?
                    `Hiển thị ${from + 1}~${to} trên tổng số ${tableState?.totalRecord} bản ghi` :
                    // `Display ${from + 1}~${to} out of ${tableState?.totalRecord} records`
                    `Hiển thị ${from + 1}~${to} trên tổng số ${tableState?.totalRecord} bản ghi`
            }
        </span>
    )
}

export default PagingInfo;