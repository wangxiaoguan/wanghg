import {
  getOrgs,
  getDeptListById,
  addOrg,
  updateOrg,
  deleteOrgById,
  getUsersByOrgId,
  getLoadCanBindRoleById,
  getLoadBindedLoadById,
  bindRolesOrUnbindRoles,
  getDictForOrgLevels,
} from '@/services/compdept';
import { cloneDeep, forEach } from 'lodash';
import { message } from 'antd';

const listToTree = (orgs, children = 'children') => {
  const data = cloneDeep(orgs);
  const result = [];
  const hash = {};
  data.forEach((item, index) => {
    hash[data[index].id] = data[index];
  });

  data.forEach(o => {
    const parentNode = hash[o.parentOrgId];
    if (parentNode) {
      if (!parentNode[children]) parentNode[children] = [];
      parentNode[children].push(o);
    } else {
      result.push(o);
    }
  });
  return result;
};

const getRootOrg = (orgs, children = 'children') => {
  const data = cloneDeep(orgs);
  const result = [];
  const hash = {};
  let orgRootId = 0;
  data.forEach((item, index) => {
    hash[data[index].id] = data[index];
  });
  data.forEach(o => {
    const parentNode = hash[o.parentOrgId];
    if (parentNode) {
      if (!parentNode[children]) parentNode[children] = [];
      parentNode[children].push(o);
    } else {
      result.push(o);
      orgRootId = o.id;
    }
  });
  return orgRootId;
};

