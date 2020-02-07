/* eslint-disable no-plusplus */
import * as homeServices from '@/services/home';

export default {
  namespace: 'globalhome',

  state: {
  },

  effects: {
    // 获取党组织架构
    *getOrganization({ payload, callBack }, { call }) {
      const response = yield call(homeServices.getOrganization, payload);
      if (response && JSON.stringify(response) !== '{}' && callBack) {
        callBack(response);
      }
    },

    // 获取党组织具体信息
    *getOrganizationInfo({ payload, callBack }, { call }) {
      const response = yield call(homeServices.getOrganization, payload);
      if (response && JSON.stringify(response) !== '{}' && callBack) {
        callBack(response);
      }
    },
  },

  reducers: {
    
  },
};
