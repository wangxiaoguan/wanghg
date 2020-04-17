import {NormalCallRequest} from '@/utils/SystemUtil';
import {remove, update, add, search, updateCheckStatus} from '@/services/wto/english/certificationApi';

export default {
  namespace: 'certification',
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
    *updateCheckStatus(data, funs) {
      yield NormalCallRequest(data, funs, updateCheckStatus);
    }
  },
  reducers: {

  },
}