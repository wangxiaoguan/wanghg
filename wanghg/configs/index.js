module.exports = {
  APP_NAME: '悠趣',
  PORT: process.env.PORT || 8600,
  PROXY_OPTION: {
    // target: 'http://10.110.200.62:443',
    //   target:'http://172.16.34.188:443/',
    "/services": {
      target:'http://localhost:8600/',
      // target: 'http://10.110.200.62:443/',             //62
      // target: 'http://10.110.200.185:443/',            //185
      // target: 'http://119.36.213.19:8083/',                //19
      changeOrigin: true,
    },
  },
};
