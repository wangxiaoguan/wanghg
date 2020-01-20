import {queryNotices, getCitys, getUserInfo} from '@/services/api';
import {setAuthority} from '@/utils/authority';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    /**
     * 湖北省所有市区
     */
    hbCitys: [],

    user: null,
  },

  effects: {
    *getUserinfo({payload}, {call, put}) {
      const data = yield call(getUserInfo, payload);
      yield put({
        type: 'saveUser',
        payload: data.data,
      });
      setAuthority(data.data.data);
    },
    *getCitys(_, {call, put}) {
      const data = yield call(getCitys);
      yield put({
        type: 'saveCitys',
        payload: data.data.data,
      });
    },
    *fetchNotices(_, {call, put, select}) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    *clearNotices({payload}, {put, select}) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    *changeNoticeReadState({payload}, {put, select}) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = {...item};
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        })
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, {payload}) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, {payload}) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, {payload}) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },

    saveCitys(state, {payload}) {
      return {
        ...state,
        hbCitys: payload,
      };
    },

    saveUser(state, {payload}) {
      return {
        ...state,
        user: payload,
      };
    }
  },

  subscriptions: {
    setup({history}) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({pathname, search}) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
