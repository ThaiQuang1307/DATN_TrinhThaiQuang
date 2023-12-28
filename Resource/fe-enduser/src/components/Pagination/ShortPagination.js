import React from 'react';
import classnames from 'classnames';
import './style.scss';

class ShortPagination extends React.Component {

    onNext = () => {
        if(this.props.currentPage >= Math.ceil(this.props.totalRecords / this.props.pageSize)) return;
        if(this.props.onPageChange) {
            this.props.onPageChange(this.props.currentPage + 1);
        }
    }

    onPrevious = () => {
        if(this.props.currentPage <= 1) return;
        if(this.props.onPageChange) {
            this.props.onPageChange(this.props.currentPage - 1);
        }
    }
    
    shouldComponentUpdate = (nextProps) => {
        if(this.props.currentPage !== nextProps.currentPage) return true;
        if(this.props.totalRecords !== nextProps.totalRecords) return true;
        if(this.props.pageSize !== nextProps.pageSize) return true;
        return false;
    }

    render() {

        const {
            currentPage,
            totalRecords,
            pageSize,
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
        } = this.props;

        if(currentPage === 0) {
            return null;
        }

        const totalPage = Math.ceil(totalRecords / pageSize);
        const isFirstPage = currentPage === 1;
        const isLastPage = currentPage === totalPage;

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
                    onClick={this.onPrevious}>
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
                    onClick={this.onNext}
                >
                    <button className={classnames('page-link page-btn', 
                        { [nextLinkClassName] : nextLinkClassName },
                        { [disabledLinkClassName] : isLastPage && disabledLinkClassName})}>
                        {nextLabel}</button>
                </li>
            </ul>
        )
    }
}

export default ShortPagination;