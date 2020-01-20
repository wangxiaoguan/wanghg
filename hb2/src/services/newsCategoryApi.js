import request from '@/utils/request';

export async function getAll() {
  return request('/services/indexManage/item/showAll');
}

export async function add(params) {
  return request('/services/indexManage/item/item', {
    method: 'POST',
    body: params,
  });
}

export async function remove(id) {
  return request(`/services/indexManage/item/item/${id}`, {
    method: 'DELETE',
  });
}

export async function update(params) {
  return request('/services/indexManage/item/item', {
    method: 'PUT',
    body: params,
  });
}

/**
 * 获取所有启用的类别  去掉visible3参数
 */
export async function getEnableAll() {
  return request('/services/indexManage/item/showAll?Q=visible_EQ=1&&Q=visible2_EQ=1');
} 