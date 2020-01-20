import { NormalCallRequest } from '@/utils/SystemUtil';

import { add, update, remove, search } from '@/services/wto/synthesizeManage/advertApi';

export default {
  namespace: 'wtoAdvert',
  state: {
  },
  effects: {
    *add(data, funs) {
      yield NormalCallRequest(data, funs, add);
    },

    *update(data, funs) {
      yield NormalCallRequest(data, funs, update);
    },

    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
    },

    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    },
  },
  reducers: {

  },
}