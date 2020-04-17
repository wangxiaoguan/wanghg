import request from '@/utils/request';

export function add(params) {
  return request('/services/indexManage/image/image', {
    method: 'POST',
    body: params,
  });
}

export function remove(id) {
  return request(`/services/indexManage/image/image/${id}`, {method: 'DELETE'});
}

/**
 * 更新数据
 * @param {} params 包含id和要修改的属性数据
 */
export function update(params) {
  if (params.id) {
    return request('/services/indexManage/image/image', {
      method: 'PUT',
      body: params,
    });
  }
  else {
    console.log('更新数据需传入id');
  }
  return {};
}

export function search(id) {
  return request(`/services/indexManage/image/image/${id}`);
}