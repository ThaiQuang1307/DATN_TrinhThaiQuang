import ReactPaginate from 'react-paginate';

import './style.scss';

const ReactPaging = (props) => {

    const { pageCount, forcePage, t, onPageChange, breakLabel, marginPagesDisplayed, pageRangeDisplayed, className } = props;

    const paging = (ref, forcePage) => {
        const { useCustomForcePage } = props;
        if (useCustomForcePage) {
            if (ref?.state) {
                ref.setState({ selected: forcePage });
            }
        }
    }

    return(
        <ReactPaginate
            ref={(ref) => paging(ref, forcePage)}
            forcePage={forcePage}
            previousLabel='<<'
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextLabel='>>'
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            breakLabel={breakLabel === '' ? breakLabel : '...'}
            pageClassName={'page-item'}
            pageCount={pageCount}
            marginPagesDisplayed={marginPagesDisplayed === 0 ? marginPagesDisplayed : 2}
            pageRangeDisplayed={pageRangeDisplayed === 0 ? pageRangeDisplayed : 5}
            onPageChange={onPageChange}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={className ? className : 'active'}
            pageLinkClassName={'page-link'}
        />
    )
}

export default ReactPaging;