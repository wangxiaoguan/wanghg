import {NormalCallRequest} from '@/utils/SystemUtil';
import {search, updateCheckStatus} from '@/services/CertificationDepartment/DepartmentCheck/DepartCheckInstrumentApi';

export default {
  namespace: 'DepartCheckInstrument',
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