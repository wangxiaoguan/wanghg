import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryData(params) {
  return request(`/geo/geocms/queryProductKind?${stringify(params)}`);
}

export async function addData(data) {
  return request('/geo/geocms/addProductKind', {
    method: 'POST',
    body: {
      ...data,
    },
  });
}

export async function deleteData(data) {
  return request('/geo/geocms/deleteProductKind', {
    method: 'POST',
    body: {
      ...data,
    }
  });
}

export async function updateData(data) {
  return request('/geo/geocms/updateProductKind',{
    method: 'POST',
    body: {
      ...data,
    }
  });
}

