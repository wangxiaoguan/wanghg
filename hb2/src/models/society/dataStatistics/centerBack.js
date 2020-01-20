import {NormalCallRequest} from '@/utils/SystemUtil';
import {remove, update, add, search, searchCommonDic, searchRegDic, updateCheckStatus, searchProblemType, searchProblemType2, exportField, exportFieldDownLoad} from '@/services/society/dataStatistics/centerBackApi';

export default {
  namespace: 'centerBack',
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
    *searchCommonDic(data, funs) {
      yield NormalCallRequest(data, funs, searchCommonDic);
    },
    *searchRegDic(data, funs) {
      yield NormalCallRequest(data, funs, searchRegDic);
    },
    *updateCheckStatus(data, funs) {
      yield NormalCallRequest(data, funs, updateCheckStatus);
    },

    *searchProblemType(data, funs) {
      yield NormalCallRequest(data, funs, searchProblemType);
    },

    *searchProblemType2(data, funs) {
      yield NormalCallRequest(data, funs, searchProblemType2);
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