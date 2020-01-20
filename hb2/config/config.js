import os from 'os';

import defaultSettings from '../src/defaultSettings';

import webpackPlugin from './plugin.config';
const pageRoutes = require('./router.config');

// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');


function addAuthority(routeList, parentAuthority = null) {
  if (routeList && routeList.length > 0) {
    for (let i = 0; i < routeList.length; i++) {
      let item = routeList[i];
      //根路径不加权限
      if (item.path !== '' && item.path !== '/') {
        if (!item.authority) {
          item.authority = [];
        }

        // 添加admin
        if (item.authority.indexOf('admin') < 0) {
          item.authority.push('admin');
        }

        //添加name
        const name = item.name;
        if (name && item.authority.indexOf(name) < 0) {
          item.authority.push(name);
        }

        //添加父路由允许的角色到子路由中
        if (parentAuthority) {
          // item.authority.push(...parentAuthority);
          for (let authority of parentAuthority) {
            if (item.authority.indexOf(authority) < 0) {
              item.authority.push(authority);
            }
          }
        }
      }

      //处理子路由
      if (item.routes) {
        addAuthority(item.routes, item.authority);
      }
    }
  }
}

//给所有路由加上权限1、 admin  2、和name同名
if (pageRoutes) {
  addAuthority(pageRoutes);
}

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      targets: {
        ie: 11,
      },
      locale: {
        enable: false, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: false, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
      },
      // pwa: {
      //   workboxPluginMode: 'InjectManifest',
      //   workboxOptions: {
      //     importWorkboxFrom: 'local',
      //   },
      // },
      ...(!process.env.TEST && os.platform() === 'darwin'
        ? {
          dll: {
            include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
            exclude: ['@babel/runtime'],
          },
          hardSource: false,
        }
        : {}),
    },
  ],
];

// 针对 preview.pro.ant.design 的 GA 统计代码
// 业务上不需要这个
if (process.env.APP_TYPE === 'site') {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
}

module.exports = {
  // add for transfer to umi
  plugins,
  targets: {
    ie: 11,
  },
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
    'btn-danger-bg': '#ffffff',
    'btn-danger-color': '#ff6766',
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  // proxy: {
  //   '/server/api/': {
  //     target: 'https://preview.pro.ant.design/',
  //     changeOrigin: true,
  //     pathRewrite: { '^/server': '' },
  //   },
  // },
  ignoreMomentLocale: false,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = antdProPath
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  publicPath: '/officialWebBack/',

  chainWebpack: webpackPlugin,
  history: 'hash',
  proxy: {
    '/services/*': {
      // target:'http://10.0.10.46:31019/',
      target: 'http://58.49.132.133:31019/',
      // target: 'http://10.39.12.21:8081/',
      // target: 'http://10.1.243.48:8080/',
      changeOrigin: true,
    },

    '/lookup': {
      target: 'http://10.0.10.46:31019/',
      changeOrigin: true,
    },

    '/cas': {
      target: 'http://58.49.132.133:31019/',
      changeOrigin: true,
    },

    '/geo': {
      target: 'http://localhost:8080/',
      changeOrigin: true,
      pathRewrite: {'^/geo': ''},
    }
  }
};
