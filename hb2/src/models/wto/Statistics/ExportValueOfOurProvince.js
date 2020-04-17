import {NormalCallRequest} from '@/utils/SystemUtil';
import {cityExportInfo} from '@/services/wto/Statistics/ExportValueOfOurProvinceApi';

export default {
  namespace: 'ExportValueOfOurProvince',
  state: {
  },
  effects: {
    *cityExportInfo(data, funs) {
      yield NormalCallRequest(data, funs, cityExportInfo);
    },
  },
  reducers: {

  },
}