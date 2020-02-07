import { getNavList, getNewsList } from '@/services/seekActivity';

export default {
  namespace: 'seekActivity',

  state: {
    navList: [],
    newsList: [],
  },

  effects: {
    *getNavList({ payload, callback }, { call, put }) {
      const response = yield call(getNavList, payload);
      if (response && JSON.stringify(response) !== '{}' && response.resultMap) {
        yield put({
          type: 'changeNavList',
          payload: { navList: response.resultMap.categoryList },
        });
      }
    },
    *getNewsList({ payload, callback }, { call, put }) {
      const response = yield call(getNewsList, payload);
      if (response && JSON.stringify(response) !== '{}' && response.resultMap) {
        yield put({
          type: 'changeNavList',
          payload: { newsList: response.resultMap.objectList },
        });
      }
    },
    *getNewsListBysearch({ payload, callBack }, { call, put }) {
      const response = yield call(getNewsList, payload.content);
      if (response && JSON.stringify(response) !== '{}' && callBack) {
        const newsList = response.resultMap.objectList;
        const searchNewList = [];
        for (let i = 0; i < newsList.length; i += 1) {
          if (newsList[i].title.indexOf(payload.searchValue) !== -1) {
            searchNewList.push(newsList[i]);
          }
        }
        yield put({
          type: 'changeNavList',
          payload: {
            newsList: searchNewList,
          },
        });
        callBack();
      }
    },
  },

  reducers: {
    changeNavList(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
