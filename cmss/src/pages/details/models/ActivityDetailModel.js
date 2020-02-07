import * as detailServices from '../../../services/detail';
import {
  message
} from 'antd';
import {
  storage
} from '../../../utils/utils';

// const checkResp = (response) => {
//   if (response && JSON.stringify(response) !== '{}') {
//     if (response.code === '0') {
//       return true;
//     } else {
//       message.error(response.message || '服务器错误');
//       return false;
//     }
//   } else {
//     message.error('服务器错误');
//     return false;
//   }
// };

export default {
  namespace: 'activityDetailModel',

  state: {
    activityDetail: {},
    activityInfo: {},
    isJoin: false,
    isCan: true,
    userInfo: JSON.parse(storage.getLocal('userInfo')),
  },

  effects: {
    * getActivityDetail({
      payload,
      error
    }, {
      call,
      put
    }) {
      const response = yield call(detailServices.getDetails, payload);
      if (response) {
        if (response.code === '0') {
          yield put({
            type: 'saveState',
            payload: {
              activityDetail: response.resultMap,
              isJoin: response.resultMap.isJoin,
              isCan: response.resultMap.isCan,
              activityInfo: response.resultMap.activityInfo
            },
          });
        } else if (response.code === '1') {
          // 活动已经被删除了
          error && error();
        } else {
          message.error(response.message || '服务器错误');
        }
      } else {
        message.error('服务器错误');
      }
    },
  },
  reducers: {
    saveState(state, {
      payload
    }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
