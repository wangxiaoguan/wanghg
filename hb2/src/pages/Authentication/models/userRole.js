import { getUserInfo, getUserRoleList, userRoleDeleteRole } from '@/services/userInfo';
import { message } from 'antd';

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  message.error(msg);
  return false;
};

export default {
  namespace: 'userRole',

  state: {
    item: {},
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchUser({ payload, callback }, { call, put }) {
      const response = yield call(getUserInfo, payload);
      if (judge(response)) {
        const { data } = response;
        // console.log('getUserInfo');
        // console.log(data);
        yield put({
          type: 'saveItem',
          payload: data,
        });
        if (callback) callback();
      }
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(getUserRoleList, payload);
      if (judge(response)) {
        const { data } = response;
        // console.log('getGroupUserList');
        // console.log(data);
        const result = {
          list: data.data || [],
          pagination: {
            total: data.length || 0,
            current: data.page || 1,
            pageSize: data.pageSize || 10,
          },
        };
        yield put({
          type: 'save',
          payload: result,
        });
      }
    },
    *removeRole({ payload, callback }, { call }) {
      const response = yield call(userRoleDeleteRole, payload);
      // console.log('userRoleDeleteRole');
      // console.log(response);
      if (judge(response)) {
        if (callback) callback();
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveItem(state, action) {
      return {
        ...state,
        item: action.payload,
      };
    },
  },
};
