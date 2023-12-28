import { observer } from 'mobx-react';
import { useStore } from '../../core/utils/hook';
import Modal from 'react-modal';
import { toJS } from 'mobx';
import ModalContent from './ModalContent';
import './style.scss';

const ReactModal = observer(() => {

    const { modalStore: { instances } } = useStore();

    return(
        <div>
            {(instances || []).map((item, index) => {
                return <RenderInstance key={item.id || index} instance={item} index={index} />;
            })}
        </div>
    )
})

const RenderInstance = observer(({ instance }) => {
    
    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
        }
    };
    const {
        isOpen,
        onAfterOpen,
        onRequestClose,
        contentLabel,
        header,
        saveButtonText,
        cancelButtonText,
        saveButtonClass,
        onConfirm,
        onCancel,
        children,
        type,
        notButtonX,
        id
    } = toJS(instance);
    const classN = 'modal-' + type ?? 'modal-content';
    return (
        <Modal
            isOpen={isOpen}
            onAfterOpen={onAfterOpen}
            onRequestClose={onRequestClose}
            style={customStyles}
            contentLabel={contentLabel}
            ariaHideApp={false}
            id={id}
        >
            <input type='hidden' value='prayer' />
            <ModalContent
                header={header}
                saveButtonText={saveButtonText}
                cancelButtonText={cancelButtonText}
                saveButtonClass={saveButtonClass}
                onConfirm={onConfirm}
                onCancel={onCancel}
                classN={classN}
                notButtonX={notButtonX}
            >
                {children}
            </ModalContent>
        </Modal>
    );
})

export default ReactModal;