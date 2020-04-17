import * as tagService from '@/services/GeoSign/tag'


export default {
  namespace: 'tag',

  state: {
    data: [],
  },

  effects: {
    * queryData({ payload }, { call, put }) {
      const rsp = yield call(tagService.queryData, payload);
      yield put({
        type: 'saveData',
        payload: rsp
      });
    },

    * addOne({ payload }, { call, put }) {
      const rsp = yield call(tagService.addData, payload);
      yield put({
        type: 'saveData',
        payload: rsp
      });
    },

    * updateOne({ payload }, { call, put }) {
      const rsp = yield call(tagService.updateData, payload);
      yield put({
        type: 'saveData',
        payload: rsp
      });
    },

    * delete({ payload }, { call, put }) {
      const rsp = yield call(tagService.deleteData, payload);
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
