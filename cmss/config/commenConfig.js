// / 切换环境 请只修改TYPE值
const TYPE = 2; // 1开发环境 2测试环境 3地铁一线测试环境 4正式环境

const loadPath = type => {
  if (type === 4) {
    // 正式环境
    return {
      PATH: 'http://moa.bjunicom.com.cn:10080',
      FILEPATH: 'http://moa.bjunicom.com.cn:10080/services',
      DOWNPATH: 'http://moatest.bjunicom.com.cn:10090/bjdj_img/',
      BACKPATH: 'http://moa.bjunicom.com.cn:10080/services#/InformationManagement/Article',
    };
  }
  if (type === 2) {
    // 测试环境
    return {
      PATH: 'http://10.128.151.140:28080',
      FILEPATH: 'http://10.128.151.140:443',
      DOWNPATH: 'http://10.128.27.22:18080/oss',
      BACKPATH: 'http://10.128.151.136:443/youquweb#/InformationManagement/Article',
    };
  }
  if (type === 3) {
    // 地铁一线测试环境
    return {
      PATH: 'http://10.104.15.17:28082',
      FILEPATH: 'http://10.104.15.17:443',
      DOWNPATH: 'https://yq-fiberhome-test.oss-cn-hangzhou.aliyuncs.com',
      BACKPATH: 'http://www.fiberhome.com',
    };
  }
  // 开发环境
  return {
    PATH: 'http://14.215.219.149:27081',
    FILEPATH: 'http://10.128.27.22:27080',
    DOWNPATH: 'https://yq-fiberhome-test.oss-cn-hangzhou.aliyuncs.com',
    BACKPATH: 'http://www.fiberhome.com',
  };
};

const menuPath = {
  top10: '1557825663934673', // 首页党建要闻
  conduct: '1557713059836765', // 党风廉政
  interaction: '1557713132607341', // 党群互动
  onlineClassroom: '1557475552114257', // 网上课堂
  politicalBuildSeek: '1557825663934673', // 党建资讯
};

export default {
  /**
   * 接口服务器地址
   */
  path: loadPath(TYPE).PATH,
  /**
   * 文件服务器地址
   */
  filePath: loadPath(TYPE).FILEPATH,
  /**
   * 文件下载地址
   */
  downPath: loadPath(TYPE).DOWNPATH,
  /**
   * 事项提醒轮询时间间隔
   * 时间单位：s
   */
  remindIntervalTime: 5,

  /**
   * 学习强国地址
   */
  xuexiqiangguo: 'https://www.xuexi.cn',

  /**
   * 进入后台地址
   */
  backstage: loadPath(TYPE).BACKPATH,

  /**
   * menuId
   */
  menuPath,

  TYPE
};
