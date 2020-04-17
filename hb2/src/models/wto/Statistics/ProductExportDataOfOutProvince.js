import {NormalCallRequest} from '@/utils/SystemUtil';
import {remove} from '@/services/wto/Statistics/ProductExportDataOfOutProvinceApi';

export default {
  namespace: 'ProductExportDataOfOutProvince',
  state: {
  },
  effects: {
    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    },
  },
  reducers: {

  },
}