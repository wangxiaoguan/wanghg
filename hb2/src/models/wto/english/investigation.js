import {NormalCallRequest} from '@/utils/SystemUtil';
import {remove, update, add, search, stick, updateCheckStatus} from '@/services/wto/english/investigationApi';

export default {
  namespace: 'investigation',
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

    *stick(data, funs) {
      yield NormalCallRequest(data, funs, stick);
    },

    *updateCheckStatus(data, funs) {
      yield NormalCallRequest(data, funs, updateCheckStatus);
    }
  },
  reducers: {

  },
}