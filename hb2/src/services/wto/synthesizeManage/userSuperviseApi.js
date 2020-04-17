import request from '@/utils/request';

export async function remove(params) {
  return request('/services/wto/registeruser/registerUser/delete', {
    method: 'PUT',
    body: params,
  });
}

export async function pwdreset(params) {
  return request('/services/wto/registeruser/registerUser/updatePwd', {
    method: 'PUT',
    body: params,
  });
}

export async function search(params) {
  return request(`/services/wto/registeruser/registerUser/${params}`);
}

export async function update(params) {
  return request('/services/wto/registeruser/registerUser/update', {
    method: 'PUT',
    body: params,
  });
}