const updateTre = (ctree, cnode, type, isRoot = false) => {
  // type 1 增加 2 修改 3 删除
  if (!(ctree && cnode)) {
    return;
  }
  const tree = ctree;
  const node = cnode;
  if (isRoot) {
    if (type === 1) {
      tree.push(node);
      return;
    }
  }
  tree.forEach((item, index) => {
    if (item) {
      if (type === 1) {
        if (node.parentOrgId === item.id) {
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
    groupMap[o.code] = o;
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

const menus = [
  {
    label: '新增单位',
    value: '1',
  },
  {
    label: '新增部门',
    value: '2',
  },
  {
    label: '修改',
    value: '3',
  },
  {
    label: '删除',
    value: '4',
  },
  {
    label: '查看用户',
    value: '5',
  },
  {
    label: '角色绑定',
    value: '6',
  },
];

export default {
  namespace: 'authcomdep',

  state: {
    group: [],
    groupMap: [],
    selectedKeys: [],
    roleCanBinds: [],
    roleBindeds: [],
    roleSelecteds: [],
    roleNoSelecteds: [],
    roleSelectedIds: [],
    bindRoleOrgId: undefined,
    rightClickNodeTreeItem: {},
    roleVisible: false,
    rootDepartMentId: undefined,
    canDeleteOrg: false,
    newOrUpdateDepartmentRootOrgId: undefined,
    orgLevels: [],
    orgStatus: [],
    menus,
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchUser({ payload }, { call, put }) {
      const response = yield call(getUsersByOrgId, payload);
      if (judge(response)) {
        const { data } = response;
        const result = {
          list: data.data || [],
          pagination: {
            total: data.length || 0,
            current: data.page || 1,
            pageSize: data.pageSize || 10,
          },
        };
        yield put({
          type: 'save',
          payload: result,
        });
      }
    },
    *loadTree(_, { call, put }) {
      // 取到用户ID
      const userInfo = JSON.parse(localStorage.getItem('loginUserData'));
      const response = yield call(getOrgs, { id: userInfo.userId });
      if (judge(response)) {
        const { data } = response;
        const orgList = [];
        data.forEach(item => {
          const org = {};
          org.id = item.id;
          org.code = item.id;
          org.orgCode = item.orgCode;
          org.orgShortName = item.orgShortName;
          org.orgClass = item.orgClass;
          org.orgClassDesp = item.orgClassDesp;
          org.orgType = item.orgType;
          org.parentOrgId = item.parentOrgId;
          org.orgName = item.orgName;
          org.description = item.description;
          org.status = item.status;
          orgList.push(org);
        });
        const group = listToTree(orgList);
        const groupMap = listToMap(orgList);
        const rootOrgId = getRootOrg(orgList);
        yield put({
          type: 'updateLocal',
          payload: { group, groupMap, rootDepartMentId: rootOrgId },
        });
        yield put({
          type: 'loadDictForAddOrg',
          payload: { type: 1, EQ: 'ORGCLASS' },
        });
        yield put({
          type: 'loadDictForAddOrg',
          payload: { type: 2, EQ: 'STATUS' },
        });
      }
    },
    *loadRightTree({ payload }, { call, put }) {
      const userInfo = JSON.parse(localStorage.getItem('loginUserData'));
      const { selectedKeys, groupMap } = payload;
      let groupRight = [];
      let groupRightMap = [];
      if (selectedKeys && selectedKeys.length > 0) {
        const curItem = groupMap[selectedKeys[0]];
        // loadRightTree
        const response = yield call(getDeptListById, {
          userId: userInfo.userId,
          orgId: curItem.id,
        });
        if (judge(response)) {
          const { data } = response;
          const orgRightList = [];
          data.forEach(item => {
            const org = {};
            org.id = item.id;
            org.code = item.id;
            org.orgCode = item.orgCode;
            org.orgShortName = item.orgShortName;
            org.orgClass = item.orgClass;
            org.orgClassDesp = item.orgClassDesp;
            org.orgType = item.orgType;
            org.parentOrgId = item.parentOrgId;
            org.orgName = item.orgName;
            org.description = item.description;
            org.status = item.status;
            orgRightList.push(org);
          });
          groupRight = listToTree(orgRightList);
          groupRightMap = listToMap(orgRightList);
          yield put({
            type: 'updateLeftTreeSelected',
            payload: { selectedKeys, groupRight, groupRightMap },
          });
        }
      }
    },
    *loadDictForAddOrg({ payload }, { call, put }) {
      const response = yield call(getDictForOrgLevels, { EQ: payload.EQ });
      if (response !== undefined) {
        const orgTempLevel = [];
        response.forEach(item => {
          if (item.parentId !== 0) {
            orgTempLevel.push(item);
          }
        });
        if (payload.type === 1) {
          yield put({
            type: 'updateLocal',
            payload: { orgLevels: orgTempLevel },
          });
        } else if (payload.type === 2) {
          yield put({
            type: 'updateLocal',
            payload: { orgStatus: orgTempLevel },
          });
        }
      }
    },
    *add({ payload }, { call, put }) {
      const response = yield call(addOrg, payload);
      if (judge(response)) {
        const { data } = response;
        const item = {};
        item.id = data.id;
        item.code = data.id;
        item.orgCode = data.orgCode;
        item.orgShortName = data.orgShortName;
        item.orgClass = data.orgClass;
        item.orgClassDesp = data.orgClassDesp;
        item.orgType = data.orgType;
        item.parentOrgId = data.parentOrgId;
        item.orgName = data.orgName;
        item.description = data.description;
        item.status = data.status;
        yield put({
          type: 'updateTree',
          payload: { item, type: 1 },
        });
        message.success('单位/部门添加成功');
      }
    },
    *addRootDept({ payload }, { call, put }) {
      const response = yield call(addOrg, payload);
      if (judge(response)) {
        const { data } = response;
        const item = {};
        item.id = data.id;
        item.code = data.id;
        item.orgCode = data.orgCode;
        item.orgShortName = data.orgShortName;
        item.orgClass = data.orgClass;
        item.orgClassDesp = data.orgClassDesp;
        item.orgType = data.orgType;
        item.parentOrgId = data.parentOrgId;
        item.orgName = data.orgName;
        item.description = data.description;
        item.status = data.status;
        yield put({
          type: 'updateTree2',
          payload: { item, type: 1, isRoot: true },
        });
        message.success('单位/部门添加成功');
      }
    },
    *update({ payload }, { call, put }) {
      const response = yield call(updateOrg, payload);
      if (judge(response)) {
        const { data } = response;
        const item = {};
        item.id = data.id;
        item.code = data.id;
        item.orgCode = data.orgCode;
        item.orgShortName = data.orgShortName;
        item.orgClass = data.orgClass;
        item.orgClassDesp = data.orgClassDesp;
        item.orgType = data.orgType;
        item.parentOrgId = data.parentOrgId;
        item.orgName = data.orgName;
        item.description = data.description;
        item.status = data.status;
        yield put({
          type: 'updateTree',
          payload: { item, type: 2 },
        });
        message.success('单位/部门修改成功');
      }
    },
    *remove({ payload }, { call, put }) {
      const { item } = payload;
      const response = yield call(deleteOrgById, item);
      if (judge(response)) {
        yield put({
          type: 'updateTree',
          payload: { item, type: 3 },
        });
        message.success('单位/部门删除成功');
      }
    },
    *loadCanBindRole({ payload, callback }, { call, put }) {
      const response = yield call(getLoadCanBindRoleById, payload);
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
      const response = yield call(getLoadBindedLoadById, payload);
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
    *bindRolesOrUnbindRolesByOrgId({ payload, callback }, { call, put }) {
      const response = yield call(bindRolesOrUnbindRoles, payload);
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
        message.success('单位/部门角色绑定或解绑成功');
        if (callback) callback();
      } else {
        message.error('单位/部门角色绑定或解绑失败');
      }
    },
  },

  reducers: {
    // ====left =====
    updateLeftTreeSelected(state, { payload }) {
      const { selectedKeys, groupRight, groupRightMap } = payload;
      const curItem = state.groupMap[selectedKeys[0]];
      return {
        ...state,
        selectedKeys,
        selectedRightKeys: [],
        rightClickTreeItem: {},
        curItem,
        curRightItem: undefined,
        rightClickItem: undefined,
        groupRight,
        groupRightMap,
      };
    },
    // ====right===
    updateRightTreeSelected(state, { payload }) {
      const selectedRightKeys = payload;
      const curRightItem = state.groupRightMap[selectedRightKeys[0]];
      return {
        ...state,
        selectedRightKeys,
        rightClickTreeItem: {},
        curRightItem,
      };
    },
    updateTree(state, { payload }) {
      const { groupMap, group, groupRightMap, groupRight, status } = state;
      const { item, type, isRoot } = payload;
      const params = {};
      if (status === 1) {
        updateTre(group, item, type, isRoot);
        if (type === 3) {
          delete groupMap[item.code];
          params.selectedKeys = [];
          params.curItem = undefined;
        } else {
          groupMap[item.code] = item;
          if (type === 2) {
            params.curItem = item;
          } else if (type === 1) {
            params.isAdd = false;
          }
        }
      } else {
        if (groupRightMap) updateTre(groupRight, item, type, isRoot);
        if (type === 3) {
          delete groupRightMap[item.code];
          params.selectedRightKeys = [];
          params.curRightItem = undefined;
        } else {
          groupRightMap[item.code] = item;
          if (type === 2) {
            params.curRightItem = item;
          } else if (type === 1) {
            params.isAdd = false;
          }
        }
      }
      return {
        ...state,
        group,
        groupMap,
        groupRightMap,
        groupRight,
        ...params,
      };
    },
    updateTree2(state, { payload }) {
      const { groupRightMap, groupRight, rightClickItem } = state;
      const { item, type, isRoot } = payload;
      if (groupRight && groupRight.length > 0 && groupRight[0].parentOrgId === rightClickItem.id) {
        const params = {};
        updateTre(groupRight, item, type, isRoot);
        if (type === 3) {
          delete groupRightMap[item.code];
          params.selectedRightKeys = [];
          params.curRightItem = undefined;
        } else {
          groupRightMap[item.code] = item;
          if (type === 2) {
            params.curRightItem = item;
          } else if (type === 1) {
            params.isAdd = false;
          }
        }
        return {
          ...state,
          groupRightMap,
          groupRight,
          ...params,
        };
      }
      return {
        ...state,
      };
    },
    save(state, { payload }) {
      return {
        ...state,
        data: payload,
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
