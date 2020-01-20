import { NormalCallRequest } from '@/utils/SystemUtil';
import { remove, pwdreset, search, update} from '@/services/CertificationDepartment/DepartmentSearch/PartyManagementApi';

export default {
  namespace: 'PartyManagement',
  state: {},

  effects: {
    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    },

    *pwdreset(data, funs) {
        yield NormalCallRequest(data, funs, pwdreset);
      },

    *search(data, funs) {
        yield NormalCallRequest(data, funs, search);
      },

    *update(data, funs) {
        yield NormalCallRequest(data, funs, update);
      },

  },
}