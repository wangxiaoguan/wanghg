import { NormalCallRequest } from '@/utils/SystemUtil';
import { add, search, update, remove } from '@/services/society/systemManagement/roleManageAPI';

export default {
  namespace: 'RoleManage',
  state: {},
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
  },

}