module.exports = [
  // user
  // {
  //   path: '/user',
  //   component: '../layouts/UserLayout',
  //   routes: [
  //     {path: '/user', redirect: '/user/login'},
  //     {path: '/user/login', component: './User/Login'},
  //     {path: '/user/register', component: './User/Register'},
  //     {path: '/user/register-result', component: './User/RegisterResult'},
  //   ],
  // },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      { path: '/', redirect: '/userCenter' },
      //用户首页
      {
        path: '/userCenter',
        name: 'userCenter',
        icon: 'user',
        authority: ['admin'],
        component: './UserCenter/UserCenter',
      },
      //新闻管理
      {
        path: '/news',
        name: 'news',
        icon: 'file-text',
        authority: ['admin'],
        routes: [
          {
            path: '/news/advertList',
            name: 'advertList',
            component: './Advert/AdvertList',
          },
          {
            path: '/news/advertList/advertEdit/:id?',
            name: 'advertEdit',
            component: './Advert/AdvertEdit.tsx',
            hideInMenu: true,
          },
          {
            path: '/news/list',
            name: 'newsList',
            component: './News/NewsList',
          },
          {
            path: '/news/list/edit/:id?/:detail?',
            name: 'newsEdit',
            component: './News/NewsEdit',
            hideInMenu: true,
          },
          {
            path: '/news/categoryList',
            name: 'categoryList',
            component: './News/NewsCategoryList',
          },
          // {
          //   path: '/news/mailbox',
          //   name: 'mailbox',
          //   component: './Mailbox/Mailbox',
          // },
        ],
      },
      //系统设置
      {
        path: '/system',
        name: 'system',
        icon: 'setting',
        authority: ['admin'],
        routes: [
          {
            path: '/system/friendLink',
            name: 'friendLink',
            component: './System/FriendLink',
          },
          {
            path: '/system/menu',
            name: 'menu',
            component: './System/MenuList',
          },
          {
            path: '/system/quickFunction',
            name: 'quickFunction',
            component: './System/QuickFunction',
          },
        ]
      },
      /***********缺陷产品管理菜单 ************/
      //首页
      {
        path: '/home',
        name: 'home',
        component: './FaultyProduct/Home/Home.tsx',
        icon: 'home',
        authority: ['expert'],
      },
      // 内容管理
      {
        path: '/defectProductContent',
        name: 'defectProductContent',
        icon: 'file-text',
        authority: ['expert'],
        routes: [
          {
            path: '/defectProductContent/AdvertList',
            name: 'AdvertList',
            component: './FaultyProduct/Contents/AdvertList',
          },
          {
            path: '/defectProductContent/AdvertList/AdvertEdit/:id?',
            name: 'AdvertEdit',
            component: './FaultyProduct/Contents/AdvertEdit',
            hideInMenu: true,
          },
          {
            path: '/defectProductContent/NewsList',
            name: 'NewsList',
            component: './FaultyProduct/Contents/NewsList',
          },
          {
            path: '/defectProductContent/NewsList/NewsEdit/:id?/:readOnly?',
            name: 'NewsEdit',
            component: './FaultyProduct/Contents/NewsEdit',
            hideInMenu: true,
          },
          {
            path: '/defectProductContent/RecallAdvert',
            name: 'RecallAdvert',
            component: './FaultyProduct/Contents/RecallAdvert',
          },
          {
            path: '/defectProductContent/RecallAdvert/RecallAdvertEdit/:id?/:readOnly?',
            name: 'RecallAdvertEdit',
            component: './FaultyProduct/Contents/RecallAdvertEdit',
            hideInMenu: true,
          },
          {
            path: '/defectProductContent/ConsumptionWarning',
            name: 'ConsumptionWarning',
            component: './FaultyProduct/Contents/ConsumptionWarning',
          },
          {
            path: '/defectProductContent/ConsumptionWarning/ConsumptionWarningEdit/:id?/:readOnly?',
            name: 'ConsumptionWarningEdit',
            component: './FaultyProduct/Contents/ConsumptionWarningEdit',
            hideInMenu: true,
          },
          {
            path: '/defectProductContent/Knowledge',
            name: 'Knowledge',
            component: './FaultyProduct/Contents/Knowledge',
          },
          {
            path: '/defectProductContent/Knowledge/KnowledgeEdit/:id?/:readOnly?',
            name: 'KnowledgeEdit',
            component: './FaultyProduct/Contents/KnowledgeEdit',
            hideInMenu: true,
          },
          {
            path: '/defectProductContent/Laws',
            name: 'Laws',
            component: './FaultyProduct/Contents/Laws',
          },
          {
            path: '/defectProductContent/Laws/LawsEdit/:id?/:readOnly?',
            name: 'LawsEdit',
            component: './FaultyProduct/Contents/LawsEdit',
            hideInMenu: true,
          },
          {
            path: '/defectProductContent/Introduction',
            name: 'Introduction',
            component: './FaultyProduct/Contents/Introduction',
          },
          {
            path: '/defectProductContent/FriendLink',
            name: 'FriendLink',
            component: './FaultyProduct/Contents/FriendLink.jsx',
          },
          {
            path: '/defectProductContent/FriendLink/FriendLinkEdit/:id?',
            name: 'FriendLinkEdit',
            component: './FaultyProduct/Contents/FriendLinkEdit.jsx',
            hideInMenu: true,
          },
        ]
      },
      //缺陷产品管理
      {
        path: '/defectProduct',
        name: 'defectProduct',
        icon: 'alert',
        authority: ['expert'],
        routes: [
          {
            path: '/defectProduct/Consumer',
            name: 'Consumer',
            component: './FaultyProduct/DefectProduct/Consumer.tsx',
          },
          {
            path: '/defectProduct/Car',
            name: 'Car',
            component: './FaultyProduct/DefectProduct/Car.tsx',
          },
          {
            path: '/defectProduct/Consumer/ConsumerDetail/:id?',
            name: 'ConsumerDetail',
            component: './FaultyProduct/DefectProduct/ConsumerDetail.tsx',
            hideInMenu: true
          },
          {
            path: '/defectProduct/Car/CarDetail/:id?',
            name: 'CarDetail',
            component: './FaultyProduct/DefectProduct/CarDetail.tsx',
            hideInMenu: true
          },
        ],
      },
      {
        path: '/defectProductStatistics',
        name: 'defectProductStatistics',
        icon: 'bar-chart',
        authority: ['expert'],
        routes: [
          {
            path: '/defectProductStatistics/NewsStatistics',
            name: 'NewsStatistics',
            component: './FaultyProduct/Statistics/NewsStatistics.tsx',
          },
          {
            path: '/defectProductStatistics/DataStatistics',
            name: 'DataStatistics',
            component: './FaultyProduct/Statistics/DataStatistics.tsx',
          },
        ]
      },
      {
        path: '/SampleProductList',
        name: 'SampleProductList',
        component: './FaultyProduct/SampleProductList.tsx',
        icon: 'api',
        authority: ['expert'],
      },
      {
        path: '/SampleProductList/SampleProductEdit/:id?',
        name: 'SampleProductEdit',
        component: './FaultyProduct/SampleProductEdit.tsx',
        authority: ['expert'],
        hideInMenu: true,
      },
      {
        path: '/SampleProductList/SampleProductDetail/:type/:id?',
        name: 'SampleProductEdit',
        component: './FaultyProduct/SampleProductEdit.tsx',
        authority: ['expert'],
        hideInMenu: true,
      },
      // 专家库
      {
        path: '/expertDatabase/ExpertDatabaseList',
        name: 'ExpertDatabaseList',
        component: './FaultyProduct/ExpertDatabase/ExpertDatabaseList.tsx',
        icon: 'team',
        authority: ['expert'],
      },
      {
        path: '/expertDatabase/ExpertDatabaseList/ExpertDatabaseEdit/:type?/:id?',
        name: 'ExpertDatabaseEdit',
        component: './FaultyProduct/ExpertDatabase/ExpertDatabaseEdit.tsx',
        authority: ['expert'],
        hideInMenu: true,
      },

      {
        path: '/FaultProductList',
        name: 'FaultProductList',
        component: './FaultyProduct/FaultProductList.tsx',
        icon: 'apple',
        authority: ['expert'],
      },
      {
        path: '/FaultProductList/FaultProductEdit/:id?',
        name: 'FaultProductEdit',
        component: './FaultyProduct/FaultProductEdit.tsx',
        authority: ['expert'],
        hideInMenu: true,
      },
      {
        path: '/FaultProductList/FaultProductDetail/:type/:id?',
        name: 'FaultProductEdit',
        component: './FaultyProduct/FaultProductEdit.tsx',
        authority: ['expert'],
        hideInMenu: true,
      },
      {
        path: '/CompanyRecordList',
        name: 'CompanyRecordList',
        component: './FaultyProduct/CompanyRecordList.tsx',
        icon: 'laptop',
        authority: ['expert'],
      },
      {
        path: '/CompanyRecordList/CompanyRecordEdit/:id?',
        name: 'CompanyRecordEdit',
        component: './FaultyProduct/CompanyRecordEdit.tsx',
        authority: ['expert'],
        hideInMenu: true,
      },
      {
        path: '/CompanyRecordList/CompanyRecordDetail/:type/:id?',
        name: 'CompanyRecordDetail',
        component: './FaultyProduct/CompanyRecordEdit.tsx',
        authority: ['expert'],
        hideInMenu: true,
      },
      {
        path: '/CarThreeGuarantees',
        name: 'CarThreeGuarantees',
        icon: 'car',
        authority: ['expert'],
        routes: [
          {
            path: '/CarThreeGuarantees/CarThreeConsumerList',
            name: 'CarThreeConsumerList',
            component: './FaultyProduct/CarThree/CarThreeConsumerList.tsx',
          },
          {
            path: '/CarThreeGuarantees/CarThreeConsumerList/CarThreeConsumerEdit/:detail?/:id?',
            name: 'CarThreeConsumerEdit',
            component: './FaultyProduct/CarThree/CarThreeConsumerEdit.tsx',
            hideInMenu: true,
          },
          {
            path: '/CarThreeGuarantees/CarThreeConsumerList/CarThreeConsumerDetail/:type/:id?',
            name: 'CarThreeConsumerEdit',
            component: './FaultyProduct/CarThree/CarThreeConsumerEdit.tsx',
            hideInMenu: true,
          },
          // {
          //   path: '/CarThreeGuarantees/CarThreeCompanyList',
          //   name: 'CarThreeCompanyList',
          //   component: './FaultyProduct/CarThree/CarThreeCompanyList.tsx',
          // },
          // {
          //   path: '/CarThreeGuarantees/CarThreeCompanyList/CarThreeCompanyEdit/:id?/:detail?',
          //   name: 'CarThreeCompanyEdit',
          //   component: './FaultyProduct/CarThree/CarThreeCompanyEdit.tsx',
          //   hideInMenu: true,
          // },
        ],
      },

      {
        path: '/PointCheckList',
        name: 'PointCheckList',
        component: './FaultyProduct/PointCheckList.tsx',
        icon: 'form',
        authority: ['expert'],
      },
      {
        path: '/PointCheckList/PointCheckEdit/:id?',
        name: 'PointCheckEdit',
        component: './FaultyProduct/PointCheckEdit.tsx',
        authority: ['expert'],
        hideInMenu: true,
      },
      {
        path: '/PointCheckList/PointCheckDetail/:id?',
        name: 'PointCheckDetail',
        component: './FaultyProduct/PointCheckDetail.tsx',
        authority: ['expert'],
        hideInMenu: true,
      },

      {
        path: '/DownloadManagerList',
        name: 'DownloadManagerList',
        component: './FaultyProduct/DownloadManagerList.tsx',
        icon: 'download',
        authority: ['expert'],
      },
      {
        path: '/DownloadManagerList/DownloadManagerEdit/:id?',
        name: 'DownloadManagerEdit',
        component: './FaultyProduct/DownloadManagerEdit.tsx',
        authority: ['expert'],
        hideInMenu: true,
      },
      /***********缺陷产品管理菜单 end************/

      /****************统一社会信用代码后台******************/
      {
        path: '/rawData',
        name: 'rawData',
        icon: 'database',
        authority: ["society"],
        routes: [
          {
            path: '/rawData/enterpriseData',
            name: 'enterpriseData',
            component: './Society/RawData/EnterpriseData.tsx',
          },
          {
            path: '/rawData/enterpriseData/enterpriseDataInfo/:id?',
            name: 'enterpriseDataInfo',
            component: './Society/RawData/EnterpriseDataInfo.tsx',
            hideInMenu: true,
          },
          {
            path: '/rawData/individualData',
            name: 'individualData',
            component: './Society/RawData/IndividualData.tsx',
          },
          {
            path: '/rawData/individualData/individualDataInfo/:id?',
            name: 'individualDataInfo',
            component: './Society/RawData/IndividualDataInfo.tsx',
            hideInMenu: true,
          },
          {
            path: '/rawData/civilDataLocal',
            name: 'civilDataLocal',
            component: './Society/RawData/CivilDataLocal.tsx',
          },
          {
            path: '/rawData/civilDataLocal/civilDataLocalInfo/:id?',
            name: 'civilDataLocalInfo',
            component: './Society/RawData/CivilDataLocalInfo.tsx',
            hideInMenu: true,
          },
          {
            path: '/rawData/civilData',
            name: 'civilData',
            component: './Society/RawData/CivilData.tsx',
          },
          {
            path: '/rawData/civilData/civilDataInfo/:id?',
            name: 'civilDataInfo',
            component: './Society/RawData/CivilDataInfo.tsx',
            hideInMenu: true,
          },
          {
            path: '/rawData/organs',
            name: 'organs',
            component: './Society/RawData/Organs.tsx',
          },
          {
            path: '/rawData/organs/organsInfo/:id?',
            name: 'organsInfo',
            component: './Society/RawData/OrgansInfo.tsx',
            hideInMenu: true,
          },
          {
            path: '/rawData/judicialData',
            name: 'judicialData',
            component: './Society/RawData/JudicialData.tsx',
          },
          {
            path: '/rawData/judicialData/judicialDataInfo/:id?',
            name: 'judicialDataInfo',
            component: './Society/RawData/JudicialDataInfo.tsx',
            hideInMenu: true,
          },
          {
            path: '/rawData/religiousData',
            name: 'religiousData',
            component: './Society/RawData/ReligiousData.tsx',
          },
          {
            path: '/rawData/religiousData/religiousDataInfo/:id?',
            name: 'religiousDataInfo',
            component: './Society/RawData/ReligiousDataInfo.tsx',
            hideInMenu: true,
          },
          {
            path: '/rawData/laborData',
            name: 'laborData',
            component: './Society/RawData/LaborData.tsx',
          },
          {
            path: '/rawData/laborData/laborDataInfo/:id?',
            name: 'laborDataInfo',
            component: './Society/RawData/LaborDataInfo.tsx',
            hideInMenu: true,
          },
          {
            path: '/rawData/diplomaticData',
            name: 'diplomaticData',
            component: './Society/RawData/DiplomaticData.tsx',
          },
          {
            path: '/rawData/diplomaticData/diplomaticDataInfo/:id?',
            name: 'diplomaticDataInfo',
            component: './Society/RawData/DiplomaticDataInfo.tsx',
            hideInMenu: true,
          },
          {
            path: '/rawData/culturalData',
            name: 'culturalData',
            component: './Society/RawData/CulturalData.tsx',
          },
          {
            path: '/rawData/culturalData/culturalDataInfo/:id?',
            name: 'culturalDataInfo',
            component: './Society/RawData/CulturalDataInfo.tsx',
            hideInMenu: true,
          },
          {
            path: '/rawData/tourismData',
            name: 'tourismData',
            component: './Society/RawData/TourismData.tsx',
          },
          {
            path: '/rawData/tourismData/tourismDataInfo/:id?',
            name: 'tourismDataInfo',
            component: './Society/RawData/TourismDataInfo.tsx',
            hideInMenu: true,
          },
          {
            path: '/rawData/centralData',
            name: 'centralData',
            component: './Society/RawData/CentralData.tsx',
          },
          {
            path: '/rawData/centralData/centralDataInfo/:id?',
            name: 'centralDataInfo',
            component: './Society/RawData/CentralDataInfo.tsx',
            hideInMenu: true,
          },
          {
            path: '/rawData/agriculture',
            name: 'agriculture',
            component: './Society/RawData/Agriculture.tsx',
          },
          {
            path: '/rawData/agriculture/agricultureInfo/:id?',
            name: 'agricultureInfo',
            component: './Society/RawData/AgricultureInfo.tsx',
            hideInMenu: true,
          },
          {
            path: '/rawData/others',
            name: 'others',
            component: './Society/RawData/Others.tsx',
          },
          {
            path: '/rawData/others/othersInfo/:id?',
            name: 'othersInfo',
            component: './Society/RawData/OthersInfo.tsx',
            hideInMenu: true,
          },
          {
            path: '/rawData/receiveStatistics',
            name: 'receiveStatistics',
            component: './Society/RawData/ReceiveStatistics.tsx',
          },
          {
            path: '/rawData/reportStatistics',
            name: 'reportStatistics',
            component: './Society/RawData/ReportStatistics.tsx',
          },
          {
            path: '/rawData/reReporting',
            name: 'reReporting',
            component: './Society/RawData/ReReporting.tsx',
          },
        ]
      },
      {
        path: '/dataQuery',
        name: 'dataQuery',
        icon: 'select',
        authority: ["society"],
        routes: [
          {
            path: '/dataQuery/unifiedCodeBase',
            name: 'unifiedCodeBase',
            component: './Society/DataQuery/UnifiedCodeBase.tsx',
          },
          // {
          //   path: '/dataQuery/unifiedCodeBase/unifiedCodeBaseInfo/:id?',
          //   name: 'unifiedCodeBaseInfo',
          //   component: './Society/dataQuery/UnifiedCodeBaseInfo.tsx',
          //   hideInMenu: true,
          // },
          {
            path: '/dataQuery/inquiryCodeBase',
            name: 'inquiryCodeBase',
            component: './Society/DataQuery/InquiryCodeBase.tsx',
          },
          {
            path: '/dataQuery/inquiryCodeBase/inquiryCodeBaseInfo/:id?',
            name: 'inquiryCodeBaseInfo',
            component: './Society/dataQuery/InquiryCodeBaseInfo.tsx',
            hideInMenu: true,
          },
          {
            path: '/dataQuery/verificationDatabase',
            name: 'verificationDatabase',
            component: './Society/DataQuery/VerificationDatabase.tsx',
          },
        ]
      },
      {
        path: '/dataStatistics',
        name: 'dataStatistics',
        icon: 'bar-chart',
        authority: ["society"],
        routes: [
          {
            path: '/dataStatistics/centerBack',
            name: 'centerBack',
            component: './Society/DataStatistics/CenterBack.tsx',
          },
          // {
          //   path: '/dataStatistics/centerBack/centerBackInfo/:id?',
          //   name: 'centerBackInfo',
          //   component: './Society/dataStatistics/centerBackInfo.tsx',
          //   hideInMenu: true,
          // },
          {
            path: '/dataStatistics/verificationStatistics',
            name: 'verificationStatistics',
            component: './Society/DataStatistics/VerificationStatistics.tsx',
          },
          {
            path: '/dataStatistics/questionStatistics',
            name: 'questionStatistics',
            component: './Society/DataStatistics/QuestionStatistics.tsx',
          },
          {
            path: '/dataStatistics/reportingStatistics',
            name: 'reportingStatistics',
            component: './Society/DataStatistics/ReportingStatistics.tsx',
          },
          {
            path: '/dataStatistics/reportingStatistics/reportingStatisticsInfo/:id?',
            name: 'reportingStatisticsInfo',
            component: './Society/DataStatistics/ReportingStatisticsInfo.tsx',
            hideInMenu: true,
          },
        ]
      },
      {
        path: '/systemManagement',
        name: 'systemManagement',
        icon: 'setting',
        authority: ["society"],
        routes: [
          {
            path: '/systemManagement/privilegeManagement',
            name: 'privilegeManagement',
            component: './Society/SystemManagement/PrivilegeManagement.tsx',
          },
          {
            path: '/systemManagement/privilegeManagement/privilegeManagementInfo/:id?',
            name: 'privilegeManagementInfo',
            component: './Society/SystemManagement/PrivilegeManagementInfo.tsx',
            hideInMenu: true,
          },
          {
            path: '/systemManagement/policyManagement',
            name: 'policyManagement',
            component: './Society/SystemManagement/PolicyManagement.tsx',
          },
          {
            path: '/systemManagement/policyManagement/policyManagementEdit/:id?',
            name: 'policyManagementEdit',
            component: './Society/SystemManagement/PolicyManagementEdit.tsx',
            hideInMenu: true,
          },
          {
            path: '/systemManagement/friendManagement',
            name: 'friendManagement',
            component: './Society/SystemManagement/FriendManagement.jsx',
          },
          {
            path: '/systemManagement/memberManagement',
            name: 'memberManagement',
            component: './Society/SystemManagement/MemberManagement.tsx',
          },
          // {
          //   path: '/systemManagement/memberManagement/memberEdit',
          //   name: 'memberManagement',
          //   component: './Society/SystemManagement/MemberEdit.tsx',
          //   hideInMenu: true,
          // },
          {
            path: '/systemManagement/memberManagement/memberEdit/:id?',
            name: 'memberManagement',
            component: './Society/SystemManagement/MemberEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/systemManagement/roleManage',
            name: 'roleManage',
            component: './Society/SystemManagement/RoleManage.tsx',
          },
          {
            path: '/systemManagement/roleManage/roleEdit/:id?',
            name: 'roleEdit',
            component: './Society/SystemManagement/RoleEdit.tsx',
            hideInMenu: true,
          },
        ]
      },

      /***********统一社会信用代码后台 end************/

      /**************wto********************/
      {
        path: '/tbt',
        name: 'tbt',
        icon: 'font-size',
        authority: ["wto"],
        routes: [
          {
            path: '/tbt/notice',
            name: 'notice',
            component: './WTO/TBT/NoticeList.tsx',
          },
          {
            path: '/tbt/notice/NoticeEdit/:id?',
            name: 'NoticeEdit',
            component: './WTO/TBT/NoticeEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/tbt/NoticeDiscussionCheck/:discussionID?',
            menuPath: '/tbt/NoticeDiscussionCheck',
            name: 'NoticeDiscussionCheck',
            component: './WTO/TBT/NoticeDiscussionCheck.tsx',
          },

          {
            path: '/tbt/DiscussionList',
            name: 'DiscussionList',
            component: './WTO/TBT/DiscussionList.tsx',
          },
          {
            path: '/tbt/DiscussionList/DiscussionEdit/:id?',
            name: 'DiscussionEdit',
            component: './WTO/TBT/DiscussionEdit.tsx',
            hideInMenu: true,
          },
          {
            path: '/tbt/DiscussionList/OfficialDiscussionEdit/:id?/:readOnly?',
            name: 'OfficialDiscussionEdit',
            component: './WTO/TBT/OfficialDiscussionEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/tbt/DiscussionList/DiscussionCheckList/:discussionID?',
            menuPath: '/tbt/DiscussionList/DiscussionCheckList',
            name: 'DiscussionCheckList',
            component: './WTO/TBT/DiscussionCheckList.tsx',
            hideInMenu: true,
          },
          {
            path: '/tbt/notice/CommonCheckList/:discussionID?',
            menuPath: '/tbt/notice/CommonCheckList',
            name: 'CommonCheckList',
            component: './WTO/TBT/CommonCheckList.tsx',
            hideInMenu: true,
          },


        ]
      },
      //咨询和预警
      {
        path: '/earlyWarning',
        name: 'earlyWarning',
        icon: 'warning',
        authority: ["wto"],
        routes: [
          {
            path: '/earlyWarning/MarketList',
            name: 'MarketList',
            component: './WTO/EarlyWarning/MarketList.tsx',
          },
          {
            path: '/earlyWarning/MarketList/MarketEdit/:id?',
            name: 'MarketEdit',
            component: './WTO/EarlyWarning/MarketEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/earlyWarning/WarnInfoList',
            name: 'WarnInfoList',
            component: './WTO/EarlyWarning/WarnInfoList',
          },
          {
            path: '/earlyWarning/WarnInfoList/WarnInfoEdit/:id?',
            name: 'WarnInfoEdit',
            component: './WTO/EarlyWarning/WarnInfoEdit',
            hideInMenu: true,
          },

          {
            path: '/earlyWarning/TechnologyList',
            name: 'TechnologyList',
            component: './WTO/EarlyWarning/TechnologyList',
          },
          {
            path: '/earlyWarning/TechnologyList/TechnologyEdit/:id?',
            name: 'TechnologyEdit',
            component: './WTO/EarlyWarning/TechnologyEdit',
            hideInMenu: true,
          },

          {
            path: '/earlyWarning/upToStandard',
            name: 'upToStandard',
            component: './WTO/EarlyWarning/UpToStandardList',
          },
          {
            path: '/earlyWarning/upToStandard/UpToStandardEdit/:id?',
            name: 'UpToStandardEdit',
            component: './WTO/EarlyWarning/UpToStandardEdit.tsx',
            hideInMenu: true,
          },
        ]
      },
      // 法国馆
      {
        path: '/france',
        name: 'france',
        icon: 'flag',
        authority: ["wto"],
        routes: [
          {
            path: '/france/EventsList',
            name: 'EventsList',
            component: './WTO/France/EventsList.tsx',
          },
          {
            path: '/france/EventsList/EventsEdit/:id?',
            name: 'EventsEdit',
            component: './WTO/France/EventsEdit.tsx',
            hideInMenu: true,
          },
        ]
      },
      // 综合管理
      {
        path: '/SynthesizeManage',
        name: 'SynthesizeManage',
        icon: 'border-inner',
        authority: ["wto"],
        routes: [
          {
            path: '/SynthesizeManage/AdvertList',
            name: 'AdvertList',
            component: './WTO/SynthesizeManage/AdvertList.jsx',
          },
          {
            path: '/SynthesizeManage/AdvertList/AdvertEdit/:id?',
            name: 'AdvertEdit',
            component: './WTO/SynthesizeManage/AdvertEdit.tsx',
            hideInMenu: true,
          },
          {
            path: '/SynthesizeManage/ResearchResultList',
            name: 'ResearchResultList',
            component: './WTO/SynthesizeManage/ResearchResultList',
          },
          {
            path: '/SynthesizeManage/ResearchResultList/ResearchResultEdit/:id?',
            name: 'ResearchResultEdit',
            component: './WTO/SynthesizeManage/ResearchResultEdit',
            hideInMenu: true,
          },
          {
            path: '/SynthesizeManage/RepositoryList',
            name: 'RepositoryList',
            component: './WTO/SynthesizeManage/RepositoryList',
          },
          {
            path: '/SynthesizeManage/RepositoryList/RepositoryEdit/:id?',
            name: 'RepositoryEdit',
            component: './WTO/SynthesizeManage/RepositoryEdit',
            hideInMenu: true,
          },
          {
            path: '/SynthesizeManage/CaseLibraryList',
            name: 'CaseLibraryList',
            component: './WTO/SynthesizeManage/CaseLibraryList',
          },
          {
            path: '/SynthesizeManage/CaseLibraryList/CaseLibraryEdit/:id?',
            name: 'CaseLibraryEdit',
            component: './WTO/SynthesizeManage/CaseLibraryEdit',
            hideInMenu: true,
          },

          {
            path: '/SynthesizeManage/PeriodicalList',
            name: 'PeriodicalList',
            component: './WTO/SynthesizeManage/PeriodicalList',
          },
          {
            path: '/SynthesizeManage/PeriodicalList/PeriodicalEdit/:id?',
            name: 'PeriodicalEdit',
            component: './WTO/SynthesizeManage/PeriodicalEdit',
            hideInMenu: true,
          },

          {
            path: '/SynthesizeManage/TechnologyTradeList',
            name: 'TechnologyTradeList',
            component: './WTO/SynthesizeManage/TechnologyTradeList',
          },
          {
            path: '/SynthesizeManage/TechnologyTradeList/TechnologyTradeEdit/:id?',
            name: 'TechnologyTradeEdit',
            component: './WTO/SynthesizeManage/TechnologyTradeEdit',
            hideInMenu: true,
          },
          {
            path: '/SynthesizeManage/TechnologyTradeList/TechnologyTradeProgramaList/:subjectId',
            name: 'TechnologyTradeProgramaList',
            component: './WTO/SynthesizeManage/TechnologyTradeProgramaList',
            hideInMenu: true,
          },
          {
            path: '/SynthesizeManage/TechnologyTradeList/TechnologyTradeProgramaArticleList/:programaId/:subjectId',
            name: 'TechnologyTradeProgramaArticleList',
            component: './WTO/SynthesizeManage/TechnologyTradeProgramaArticleList',
            hideInMenu: true,
          },
          {
            path: '/SynthesizeManage/TechnologyTradeList/TechnologyTradeProgramaArticleEdit/:programaId/:id?',
            name: 'TechnologyTradeProgramaArticleEdit',
            component: './WTO/SynthesizeManage/TechnologyTradeProgramaArticleEdit',
            hideInMenu: true,
          },

          {
            path: '/SynthesizeManage/InfoRelation/:tradeProgramaId',
            name: 'InfoRelation',
            component: './WTO/SynthesizeManage/InfoRelation',
            hideInMenu: true,
          },
          {
            path: '/SynthesizeManage/TrainingInformationList',
            name: 'TrainingInformationList',
            component: './WTO/SynthesizeManage/TrainingInformationList',
          },
          {
            path: '/SynthesizeManage/TrainingInformationList/TrainingInformationEdit/:id?/:readOnly?',
            name: 'TrainingInformationEdit',
            component: './WTO/SynthesizeManage/TrainingInformationEdit',
            hideInMenu: true,
          },
          {
            path: '/SynthesizeManage/ExportBusinessDirectory',
            name: 'ExportBusinessDirectory',
            component: './WTO/SynthesizeManage/ExportBusinessDirectory',
          },

          {
            path: '/SynthesizeManage/ServicesProjectList',
            name: 'ServicesProjectList',
            component: './WTO/SynthesizeManage/ServicesProjectList',
          },
          {
            path: '/SynthesizeManage/ServicesProjectList/ServicesProjectEdit/:id?',
            name: 'ServicesProjectEdit',
            component: './WTO/SynthesizeManage/ServicesProjectEdit',
            hideInMenu: true,
          },
          {
            path: '/SynthesizeManage/LeaveMessageList',
            name: 'LeaveMessageList',
            component: './WTO/SynthesizeManage/LeaveMessageList',
          },
          {
            path: '/SynthesizeManage/UserSupervise',
            name: 'UserSupervise',
            component: './WTO/SynthesizeManage/UserSupervise.tsx',
          },

        ]
      },
      //用户订购管理
      {
        path: '/Order',
        name: 'Order',
        icon: 'shopping-cart',
        authority: ["wto"],
        routes: [
          {
            path: '/Order/OnlineLawsList',
            name: 'OnlineLawsList',
            component: './WTO/Order/OnlineLawsList.tsx',
          },
          // {
          //   path: '/Order/StandOrderList',
          //   name: 'StandOrderList',
          //   component: './WTO/Order/StandOrderList.tsx',
          // },
          {
            path: '/Order/OnlineCustomOrderList',
            name: 'OnlineCustomOrderList',
            component: './WTO/Order/OnlineCustomOrderList.tsx',
          },
          {
            path: '/Order/ClientTrainingList',
            name: 'ClientTrainingList',
            component: './WTO/SynthesizeManage/ClientTrainingList',
          },
          {
            path: '/Order/ClientTrainingList/ClientTrainingEdit/:id?/:readOnly?',
            name: 'ClientTrainingEdit',
            component: './WTO/SynthesizeManage/ClientTrainingEdit.tsx',
            hideInMenu: true,
          },
          {
            path: '/Order/ExportBlockList',
            name: 'ExportBlockList',
            component: './WTO/SynthesizeManage/ExportBlockList',
          },
          {
            path: '/Order/ExportBlockList/ExportBlockEdit/:id?/:readOnly?',
            name: 'ExportBlockEdit',
            component: './WTO/SynthesizeManage/ExportBlockEdit',
            hideInMenu: true,
          },
        ]
      },
      //数据统计
      {
        path: '/Statistics',
        name: 'Statistics',
        icon: 'bar-chart',
        authority: ["wto"],
        routes: [
          {
            path: '/Statistics/ExportValueOfOurProvince',
            name: 'ExportValueOfOurProvince',
            component: './WTO/Statistics/ExportValueOfOurProvince.tsx',
          },
          // {
          //   path: '/Statistics/ExportOfCustoms',
          //   name: 'ExportOfCustoms',
          //   component: './WTO/Statistics/ExportOfCustoms.tsx',
          // },
          {
            path: '/Statistics/ProductExportDataOfOutProvince',
            name: 'ProductExportDataOfOutProvince',
            component: './WTO/Statistics/ProductExportDataOfOutProvince.tsx',
          },
          // {
          //   path: '/Statistics/CompanyExportDataOfOutProvince',
          //   name: 'CompanyExportDataOfOutProvince',
          //   component: './WTO/Statistics/CompanyExportDataOfOutProvince.tsx',
          // },
          // {
          //   path: '/Statistics/CountryAndProductNotification',
          //   name: 'CountryAndProductNotification',
          //   component: './WTO/Statistics/CountryAndProductNotification.tsx',
          // },
          // {
          //   path: '/Statistics/ReportImpactAnalysis',
          //   name: 'ReportImpactAnalysis',
          //   component: './WTO/Statistics/ReportImpactAnalysis.tsx',
          // },
          {
            path: '/Statistics/OperationTypeStatistics',
            name: 'OperationTypeStatistics',
            component: './WTO/Statistics/OperationTypeStatistics.tsx',
          },
          {
            path: '/Statistics/OperationTypeStatistics/OperationTypeStatisticsList/:id?',
            name: 'OperationTypeStatisticsList',
            component: './WTO/Statistics/OperationTypeStatisticsList.tsx',
            hideInMenu: true,
          },
        ],
      },
      //数据抓取
      // {
      //   path: '/DataCapture',
      //   name: 'DataCapture',
      //   icon: 'table',
      //   authority: ["wto"],
      //   routes: [
      //     {
      //       path: '/DataCapture/NewsConsulting',
      //       name: 'NewsConsulting',
      //       component: './WTO/DataCapture/NewsConsulting.tsx',
      //     },
      //     {
      //       path: '/DataCapture/GeneralWarning',
      //       name: 'GeneralWarning',
      //       component: './WTO/DataCapture/GeneralWarning.tsx',
      //     },

      //   ]
      // },
      {
        path: '/EnglishSite',
        name: 'EnglishSite',
        icon: 'dollar',
        authority: ["wto"],
        routes: [
          {
            path: '/EnglishSite/AboutUs',
            name: 'AboutUs',
            component: './WTO/EnglishSite/AboutUs.tsx',
          },
          {
            path: '/EnglishSite/InvestigationList',
            name: 'InvestigationList',
            component: './WTO/EnglishSite/InvestigationList.tsx',
          },
          {
            path: '/EnglishSite/InvestigationList/InvestigationEdit/:id?',
            name: 'InvestigationEdit',
            component: './WTO/EnglishSite/InvestigationEdit.tsx',
            hideInMenu: true,
          },
          {
            path: '/EnglishSite/BusinessNewsList',
            name: 'BusinessNewsList',
            component: './WTO/EnglishSite/BusinessNewsList.tsx',
          },
          {
            path: '/EnglishSite/BusinessNewsList/BusinessNewsEdit/:id?',
            name: 'BusinessNewsEdit',
            component: './WTO/EnglishSite/BusinessNewsEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/EnglishSite/CertificationList',
            name: 'CertificationList',
            component: './WTO/EnglishSite/CertificationList.tsx',
          },
          {
            path: '/EnglishSite/CertificationList/CertificationEdit/:id?',
            name: 'CertificationEdit',
            component: './WTO/EnglishSite/CertificationEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/EnglishSite/VerfiedSuppliersList',
            name: 'VerfiedSuppliersList',
            component: './WTO/EnglishSite/VerfiedSuppliersList.tsx',
          },
          {
            path: '/EnglishSite/VerfiedSuppliersList/VerfiedSuppliersEdit/:id?',
            name: 'VerfiedSuppliersEdit',
            component: './WTO/EnglishSite/VerfiedSuppliersEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/EnglishSite/EnterpriseMessageList',
            name: 'EnterpriseMessageList',
            component: './WTO/EnglishSite/EnterpriseMessageList.tsx',
          },
          {
            path: '/EnglishSite/EnterpriseMessageList/EnterpriseMessageEdit/:id?/:readOnly?',
            name: 'EnterpriseMessageEdit',
            component: './WTO/EnglishSite/EnterpriseMessageEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/EnglishSite/ProductTypeDicList',
            name: 'ProductTypeDicList',
            component: './WTO/EnglishSite/ProductTypeDicList.tsx',
          },
          {
            path: '/EnglishSite/ProductTypeDicList/ProductTypeDicEdit/:id?',
            name: 'ProductTypeDicEdit',
            component: './WTO/EnglishSite/ProductTypeDicEdit.tsx',
            hideInMenu: true,
          },
        ]

      },
      {
        path: '/wtoDictionary',
        name: 'wtoDictionary',
        icon: 'database',
        authority: ["wto"],
        routes: [
          {
            path: '/wtoDictionary/HSCodeList',
            name: 'HSCodeList',
            component: './WTO/WTODictionary/HSCodeList.tsx',
          },
          {
            path: '/wtoDictionary/HSCodeList/HSCodeEdit/:id?',
            name: 'HSCodeEdit',
            component: './WTO/WTODictionary/HSCodeEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/wtoDictionary/ICSCodeList',
            name: 'ICSCodeList',
            component: './WTO/WTODictionary/ICSCodeList.tsx',
          },
          {
            path: '/wtoDictionary/ICSCodeList/ICSCodeEdit/:id?',
            name: 'ICSCodeEdit',
            component: './WTO/WTODictionary/ICSCodeEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/wtoDictionary/HSAndISCRelationList',
            name: 'HSAndISCRelationList',
            component: './WTO/WTODictionary/HSAndISCRelationList.tsx',
          },
          {
            path: '/wtoDictionary/HSAndISCRelationList/HSAndISCRelationEdit/:type?/:id?/:readOnly?',
            name: 'HSAndISCRelationEdit',
            component: './WTO/WTODictionary/HSAndISCRelationEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/wtoDictionary/NICWithHSCodeList',
            name: 'NICWithHSCodeList',
            component: './WTO/WTODictionary/NICWithHSCodeList.tsx',
          },
          {
            path: '/wtoDictionary/NICWithHSCodeList/NICWithHSCodeEdit/:id?',
            name: 'NICWithHSCodeEdit',
            component: './WTO/WTODictionary/NICWithHSCodeEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/wtoDictionary/NICWithICSCodeList',
            name: 'NICWithICSCodeList',
            component: './WTO/WTODictionary/NICWithICSCodeList.tsx',
          },
          {
            path: '/wtoDictionary/NICWithICSCodeList/NICWithICSCodeEdit/:id?',
            name: 'NICWithICSCodeEdit',
            component: './WTO/WTODictionary/NICWithICSCodeEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/wtoDictionary/WTOLabelList',
            name: 'WTOLabelList',
            component: './WTO/WTODictionary/WTOLabelList.tsx',
          },
          {
            path: '/wtoDictionary/WTOLabelList/WTOLabelEdit/:id?',
            name: 'WTOLabelEdit',
            component: './WTO/WTODictionary/WTOLabelEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/wtoDictionary/ExportCountryList',
            name: 'ExportCountryList',
            component: './WTO/WTODictionary/ExportCountryList.tsx',
          },
          {
            path: '/wtoDictionary/ExportCountryList/ExportCountryEdit/:id?',
            name: 'ExportCountryEdit',
            component: './WTO/WTODictionary/ExportCountryEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/wtoDictionary/LawDepartmentList',
            name: 'LawDepartmentList',
            component: './WTO/WTODictionary/LawDepartmentList.tsx',
          },
          {
            path: '/wtoDictionary/LawDepartmentList/LawDepartmentEdit/:id?',
            name: 'LawDepartmentEdit',
            component: './WTO/WTODictionary/LawDepartmentEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/wtoDictionary/LawCategoryList',
            name: 'LawCategoryList',
            component: './WTO/WTODictionary/LawCategoryList.tsx',
          },
          {
            path: '/wtoDictionary/LawCategoryList/LawCategoryEdit/:id?',
            name: 'LawCategoryEdit',
            component: './WTO/WTODictionary/LawCategoryEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/wtoDictionary/CountryInfoList',
            name: 'CountryInfoList',
            component: './WTO/WTODictionary/CountryInfoList.tsx',
          },
          {
            path: '/wtoDictionary/CountryInfoList/CountryInfoEdit/:id?',
            name: 'CountryInfoEdit',
            component: './WTO/WTODictionary/CountryInfoEdit.tsx',
            hideInMenu: true,
          },
        ]
      },
      /********************wto end *************/

      /******************** 检验检测机构 *************/
      {
        path: '/DepartmentSearch',
        name: 'DepartmentSearch',
        icon: 'search',
        authority: ["cer"],
        routes: [
          {
            path: '/DepartmentSearch/DepartmentList',
            name: 'DepartmentList',
            component: './CertificationDepartment/DepartmentSearch/DepartmentList.tsx',
          },
          {
            path: '/DepartmentSearch/DepartmentList/DepartInfo/:id',
            name: 'DepartInfo',
            component: './CertificationDepartment/DepartmentSearch/DepartInfo.tsx',
            hideInMenu: true,
          },
          {
            path: '/DepartmentSearch/DepartmentList/DepartInfo/DepartInfoLogDetail/:id',
            name: 'AuthorizerDetail',
            component: './CertificationDepartment/DepartmentSearch/BaseInfoDetail.tsx',
            hideInMenu: true,
          },
          {
            path: '/DepartmentSearch/DepartmentList/DepartInfo/AuthorizerDetail/:id',
            name: 'AuthorizerDetail',
            component: './CertificationDepartment/DepartmentSearch/AuthorizerDetail.tsx',
            hideInMenu: true,
          },
          {
            path: '/DepartmentSearch/DepartmentList/DepartInfo/AuthorizerLogDetail/:id',
            name: 'AuthorizerDetail',
            component: './CertificationDepartment/DepartmentSearch/AuthorizerLogDetail.tsx',
            hideInMenu: true,
          },
          {
            path: '/DepartmentSearch/DepartmentList/DepartInfo/CertificateDetail/:id',
            name: 'CertificateDetail',
            component: './CertificationDepartment/DepartmentSearch/CerAndCapabilityEdit.tsx',
            hideInMenu: true,
          },
          {
            path: '/DepartmentSearch/DepartmentList/DepartInfo/EquipmentDetail/:id',
            name: 'EquipmentEdit',
            component: './CertificationDepartment/DepartmentSearch/EquipmentEdit.tsx',
            hideInMenu: true,
          },
          {
            path: '/DepartmentSearch/DepartmentList/DepartInfo/EquipmentLogDetailList/:id',
            name: 'EquipmentEdit',
            component: './CertificationDepartment/DepartmentSearch/EquipmentLogDetailList.tsx',
            hideInMenu: true,
          },
          {
            path: '/DepartmentSearch/DepartmentList/DepartInfo/MemberDetail/:id',
            name: 'MemberEdit',
            component: './CertificationDepartment/DepartmentSearch/MemberEdit.tsx',
            hideInMenu: true,
          },
          {
            path: '/DepartmentSearch/DepartmentList/DepartInfo/MemberLogDetailList/:id',
            name: 'MemberEdit',
            component: './CertificationDepartment/DepartmentSearch/MemberLogDetailList.tsx',
            hideInMenu: true,
          },
          {
            path: '/DepartmentSearch/DepartmentList/DepartInfo/:id/:index',
            name: 'DepartInfo',
            component: './CertificationDepartment/DepartmentSearch/DepartInfo.tsx',
            hideInMenu: true,
          },

          {
            path: '/DepartmentSearch/DepartAbilityList',
            name: 'DepartAbilityList',
            component: './CertificationDepartment/DepartmentSearch/DepartAbilityList.tsx',
          },
          {
            path: '/DepartmentSearch/DepartAbilityList/AbilityInfo',
            name: 'AbilityInfo',
            component: './CertificationDepartment/DepartmentSearch/AbilityInfo.tsx',
            hideInMenu: true,
          },

          {
            path: '/DepartmentSearch/CertificateStatusList',
            name: 'CertificateStatusList',
            component: './CertificationDepartment/DepartmentSearch/CertificateStatusList.tsx',
          },
          {
            path: '/DepartmentSearch/CertificateStatusList/CertificateInfo/:id',
            name: 'CertificateInfo',
            component: './CertificationDepartment/DepartmentSearch/CertificateInfo.tsx',
            hideInMenu: true,
          },
          {
            path: '/DepartmentSearch/BlackList',
            name: 'BlackList',
            component: './CertificationDepartment/DepartmentSearch/BlackList.tsx',
          },
        ]
      },
      {
        path: '/DepartmentCheck',
        name: 'DepartmentCheck',
        icon: 'check',
        authority: ["cer"],
        routes: [
          {
            path: '/DepartmentCheck/DepartCheckInfoList',
            name: 'DepartCheckInfoList',
            component: './CertificationDepartment/DepartmentCheck/DepartCheckInfoList.tsx',
          },
          {
            path: '/DepartmentCheck/DepartCheckInfoList/DepartCheckInfo/:id?',
            name: 'DepartCheckInfo',
            component: './CertificationDepartment/DepartmentCheck/DepartCheckInfo.tsx',
            hideInMenu: true,
          },

          {
            path: '/DepartmentCheck/DepartDatumList/:title?',
            menuPath:'/DepartmentCheck/DepartDatumList',
            name: 'DepartDatumList',
            component: './CertificationDepartment/DepartmentCheck/DepartDatumList.tsx',
          },

          {
            path: '/DepartmentCheck/AuhorizedSignatureList/:title?',
            menuPath: '/DepartmentCheck/AuhorizedSignatureList',
            name: 'AuhorizedSignatureList',
            component: './CertificationDepartment/DepartmentCheck/AuhorizedSignatureList.tsx',
          },
          {
            path: '/DepartmentCheck/AuhorizedSignatureList/AuhorizedSignatureInfo/:id?',
            name: 'AuhorizedSignatureInfo',
            component: './CertificationDepartment/DepartmentCheck/AuhorizedSignatureInfo.tsx',
            hideInMenu: true,
          },

          {
            path: '/DepartmentCheck/DepartCheckCertificateList/:title?',
            menuPath: '/DepartmentCheck/DepartCheckCertificateList',
            name: 'DepartCheckCertificateList',
            component: './CertificationDepartment/DepartmentCheck/DepartCheckCertificateList.tsx',
          },
          {
            path: '/DepartmentCheck/DepartCheckCertificateList/DepartCheckCertificateInfo/:id?',
            name: 'DepartCheckCertificateInfo',
            component: './CertificationDepartment/DepartmentCheck/DepartCheckCertificateInfo.tsx',
            hideInMenu: true,
          },


          {
            path: '/DepartmentCheck/DepartCheckInstrumentList/:title?',
            menuPath: '/DepartmentCheck/DepartCheckInstrumentList',
            name: 'DepartCheckInstrumentList',
            component: './CertificationDepartment/DepartmentCheck/DepartCheckInstrumentList.tsx',
          },
          {
            path: '/DepartmentCheck/DepartCheckInstrumentList/DepartCheckInstrumentInfo/:id?',
            name: 'DepartCheckInstrumentInfo',
            component: './CertificationDepartment/DepartmentCheck/DepartCheckInstrumentInfo.tsx',
            hideInMenu: true,
          },

          {
            path: '/DepartmentCheck/DepartCheckUserList/:title?',
            menuPath: '/DepartmentCheck/DepartCheckUserList',
            name: 'DepartCheckUserList',
            component: './CertificationDepartment/DepartmentCheck/DepartCheckUserList.tsx',
          },
          {
            path: '/DepartmentCheck/DepartCheckUserList/DepartCheckUserInfo/:id?',
            name: 'DepartCheckUserInfo',
            component: './CertificationDepartment/DepartmentCheck/DepartCheckUserInfo.tsx',
            hideInMenu: true,
          },

          {
            path: '/DepartmentCheck/DepartCheckAbilityList',
            name: 'DepartCheckAbilityList',
            component: './CertificationDepartment/DepartmentCheck/DepartCheckAbilityList.tsx',
          },
        ]
      },
      {
        path: '/DepartmentCheckStatistics',
        name: 'DepartmentCheckStatistics',
        icon: 'bar-chart',
        authority: ["cer"],
        routes: [
          {
            path: '/DepartmentCheckStatistics/DepartmentComprehensiveAnalysis',
            name: 'DepartmentComprehensiveAnalysis',
            component: './CertificationDepartment/Statistics/DepartmentComprehensiveAnalysis.tsx',
          },
          {
            path: '/DepartmentCheckStatistics/DepartmentAnalysisByRegion',
            name: 'DepartmentAnalysisByRegion',
            component: './CertificationDepartment/Statistics/DepartmentAnalysisByRegion.tsx',
          },
          {
            path: '/DepartmentCheckStatistics/DepartmentAnalysisProvince',
            name: 'DepartmentAnalysisProvince',
            component: './CertificationDepartment/Statistics/DepartmentAnalysisProvince.tsx',
          },
        ]
      },
      {
        path: '/DepartmentInfoList',
        name: 'DepartmentInfoList',
        icon: 'copy',
        authority: ["cer"],
        component: './CertificationDepartment/DepartmentInfoList.tsx',
      },
      {
        path: '/DepartmentInfoList/DepartmentInfoEdit/:id',
        name: 'DepartmentInfo',
        icon: 'database',
        authority: ["cer"],
        component: './CertificationDepartment/DepartmentCheck/DepartCheckInfo.tsx',

        hideInMenu: true,
      },
      {
        path: '/DepartmentInfoList/HistoricalInfo',
        name: 'HistoricalInfo',
        authority: ["cer"],
        component: './CertificationDepartment/DepartmentCheck/HistoricalInfo.tsx',
        hideInMenu: true
      },
      {
        path: '/DepartmentInfoList/DepartmentInfoUpdate/:id',
        name: 'DepartmentInfoUpdate',
        authority: ["cer"],
        component: './CertificationDepartment/BaseInfo.tsx',
        hideInMenu: true,
      },
      {
        path: '/DepartmentAbilityFormList',
        name: 'DepartmentAbilityFormList',
        icon: 'rocket',
        authority: ["cer"],
        component: './CertificationDepartment/DepartmentAbilityFormList.tsx',
      },
      {
        path: '/DepartmentAbilityFormList/DepartmentAbilityFormListDetail/:id',
        name: 'DepartmentAbilityFormListDetail',
        icon: 'rocket',
        authority: ["cer"],
        component: './CertificationDepartment/DepartmentAbilityFormListDetail.tsx',
        hideInMenu: true,
      },
      {
        path: '/DepartmentAbilityFormList/DepartmentAbilityFormExtension/:id',
        name: 'DepartmentAbilityFormExtension',
        // icon: 'rocket',
        authority: ["cer"],
        component: './CertificationDepartment/CapabilityExtension.tsx',
        hideInMenu: true,
      },
      {
        path: '/DepartmentAbilityFormList/BatchInput/:id',
        name: 'BatchInput',
        // icon: 'rocket',
        authority: ["cer"],
        component: './CertificationDepartment/BatchInput.tsx',
        hideInMenu: true,
      },
      {
        path: '/DepartmentAbilityFormList/MaintancePower/:id',
        name: 'MaintancePower',
        // icon: 'rocket',
        authority: ["cer"],
        component: './CertificationDepartment/MaintanceCapabilityList.tsx',
        hideInMenu: true,
      },
      {
        path: '/JudgeList',
        name: 'JudgeList',
        icon: 'user',
        authority: ["cer"],
        component: './CertificationDepartment/JudgeList.tsx',
      },
      {
        path: '/JudgeList/JudgeEdit/:id?/:readOnly?',
        name: 'JudgeEdit',
        icon: 'database',
        authority: ["cer"],
        component: './CertificationDepartment/JudgeEdit.tsx',
        hideInMenu: true,
      },

      {
        path: '/TechnicalAdvisoryList',
        name: 'TechnicalAdvisoryList',
        icon: 'deployment-unit',
        authority: ["cer"],
        component: './CertificationDepartment/TechnicalAdvisoryList.tsx',
      },
      {
        path: '/TechnicalAdvisoryList/TechnicalAdvisoryEdit/:id?',
        name: 'TechnicalAdvisoryEdit',
        icon: 'database',
        authority: ["cer"],
        component: './CertificationDepartment/TechnicalAdvisoryEdit.tsx',
        hideInMenu: true,
      },

      {
        path: '/CerInformationPublish',
        name: 'CerInformationPublish',
        icon: 'edit',
        authority: ["cer"],
        routes: [
          {
            path: '/CerInformationPublish/AdvertList',
            name: 'AdvertList',
            component: './CertificationDepartment/InformationPublish/AdvertList.jsx',
          },
          {
            path: '/CerInformationPublish/AdvertList/AdvertEdit/:id?',
            name: 'AdvertEdit',
            component: './CertificationDepartment/InformationPublish/AdvertEdit.tsx',
            hideInMenu: true,
          },
          {
            path: '/CerInformationPublish/PolicyList',
            name: 'CerPolicyList',
            component: './CertificationDepartment/InformationPublish/PolicyList.tsx',
          },
          {
            path: '/CerInformationPublish/PolicyList/PolicyEdit/:id?',
            name: 'CerPolicyEdit',
            component: './CertificationDepartment/InformationPublish/PolicyEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/CerInformationPublish/PolicyUnscrambleList',
            name: 'PolicyUnscrambleList',
            component: './CertificationDepartment/InformationPublish/PolicyUnscrambleList.tsx',
          },
          {
            path: '/CerInformationPublish/PolicyUnscrambleList/PolicyUnscrambleEdit/:id?',
            name: 'PolicyUnscrambleEdit',
            component: './CertificationDepartment/InformationPublish/PolicyUnscrambleEdit.tsx',
            hideInMenu: true,
          },

          {
            path: '/CerInformationPublish/NoticeList',
            name: 'NoticeList',
            component: './CertificationDepartment/InformationPublish/NoticeList.tsx',
          },
          {
            path: '/CerInformationPublish/NoticeList/NoticeEdit/:id?',
            name: 'NoticeEdit',
            component: './CertificationDepartment/InformationPublish/NoticeEdit.tsx',
            hideInMenu: true,
          },
        ]
      },

      {
        path: '/CerSystem',
        name: 'CerSystem',
        icon: 'setting',
        authority: ["cer"],
        routes: [
          {
            path: '/CerSystem/LicenseExpireEdit',
            name: 'LicenseExpireEdit',
            component: './CertificationDepartment/System/LicenseExpireEdit.tsx',
          },
          
          {
            path: '/CerSystem/PartyManagement',
            name: 'PartyManagement',
            component: './CertificationDepartment/DepartmentSearch/PartyManagement.tsx',
          },
          // {
          //   path: '/CerSystem/CerMemberList',
          //   name: 'CerMemberList',
          //   component: './CertificationDepartment/System/MemberList.tsx',
          // },
        ]
      },

      /******************** 检验检测机构 end*************/

      /***************************数字标准馆***********************/
      {
        path: '/DigitStandardLibrary',
        name: 'DigitStandardLibrary',
        authority: ['standard'],
        // hideInMenu: true,
        routes: [
          { path: '/DigitStandardLibrary/EnterpriseSearch', name: 'EnterpriseSearch', component: './DigitStandardLibrary/EnterpriseSearchList.tsx' },
          { path: '/DigitStandardLibrary/EnterpriseEdit', name: 'EnterpriseEdit', component: './DigitStandardLibrary/EnterpriseEdit.tsx', hideInMenu: true, },
          { path: '/DigitStandardLibrary/EnterpriseDetail/:id?', name: 'EnterpriseDetail', component: './DigitStandardLibrary/EnterpriseDetail.tsx', hideInMenu: true, },

          { path: '/DigitStandardLibrary/MemberSearch', name: 'MemberSearch', component: './DigitStandardLibrary/MemberSearchList.tsx' },
          { path: '/DigitStandardLibrary/MemberDetail/:id?', name: 'MemberDetail', component: './DigitStandardLibrary/MemberDetail.tsx', hideInMenu: true, },
          { path: '/DigitStandardLibrary/UserManagement', name: 'UserManagement', component: './DigitStandardLibrary/UserManagement.tsx' },
        ]
      },
      /***************************数字标准馆***********************/

      /****** 权限系统 *******/
      {
        path: '/authentication',
        name: 'authentication',
        icon: 'dashboard',
        authority: ['admin'],
        routes: [
          {
            path: '/authentication/user',
            name: 'user',
            component: './Authentication/User',
          },
          {
            path: '/authentication/user/:id',
            name: 'userRole',
            hideInMenu: true,
            component: './Authentication/User/Role',
          },
          {
            path: '/authentication/userGroup',
            name: 'userGroup',
            component: './Authentication/UserGroup',
          },
          {
            path: '/authentication/userGroupRole/:id',
            name: 'userGroupRole',
            hideInMenu: true,
            component: './Authentication/UserGroup/GroupRole',
          },
          {
            path: '/authentication/userGroup/:id',
            name: 'userGroupUser',
            hideInMenu: true,
            component: './Authentication/UserGroup/User',
          },
          {
            path: '/authentication/compdept',
            name: 'company',
            component: './Authentication/Company/CompDept',
          },
          {
            path: '/authentication/compdept/:id',
            name: 'deptUser',
            hideInMenu: true,
            component: './Authentication/Company/User',
          },
          // {
          //   path: '/authentication/company',
          //   name: 'company1',
          //   component: './Authentication/Company/Company',
          // },
          {
            path: '/authentication/company/:companyId',
            name: 'department',
            hideInMenu: true,
            component: './Authentication/Company/Department',
          },
        ],
      },
      {
        path: '/permission',
        name: 'permission',
        icon: 'form',
        authority: ['admin'],
        routes: [
          {
            path: '/permission/role',
            name: 'role',
            component: './Permission/Role',
          },
          {
            path: '/permission/roleUser/:id',
            name: 'roleUser',
            hideInMenu: true,
            component: './Permission/Role/User',
          },
          {
            path: '/permission/roleGroup/:id',
            name: 'roleGroup',
            hideInMenu: true,
            component: './Permission/Role/Group',
          },
          {
            path: '/permission/roleOrg/:id',
            name: 'roleOrg',
            hideInMenu: true,
            component: './Permission/Role/Organization',
          },
          {
            path: '/permission/roleMenu/:id',
            name: 'roleMenu',
            hideInMenu: true,
            component: './Permission/Role/Menu',
          },
        ],
      },
      {
        path: '/catalogue',
        name: 'catalogue',
        icon: 'table',
        authority: ['admin'],
        routes: [
          {
            path: '/catalogue/catalogue',
            name: 'catalogue',
            component: './Catalogue/Catalogue',
          },
        ],
      },
      {
        path: '/other',
        name: 'other',
        icon: 'table',
        authority: ['admin'],
        routes: [
          {
            path: '/other/cmdb',
            name: 'cmdb',
            component: './Other/CMDB',
          },
          {
            path: '/other/xaec',
            name: 'xaec',
            component: './Other/XAEC',
          },
          {
            path: '/other/xaec/:id',
            name: 'xaecSetting',
            component: './Other/XAEC/Setting',
            hideInMenu: true,
          },
          {
            path: '/other/logmanager',
            name: 'logManager',
            component: './Other/LogManager',
          },
        ],
      },

      /****** 权限系统 end*******/


      /***** 地理标志 BEGIN*****/
      {
        path: '/geoContent',
        icon: 'global',
        name: 'geoContent',
        authority: ['geo'],
        routes: [
          {
            path: '/geoContent/categories',
            name: 'categories',
            component: './GeoSign/Category',
          },
          {
            path: '/geoContent/tags',
            name: 'tags',
            component: './GeoSign/Tag',
          },
          {
            path: '/geoContent/articles',
            name: 'articles',
            component: './GeoSign/Article',
          },
          {
            path: '/geoContent/productKinds',
            name: 'productKinds',
            component: './GeoSign/Product/Kinds',
          },
          {
            path: '/geoContent/products',
            name: 'products',
            component: './GeoSign/Product/Products',
          },
          {
            path: '/geoContent/train',
            name: 'train',
            component: './GeoSign/Train',
          },
          {
            path: '/geoContent/experts',
            name: 'experts',
            component: './GeoSign/Expert',
          },
        ],
      },
      /***** 地理标志 END*****/

      /****** 标准研制 *****/
      {
        path: '/StandardDevelop',
        name: 'trigger',
        icon: 'global',
        authority: ['sd'],
        routes: [
          {
            path: '/StandardDevelop/ProjectManage',
            name: 'ProjectManage',
            // hideInMenu: true,
            component: './StandardDevelop/ProjectManage.tsx',
          },
          {
            path: '/StandardDevelop/ProjectEdit/:id?/:readOnly?',
            name: 'ProjectEdit',
            hideInMenu: true,
            component: './StandardDevelop/ProjectEdit.tsx',
          },
          {
            path: '/StandardDevelop/TaskManage/:id',
            name: 'TaskManage',
            hideInMenu: true,
            component: './StandardDevelop/TaskManage.tsx',
          },
        ],
      },

      {
        name: 'exception',
        icon: 'experiment',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },

      // {
      //   name: 'account',
      //   icon: 'user',
      //   path: '/account',
      //   hideInMenu: true,
      //   routes: [
      //     {
      //       path: '/account/center',
      //       name: 'center',
      //       component: './Account/Center/Center',
      //       routes: [
      //         {
      //           path: '/account/center',
      //           redirect: '/account/center/articles',
      //         },
      //         {
      //           path: '/account/center/articles',
      //           component: './Account/Center/Articles',
      //         },
      //         {
      //           path: '/account/center/applications',
      //           component: './Account/Center/Applications',
      //         },
      //         {
      //           path: '/account/center/projects',
      //           component: './Account/Center/Projects',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/account/settings',
      //       name: 'settings',
      //       component: './Account/Settings/Info',
      //       routes: [
      //         {
      //           path: '/account/settings',
      //           redirect: '/account/settings/base',
      //           name:''
      //         },
      //         {
      //           path: '/account/settings/base',
      //           component: './Account/Settings/BaseView',
      //         },
      //         {
      //           path: '/account/settings/security',
      //           component: './Account/Settings/SecurityView',
      //         },
      //         {
      //           path: '/account/settings/binding',
      //           component: './Account/Settings/BindingView',
      //         },
      //         {
      //           path: '/account/settings/notification',
      //           component: './Account/Settings/NotificationView',
      //         },
      //       ],
      //     },
      //   ],
      // },

      /***** 光谷基地 BEGIN*****/
      {
        path: '/GuangguBase',
        icon: 'global',
        name: 'GuangguBase',
        authority: ['guanggu'],
        routes: [
          {
            path: '/GuangguBase/roadManagement',
            name: 'roadManagement',
            // component: './GeoSign/Category',
            component: './GuangguBase/RoadManagement',
          },
          {
            path: '/GuangguBase/roadManagement/roadManagementEdit/:id?/:readOnly?',
            name: 'roadManagementEdit',
            // component: './GeoSign/Category',
            hideInMenu: true,
            component: './GuangguBase/roadManagementEdit',
          },
        ],
      },
      /***** 光谷基地 END*****/

      {
        component: '404',
      },
    ],
  },
];
