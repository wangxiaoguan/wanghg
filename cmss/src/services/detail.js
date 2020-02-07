import {request} from '../utils/request';
import commenConfig from '../../config/commenConfig';

// 获取咨询详情
export async function getDetails(params) {
  return request('/app/newsActivity/service.do', {
    method: 'POST',
    body: params,
  });
}

// 获取接收人tree结构
export async function getTree(params) {
  return request('/app/taskTX/service.do', {
    method: 'POST',
    body: params,
  });
}

export async function getActivityMembers(params) {
  return request('/app/service.do', {
    method: 'POST',
    body: params,
  });
}

// 发送新建会议通知任务
export async function sendTask(params) {
  return request('/app/taskTX/service.do', {
    method: 'POST',
    body: params,
  });
}

// 发送新建换届通知任务
export async function partyChange(params) {
  return request('/app/partyChange/service.do', {
    method: 'POST',
    body: params,
  });
}

// 获取换届任务列表
export async function getTaskList(params) {
  return request('/app/partyChange/service.do', {
    method: 'POST',
    body: params,
  });
}

// 获取任务详情
export async function getTaskDetail(params) {
  return request('/app/taskTX/service.do', {
    method: 'POST',
    body: params,
  });
}

// 获取换届任务列表
export async function getAllTree(params) {
  return request('/app/taskTX/service.do', {
    method: 'POST',
    body: params,
  });
}

// 参与活动
export async function joinActivity(params) {
  return request('/app/service.do', {
    method: 'POST',
    body: params,
  });
}

// 退出活动
export async function exitActivity(params) {
  return request('/app/service.do', {
    method: 'POST',
    body: params,
  });
}

// 保存稿件
export async function saveAttachment(params) {
  return request('/app/newsActivity/service.do', {
    method: 'POST',
    body: params,
  });
}

export async function deleteAttachment(params) {
  return request('/app/newsActivity/service.do', {
    method: 'POST',
    body: params,
  });
}

// 附件上传
export function uploadFile(file) {
  return request(`${commenConfig.filePath}/services/system/file/upload/AttachmentUpload/paty`, {
    method: 'POST',
    body: file,
  });
}

// 获取职务
export async function getUserLevel(params) {
  return request('/app/party/service.do', {
    method: 'POST',
    body: params,
  });
}

// 导出
export async function exportFile(params) {
  return request('/app/partyChange/service.do', {
    method: 'POST',
    body: params,
  });
}

// 获取请示
export async function getAsk(params) {
  return request('/app/partyChange/service.do', {
    method: 'POST',
    body: params,
  });
}

// 获取图集
export async function getImgList(params) {
  return request('/app/news/service.do', {
    method: 'POST',
    body: params,
  });
}

// 获取视频信息
export async function getVideoInfo(params) {
  return request(params.videoUrl, {
    method: 'GET',
    // mode: 'no-cors',
  });
}
