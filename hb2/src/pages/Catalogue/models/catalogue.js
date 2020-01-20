import {
  getCatlogues,
  createCatlogue,
  updateCatlogue,
  delCatlogue,
  statusCatlogues,
  getLoadCanBindRoleByDirId,
  getLoadBindedLoadByDirId,
  bindRolesOrUnbindRolesByDirId,
} from '@/services/catalogue';
import { cloneDeep, forEach } from 'lodash';
import { message } from 'antd';
import { getLookUp } from '@/services/xaec';

const listToTree = (orgs, children = 'children') => {
  const data = cloneDeep(orgs);
  const result = [];
  const hash = {};
  data.forEach((item, index) => {
    hash[data[index].id] = data[index];
  });

  data.forEach(o => {
    const parentNode = hash[o.parentSysMenuId];
    const isRoot = o.parentSysMenuId === 0;
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

const updateTre = (ctree, cnode, type) => {
  // type 1 增加 2 修改 3 删除
  if (!(ctree && cnode)) {
    return;
  }
  const tree = ctree;
  const node = cnode;
  tree.forEach((item, index) => {
    if (item) {
      if (type === 1) {
        if (node.parentSysMenuId === item.id) {
          const data = item;
          if (!data.children) {
            data.children = [];
          }
          data.children.push(node);
          tree[index] = data;
        } else if (item.children) {
          updateTre(item.children, node, type);
        }
      } else if (item.id === node.id) {
        if (type === 2) {
          node.children = item.children;
          tree[index] = node;
        } else if (type === 3) {
          tree.splice(index, 1);
        }
      } else if (item.children) {
        updateTre(item.children, node, type);
      }
    }
  });
};

const listToMap = list => {
  const groupMap = {};
  forEach(list, o => {
    groupMap[o.id] = o;
  });
  return groupMap;
};

const judge = ({ code, msg } = {}) => {
  if (code === 200) {
    return true;
  }
  // message.error(`出错了${msg===undefined ? '': msg}`);
  return false;
};

const statusOpts = [
  {
    code: '1',
    desp: '启用',
  },
  {
    code: '0',
    desp: '关闭',
  },
];

const menuTypeOpts = [
  {
    code: '01',
    desp: '目录类型1',
  },
  {
    code: '02',
    desp: '目录类型2',
  },
  {
    code: '03',
    desp: '目录类型3',
  },
];

const menus = [
  {
    label: '角色绑定',
    value: '1',
  },
];

export default {
  namespace: 'authcata',

  state: {
    group: [],
    statusOpts,
    menuTypeOpts,
    menus,
    groupMap: {},
    selectedKeys: [],
    isAdd: false,
    roleCanBinds: [],
    roleBindeds: [],
    roleSelecteds: [],
    roleNoSelecteds: [],
    roleSelectedIds: [],
    bindRoleDirId: undefined,
    rightClickNodeTreeItem: {},
    roleVisible: false,
  },

  effects: {
    *fetch(_, { put, call }) {
      const response = yield call(getCatlogues);
      const param = 'SYSMENUTYPE';
      const sysMenuTypes = yield call(getLookUp, param);
      const menuTypeOpts = sysMenuTypes;
      if (judge(response)) {
        const { data } = response;
        const group = listToTree(data);
        const groupMap = listToMap(data);
        yield put({
          type: 'updateLocal',
          payload: { group, groupMap, menuTypeOpts },
        });
      }
    },
    *add({ payload }, { put, call }) {
      const response = yield call(createCatlogue, payload);
      if (judge(response)) {
        const { data } = response;
        yield put({
          type: 'updateTree',
          payload: { item: data, type: 1 },
        });
        message.success('新增目录成功');
      }
    },
    *update({ payload }, { put, call }) {
      const response = yield call(updateCatlogue, payload);
      if (judge(response)) {
        const { data } = response;
        yield put({
          type: 'updateTree',
          payload: { item: data, type: 2 },
        });
        message.success('更新目录成功');
      }
    },
    *remove({ payload }, { put, call }) {
      const response = yield call(delCatlogue, payload.id);
      if (judge(response)) {
        yield put({
          type: 'updateTree',
          payload: { item: payload, type: 3 },
        });
      }
      message.success('删除目录成功');
    },
    *batch({ payload, callback }, { call }) {
      const response = yield call(statusCatlogues, payload);
      if (callback) callback(judge(response));
      if (payload.status === 1) {
        message.success('批量启用目录成功');
      } else {
        message.success('批量禁用目录成功');
      }
    },
    *loadCanBindRole({ payload, callback }, { call, put }) {
      const response = yield call(getLoadCanBindRoleByDirId, payload);
      if (judge(response)) {
        const { data } = response;
        yield put({
          type: 'updateLocal',
          payload: { roleCanBinds: data.data },
        });
        yield put({
          type: 'loadBindedLoad',
          payload,
          callback,
        });
      }
    },
    *loadBindedLoad({ payload, callback }, { call, put }) {
      const response = yield call(getLoadBindedLoadByDirId, payload);
      if (judge(response)) {
        const { data } = response;
        const roleSelectedIds = [];
        for (let i = 0; i < data.data.length; i += 1) {
          const item = data.data[i];
          roleSelectedIds.push(item.roleId);
        }
        yield put({
          type: 'updateLocal',
          payload: {
            roleVisible: true,
            roleBindeds: data.data,
            bindRoleOrgId: payload.orgId,
            roleSelectedIds,
          },
        });
        if (callback) callback();
      }
    },
    *bindRolesOrUnbindRolesByDirIds({ payload, callback }, { call, put }) {
      const response = yield call(bindRolesOrUnbindRolesByDirId, payload);
      if (judge(response)) {
        yield put({
          type: 'updateLocal',
          payload: {
            roleVisible: false,
            roleSelecteds: [],
            roleNoSelecteds: [],
            roleCanBinds: [],
            roleBindeds: [],
            bindRoleOrgId: undefined,
          },
        });
        if (callback) callback();
        message.success('目录角色绑定或解绑成功');
      } else {
        message.error('目录角色绑定或解绑失败');
      }
    },
  },

  reducers: {
    updateTreeSelected(state, { payload }) {
      const selectedKeys = payload;
      const curItem = state.groupMap[selectedKeys[0]];
      return {
        ...state,
        selectedKeys,
        isAdd: false,
        rightClickTreeItem: {},
        curItem,
      };
    },
    updateTree(state, { payload }) {
      const { groupMap, group } = state;
      const { item, type } = payload;
      // console.log(payload);
      const params = {};
      updateTre(group, item, type);
      if (type === 3) {
        delete groupMap[item.id];
        params.selectedKeys = [];
        params.curItem = undefined;
      } else {
        groupMap[item.id] = item;
        if (type === 2) {
          params.curItem = item;
        } else if (type === 1) {
          params.isAdd = false;
        }
      }
      return {
        ...state,
        group,
        groupMap,
        ...params,
      };
    },
    updateLocal(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
