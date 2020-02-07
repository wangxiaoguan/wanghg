import { getNewsList } from '@/services/seekActivity';

export default {
  namespace: 'topics',

  state: {
    channelsList: [],
  },

  effects: {
    *getChannels({ payload }, { call, put }) {
      const response = yield call(getNewsList, payload);
      console.log('response', response);
      if (response && JSON.stringify(response) !== '{}' && response.resultMap) {
        const channelsList = response.resultMap.objList;
        yield put({
          type: 'updateState',
          payload: {
            channelsList,
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
