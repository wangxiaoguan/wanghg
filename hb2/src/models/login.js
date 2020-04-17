import {fakeAccountLogin, getFakeCaptcha} from '@/services/api';
import {getPageQuery} from '@/utils/utils';
import {reloadAuthorized} from '@/utils/Authorized';
import {setAuthority} from '@/utils/authority';

import {stringify} from 'qs';

import {message} from 'antd';

import {cloneDeep} from 'lodash';

import {routerRedux} from 'dva/router';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({payload, callBack}, funs) {
      const {call, put} = funs;
      const response = yield call(fakeAccountLogin, payload);
      function redirectURL() {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let {redirect} = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
              window.location.hash = redirect;
            }
          } else {
            window.location.href = redirect;
          }
        }
        else {
          window.location.hash = '/';
        }
      }
      // 使用新疆项目的接口
      const {data} = response;
      if (data.loginStatus === 1) {
        yield put({type: 'saveUserAndPassword', payload: {...payload, type: 'account'}});
        const userType = {};
        if (payload.userName === 'admin') {
          userType.user = 'admin';
        } else {
          userType.user = 'user';
        }
        userType.status = 'ok';
        userType.type = payload.type;
        yield put({
          type: 'changeLoginStatus',
          payload: userType,
        });
        reloadAuthorized();
        redirectURL();
        if (callBack) {
          callBack();
        }
      } else {
        message.error('用户名或密码错误');
      }
    },

    *getCaptcha({payload}, {call}) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, {put}) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    saveUserAndPassword(state, {payload}) {
      const payloaddata = cloneDeep(payload);
      localStorage.setItem('username', payloaddata.userName);
      localStorage.setItem('loginType', payloaddata.type);
      return {
        ...state,
      };
    },
    changeLoginStatus(state, {payload}) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
