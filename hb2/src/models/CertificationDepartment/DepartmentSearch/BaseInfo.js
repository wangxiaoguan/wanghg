import { NormalCallRequest } from '@/utils/SystemUtil';
import {
  search, update, add, logSearch, getIndustry,
} from '@/services/CertificationDepartment/DepartmentSearch/BaseInfoApi';

export default {
  namespace: 'UserBackStage_BaseInfo',
  state: {},

  effects: {
    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
    },

    *update(data, funs) {
      yield NormalCallRequest(data, funs, update);
    },

    *add(data, funs) {
      yield NormalCallRequest(data, funs, add);
    },

    *logSearch(data, funs) {
      yield NormalCallRequest(data, funs, logSearch);
    },

    *getAllIndustry(data, funs) {
      yield NormalCallRequest(data, funs, getIndustry)
    }
  },
}