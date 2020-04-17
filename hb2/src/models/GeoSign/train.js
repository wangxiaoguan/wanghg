import * as trainService from '@/services/GeoSign/train'

export default {
  namespace: 'train',

  state: {
    data: [],
  },

  effects: {
    * queryData({ payload }, { call, put }) {
      const rsp = yield call(trainService.queryData, payload);
      yield put({
        type: 'saveData',
        payload: rsp
      });
    },

    * addOne({ payload }, { call, put }) {
      const rsp = yield call(trainService.addData, payload);
      yield put({
        type: 'saveData',
        payload: rsp
      });
    },

    * updateOne({ payload }, { call, put }) {
      const rsp = yield call(trainService.updateData, payload);
      yield put({
        type: 'saveData',
        payload: rsp
      });
    },

    * delete({ payload }, { call, put }) {
      const rsp = yield call(trainService.deleteData, payload);
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
