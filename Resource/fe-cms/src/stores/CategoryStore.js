import { flow, makeObservable, observable } from 'mobx';
import { CategoryApi } from '../apis';
import BaseStore from './BaseStore';

class CategoryStore extends BaseStore {

    // list
    categoryList = [];
    categoryOptions = [];

    category = {};

    constructor(rootStore) {
        super();
        makeObservable(this, {
            categoryList: observable,
            categoryOptions: observable,
            category: observable,
            getAllCategory: flow.bound,
            getCategoryOptions: flow.bound,
            createCategory: flow.bound,
            getCategory: flow.bound,
            updateCategory: flow.bound,
            deleteCategory: flow.bound
        })
        this.rootStore = rootStore;
        this.api = new CategoryApi();
    }

    *getAllCategory(searchParams) {
        try {
            const { size, page, sortDir, sortKey } = this.paging;
            const payload = { size, page, sortDir, sortKey, ...searchParams };
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getAllCategory, payload);
            if(res?.ok) {
                this.categoryList = res?.data?.elements || [];
                this.setAttrObservable('paging', res?.data?.paginate, true, false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    *getCategoryOptions(searchParams) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getAllCategory, searchParams);
            if(res?.ok) {
                this.categoryOptions = res?.data?.elements || [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    *createCategory(payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.createCategory, payload);
            if(res?.ok) {
                return res?.data || true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *getCategory(id, payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.getCategory, { id, payload });
            if(res?.ok) {
                this.category = res?.data ?? {};
            }
        } catch (error) {
            console.log(error);
        }
    }

    *updateCategory(id, payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.updateCategory, { id, payload } );
            if(res?.ok) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    *deleteCategory(id, payload) {
        try {
            const res = yield this.rootStore.apiStore.call(this.api, this.api.deleteCategory, { id, payload });
            if(res?.ok) {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    }

    clean() {
        super.clean();
        this.categoryList = [];
    }
}

export default CategoryStore;