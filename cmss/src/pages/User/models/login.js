import { getUser, getPartyInfo } from '@/services/home';

export default {
  namespace: 'loginDemo',

  state: {},

  effects: {
    // 登录接口
    *login({ payload, callBack }, { call }) {
      const response = yield call(getUser, payload);
      if (response && JSON.stringify(response) !== '{}' && callBack) {
        callBack(response);
      }
    },

    *getPartyInfo({ payload, callBack }, { call }) {
      const response = yield call(getPartyInfo, payload);
      if (response.code === '0') {
        if (response.resultMap && response.resultMap.obj) {
          callBack && callBack(response.resultMap.obj);
        }
      }
    }
  },

  reducers: {},
};
