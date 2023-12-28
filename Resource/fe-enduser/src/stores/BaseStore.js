import { action, makeObservable, observable } from 'mobx';
import { DEFAULT_PAGE_SIZE } from '../core/configs/constants';

class BaseStore {

    defaultPaging =  {
        page: 1,
        totalPage: 0,
        totalRecord: 0,
        size: DEFAULT_PAGE_SIZE,
        sortKey: null,
        sortDir: null
    }

    paging = this.defaultPaging;

    constructor() {
        makeObservable(this, {
            paging: observable,
            setAttrObservable: action.bound,
            clean: action.bound
        })
    }

    setAttrObservable(attr, value, isMixed = false, isArray = false) {
        this[attr] = !isMixed ? value : !isArray ? { ...this[attr], ...value } : [ ...this[attr], ...value ];
    }

    clean() {
        this.paging = this.defaultPaging;
    }
}
export default BaseStore;
