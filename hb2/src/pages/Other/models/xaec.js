import { cloneDeep, forEach } from 'lodash';

import { message } from 'antd';
import { query, remove, add, update, queryGroup, check } from '../../../services/xaec';

const judge = (response) => {
  if (response && response.data) {
    return true;
  }
  // message.error(`出错了`);
  return false;
};

const orgsToTree = (orgs, children = 'children') => {
  const data = cloneDeep(orgs);
  const result = [];
  const hash = {};
  data.forEach((item, index) => {
    hash[data[index].id] = data[index];
  });

  data.forEach(o => {
    const parentNode = hash[o.parentId];
    const isRoot = o.parentId === 0;
    if (!isRoot && !parentNode) {
      // 既不是根节点，也没有父节点
      return;
    }
    if (!isRoot && parentNode) {
      if (!parentNode[children]) parentNode[children] = [];
      parentNode[children].push(o);
    } else {
      result.push(o);
    }
  });
  return result;
};

const updateTree = (ctree, cnode, type) => {
  // type 1 增加 2 修改 3 删除
  if (!(ctree && cnode)) {
    return;
  }
  const tree = ctree;
  const node = cnode;
  tree.forEach((item, index) => {
    if (!item) {
      // return undefined;
    } else if (type === 1) {
      if (node.parentId === item.id) {
        const data = item;
        if (!data.children) {
          data.children = [];
        }
        data.children.push(node);
        tree[index] = data;
      } else if (item.children) {
        updateTree(item.children, node, type);
      }
    } else if (item.id === node.id) {
      if (type === 2) {
        node.children = item.children;
        tree[index] = node;
      } else if (type === 3) {
        tree[index] = undefined;
      }
    } else if (item.children) {
      updateTree(item.children, node, type);
    }
  });
};

export default {
  namespace: 'xaec',

  state: {
    data: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
      },
    },
    group: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, {
        'Q=parentId_L_EQ': 0,
        current: 1,
        pageSize: 10,
        ...payload,
      });
      if (judge(response)) {
        const pd = {
        list: response.data,
        pagination: {
          current: response.page,
          pageSize: response.pageSize,
          total: response.length,
        },
      };
      yield put({
        type: 'save',
        payload: pd,
      });
      }
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call }) {
      yield call(remove, payload);
      if (callback) callback();
    },
    *fetchGroup({ payload }, { call, put }) {
      const response = yield call(queryGroup, payload);
      yield put({
        type: 'saveGroup',
        payload: response,
      });
    },
    *check({ payload, callback }, { call }) {
      const response = yield call(check, payload);
      const has = response && response.length > 0;
      if (callback) callback(has);
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        data: payload,
      };
    },
    saveGroup(state, { payload }) {
      const groupMap = {};
      forEach(payload, o => {
        groupMap[o.id] = o;
      });
      const group = orgsToTree(payload);
      return {
        ...state,
        group,
        groupMap,
      };
    },
    updateLocal(state, { payload }) {
      const { groupMap, group } = state;
      const { item, type } = payload;
      updateTree(state.group, item, type);
      if (type === 3) {
        groupMap[item.id] = undefined;
      } else {
        groupMap[item.id] = item;
      }
      return {
        ...state,
        group,
        groupMap,
      };
    },
  },
};
