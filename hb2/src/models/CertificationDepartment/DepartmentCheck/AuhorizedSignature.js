import {NormalCallRequest} from '@/utils/SystemUtil';
import {search, updateCheckStatus} from '@/services/CertificationDepartment/DepartmentCheck/AuhorizedSignatureApi';

export default {
  namespace: 'AuhorizedSignature',
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