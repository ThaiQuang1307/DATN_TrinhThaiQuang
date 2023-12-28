import { action, makeAutoObservable, makeObservable, observable } from 'mobx';
import { ModalFooter } from '../components';

class ModalStore {

    instances = [];

    constructor(rootStore) {
        makeObservable(this, {
            instances: observable,
            show: action.bound,
            hide: action.bound,
            hideAll: action.bound,
            openSuccessModal: action.bound,
            openErrorModal: action.bound,
            openWarningModal: action.bound,
            openAlert: action.bound

        })
        this.rootStore = rootStore;
    }

    show(options) {
        const instance = new ModalInstance(options);
        this.instances.push(instance);
    }

    getCurrentInstance = () => {
        if (this.instances.length > 0) return this.instances.at(-1);
    };

    hide() {
        if (this.instances.length > 0) {
            this.instances.splice(-1, 1);
        }
    }

    hideAll() {
        this.instances = [];
    }

    openSuccessModal(headerTitle, msg, type = 'small') {
        this.show({
            id: 'modal-success',
            isOpen: true,
            header: headerTitle,
            onCancel: this.hide.bind(this),
            children: (
                <div className='text-center'>
                    <div key={'modal-body'} className='modal-body'>
                        <span>{msg}</span>
                    </div>
                </div>
            ),
            type: type
        });
    }

    openErrorModal(headerTitle, msg, type = 'small') {
        this.show({
            id: 'modal-err',
            isOpen: true,
            header: headerTitle,
            onCancel: this.hide.bind(this),
            children: (
                <div className='text-center'>
                    <div key={'modal-body'} className='modal-body'>
                        <span>{msg}</span>
                    </div>
                </div>
            ),
            type: type
        });
    }

    // Example for calling this function:
    // openWarningModal(msg, cb = null, headerTitle = 'Confirm', type = 'small', saveButtonText = 'OK', cancelButtonText= 'Cancel') {
    openWarningModal(msg, cb = null, headerTitle = 'Xác nhận', type = 'small', saveButtonText = 'Lưu', cancelButtonText = 'Hủy') {
        this.show({
            id: 'modal-warning',
            isOpen: true,
            header: headerTitle,
            onCancel: this.hide.bind(this),
            children: (
                <div className='text-center'>
                    <div key={'modal-body'} className='modal-body'>
                        <span style={{ 'whiteSpace': 'pre-line' }}>{msg}</span>
                    </div>
                    <ModalFooter key={'modal-footer'}
                        saveButtonText={saveButtonText}
                        onConfirm={() => {
                            this.hide();
                            cb && cb();
                        }}
                        cancelButtonText={cancelButtonText}
                        onCancel={this.hide.bind(this)}
                    />
                </div>
            ),
            type: type
        });
    }

    openAlert(msg, cb, type = 'small', saveButtonText = 'Lưu', isHTML = false) {
        this.show({
            id: 'modal-alert',
            isOpen: true,
            notButtonX: true,
            header: null,
            onCancel: this.hide.bind(this),
            onRequestClose: this.hide.bind(this),
            children: (
                <div className='text-center'>
                    <div key={'modal-body'} className='modal-body pd-t-40 pd-b-15'>
                        {
                            !isHTML ?
                                <span style={{ 'whiteSpace': 'pre-line' }}>{msg}</span>
                                :
                                <div dangerouslySetInnerHTML={{ __html: msg }}></div>
                        }
                    </div>
                    <ModalFooter key={'modal-footer'}
                        saveButtonText={saveButtonText}
                        onConfirm={() => {
                            this.hide();
                            cb && cb();
                        }}
                    />
                </div>
            ),
            type: type
        });
    }
}

class ModalInstance {

    id = '';
    isOpen = false;
    onAfterOpen = () => { };
    onRequestClose = () => { };
    contentLabel = '';
    header = '';
    saveButtonText = '';
    cancelButtonText = '';
    saveButtonClass = '';
    onConfirm = () => { };
    onCancel = () => { };
    children = null;
    type = '';
    notButtonX = true;

    constructor(options) {
        makeAutoObservable(this);
        this.id = options.id;
        this.isOpen = options.isOpen;
        this.onAfterOpen = options.onAfterOpen;
        this.onRequestClose = options.onRequestClose;
        this.contentLabel = options.contentLabel;
        this.header = options.header;
        this.saveButtonText = options.saveButtonText;
        this.cancelButtonText = options.cancelButtonText;
        this.saveButtonClass = options.saveButtonClass;
        this.onConfirm = options.onConfirm;
        this.onCancel = options.onCancel;
        this.children = options.children;
        this.type = options.type;
        this.notButtonX = options.notButtonX;
    }
}

export default ModalStore;