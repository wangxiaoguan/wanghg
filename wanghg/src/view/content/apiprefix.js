export const port = 'http://localhost:8600/';                       //本地
// export const port = 'http://10.110.200.185:443/';                   //185
//export const port = 'http://10.110.200.62:443/';                      //62
// export const port = 'http://119.36.213.19:8083/';                       //19
//const API_PREFIX = port /*+'/exweb'*/;
//export const masterUrl = 'http://10.110.200.185:9080/';
//export const masterUrl = 'http://10.110.200.62:9080/';
export const masterUrl = '';

//***************************外部环境路径************************* */
//图片，文件上传地址
export const API_FILE_UPLOAD = port + 'services/system/file/upload/AttachmentUpload'
//图片显示查看 前缀地址
export const API_FILE_VIEW = 'http://yq-fiberhome-test.oss-cn-hangzhou.aliyuncs.com/'

//***************************内部环境路径************************* */
//图片，文件上传地址
export const API_FILE_UPLOAD_INNER = port + 'services/attachment/file/upload/AttachmentUpload'
//图片显示时，内部环境查看 ，需要添加前缀地址
// export const API_FILE_VIEW_INNER = 'http://10.110.200.62:9080/'                  //62环境
export const API_FILE_VIEW_INNER = 'http://10.110.200.185:9080/'                 //185环境
// export const API_FILE_VIEW_INNER = 'http://119.36.213.19:9080/'                 //19环境

//设置不同服务条件，以用来判断选择图片上传路径
export const API_CHOOSE_SERVICE=2             // 1 对应的是 API_FILE_UPLOAD/API_FILE_VIEW
// export const API_CHOOSE_SERVICE=2             // 2 对应的是 services/attachment/file/upload/AttachmentUpload

//export const masterUrl = 'http://172.16.34.188:9080/';
//企业管理切换角色登录跳转链接
export const DEFAULT_LOGIN_URL = port+"youquweb/#/login";
const API_PREFIX = port;
export default API_PREFIX;

