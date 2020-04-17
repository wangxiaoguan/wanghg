import request from '@/utils/request';

export async function remove(id) {
  return request(`/services/wto/wtohbexportinfo/delete/${id}`, {method: 'DELETE'});
}
