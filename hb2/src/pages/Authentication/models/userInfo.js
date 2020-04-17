import {
  getUserInfoList,
  validUser,
  addUser,
  auditUser,
  updateUserInfo,
  deleteUser,
  deleteUsers,
  resetPwd,
  queryAllOrgs,
  queryDepartmentsOfOrg,
  getPasswordRegexRule,
} from '@/services/userInfo';
import { message } from 'antd';
import { getLookUp } from '@/services/xaec';

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  // message.error(`出错了${msg===undefined ? '': msg}`);
  return false;
};

export default {
  namespace: 'userInfo',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    departments: [],
    depts: [],
    modalVisible: false,
    modalType: 1,
    currentItem: {},
    userTypes: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getUserInfoList, payload);

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
    *valid({ payload, callback }, { call }) {
      const response = yield call(validUser, payload);
      if (judge(response)) {
        if (callback) callback();
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(addUser, payload);
      if (judge(response)) {
        if (callback) callback();
      }
    },
    *validAndAdd({ payload, callback }, { call, put }) {
      const validValue = {
        userAccount: payload.userAccount,
        email: payload.email,
        tel: payload.tel,
        idCard: payload.idCard,
      };
      const response = yield call(validUser, validValue);
      if (judge(response)) {
        yield put({
          type: 'add',
          payload,
          callback,
        });
      }
    },
    *audit({ payload, callback }, { call }) {
      const response = yield call(auditUser, payload);
      if (judge(response)) {
        if (callback) {
          callback();
        }
      }
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(updateUserInfo, payload);
      if (judge(response)) {
        if (callback) callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(deleteUser, payload);
      if (judge(response)) {
        if (callback) callback();
      }
    },
    *removeList({ payload, callback }, { call }) {
      const response = yield call(deleteUsers, payload);
      if (judge(response)) {
        if (callback) callback();
      }
    },
    *reset({ payload, callback }, { call }) {
      const response = yield call(resetPwd, payload);
      if (judge(response)) {
        if (callback) callback();
      }
    },

    *queryOrgs({ payload }, { call, put }) {
      const response = yield call(queryAllOrgs, payload);
      // console.log(response.data);
      if (judge(response)) {
        yield put({
          type: 'updateState',
          payload: {
            orgs: response.data,
          },
        });
      }
      // 获取用户类型
      const param = 'USERTYPE';
      const userType = yield call(getLookUp, param);
      yield put({
        type: 'updateState',
        payload: {
          userTypes: userType,
        },
      });
    },
    *queryDepartments({ payload }, { call, put }) {
      const response = yield call(queryDepartmentsOfOrg, payload);
      if (judge(response)) {
        yield put({
          type: 'updateState',
          payload: {
            departments: response.data,
          },
        });
      }
    },
    *queryPasswordRegexRule({ payload }, { call, put }) {
      const response = yield call(getPasswordRegexRule, payload);
      if (judge(response)) {
        yield put({
          type: 'updateState',
          payload: {
            passwordRule: response.data,
          },
        });
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
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true };
    },

    hideModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: false, depts: [] };
    },
  },
};
