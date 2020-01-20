import { queryActivities } from '@/services/api';
import { cloneDeep, forEach } from 'lodash';

let tempIndexAdd = 110
const listToTree = (orgs, children = 'children') => {
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
      return undefined;
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
        tree.splice(index, 1)
      }
    } else if (item.children) {
      updateTree(item.children, node, type);
    }
  });
};

const listToMap = (list) => {
  const groupMap = {};
  forEach(list, o => {
    groupMap[o.code] = o
  })
  return groupMap
}

const groupList = [
  {
    id: 1,
    code: '1',
    title: '树1111',
    desp: '树1 desp',
    parentId: 0,
    status: '1',
  }, {
    id: 1.1,
    code: '1.1',
    title: '树1-1',
    desp: '树1-1 desp',
    parentId: 1,
    status: '1',
  }, {
    id: 1.2,
    code: '1.2',
    title: '树1-2',
    desp: '树1-2 desp',
    parentId: 1,
    status: '2',
  }, {
    id: 1.3,
    code: '1.3',
    title: '树1-3',
    desp: '树1-3 desp',
    parentId: 1,
    status: '1',
  }, {
    id: 1.4,
    code: '1.4',
    title: '树1-4',
    desp: '树1-4 desp',
    parentId: 1,
    status: '1',
  }, {
    id: 2,
    code: '2',
    title: '树2',
    desp: '树2 desp',
    parentId: 0,
    status: '2',
  }
]

const statusOpts = [
  {
    code: '1',
    desp: '启用'
  },
  {
    code: '2',
    desp: '禁用'
  }
]
export default {
  namespace: 'authcom',

  state: {
    group: listToTree(groupList),
    statusOpts: statusOpts,
    groupMap: listToMap(groupList),
    selectedKeys: [],
    isAdd: false,
  },

  effects: {
    *add({ payload }, { put }) {
      const {item} = payload
      tempIndexAdd += 1
      item.id = tempIndexAdd
      item.code = tempIndexAdd.toString()
      yield put({
        type: 'updateTree',
        payload: { item, type: 1 }
      });
    },
    *update({ payload }, { put }) {
      yield put({
        type: 'updateTree',
        payload: { item: payload.item, type: 2 }
      });
    },
    *remove({ payload }, { put }) {
      yield put({
        type: 'updateTree',
        payload: { item: payload.item, type: 3}
      });
    },
  },

  reducers: {
    updateTreeSelected (state, { payload }) {
      const selectedKeys = payload
      const curItem = state.groupMap[selectedKeys[0]]
      return {
        ...state,
        selectedKeys,
        isAdd: false,
        curItem
      }
    },
    updateTree (state, { payload }) {
      const { groupMap, group } = state
      const { item, type } = payload
      const params = {}
      updateTree(state.group, item, type);
      if (type === 3) {
        delete groupMap[item.code]
        params.selectedKeys = []
        params.curItem = undefined
      } else {
        groupMap[item.code] = item;
        if (type === 2) {
          params.curItem = item
        } else if (type === 1) {
          params.isAdd = false
        }
      }
      return {
        ...state,
        group,
        groupMap,
        ...params
      };
    },
    updateLocal (state, {payload}) {
      return {
        ...state,
        ...payload
      }
    },
  },
};
