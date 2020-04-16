import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@tmp/history';
import RendererWrapper0 from 'F:/youqu/SBY2/src/pages/.umi/LocaleWrapper.jsx'
import _dvaDynamic from 'dva/dynamic'

const Router = require('dva/router').routerRedux.ConnectedRouter;

const routes = [
  {
    "path": "/",
    "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../../layouts/BasicLayout'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../../layouts/BasicLayout').default,
    "Routes": [require('../Authorized').default],
    "routes": [
      {
        "path": "/",
        "redirect": "/userCenter",
        "exact": true
      },
      {
        "path": "/userCenter",
        "name": "userCenter",
        "icon": "user",
        "authority": [
          "admin",
          "userCenter"
        ],
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../UserCenter/UserCenter'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../UserCenter/UserCenter').default,
        "exact": true
      },
      {
        "path": "/news",
        "name": "news",
        "icon": "file-text",
        "authority": [
          "admin",
          "news"
        ],
        "routes": [
          {
            "path": "/news/advertList",
            "name": "advertList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Advert/AdvertList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Advert/AdvertList').default,
            "authority": [
              "admin",
              "advertList",
              "news"
            ],
            "exact": true
          },
          {
            "path": "/news/advertList/advertEdit/:id?",
            "name": "advertEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Advert/AdvertEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Advert/AdvertEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "advertEdit",
              "news"
            ],
            "exact": true
          },
          {
            "path": "/news/list",
            "name": "newsList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../News/NewsList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../News/NewsList').default,
            "authority": [
              "admin",
              "newsList",
              "news"
            ],
            "exact": true
          },
          {
            "path": "/news/list/edit/:id?/:detail?",
            "name": "newsEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../News/NewsEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../News/NewsEdit').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "newsEdit",
              "news"
            ],
            "exact": true
          },
          {
            "path": "/news/categoryList",
            "name": "categoryList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../News/NewsCategoryList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../News/NewsCategoryList').default,
            "authority": [
              "admin",
              "categoryList",
              "news"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/system",
        "name": "system",
        "icon": "setting",
        "authority": [
          "admin",
          "system"
        ],
        "routes": [
          {
            "path": "/system/friendLink",
            "name": "friendLink",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../System/FriendLink'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../System/FriendLink').default,
            "authority": [
              "admin",
              "friendLink",
              "system"
            ],
            "exact": true
          },
          {
            "path": "/system/menu",
            "name": "menu",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../System/MenuList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../System/MenuList').default,
            "authority": [
              "admin",
              "menu",
              "system"
            ],
            "exact": true
          },
          {
            "path": "/system/quickFunction",
            "name": "quickFunction",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../System/QuickFunction'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../System/QuickFunction').default,
            "authority": [
              "admin",
              "quickFunction",
              "system"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/home",
        "name": "home",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/Home/Home.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/Home/Home.tsx').default,
        "icon": "home",
        "authority": [
          "expert",
          "admin",
          "home"
        ],
        "exact": true
      },
      {
        "path": "/defectProductContent",
        "name": "defectProductContent",
        "icon": "file-text",
        "authority": [
          "expert",
          "admin",
          "defectProductContent"
        ],
        "routes": [
          {
            "path": "/defectProductContent/AdvertList",
            "name": "AdvertList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/Contents/AdvertList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/Contents/AdvertList').default,
            "authority": [
              "admin",
              "AdvertList",
              "expert",
              "defectProductContent"
            ],
            "exact": true
          },
          {
            "path": "/defectProductContent/AdvertList/AdvertEdit/:id?",
            "name": "AdvertEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/Contents/AdvertEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/Contents/AdvertEdit').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "AdvertEdit",
              "expert",
              "defectProductContent"
            ],
            "exact": true
          },
          {
            "path": "/defectProductContent/NewsList",
            "name": "NewsList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/Contents/NewsList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/Contents/NewsList').default,
            "authority": [
              "admin",
              "NewsList",
              "expert",
              "defectProductContent"
            ],
            "exact": true
          },
          {
            "path": "/defectProductContent/NewsList/NewsEdit/:id?/:readOnly?",
            "name": "NewsEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/Contents/NewsEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/Contents/NewsEdit').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "NewsEdit",
              "expert",
              "defectProductContent"
            ],
            "exact": true
          },
          {
            "path": "/defectProductContent/RecallAdvert",
            "name": "RecallAdvert",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/Contents/RecallAdvert'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/Contents/RecallAdvert').default,
            "authority": [
              "admin",
              "RecallAdvert",
              "expert",
              "defectProductContent"
            ],
            "exact": true
          },
          {
            "path": "/defectProductContent/RecallAdvert/RecallAdvertEdit/:id?/:readOnly?",
            "name": "RecallAdvertEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/Contents/RecallAdvertEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/Contents/RecallAdvertEdit').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "RecallAdvertEdit",
              "expert",
              "defectProductContent"
            ],
            "exact": true
          },
          {
            "path": "/defectProductContent/ConsumptionWarning",
            "name": "ConsumptionWarning",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/Contents/ConsumptionWarning'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/Contents/ConsumptionWarning').default,
            "authority": [
              "admin",
              "ConsumptionWarning",
              "expert",
              "defectProductContent"
            ],
            "exact": true
          },
          {
            "path": "/defectProductContent/ConsumptionWarning/ConsumptionWarningEdit/:id?/:readOnly?",
            "name": "ConsumptionWarningEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/Contents/ConsumptionWarningEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/Contents/ConsumptionWarningEdit').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "ConsumptionWarningEdit",
              "expert",
              "defectProductContent"
            ],
            "exact": true
          },
          {
            "path": "/defectProductContent/Knowledge",
            "name": "Knowledge",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/Contents/Knowledge'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/Contents/Knowledge').default,
            "authority": [
              "admin",
              "Knowledge",
              "expert",
              "defectProductContent"
            ],
            "exact": true
          },
          {
            "path": "/defectProductContent/Knowledge/KnowledgeEdit/:id?/:readOnly?",
            "name": "KnowledgeEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/Contents/KnowledgeEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/Contents/KnowledgeEdit').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "KnowledgeEdit",
              "expert",
              "defectProductContent"
            ],
            "exact": true
          },
          {
            "path": "/defectProductContent/Laws",
            "name": "Laws",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/Contents/Laws'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/Contents/Laws').default,
            "authority": [
              "admin",
              "Laws",
              "expert",
              "defectProductContent"
            ],
            "exact": true
          },
          {
            "path": "/defectProductContent/Laws/LawsEdit/:id?/:readOnly?",
            "name": "LawsEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/Contents/LawsEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/Contents/LawsEdit').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "LawsEdit",
              "expert",
              "defectProductContent"
            ],
            "exact": true
          },
          {
            "path": "/defectProductContent/Introduction",
            "name": "Introduction",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/Contents/Introduction'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/Contents/Introduction').default,
            "authority": [
              "admin",
              "Introduction",
              "expert",
              "defectProductContent"
            ],
            "exact": true
          },
          {
            "path": "/defectProductContent/FriendLink",
            "name": "FriendLink",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/Contents/FriendLink.jsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/Contents/FriendLink.jsx').default,
            "authority": [
              "admin",
              "FriendLink",
              "expert",
              "defectProductContent"
            ],
            "exact": true
          },
          {
            "path": "/defectProductContent/FriendLink/FriendLinkEdit/:id?",
            "name": "FriendLinkEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/Contents/FriendLinkEdit.jsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/Contents/FriendLinkEdit.jsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "FriendLinkEdit",
              "expert",
              "defectProductContent"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/defectProduct",
        "name": "defectProduct",
        "icon": "alert",
        "authority": [
          "expert",
          "admin",
          "defectProduct"
        ],
        "routes": [
          {
            "path": "/defectProduct/Consumer",
            "name": "Consumer",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/DefectProduct/Consumer.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/DefectProduct/Consumer.tsx').default,
            "authority": [
              "admin",
              "Consumer",
              "expert",
              "defectProduct"
            ],
            "exact": true
          },
          {
            "path": "/defectProduct/Car",
            "name": "Car",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/DefectProduct/Car.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/DefectProduct/Car.tsx').default,
            "authority": [
              "admin",
              "Car",
              "expert",
              "defectProduct"
            ],
            "exact": true
          },
          {
            "path": "/defectProduct/Consumer/ConsumerDetail/:id?",
            "name": "ConsumerDetail",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/DefectProduct/ConsumerDetail.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/DefectProduct/ConsumerDetail.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "ConsumerDetail",
              "expert",
              "defectProduct"
            ],
            "exact": true
          },
          {
            "path": "/defectProduct/Car/CarDetail/:id?",
            "name": "CarDetail",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/DefectProduct/CarDetail.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/DefectProduct/CarDetail.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "CarDetail",
              "expert",
              "defectProduct"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/defectProductStatistics",
        "name": "defectProductStatistics",
        "icon": "bar-chart",
        "authority": [
          "expert",
          "admin",
          "defectProductStatistics"
        ],
        "routes": [
          {
            "path": "/defectProductStatistics/NewsStatistics",
            "name": "NewsStatistics",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/Statistics/NewsStatistics.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/Statistics/NewsStatistics.tsx').default,
            "authority": [
              "admin",
              "NewsStatistics",
              "expert",
              "defectProductStatistics"
            ],
            "exact": true
          },
          {
            "path": "/defectProductStatistics/DataStatistics",
            "name": "DataStatistics",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/Statistics/DataStatistics.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/Statistics/DataStatistics.tsx').default,
            "authority": [
              "admin",
              "DataStatistics",
              "expert",
              "defectProductStatistics"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/SampleProductList",
        "name": "SampleProductList",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/SampleProductList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/SampleProductList.tsx').default,
        "icon": "api",
        "authority": [
          "expert",
          "admin",
          "SampleProductList"
        ],
        "exact": true
      },
      {
        "path": "/SampleProductList/SampleProductEdit/:id?",
        "name": "SampleProductEdit",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/SampleProductEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/SampleProductEdit.tsx').default,
        "authority": [
          "expert",
          "admin",
          "SampleProductEdit"
        ],
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/SampleProductList/SampleProductDetail/:type/:id?",
        "name": "SampleProductEdit",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/SampleProductEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/SampleProductEdit.tsx').default,
        "authority": [
          "expert",
          "admin",
          "SampleProductEdit"
        ],
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/expertDatabase/ExpertDatabaseList",
        "name": "ExpertDatabaseList",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/ExpertDatabase/ExpertDatabaseList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/ExpertDatabase/ExpertDatabaseList.tsx').default,
        "icon": "team",
        "authority": [
          "expert",
          "admin",
          "ExpertDatabaseList"
        ],
        "exact": true
      },
      {
        "path": "/expertDatabase/ExpertDatabaseList/ExpertDatabaseEdit/:type?/:id?",
        "name": "ExpertDatabaseEdit",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/ExpertDatabase/ExpertDatabaseEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/ExpertDatabase/ExpertDatabaseEdit.tsx').default,
        "authority": [
          "expert",
          "admin",
          "ExpertDatabaseEdit"
        ],
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/FaultProductList",
        "name": "FaultProductList",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/FaultProductList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/FaultProductList.tsx').default,
        "icon": "apple",
        "authority": [
          "expert",
          "admin",
          "FaultProductList"
        ],
        "exact": true
      },
      {
        "path": "/FaultProductList/FaultProductEdit/:id?",
        "name": "FaultProductEdit",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/FaultProductEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/FaultProductEdit.tsx').default,
        "authority": [
          "expert",
          "admin",
          "FaultProductEdit"
        ],
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/FaultProductList/FaultProductDetail/:type/:id?",
        "name": "FaultProductEdit",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/FaultProductEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/FaultProductEdit.tsx').default,
        "authority": [
          "expert",
          "admin",
          "FaultProductEdit"
        ],
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/CompanyRecordList",
        "name": "CompanyRecordList",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/CompanyRecordList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/CompanyRecordList.tsx').default,
        "icon": "laptop",
        "authority": [
          "expert",
          "admin",
          "CompanyRecordList"
        ],
        "exact": true
      },
      {
        "path": "/CompanyRecordList/CompanyRecordEdit/:id?",
        "name": "CompanyRecordEdit",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/CompanyRecordEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/CompanyRecordEdit.tsx').default,
        "authority": [
          "expert",
          "admin",
          "CompanyRecordEdit"
        ],
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/CompanyRecordList/CompanyRecordDetail/:type/:id?",
        "name": "CompanyRecordDetail",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/CompanyRecordEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/CompanyRecordEdit.tsx').default,
        "authority": [
          "expert",
          "admin",
          "CompanyRecordDetail"
        ],
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/CarThreeGuarantees",
        "name": "CarThreeGuarantees",
        "icon": "car",
        "authority": [
          "expert",
          "admin",
          "CarThreeGuarantees"
        ],
        "routes": [
          {
            "path": "/CarThreeGuarantees/CarThreeConsumerList",
            "name": "CarThreeConsumerList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/CarThree/CarThreeConsumerList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/CarThree/CarThreeConsumerList.tsx').default,
            "authority": [
              "admin",
              "CarThreeConsumerList",
              "expert",
              "CarThreeGuarantees"
            ],
            "exact": true
          },
          {
            "path": "/CarThreeGuarantees/CarThreeConsumerList/CarThreeConsumerEdit/:detail?/:id?",
            "name": "CarThreeConsumerEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/CarThree/CarThreeConsumerEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/CarThree/CarThreeConsumerEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "CarThreeConsumerEdit",
              "expert",
              "CarThreeGuarantees"
            ],
            "exact": true
          },
          {
            "path": "/CarThreeGuarantees/CarThreeConsumerList/CarThreeConsumerDetail/:type/:id?",
            "name": "CarThreeConsumerEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/CarThree/CarThreeConsumerEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/CarThree/CarThreeConsumerEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "CarThreeConsumerEdit",
              "expert",
              "CarThreeGuarantees"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/PointCheckList",
        "name": "PointCheckList",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/PointCheckList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/PointCheckList.tsx').default,
        "icon": "form",
        "authority": [
          "expert",
          "admin",
          "PointCheckList"
        ],
        "exact": true
      },
      {
        "path": "/PointCheckList/PointCheckEdit/:id?",
        "name": "PointCheckEdit",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/PointCheckEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/PointCheckEdit.tsx').default,
        "authority": [
          "expert",
          "admin",
          "PointCheckEdit"
        ],
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/PointCheckList/PointCheckDetail/:id?",
        "name": "PointCheckDetail",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/PointCheckDetail.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/PointCheckDetail.tsx').default,
        "authority": [
          "expert",
          "admin",
          "PointCheckDetail"
        ],
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/DownloadManagerList",
        "name": "DownloadManagerList",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/DownloadManagerList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/DownloadManagerList.tsx').default,
        "icon": "download",
        "authority": [
          "expert",
          "admin",
          "DownloadManagerList"
        ],
        "exact": true
      },
      {
        "path": "/DownloadManagerList/DownloadManagerEdit/:id?",
        "name": "DownloadManagerEdit",
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../FaultyProduct/DownloadManagerEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../FaultyProduct/DownloadManagerEdit.tsx').default,
        "authority": [
          "expert",
          "admin",
          "DownloadManagerEdit"
        ],
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/rawData",
        "name": "rawData",
        "icon": "database",
        "authority": [
          "society",
          "admin",
          "rawData"
        ],
        "routes": [
          {
            "path": "/rawData/enterpriseData",
            "name": "enterpriseData",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/EnterpriseData.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/EnterpriseData.tsx').default,
            "authority": [
              "admin",
              "enterpriseData",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/enterpriseData/enterpriseDataInfo/:id?",
            "name": "enterpriseDataInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/EnterpriseDataInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/EnterpriseDataInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "enterpriseDataInfo",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/individualData",
            "name": "individualData",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/IndividualData.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/IndividualData.tsx').default,
            "authority": [
              "admin",
              "individualData",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/individualData/individualDataInfo/:id?",
            "name": "individualDataInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/IndividualDataInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/IndividualDataInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "individualDataInfo",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/civilDataLocal",
            "name": "civilDataLocal",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/CivilDataLocal.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/CivilDataLocal.tsx').default,
            "authority": [
              "admin",
              "civilDataLocal",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/civilDataLocal/civilDataLocalInfo/:id?",
            "name": "civilDataLocalInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/CivilDataLocalInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/CivilDataLocalInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "civilDataLocalInfo",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/civilData",
            "name": "civilData",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/CivilData.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/CivilData.tsx').default,
            "authority": [
              "admin",
              "civilData",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/civilData/civilDataInfo/:id?",
            "name": "civilDataInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/CivilDataInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/CivilDataInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "civilDataInfo",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/organs",
            "name": "organs",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/Organs.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/Organs.tsx').default,
            "authority": [
              "admin",
              "organs",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/organs/organsInfo/:id?",
            "name": "organsInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/OrgansInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/OrgansInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "organsInfo",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/judicialData",
            "name": "judicialData",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/JudicialData.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/JudicialData.tsx').default,
            "authority": [
              "admin",
              "judicialData",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/judicialData/judicialDataInfo/:id?",
            "name": "judicialDataInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/JudicialDataInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/JudicialDataInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "judicialDataInfo",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/religiousData",
            "name": "religiousData",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/ReligiousData.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/ReligiousData.tsx').default,
            "authority": [
              "admin",
              "religiousData",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/religiousData/religiousDataInfo/:id?",
            "name": "religiousDataInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/ReligiousDataInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/ReligiousDataInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "religiousDataInfo",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/laborData",
            "name": "laborData",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/LaborData.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/LaborData.tsx').default,
            "authority": [
              "admin",
              "laborData",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/laborData/laborDataInfo/:id?",
            "name": "laborDataInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/LaborDataInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/LaborDataInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "laborDataInfo",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/diplomaticData",
            "name": "diplomaticData",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/DiplomaticData.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/DiplomaticData.tsx').default,
            "authority": [
              "admin",
              "diplomaticData",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/diplomaticData/diplomaticDataInfo/:id?",
            "name": "diplomaticDataInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/DiplomaticDataInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/DiplomaticDataInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "diplomaticDataInfo",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/culturalData",
            "name": "culturalData",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/CulturalData.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/CulturalData.tsx').default,
            "authority": [
              "admin",
              "culturalData",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/culturalData/culturalDataInfo/:id?",
            "name": "culturalDataInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/CulturalDataInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/CulturalDataInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "culturalDataInfo",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/tourismData",
            "name": "tourismData",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/TourismData.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/TourismData.tsx').default,
            "authority": [
              "admin",
              "tourismData",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/tourismData/tourismDataInfo/:id?",
            "name": "tourismDataInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/TourismDataInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/TourismDataInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "tourismDataInfo",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/centralData",
            "name": "centralData",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/CentralData.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/CentralData.tsx').default,
            "authority": [
              "admin",
              "centralData",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/centralData/centralDataInfo/:id?",
            "name": "centralDataInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/CentralDataInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/CentralDataInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "centralDataInfo",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/agriculture",
            "name": "agriculture",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/Agriculture.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/Agriculture.tsx').default,
            "authority": [
              "admin",
              "agriculture",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/agriculture/agricultureInfo/:id?",
            "name": "agricultureInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/AgricultureInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/AgricultureInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "agricultureInfo",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/others",
            "name": "others",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/Others.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/Others.tsx').default,
            "authority": [
              "admin",
              "others",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/others/othersInfo/:id?",
            "name": "othersInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/OthersInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/OthersInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "othersInfo",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/receiveStatistics",
            "name": "receiveStatistics",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/ReceiveStatistics.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/ReceiveStatistics.tsx').default,
            "authority": [
              "admin",
              "receiveStatistics",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/reportStatistics",
            "name": "reportStatistics",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/ReportStatistics.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/ReportStatistics.tsx').default,
            "authority": [
              "admin",
              "reportStatistics",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "path": "/rawData/reReporting",
            "name": "reReporting",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/RawData/ReReporting.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/RawData/ReReporting.tsx').default,
            "authority": [
              "admin",
              "reReporting",
              "society",
              "rawData"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/dataQuery",
        "name": "dataQuery",
        "icon": "select",
        "authority": [
          "society",
          "admin",
          "dataQuery"
        ],
        "routes": [
          {
            "path": "/dataQuery/unifiedCodeBase",
            "name": "unifiedCodeBase",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/DataQuery/UnifiedCodeBase.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/DataQuery/UnifiedCodeBase.tsx').default,
            "authority": [
              "admin",
              "unifiedCodeBase",
              "society",
              "dataQuery"
            ],
            "exact": true
          },
          {
            "path": "/dataQuery/inquiryCodeBase",
            "name": "inquiryCodeBase",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/DataQuery/InquiryCodeBase.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/DataQuery/InquiryCodeBase.tsx').default,
            "authority": [
              "admin",
              "inquiryCodeBase",
              "society",
              "dataQuery"
            ],
            "exact": true
          },
          {
            "path": "/dataQuery/inquiryCodeBase/inquiryCodeBaseInfo/:id?",
            "name": "inquiryCodeBaseInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/dataQuery/InquiryCodeBaseInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/dataQuery/InquiryCodeBaseInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "inquiryCodeBaseInfo",
              "society",
              "dataQuery"
            ],
            "exact": true
          },
          {
            "path": "/dataQuery/verificationDatabase",
            "name": "verificationDatabase",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/DataQuery/VerificationDatabase.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/DataQuery/VerificationDatabase.tsx').default,
            "authority": [
              "admin",
              "verificationDatabase",
              "society",
              "dataQuery"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/dataStatistics",
        "name": "dataStatistics",
        "icon": "bar-chart",
        "authority": [
          "society",
          "admin",
          "dataStatistics"
        ],
        "routes": [
          {
            "path": "/dataStatistics/centerBack",
            "name": "centerBack",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/DataStatistics/CenterBack.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/DataStatistics/CenterBack.tsx').default,
            "authority": [
              "admin",
              "centerBack",
              "society",
              "dataStatistics"
            ],
            "exact": true
          },
          {
            "path": "/dataStatistics/verificationStatistics",
            "name": "verificationStatistics",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/DataStatistics/VerificationStatistics.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/DataStatistics/VerificationStatistics.tsx').default,
            "authority": [
              "admin",
              "verificationStatistics",
              "society",
              "dataStatistics"
            ],
            "exact": true
          },
          {
            "path": "/dataStatistics/questionStatistics",
            "name": "questionStatistics",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/DataStatistics/QuestionStatistics.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/DataStatistics/QuestionStatistics.tsx').default,
            "authority": [
              "admin",
              "questionStatistics",
              "society",
              "dataStatistics"
            ],
            "exact": true
          },
          {
            "path": "/dataStatistics/reportingStatistics",
            "name": "reportingStatistics",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/DataStatistics/ReportingStatistics.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/DataStatistics/ReportingStatistics.tsx').default,
            "authority": [
              "admin",
              "reportingStatistics",
              "society",
              "dataStatistics"
            ],
            "exact": true
          },
          {
            "path": "/dataStatistics/reportingStatistics/reportingStatisticsInfo/:id?",
            "name": "reportingStatisticsInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/DataStatistics/ReportingStatisticsInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/DataStatistics/ReportingStatisticsInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "reportingStatisticsInfo",
              "society",
              "dataStatistics"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/systemManagement",
        "name": "systemManagement",
        "icon": "setting",
        "authority": [
          "society",
          "admin",
          "systemManagement"
        ],
        "routes": [
          {
            "path": "/systemManagement/privilegeManagement",
            "name": "privilegeManagement",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/SystemManagement/PrivilegeManagement.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/SystemManagement/PrivilegeManagement.tsx').default,
            "authority": [
              "admin",
              "privilegeManagement",
              "society",
              "systemManagement"
            ],
            "exact": true
          },
          {
            "path": "/systemManagement/privilegeManagement/privilegeManagementInfo/:id?",
            "name": "privilegeManagementInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/SystemManagement/PrivilegeManagementInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/SystemManagement/PrivilegeManagementInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "privilegeManagementInfo",
              "society",
              "systemManagement"
            ],
            "exact": true
          },
          {
            "path": "/systemManagement/policyManagement",
            "name": "policyManagement",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/SystemManagement/PolicyManagement.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/SystemManagement/PolicyManagement.tsx').default,
            "authority": [
              "admin",
              "policyManagement",
              "society",
              "systemManagement"
            ],
            "exact": true
          },
          {
            "path": "/systemManagement/policyManagement/policyManagementEdit/:id?",
            "name": "policyManagementEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/SystemManagement/PolicyManagementEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/SystemManagement/PolicyManagementEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "policyManagementEdit",
              "society",
              "systemManagement"
            ],
            "exact": true
          },
          {
            "path": "/systemManagement/friendManagement",
            "name": "friendManagement",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/SystemManagement/FriendManagement.jsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/SystemManagement/FriendManagement.jsx').default,
            "authority": [
              "admin",
              "friendManagement",
              "society",
              "systemManagement"
            ],
            "exact": true
          },
          {
            "path": "/systemManagement/memberManagement",
            "name": "memberManagement",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/SystemManagement/MemberManagement.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/SystemManagement/MemberManagement.tsx').default,
            "authority": [
              "admin",
              "memberManagement",
              "society",
              "systemManagement"
            ],
            "exact": true
          },
          {
            "path": "/systemManagement/memberManagement/memberEdit/:id?",
            "name": "memberManagement",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/SystemManagement/MemberEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/SystemManagement/MemberEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "memberManagement",
              "society",
              "systemManagement"
            ],
            "exact": true
          },
          {
            "path": "/systemManagement/roleManage",
            "name": "roleManage",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/SystemManagement/RoleManage.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/SystemManagement/RoleManage.tsx').default,
            "authority": [
              "admin",
              "roleManage",
              "society",
              "systemManagement"
            ],
            "exact": true
          },
          {
            "path": "/systemManagement/roleManage/roleEdit/:id?",
            "name": "roleEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../Society/SystemManagement/RoleEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Society/SystemManagement/RoleEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "roleEdit",
              "society",
              "systemManagement"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/tbt",
        "name": "tbt",
        "icon": "font-size",
        "authority": [
          "wto",
          "admin",
          "tbt"
        ],
        "routes": [
          {
            "path": "/tbt/notice",
            "name": "notice",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/TBT/NoticeList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/TBT/NoticeList.tsx').default,
            "authority": [
              "admin",
              "notice",
              "wto",
              "tbt"
            ],
            "exact": true
          },
          {
            "path": "/tbt/notice/NoticeEdit/:id?",
            "name": "NoticeEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/TBT/NoticeEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/TBT/NoticeEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "NoticeEdit",
              "wto",
              "tbt"
            ],
            "exact": true
          },
          {
            "path": "/tbt/NoticeDiscussionCheck/:discussionID?",
            "menuPath": "/tbt/NoticeDiscussionCheck",
            "name": "NoticeDiscussionCheck",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/TBT/NoticeDiscussionCheck.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/TBT/NoticeDiscussionCheck.tsx').default,
            "authority": [
              "admin",
              "NoticeDiscussionCheck",
              "wto",
              "tbt"
            ],
            "exact": true
          },
          {
            "path": "/tbt/DiscussionList",
            "name": "DiscussionList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/TBT/DiscussionList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/TBT/DiscussionList.tsx').default,
            "authority": [
              "admin",
              "DiscussionList",
              "wto",
              "tbt"
            ],
            "exact": true
          },
          {
            "path": "/tbt/DiscussionList/DiscussionEdit/:id?",
            "name": "DiscussionEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/TBT/DiscussionEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/TBT/DiscussionEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "DiscussionEdit",
              "wto",
              "tbt"
            ],
            "exact": true
          },
          {
            "path": "/tbt/DiscussionList/OfficialDiscussionEdit/:id?/:readOnly?",
            "name": "OfficialDiscussionEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/TBT/OfficialDiscussionEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/TBT/OfficialDiscussionEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "OfficialDiscussionEdit",
              "wto",
              "tbt"
            ],
            "exact": true
          },
          {
            "path": "/tbt/DiscussionList/DiscussionCheckList/:discussionID?",
            "menuPath": "/tbt/DiscussionList/DiscussionCheckList",
            "name": "DiscussionCheckList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/TBT/DiscussionCheckList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/TBT/DiscussionCheckList.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "DiscussionCheckList",
              "wto",
              "tbt"
            ],
            "exact": true
          },
          {
            "path": "/tbt/notice/CommonCheckList/:discussionID?",
            "menuPath": "/tbt/notice/CommonCheckList",
            "name": "CommonCheckList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/TBT/CommonCheckList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/TBT/CommonCheckList.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "CommonCheckList",
              "wto",
              "tbt"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/earlyWarning",
        "name": "earlyWarning",
        "icon": "warning",
        "authority": [
          "wto",
          "admin",
          "earlyWarning"
        ],
        "routes": [
          {
            "path": "/earlyWarning/MarketList",
            "name": "MarketList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EarlyWarning/MarketList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EarlyWarning/MarketList.tsx').default,
            "authority": [
              "admin",
              "MarketList",
              "wto",
              "earlyWarning"
            ],
            "exact": true
          },
          {
            "path": "/earlyWarning/MarketList/MarketEdit/:id?",
            "name": "MarketEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EarlyWarning/MarketEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EarlyWarning/MarketEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "MarketEdit",
              "wto",
              "earlyWarning"
            ],
            "exact": true
          },
          {
            "path": "/earlyWarning/WarnInfoList",
            "name": "WarnInfoList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EarlyWarning/WarnInfoList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EarlyWarning/WarnInfoList').default,
            "authority": [
              "admin",
              "WarnInfoList",
              "wto",
              "earlyWarning"
            ],
            "exact": true
          },
          {
            "path": "/earlyWarning/WarnInfoList/WarnInfoEdit/:id?",
            "name": "WarnInfoEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EarlyWarning/WarnInfoEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EarlyWarning/WarnInfoEdit').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "WarnInfoEdit",
              "wto",
              "earlyWarning"
            ],
            "exact": true
          },
          {
            "path": "/earlyWarning/TechnologyList",
            "name": "TechnologyList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EarlyWarning/TechnologyList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EarlyWarning/TechnologyList').default,
            "authority": [
              "admin",
              "TechnologyList",
              "wto",
              "earlyWarning"
            ],
            "exact": true
          },
          {
            "path": "/earlyWarning/TechnologyList/TechnologyEdit/:id?",
            "name": "TechnologyEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EarlyWarning/TechnologyEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EarlyWarning/TechnologyEdit').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "TechnologyEdit",
              "wto",
              "earlyWarning"
            ],
            "exact": true
          },
          {
            "path": "/earlyWarning/upToStandard",
            "name": "upToStandard",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EarlyWarning/UpToStandardList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EarlyWarning/UpToStandardList').default,
            "authority": [
              "admin",
              "upToStandard",
              "wto",
              "earlyWarning"
            ],
            "exact": true
          },
          {
            "path": "/earlyWarning/upToStandard/UpToStandardEdit/:id?",
            "name": "UpToStandardEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EarlyWarning/UpToStandardEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EarlyWarning/UpToStandardEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "UpToStandardEdit",
              "wto",
              "earlyWarning"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/france",
        "name": "france",
        "icon": "flag",
        "authority": [
          "wto",
          "admin",
          "france"
        ],
        "routes": [
          {
            "path": "/france/EventsList",
            "name": "EventsList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/France/EventsList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/France/EventsList.tsx').default,
            "authority": [
              "admin",
              "EventsList",
              "wto",
              "france"
            ],
            "exact": true
          },
          {
            "path": "/france/EventsList/EventsEdit/:id?",
            "name": "EventsEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/France/EventsEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/France/EventsEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "EventsEdit",
              "wto",
              "france"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/SynthesizeManage",
        "name": "SynthesizeManage",
        "icon": "border-inner",
        "authority": [
          "wto",
          "admin",
          "SynthesizeManage"
        ],
        "routes": [
          {
            "path": "/SynthesizeManage/AdvertList",
            "name": "AdvertList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/AdvertList.jsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/AdvertList.jsx').default,
            "authority": [
              "admin",
              "AdvertList",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/AdvertList/AdvertEdit/:id?",
            "name": "AdvertEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/AdvertEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/AdvertEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "AdvertEdit",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/ResearchResultList",
            "name": "ResearchResultList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/ResearchResultList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/ResearchResultList').default,
            "authority": [
              "admin",
              "ResearchResultList",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/ResearchResultList/ResearchResultEdit/:id?",
            "name": "ResearchResultEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/ResearchResultEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/ResearchResultEdit').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "ResearchResultEdit",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/RepositoryList",
            "name": "RepositoryList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/RepositoryList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/RepositoryList').default,
            "authority": [
              "admin",
              "RepositoryList",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/RepositoryList/RepositoryEdit/:id?",
            "name": "RepositoryEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/RepositoryEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/RepositoryEdit').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "RepositoryEdit",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/CaseLibraryList",
            "name": "CaseLibraryList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/CaseLibraryList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/CaseLibraryList').default,
            "authority": [
              "admin",
              "CaseLibraryList",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/CaseLibraryList/CaseLibraryEdit/:id?",
            "name": "CaseLibraryEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/CaseLibraryEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/CaseLibraryEdit').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "CaseLibraryEdit",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/PeriodicalList",
            "name": "PeriodicalList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/PeriodicalList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/PeriodicalList').default,
            "authority": [
              "admin",
              "PeriodicalList",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/PeriodicalList/PeriodicalEdit/:id?",
            "name": "PeriodicalEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/PeriodicalEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/PeriodicalEdit').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "PeriodicalEdit",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/TechnologyTradeList",
            "name": "TechnologyTradeList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/TechnologyTradeList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/TechnologyTradeList').default,
            "authority": [
              "admin",
              "TechnologyTradeList",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/TechnologyTradeList/TechnologyTradeEdit/:id?",
            "name": "TechnologyTradeEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/TechnologyTradeEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/TechnologyTradeEdit').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "TechnologyTradeEdit",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/TechnologyTradeList/TechnologyTradeProgramaList/:subjectId",
            "name": "TechnologyTradeProgramaList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/TechnologyTradeProgramaList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/TechnologyTradeProgramaList').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "TechnologyTradeProgramaList",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/TechnologyTradeList/TechnologyTradeProgramaArticleList/:programaId/:subjectId",
            "name": "TechnologyTradeProgramaArticleList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/TechnologyTradeProgramaArticleList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/TechnologyTradeProgramaArticleList').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "TechnologyTradeProgramaArticleList",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/TechnologyTradeList/TechnologyTradeProgramaArticleEdit/:programaId/:id?",
            "name": "TechnologyTradeProgramaArticleEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/TechnologyTradeProgramaArticleEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/TechnologyTradeProgramaArticleEdit').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "TechnologyTradeProgramaArticleEdit",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/InfoRelation/:tradeProgramaId",
            "name": "InfoRelation",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/InfoRelation'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/InfoRelation').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "InfoRelation",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/TrainingInformationList",
            "name": "TrainingInformationList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/TrainingInformationList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/TrainingInformationList').default,
            "authority": [
              "admin",
              "TrainingInformationList",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/TrainingInformationList/TrainingInformationEdit/:id?/:readOnly?",
            "name": "TrainingInformationEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/TrainingInformationEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/TrainingInformationEdit').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "TrainingInformationEdit",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/ExportBusinessDirectory",
            "name": "ExportBusinessDirectory",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/ExportBusinessDirectory'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/ExportBusinessDirectory').default,
            "authority": [
              "admin",
              "ExportBusinessDirectory",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/ServicesProjectList",
            "name": "ServicesProjectList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/ServicesProjectList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/ServicesProjectList').default,
            "authority": [
              "admin",
              "ServicesProjectList",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/ServicesProjectList/ServicesProjectEdit/:id?",
            "name": "ServicesProjectEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/ServicesProjectEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/ServicesProjectEdit').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "ServicesProjectEdit",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/LeaveMessageList",
            "name": "LeaveMessageList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/LeaveMessageList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/LeaveMessageList').default,
            "authority": [
              "admin",
              "LeaveMessageList",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "path": "/SynthesizeManage/UserSupervise",
            "name": "UserSupervise",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/UserSupervise.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/UserSupervise.tsx').default,
            "authority": [
              "admin",
              "UserSupervise",
              "wto",
              "SynthesizeManage"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/Order",
        "name": "Order",
        "icon": "shopping-cart",
        "authority": [
          "wto",
          "admin",
          "Order"
        ],
        "routes": [
          {
            "path": "/Order/OnlineLawsList",
            "name": "OnlineLawsList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/Order/OnlineLawsList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/Order/OnlineLawsList.tsx').default,
            "authority": [
              "admin",
              "OnlineLawsList",
              "wto",
              "Order"
            ],
            "exact": true
          },
          {
            "path": "/Order/OnlineCustomOrderList",
            "name": "OnlineCustomOrderList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/Order/OnlineCustomOrderList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/Order/OnlineCustomOrderList.tsx').default,
            "authority": [
              "admin",
              "OnlineCustomOrderList",
              "wto",
              "Order"
            ],
            "exact": true
          },
          {
            "path": "/Order/ClientTrainingList",
            "name": "ClientTrainingList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/ClientTrainingList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/ClientTrainingList').default,
            "authority": [
              "admin",
              "ClientTrainingList",
              "wto",
              "Order"
            ],
            "exact": true
          },
          {
            "path": "/Order/ClientTrainingList/ClientTrainingEdit/:id?/:readOnly?",
            "name": "ClientTrainingEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/ClientTrainingEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/ClientTrainingEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "ClientTrainingEdit",
              "wto",
              "Order"
            ],
            "exact": true
          },
          {
            "path": "/Order/ExportBlockList",
            "name": "ExportBlockList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/ExportBlockList'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/ExportBlockList').default,
            "authority": [
              "admin",
              "ExportBlockList",
              "wto",
              "Order"
            ],
            "exact": true
          },
          {
            "path": "/Order/ExportBlockList/ExportBlockEdit/:id?/:readOnly?",
            "name": "ExportBlockEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/SynthesizeManage/ExportBlockEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/SynthesizeManage/ExportBlockEdit').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "ExportBlockEdit",
              "wto",
              "Order"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/Statistics",
        "name": "Statistics",
        "icon": "bar-chart",
        "authority": [
          "wto",
          "admin",
          "Statistics"
        ],
        "routes": [
          {
            "path": "/Statistics/ExportValueOfOurProvince",
            "name": "ExportValueOfOurProvince",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/Statistics/ExportValueOfOurProvince.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/Statistics/ExportValueOfOurProvince.tsx').default,
            "authority": [
              "admin",
              "ExportValueOfOurProvince",
              "wto",
              "Statistics"
            ],
            "exact": true
          },
          {
            "path": "/Statistics/ProductExportDataOfOutProvince",
            "name": "ProductExportDataOfOutProvince",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/Statistics/ProductExportDataOfOutProvince.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/Statistics/ProductExportDataOfOutProvince.tsx').default,
            "authority": [
              "admin",
              "ProductExportDataOfOutProvince",
              "wto",
              "Statistics"
            ],
            "exact": true
          },
          {
            "path": "/Statistics/OperationTypeStatistics",
            "name": "OperationTypeStatistics",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/Statistics/OperationTypeStatistics.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/Statistics/OperationTypeStatistics.tsx').default,
            "authority": [
              "admin",
              "OperationTypeStatistics",
              "wto",
              "Statistics"
            ],
            "exact": true
          },
          {
            "path": "/Statistics/OperationTypeStatistics/OperationTypeStatisticsList/:id?",
            "name": "OperationTypeStatisticsList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/Statistics/OperationTypeStatisticsList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/Statistics/OperationTypeStatisticsList.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "OperationTypeStatisticsList",
              "wto",
              "Statistics"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/EnglishSite",
        "name": "EnglishSite",
        "icon": "dollar",
        "authority": [
          "wto",
          "admin",
          "EnglishSite"
        ],
        "routes": [
          {
            "path": "/EnglishSite/AboutUs",
            "name": "AboutUs",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EnglishSite/AboutUs.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EnglishSite/AboutUs.tsx').default,
            "authority": [
              "admin",
              "AboutUs",
              "wto",
              "EnglishSite"
            ],
            "exact": true
          },
          {
            "path": "/EnglishSite/InvestigationList",
            "name": "InvestigationList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EnglishSite/InvestigationList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EnglishSite/InvestigationList.tsx').default,
            "authority": [
              "admin",
              "InvestigationList",
              "wto",
              "EnglishSite"
            ],
            "exact": true
          },
          {
            "path": "/EnglishSite/InvestigationList/InvestigationEdit/:id?",
            "name": "InvestigationEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EnglishSite/InvestigationEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EnglishSite/InvestigationEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "InvestigationEdit",
              "wto",
              "EnglishSite"
            ],
            "exact": true
          },
          {
            "path": "/EnglishSite/BusinessNewsList",
            "name": "BusinessNewsList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EnglishSite/BusinessNewsList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EnglishSite/BusinessNewsList.tsx').default,
            "authority": [
              "admin",
              "BusinessNewsList",
              "wto",
              "EnglishSite"
            ],
            "exact": true
          },
          {
            "path": "/EnglishSite/BusinessNewsList/BusinessNewsEdit/:id?",
            "name": "BusinessNewsEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EnglishSite/BusinessNewsEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EnglishSite/BusinessNewsEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "BusinessNewsEdit",
              "wto",
              "EnglishSite"
            ],
            "exact": true
          },
          {
            "path": "/EnglishSite/CertificationList",
            "name": "CertificationList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EnglishSite/CertificationList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EnglishSite/CertificationList.tsx').default,
            "authority": [
              "admin",
              "CertificationList",
              "wto",
              "EnglishSite"
            ],
            "exact": true
          },
          {
            "path": "/EnglishSite/CertificationList/CertificationEdit/:id?",
            "name": "CertificationEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EnglishSite/CertificationEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EnglishSite/CertificationEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "CertificationEdit",
              "wto",
              "EnglishSite"
            ],
            "exact": true
          },
          {
            "path": "/EnglishSite/VerfiedSuppliersList",
            "name": "VerfiedSuppliersList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EnglishSite/VerfiedSuppliersList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EnglishSite/VerfiedSuppliersList.tsx').default,
            "authority": [
              "admin",
              "VerfiedSuppliersList",
              "wto",
              "EnglishSite"
            ],
            "exact": true
          },
          {
            "path": "/EnglishSite/VerfiedSuppliersList/VerfiedSuppliersEdit/:id?",
            "name": "VerfiedSuppliersEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EnglishSite/VerfiedSuppliersEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EnglishSite/VerfiedSuppliersEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "VerfiedSuppliersEdit",
              "wto",
              "EnglishSite"
            ],
            "exact": true
          },
          {
            "path": "/EnglishSite/EnterpriseMessageList",
            "name": "EnterpriseMessageList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EnglishSite/EnterpriseMessageList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EnglishSite/EnterpriseMessageList.tsx').default,
            "authority": [
              "admin",
              "EnterpriseMessageList",
              "wto",
              "EnglishSite"
            ],
            "exact": true
          },
          {
            "path": "/EnglishSite/EnterpriseMessageList/EnterpriseMessageEdit/:id?/:readOnly?",
            "name": "EnterpriseMessageEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EnglishSite/EnterpriseMessageEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EnglishSite/EnterpriseMessageEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "EnterpriseMessageEdit",
              "wto",
              "EnglishSite"
            ],
            "exact": true
          },
          {
            "path": "/EnglishSite/ProductTypeDicList",
            "name": "ProductTypeDicList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EnglishSite/ProductTypeDicList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EnglishSite/ProductTypeDicList.tsx').default,
            "authority": [
              "admin",
              "ProductTypeDicList",
              "wto",
              "EnglishSite"
            ],
            "exact": true
          },
          {
            "path": "/EnglishSite/ProductTypeDicList/ProductTypeDicEdit/:id?",
            "name": "ProductTypeDicEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/EnglishSite/ProductTypeDicEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/EnglishSite/ProductTypeDicEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "ProductTypeDicEdit",
              "wto",
              "EnglishSite"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/wtoDictionary",
        "name": "wtoDictionary",
        "icon": "database",
        "authority": [
          "wto",
          "admin",
          "wtoDictionary"
        ],
        "routes": [
          {
            "path": "/wtoDictionary/HSCodeList",
            "name": "HSCodeList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/HSCodeList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/HSCodeList.tsx').default,
            "authority": [
              "admin",
              "HSCodeList",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/HSCodeList/HSCodeEdit/:id?",
            "name": "HSCodeEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/HSCodeEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/HSCodeEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "HSCodeEdit",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/ICSCodeList",
            "name": "ICSCodeList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/ICSCodeList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/ICSCodeList.tsx').default,
            "authority": [
              "admin",
              "ICSCodeList",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/ICSCodeList/ICSCodeEdit/:id?",
            "name": "ICSCodeEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/ICSCodeEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/ICSCodeEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "ICSCodeEdit",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/HSAndISCRelationList",
            "name": "HSAndISCRelationList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/HSAndISCRelationList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/HSAndISCRelationList.tsx').default,
            "authority": [
              "admin",
              "HSAndISCRelationList",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/HSAndISCRelationList/HSAndISCRelationEdit/:type?/:id?/:readOnly?",
            "name": "HSAndISCRelationEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/HSAndISCRelationEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/HSAndISCRelationEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "HSAndISCRelationEdit",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/NICWithHSCodeList",
            "name": "NICWithHSCodeList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/NICWithHSCodeList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/NICWithHSCodeList.tsx').default,
            "authority": [
              "admin",
              "NICWithHSCodeList",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/NICWithHSCodeList/NICWithHSCodeEdit/:id?",
            "name": "NICWithHSCodeEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/NICWithHSCodeEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/NICWithHSCodeEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "NICWithHSCodeEdit",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/NICWithICSCodeList",
            "name": "NICWithICSCodeList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/NICWithICSCodeList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/NICWithICSCodeList.tsx').default,
            "authority": [
              "admin",
              "NICWithICSCodeList",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/NICWithICSCodeList/NICWithICSCodeEdit/:id?",
            "name": "NICWithICSCodeEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/NICWithICSCodeEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/NICWithICSCodeEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "NICWithICSCodeEdit",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/WTOLabelList",
            "name": "WTOLabelList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/WTOLabelList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/WTOLabelList.tsx').default,
            "authority": [
              "admin",
              "WTOLabelList",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/WTOLabelList/WTOLabelEdit/:id?",
            "name": "WTOLabelEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/WTOLabelEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/WTOLabelEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "WTOLabelEdit",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/ExportCountryList",
            "name": "ExportCountryList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/ExportCountryList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/ExportCountryList.tsx').default,
            "authority": [
              "admin",
              "ExportCountryList",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/ExportCountryList/ExportCountryEdit/:id?",
            "name": "ExportCountryEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/ExportCountryEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/ExportCountryEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "ExportCountryEdit",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/LawDepartmentList",
            "name": "LawDepartmentList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/LawDepartmentList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/LawDepartmentList.tsx').default,
            "authority": [
              "admin",
              "LawDepartmentList",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/LawDepartmentList/LawDepartmentEdit/:id?",
            "name": "LawDepartmentEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/LawDepartmentEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/LawDepartmentEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "LawDepartmentEdit",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/LawCategoryList",
            "name": "LawCategoryList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/LawCategoryList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/LawCategoryList.tsx').default,
            "authority": [
              "admin",
              "LawCategoryList",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/LawCategoryList/LawCategoryEdit/:id?",
            "name": "LawCategoryEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/LawCategoryEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/LawCategoryEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "LawCategoryEdit",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/CountryInfoList",
            "name": "CountryInfoList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/CountryInfoList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/CountryInfoList.tsx').default,
            "authority": [
              "admin",
              "CountryInfoList",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "path": "/wtoDictionary/CountryInfoList/CountryInfoEdit/:id?",
            "name": "CountryInfoEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../WTO/WTODictionary/CountryInfoEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../WTO/WTODictionary/CountryInfoEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "CountryInfoEdit",
              "wto",
              "wtoDictionary"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/DepartmentSearch",
        "name": "DepartmentSearch",
        "icon": "search",
        "authority": [
          "cer",
          "admin",
          "DepartmentSearch"
        ],
        "routes": [
          {
            "path": "/DepartmentSearch/DepartmentList",
            "name": "DepartmentList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentSearch/DepartmentList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentSearch/DepartmentList.tsx').default,
            "authority": [
              "admin",
              "DepartmentList",
              "cer",
              "DepartmentSearch"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentSearch/DepartmentList/DepartInfo/:id",
            "name": "DepartInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentSearch/DepartInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentSearch/DepartInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "DepartInfo",
              "cer",
              "DepartmentSearch"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentSearch/DepartmentList/DepartInfo/DepartInfoLogDetail/:id",
            "name": "AuthorizerDetail",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentSearch/BaseInfoDetail.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentSearch/BaseInfoDetail.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "AuthorizerDetail",
              "cer",
              "DepartmentSearch"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentSearch/DepartmentList/DepartInfo/AuthorizerDetail/:id",
            "name": "AuthorizerDetail",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentSearch/AuthorizerDetail.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentSearch/AuthorizerDetail.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "AuthorizerDetail",
              "cer",
              "DepartmentSearch"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentSearch/DepartmentList/DepartInfo/AuthorizerLogDetail/:id",
            "name": "AuthorizerDetail",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentSearch/AuthorizerLogDetail.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentSearch/AuthorizerLogDetail.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "AuthorizerDetail",
              "cer",
              "DepartmentSearch"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentSearch/DepartmentList/DepartInfo/CertificateDetail/:id",
            "name": "CertificateDetail",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentSearch/CerAndCapabilityEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentSearch/CerAndCapabilityEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "CertificateDetail",
              "cer",
              "DepartmentSearch"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentSearch/DepartmentList/DepartInfo/EquipmentDetail/:id",
            "name": "EquipmentEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentSearch/EquipmentEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentSearch/EquipmentEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "EquipmentEdit",
              "cer",
              "DepartmentSearch"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentSearch/DepartmentList/DepartInfo/EquipmentLogDetailList/:id",
            "name": "EquipmentEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentSearch/EquipmentLogDetailList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentSearch/EquipmentLogDetailList.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "EquipmentEdit",
              "cer",
              "DepartmentSearch"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentSearch/DepartmentList/DepartInfo/MemberDetail/:id",
            "name": "MemberEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentSearch/MemberEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentSearch/MemberEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "MemberEdit",
              "cer",
              "DepartmentSearch"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentSearch/DepartmentList/DepartInfo/MemberLogDetailList/:id",
            "name": "MemberEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentSearch/MemberLogDetailList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentSearch/MemberLogDetailList.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "MemberEdit",
              "cer",
              "DepartmentSearch"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentSearch/DepartmentList/DepartInfo/:id/:index",
            "name": "DepartInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentSearch/DepartInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentSearch/DepartInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "DepartInfo",
              "cer",
              "DepartmentSearch"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentSearch/DepartAbilityList",
            "name": "DepartAbilityList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentSearch/DepartAbilityList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentSearch/DepartAbilityList.tsx').default,
            "authority": [
              "admin",
              "DepartAbilityList",
              "cer",
              "DepartmentSearch"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentSearch/DepartAbilityList/AbilityInfo",
            "name": "AbilityInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentSearch/AbilityInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentSearch/AbilityInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "AbilityInfo",
              "cer",
              "DepartmentSearch"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentSearch/CertificateStatusList",
            "name": "CertificateStatusList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentSearch/CertificateStatusList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentSearch/CertificateStatusList.tsx').default,
            "authority": [
              "admin",
              "CertificateStatusList",
              "cer",
              "DepartmentSearch"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentSearch/CertificateStatusList/CertificateInfo/:id",
            "name": "CertificateInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentSearch/CertificateInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentSearch/CertificateInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "CertificateInfo",
              "cer",
              "DepartmentSearch"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentSearch/BlackList",
            "name": "BlackList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentSearch/BlackList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentSearch/BlackList.tsx').default,
            "authority": [
              "admin",
              "BlackList",
              "cer",
              "DepartmentSearch"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/DepartmentCheck",
        "name": "DepartmentCheck",
        "icon": "check",
        "authority": [
          "cer",
          "admin",
          "DepartmentCheck"
        ],
        "routes": [
          {
            "path": "/DepartmentCheck/DepartCheckInfoList",
            "name": "DepartCheckInfoList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentCheck/DepartCheckInfoList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentCheck/DepartCheckInfoList.tsx').default,
            "authority": [
              "admin",
              "DepartCheckInfoList",
              "cer",
              "DepartmentCheck"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentCheck/DepartCheckInfoList/DepartCheckInfo/:id?",
            "name": "DepartCheckInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentCheck/DepartCheckInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentCheck/DepartCheckInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "DepartCheckInfo",
              "cer",
              "DepartmentCheck"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentCheck/DepartDatumList/:title?",
            "menuPath": "/DepartmentCheck/DepartDatumList",
            "name": "DepartDatumList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentCheck/DepartDatumList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentCheck/DepartDatumList.tsx').default,
            "authority": [
              "admin",
              "DepartDatumList",
              "cer",
              "DepartmentCheck"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentCheck/AuhorizedSignatureList/:title?",
            "menuPath": "/DepartmentCheck/AuhorizedSignatureList",
            "name": "AuhorizedSignatureList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentCheck/AuhorizedSignatureList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentCheck/AuhorizedSignatureList.tsx').default,
            "authority": [
              "admin",
              "AuhorizedSignatureList",
              "cer",
              "DepartmentCheck"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentCheck/AuhorizedSignatureList/AuhorizedSignatureInfo/:id?",
            "name": "AuhorizedSignatureInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentCheck/AuhorizedSignatureInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentCheck/AuhorizedSignatureInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "AuhorizedSignatureInfo",
              "cer",
              "DepartmentCheck"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentCheck/DepartCheckCertificateList/:title?",
            "menuPath": "/DepartmentCheck/DepartCheckCertificateList",
            "name": "DepartCheckCertificateList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentCheck/DepartCheckCertificateList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentCheck/DepartCheckCertificateList.tsx').default,
            "authority": [
              "admin",
              "DepartCheckCertificateList",
              "cer",
              "DepartmentCheck"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentCheck/DepartCheckCertificateList/DepartCheckCertificateInfo/:id?",
            "name": "DepartCheckCertificateInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentCheck/DepartCheckCertificateInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentCheck/DepartCheckCertificateInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "DepartCheckCertificateInfo",
              "cer",
              "DepartmentCheck"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentCheck/DepartCheckInstrumentList/:title?",
            "menuPath": "/DepartmentCheck/DepartCheckInstrumentList",
            "name": "DepartCheckInstrumentList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentCheck/DepartCheckInstrumentList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentCheck/DepartCheckInstrumentList.tsx').default,
            "authority": [
              "admin",
              "DepartCheckInstrumentList",
              "cer",
              "DepartmentCheck"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentCheck/DepartCheckInstrumentList/DepartCheckInstrumentInfo/:id?",
            "name": "DepartCheckInstrumentInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentCheck/DepartCheckInstrumentInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentCheck/DepartCheckInstrumentInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "DepartCheckInstrumentInfo",
              "cer",
              "DepartmentCheck"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentCheck/DepartCheckUserList/:title?",
            "menuPath": "/DepartmentCheck/DepartCheckUserList",
            "name": "DepartCheckUserList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentCheck/DepartCheckUserList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentCheck/DepartCheckUserList.tsx').default,
            "authority": [
              "admin",
              "DepartCheckUserList",
              "cer",
              "DepartmentCheck"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentCheck/DepartCheckUserList/DepartCheckUserInfo/:id?",
            "name": "DepartCheckUserInfo",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentCheck/DepartCheckUserInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentCheck/DepartCheckUserInfo.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "DepartCheckUserInfo",
              "cer",
              "DepartmentCheck"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentCheck/DepartCheckAbilityList",
            "name": "DepartCheckAbilityList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentCheck/DepartCheckAbilityList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentCheck/DepartCheckAbilityList.tsx').default,
            "authority": [
              "admin",
              "DepartCheckAbilityList",
              "cer",
              "DepartmentCheck"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/DepartmentCheckStatistics",
        "name": "DepartmentCheckStatistics",
        "icon": "bar-chart",
        "authority": [
          "cer",
          "admin",
          "DepartmentCheckStatistics"
        ],
        "routes": [
          {
            "path": "/DepartmentCheckStatistics/DepartmentComprehensiveAnalysis",
            "name": "DepartmentComprehensiveAnalysis",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/Statistics/DepartmentComprehensiveAnalysis.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/Statistics/DepartmentComprehensiveAnalysis.tsx').default,
            "authority": [
              "admin",
              "DepartmentComprehensiveAnalysis",
              "cer",
              "DepartmentCheckStatistics"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentCheckStatistics/DepartmentAnalysisByRegion",
            "name": "DepartmentAnalysisByRegion",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/Statistics/DepartmentAnalysisByRegion.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/Statistics/DepartmentAnalysisByRegion.tsx').default,
            "authority": [
              "admin",
              "DepartmentAnalysisByRegion",
              "cer",
              "DepartmentCheckStatistics"
            ],
            "exact": true
          },
          {
            "path": "/DepartmentCheckStatistics/DepartmentAnalysisProvince",
            "name": "DepartmentAnalysisProvince",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/Statistics/DepartmentAnalysisProvince.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/Statistics/DepartmentAnalysisProvince.tsx').default,
            "authority": [
              "admin",
              "DepartmentAnalysisProvince",
              "cer",
              "DepartmentCheckStatistics"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/DepartmentInfoList",
        "name": "DepartmentInfoList",
        "icon": "copy",
        "authority": [
          "cer",
          "admin",
          "DepartmentInfoList"
        ],
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentInfoList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentInfoList.tsx').default,
        "exact": true
      },
      {
        "path": "/DepartmentInfoList/DepartmentInfoEdit/:id",
        "name": "DepartmentInfo",
        "icon": "database",
        "authority": [
          "cer",
          "admin",
          "DepartmentInfo"
        ],
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentCheck/DepartCheckInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentCheck/DepartCheckInfo.tsx').default,
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/DepartmentInfoList/HistoricalInfo",
        "name": "HistoricalInfo",
        "authority": [
          "cer",
          "admin",
          "HistoricalInfo"
        ],
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentCheck/HistoricalInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentCheck/HistoricalInfo.tsx').default,
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/DepartmentInfoList/DepartmentInfoUpdate/:id",
        "name": "DepartmentInfoUpdate",
        "authority": [
          "cer",
          "admin",
          "DepartmentInfoUpdate"
        ],
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/BaseInfo.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/BaseInfo.tsx').default,
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/DepartmentAbilityFormList",
        "name": "DepartmentAbilityFormList",
        "icon": "rocket",
        "authority": [
          "cer",
          "admin",
          "DepartmentAbilityFormList"
        ],
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentAbilityFormList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentAbilityFormList.tsx').default,
        "exact": true
      },
      {
        "path": "/DepartmentAbilityFormList/DepartmentAbilityFormListDetail/:id",
        "name": "DepartmentAbilityFormListDetail",
        "icon": "rocket",
        "authority": [
          "cer",
          "admin",
          "DepartmentAbilityFormListDetail"
        ],
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentAbilityFormListDetail.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentAbilityFormListDetail.tsx').default,
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/DepartmentAbilityFormList/DepartmentAbilityFormExtension/:id",
        "name": "DepartmentAbilityFormExtension",
        "authority": [
          "cer",
          "admin",
          "DepartmentAbilityFormExtension"
        ],
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/CapabilityExtension.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/CapabilityExtension.tsx').default,
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/DepartmentAbilityFormList/BatchInput/:id",
        "name": "BatchInput",
        "authority": [
          "cer",
          "admin",
          "BatchInput"
        ],
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/BatchInput.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/BatchInput.tsx').default,
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/DepartmentAbilityFormList/MaintancePower/:id",
        "name": "MaintancePower",
        "authority": [
          "cer",
          "admin",
          "MaintancePower"
        ],
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/MaintanceCapabilityList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/MaintanceCapabilityList.tsx').default,
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/JudgeList",
        "name": "JudgeList",
        "icon": "user",
        "authority": [
          "cer",
          "admin",
          "JudgeList"
        ],
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/JudgeList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/JudgeList.tsx').default,
        "exact": true
      },
      {
        "path": "/JudgeList/JudgeEdit/:id?/:readOnly?",
        "name": "JudgeEdit",
        "icon": "database",
        "authority": [
          "cer",
          "admin",
          "JudgeEdit"
        ],
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/JudgeEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/JudgeEdit.tsx').default,
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/TechnicalAdvisoryList",
        "name": "TechnicalAdvisoryList",
        "icon": "deployment-unit",
        "authority": [
          "cer",
          "admin",
          "TechnicalAdvisoryList"
        ],
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/TechnicalAdvisoryList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/TechnicalAdvisoryList.tsx').default,
        "exact": true
      },
      {
        "path": "/TechnicalAdvisoryList/TechnicalAdvisoryEdit/:id?",
        "name": "TechnicalAdvisoryEdit",
        "icon": "database",
        "authority": [
          "cer",
          "admin",
          "TechnicalAdvisoryEdit"
        ],
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/TechnicalAdvisoryEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/TechnicalAdvisoryEdit.tsx').default,
        "hideInMenu": true,
        "exact": true
      },
      {
        "path": "/CerInformationPublish",
        "name": "CerInformationPublish",
        "icon": "edit",
        "authority": [
          "cer",
          "admin",
          "CerInformationPublish"
        ],
        "routes": [
          {
            "path": "/CerInformationPublish/AdvertList",
            "name": "AdvertList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/InformationPublish/AdvertList.jsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/InformationPublish/AdvertList.jsx').default,
            "authority": [
              "admin",
              "AdvertList",
              "cer",
              "CerInformationPublish"
            ],
            "exact": true
          },
          {
            "path": "/CerInformationPublish/AdvertList/AdvertEdit/:id?",
            "name": "AdvertEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/InformationPublish/AdvertEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/InformationPublish/AdvertEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "AdvertEdit",
              "cer",
              "CerInformationPublish"
            ],
            "exact": true
          },
          {
            "path": "/CerInformationPublish/PolicyList",
            "name": "CerPolicyList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/InformationPublish/PolicyList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/InformationPublish/PolicyList.tsx').default,
            "authority": [
              "admin",
              "CerPolicyList",
              "cer",
              "CerInformationPublish"
            ],
            "exact": true
          },
          {
            "path": "/CerInformationPublish/PolicyList/PolicyEdit/:id?",
            "name": "CerPolicyEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/InformationPublish/PolicyEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/InformationPublish/PolicyEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "CerPolicyEdit",
              "cer",
              "CerInformationPublish"
            ],
            "exact": true
          },
          {
            "path": "/CerInformationPublish/PolicyUnscrambleList",
            "name": "PolicyUnscrambleList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/InformationPublish/PolicyUnscrambleList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/InformationPublish/PolicyUnscrambleList.tsx').default,
            "authority": [
              "admin",
              "PolicyUnscrambleList",
              "cer",
              "CerInformationPublish"
            ],
            "exact": true
          },
          {
            "path": "/CerInformationPublish/PolicyUnscrambleList/PolicyUnscrambleEdit/:id?",
            "name": "PolicyUnscrambleEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/InformationPublish/PolicyUnscrambleEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/InformationPublish/PolicyUnscrambleEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "PolicyUnscrambleEdit",
              "cer",
              "CerInformationPublish"
            ],
            "exact": true
          },
          {
            "path": "/CerInformationPublish/NoticeList",
            "name": "NoticeList",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/InformationPublish/NoticeList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/InformationPublish/NoticeList.tsx').default,
            "authority": [
              "admin",
              "NoticeList",
              "cer",
              "CerInformationPublish"
            ],
            "exact": true
          },
          {
            "path": "/CerInformationPublish/NoticeList/NoticeEdit/:id?",
            "name": "NoticeEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/InformationPublish/NoticeEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/InformationPublish/NoticeEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "NoticeEdit",
              "cer",
              "CerInformationPublish"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/CerSystem",
        "name": "CerSystem",
        "icon": "setting",
        "authority": [
          "cer",
          "admin",
          "CerSystem"
        ],
        "routes": [
          {
            "path": "/CerSystem/LicenseExpireEdit",
            "name": "LicenseExpireEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/System/LicenseExpireEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/System/LicenseExpireEdit.tsx').default,
            "authority": [
              "admin",
              "LicenseExpireEdit",
              "cer",
              "CerSystem"
            ],
            "exact": true
          },
          {
            "path": "/CerSystem/PartyManagement",
            "name": "PartyManagement",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../CertificationDepartment/DepartmentSearch/PartyManagement.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../CertificationDepartment/DepartmentSearch/PartyManagement.tsx').default,
            "authority": [
              "admin",
              "PartyManagement",
              "cer",
              "CerSystem"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/DigitStandardLibrary",
        "name": "DigitStandardLibrary",
        "authority": [
          "standard",
          "admin",
          "DigitStandardLibrary"
        ],
        "routes": [
          {
            "path": "/DigitStandardLibrary/EnterpriseSearch",
            "name": "EnterpriseSearch",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../DigitStandardLibrary/EnterpriseSearchList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../DigitStandardLibrary/EnterpriseSearchList.tsx').default,
            "authority": [
              "admin",
              "EnterpriseSearch",
              "standard",
              "DigitStandardLibrary"
            ],
            "exact": true
          },
          {
            "path": "/DigitStandardLibrary/EnterpriseEdit",
            "name": "EnterpriseEdit",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../DigitStandardLibrary/EnterpriseEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../DigitStandardLibrary/EnterpriseEdit.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "EnterpriseEdit",
              "standard",
              "DigitStandardLibrary"
            ],
            "exact": true
          },
          {
            "path": "/DigitStandardLibrary/EnterpriseDetail/:id?",
            "name": "EnterpriseDetail",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../DigitStandardLibrary/EnterpriseDetail.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../DigitStandardLibrary/EnterpriseDetail.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "EnterpriseDetail",
              "standard",
              "DigitStandardLibrary"
            ],
            "exact": true
          },
          {
            "path": "/DigitStandardLibrary/MemberSearch",
            "name": "MemberSearch",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../DigitStandardLibrary/MemberSearchList.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../DigitStandardLibrary/MemberSearchList.tsx').default,
            "authority": [
              "admin",
              "MemberSearch",
              "standard",
              "DigitStandardLibrary"
            ],
            "exact": true
          },
          {
            "path": "/DigitStandardLibrary/MemberDetail/:id?",
            "name": "MemberDetail",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../DigitStandardLibrary/MemberDetail.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../DigitStandardLibrary/MemberDetail.tsx').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "MemberDetail",
              "standard",
              "DigitStandardLibrary"
            ],
            "exact": true
          },
          {
            "path": "/DigitStandardLibrary/UserManagement",
            "name": "UserManagement",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../DigitStandardLibrary/UserManagement.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../DigitStandardLibrary/UserManagement.tsx').default,
            "authority": [
              "admin",
              "UserManagement",
              "standard",
              "DigitStandardLibrary"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/authentication",
        "name": "authentication",
        "icon": "dashboard",
        "authority": [
          "admin",
          "authentication"
        ],
        "routes": [
          {
            "path": "/authentication/user",
            "name": "user",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Authentication/models/comDept.js').then(m => { return { namespace: 'comDept',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/company.js').then(m => { return { namespace: 'company',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/department.js').then(m => { return { namespace: 'department',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/groupRoleModal.js').then(m => { return { namespace: 'groupRoleModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/groupUserModal.js').then(m => { return { namespace: 'groupUserModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroup.js').then(m => { return { namespace: 'userGroup',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroupRole.js').then(m => { return { namespace: 'userGroupRole',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroupUser.js').then(m => { return { namespace: 'userGroupUser',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userInfo.js').then(m => { return { namespace: 'userInfo',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userRole.js').then(m => { return { namespace: 'userRole',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userRoleModal.js').then(m => { return { namespace: 'userRoleModal',...m.default}})
],
      component: () => import('../Authentication/User'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Authentication/User').default,
            "authority": [
              "admin",
              "user",
              "authentication"
            ],
            "exact": true
          },
          {
            "path": "/authentication/user/:id",
            "name": "userRole",
            "hideInMenu": true,
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Authentication/models/comDept.js').then(m => { return { namespace: 'comDept',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/company.js').then(m => { return { namespace: 'company',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/department.js').then(m => { return { namespace: 'department',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/groupRoleModal.js').then(m => { return { namespace: 'groupRoleModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/groupUserModal.js').then(m => { return { namespace: 'groupUserModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroup.js').then(m => { return { namespace: 'userGroup',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroupRole.js').then(m => { return { namespace: 'userGroupRole',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroupUser.js').then(m => { return { namespace: 'userGroupUser',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userInfo.js').then(m => { return { namespace: 'userInfo',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userRole.js').then(m => { return { namespace: 'userRole',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userRoleModal.js').then(m => { return { namespace: 'userRoleModal',...m.default}})
],
      component: () => import('../Authentication/User/Role'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Authentication/User/Role').default,
            "authority": [
              "admin",
              "userRole",
              "authentication"
            ],
            "exact": true
          },
          {
            "path": "/authentication/userGroup",
            "name": "userGroup",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Authentication/models/comDept.js').then(m => { return { namespace: 'comDept',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/company.js').then(m => { return { namespace: 'company',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/department.js').then(m => { return { namespace: 'department',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/groupRoleModal.js').then(m => { return { namespace: 'groupRoleModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/groupUserModal.js').then(m => { return { namespace: 'groupUserModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroup.js').then(m => { return { namespace: 'userGroup',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroupRole.js').then(m => { return { namespace: 'userGroupRole',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroupUser.js').then(m => { return { namespace: 'userGroupUser',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userInfo.js').then(m => { return { namespace: 'userInfo',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userRole.js').then(m => { return { namespace: 'userRole',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userRoleModal.js').then(m => { return { namespace: 'userRoleModal',...m.default}})
],
      component: () => import('../Authentication/UserGroup'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Authentication/UserGroup').default,
            "authority": [
              "admin",
              "userGroup",
              "authentication"
            ],
            "exact": true
          },
          {
            "path": "/authentication/userGroupRole/:id",
            "name": "userGroupRole",
            "hideInMenu": true,
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Authentication/models/comDept.js').then(m => { return { namespace: 'comDept',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/company.js').then(m => { return { namespace: 'company',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/department.js').then(m => { return { namespace: 'department',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/groupRoleModal.js').then(m => { return { namespace: 'groupRoleModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/groupUserModal.js').then(m => { return { namespace: 'groupUserModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroup.js').then(m => { return { namespace: 'userGroup',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroupRole.js').then(m => { return { namespace: 'userGroupRole',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroupUser.js').then(m => { return { namespace: 'userGroupUser',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userInfo.js').then(m => { return { namespace: 'userInfo',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userRole.js').then(m => { return { namespace: 'userRole',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userRoleModal.js').then(m => { return { namespace: 'userRoleModal',...m.default}})
],
      component: () => import('../Authentication/UserGroup/GroupRole'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Authentication/UserGroup/GroupRole').default,
            "authority": [
              "admin",
              "userGroupRole",
              "authentication"
            ],
            "exact": true
          },
          {
            "path": "/authentication/userGroup/:id",
            "name": "userGroupUser",
            "hideInMenu": true,
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Authentication/models/comDept.js').then(m => { return { namespace: 'comDept',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/company.js').then(m => { return { namespace: 'company',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/department.js').then(m => { return { namespace: 'department',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/groupRoleModal.js').then(m => { return { namespace: 'groupRoleModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/groupUserModal.js').then(m => { return { namespace: 'groupUserModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroup.js').then(m => { return { namespace: 'userGroup',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroupRole.js').then(m => { return { namespace: 'userGroupRole',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroupUser.js').then(m => { return { namespace: 'userGroupUser',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userInfo.js').then(m => { return { namespace: 'userInfo',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userRole.js').then(m => { return { namespace: 'userRole',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userRoleModal.js').then(m => { return { namespace: 'userRoleModal',...m.default}})
],
      component: () => import('../Authentication/UserGroup/User'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Authentication/UserGroup/User').default,
            "authority": [
              "admin",
              "userGroupUser",
              "authentication"
            ],
            "exact": true
          },
          {
            "path": "/authentication/compdept",
            "name": "company",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Authentication/models/comDept.js').then(m => { return { namespace: 'comDept',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/company.js').then(m => { return { namespace: 'company',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/department.js').then(m => { return { namespace: 'department',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/groupRoleModal.js').then(m => { return { namespace: 'groupRoleModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/groupUserModal.js').then(m => { return { namespace: 'groupUserModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroup.js').then(m => { return { namespace: 'userGroup',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroupRole.js').then(m => { return { namespace: 'userGroupRole',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroupUser.js').then(m => { return { namespace: 'userGroupUser',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userInfo.js').then(m => { return { namespace: 'userInfo',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userRole.js').then(m => { return { namespace: 'userRole',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userRoleModal.js').then(m => { return { namespace: 'userRoleModal',...m.default}})
],
      component: () => import('../Authentication/Company/CompDept'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Authentication/Company/CompDept').default,
            "authority": [
              "admin",
              "company",
              "authentication"
            ],
            "exact": true
          },
          {
            "path": "/authentication/compdept/:id",
            "name": "deptUser",
            "hideInMenu": true,
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Authentication/models/comDept.js').then(m => { return { namespace: 'comDept',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/company.js').then(m => { return { namespace: 'company',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/department.js').then(m => { return { namespace: 'department',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/groupRoleModal.js').then(m => { return { namespace: 'groupRoleModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/groupUserModal.js').then(m => { return { namespace: 'groupUserModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroup.js').then(m => { return { namespace: 'userGroup',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroupRole.js').then(m => { return { namespace: 'userGroupRole',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroupUser.js').then(m => { return { namespace: 'userGroupUser',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userInfo.js').then(m => { return { namespace: 'userInfo',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userRole.js').then(m => { return { namespace: 'userRole',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userRoleModal.js').then(m => { return { namespace: 'userRoleModal',...m.default}})
],
      component: () => import('../Authentication/Company/User'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Authentication/Company/User').default,
            "authority": [
              "admin",
              "deptUser",
              "authentication"
            ],
            "exact": true
          },
          {
            "path": "/authentication/company/:companyId",
            "name": "department",
            "hideInMenu": true,
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Authentication/models/comDept.js').then(m => { return { namespace: 'comDept',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/company.js').then(m => { return { namespace: 'company',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/department.js').then(m => { return { namespace: 'department',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/groupRoleModal.js').then(m => { return { namespace: 'groupRoleModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/groupUserModal.js').then(m => { return { namespace: 'groupUserModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroup.js').then(m => { return { namespace: 'userGroup',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroupRole.js').then(m => { return { namespace: 'userGroupRole',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userGroupUser.js').then(m => { return { namespace: 'userGroupUser',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userInfo.js').then(m => { return { namespace: 'userInfo',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userRole.js').then(m => { return { namespace: 'userRole',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Authentication/models/userRoleModal.js').then(m => { return { namespace: 'userRoleModal',...m.default}})
],
      component: () => import('../Authentication/Company/Department'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Authentication/Company/Department').default,
            "authority": [
              "admin",
              "department",
              "authentication"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/permission",
        "name": "permission",
        "icon": "form",
        "authority": [
          "admin",
          "permission"
        ],
        "routes": [
          {
            "path": "/permission/role",
            "name": "role",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Permission/models/role.js').then(m => { return { namespace: 'role',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleGroup.js').then(m => { return { namespace: 'roleGroup',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleGroupModal.js').then(m => { return { namespace: 'roleGroupModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleMenu.js').then(m => { return { namespace: 'roleMenu',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleMenuModal.js').then(m => { return { namespace: 'roleMenuModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleOrg.js').then(m => { return { namespace: 'roleOrg',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleOrgModal.js').then(m => { return { namespace: 'roleOrgModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleUser.js').then(m => { return { namespace: 'roleUser',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleUserModal.js').then(m => { return { namespace: 'roleUserModal',...m.default}})
],
      component: () => import('../Permission/Role'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Permission/Role').default,
            "authority": [
              "admin",
              "role",
              "permission"
            ],
            "exact": true
          },
          {
            "path": "/permission/roleUser/:id",
            "name": "roleUser",
            "hideInMenu": true,
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Permission/models/role.js').then(m => { return { namespace: 'role',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleGroup.js').then(m => { return { namespace: 'roleGroup',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleGroupModal.js').then(m => { return { namespace: 'roleGroupModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleMenu.js').then(m => { return { namespace: 'roleMenu',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleMenuModal.js').then(m => { return { namespace: 'roleMenuModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleOrg.js').then(m => { return { namespace: 'roleOrg',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleOrgModal.js').then(m => { return { namespace: 'roleOrgModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleUser.js').then(m => { return { namespace: 'roleUser',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleUserModal.js').then(m => { return { namespace: 'roleUserModal',...m.default}})
],
      component: () => import('../Permission/Role/User'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Permission/Role/User').default,
            "authority": [
              "admin",
              "roleUser",
              "permission"
            ],
            "exact": true
          },
          {
            "path": "/permission/roleGroup/:id",
            "name": "roleGroup",
            "hideInMenu": true,
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Permission/models/role.js').then(m => { return { namespace: 'role',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleGroup.js').then(m => { return { namespace: 'roleGroup',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleGroupModal.js').then(m => { return { namespace: 'roleGroupModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleMenu.js').then(m => { return { namespace: 'roleMenu',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleMenuModal.js').then(m => { return { namespace: 'roleMenuModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleOrg.js').then(m => { return { namespace: 'roleOrg',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleOrgModal.js').then(m => { return { namespace: 'roleOrgModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleUser.js').then(m => { return { namespace: 'roleUser',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleUserModal.js').then(m => { return { namespace: 'roleUserModal',...m.default}})
],
      component: () => import('../Permission/Role/Group'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Permission/Role/Group').default,
            "authority": [
              "admin",
              "roleGroup",
              "permission"
            ],
            "exact": true
          },
          {
            "path": "/permission/roleOrg/:id",
            "name": "roleOrg",
            "hideInMenu": true,
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Permission/models/role.js').then(m => { return { namespace: 'role',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleGroup.js').then(m => { return { namespace: 'roleGroup',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleGroupModal.js').then(m => { return { namespace: 'roleGroupModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleMenu.js').then(m => { return { namespace: 'roleMenu',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleMenuModal.js').then(m => { return { namespace: 'roleMenuModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleOrg.js').then(m => { return { namespace: 'roleOrg',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleOrgModal.js').then(m => { return { namespace: 'roleOrgModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleUser.js').then(m => { return { namespace: 'roleUser',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleUserModal.js').then(m => { return { namespace: 'roleUserModal',...m.default}})
],
      component: () => import('../Permission/Role/Organization'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Permission/Role/Organization').default,
            "authority": [
              "admin",
              "roleOrg",
              "permission"
            ],
            "exact": true
          },
          {
            "path": "/permission/roleMenu/:id",
            "name": "roleMenu",
            "hideInMenu": true,
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Permission/models/role.js').then(m => { return { namespace: 'role',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleGroup.js').then(m => { return { namespace: 'roleGroup',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleGroupModal.js').then(m => { return { namespace: 'roleGroupModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleMenu.js').then(m => { return { namespace: 'roleMenu',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleMenuModal.js').then(m => { return { namespace: 'roleMenuModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleOrg.js').then(m => { return { namespace: 'roleOrg',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleOrgModal.js').then(m => { return { namespace: 'roleOrgModal',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleUser.js').then(m => { return { namespace: 'roleUser',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Permission/models/roleUserModal.js').then(m => { return { namespace: 'roleUserModal',...m.default}})
],
      component: () => import('../Permission/Role/Menu'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Permission/Role/Menu').default,
            "authority": [
              "admin",
              "roleMenu",
              "permission"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/catalogue",
        "name": "catalogue",
        "icon": "table",
        "authority": [
          "admin",
          "catalogue"
        ],
        "routes": [
          {
            "path": "/catalogue/catalogue",
            "name": "catalogue",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Catalogue/models/catalogue.js').then(m => { return { namespace: 'catalogue',...m.default}})
],
      component: () => import('../Catalogue/Catalogue'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Catalogue/Catalogue').default,
            "authority": [
              "admin",
              "catalogue"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/other",
        "name": "other",
        "icon": "table",
        "authority": [
          "admin",
          "other"
        ],
        "routes": [
          {
            "path": "/other/cmdb",
            "name": "cmdb",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Other/models/cmdb.js').then(m => { return { namespace: 'cmdb',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Other/models/logmanager.js').then(m => { return { namespace: 'logmanager',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Other/models/xaec.js').then(m => { return { namespace: 'xaec',...m.default}})
],
      component: () => import('../Other/CMDB'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Other/CMDB').default,
            "authority": [
              "admin",
              "cmdb",
              "other"
            ],
            "exact": true
          },
          {
            "path": "/other/xaec",
            "name": "xaec",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Other/models/cmdb.js').then(m => { return { namespace: 'cmdb',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Other/models/logmanager.js').then(m => { return { namespace: 'logmanager',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Other/models/xaec.js').then(m => { return { namespace: 'xaec',...m.default}})
],
      component: () => import('../Other/XAEC'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Other/XAEC').default,
            "authority": [
              "admin",
              "xaec",
              "other"
            ],
            "exact": true
          },
          {
            "path": "/other/xaec/:id",
            "name": "xaecSetting",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Other/models/cmdb.js').then(m => { return { namespace: 'cmdb',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Other/models/logmanager.js').then(m => { return { namespace: 'logmanager',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Other/models/xaec.js').then(m => { return { namespace: 'xaec',...m.default}})
],
      component: () => import('../Other/XAEC/Setting'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Other/XAEC/Setting').default,
            "hideInMenu": true,
            "authority": [
              "admin",
              "xaecSetting",
              "other"
            ],
            "exact": true
          },
          {
            "path": "/other/logmanager",
            "name": "logManager",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Other/models/cmdb.js').then(m => { return { namespace: 'cmdb',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Other/models/logmanager.js').then(m => { return { namespace: 'logmanager',...m.default}}),
  import('F:/youqu/SBY2/src/pages/Other/models/xaec.js').then(m => { return { namespace: 'xaec',...m.default}})
],
      component: () => import('../Other/LogManager'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Other/LogManager').default,
            "authority": [
              "admin",
              "logManager",
              "other"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/geoContent",
        "icon": "global",
        "name": "geoContent",
        "authority": [
          "geo",
          "admin",
          "geoContent"
        ],
        "routes": [
          {
            "path": "/geoContent/categories",
            "name": "categories",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../GeoSign/Category'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../GeoSign/Category').default,
            "authority": [
              "admin",
              "categories",
              "geo",
              "geoContent"
            ],
            "exact": true
          },
          {
            "path": "/geoContent/tags",
            "name": "tags",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../GeoSign/Tag'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../GeoSign/Tag').default,
            "authority": [
              "admin",
              "tags",
              "geo",
              "geoContent"
            ],
            "exact": true
          },
          {
            "path": "/geoContent/articles",
            "name": "articles",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../GeoSign/Article'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../GeoSign/Article').default,
            "authority": [
              "admin",
              "articles",
              "geo",
              "geoContent"
            ],
            "exact": true
          },
          {
            "path": "/geoContent/productKinds",
            "name": "productKinds",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../GeoSign/Product/Kinds'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../GeoSign/Product/Kinds').default,
            "authority": [
              "admin",
              "productKinds",
              "geo",
              "geoContent"
            ],
            "exact": true
          },
          {
            "path": "/geoContent/products",
            "name": "products",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../GeoSign/Product/Products'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../GeoSign/Product/Products').default,
            "authority": [
              "admin",
              "products",
              "geo",
              "geoContent"
            ],
            "exact": true
          },
          {
            "path": "/geoContent/train",
            "name": "train",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../GeoSign/Train'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../GeoSign/Train').default,
            "authority": [
              "admin",
              "train",
              "geo",
              "geoContent"
            ],
            "exact": true
          },
          {
            "path": "/geoContent/experts",
            "name": "experts",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../GeoSign/Expert'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../GeoSign/Expert').default,
            "authority": [
              "admin",
              "experts",
              "geo",
              "geoContent"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/StandardDevelop",
        "name": "trigger",
        "icon": "global",
        "authority": [
          "sd",
          "admin",
          "trigger"
        ],
        "routes": [
          {
            "path": "/StandardDevelop/ProjectManage",
            "name": "ProjectManage",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../StandardDevelop/ProjectManage.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../StandardDevelop/ProjectManage.tsx').default,
            "authority": [
              "admin",
              "ProjectManage",
              "sd",
              "trigger"
            ],
            "exact": true
          },
          {
            "path": "/StandardDevelop/ProjectEdit/:id?/:readOnly?",
            "name": "ProjectEdit",
            "hideInMenu": true,
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../StandardDevelop/ProjectEdit.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../StandardDevelop/ProjectEdit.tsx').default,
            "authority": [
              "admin",
              "ProjectEdit",
              "sd",
              "trigger"
            ],
            "exact": true
          },
          {
            "path": "/StandardDevelop/TaskManage/:id",
            "name": "TaskManage",
            "hideInMenu": true,
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../StandardDevelop/TaskManage.tsx'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../StandardDevelop/TaskManage.tsx').default,
            "authority": [
              "admin",
              "TaskManage",
              "sd",
              "trigger"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "name": "exception",
        "icon": "experiment",
        "path": "/exception",
        "hideInMenu": true,
        "routes": [
          {
            "path": "/exception/403",
            "name": "not-permission",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Exception/models/error.js').then(m => { return { namespace: 'error',...m.default}})
],
      component: () => import('../Exception/403'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Exception/403').default,
            "authority": [
              "admin",
              "not-permission",
              "exception"
            ],
            "exact": true
          },
          {
            "path": "/exception/404",
            "name": "not-find",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Exception/models/error.js').then(m => { return { namespace: 'error',...m.default}})
],
      component: () => import('../Exception/404'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Exception/404').default,
            "authority": [
              "admin",
              "not-find",
              "exception"
            ],
            "exact": true
          },
          {
            "path": "/exception/500",
            "name": "server-error",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Exception/models/error.js').then(m => { return { namespace: 'error',...m.default}})
],
      component: () => import('../Exception/500'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Exception/500').default,
            "authority": [
              "admin",
              "server-error",
              "exception"
            ],
            "exact": true
          },
          {
            "path": "/exception/trigger",
            "name": "trigger",
            "hideInMenu": true,
            "component": __IS_BROWSER
    ? _dvaDynamic({
      app: require('@tmp/dva').getApp(),
models: () => [
  import('F:/youqu/SBY2/src/pages/Exception/models/error.js').then(m => { return { namespace: 'error',...m.default}})
],
      component: () => import('../Exception/TriggerException'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../Exception/TriggerException').default,
            "authority": [
              "admin",
              "trigger",
              "exception"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ],
        "authority": [
          "admin",
          "exception"
        ]
      },
      {
        "path": "/GuangguBase",
        "icon": "global",
        "name": "GuangguBase",
        "authority": [
          "guanggu",
          "admin",
          "GuangguBase"
        ],
        "routes": [
          {
            "path": "/GuangguBase/roadManagement",
            "name": "roadManagement",
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../GuangguBase/RoadManagement'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../GuangguBase/RoadManagement').default,
            "authority": [
              "admin",
              "roadManagement",
              "guanggu",
              "GuangguBase"
            ],
            "exact": true
          },
          {
            "path": "/GuangguBase/roadManagement/roadManagementEdit/:id?/:readOnly?",
            "name": "roadManagementEdit",
            "hideInMenu": true,
            "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../GuangguBase/roadManagementEdit'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../GuangguBase/roadManagementEdit').default,
            "authority": [
              "admin",
              "roadManagementEdit",
              "guanggu",
              "GuangguBase"
            ],
            "exact": true
          },
          {
            "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "component": __IS_BROWSER
    ? _dvaDynamic({
      
      component: () => import('../404'),
      LoadingComponent: require('F:/youqu/SBY2/src/components/PageLoading/index').default,
    })
    : require('../404').default,
        "authority": [
          "admin"
        ],
        "exact": true
      },
      {
        "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": () => React.createElement(require('F:/youqu/SBY2/node_modules/_umi-build-dev@1.10.8@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
  }
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
history.listen(routeChangeHandler);
routeChangeHandler(history.location);

export { routes };

export default function RouterWrapper(props = {}) {
  return (
<RendererWrapper0>
          <Router history={history}>
      { renderRoutes(routes, props) }
    </Router>
        </RendererWrapper0>
  );
}
