import { NormalCallRequest } from '@/utils/SystemUtil';
import { update, remove, add, search } from '@/services/faultyProduct/downloadManagerApi';

export default {
  namespace: 'downloadManager',
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
  },
  reducers: {

  },
}