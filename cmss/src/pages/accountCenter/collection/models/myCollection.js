import { loadFavoriteData } from '@/services/accountCenter';
import { storage } from '@/utils/utils';

const delay = timeout => new Promise(resolve => setTimeout(resolve, timeout));
const loadError = code => {
  const maps = {
    '3': '服务器异常',
    default: '服务器异常',
  };

  return maps[code] || maps.default;
};

export default {
  namespace: 'myCollect',
  state: {
    userId: '',
    total: 0,
    favoritesList: [],
    error: '',
    index: 0,
    search: '',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        const userInfo = JSON.parse(storage.getLocal('userInfo'));
        const path = location.pathname;
        const arrKeys = path.split('/');
        if (arrKeys.length > 2 && arrKeys.includes('accountCenter')) {
          if (arrKeys[2] === 'collection') {
            dispatch({
              type: 'loadFavorites',
              payload: {
                uid: userInfo.id,
                index: 0,
              },
              callBack: () => {},
            });
          }
        }
      });
    },
  },

  effects: {
    showError: [
      function* showError({ code }, { put, call }) {
        yield put({
          type: 'updateState',
          payload: { error: loadError(code) },
        });
        yield call(delay, 2000);
        yield put({
          type: 'updateState',
          payload: { error: '' },
        });
      },
      { type: 'takeLatest' },
    ],

    *loadFavorites({ payload, callBack }, { call, put, select }) {
      const { index, uid, search } = payload;
      let userId = uid;
      if (!userId) {
        userId = yield select(state => state.myCollect.userId);
      }
      const response = yield call(loadFavoriteData, {
        text: JSON.stringify({
          userId,
          index,
          source: 'web',
          //  pagesize: PageSize,
          msgId: 'FAVORITES_LIST',
          title: search,
        }),
      });
      if (response.code === '0' && response.resultMap) {
        const list = response.resultMap.favorites;
        const favorites = [];
        for (let i = 0; i < list.length; i++) {
          if (list[i].targetobject) {
            favorites.push(JSON.parse(list[i].targetobject));
          } /* else {
            favorites.push(list[i]);
          } */
        }
        yield put({
          type: 'updateState',
          payload: {
            favoritesList: favorites,
            total: response.resultMap.count,
            userId,
            index,
            search,
          },
        });
        callBack(response);
      } else {
        //
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

    updateCollectState(state, { payload }) {
      const { favoritesList } = state;

      for (let i = 0; i < favoritesList.length; i += 1) {
        const data = state.favoritesList[i];
        if (data.id === payload.id) {
          favoritesList[i] = {
            ...data,
            isCollect: payload.collect,
            participant: true,
          };
          return {
            ...state,
            favoritesList,
          };
        }
      }

      return {
        ...state,
      };
    },
  },
};
