import * as onlineExamServices from '../../../services/onlineExamServices';
import * as detailsServices from '../../../services/detail';

export default {
  namespace: 'onlineExam',
  state: {
    activeDetail: {},
    opinionLists: [],
    activityDetail:{}
  },

  effects: {
    *getonlineExam({ payload, callBack }, { call, put }) {
      console.log(onlineExamServices.getonlineExam)
      console.log(call)
      const response = yield call(onlineExamServices.getonlineExam, payload);
      if (response && JSON.stringify(response) !== '{}') {
        yield put({
          type: 'updateState',
          payload: {
            activityDetail: response.resultMap || {}
          }
        })
        if (response.code === '0') {
          const { topicList } = response.resultMap;
          const opinionLists = [];
          console.log('topicList===', topicList);
          if (topicList) {
            for (let i = 0; i < topicList.length; i += 1) {
              if (topicList[i].type === 1 || topicList[i].type === 2) {
                for (let k = 0; k < topicList[i].optionList.length; k += 1) {
                  if (topicList[i].optionList[k].isBlank) {
                    opinionLists.push(topicList[i].optionList[k].id);
                  }
                }
              }
            }
          }
          console.log('opinionLists===', opinionLists);
          // yield put({
          //   type: 'updateState',
          //   payload: {
          //     activeDetail: response.resultMap,
          //     opinionLists,
          //   },
          // });
        }
        callBack(response);
      }
    },
    *getJoinExam({ payload, callBack }, { call }) {
      const response = yield call(onlineExamServices.getJoinExam, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      }
    },
    *getJoinRadomExam({ payload, callBack }, { call }) {
      const response = yield call(onlineExamServices.getJoinRadomExam, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      }
    },
    *viewExam({ payload, callBack }, { call }) {
      const response = yield call(onlineExamServices.viewExam, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      }
    },

    *joinActivity({ payload, callBack }, { call }) {
      const response = yield call(detailsServices.joinActivity, payload);
      callBack(response);
    },

    *exitActivity({ payload, callBack }, { call }) {
      const response = yield call(detailsServices.exitActivity, payload);
      callBack(response);
    },

    *JoinExamSubmit({ payload, callBack }, { call }) {
      const response = yield call(onlineExamServices.JoinExamSubmit, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      }
    },
    *viewExamScore({ payload, callBack }, { call }) {
      const response = yield call(onlineExamServices.viewExamScore, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      }
    },

    *getActivityMenmbers({ payload, callBack }, { call }) {
      const response = yield call(detailsServices.getActivityMembers, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      }
    },
    *getQuestionnaire({ payload, callBack }, { call }) {
      const response = yield call(detailsServices.getActivityMembers, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      }
    },
    *getDepartmentJoinRate({ payload, callBack }, { call }) {
      const response = yield call(detailsServices.getActivityMembers, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      }
    },

    *getDepartmentScore({ payload, callBack }, { call }) {
      const response = yield call(detailsServices.getActivityMembers, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      }
    },

    *getStudyRank({ payload, callBack }, { call }) {
      const response = yield call(detailsServices.getActivityMembers, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      }
    },

    *getActivityUserInfo({ payload, callBack }, { call }) {
      const response = yield call(detailsServices.getActivityMembers, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      }
    },
    *getVoteResult({ payload, callBack }, { call }) {
      const response = yield call(detailsServices.getActivityMembers, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      }
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
