import request from '@/utils/request';

export function add(params) {
  return request('/services/dpac/fhdefectdefectreport/save', {
    method: 'POST',
    body: params,
  });
}

export function update(params) {
  return request('/services/dpac/fhdefectdefectreport/update', {
    method: 'POST',
    body: params,
  });
}

export function remove(id) {
  return request(`/services/dpac/fhdefectdefectreport/delete/${id}`, {
    method: 'POST',
  });
}

export function search(id) {
  return request(`/services/dpac/fhdefectdefectreport/selectById/1/${id}`);
}

/**
 * 批量修改，包括置顶，上线，审核等
 * @param {*} id 
 */
export async function updateBatchCheckStatus(params) {
  return request(`/services/dpac/defectmessageissue/updateStatus`, {
    method: 'PUT',
    body: params
  });
}

export async function exportExcel(params) {
  // return request(`/services/dpac/downloadExcel/download/ExportReport${params}`, null, true);
  return request(`/services/dpac/exportExcel/exportCar`, 
  {
    method: 'POST',
    body:params,
  }, true);
}
