import { NormalCallRequest } from '@/utils/SystemUtil';
import { update, remove, add, search, updateBatchCheckStatus, exportExcel } from '@/services/faultyProduct/companyRecordApi';

export default {
  namespace: 'companyRecord',
  state: {
  },
  effects: {
    *add(data, funs) {
      yield NormalCallRequest(data, funs, add);
    },
    *update(data, funs) {
      yield NormalCallRequest(data, funs, update);
    },
    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    },
    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
    },
    *updateBatchCheckStatus(data, funs) {
      yield NormalCallRequest(data, funs, updateBatchCheckStatus);
    },
    *exportExcel(data, funs) {
      yield NormalCallRequest(data, funs, exportExcel);
    }
  },
  reducers: {

  },
}