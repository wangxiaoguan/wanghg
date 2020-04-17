import {NormalCallRequest} from '@/utils/SystemUtil';
import {remove, update, add, search} from '@/services/wto/english/enterpriseMessageApi';

export default {
  namespace: 'enterpriseMessage',
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
    }
  },
  reducers: {

  },
}