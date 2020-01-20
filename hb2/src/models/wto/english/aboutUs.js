import {NormalCallRequest} from '@/utils/SystemUtil';
import {listAll, update} from '@/services/wto/english/aboutUsApi';

export default {
  namespace: 'aboutUs',
  state: {
  },
  effects: {
    *search(data, funs) {
      yield NormalCallRequest(data, funs, listAll);
    },
    *update(data, funs) {
      yield NormalCallRequest(data, funs, update);
    },
  },
  reducers: {

  },
}