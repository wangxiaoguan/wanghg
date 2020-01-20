import request from '@/utils/request';

export function add(params) {
  return request('/services/dpac/defectaboutus/save', {
    method: 'POST',
    body: params,
  });
}

export function update(params) {
  return request('/services/dpac/defectaboutus/save', {
    method: 'POST',
    body: params,
  });
}

export function remove(id) {
  return request(`-------/${id}`, {
    method: 'DELETE',
  });
}

export function search(params) {
  return request(`/services/dpac/defectaboutus/getById`);
}