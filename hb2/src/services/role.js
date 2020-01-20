import request from '@/utils/request';

// ==============角色相关===================
export async function getRole(id) {
  // 根据id获取单条数据
  return request(`/cas/role/get/${id}`);
}
export async function getRoleList(params = {}) {
  // 获取分页列表查询
  const { page = 1, pageSize = 10, roleName, status } = params;
  let condition = '';
  if (roleName && roleName.length > 0) {
    condition += `Q=roleName_LK=${roleName}&`;
  }
  if (status && status.length >= 0) {
    condition += `Q=status_EQ=${status}`;
  }

  return request(`/cas/role/newList/${page}/${pageSize}?${condition}`);
}
export async function addRole(params) {
  // 增加一条记录
  return request(`/cas/role/create`, {
    method: 'POST',
    body: params,
  });
}
export async function updateRole(params) {
  // 修改目录
  return request(`/cas/role/update`, {
    method: 'PUT',
    body: params,
  });
}
export async function deleteRole(id) {
  // 真实删除单条数据
  return request(`/cas/role/delete/${id}`, {
    method: 'DELETE',
  });
}
export async function deleteRoles(params) {
  // 批量删除用户
  return request(`/cas/role/batchDelete`, {
    method: 'DELETE',
    body: params,
  });
}

// ========== 角色 绑定用户 start =======

// 获取角色已经绑定的用户列表
export async function getBindedUserList(params) {
  const { page = 1, pageSize = 10, roleId } = params;

  return request(`/cas/userRole/list/${page}/${pageSize}?Q=roleId_EQ=${roleId}`, {
    method: 'GET',
  });
}

// 获取角色可以绑定的用户列表
export async function getUnbindingUserList(params) {
  const { roleId, page = 1, pageSize = 10, userName, userStatus, userType } = params;
  let condition = '';
  if (userName && userName.length > 0) {
    condition += `Q=userName_LK=${userName}&`;
  }
  if (userStatus && userStatus.length >= 0) {
    condition += `Q=userStatus_EQ=${userStatus}&`;
  }
  if (userType && userType.length >= 0) {
    condition += `Q=userType_EQ=${userType}&`;
  }
  const query = condition.length > 0 ? `?${condition}` : '';

  return request(`/cas/userInfo/listUnbindRoleUser/${roleId}/${page}/${pageSize}${query}`);
}

// 绑定用户
export async function bindUser(params) {
  const { roleId, userIds } = params;

  return request(`/cas/userRole/addUsers/${roleId}`, {
    method: 'POST',
    body: userIds,
  });
}

// 更改 角色绑定用户 status
export async function updateUserRoleStatus(params) {
  return request('/cas/userRole/update', {
    method: 'PUT',
    body: params,
  });
}

// 角色 解绑单个用户
export async function unbindUser(params) {
  const { id } = params;
  return request(`/cas/userRole/delete/${id}`, {
    method: 'DELETE',
    body: id,
  });
}

// 角色 批量解绑用户
export async function unbindUsers(params) {
  const { ids } = params;
  return request(`/cas/userRole/batchDelete`, {
    method: 'DELETE',
    body: ids,
  });
}
// ========== 角色 绑定用户 end   =======

// ========== 角色 绑定群组 start =======

// 获取角色已经绑定的群组列表
export async function getBindedGroupList(params) {
  const { page = 1, pageSize = 10, roleId } = params;

  return request(`/cas/groupRole/list/${page}/${pageSize}?Q=roleId_EQ=${roleId}`);
}

// 获取角色未绑定的群组列表
export async function getUnbindingGroupList(params) {
  const { roleId, page = 1, pageSize = 10, groupName, status } = params;
  let condition = '';
  if (groupName && groupName.length > 0) {
    condition += `Q=groupName_LK=${groupName}&`;
  }
  if (status && status.length >= 0) {
    condition += `Q=status_EQ=${status}&`;
  }
  const query = condition.length > 0 ? `?${condition}` : '';

  return request(`/cas/userGroup/listUnbindRoleGroup/${roleId}/${page}/${pageSize}${query}`);
}

// 角色 绑定群组
export async function bindGroup(params) {
  const { roleId, groupIds } = params;

  return request(`/cas/groupRole/addGroups/${roleId}`, {
    method: 'POST',
    body: groupIds,
  });
}

// 更改 角色绑定群组 status
export async function updateGroupRoleStatus(params) {
  return request('/cas/groupRole/update', {
    method: 'PUT',
    body: params,
  });
}

// 角色 解绑单个群组
export async function unbindGroup(params) {
  const { id } = params;
  return request(`/cas/groupRole/delete/${id}`, {
    method: 'DELETE',
  });
}

// 角色 批量解绑群组
export async function unbindGroups(params) {
  const { ids } = params;
  return request(`/cas/groupRole/batchDelete`, {
    method: 'DELETE',
    body: ids,
  });
}
// ========== 角色 绑定群组 end   =======

// ========== 角色 绑定单位/部门 start =======
// 获取角色已经绑定的单位列表
export async function getBindedOrgList(params) {
  const { page = 1, pageSize = 10, roleId } = params;

  return request(`/cas/orgRole/list/${page}/${pageSize}?Q=roleId_EQ=${roleId}`);
}

// 获取角色未绑定的单位列表
export async function getUnbindingOrgList(params) {
  const { roleId, page = 1, pageSize = 10, orgName, status } = params;
  const condition = [];
  if (orgName && orgName.length > 0) {
    condition.push(`Q=orgName_LK=${orgName}`);
  }
  if (status && status.length >= 0) {
    condition.push(`Q=status_EQ=${status}`);
  }
  const query = condition.length > 0 ? `?${condition.join('&')}` : '';

  return request(`/cas/org/listUnbindRoleOrg/${roleId}/${page}/${pageSize}${query}`);
}

// 角色 绑定单位
export async function bindOrg(params) {
  const { roleId, orgIds } = params;

  return request(`/cas/orgRole/addOrgs/${roleId}`, {
    method: 'POST',
    body: orgIds,
  });
}

// 更改 角色绑定单位 status
export async function updateOrgRoleStatus(params) {
  return request('/cas/orgRole/update', {
    method: 'PUT',
    body: params,
  });
}

// 角色 解绑单个单位
export async function unbindOrg(params) {
  const { id } = params;
  return request(`/cas/orgRole/delete/${id}`, {
    method: 'DELETE',
  });
}

// 角色 批量解绑单位
export async function unbindOrgs(params) {
  const { ids } = params;
  return request(`/cas/orgRole/batchDelete`, {
    method: 'DELETE',
    body: ids,
  });
}
// ========== 角色 绑定单位/部门 end   =======

// ========== 角色 绑定目录 start =======
// 角色已绑定目录的列表
export async function getBindedMenuList(params) {
  return request(`/cas/systemMenuRoleRelation/getBindingsList`, {
    method: 'POST',
    body: params,
  });
}

// 角色未绑定目录
export async function getUnbindingMenuList(params) {
  return request('/cas/systemMenuRoleRelation/unboundList', {
    method: 'POST',
    body: params,
  });
}

// 角色 绑定目录
export async function bindMenu(params) {
  return request('/cas/systemMenuRoleRelation/createBinding', {
    method: 'POST',
    body: params,
  });
}

// 角色 解绑目录
export async function unbindMenu(params) {
  const { id } = params;
  return request(`/cas/systemMenuRoleRelation/delete/${id}`, {
    method: 'DELETE',
  });
}
// ========== 角色 绑定目录 end   =======

// ==============角色相关====end===============
