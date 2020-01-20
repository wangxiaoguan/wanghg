import request from '@/utils/request';


export async function add(params) {
  return request('/services/wto/wtoinvestment/wtoInvestment', {
    method: 'POST',
    body: params,
  });
}

export async function remove(id) {
  return request(`/services/wto/wtoinvestment/wtoInvestment/${id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request('/services/wto/wtoinvestment/wtoInvestment', {
    method: 'PUT',
    body: params,
  });
}

/**
 * 搜索指定id的文章
 * @param {*} id 
 */
export async function search(id) {
  return request(`/services/wto/wtoinvestment/wtoInvestment/${id}`);
}

/**
 * 置顶
 * @param {*} params 
 */
export async function stick(params) {
  return request('/services/wto/wtoinvestment/stick', {
    method: 'PUT',
    body: params,
  });
}

/**
 * 批量上下线
 * @param {*} params 
 */
export async function updateCheckStatus(params) {
  return request('/services/wto/wtoinvestment/checkstatus', {
    method: 'PUT',
    body: params,
  });
}