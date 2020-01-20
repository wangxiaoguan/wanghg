import {NormalCallRequest} from '@/utils/SystemUtil';

import { remove, pwdreset, search, update } from '../../../services/wto/synthesizeManage/userSuperviseApi';

export default {
  namespace: 'userSupervise',
  state: {
  },
  effects: {
    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    },

    *pwdreset(data, funs) {
        yield NormalCallRequest(data, funs, pwdreset);
    },
    
    *search(data, funs) {
        yield NormalCallRequest(data, funs, search);
    },

    *update(data, funs) {
        yield NormalCallRequest(data, funs, update);
    },
  },
  reducers: {

  },
}