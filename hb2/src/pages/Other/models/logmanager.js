/**
 * Created by skyinno on 2018/11/27.
 */

import { getLogList } from '@/services/logmanager';
import { message } from 'antd';

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  // message.error(`出错了${msg===undefined ? '': msg}`);
  return false;
};

export default {
  namespace: 'logmanager',

  state: {
    data: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
      },
    },
    group: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getLogList, {
        current: 1,
        pageSize: 10,
        ...payload,
      });
      if (judge(response)) {
        const { data } = response;
        const pd = {
          list: data.data,
          pagination: {
            current: data.page,
            pageSize: data.pageSize,
            total: data.length,
          },
        };
        yield put({
          type: 'save',
          payload: pd,
        });
      }
    },
    *update({ payload }, { call, put }) {
      const response = yield call(getLogList, payload);
      if (judge(response)) {
        const { data } = response;
        yield put({
          type: 'save',
          payload: data,
        });
        yield put({
          type: 'updateLocal',
          payload: { canModify: true },
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
    updateLocal(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
