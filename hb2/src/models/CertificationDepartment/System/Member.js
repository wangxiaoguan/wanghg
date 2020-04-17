import {NormalCallRequest} from '@/utils/SystemUtil';
import {update, add, search, remove} from '@/services/CertificationDepartment/System/MemberApi';

export default {
  namespace: 'CerMember',
  state: {
  },
  effects: {
    *update(data, funs) {
      yield NormalCallRequest(data, funs, update);
    },
    *add(data, funs) {
      yield NormalCallRequest(data, funs, add);
    },
    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
    },
    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    }
  },
  reducers: {

  },
}