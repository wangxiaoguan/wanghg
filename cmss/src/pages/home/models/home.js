import { getNews, getData, getUser, getPartyDetail, getQualityDetail } from '@/services/home';
import { getCurrentDate } from '@/utils/utils';

export default {
  namespace: 'home',

  state: {
    partyList: [],
    qualityList: [],
    userInfo: {},
    partyDetail: {},
    qualityDetail: {},
    // 事项提醒
    informationList: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: {}, 99: 0 },
  },

  effects: {
    *getNewList({ payload, callback }, { call, put }) {
      const response = yield call(getNews, payload);
      if (response && JSON.stringify(response) !== '{}' && response.resultMap) {
        const newList = response.resultMap.newsList;
        const now = getCurrentDate(0).slice(0, 10);
        for (let i = 0; i < newList.length; i++) {
          const update = newList[i].createDate.slice(0, 10);
          newList[i].hasNew = now === update;
          newList[i].updateTime = newList[i].createDate.slice(0, 7);
        }
        callback(newList);
      }
    },
    *getImgs({ payload, callback }, { call, put }) {
      const response = yield call(getNews, payload);
      if (response && JSON.stringify(response) !== '{}' && response.resultMap) {
        callback(response.resultMap.objectList);
      }
    },
    *getUser({ payload, callback }, { call, put }) {
      const response = yield call(getUser, payload);
      yield put({
        type: 'changeNavList',
        payload: { userInfo: response },
      });
      callback(response);
    },
    *getPartyDetail({ payload, callback }, { call, put }) {
      const response = yield call(getPartyDetail, payload);
      yield put({
        type: 'changeNavList',
        payload: { partyDetail: response },
      });
      callback(response);
    },
    // 获取任务数量
    *getTaskCount({ payload }, { call, put }) {
      const response = yield call(getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        // callBack(response);
        if (response.code === '0') {
          yield put({
            type: 'changeNavList',
            payload: { informationList: response.resultMap },
          });
        }
      }
    },

    *getQualityDetail({ payload, callback }, { call, put }) {
      const response = yield call(getQualityDetail, payload);
      yield put({
        type: 'changeNavList',
        payload: { qualityDetail: response },
      });
      callback(response);
    },

    // 获取用户层级
    *getUserLevel({ payload, callBack }, { call }) {
      const response = yield call(getData, payload);
      if (response && JSON.stringify(response) !== '{}' && response.resultMap) {
        // 对数据进行处理
        const postList = [];
        for (let i = 0; i < response.resultMap.postInfo.length; i++) {
          const item = response.resultMap.postInfo[i];
          postList.push({
            value: item.partyId,
            label: `${item.fullName}${item.postName}`,
            level: item.level,
            subLevel: item.subLevel !== undefined ? item.subLevel : '',
            index: i + 1,
            totalName: item.totalName,
          });
        }
        callBack(postList);
      }
    },
  },

  reducers: {
    changeNavList(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
