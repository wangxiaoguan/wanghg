import request from '@/utils/request';

export function add(params) {
  return request('/services/indexManage/menu/menu', {
    method: 'POST',
    body: params,
  });
}

export function update(params) {
  return request('/services/indexManage/menu/menu', {
    method: 'PUT',
    body: params,
  });
}

export function remove(id) {
  return request(`/services/indexManage/menu/menu/${id}`, {
    method: 'DELETE',
  });
}