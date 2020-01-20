import {NormalCallRequest} from '@/utils/SystemUtil';
import {remove, search,reply} from '@/services/wto/synthesizeManage/leaveMessageApi';

export default {
  namespace: 'leaveMessage',
  state: {
  },
  effects: {
    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    },
    *reply(data, funs) {
      yield NormalCallRequest(data, funs, reply);
    },
    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
    }
  },
  reducers: {

  },
}