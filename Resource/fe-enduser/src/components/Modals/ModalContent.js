import classnames from 'classnames';
import './style.scss';

const ModalContent = (props) => {
    const {
        header,
        onCancel,
        classN,
        children,
        notButtonX
    } = props;

    return (
        <div className={classnames('modal modal-content', classN)}>
            {!notButtonX && (
                <div className='modal-header'>
                    <h4 className='modal-title'>{header}</h4>
                    <button
                        type='button'
                        className='close'
                        data-bs-dismiss='modal'
                        aria-label='Close'
                        onClick={onCancel}
                    >
                        <span aria-hidden='true'>&times;</span>
                    </button>
                </div>
            )}
            {children}
        </div>
    );
}

export default ModalContent;