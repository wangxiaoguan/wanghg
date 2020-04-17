import {NormalCallRequest} from '@/utils/SystemUtil';
import {getAll, add, remove, update, getEnableAll} from '@/services/newsCategoryApi';




export default {
  namespace: 'newsCategory',
  state: {
  },
  effects: {
    *searchAll(data, funs) {
      yield NormalCallRequest(data, funs, getAll);
    },

    *add(data, funs) {
      yield NormalCallRequest(data, funs, add);
    },

    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    },

    *update(data, funs) {
      yield NormalCallRequest(data, funs, update);
    },

    *searchAllEnable(data, funs) {
      yield NormalCallRequest(data, funs, getEnableAll);
    }
  },
  reducers: {

  },
}