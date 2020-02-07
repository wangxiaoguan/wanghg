import { getThematicNavList } from '@/services/thematicEducation';
import * as partyTaskServices from '@/services/partyTask';

const taskList = [
  { value: 1, label: '全部' },
  { value: 2, label: '进行中' },
  { value: 3, label: '已截止' },
  { value: 4, label: '未开始' },
];

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
  namespace: 'thematicEducation',

  state: {
    taskList,
    navList: [],
    total: 0,
    tableList: [],
    taskTopicList: [],
  },

  effects: {
    *getTypeList({ payload, callBack }, { call }) {
      const response = yield call(partyTaskServices.getDataCached, payload);
      if (response && JSON.stringify(response) !== '{}') {
        const { typeList } = response.resultMap;
        callBack(typeList);
      }
    },

    // 获取用户层级
    *getUserLevel({ payload, callBack }, { call, put }) {
      const response = yield call(partyTaskServices.getData, payload);
      if (response && JSON.stringify(response) !== '{}' && response.resultMap) {
        // console.log('response', response);
        // 对数据进行处理
        const { taskSceneList, postInfo, taskTopicList } = response.resultMap;
        let themeList = [];
        const postList = [];
        for (let i = 0; i < taskSceneList.length; i++) {
          if (taskSceneList[i].id === '6') {
            themeList = taskSceneList[i].taskSceneClassifyList;
          }
        }
        for (let i = 0; i < postInfo.length; i++) {
          const item = postInfo[i];
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
          type: 'setState',
          payload: {
            taskTopicList,
          },
        });
        callBack(themeList, postList);
      }
    },

    *getThematicNavList({ payload, callback }, { call, put }) {
      const response = yield call(getThematicNavList, payload);
      if (response && JSON.stringify(response) !== '{}' && response.resultMap) {
        const list = response.resultMap.eduMenuList;
        const taskList = [];
        const seekList = [];
        for (let i = 0; i < list.length; i += 1) {
          if (list[i].type === '1') {
            taskList.push(list[i]);
          } else {
            seekList.push(list[i]);
          }
        }
        callback && callback([...taskList, ...seekList]);
        yield put({
          type: 'setState',
          payload: { navList: [...taskList, ...seekList] },
        });
      }
    },

    //  获取我的任务列表数据
    *getTableData({ payload }, { call, put, select }) {
      yield put({
        type: 'setState',
        payload: {
          tableList: [],
          total: 0,
        },
      });
      const response = yield call(partyTaskServices.getTableData, payload);
      const taskTopicList = yield select(state => state.thematicEducation.taskTopicList);
      if (response && JSON.stringify(response) !== '{}' && response.resultMap) {
        // 对表格数据进行处理
        const tableList = response.resultMap.taskList;
        const currentPage = JSON.parse(payload.text).index;
        for (let i = 0; i < tableList.length; i++) {
          tableList[i].statusDesp = getLabelByCode('taskStatus', tableList[i].timeStatus);
          tableList[i].index = (currentPage - 1) * 10 + i + 1;
          tableList[i].key = (currentPage - 1) * 10 + i + 1;
          tableList[i].topicName = getTopicName(taskTopicList, tableList[i].topicId);
          // 时间格式兼容IE浏览器
          tableList[i].endDate = tableList[i].endDate.slice(0, 16);
          tableList[i].year = tableList[i].createDate.slice(0, 4);
          tableList[i].createDate = tableList[i].createDate.slice(0, 16);
        }
        yield put({
          type: 'setState',
          payload: {
            tableList,
            total: response.resultMap.total,
          },
        });
      }
    },
  },

  reducers: {
    setState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
