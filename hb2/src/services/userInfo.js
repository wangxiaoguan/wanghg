import request from '@/utils/request';

// ==============用户管理相关===================
export async function getUserInfo(id) {
  // 单条数据的查询
  return request(`/cas/userInfo/get/${id}`);
}
export async function getUserInfoList(params = {}) {
  const userInfo = JSON.parse(localStorage.getItem('loginUserData'));
  // 获取分页列表查询
  const {
    page = 1,
    pageSize = 10,
    userName,
    userAccount,
    userStatus,
    userType,
    auditStatus,
  } = params;
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
  if (auditStatus && auditStatus.length >= 0) {
    condition += `Q=auditStatus_EQ=${auditStatus}&`;
  }

  return request(`/cas/userInfo/getIdByUser/${userInfo.userId}/${page}/${pageSize}?${condition}`);
}

// 获取所有单位
export async function queryAllOrgs() {
  return request('/cas/api/org/list?Q=orgType_EQ=1&?Q=status_EQ=1');
}
// 获取某个单位下的所有部门
export async function queryDepartmentsOfOrg(orgId) {
  return request(`/cas/api/org/getDept/${orgId}?Q=status_EQ=1`);
}

export async function validUser(params) {
  // 增加一条记录前的校验
  return request(`/cas/userInfo/check`, {
    method: 'POST',
    body: params,
  });
}
export async function addUser(params) {
  // 增加一条记录前的校验
  return request(`/cas/userInfo/create`, {
    method: 'POST',
    body: params,
  });
}

export async function registerUser(params) {
  // 注册用户记录
  return request(`/cas/registry/createUserInfo`, {
    method: 'POST',
    body: params,
  });
}

export async function validRegisterUser(params) {
  // 增加一条记录前的校验
  return request(`/cas/registry/checkUserInfo`, {
    method: 'POST',
    body: params,
  });
}

// 获取所有单位(非登录状态)
export async function listAllOrgs() {
  return request('/cas/registry/listOrgInfo?Q=orgType_EQ=1&?Q=status_EQ=1');
}
// 获取某个单位下的所有部门(非登录状态)
export async function listDepartmentsOfOrg(orgId) {
  return request(`/cas/registry/getDept/${orgId}?Q=status_EQ=1`);
}

// 审核用户
export async function auditUser(params) {
  return request('/cas/userInfo/audit', {
    method: 'PUT',
    body: params,
  });
}

export async function updateUserInfo(params) {
  // 修改目录
  return request(`/cas/userInfo/update`, {
    method: 'PUT',
    body: params,
  });
}
export async function deleteUser(id) {
  // 真实删除单条数据
  return request(`/cas/userInfo/delete/${id}`, {
    method: 'DELETE',
  });
}
export async function deleteUsers(params) {
  // 批量删除用户
  return request(`/cas/userInfo/batchDelete`, {
    method: 'DELETE',
    body: params,
  });
}
export async function resetPwd(id) {
  // 重置密码
  return request(`/cas/userInfo/resetPwd/${id}`, {
    method: 'PUT',
  });
}

export async function getPasswordRegexRule() {
  // 密码正则表达式
  return request('/cas/registry/getRegexRule', {
    method: 'GET',
  });
}
// ==============用户管理相关====end===============

// ==============用户管理 角色====start===============
export async function getUserRoleList(params = {}) {
  // 获取用户已经绑定的角色列表
  const { page = 1, pageSize = 10, userId, roleName, status } = params;
  let condition = '';
  if (userId && userId.length >= 0) {
    condition += `Q=userId_EQ=${userId}&`;
  }

  if (roleName && roleName.length > 0) {
    condition += `Q=roleName_LK=${roleName}&`;
  }
  if (status && status.length >= 0) {
    condition += `Q=status_EQ=${status}`;
  }

  return request(`/cas/userRole/list/${page}/${pageSize}?${condition}`);
}

export async function getListUnbindUserRole(params = {}) {
  // 获取用户可以绑定的角色列表
  const { page = 1, pageSize = 10, userId, roleName, status } = params;
  let condition = '';
  if (roleName && roleName.length > 0) {
    condition += `Q=roleName_LK=${roleName}&`;
  }
  if (status && status.length >= 0) {
    condition += `Q=status_EQ=${status}`;
  }

  return request(`/cas/role/listUnbindUserRole/${userId}/${page}/${pageSize}?${condition}`);
}

export async function userRoleAddRoles(params) {
  const { userId, roleIds = [] } = params;
  // 用户绑定角色
  return request(`/cas/userRole/addRoles/${userId}`, {
    method: 'POST',
    body: roleIds,
  });
}

export async function userRoleDeleteRole(params) {
  const { userId, id } = params;
  // 用户解绑单个角色
  return request(`/cas/userRole/delete/${id}`, {
    method: 'DELETE',
    body: userId,
  });
}

// ==============用户管理 角色====start===============
