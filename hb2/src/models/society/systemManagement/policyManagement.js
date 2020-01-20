import { NormalCallRequest } from '@/utils/SystemUtil';
import { remove, update, add, search, updateBatchStatus } from '@/services/society/systemManagement/policyManagementApi';

export default {
  namespace: 'policyManagement',
  state: {
  },
  effects: {
    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
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
    *updateBatchStatus(data, funs) {
      yield NormalCallRequest(data, funs, updateBatchStatus);
    }
  },
  reducers: {

  },
}