import { getPasswordRule, updatePasswordRule } from '@/services/cmdb';
import { message } from 'antd';

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  // message.error(`出错了${msg===undefined ? '': msg}`);
  return false;
};

export default {
  namespace: 'cmdb',
  state: {
    data: {},
    rules: [],
    canModify: true,
    newStartTime: undefined,
    newEndTime: undefined,
    newRule: undefined,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getPasswordRule, payload);
      if (judge(response)) {
        const { data } = response;
        yield put({
          type: 'save',
          payload: {
            data,
            newStartTime: data.accessStartTime,
            newEndTime: data.accessEndTime,
            newRule: data.passwordRule,
            rules: data.RegexRule === undefined ? [] : data.RegexRule,
          },
        });
      }
    },
    *update({ payload }, { call, put }) {
      const response = yield call(updatePasswordRule, payload);
      if (judge(response)) {
        const { data } = response;
        yield put({
          type: 'save',
          payload: {
            data,
            newStartTime: data.accessStartTime,
            newEndTime: data.accessEndTime,
            newRule: data.passwordRule,
            rules: data.RegexRule === undefined ? [] : data.RegexRule,
          },
        });
        yield put({
          type: 'updateLocal',
          payload: { canModify: true },
        });
        message.success('密码规则配置修改成功');
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        data: payload.data,
        newStartTime: payload.newStartTime,
        newEndTime: payload.newEndTime,
        newRule: payload.newRule,
        rules: payload.rules,
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
