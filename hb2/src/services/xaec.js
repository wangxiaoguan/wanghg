import { stringify } from 'qs';

import request from '@/utils/request';

const strfyOpt = {
  encodeValuesOnly: true,
};

export async function query(params) {
  const { current, pageSize, ...rest } = params;
  return request(`/lookup/list/${current}/${pageSize}?${stringify(rest, strfyOpt)}`);
}

export async function remove(params) {
  return request(`/lookup/single/${params.id}`, {
    method: 'DELETE',
  });
}

export async function add(params) {
  return request('/lookup/single', {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request('/lookup/single', {
    method: 'PUT',
    body: params,
  });
}

export async function queryGroup(params) {
  return request(`/lookup/list?${stringify(params, strfyOpt)}`);
}

export async function check(params) {
  return request(`/lookup/list?${stringify(params, strfyOpt)}`);
}

export async function getLookUp(params) {
  //获取字典表数据
  return request(`/lookup/init/${params}`);
}
