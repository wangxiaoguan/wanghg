import { NormalCallRequest } from '@/utils/SystemUtil';
import { remove, update, add, search, searchTableHead, searchRegDic, updateCheckStatus } from '@/services/society/dataStatistics/questionStatisticsApi';

export default {
  namespace: 'questionStatistics',
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
    *searchTableHead(data, funs) {
      yield NormalCallRequest(data, funs, searchTableHead);
    },
    *searchRegDic(data, funs) {
      yield NormalCallRequest(data, funs, searchRegDic);
    },
    *updateCheckStatus(data, funs) {
      yield NormalCallRequest(data, funs, updateCheckStatus);
    }
  },
  reducers: {

  },
}