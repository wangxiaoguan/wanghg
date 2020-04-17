import { NormalCallRequest } from '@/utils/SystemUtil';
import { remove, revoke, update, add, search, formSearch, updateCheckStatus, getIndustry } from '@/services/CertificationDepartment/DepartmentSearch/DepartmentApi';

export default {
  namespace: 'Department',
  state: {
  },
  effects: {
    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    },

    *revoke(data, funs) {
      yield NormalCallRequest(data, funs, revoke);
    },

    *update(data, funs) {
      yield NormalCallRequest(data, funs, update);
    },
    *add(data, funs) {
      yield NormalCallRequest(data, funs, add);
    },
    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
    },
    *formSearch(data, funs) {
      yield NormalCallRequest(data, funs, formSearch);
    },
    *updateCheckStatus(data, funs) {
      yield NormalCallRequest(data, funs, updateCheckStatus);
    },
    *getAllIndustry(data, funs) {
      yield NormalCallRequest(data, funs, getIndustry)
    }
  },
  reducers: {

  },
}