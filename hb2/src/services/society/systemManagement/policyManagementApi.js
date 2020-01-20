import request from '@/utils/request';

export function add(params) {
  return request('/services/code/policycontext/policycontext', {
    method: 'POST',
    body: params,
  });
}

export function update(params) {
  return request('/services/code/policycontext/policycontext', {
    method: 'PUT',
    body: params,
  });
}

export function remove(id) {
  return request(`/services/code/policycontext/policycontext/${id}`, {
    method: 'DELETE',
  });
}

export function search(id) {
  return request(`/services/code/policycontext/policycontext/${id}`);
}

/**
 * 批量修改，包括置顶，上线，审核等
 * @param {*} id 
 */
export async function updateBatchStatus(params) {
  return request(`/services/code/policycontext/updateStatus`, {
    method: 'PUT',
    body: params
  });
}
