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
  namespace: 'voteModel',

  state: {
    memberList:[], // 活动参与人员
    visible: '', // modal是否可见
    voteList: [],// 投票结果
  },

  effects: {
    // 参加活动
    *joinActivity({ payload }, { call,put }) {
      const response = yield call(detailsServices.joinActivity, payload);
      if(checkResp(response)){
        message.success('您已成功参加活动');
        yield put({
          type: 'activityDetailModel/saveState',
          payload: {
            isJoin: true,
            isCan: false
          }
        })
      }
    },

    // 获取活动人员
    *getActivityMembers({ payload, callBack }, { call, put }) {
      const response = yield call(detailsServices.getActivityMembers, payload);
      if(checkResp(response) && response.resultMap){
        const { objList=[] } = response.resultMap;
        const data = [];
        for (let i = 0; objList && i < objList.length; i += 1) {
          data.push({
            avatar: `${commenConfig.downPath}/${objList[i].txpic}`,
            name: objList[i].name,
          });
        }
        yield put({
          type:'saveState',
          payload: {
            memberList: data,
            visible: 'members',
          }
        })
      }
    },
    // 查看投票结果
    *getVoteResult({ payload }, { call,put }) {
      const response = yield call(detailsServices.getActivityMembers, payload);
      if(checkResp(response)){
        let list = [];
        let totalVote = 0;
        let data = [];
        if (response.resultMap.optionList) {
          list = response.resultMap.optionList;
          totalVote = response.resultMap.voteCount;
        }
        for (let i = 0; i < list.length; i += 1) {
          data.push({
            percent: totalVote ? Math.round((Number(list[i].selectcount) * 100) / totalVote) : 0,
            content: list[i].content,
            url: list[i].url,
          });
        }
        // this.setState({
        //   visible: 'vote',
        //   voteResult: { list: data, titleList: requestData.topicList },
        // });

        yield put({
          type: 'saveState',
          payload: {
            visible: 'vote',
            voteList: data,
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
