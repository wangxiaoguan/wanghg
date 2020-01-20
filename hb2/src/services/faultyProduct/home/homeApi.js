import request from '@/utils/request';

export function add(params) {
  return request('-----', {
    method: 'POST',
    body: params,
  });
}

export function update(params) {
  return request('-----', {
    method: 'PUT',
    body: params,
  });
}

export function remove(id) {
  return request(`-------/${id}`, {
    method: 'DELETE',
  });
}

export function search() {
  return request(`/services/dpac/dataanalysis/analyseData`);
}