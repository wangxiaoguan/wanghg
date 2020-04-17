import {NormalCallRequest} from '@/utils/SystemUtil';

import {add, refuse, remove, update, search} from '../../services/StandardDevelop/ProjectManageApi';

export default {
  namespace: 'ProjectManage',
  state: {
  },
  effects: {
    *add(data, funs) {
      yield NormalCallRequest(data, funs, add);
    },

    *refuse(data, funs) {
      yield NormalCallRequest(data, funs, refuse);
    },

    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
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