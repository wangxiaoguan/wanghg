export const port = 'http://localhost:8600/';                       //本地
export const masterUrl = '';

//***************************外部环境路径************************* */
//图片，文件上传地址
export const UploadUrl = port + 'services/system/file/upload/AttachmentUpload'
//图片显示查看 前缀地址
export const PictrueUrl = 'http://yq-fiberhome-test.oss-cn-hangzhou.aliyuncs.com/'

export const FileUrl = port + 'services/attachment/file/upload/AttachmentUpload'
export const API_FILE_VIEW_INNER = 'http://10.110.200.185:9080/'                 //185环境
// export const API_FILE_VIEW_INNER = 'http://119.36.213.19:9080/'                 //19环境

//设置不同服务条件，以用来判断选择图片上传路径
export const ChooseUrl=2             // 1 对应的是 UploadUrl/PictrueUrl
// export const ChooseUrl=2             // 2 对应的是 services/attachment/file/upload/AttachmentUpload

//export const masterUrl = 'http://172.16.34.188:9080/';
//企业管理切换角色登录跳转链接
export const DefaultLoginUrl = port+"youquweb/#/login";
const ServiceApi = port;
export default ServiceApi;

