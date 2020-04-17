import {NormalCallRequest} from '@/utils/SystemUtil';

import { remove, update, search } from '../../services/standard/standardUserApi';

export default {
  namespace: 'standardUser',
  state: {
    userData:null,
  },
  effects: {

    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    },

    *update(data, funs) {
      yield NormalCallRequest(data, funs, update);
    },

    *search(data, funs) {
      const res = yield funs.call(search, data.payLoad);
      if(res) {
        if(res.code === '10001'){
          yield funs.put({
            type: 'change',
            payload: res.data,
          })
        }
        if(data.callBack){
          data.callBack(res);
        }
      }
    },

  },
  reducers: {
    change(state, {payload}) {
      return {
        ...state,
        userData: payload,
      };
    },
  },
}