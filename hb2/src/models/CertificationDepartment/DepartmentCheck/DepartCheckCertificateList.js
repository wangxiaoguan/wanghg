import { NormalCallRequest } from '@/utils/SystemUtil';
import { updateCheckStatus, orgSearch, search } from '@/services/CertificationDepartment/DepartmentCheck/DepartCheckCertificateListApi';

export default {
  namespace: 'DepartCheckCertificateList',
  state: {
  },
  effects: {

    *updateCheckStatus(data, funs) {
      yield NormalCallRequest(data, funs, updateCheckStatus);
    },

    *orgSearch(data, funs) {
      yield NormalCallRequest(data, funs, orgSearch);
    },

    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
    },

  },
  reducers: {

  },
}