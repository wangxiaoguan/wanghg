import { getRoleList, addRole, updateRole, deleteRole, deleteRoles } from '@/services/role';
import { message } from 'antd';

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  // message.error(`出错了${msg===undefined ? '': msg}`);
  return false;
};

export default {
  namespace: 'role',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getRoleList, payload);
      if (judge(response)) {
        const { data } = response;
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
    *add({ payload, callback }, { call }) {
      const response = yield call(addRole, payload);
      if (judge(response)) {
        if (callback) callback();
      }
    },

    *update({ payload, callback }, { call }) {
      const response = yield call(updateRole, payload);
      if (judge(response)) {
        if (callback) callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(deleteRole, payload);
      if (judge(response)) {
        if (callback) callback();
      }
    },
    *removeList({ payload, callback }, { call }) {
      const response = yield call(deleteRoles, payload);
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
  },
};
