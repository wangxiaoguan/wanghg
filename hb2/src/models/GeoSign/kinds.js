import * as kindsService from '@/services/GeoSign/kinds'

export default {
  namespace: 'kinds',

  state: {
    data: [],
  },

  effects: {
    * queryData({ payload }, { call, put }) {
      const rsp = yield call(kindsService.queryData, payload);
      yield put({
        type: 'saveData',
        payload: rsp
      });
    },

    * addOne({ payload }, { call, put }) {
      const rsp = yield call(kindsService.addData, payload);
      yield put({
        type: 'saveData',
        payload: rsp
      });
    },

    * updateOne({ payload }, { call, put }) {
      const rsp = yield call(kindsService.updateData, payload);
      yield put({
        type: 'saveData',
        payload: rsp
      });
    },

    * delete({ payload }, { call, put }) {
      const rsp = yield call(kindsService.deleteData, payload);
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
