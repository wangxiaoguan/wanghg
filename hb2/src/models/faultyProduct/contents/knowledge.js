import { NormalCallRequest } from '@/utils/SystemUtil';
import { update, remove, add, search, updateBatchCheckStatus } from '@/services/faultyProduct/contents/knowledgeApi';

export default {
  namespace: 'faultyKnowledge',
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
    *updateBatchCheckStatus(data, funs) {
      yield NormalCallRequest(data, funs, updateBatchCheckStatus);
    },
  },
  reducers: {

  },
}