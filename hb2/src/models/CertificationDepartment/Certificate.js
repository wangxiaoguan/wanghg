import { NormalCallRequest } from '@/utils/SystemUtil';
import { search, orgSearch } from '@/services/CertificationDepartment/CertificateApi';

//该model开始废弃
// 还是有利用价值5月9日/2019开始使用

export default {
  namespace: 'Certificate',
  state: {
  },
  effects: {
    *remove(data, funs) {
      yield NormalCallRequest(data, funs, remove);
    },
    *update(data, funs) {
      yield NormalCallRequest(data, funs, update);
    },
    *add(data, funs) {
      yield NormalCallRequest(data, funs, add);
    },
    *search(data, funs) {
      yield NormalCallRequest(data, funs, search);
    },
    *orgSearch(data, funs) {
      yield NormalCallRequest(data, funs, orgSearch);
    },
  },
  reducers: {

  },
}