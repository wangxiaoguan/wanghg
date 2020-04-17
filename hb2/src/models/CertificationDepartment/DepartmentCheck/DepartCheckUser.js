import {NormalCallRequest} from '@/utils/SystemUtil';
import {search, updateCheckStatus} from '@/services/CertificationDepartment/DepartmentCheck/DepartCheckUserInfoApi';

export default {
  namespace: 'DepartCheckUser',
  state: {
  },
  effects: {
    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
    },

    *updateCheckStatus(data, funs) {
      yield NormalCallRequest(data, funs, updateCheckStatus);
    },
  },
  reducers: {

  },
}