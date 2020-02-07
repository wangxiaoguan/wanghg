   export const port = 'http://localhost:8600/';                       //本地
// export const port = 'http://10.110.200.185:443/';                   //185
// export const port = 'http://119.36.213.19:8083/';                       //19
// export const port = 'http://119.36.213.65:30000/';                       //65  线上 废弃
// export const port = 'http://223.75.53.181:30000/';                          //65  线上
//   export const port = 'http://10.128.151.140:443/';                         //楚天云oss

// export const port = 'http://www.cictsj.com:18443/';                         //正式环境
// export const port = 'https://www.cictsj.com:18443/';                         //正式环境https

// export const port = 'https://test.cictsj.com:30000/';                      //65测试环境https
// export const port = 'http://test.cictsj.com:30000/';                      //65测试环境http

// export const port = 'https://test.cictsj.com:30001/';


// export const port = 'http://10.110.200.62:443/';                      //62  2.6版本开发环境
// export const port = 'http://10.128.151.139:443/';                      //2.6版本测试环境
// export const port = 'http://119.36.213.209:30000/';                      //2.6版本预生产环境
// export const port = 'http://119.36.213.204:81/';                      //2.6版本生产环境
// export const port = 'http://119.36.213.124:30000/';                     //演示用的环境
//const API_PREFIX = port /*+'/exweb'*/;
//export const masterUrl = 'http://10.110.200.185:9080/';
//export const masterUrl = 'http://10.110.200.62:9080/';
export const masterUrl = '';

//***************************外部环境路径************************* */
//图片，文件上传地址
export const API_FILE_UPLOAD = port + 'services/web/file/upload/AttachmentUpload';

//商家、商品相关图片、文件上传
export const API_FILE_MALLUPLOAD = port + 'services/web/file/upload/mallUpload';
//图片显示查看 前缀地址
// export const API_FILE_VIEW = 'http://yq-fiberhome-test.oss-cn-hangzhou.aliyuncs.com/'
// export const API_FILE_VIEW = 'http://yq-fiberhome-test.img-cn-hangzhou.aliyuncs.com/'      //上传图片时根据app返回链接调整   65演示环境
// export const API_FILE_VIEW = 'http://yq-fiberhome-prod.img-cn-hangzhou.aliyuncs.com/'      //上传图片时根据app返回链接调整 65 
// export const API_FILE_VIEW = 'http://yq-fiberhome-test.img-cn-hangzhou.aliyuncs.com/'      //上传图片时根据app返回链接调整 65/185 线上 test   2019/3/12 与测试确认

// export const API_FILE_VIEW = window.sessionStorage.getItem('ossViewPath')                     //楚天云oss测试环境
export const API_FILE_VIEW = 'http://ctyoss.chutianyun.gov.cn:8060/yq_fiberhome_test/'     //楚天云oss正式环境
// export const API_FILE_VIEW = 'http://ctyoss.chutianyun.gov.cn:8060/yq_fiberhome_prod/'     //楚天云oss正式环境

//商家、商品相关图片、文件OSS
export const API_FILE_MALLVIEW = 'http://ctyoss.chutianyun.gov.cn:8060/yq_fiberhome_test/'     //楚天云oss正式环境
// export const API_FILE_MALLVIEW = 'http://ctyoss.chutianyun.gov.cn:8060/yq_fiberhome_prod/'     //楚天云oss正式环境

//***************************内部环境路径************************* */
//图片，文件上传地址
export const API_FILE_UPLOAD_INNER = port + 'services/attachment/file/upload/AttachmentUpload';
//图片显示时，内部环境查看 ，需要添加前缀地址
// export const API_FILE_VIEW_INNER = 'http://10.110.200.62:9080/'                  //62环境
export const API_FILE_VIEW_INNER = 'http://10.110.200.185:9080/';                 //185环境
// export const API_FILE_VIEW_INNER = 'http://119.36.213.19:9080/'                 //19环境

//设置不同服务条件，以用来判断选择图片上传路径     
// export const API_CHOOSE_SERVICE = 1             // 1 对应的是 API_FILE_UPLOAD/API_FILE_VIEW
// export const API_CHOOSE_SERVICE=2             // 2 对应的是 services/attachment/file/upload/AttachmentUpload
// export const API_CHOOSE_SERVICE=1             // 1 对应的是 API_FILE_UPLOAD/API_FILE_VIEW
export const API_CHOOSE_SERVICE = 1;             // 2 对应的是 services/attachment/file/upload/AttachmentUpload

//export const masterUrl = 'http://172.16.34.188:9080/';
//企业管理切换角色登录跳转链接
export const DEFAULT_LOGIN_URL = port + "youquweb/#/login";
const API_PREFIX = port;
export default API_PREFIX;



