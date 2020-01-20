import {NormalCallRequest} from '@/utils/SystemUtil';
import {update, add, search, updateCheckStatus, exportExcel} from '@/services/CertificationDepartment/JudgeApi';

export default {
  namespace: 'Judge',
  state: {
  },
  effects: {
    *update(data, funs) {
      yield NormalCallRequest(data, funs, update);
    },
    *add(data, funs) {
      yield NormalCallRequest(data, funs, add);
    },
    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
    },
    *updateCheckStatus(data, funs) {
      yield NormalCallRequest(data, funs, updateCheckStatus);
    },
    *exportExcel(data, funs) {
      yield NormalCallRequest(data, funs, exportExcel);
    }
  },
  reducers: {

  },
}