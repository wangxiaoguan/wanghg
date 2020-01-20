import request from '@/utils/request';

export async function remove(id) {
  return request(`/services/exam/fhexamcertificate/delete/${id}`, {
    method: 'DELETE',
    // body: param
  });
}

export async function add(param) {
  return request(`/services/exam/fhexamcertificate/insert`, {
    method: 'POST',
    body: param,
  });
}

export async function update(param) {
  return request(`/services/exam/fhexamcertificate/update`, {
    method: 'PUT',
    body: param,
  });
}

export async function search(id) {
  return request(`/services/exam/fhexamcertificate/get/${id}`);
}


export async function getAll(orgId) {
  return request(`/services/exam/fhexamcertificate/getByOrgId/${orgId}`)
}
