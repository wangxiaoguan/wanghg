import {NormalCallRequest} from '@/utils/SystemUtil';
import {update, remove, add} from '@/services/main/friendLinkApi';

export default {
  namespace: 'friendLink',
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
  },
  reducers: {

  },
}