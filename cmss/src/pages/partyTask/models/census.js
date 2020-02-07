/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
import * as partyTaskServices from '@/services/partyTask';

const Status = {
  taskStatus: [
    { value: 2, label: '进行中' },
    { value: 3, label: '已完成' },
    { value: 4, label: '未完成' },
  ],
  bgColor: [
    { value: 2, label: 'rgba(255, 174, 0, 1)' },
    { value: 3, label: 'rgba(54, 153, 255, 1)' },
    { value: 4, label: 'rgba(187, 187, 187, 1)' },
  ],
  tackClass: [
    { value: 1, label: '支部党员大会' },
    { value: 2, label: '党支部委员会' },
    { value: 3, label: '党小组会' },
    { value: 4, label: '党课' },
    { value: 5, label: '其他任务' },
    { value: 99, label: '重要工作部署' },
  ],
  taskType: [
    { value: 1, label: '支部党员大会' },
    { value: 2, label: '党支部委员会' },
    { value: 3, label: '党小组会' },
    { value: 4, label: '党课' },
    { value: 5, label: '其他任务' },
    { value: 99, label: '重要工作部署' },
  ],
};

const getLabelByCode = (type, code) => {
  const list = Status[type];
  let labelL = '';
  for (let i = 0; i < list.length; i += 1) {
    if (code === list[i].value) {
      labelL = list[i].label;
      break;
    }
  }
  return labelL;
};

const loopUrl = task => {
  try {
    let type = 'deployment';
    if (Number(task.topicId) === 99 || (Number(task.topicId) >= 1 && Number(task.topicId) >= 4)) {
      type = 'deployment';
    }
    if (Number(task.topicId) === 5) {
      type = 'normalTask';
    }
    if (task.eduId && task.eduId !== '') {
      type = 'education';
    }
    const url = `${type}/${type === 'education' ? task.eduId : task.topicId}/detail?taskId=${
      task.id
    }&upPartyId=${task.upPartyId}&isSend=1`;
    return url;
  } catch (error) {
    return '';
  }
};

const getTaskList = response => {
  const allData = response.resultMap;
  const { taskList, totalPercentList } = allData;
  for (let i = 0; i < taskList.length; i += 1) {
    taskList[i].index = i + 1;
    taskList[i].rate = `${taskList[i].allPartyCount}/${taskList[i].allMemCount}`;
    taskList[i].taskStatus = getLabelByCode('taskStatus', taskList[i].status);
    taskList[i].taskTheme = getLabelByCode('tackClass', taskList[i].topicId);
    taskList[i].loopUrl = loopUrl(taskList[i]);
  }
  for (let i = 0; i < totalPercentList.length; i += 1) {
    totalPercentList[i].label = getLabelByCode('taskStatus', totalPercentList[i].status);
    totalPercentList[i].value = totalPercentList[i].num;
    totalPercentList[i].color = getLabelByCode('bgColor', totalPercentList[i].status);
  }
  return {
    allData,
    taskList,
    totalPercentList,
  };
};

// 获取柱状图数据
const getBarData = typeNumList => {
  let xData = [];
  const pieData = [];
  let did = {
    label: '进行中',
    data: [],
  };
  let end = {
    label: '已完成',
    data: [],
  };
  let run = {
    label: '未完成',
    data: [],
  };
  for (let i = 0; i < typeNumList.length; i += 1) {
    xData.push(typeNumList[i].name);
    if (typeNumList[i][2]) {
      did.data.push(typeNumList[i][2]);
    } else {
      did.data.push(0);
    }
    if (typeNumList[i][3]) {
      end.data.push(typeNumList[i][3]);
    } else {
      end.data.push(0);
    }
    if (typeNumList[i][4]) {
      run.data.push(typeNumList[i][4]);
    } else {
      run.data.push(0);
    }
  }
  pieData.push(did, end, run);
  return { pieData, xData };
};

