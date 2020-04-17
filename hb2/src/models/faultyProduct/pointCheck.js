import { NormalCallRequest } from '@/utils/SystemUtil';
import { update, remove, add, search, exportExcel } from '@/services/faultyProduct/pointCheckApi';

export default {
  namespace: 'pointCheck',
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
    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
    },
    *exportExcel(data, funs) {
      yield NormalCallRequest(data, funs, exportExcel);
    }
  },
  reducers: {

  },
}