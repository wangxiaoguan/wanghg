import * as detailsServices from '../../../services/detail';
import { message } from 'antd';
import commenConfig from '../../../../config/commenConfig';

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
  namespace: 'questionnaireModel',

  state: {
    memberList: [], // 活动参与人员
    visible: '', // modal是否可见
    questionnaireList: [],// 投票结果
    JoinRateList: [],
  },

  effects: {
    // 获取活动人员
    * getActivityMembers({ payload, callBack }, { call, put }) {
      const response = yield call(detailsServices.getActivityMembers, payload);
      if (checkResp(response) && response.resultMap) {
        const { objList = [] } = response.resultMap;
        const data = [];
        for (let i = 0; objList && i < objList.length; i += 1) {
          data.push({
            avatar: `${commenConfig.downPath}/${objList[i].txpic}`,
            name: objList[i].name,
          });
        }
        yield put({
          type: 'saveState',
          payload: {
            memberList: data,
            visible: 'members',
          },
        });
      }
    },

    * getQuestionnaire({ payload }, { call, put }) {
      const response = yield call(detailsServices.getActivityMembers, payload);
      if (checkResp(response)) {
        let topicList = [];
        if (response.resultMap.topicList) {
          topicList = response.resultMap.topicList;
        }
        yield put({
          type: 'saveState',
          payload: {
            visible: 'question', questionnaireList: topicList,
          },
        });
      }
    },

    * getDepartmentJoinRate({ payload }, { call, put }) {
      const response = yield call(detailsServices.getActivityMembers, payload);
      if (checkResp(response)) {
        const { statistics } = response.resultMap;
        const data = [];
        for (let i = 0; statistics && i < statistics.length; i += 1) {
          data.push({
            title: `${statistics[i].department}`,
            totalNum: statistics[i].totalNum,
            joinNum: statistics[i].joinNum,
            percent: statistics[i].totalNum
              ? Math.round((statistics[i].joinNum * 100) / statistics[i].totalNum)
              : 0,
          });
        }
        yield put({
          type: 'saveState',
          payload: {
            visible: 'joinRate',
            JoinRateList: data,
          },
        });
      }
    },

  },
  reducers: {
    saveState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
