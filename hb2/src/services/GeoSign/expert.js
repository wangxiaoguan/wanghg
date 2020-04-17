import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryData(params) {
  return request(`/geo/geocms/queryExpert?${stringify(params)}`);
}

export async function addData(data) {
  return request('/geo/geocms/addExpert', {
    method: 'POST',
    body: {
      ...data,
    },
  });
}

export async function deleteData(data) {
  return request('/geo/geocms/deleteExpert', {
    method: 'POST',
    body: {
      ...data,
    }
  });
}

export async function updateData(data) {
  return request('/geo/geocms/updateExpert',{
    method: 'POST',
    body: {
      ...data,
    }
  });
}
