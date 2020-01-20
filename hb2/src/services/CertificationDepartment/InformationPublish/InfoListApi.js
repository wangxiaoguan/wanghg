import request from '@/utils/request';

export async function add(params) {
  return request('/services/exam/messageissue/messageIssue', {
    method: 'POST',
    body: params,
  });
}

export async function remove(id) {
  return request(`/services/exam/messageissue/messageIssue/${id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request('/services/exam/messageissue/messageIssue', {
    method: 'PUT',
    body: params
  });
}
/**
 * 搜索
 * @param {*} id 
 */
export async function search(id) {
  return request(`/services/exam/messageissue/messageIssue/${id}`);
}

/**
 * 单条修改，包括置顶，上线，审核等
 * @param {*} id 
 */
export async function updateCheckStatus(params) {
  return request(`/services/exam/messageissue/messageIssue`, {
    method: 'PUT',
    body: params
  });
}


/**
 * 批量修改，包括置顶，上线，审核等
 * @param {*} id 
 */
export async function updateBatchCheckStatus(params) {
  return request(`/services/exam/messageissue/updateStatus`, {
    method: 'PUT',
    body: params
  });
}

