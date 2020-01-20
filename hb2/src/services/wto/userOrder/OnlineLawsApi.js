import request from '@/utils/request';

export async function remove(id) {
  return request(`/services/wto/requirement/requirement/${id}`, {
    method: 'DELETE',
  });
}

export async function update(param) {
  return request(`/services//wto/requirement/requirement`, {
    method: 'PUT',
    body: param,
  });
}

