import { NormalCallRequest } from '@/utils/SystemUtil';
import { update, remove, add, search, exportExcel,updateStatus } from '@/services/faultyProduct/carThree/carThreeConsumerApi';

export default {
  namespace: 'carThreeConsumer',
  state: {
  },
  effects: {
    *add(data, funs) {
      yield NormalCallRequest(data, funs, add);
    },
    *update(data, funs) {
      yield NormalCallRequest(data, funs, update);
    },
    *updateStatus(data, funs) {
      yield NormalCallRequest(data, funs, updateStatus);
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