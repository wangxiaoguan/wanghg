// ref: https://umijs.org/config/
import pageRoutes from './router.config';
import { primaryColor } from '../src/defaultSettings';
import commenConfig from './commenConfig';

export default {
  treeShaking: true,
  targets: {
    ie: 9,
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        title: '北京联通',
        dynamicImport: false,
        dll: false,
        targets: {
          ie: 9,
        },
        // locale: {
        //   enable: true, // default false
        //   default: 'zh-CN', // default zh-CN
        // },
        routes: {
          exclude: [/components\//],
        },
      },
    ],
  ],

  /**
   * 路由相关配置
   */
  routes: pageRoutes,
  disableRedirectHoist: true,
  /**
   * webpack 相关配置
   */

  proxy: {
    '/bjdj02': {
      target: `${commenConfig.path}/bjdj02`,
      changeOrigin: true,
      pathRewrite: {
        '^/bjdj02': '/',
      },
    },
  },
  theme: {
    'primary-color': primaryColor,
  },
  history: 'hash',
  base: './',
  publicPath: './',
};
