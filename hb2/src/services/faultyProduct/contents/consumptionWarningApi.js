import request from '@/utils/request';

export function add(params) {
  return request('/services/dpac/defectmessageissue/save', {
    method: 'POST',
    body: params,
  });
}

export function update(params) {
  return request('/services/dpac/defectmessageissue/update', {
    method: 'PUT',
    body: params,
  });
}

export function remove(params) {
  return request(`/services/dpac/defectmessageissue/delete`, {
    method: 'POST',
    body: params
  });
}

export function search(id) {
  return request(`/services/dpac/defectmessageissue/get/${id}`);
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
