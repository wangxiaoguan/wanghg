import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryData(data) {
  return request(`/geo/geocms/queryTag?${stringify(data)}`);
}

export async function addData(data) {
  return request('/geo/geocms/addTag', {
    method: 'POST',
    body: {
      ...data,
    },
  });
}

export async function deleteData(data) {
  console.log(data);
  return request('/geo/geocms/deleteTag', {
    method: 'POST',
    body: {
      ...data,
    },
  });
}

export async function updateData(data) {
  return request('/geo/geocms/updateTag', {
    method: 'POST',
    body: {
      ...data,
    },
  });
}

