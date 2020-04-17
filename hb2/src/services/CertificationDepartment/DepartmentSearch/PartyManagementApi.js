import request from '@/utils/request';

export async function remove(param) {
  return request(`/services/exam/fhexamregisteruser/registerUser/delete`, {
    method: 'PUT',
    body: param,
  });
}

export async function pwdreset(param) {
  return request(`/services/exam/fhexamregisteruser/registerUser/updatePwd`, {
    method: 'PUT',
    body: param,
  });
}

export async function search(param) {
  return request(`/services/exam/fhexamregisteruser/getUserDetail/${param}`);
}


export async function update(param) {
    return request(`/services/exam/fhexamregisteruser/registerUser/update`, {
      method: 'PUT',
      body: param,
    });
  }