/**
 * Created by skyinno on 2018/11/1.
 */
import request from '@/utils/request';

// ==============目录管理相关===================
export async function getOrgs(params) {
  // 获取单位列表
  return request(`/cas/api/org/list?Q=orgType_EQ=1`);
}

export async function getDeptListById(params) {
  // 根据单位id查询单位详情
  const { id } = params;
  return request(`/cas/api/org/getDept/${id}`);
}

export async function addOrg(params) {
  const { item, orgId } = params;
  const requestParams = {};
  requestParams.orgId = orgId;
  requestParams.orgName = item.orgName;
  requestParams.parentOrgId = item.parentOrgId;
  requestParams.status = item.status;
  requestParams.orgClass = item.orgClass;
  requestParams.orgType = item.orgType;
  requestParams.orgShortName = item.orgShortName;
  requestParams.orgCode = item.orgCode;
  requestParams.description = item.description;
  // 新建单位或部门
  return request(`/cas/org/create`, {
    method: 'POST',
    body: requestParams,
  });
}

export async function updateOrg(params) {
  const { item, orgId } = params;
  const requestParams = {};
  requestParams.orgId = orgId;
  requestParams.id = item.id;
  requestParams.orgName = item.orgName;
  requestParams.status = item.status;
  requestParams.orgClass = item.orgClass;
  requestParams.orgType = item.orgType;
  requestParams.orgShortName = item.orgShortName;
  requestParams.orgCode = item.orgCode;
  requestParams.description = item.description;
  // 更新单位或部门
  return request(`/cas/org/update`, {
    method: 'PUT',
    body: requestParams,
  });
}

export async function deleteOrgById(params) {
  // 根据id删除单位或部门
  const { id } = params;
  return request(`/cas/org/delete/${id}`, {
    method: 'DELETE',
  });
}

export async function getUsersByOrgId(params) {
  // 根据单位或部门id获取单位或部门下的用户列表
  const {
    id,
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
  return request(`/cas/userInfo/listUserByOrgId/${id}/${page}/${pageSize}?${condition}`);
}

export async function getLoadCanBindRoleById(params) {
  // 根据单位或部门id获取单位或部门可以绑定的角色列表
  const { page = 1, pageSize = 500, orgId } = params;
  return request(`/cas/role/listUnbindOrgRole/${orgId}/${page}/${pageSize}`);
}

export async function getLoadBindedLoadById(params) {
  // 根据单位或部门id获取单位或部门已经绑定的角色列表
  const { page = 1, pageSize = 500, orgId } = params;
  return request(`/cas/orgRole/list/${page}/${pageSize}?Q=orgId_EQ=${orgId}`);
}

export async function bindRolesOrUnbindRoles(params) {
  // 根据单位或部门id绑定或解绑角色
  const requestParams = {};
  requestParams.bind = params.bind;
  requestParams.unbind = params.unbind;
  return request(`/cas/orgRole/addRolesOrUnbindRoles/${params.orgId}`, {
    method: 'POST',
    body: requestParams,
  });
}

export async function getDictForOrgLevels(params) {
  // 创建单位或部门获取级别列表
  return request(`/lookup/init/${params.EQ}`);
}
