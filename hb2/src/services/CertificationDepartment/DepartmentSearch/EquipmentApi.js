import request from '@/utils/request';

export async function remove(param) {
  return request(`/services/exam/fhexamsignatory/update`, {
    method: 'POST',
    body: param
  });
}

export async function add(param) {
  return request(`/services/exam/fhexamapparatus/insert`, {
    method: 'POST',
    body: param,
  });
}

export async function update(param) {
  return request(`/services/exam/fhexamapparatus/update`, {
    method: 'POST',
    body: param,
  });
}

export async function search(id) {
  return request(`/services/exam/fhexamapparatus/selectById/${id}`);
}