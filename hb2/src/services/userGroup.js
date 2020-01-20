import request from '@/utils/request';

// ==============用户组相关===================
export async function getUserGroup(id) {
  // 根据id获取单条数据
  return request(`/cas/userGroup/get/${id}`);
}
export async function getUserGroupList(params = {}) {
  // 获取分页列表查询
  const { page = 1, pageSize = 10, groupName, status } = params;
  let condition = '';
  if (groupName && groupName.length > 0) {
    condition += `Q=groupName_LK=${groupName}&`;
  }
  if (status && status.length >= 0) {
    condition += `Q=status_EQ=${status}`;
  }

  return request(`/cas/userGroup/list/${page}/${pageSize}?${condition}`);
}
export async function addUserGroup(params) {
  // 增加一条记录
  return request(`/cas/userGroup/create`, {
    method: 'POST',
    body: params,
  });
}
export async function updateUserGroup(params) {
  // 修改目录
  return request(`/cas/userGroup/update`, {
    method: 'PUT',
    body: params,
  });
}
export async function deleteUserGroup(id) {
  // 真实删除单条数据
  return request(`/cas/userGroup/delete/${id}`, {
    method: 'DELETE',
  });
}
export async function deleteUserGroups(params) {
  // 批量删除用户
  return request(`/cas/userGroup/batchDelete`, {
    method: 'DELETE',
    body: params,
  });
}

// ==============用户组相关====end===============

// ==============用户群组—->绑定用户====start===============

export async function getGroupUserList(params = {}) {
  // 获取用户群组已经绑定的用户列表
  const { page = 1, pageSize = 10, groupId, userName, userAccount } = params;
  let condition = '';
  if (groupId && groupId.length >= 0) {
    condition += `Q=groupId_EQ=${groupId}&`;
  }

  if (userName && userName.length > 0) {
    condition += `Q=userName_LK=${userName}&`;
  }
  if (userAccount && userAccount.length >= 0) {
    condition += `Q=userAccount_LK=${userAccount}&`;
  }

  return request(`/cas/groupUser/list/${page}/${pageSize}?${condition}`);
}

export async function getListUnbindUser(params = {}) {
  // 获取用户群组可以绑定的用户列表
  const { groupId, page = 1, pageSize = 10, userName, userAccount, userStatus, userType } = params;
  let condition = '';
  if (userName && userName.length > 0) {
    condition += `Q=userName_LK=${userName}&`;
  }
  if (userAccount && userAccount.length >= 0) {
    condition += `Q=userAccount_LK=${userAccount}&`;
  }
  if (userStatus && userStatus.length >= 0) {
    condition += `Q=userStatus_EQ=${userStatus}&`;
  }
  if (userType && userType.length >= 0) {
    condition += `Q=userType_EQ=${userType}&`;
  }

  return request(`/cas/userInfo/listUnbindUser/${groupId}/${page}/${pageSize}?${condition}`);
}

export async function groupUserAddUser(params) {
  const { groupId, userIds = [] } = params;
  // 群组绑定用户
  return request(`/cas/groupUser/addUsers/${groupId}`, {
    method: 'POST',
    body: userIds,
  });
}

export async function groupUserDeleteUser(params) {
  const { groupId, id } = params;
  // 真实删除单条数据
  return request(`/cas/groupUser/delete/${id}`, {
    method: 'DELETE',
    body: groupId,
  });
}

// ==============用户群组—->绑定用户====end===============

// ==============用户群组—->绑定角色====start===============

export async function getGroupRoleList(params = {}) {
  // 获取用户群组已经绑定的角色列表
  const { page = 1, pageSize = 10, groupId, roleName } = params;
  let q = '';
  if (groupId && groupId.length >= 0) {
    q += `Q=groupId_EQ=${groupId}&`;
  }
  if (roleName && roleName.length > 0) {
    q += `Q=roleName=${roleName}&`;
  }

  return request(`/cas/groupRole/list/${page}/${pageSize}?${q}`);
}

export async function getListUnbindRole(params = {}) {
  // 获取用户群组可以绑定的角色列表
  const { groupId, page = 1, pageSize = 10, roleName, status } = params;
  let condition = '';
  if (roleName && roleName.length > 0) {
    condition += `Q=roleName_LK=${roleName}&`;
  }
  if (status && status.length >= 0) {
    condition += `Q=status_EQ=${status}&`;
  }

  return request(`/cas/role/listUnbindGroupRole/${groupId}/${page}/${pageSize}?${condition}`);
}

export async function groupUserAddRole(params) {
  const { groupId, roleIds = [] } = params;
  // 群组绑定角色
  return request(`/cas/groupRole/addRoles/${groupId}`, {
    method: 'POST',
    body: roleIds,
  });
}

export async function updateUserGroupRoleStatus(params) {
  const { status, id } = params;
  // 更改 群组绑定角色 状态
  return request('/cas/groupRole/update', {
    method: 'DELETE',
    body: { id, status },
  });
}

export async function groupUserDeleteRole(params) {
  const { groupId, id } = params;
  // 真实删除单条数据
  return request(`/cas/groupRole/delete/${id}`, {
    method: 'DELETE',
    body: groupId,
  });
}

// ==============用户群组—->绑定用户====end===============
