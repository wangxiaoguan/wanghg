import { NormalCallRequest } from '@/utils/SystemUtil';
import { update, remove, add, search } from '@/services/faultyProduct/contents/introductionApi';

export default {
  namespace: 'faultyIntroduction',
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