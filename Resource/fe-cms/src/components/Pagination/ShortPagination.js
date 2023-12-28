
import classnames from 'classnames';
import { memo } from 'react';
import './style.scss';

const ShortPagination = (props) => {

    const {
        currentPage,
        totalRecords,
        pageSize,
        onPageChange,
        previousLabel = 'Previous',
        nextLabel = 'next',
        containerClassName,
        pageClassName,
        pageLinkClassName,
        pageViewCLassName,
        pageViewLinkClassName,
        previousClassName,
        previousLinkClassName,
        nextClassName,
        nextLinkClassName,
        disabledClassName,
        disabledLinkClassName
    } = props;

    if(currentPage === 0) {
        return null;
    }

    const totalPage = Math.ceil(totalRecords / pageSize);
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPage;

    const onNext = () => {
        if(currentPage >= totalPage) return;
        if(onPageChange) {
            onPageChange(currentPage + 1);
        }
    }

    const onPrevious = () => {
        if(currentPage <= 1) return;
        if(onPageChange) {
            onPageChange(currentPage - 1);
        }
    }

    return (
        totalRecords && 
        <ul className={classnames('pagination short-pagination', 
            { [containerClassName]: containerClassName })}>
            <li
                className={classnames('page-item', 
                    { [pageClassName] : pageClassName } , 
                    { [previousClassName] : previousClassName }, 
                    { [disabledClassName] : isFirstPage && disabledClassName },
                    { 'disabled': isFirstPage })}
                onClick={onPrevious}>
                <button className={classnames('page-link page-btn', 
                    { [pageLinkClassName] : pageLinkClassName }, 
                    { [previousLinkClassName] : previousLinkClassName },
                    { [disabledLinkClassName] :  isFirstPage && disabledLinkClassName})}>
                    {previousLabel}</button>
            </li>
            <li className={classnames('page-item', 
                { [pageClassName] : pageClassName },
                { [pageViewCLassName] : pageViewCLassName })}>
                <div className={classnames('page-link', 
                    { [pageLinkClassName] : pageLinkClassName },
                    { [pageViewLinkClassName] : pageViewLinkClassName })}>
                    { currentPage }/{ totalPage }   
                </div>
            </li>
            <li
                className={classnames('page-item', 
                    { [pageClassName] : pageClassName }, 
                    { [nextClassName] : nextClassName } , 
                    { [disabledClassName] : isLastPage && disabledClassName },
                    { 'disabled': isLastPage})}
                onClick={onNext}
            >
                <button className={classnames('page-link page-btn', 
                    { [nextLinkClassName] : nextLinkClassName },
                    { [disabledLinkClassName] : isLastPage && disabledLinkClassName})}>
                    {nextLabel}</button>
            </li>
        </ul>
    )
}

export default memo(ShortPagination, (prevProps, nextProps) => {
    if(prevProps.currentPage !== nextProps.currentPage ||
    prevProps.totalRecords !== nextProps.totalRecords ||
    prevProps.pageSize !== nextProps.pageSize) return false;
    return true;
})