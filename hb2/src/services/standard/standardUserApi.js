import request from '@/utils/request';

export async function remove(id) {
  return request(`/services/standard/fhstdregisteruser/delete//${id}`, {
    method: 'DELETE',
  });
}
export async function update(params) {
  return request('/services/standard/fhstdregisteruser/update', {
    method: 'PUT',
    body: params,
  });
}

export async function search(id) {
  return request(`/services/standard/fhstdregisteruser/${id}`);
}