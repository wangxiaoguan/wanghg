import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryData(params) {
  return request(`/geo/geocms/queryTrain?${stringify(params)}`);
}

export async function addData(data) {
  return request('/geo/geocms/addTrain', {
    method: 'POST',
    body: {
      ...data,
    },
  });
}

export async function deleteData(data) {
  return request('/geo/geocms/deleteTrain', {
    method: 'POST',
    body: {
      ...data,
    }
  });
}

export async function updateData(data) {
  return request('/geo/geocms/updateTrain',{
    method: 'POST',
    body: {
      ...data,
    }
  });
}
