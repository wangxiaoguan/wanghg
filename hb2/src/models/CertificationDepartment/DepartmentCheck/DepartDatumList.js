import { NormalCallRequest } from '@/utils/SystemUtil';
import { updateCheckStatus } from '@/services/CertificationDepartment/DepartmentCheck/DepartDatumListApi';

export default {
  namespace: 'DepartDatumList',
  state: {
  },
  effects: {

    *updateCheckStatus(data, funs) {
      yield NormalCallRequest(data, funs, updateCheckStatus);
    },
  },
  reducers: {

  },
}