import {query as queryUsers} from '@/services/user';
import {authInfo} from '@/services/login';
import {reloadAuthorized} from '@/utils/Authorized';

import {message} from 'antd';

import {cloneDeep} from 'lodash';

const judge = ({code} = {}) => {
  if (code === 200) {
    return true;
  }
  message.error('session超时，请重新登录');
  return false;
};

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
  },

  effects: {
    *fetch(_, {call, put}) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, {call, put}) {
      const response = yield call(authInfo);
      const loginType = localStorage.getItem('loginType');
      if (judge(response)) {
        const {data} = response;
        yield put({type: 'saveUserInfo', payload: data});
        reloadAuthorized();
      } else {
        const userType = {};
        userType.user = 'guest';
        userType.status = false;
        userType.type = loginType;
        yield put({
          type: 'changeLoginStatus',
          payload: userType,
        });
        localStorage.removeItem('loginUserData');
        reloadAuthorized();
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },

    saveUserInfo(state, {payload}) {
      const payloaddata = cloneDeep(payload);
      localStorage.setItem('loginUserData', JSON.stringify(payloaddata));
      return {
        ...state,
        currentUser: payloaddata,
      };
    },
  },
};
