import request from '@/utils/request';


export async function updateCheckStatus(body) {
  return request(`services/exam/fhexamcapacity/update`, {
    method: 'PUT',
    body
  });
}


export async function updateBatchCheckStatus(body) {
  return request(`services/exam/fhexamcapacity/updateStatus`, {
    method: 'PUT',
    body
  });
}

export async function remove(id) {
  return request(`/services/exam/fhexamcapacity/delete/${id}`, {
    method: 'DELETE',
    // body: param
  });
}

export async function removeAll(id) {
  return request(`/services/exam/fhexamcapacity/delete/deleteAllByCertifId/${id}`, {
    method: 'DELETE',
  });
}

export async function add(param) {
  return request(`/services/exam/fhexamcapacity/insert`, {
    method: 'POST',
    body: param,
  });
}

export async function update(param) {
  return request(`/services/exam/fhexamcapacity/update`, {
    method: 'PUT',
    body: param,
  });
}

export async function search(id) {
  return request(`/services/exam/fhexamcapacity/get/${id}`);
}
