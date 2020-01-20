import { NormalCallRequest } from '@/utils/SystemUtil';
import { update, remove, add, search } from '@/services/faultyProduct/home/homeApi';

export default {
  namespace: 'faultyHome',
  state: {
  },
  effects: {
    *add(data, funs) {
      yield NormalCallRequest(data, funs, add);
    },
    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
    },
    *update(data, funs) {
      yield NormalCallRequest(data, funs, update);
    },
    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    },
  },
  reducers: {

  },
}