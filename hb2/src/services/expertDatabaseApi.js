import request from '@/utils/request';

export function getList(params) {
  return request(`/services/experts/base/getAll/${params.page}/${params.pageSize}`);
}

export function getExportExcel() {
  return request('/services/experts/base/export', null, true);
}

export async function add(params) {
  return request('/services/experts/base/save', {
    method: 'POST',
    body: params,
  });
}
export function update(params) {
  return request('/services/experts/base/update', {
    method: 'POST',
    body: params,
  });
}
export function search(id) {
  return request(`/services/experts/base/getById/${id}`);
}
export function majoranalysis() {
  return request('/services/experts/base/majoranalysis');
}

export function titlelevelanalysis() {
  return request('/services/experts/base/titlelevelanalysis');
}

export function updateAuditStatus(params) {
  return request('/services/experts/base/updateAuditStatus', {
    method: 'POST',
    body: params,
  });
}

