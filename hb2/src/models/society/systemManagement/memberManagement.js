import {NormalCallRequest} from '@/utils/SystemUtil';
import {remove, reset, update, add, search, updateCheckStatus, getRoleInfoList} from '@/services/society/systemManagement/memberManagementApi';

export default {
  namespace: 'memberManagement',
  state: {
  },
  effects: {
    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    },
    *reset(data, funs) {
      yield NormalCallRequest(data, funs, reset);
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
    *updateCheckStatus(data, funs) {
      yield NormalCallRequest(data, funs, updateCheckStatus);
    },
    *getRoleInfoList(data, funs) {
      yield NormalCallRequest(data, funs, getRoleInfoList);
    }
  },
  reducers: {

  },
}