import request from '@/utils/request';
// import { DOWNLOAD_API } from '@/services/api';

export async function add(params) {
  return request('/services/standard/fhstd/insert', {
    method: 'POST',
    body: params,
  });
}

export async function remove(id) {
  return request(`/services/standard/fhstd/delete/${id}`, {
    method: 'DELETE',
  });
}

export async function refuse(params) {
  return request('/services/standard/fhstdnoveltysearch/audit/refuse', {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request('/services/services/standard/fhstd/update', {
    method: 'POST',
    body: params,
  });
}

export async function search(id) {
  return request(`/services/standard/fhstd/getById/${id}`);
}