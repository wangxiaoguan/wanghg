import {NormalCallRequest} from '@/utils/SystemUtil';
import {update, add, search, remove,download, save} from '@/services/CertificationDepartment/TechnicalAdvisoryApi';

export default {
  namespace: 'TechnicalAdvisory',
  state: {
  },
  effects: {
    *update(data, funs) {
      yield NormalCallRequest(data, funs, save);
    },
    *add(data, funs) {
      yield NormalCallRequest(data, funs, save);
    },
    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
    },
    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    },
    *download(data, funs) {
      yield NormalCallRequest(data, funs, download);
    },
  },
  reducers: {

  },
}