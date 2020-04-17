import {NormalCallRequest} from '@/utils/SystemUtil';
import {fhwtoaccessoperate} from '@/services/wto/Statistics/OperationTypeStatisticsApi';

export default {
  namespace: 'OperationTypeStatistics',
  state: {
  },
  effects: {
    *fhwtoaccessoperate(data, funs) {
      yield NormalCallRequest(data, funs, fhwtoaccessoperate);
    },
  },
  reducers: {

  },
}