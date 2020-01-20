import { NormalCallRequest } from '@/utils/SystemUtil';
import {
  updateCheckStatus, updateBatchCheckStatus,
  remove, add, update, search, removeAll
} from '@/services/CertificationDepartment/DepartmentCheck/DepartCheckAbilityListApi';

export default {
  namespace: 'DepartCheckAbilityList',
  state: {
  },
  effects: {
    *updateCheckStatus(data, funs) {
      console.log('updateCheckStatus', data)
      yield NormalCallRequest(data, funs, updateCheckStatus);
    },

    *updateBatchCheckStatus(data, funs) {
      yield NormalCallRequest(data, funs, updateBatchCheckStatus);
    },


    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    },

    *removeAll(data, funs) {
      yield NormalCallRequest(data, funs, removeAll);
    },

    *add(data, funs) {
      yield NormalCallRequest(data, funs, add);
    },

    *update(data, funs) {
      yield NormalCallRequest(data, funs, update);
    },

    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
    },
  },
  reducers: {

  },
}