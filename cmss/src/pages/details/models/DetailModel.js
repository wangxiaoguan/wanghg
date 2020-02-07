import * as detailServices from '../../../services/detail';
import { message } from 'antd';

const checkResp = (response) => {
  if (response && JSON.stringify(response) !== '{}') {
    if (response.code === '0') {
      return true;
    } else {
      message.error(response.message || '服务器错误');
      return false;
    }
  } else {
    message.error('服务器错误');
    return false;
  }
};

export default {
  namespace: 'detailModel',
  state: {
    detail: {},
    showConfirmExam: false
  },

  effects: {
    * getNewsDetail({ payload, error }, { call, put }) {
      const response = yield call(detailServices.getDetails, payload);
      if (response && JSON.stringify(response) !== '{}') {
        if (response.code === '0') {
          yield put({
            type: 'saveState',
            payload: {
              detail: response.resultMap
            }
          })
        } else {
          error && error();
        }
      } else {
        error && error();
      }
    },
    * saveProgress({ payload }, { call, put }) {
      const response = yield call(detailServices.getDetails, payload);
      if (checkResp(response)) {

      } else {
        message.error(response && response.message || '保存学习进度失败')
      }
    },

    // 获取图集
    *getImgList({ payload, callBack }, { call }) {
      const response = yield call(detailServices.getImgList, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      }
    },
  },

  reducers: {
    saveState(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    saveProgressData(state, { payload }) {
      let detail = state.detail;
      detail.totalStudyTime = payload.studyTime;
      return {
        ...state,
        detail
      }
    },
    showConfirmExam(state,{payload}) {
      console.log("showConfirmExam",payload)
      return {
        ...state,
        ...payload
      }
    }
  },
};
