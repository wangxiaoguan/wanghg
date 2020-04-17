import request from '@/utils/request';

export async function remove(id) {
  return request(`/services/indexManage/officialWebBoard/deleteMessage/${id}`);
}

export async function search(params) {
  return request(`/services/indexManage/officialWebBoard/getList/1/20?${params}`);
}

export async function reply(params) {
  return request('/services/indexManage/officialWebBoard/replyMessage', {
    method: 'POST',
    body: params,
  });
}