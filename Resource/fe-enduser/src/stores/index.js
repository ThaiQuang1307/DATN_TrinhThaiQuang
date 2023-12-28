import ApiStore from './ApiStore';
import AuthStore from './AuthStore';
import CategoryStore from './CategoryStore';
import CourseStore from './CourseStore';
import ModalStore from './ModalStore';
import UserStore from './UserStore';

class RootStore {

    constructor() {
        this.modalStore = new ModalStore(this);
        this.apiStore = new ApiStore(this);
        this.authStore = new AuthStore(this);
        this.categoryStore = new CategoryStore(this);
        this.userStore = new UserStore(this);
        this.courseStore = new CourseStore(this);
    }
}

export default RootStore;