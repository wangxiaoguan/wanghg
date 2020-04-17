import {NormalCallRequest} from '@/utils/SystemUtil';
import {remove, update, add, search} from '@/services/wto/dictionary/NICWithICSCodeApi';

export default {
  namespace: 'NICWithICSCode',
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
  },
  reducers: {

  },
}