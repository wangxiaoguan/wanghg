import request from '@/utils/request';

export async function remove(id) {
  return request(`/services/wto/customization/customization/${id}`, {
    method: 'DELETE',
  });
}

export async function update(param) {
  return request(`/services/wto/customization/customization`, {
    method: 'PUT',
    body: param
  });
}