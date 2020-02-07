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
  namespace: 'examActivityModel',
  state: {
    JoinRateList: [],
    scoreList: [],
    userRankList: [],
    visible: ''
  },

  effects: {
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

    * getDepartmentScore({ payload }, { call,put }) {
      const response = yield call(detailsServices.getActivityMembers, payload);
      if (checkResp(response)) {
        const { statistics } = response.resultMap;
        const data = [];
        for (let i = 0; statistics && i < statistics.length; i += 1) {
          data.push({
            title: `${statistics[i].department}`,
            number: statistics[i].joinNum,
            score: statistics[i].avgScore ? Number(statistics[i].avgScore.toFixed(1)) : 0,
          });
        }
        yield put({
          type: 'saveState',
          payload: {
            visible: 'score',
            scoreList: data
          }
        })
      }
    },

    * getStudyRank({ payload }, { call,put }) {
      const response = yield call(detailsServices.getActivityMembers, payload);
      if(checkResp(response)){
        const { userRankInfos } = response.resultMap;
        const data = [];
        for (let i = 0; userRankInfos && i < userRankInfos.length; i += 1) {
          data.push({
            name: userRankInfos[i].name,
            rate: i + 1,
            score: userRankInfos[i].score,
            avatar: `${commenConfig.downPath}/${userRankInfos[i].txpic}`,
          });
        }
        yield put({
          type: 'saveState',
          payload: {
            visible: 'rank',
            userRankList: data
          }
        })
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
