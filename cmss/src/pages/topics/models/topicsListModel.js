import { getNewsList } from '@/services/seekActivity';

export default {
  namespace: 'topicsList',

  state: {
    infoList: [],
    cacheLists: {},
  },

  effects: {
    *getList({ payload, cacheLists, id }, { call, put }) {
      const response = yield call(getNewsList, payload);
      if (response && JSON.stringify(response) !== '{}' && response.resultMap) {
        const infoList = response.resultMap.objList;

        const cacheData = cacheLists;
        cacheData[`${id}`] = infoList;
        const newCacheData = { ...cacheData };

        yield put({
          type: 'updateState',
          payload: {
            infoList,
            cacheLists: newCacheData,
          },
        });
      }
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
