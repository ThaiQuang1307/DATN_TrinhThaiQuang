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
    const classButton = saveButtonClass ? saveButtonClass : 'btn-default-2';
    
    return (
        <div className={classnames('modal-footer')}>
            {cancelButtonText && (
                <button
                    type='button'
                    className='btn btn-default-1 cancel-button'
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
