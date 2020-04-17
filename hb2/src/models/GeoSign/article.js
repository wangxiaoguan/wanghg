import * as articleService from '@/services/GeoSign/article'

export default {
  namespace: 'article',

  state: {
    data: [],
  },

  effects: {
    * queryData({ payload }, { call, put }) {
      const rsp = yield call(articleService.queryData, payload);
      yield put({
        type: 'saveData',
        payload: rsp
      });
    },

    * addOne({ payload }, { call, put }) {
      const rsp = yield call(articleService.addData, payload);
      yield put({
        type: 'saveData',
        payload: rsp
      });
    },

    * updateOne({ payload }, { call, put }) {
      const rsp = yield call(articleService.updateData, payload);
      yield put({
        type: 'saveData',
        payload: rsp
      });
    },

    * delete({ payload }, { call, put }) {
      const rsp = yield call(articleService.deleteData, payload);
      yield put({
        type: 'saveData',
        payload: rsp
      });
    },
  },

  reducers: {
    saveData(state, action){
      return {
        ...state,
        data: action.payload,
      }
    }
  }
}
