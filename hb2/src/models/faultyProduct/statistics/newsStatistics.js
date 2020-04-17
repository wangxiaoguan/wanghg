import { NormalCallRequest } from '@/utils/SystemUtil';
import { 
  newsStatistics, 
  clickRate, 
  // articleClickRate 
  keyData,
  increaseTendency
} from '@/services/faultyProduct/statistics/newsStatisticsApi';

export default {
  namespace: 'NewsStatistics',
  state: {
  },
  effects: {
    *newsStatistics(data, funs) {
      yield NormalCallRequest(data, funs, newsStatistics);
    },
    *clickRate(data, funs) {
      yield NormalCallRequest(data, funs, clickRate);
    },
    // *articleClickRate(data, funs) {
    //   yield NormalCallRequest(data, funs, articleClickRate);
    // },

    *keyData(data, funs) {
      yield NormalCallRequest(data, funs, keyData);
    },
    *increaseTendency(data, funs) {
      yield NormalCallRequest(data, funs, increaseTendency);
    },
  },
  reducers: {

  },
}