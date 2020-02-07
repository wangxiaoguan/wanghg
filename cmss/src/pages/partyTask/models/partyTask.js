import { partyTaskData, taskList } from './../partyTaskData';
import * as partyTaskServices from '@/services/partyTask';

const getLabelByCode = (type, code) => {
  const list = [
    { value: 1, label: '未开始' },
    { value: 2, label: '进行中' },
    { value: 3, label: '已截止' },
  ];
  let labelL = '';
  for (let i = 0; i < list.length; i++) {
    if (code === list[i].value) {
      labelL = list[i].label;
      break;
    }
  }
  return labelL;
};

const getTopicName = (list, id) => {
  for (let i = 0; i < list.length; i += 1) {
    if (list[i].id === id) {
      return list[i].name;
    }
  }
  return '';
};

export default {
  namespace: 'partyTask',

  state: {
    isSend: false,
    upPartyIdIndex: 1,
    upPartyId: '',
    currentUrl: '',
    navList: partyTaskData,
    taskList,
    total: 0,
    tableList: [],
    infoList: [],
    taskTopicList: [],
    tansmitDetail: {},
    tansmitAttachList: [],
    postInfo: [],
  },

  effects: {
    // 获取类型列表（带缓存）
    *getTypeList({ payload, callBack }, { call }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}' && response.resultMap) {
        const { typeList } = response.resultMap;
        callBack(typeList);
      }
    },

    *getThemTypeList({ payload, callBack }, { call }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}' && response.code === '0') {
        const { topicList } = response.resultMap;
        callBack(topicList);
      }
    },
    *getSeekTableData({ payload, callBack }, { call }) {
      // console.log('payload', payload);
      const response = yield call(partyTaskServices.getSeekTableData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response.resultMap);
      }
    },
    *getTableData({ payload }, { call, put, select }) {
      yield put({
        type: 'setTableList',
        payload: {
          tableList: [],
          total: 0,
        },
      });
      const response = yield call(partyTaskServices.getTableData, payload);
      const taskTopicList = yield select(state => state.partyTask.taskTopicList);
      if (response && JSON.stringify(response) !== '{}' && response.resultMap) {
        // 对表格数据进行处理
        const tableList = response.resultMap.taskList;
        const currentPage = JSON.parse(payload.text).index;
        for (let i = 0; i < tableList.length; i++) {
          tableList[i].statusDesp = getLabelByCode('taskStatus', tableList[i].timeStatus);
          tableList[i].index = (currentPage - 1) * 10 + i + 1;
          tableList[i].key = (currentPage - 1) * 10 + i + 1;
          tableList[i].topicName = getTopicName(taskTopicList, tableList[i].topicId);
          // 兼容IE浏览器
          tableList[i].endDate = tableList[i].endDate.slice(0, 16);
          tableList[i].startDate = tableList[i].startDate.slice(0, 16);
          tableList[i].year = tableList[i].createDate.slice(0, 4);
          tableList[i].createDate = tableList[i].createDate.slice(0, 16);
        }
        yield put({
          type: 'setTableList',
          payload: {
            tableList,
            total: response.resultMap.total,
          },
        });
      }
    },

    *uploadFile({ payload, callBack }, { call }) {
      const response = yield call(partyTaskServices.uploadFile, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      } else {
        callBack({});
      }
    },
    // 获取用户层级（带缓存）
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
        yield put({
          type: 'setTableList',
          payload: {
            taskTopicList: response.resultMap.taskTopicList,
            postInfo: response.resultMap.postInfo,
          },
        });
        callBack(postList);
      }
    },

    // 获取用户层级（带缓存）
    *getThematicList({ payload, callBack }, { call }) {
      const response = yield call(partyTaskServices.getDataCached, payload);
      if (response && JSON.stringify(response) !== '{}' && response.resultMap) {
        // 对数据进行处理
        const { taskSceneList, postInfo } = response.resultMap;
        let themeList = [];
        for (let i = 0; i < taskSceneList.length; i++) {
          if (taskSceneList[i].id === '6') {
            themeList = taskSceneList[i].taskSceneClassifyList;
          }
        }
        callBack(themeList, postInfo);
      }
    },

    *getPartys({ payload, callBack }, { call }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        const partys = response.resultMap;
        callBack(partys);
      }
    },

    *getPartySynchro({ payload, callBack }, { call }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}' && response.resultMap) {
        const partys = response;
        callBack(partys);
      }
    },

    *estimate({ payload, callBack }, { call }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      }
    },

    *sendReceipt({ payload, callBack }, { call }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && response.code === '0') {
        callBack(response.resultMap);
      }
    },

    *returnReceipt({ payload, callBack }, { call }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      }
    },

    *getRelevance({ payload, callBack }, { call }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        const relevance = response.resultMap.obj;
        callBack(relevance);
      }
    },

    *getPartySynchroAll({ payload, callBack }, { call }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}' && response.resultMap) {
        const partys = response;
        callBack(partys);
      }
    },

    *getTaskDetail({ payload, callback }, { call }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && response.code === '0') {
        callback(response.resultMap);
      }
    },

    *remindTask({ payload, callback }, { call }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callback(response);
      }
    },

    *getReceipt({ payload, callBack }, { call }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && response.code === '0') {
        callBack(response.resultMap);
      }
    },
    *sendTask({ payload, callBack }, { call, put }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        yield put({
          type: 'setIsSend',
          payload: {
            isSend: true,
          },
        });
        callBack(response);
      }
    },
    *editTask({ payload, callBack }, { call }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      }
    },

    // 删除任务
    *deleteTask({ payload, callBack }, { call }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callBack(response);
      }
    },

    *getTaskComplete({ payload, callback }, { call }) {
      const response = yield call(partyTaskServices.getData, payload);
      // console.log(response);
      if (response && JSON.stringify(response) !== '{}' && response.code === '0') {
        callback(response.resultMap);
      }
    },
    *exportExcel({ payload, callback }, { call }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}') {
        callback(response);
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
    setTableList(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setUpPartyId(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setIsSend(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear() {
      return {
        isSend: false,
        upPartyIdIndex: 1,
        upPartyId: '',
        currentUrl: '',
        navList: partyTaskData,
        taskList,
        total: 0,
        tableList: [],
        infoList: [],
        taskTopicList: [],
        tansmitDetail: {},
        postInfo: [],
        tansmitAttachList: [],
      };
    },
  },
};
