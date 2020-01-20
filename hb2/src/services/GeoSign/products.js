import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryData(params) {
  return request(`/geo/geocms/queryProduct?${stringify(params)}`);
}

export async function addData(data) {
  return request('/geo/geocms/addProduct', {
    method: 'POST',
    body: {
      ...data,
    },
  });
}

export async function deleteData(data) {
  return request('/geo/geocms/deleteProduct', {
    method: 'POST',
    body: {
      ...data,
    }
  });
}

export async function updateData(data) {
  return request('/geo/geocms/updateProduct',{
    method: 'POST',
    body: {
      ...data,
    }
  });
}
