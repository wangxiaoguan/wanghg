import {NormalCallRequest} from '@/utils/SystemUtil';
import {remove, update} from '@/services/wto/userOrder/OnlineCustomOrderApi';

export default {
  namespace: 'OnlineCustomOrder',
  state: {
  },
  effects: {
    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    },

    *update(data, funs) {
      yield NormalCallRequest(data, funs, update);
    },
  },
  reducers: {

  },
}