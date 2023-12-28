import ApiStore from './ApiStore';
import AuthStore from './AuthStore';
import ModalStore from './ModalStore';
import AlgorithmStore from './AlgorithmStore';
import PermissionStore from './PermissionStore';
import UserStore from './UserStore';
import CourseStore from './CourseStore';
import CategoryStore from './CategoryStore';


class RootStore {

    constructor() {
        this.modalStore = new ModalStore(this);
        this.apiStore = new ApiStore(this);
        this.authStore = new AuthStore(this);
        this.algorithmStore = new AlgorithmStore(this);
        this.permissionStore = new PermissionStore(this);
        this.userStore = new UserStore(this);
        this.categoryStore = new CategoryStore(this);
        this.courseStore = new CourseStore(this);
    }
}

export default RootStore;