export default {
  namespace: 'census',
  state: {
    taskList: [], // 主题教育
    meetTaskList: [], //三会一课
    normalTaskList: [], //其他任务
    imTaskList: [], //重要工作部署
    allData: [],
    totalPercentList: [],
    meetTotalPercentList: [],
    normalTotalPercentList: [],
    imTotalPercentList: [],
    downPartyList: [], //三会一课各级党组织
    levelDate: [],
    sendTotal: [],
    userLevel: [],
    taskClass: ['支部党员大会', '党支部委员会', '党小组会', '党课', '重要工作部署'],
    //四种类型饼图数据
    pieData: [],
    meetPieData: [],
    imPieData: [],
    normalPieData: [],
    // 四种类型柱状图数据
    xData: [],
    imData: [],
    normalData: [],
    meetData: [],
    importantList: [], // 重要工作完成情况列表
  },

  effects: {
    *getCensus({ payload }, { call, put }) {
      yield put({
        type: 'setState',
        payload: {
          taskList: [],
          totalPercentList: [],
          pieData: [],
          xData: [],
        },
      });
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        const payload = getTaskList(response);
        const barDate = getBarData(response.resultMap.typeNumList || []);
        yield put({
          type: 'setState',
          payload: {
            ...payload,
            ...barDate,
          },
        });
      }
    },

    // 重要工作部署
    *getImCensus({ payload }, { call, put }) {
      const imResponse = yield call(partyTaskServices.getData, payload);
      if (imResponse && JSON.stringify(imResponse) !== '{}') {
        const payload = getTaskList(imResponse);
        const barDate = getBarData(imResponse.resultMap.typeNumList || []);
        yield put({
          type: 'setState',
          payload: {
            imTaskList: payload.taskList,
            imTotalPercentList: payload.totalPercentList,
            imPieData: barDate.pieData,
            imData: barDate.xData,
          },
        });
      }
    },

    // 三会一课
    *getMeetCensus({ payload }, { call, put }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        const payload = getTaskList(response);
        const barDate = getBarData(response.resultMap.typeNumList || []);
        yield put({
          type: 'setState',
          payload: {
            meetTaskList: payload.taskList,
            meetTotalPercentList: payload.totalPercentList,
            meetPieData: barDate.pieData,
            meetData: barDate.xData,
          },
        });
      }
    },

    // 其他任务
    *getNormalCensus({ payload }, { call, put }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        const payload = getTaskList(response);
        const barDate = getBarData(response.resultMap.typeNumList || []);
        yield put({
          type: 'setState',
          payload: {
            normalTaskList: payload.taskList,
            normalTotalPercentList: payload.totalPercentList,
            normalPieData: barDate.pieData,
            normalData: barDate.xData,
          },
        });
      }
    },

    //  获取 各级党组织任务执行情况
    *getAllRank({ payload }, { call, put }) {
      yield put({
        type: 'setAllRank',
        payload: {
          downPartyList: [],
        },
      });
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        const { downPartyList } = response.resultMap;
        yield put({
          type: 'setAllRank',
          payload: {
            downPartyList,
          },
        });
      }
    },

    //  获取 各级党组织任务执行情况
    *getLevelDetail({ payload }, { call, put }) {
      yield put({
        type: 'setAllRank',
        payload: {
          downPartyList: [],
        },
      });
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        const { downPartyList } = response.resultMap;
        for (let i = 0; i < downPartyList.length; i += 1) {
          downPartyList[i].index = i + 1;
        }
        yield put({
          type: 'setAllRank',
          payload: {
            downPartyList,
          },
        });
      }
    },

    // 党支部任务执行情况
    *getBranchDetail({ payload }, { call, put }) {
      yield put({
        type: 'setState',
        payload: {
          meetTaskList: [],
          meetTotalPercentList: [],
          meetPieData: [],
          meetData: [],
        },
      });
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        const { taskList, totalPercentList } = response.resultMap;
        for (let i = 0; i < taskList.length; i += 1) {
          taskList[i].index = i + 1;
          taskList[i].label = getLabelByCode('taskStatus', taskList[i].status);
          taskList[i].taskTheme = getLabelByCode('tackClass', taskList[i].topicId);
        }
        for (let i = 0; i < totalPercentList.length; i += 1) {
          totalPercentList[i].label = getLabelByCode('taskStatus', totalPercentList[i].status);
          totalPercentList[i].value = totalPercentList[i].num;
          totalPercentList[i].color = getLabelByCode('bgColor', totalPercentList[i].status);
        }
        const barDate = getBarData(taskList || []);
        yield put({
          type: 'setState',
          payload: {
            meetTaskList: taskList,
            meetTotalPercentList: totalPercentList,
            meetPieData: barDate.pieData,
            meetData: barDate.xData,
          },
        });
      }
    },

    //  获取重要工作部署完成情况
    *getImportantWork({ payload }, { call, put }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        const { dataList } = response.resultMap;

        for (let i = 0; i < dataList.length; i += 1) {
          dataList[i].index = i + 1;
          dataList[i].rate = `${dataList[i].memFinishCount}/${dataList[i].allMemCount}`;
          dataList[i].label = getLabelByCode('taskStatus', dataList[i].status);
        }
        yield put({
          type: 'ImportantWorkData',
          payload: {
            dataList,
          },
        });
      }
    },

    //  获取人员名单
    *getTaskUser({ payload }, { call }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        console.log(response);
      }
    },

    //  获取职务信息
    *getUserLevel({ payload, callBack }, { call, put }) {
      const response = yield call(partyTaskServices.getData, payload);
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

    // EXPORT_TASK   任务信息导出
    *exportFile({ payload, callBack }, { call }) {
      // console.log(payload);
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      }
    },

    // 获取类型列表
    *getTypeList({ payload, callBack }, { call }) {
      const response = yield call(partyTaskServices.getDataCached, payload);
      if (response && JSON.stringify(response) !== '{}') {
        const { typeList } = response.resultMap;
        callBack(typeList);
      }
    },
  },

  reducers: {
    getTabDate(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    setAllRank(state, { payload }) {
      return {
        ...state,
        downPartyList: payload.downPartyList,
      };
    },

    setLevelDate(state, { payload }) {
      return {
        ...state,
        levelDate: payload.downPartyList,
      };
    },

    BranchDetail(state, { payload }) {
      return {
        ...state,
        taskList: payload.taskList,
        totalPercentList: payload.totalPercentList,
      };
    },

    setBarData(state, { payload }) {
      return {
        ...state,
        pieData: payload.pieData,
        xData: payload.xData,
      };
    },

    ImportantWorkData(state, { payload }) {
      return {
        ...state,
        importantList: payload.dataList,
      };
    },

    setUserLevel(state, { payload }) {
      return {
        ...state,
        userLevel: payload.postInfo,
      };
    },
  },
};
