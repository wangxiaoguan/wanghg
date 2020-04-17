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
 * 搜索指定id的文章
 * @param {*} id 
 */
export async function search(id) {
  return request(`/services/code/centerinfo/centerinfo/${id}`);
}

/**
 * 通用字典查询
 * @param {*} id 
 */
export async function searchCommonDic(type) {
  return request(`/services/code/codedic/getByType/${type}`);
}

/**
 * 经济行业及登记机关查询
 * @param {*} id 
 */
export async function searchRegDic(params) {
  return request(`/services/code/codedic/getByTypeAndCode/${params.type}/${params.code}`);
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

export async function exportField(params) {
  return request('/services/code/centerinfo/getAllField', {
    method: 'GET',
    body: params,
  });
}

export async function exportFieldDownLoad(params) {
  return request('/services/code/centerinfo/export', {
    method: 'POST',
    body: {
      ...params,
      DataSource:'N'
    },
  }, true);
}