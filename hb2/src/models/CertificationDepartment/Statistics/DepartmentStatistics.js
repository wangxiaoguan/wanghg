import { NormalCallRequest } from '@/utils/SystemUtil';
import { regionStatistics, provinceStatistics, comprehensiveStatistics } from '@/services/CertificationDepartment/Statistics/DepartmentStatisticsApi';

export default {
  namespace: 'Statistics',
  state: {
  },
  effects: {
    *regionStatistics(data, funs) {
      yield NormalCallRequest(data, funs, regionStatistics);
    },
    *provinceStatistics(data, funs) {
      yield NormalCallRequest(data, funs, provinceStatistics);
    },
    *comprehensiveStatistics(data, funs) {
      yield NormalCallRequest(data, funs, comprehensiveStatistics);
    },

  },
  reducers: {

  },
}