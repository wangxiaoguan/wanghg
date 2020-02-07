import { request } from '@/utils/request';
import commenConfig from '../../config/commenConfig'
// 添加学习心得
export async function addNote(params) {
  return request('/app/learningNotes/service.do', {
    method: 'POST',
    body: params,
  });
}

// 修改学习心得
export async function updateNote(params) {
  return request('/app/learningNotes/service.do', {
    method: 'POST',
    body: params,
  });
}

// 查询心得
export async function getNote(params) {
  return request('/app/learningNotes/service.do', {
    method: 'POST',
    body: params,
  });
}

// 上传附件
export async function upload(params) {
  const uploadPath = commenConfig.filePath + '/services/system/file/sftpUpload/AttachmentUpload/news'
  return request(uploadPath, {
    method: 'POST',
    body: params,
  });
}

