import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryData(params) {
  return request(`/geo/geocms/queryCategory?${stringify(params)}`);
}

export async function addData(data) {
  return request('/geo/geocms/addCategory', {
    method: 'POST',
    body: {
      ...data,
    },
  });
}

export async function deleteData(data) {
  return request('/geo/geocms/deleteCategory', {
    method: 'POST',
    body: {
      ...data,
    }
  });
}

export async function updateData(data) {
  return request('/geo/geocms/updateCategory',{
    method: 'POST',
    body: {
      ...data,
    }
  });
}

