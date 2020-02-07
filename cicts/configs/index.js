
module.exports = {
  APP_NAME: '智慧党建',
  PORT: process.env.PORT || 8600,
  PROXY_OPTION: {
    "/services": {
    //   target: 'http://10.110.200.185:443/',            //185
      // target: 'http://223.75.53.181:30000/',       //65环境
      // target: 'http://msp.iyouqu.com.cn:18443/',      //灰度正式环境
      // target: 'http://47.111.62.123:80/',    //阿里云测试环境
    //   target: 'http://10.127.7.60:30000/',   //云计算中心 环境
    //   target: 'http://10.128.151.140:443/',   //楚天云oss
        // target: 'http://www.cictsj.com:18443/',  //正式环境
        // target: 'https://www.cictsj.com:18443/',  //正式环境https
        ///target: 'https://test.cictsj.com:30000/',    //65测试环境https
        // target: 'http://test.cictsj.com:30000/',    //65测试环境http

        target: 'http://10.110.200.62:443/',     //62 2.6版本开发环境
        // target: 'http://10.128.151.139:443/',    //2.6版本测试环境
        // target: 'http://119.36.213.209:30000/',  //2.6版本预生产环境
      
        // target: 'http://119.36.213.204:81/',    //2.6版本生产环境
      // target: 'http://119.36.213.124:30000/',   //演示用的环境
      changeOrigin: true,
    },
    // "/services/partybuildingreport/partyClass/tasklist/1/10/-1": {
    //   target: 'http://10.102.231.227:8881/',             //后台本地ip
    //   changeOrigin: true,
    // },
  },
};
