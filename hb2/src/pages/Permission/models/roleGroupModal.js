import { getUnbindingGroupList, bindGroup } from '@/services/role';
import { message } from 'antd';

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  // message.error(`出错了${msg===undefined ? '': msg}`);
  return false;
};

export default {
  namespace: 'roleGroupModal',

  state: {
    data: {
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
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getUnbindingGroupList, payload);
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
          type: 'save',
          payload: result,
        });
      }
    },

    *bindGroup({ payload, callback }, { call }) {
      const response = yield call(bindGroup, payload);
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
