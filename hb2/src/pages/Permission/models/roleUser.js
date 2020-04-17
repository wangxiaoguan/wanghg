import { getRole, getBindedUserList, unbindUser, unbindUsers } from '@/services/role';
import { message } from 'antd';

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  // message.error(`出错了${msg===undefined ? '': msg}`);
  return false;
};

export default {
  namespace: 'roleUser',

  state: {
    item: {},
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 项`,
    },
  },

  effects: {
    *fetchRole({ payload, callback }, { call, put }) {
      const response = yield call(getRole, payload);
      if (judge(response)) {
        const { data } = response;
        yield put({
          type: 'saveItem',
          payload: data,
        });
        if (callback) callback();
      }
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(getBindedUserList, payload);
      if (judge(response)) {
        const { data } = response;
        const result = {
          list: data.data || [],
          pagination: {
            total: data.length || 0,
            current: data.page || 1,
            pageSize: data.pageSize || 10,
          },
        };
        yield put({
          type: 'querySuccess',
          payload: result,
        });
      }
    },
    *removeUser({ payload }, { call }) {
      const response = yield call(unbindUser, payload);
      if (!judge(response)) {
        message(response.msg);
      }
    },

    *removeUsers({ payload }, { call }) {
      const response = yield call(unbindUsers, payload);
      if (!judge(response)) {
        message(response.msg);
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
    querySuccess(state, { payload }) {
      const { list, pagination } = payload;
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      };
    },
  },
};
