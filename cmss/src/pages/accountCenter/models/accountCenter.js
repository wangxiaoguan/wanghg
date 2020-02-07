import { getUser, getPartyInfo, loadData, getNewsLists } from '@/services/accountCenter';
import { storage } from '@/utils/utils';

export default {
  namespace: 'accountCenter',

  state: {
    mydossier: {}, //我的档案
    thingList: [], //事项提醒
    systemList: [], //系统提醒
    userDate: [], //个人信息
    userInfo: {},
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const userInfo = JSON.parse(storage.getLocal('userInfo'));
        const path = location.pathname;
        const arrKeys = path.split('/');
        if (arrKeys.length > 2 && arrKeys.includes('accountCenter')) {
          if (arrKeys[2] === 'myActivity') {
            const formatData = {
              condition: '0',
              index: '0',
              source: 'web',
              msgId: 'APP020',
              userId: `${userInfo.id}`,
            };
            dispatch({
              type: 'getActivityList',
              payload: {
                text: JSON.stringify(formatData),
              },
            });
          } else if (arrKeys[2] === 'study' || arrKeys[2] === 'examination') {
            let type = 2;
            let categoryId = 94;
            if (arrKeys[2] === 'study') {
              type = 1;
              categoryId = 24;
            }
            const formatData = {
              categoryId,
              categoryType: type,
              department: `${userInfo.orgid}`,
              index: 0,
              isComplete: false,
              source: 'web',
              msgId: 'PARTY_BUILDING_REMIND_LIST',
              userId: `${userInfo.id}`,
            };
            dispatch({
              type: 'getList',
              payload: {
                text: JSON.stringify(formatData),
              },
            });
          }
        }
      });
    },
  },

  effects: {
    *getUserInfo({ payload, callBack }, { call, put }) {
      const response = yield call(getPartyInfo, payload);
      if (
        response &&
        JSON.stringify(response) !== '{}' &&
        response.resultMap &&
        response.resultMap.obj &&
        callBack
      ) {
        callBack(response.resultMap.obj);
        yield put({
          type: 'updateState',
          userDate: response.resultMap.obj,
        });
      }
    },

    *loadData({ payload, callBack }, { put, call }) {
      const response = yield call(loadData, payload);
      console.log(response);
      if (response.code === '0') {
        yield put({
          type: 'updateState',
          payload: {
            userInfo: response.resultMap.userInfo,
          },
        });
      }
      callBack();
    },

    *getList({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          infoList: [],
        },
      });
      const response = yield call(getNewsLists, payload);
      console.log('response', response);
      if (response && JSON.stringify(response) !== '{}') {
        const infoList = response.resultMap.objectList;
        yield put({
          type: 'updateState',
          payload: {
            infoList,
          },
        });
      }
    },

    *getNewsListBysearch({ payload, callBack }, { call, put }) {
      const response = yield call(getNewsLists, payload.content);
      if (response && JSON.stringify(response) !== '{}' && callBack) {
        const newsList = response.resultMap.objectList;
        const searchNewList = [];
        for (let i = 0; i < newsList.length; i += 1) {
          if (newsList[i].title.indexOf(payload.searchValue) !== -1) {
            searchNewList.push(newsList[i]);
          }
        }
        yield put({
          type: 'updateState',
          payload: {
            infoList: searchNewList,
          },
        });
        callBack();
      }
    },

    *getTips({ payload, callBack }, { call }) {
      const response = yield call(getNewsLists, payload);
      if (response && JSON.stringify(response) !== '{}') {
        const res = response.resultMap;
        callBack(res);
      }
    },

    *getActivityList({ payload }, { call, put }) {
      yield put({
        type: 'updateState',
        payload: {
          infoList: [],
        },
      });
      const response = yield call(getNewsLists, payload);
      if (response && JSON.stringify(response) !== '{}') {
        const infoList = response.resultMap.objectList;
        yield put({
          type: 'updateState',
          payload: {
            infoList,
          },
        });
      }
    },

    *getUser({ payload, callback }, { call, put }) {
      const response = yield call(getUser, payload);
      yield put({
        type: 'updateState',
        payload: { mydossier: response },
      });
      callback(response);
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
