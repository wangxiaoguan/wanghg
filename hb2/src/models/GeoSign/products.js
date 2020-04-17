import * as productsService from '@/services/GeoSign/products'

export default {
  namespace: 'products',

  state: {
    data: [],
  },

  effects: {
    * queryData({ payload }, { call, put }) {
      const rsp = yield call(productsService.queryData, payload);
      yield put({
        type: 'saveData',
        payload: rsp
      });
    },

    * addOne({ payload }, { call, put }) {
      const rsp = yield call(productsService.addData, payload);
      yield put({
        type: 'saveData',
        payload: rsp
      });
    },

    * updateOne({ payload }, { call, put }) {
      const rsp = yield call(productsService.updateData, payload);
      yield put({
        type: 'saveData',
        payload: rsp
      });
    },

    * delete({ payload }, { call, put }) {
      const rsp = yield call(productsService.deleteData, payload);
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
