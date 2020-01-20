import { NormalCallRequest } from '@/utils/SystemUtil';
import {
  add, remove, update, search
} from '@/services/CertificationDepartment/DepartmentSearch/MemberApi';

export default {
  namespace: 'MemberDetail',// 资料信息
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
  },
}