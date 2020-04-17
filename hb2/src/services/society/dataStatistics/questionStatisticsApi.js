import request from '@/utils/request';

export async function add(params) {
  return request('/services/wto/wtobulletin/save', {
    method: 'POST',
    body: params,
  });
}

export async function remove(id) {
  return request(`/services/wto/wtobulletin/delete/${id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request('/services/wto/wtobulletin/update', {
    method: 'PUT',
    body: params,
  });
}

/**
 * 国标行政区划查询
 * @param {*} id 
 */
export async function searchRegDic(params) {
  return request(`/services/code/codedic/getByTypeAndCode/${params.type}/${params.code}`);
}

/**
 * 获取表头数据
 * @param {*} id 
 */
export async function searchTableHead() {
  return request(`/services/code/codedic/getCheckRule/14`);
}


/**
 * 搜索指定id的文章
 * @param {*} id 
 */
export async function search(id) {
  return request(`/services/wto/wtobulletin/get/${id}`);
}

/**
 * 批量上下线
 * @param {*} params 
 */
export async function updateCheckStatus(params) {
  return request('/services/wto/wtobulletin/updateStatus', {
    method: 'PUT',
    body: params,
  });
}