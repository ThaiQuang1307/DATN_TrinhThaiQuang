import usePagination from './usePagination';
import classnames from 'classnames';
import { memo } from 'react';

const FullPagination = (props) => {

    const {
        currentPage,
        totalRecords,
        siblingCount = 1,
        pageSize,
        onPageChange,
        previousLabel = 'Previous',
        nextLabel = 'next',
        breakLabel = '...',
        containerClassName,
        pageClassName,
        pageLinkClassName,
        previousClassName,
        previousLinkClassName,
        nextClassName,
        nextLinkClassName,
        breakClassName,
        breakLinkClassName,
        activeClassName,
        activeLinkClassName,
        disabledClassName,
        disabledLinkClassName
    } = props;

    const paginationRange = usePagination({currentPage,
        totalRecords,
        siblingCount,
        pageSize,
        breakLabel});

    if(currentPage === 0 || paginationRange.length < 2) {
        return null
    }

    const lastPage = paginationRange[paginationRange.length - 1];
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === lastPage;

    const onNext = () => {
        if(currentPage >= Math.ceil(totalRecords / pageSize)) return;
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

    const changePage = (page) => {
        if(onPageChange) {
            onPageChange(page);
        }
    }

    return (
        totalRecords && 
        <ul className={classnames('pagination full-pagination', 
            { [containerClassName]: containerClassName })}>
            <li
                className={classnames('page-item', 
                    { [pageClassName] : pageClassName } , 
                    { [previousClassName] : previousClassName }, 
                    { [disabledClassName] : isFirstPage && disabledClassName },
                    { 'disabled': isFirstPage })}
                onClick={onPrevious}>
                <button className={classnames('page-link', 
                    { [pageLinkClassName] : pageLinkClassName }, 
                    { [previousLinkClassName] : previousLinkClassName },
                    { [disabledLinkClassName] :  isFirstPage && disabledLinkClassName})}>
                    {previousLabel}</button>
            </li>
            {paginationRange.map((pageNumber, index) => {
                if (pageNumber === breakLabel) {
                    return <li key={index} className={classnames('page-item', 
                        { [pageClassName] : pageClassName } , 
                        { [breakClassName] : breakClassName })}>
                        <button className={classnames('page-link', 
                            { [pageLinkClassName] :  pageLinkClassName }, 
                            { [breakLinkClassName] : breakLinkClassName })}>
                            {breakLabel}</button>
                    </li>;
                }
                
                const isCurrentPage = pageNumber === currentPage;

                return (
                    <li
                        key={index}
                        className={classnames('page-item' , 
                            { [pageClassName] : pageClassName } , 
                            { [activeClassName] :  isCurrentPage && activeClassName },
                            {
                                'active': isCurrentPage
                            })}
                        onClick={() => changePage(pageNumber)}
                    >
                        <button className={classnames('page-link', 
                            { [pageLinkClassName] : pageLinkClassName },
                            { [activeLinkClassName] : isCurrentPage && activeLinkClassName })}>
                            {pageNumber}</button>
                    </li>
                );
            })}
            <li
                className={classnames('page-item', 
                    { [pageClassName] : pageClassName }, 
                    { [nextClassName] : nextClassName } , 
                    { [disabledClassName] : isLastPage && disabledClassName },
                    { 'disabled': isLastPage})}
                onClick={onNext}
            >
                <button className={classnames('page-link', 
                    { [nextLinkClassName] : nextLinkClassName },
                    { [disabledLinkClassName] : isLastPage && disabledLinkClassName})}>
                    {nextLabel}</button>
            </li>
        </ul>
    )
}

export default memo(FullPagination, (prevProps, nextProps) => {
    if(prevProps.currentPage !== nextProps.currentPage ||
    prevProps.totalRecords !== nextProps.totalRecords ||
    prevProps.pageSize !== nextProps.pageSize) return false;
    return true;
})