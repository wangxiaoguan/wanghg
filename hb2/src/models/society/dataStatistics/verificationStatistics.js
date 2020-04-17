import {NormalCallRequest} from '@/utils/SystemUtil';
import {remove, update, add, search, updateCheckStatus, exportField, exportFieldDownLoad} from '@/services/society/dataStatistics/verificationStatisticsApi';

export default {
  namespace: 'verificationStatistics',
  state: {
  },
  effects: {
    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    },
    *update(data, funs) {
      yield NormalCallRequest(data, funs, update);
    },
    *add(data, funs) {
      yield NormalCallRequest(data, funs, add);
    },
    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
    },
    *updateCheckStatus(data, funs) {
      yield NormalCallRequest(data, funs, updateCheckStatus);
    },

    *exportField(data,funs) {
      yield NormalCallRequest(data, funs, exportField);
    },

    *exportFieldDownLoad(data,funs) {
      yield NormalCallRequest(data, funs, exportFieldDownLoad);
    }
  },
  reducers: {

  },
}