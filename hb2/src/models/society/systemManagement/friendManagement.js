import { NormalCallRequest } from '@/utils/SystemUtil';
import { remove, update, add, search, updateCheckStatus } from '@/services/society/systemManagement/friendManagementApi';

export default {
  namespace: 'friendManagement',
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
  },
  reducers: {

  },
}