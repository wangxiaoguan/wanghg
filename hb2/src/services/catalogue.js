import request from '@/utils/request';

// ==============目录管理相关===================
export async function getCatlogues() {
  // 获取目录列表
  return request(`/cas/systemMenuInfo/list`);
}
export async function createCatlogue(params) {
  // 创建目录
  return request(`/cas/systemMenuInfo/create`, {
    method: 'POST',
    body: params,
  });
}
export async function updateCatlogue(params) {
  // 修改目录
  return request(`/cas/systemMenuInfo/update`, {
    method: 'PUT',
    body: params,
  });
}
export async function delCatlogue(id) {
  // 删除目录
  return request(`/cas/systemMenuInfo/delete/${id}`, {
    method: 'DELETE',
  });
}
export async function statusCatlogues(params) {
  // 批量启用/ 禁用
  return request(`/cas/systemMenuInfo/status`, {
    method: 'POST',
    body: params,
  });
}
// ==============目录管理相关====end===============
export async function getLoadCanBindRoleByDirId(params) {
  // 根据目录id获取可以绑定的角色列表
  return request(`/cas/systemMenuRoleRelation/role/list`, {
    method: 'POST',
    body: params,
  });
}

export async function getLoadBindedLoadByDirId(params) {
  // 根据目录id获取已经绑定的角色列表
  return request(`/cas/systemMenuRoleRelation/getMenuBindings`, {
    method: 'POST',
    body: params,
  });
}

export async function bindRolesOrUnbindRolesByDirId(params) {
  // 根据目录id绑定或解绑角色
  return request(`/cas/systemMenuRoleRelation/bindsAndUnbinds`, {
    method: 'POST',
    body: params,
  });
}
