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
  namespace: 'applyActivityModel',

  state: {
    userInfoList:[],
    memberList:[], // 活动参与人员
    visible: false, // modal是否可见
    editModal: false, // 编辑框
    memberListVisible: false, // 活动人员列表
  },

  effects: {
    // 参加活动
    *joinActivity({ payload }, { call,put }) {
      const response = yield call(detailsServices.joinActivity, payload);
      if(checkResp(response)){
        message.success('您已成功参加活动');
        yield put({
          type: 'saveState',
          payload: {
            editModal: false,
            visible: false
          },
        });
        yield put({
          type: 'activityDetailModel/saveState',
          payload: {
            isJoin: true,
            isCan: false
          }
        })
      }
    },

    // 参加活动
    *updateActivityInfo({ payload }, { call,put }) {
      const response = yield call(detailsServices.joinActivity, payload);
      if(checkResp(response)){
        message.success('修改信息成功');
        yield put({
          type: 'saveState',
          payload: {
            editModal: false,
            visible: false
          },
        });
      }
    },

    // 退出活动
    *exitActivity({ payload }, { call,put }) {
      const response = yield call(detailsServices.exitActivity, payload);
      if(checkResp(response)){
        message.success('您已成功退出活动')
        yield put({
          type: 'activityDetailModel/saveState',
          payload: {
            isJoin: false,
            isCan: true,
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
             memberListVisible: true,
           }
         })
      }
    },
    // 获取用户信息
    *getActivityUserInfo({ payload }, { call,put }) {
      const response = yield call(detailsServices.getActivityMembers, payload);
      if(checkResp(response)){
        let list = [];
        if (response.resultMap.userinfolist) {
          list = JSON.parse(response.resultMap.userinfolist);
        }
        yield put({
          type: 'saveState',
          payload: {
            userInfoList: list,
            editModal: true,
          },
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
