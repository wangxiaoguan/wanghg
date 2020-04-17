import { NormalCallRequest } from '@/utils/SystemUtil';
import {
  add, remove, update, search, getAll
} from '@/services/CertificationDepartment/DepartmentSearch/CertificateApi';

export default {
  namespace: 'CertificateDetail',// 资料信息
  state: {},

  effects: {
    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    },

    *add(data, funs) {
      yield NormalCallRequest(data, funs, add);
    },

    *update(data, funs) {
      yield NormalCallRequest(data, funs, update);
    },

    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
    },

    *getAllCert(data, funs) {
      yield NormalCallRequest(data, funs, getAll)
    }
  },
}