import { getRole, getBindedGroupList, unbindGroup, unbindGroups } from '@/services/role';
import { message } from 'antd';

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  // message.error(`出错了${msg===undefined ? '': msg}`);
  return false;
};

export default {
  namespace: 'roleGroup',

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
      const response = yield call(getBindedGroupList, payload);
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
    *removeGroup({ payload, callback }, { call }) {
      const response = yield call(unbindGroup, payload);
      if (judge(response)) {
        if (callback) callback();
      }
    },

    *removeGroups({ payload, callback }, { call }) {
      const response = yield call(unbindGroups, payload);
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
