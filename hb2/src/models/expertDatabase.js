import { getExportExcel, getList, add, update, search, majoranalysis, titlelevelanalysis, updateAuditStatus } from '../services/expertDatabaseApi';
import { NormalCallRequest } from '@/utils/SystemUtil';

export default {
  namespace: 'expertDataBase',
  state: {
  },
  effects: {
    *add(data, funs) {
      yield NormalCallRequest(data, funs, add);
    },
    *update(data, funs) {
      yield NormalCallRequest(data, funs, update);
    },
    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
    },
    *searchList(data, funs) {
      yield NormalCallRequest(data, funs, getList);
    },
    *exportExcel(data, funs) {
      yield NormalCallRequest(data, funs, getExportExcel);
    },
    *majoranalysis(data, funs) {
      yield NormalCallRequest(data, funs, majoranalysis);
    },
    *titlelevelanalysis(data, funs) {
      yield NormalCallRequest(data, funs, titlelevelanalysis);
    },
    *updateAuditStatus(data, funs) {
      yield NormalCallRequest(data, funs, updateAuditStatus);
    },
  },
  reducers: {

  },
}