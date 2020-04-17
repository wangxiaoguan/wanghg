import { NormalCallRequest } from '@/utils/SystemUtil';
import { remove, update, add, search, searchCommonDic, searchRegDic, updateCheckStatus, exportField, exportFieldDownLoad } from '@/services/society/rowData/religiousDataApi';

export default {
  namespace: 'religiousData',
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