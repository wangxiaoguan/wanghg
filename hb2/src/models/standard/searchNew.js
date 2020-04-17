import {NormalCallRequest} from '@/utils/SystemUtil';

import {add, refuse, remove, update, search, renew, downExportExcel, handleExportExcel, pwdreset, download, removeApply} from '../../services/standard/searchNewApi';

export default {
  namespace: 'searchNew',
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

    *removeApply(data, funs) {
      yield NormalCallRequest(data, funs, removeApply);
    },

    *renew(data, funs) {
      yield NormalCallRequest(data, funs, renew);
    },

    *downExportExcel(data, funs) {
      yield NormalCallRequest(data, funs, downExportExcel);
    },

    *handleExportExcel(data, funs) {
      yield NormalCallRequest(data, funs, handleExportExcel);
    },

    *pwdreset(data, funs) {
      yield NormalCallRequest(data, funs, pwdreset);
    },

    *download(data, funs) {
      yield NormalCallRequest(data, funs, download);
    },
  },
  reducers: {

  },
}