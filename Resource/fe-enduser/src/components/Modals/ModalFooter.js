import classnames from 'classnames';
import './style.scss';

const ModalFooter = (props) => {    
    const {
        saveButtonText,
        saveButtonClass,
        onConfirm,
        onCancel,
        cancelButtonText
    } = props;
    const classButton = saveButtonClass ? saveButtonClass : 'btn-primary py-2 px-4';
    
    return (
        <div className={classnames('modal-footer')}>
            {cancelButtonText && (
                <button
                    type='button'
                    className='btn btn-secondary py-2 px-4 cancel-button'
                    data-dismiss='modal'
                    onClick={onCancel}
                >
                    {cancelButtonText}
                </button>
            )}
            <button
                type='button'
                className={`btn ${classButton}`}
                onClick={onConfirm}
            >
                {saveButtonText}
            </button>
        </div>
    );
};

export default ModalFooter;
