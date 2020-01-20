import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryData(data) {
  return request(`/geo/geocms/queryArticle?${stringify(data)}`);
}

export async function addData(data) {
  return request('/geo/geocms/addArticle', {
    method: 'POST',
    body: {
      ...data,
    },
  });
}

export async function deleteData(data) {
  return request('/geo/geocms/deleteArticle', {
    method: 'POST',
    body: {
      ...data,
    },
  });
}

export async function updateData(data) {
  return request('/geo/geocms/updateArticle',{
    method: 'POST',
    body: {
      ...data,
    },
  });
}

