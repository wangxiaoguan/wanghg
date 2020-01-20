export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    // authority: ['admin', 'user'],

    routes: [
      { path: '/', redirect: '/index' },
      /************ 院官网 ***********/
      {
        path: '/index',
        name: 'home',
        routes: [
          {
            path: '/index',
            component: './Index/Index',
            name: 'home',
          },
          {
            path: '/index/ArticleListPage/:id?/:secondID?',
            component: './Index/ArticleListPage.tsx',
            name: 'ArticleListPage',
          },
          {
            path: '/index/PartyArticleListPage',
            component: './Index/PartyArticleListPage.tsx',
            name: 'PartyArticleListPage',
          },
          {
            path: '/index/ArticleInfo/:id?',
            component: './Index/ArticleInfo.tsx',
            name: 'indexArticleInfo',
          },
          {
            path: '/index/AboutUs',
            component: './Index/AboutUs.tsx',
            name: 'indexAboutUs',
          },
          {
            path: '/index/ClientAll',
            component: './Index/ClientAll.tsx',
            name: 'ClientAll',
          },
          {
            path: '/index/PartnerAll',
            component: './Index/PartnerAll.tsx',
            name: 'PartnerAll',
          },
        ],
      },

      /************ 院官网 end***********/

      /************ 光谷基地 ***********/
      {
        path: '/GuangGuBase',
        name: 'GuangGuBase',
        routes: [
          {
            path: '/GuangGuBase',
            component: './GuangGuBase2/Index',
            name: 'GuangGuBaseIndex',
          },
        ],
      },
      /************ 光谷基地 end***********/

      /************ 统一信用代码 ***********/
      {
        path: '/Society/UserBackStage',
        component: './Society/UserBackStage/UserBackStage.tsx',
        routes: [
          {
            path: '/Society/UserBackStage',
            redirect: '/Society/UserBackStage/rawData/enterpriseData'
          },
          {
            path: '/Society/UserBackStage/rawData/enterpriseData',//工商
            component: './Society/UserBackStage/RawData/EnterpriseData.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/enterpriseData/enterpriseDataInfo/:id?',
            component: './Society/UserBackStage/RawData/EnterpriseDataInfo.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/individualData',//个人
            component: './Society/UserBackStage/RawData/IndividualData.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/individualData/individualDataInfo/:id?',
            component: './Society/UserBackStage/RawData/IndividualDataInfo.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/civilDataLocal',//民政 本地
            component: './Society/UserBackStage/RawData/CivilDataLocal.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/civilDataLocal/civilDataLocalInfo/:id?',
            component: './Society/UserBackStage/RawData/CivilDataLocalInfo.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/civilData',//民政
            component: './Society/UserBackStage/RawData/CivilData.tsx'
          },
          {
            path: '/Society/UserBackStage/rawData/civilData/civilDataInfo/:id?',
            component: './Society/UserBackStage/RawData/CivilDataInfo.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/organs',
            component: './Society/UserBackStage/RawData/Organs.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/organs/organsInfo/:id?',
            component: './Society/UserBackStage/RawData/OrgansInfo.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/judicialData',
            component: './Society/UserBackStage/RawData/JudicialData.tsx'
          },
          {
            path: '/Society/UserBackStage/rawData/judicialData/judicialDataInfo/:id?',
            component: './Society/UserBackStage/RawData/JudicialDataInfo.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/religiousData',
            component: './Society/UserBackStage/RawData/ReligiousData.tsx'
          },
          {
            path: '/Society/UserBackStage/rawData/religiousData/religiousDataInfo/:id?',
            component: './Society/UserBackStage/RawData/ReligiousDataInfo.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/laborData',
            component: './Society/UserBackStage/RawData/LaborData.tsx'
          },
          {
            path: '/Society/UserBackStage/rawData/laborData/laborDataInfo/:id?',
            component: './Society/UserBackStage/RawData/LaborDataInfo.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/diplomaticData',
            component: './Society/UserBackStage/RawData/DiplomaticData.tsx'
          },
          {
            path: '/Society/UserBackStage/rawData/diplomaticData/diplomaticDataInfo/:id?',
            component: './Society/UserBackStage/RawData/DiplomaticDataInfo.tsx'
          },


          {
            path: '/Society/UserBackStage/rawData/culturalData',
            component: './Society/UserBackStage/RawData/CulturalData.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/culturalData/culturalDataInfo/:id?',
            component: './Society/UserBackStage/RawData/CulturalDataInfo.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/tourismData',
            component: './Society/UserBackStage/RawData/TourismData.tsx'
          },
          {
            path: '/Society/UserBackStage/rawData/tourismData/tourismDataInfo/:id?',
            component: './Society/UserBackStage/RawData/TourismDataInfo.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/centralData',
            component: './Society/UserBackStage/RawData/CentralData.tsx'
          },
          {
            path: '/Society/UserBackStage/rawData/centralData/centralDataInfo/:id?',
            component: './Society/UserBackStage/RawData/CentralDataInfo.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/agriculture',
            component: './Society/UserBackStage/RawData/Agriculture.tsx'
          },
          {
            path: '/Society/UserBackStage/rawData/agriculture/agricultureInfo/:id?',
            component: './Society/UserBackStage/RawData/AgricultureInfo.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/others',
            component: './Society/UserBackStage/RawData/Others.tsx'
          },
          {
            path: '/Society/UserBackStage/rawData/others/othersInfo/:id?',
            component: './Society/UserBackStage/RawData/OthersInfo.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/receiveStatistics',
            component: './Society/UserBackStage/RawData/ReceiveStatistics.tsx'
          },
          {
            path: '/Society/UserBackStage/rawData/reportStatistics',
            component: './Society/UserBackStage/RawData/ReportStatistics.tsx'
          },

          {
            path: '/Society/UserBackStage/rawData/reReporting',
            component: './Society/UserBackStage/RawData/ReReporting.tsx'
          },

          /** 湖北省统一代码库 */
          {
            path: '/Society/UserBackStage/dataQuery/unifiedCodeBase',
            component: './Society/UserBackStage/DataQuery/UnifiedCodeBase.tsx'
          },
          {
            path: '/Society/UserBackStage/dataQuery/unifiedCodeBase/unifiedCodeBaseInfo/:id?',
            component: './Society/UserBackStage/DataQuery/UnifiedCodeBaseInfo.tsx'
          },
          {
            path: '/Society/UserBackStage/dataQuery/inquiryCodeBase',
            component: './Society/UserBackStage/DataQuery/InquiryCodeBase.tsx'
          },
          {
            path: '/Society/UserBackStage/dataQuery/inquiryCodeBase/inquiryCodeBaseInfo/:id?',
            component: './Society/UserBackStage/DataQuery/InquiryCodeBaseInfo.tsx'
          },
          {
            path: '/Society/UserBackStage/dataQuery/verificationDatabase',
            component: './Society/UserBackStage/DataQuery/VerificationDatabase.tsx'
          },

          /**
           * 问题数据
           */
          {
            path: '/Society/UserBackStage/dataStatistics/centerBack',
            name: 'centerBack',
            component: './Society/UserBackStage/DataStatistics/CenterBack.tsx',
          },
          {
            path: '/Society/UserBackStage/dataStatistics/centerBack/centerBackInfo/:id?',
            name: 'centerBackInfo',
            component: './Society/UserBackStage/dataStatistics/centerBackInfo.tsx',
          },
          {
            path: '/Society/UserBackStage/dataStatistics/verificationStatistics',
            name: 'verificationStatistics',
            component: './Society/UserBackStage/DataStatistics/VerificationStatistics.tsx',
          },
          {
            path: '/Society/UserBackStage/dataStatistics/questionStatistics',
            name: 'questionStatistics',
            component: './Society/UserBackStage/DataStatistics/QuestionStatistics.tsx',
          },
          {
            path: '/Society/UserBackStage/dataStatistics/reportingStatistics',
            name: 'reportingStatistics',
            component: './Society/UserBackStage/DataStatistics/ReportingStatistics.tsx',
          },
          {
            path: '/Society/UserBackStage/dataStatistics/reportingStatistics/reportingStatisticsInfo/:id?',
            name: 'reportingStatisticsInfo',
            component: './Society/UserBackStage/DataStatistics/ReportingStatisticsInfo.tsx',
          },
        ]
      },
      {
        path: '/Society',
        name: 'Society',
        routes: [
          {
            path: '/Society',
            component: './Society/Index',
            name: 'SocietyIndex',
          },

          {
            path: '/Society/InfoQueryStart',
            name: 'InfoQueryStart',
            component: './Society/InfoQueryStart.tsx'
          },
          {
            path: '/Society/InfoList/:query?',
            name: 'InfoList',
            component: './Society/InfoList.tsx'
          },
          {
            path: '/Society/VerifyTool',
            name: 'VerifyTool',
            component: './Society/VerifyTool.tsx'
          },
          {
            path:'/Society/ExamineIndex',
            name: 'ExamineIndex',
            component: './Society/ExamineIndex.tsx'
          },
          {
            path: '/Society/ExaminePublicity',
            name: 'ExaminePublicity',
            component: './Society/ExaminePublicity.tsx'
          },
          {
            path: '/Society/InfoList/InfoDetail/:id?',
            name: 'InfoDetail',
            component: './Society/InfoDetail.tsx'
          },
          {
            path: '/Society/InfoList/IssueDetail/:id?',
            name: 'IssueDetail',
            component: './Society/IssueDetail.tsx'
          },
          {
            path: '/Society/InfoList/RealIssueDetail/:id?',
            name: 'RealIssueDetail',
            component: './Society/RealIssueDetail.tsx'
          },
          {
            path: '/Society/PolicyList',
            name: 'PolicyList',
            component: './Society/PolicyList.tsx'
          },
          {
            path: '/Society/PolicyInfo/:id?',
            name: 'PolicyInfo',
            component: './Society/PolicyInfo.tsx'
          }
        ],
      },

  

      /************ 光谷基地 end***********/

      {
        path: '/digitalStandards',
        component: './Index/Index',
        name: 'digitalStandards',
      },
      /************* wto ***************/
      {
        path: '/wto',
        component: './WTO/Main/Index.tsx',
        name: 'WTOMain',
      },
      {
        path: '/wto/France',
        component: './WTO/France/BasicPage.tsx',
        name: 'WTOFrance',
        routes: [
          {
            path: '/wto/France/Index',
            component: './WTO/France/France.tsx',
            name: 'WTOFranceIndex',
          },
          {
            path: '/wto/France/ChinaFranceEventListPage/:year?',
            component: './WTO/France/ChinaFranceEventListPage.tsx',
            name: 'ChinaFranceEventListPage',
          },
        ],
      },
      {
        path: '/wto/english',
        component: './WTO/English/English.tsx',
        name: 'WTOEnglish',
      },
      {
        path: '/wto/english/VerfiedSuppliersListPage',
        component: './WTO/English/VerfiedSuppliersListPage.tsx',
        name: 'VerfiedSuppliersListPage',
      },
      {
        path: '/wto/english/VerfiedSuppliersDetail/:id',
        component: './WTO/English/VerfiedSuppliersDetail.tsx',
        name: 'VerfiedSuppliersDetail',
      },
      {
        path: '/wto/english/BusinessNewsListPage',
        component: './WTO/English/BusinessNewsListPage.tsx',
        name: 'BusinessNewsListPage',
      },
      {
        path: '/wto/english/BusinessNewsDetail/:id',
        component: './WTO/English/BusinessNewsDetail.tsx',
        name: 'BusinessNewsDetail',
      },

      {
        path: '/wto/ArticleListPage/:type?',
        component: './WTO/Main/ArticleListPage.tsx',
        name: 'ArticleListPage',
      },
      {
        path: '/wto/HScodeSearch/:key?',
        component: './WTO/Main/HScodeSearch.tsx',
        name: 'HScodeSearch',
      },
      {
        path: '/wto/ProductsExported/:key?',
        component: './WTO/Main/ProductsExported.tsx',
        name: 'ProductsExported',
      },
      {
        path: '/wto/ConformityAssessment/:key?',
        component: './WTO/Main/ConformityAssessment.tsx',
        name: 'ConformityAssessment',
      },
      {
        path: '/wto/HSCodeList/:name?/:code',
        component: './WTO/Main/HSCodeList.tsx',
        name: 'HSCodeList',
      },
      {
        path: '/wto/HSCodeListDetail/:id?/:type?',
        component: './WTO/Main/HSCodeListDetail.tsx',
        name: 'HSCodeListDetail',
      },
      {
        path: '/wto/CoustomDataList/:id?/:name',
        component: './WTO/Main/CoustomDataList.tsx',
        name: 'CoustomDataList',
      },
      {
        path: '/wto/CoustomDataListDetail/:id?/:type?',
        component: './WTO/Main/HSCodeListDetail.tsx',
        name: 'CoustomDataListDetail',
      },
      {
        path: '/wto/AuthenticationPackage',
        component: './WTO/Main/AuthenticationPackage.tsx',
        // name: 'AuthenticationDetail',
        routes:[
          {
            path:'/wto/AuthenticationPackage/AuthenticationDetail/:id?/:readOnly?',
            component: './WTO/Main/AuthenticationDetail.tsx',
          }
        ],
      },

      // 个人后台
      {
        path: '/wto/UserBackStage',
        component: './WTO/UserBackStage/UserBackStage.tsx',
        routes: [
          {
            path: '/wto/UserBackStage',
            redirect: '/wto/UserBackStage/UserInfo',
          },
          {
            path: '/wto/UserBackStage/UserInfo',
            component: './WTO/UserBackStage/UserInfo.tsx',
          },
          {
            path: '/wto/UserBackStage/NoticeDiscussionList',
            component: './WTO/UserBackStage/NoticeDiscussionList.tsx',
          },
          {
            path: '/wto/UserBackStage/TrainingList',
            component: './WTO/UserBackStage/TrainingList.tsx',
          },
          {
            path: '/wto/UserBackStage/TrainingList/TrainingEdit/:id?',
            component: './WTO/UserBackStage/TrainingEdit.tsx',
          },

          {
            path: '/wto/UserBackStage/ExportBlockList',
            component: './WTO/UserBackStage/ExportBlockList.tsx',
          },
          {
            path: '/wto/UserBackStage/ExportBlockList/ExportBlockEdit/:id?',
            component: './WTO/UserBackStage/ExportBlockEdit.tsx',
          },

          {
            path: '/wto/UserBackStage/OnlineLawsList',
            component: './WTO/UserBackStage/OnlineLawsList.tsx',
          },
          {
            path: '/wto/UserBackStage/OnlineLawsList/OnlineLawsEdit/:id?',
            component: './WTO/UserBackStage/OnlineLawsEdit.tsx',
          },

          {
            path: '/wto/UserBackStage/OnlineCustomOrderList',
            component: './WTO/UserBackStage/OnlineCustomOrderList.tsx',
          },
          {
            path: '/wto/UserBackStage/OnlineCustomOrderList/OnlineCustomOrderEdit/:id?',
            component: './WTO/UserBackStage/OnlineCustomOrderEdit.tsx',
          },

          {
            path: '/wto/UserBackStage/FocusLawList',
            component: './WTO/UserBackStage/FocusLawList.tsx',
          },
        ],
      },
      {
        path: '/wto/ArticleInfo/:id?/:type?',
        component: './WTO/Main/ArticleInfo.tsx',
        name: 'WTOArticleInfo',
      },
      {
        path: '/wto/CommentInfo/:id?/:type?',
        component: './WTO/Main/CommentInfo.tsx',
        name: 'CommentInfo',
      },
      {
        path: '/wto/CommentGeneral',
        component: './WTO/Main/CommentGeneral.tsx',
        name: 'CommentGeneral',
      },
      {
        path: '/wto/CommentSpecialist',
        component: './WTO/Main/CommentSpecialist.tsx',
        name: 'CommentSpecialist',
      },
      {
        path: '/wto/CommentOfficial',
        component: './WTO/Main/CommentOfficial.tsx',
        name: 'CommentOfficial',
      },

      {
        path: '/wto/WarnListPage',
        component: './WTO/Main/WarnListPage.tsx',
        name: 'WTOWarnListPage',
      },
      {
        path: '/wto/PeriodicalListPage',
        component: './WTO/Main/PeriodicalListPage.tsx',
        name: 'PeriodicalListPage',
      },

      {
        path: '/wto/NotificationListPage',
        component: './WTO/Main/NotificationListPage.tsx',
        name: 'NotificationListPage',
      },
      {
        path: '/wto/TechnologyLawStatisticsPage',
        component: './WTO/Main/TechnologyLawStatisticsPage.tsx',
        name: 'TechnologyLawStatisticsPage',
      },

      {
        path: '/wto/TechnologyLawListPage',
        component: './WTO/Main/TechnologyLawListPage.tsx',
        name: 'TechnologyLawListPage',
      },

      {
        path: '/wto/RepositoryListPage',
        component: './WTO/Main/RepositoryListPage.tsx',
        name: 'RepositoryListPage',
      },
      {
        path: '/wto/ResearchResultListPage',
        component: './WTO/Main/ResearchResultListPage.tsx',
        name: 'ResearchResultListPage',
      },
      {
        path: '/wto/TrainingInformationListPage',
        component: './WTO/Main/TrainingInformationListPage.tsx',
        name: 'TrainingInformationListPage',
      },
      {
        path: '/wto/TrainingInformationDetail/:id',
        component: './WTO/Main/TrainingInformationDetail.tsx',
        name: 'TrainingInformationDetail',
      },
      {
        path: '/wto/TechnologyTradeListPage',
        component: './WTO/Main/TechnologyTradeListPage.tsx',
        name: 'TechnologyTradeListPage',
      },
      {
        path: '/wto/TechnologyTradeDetailPage/:id',
        component: './WTO/Main/TechnologyTradeDetailPage.tsx',
        name: 'TechnologyTradeDetailPage',
      },

      {
        path: '/wto/UpToStandardListPage',
        component: './WTO/Main/UpToStandardListPage.tsx',
        name: 'UpToStandardListPage',
      },
      {
        path: './LeaveMessageListPage',
        component: './WTO/Main/LeaveMessageListPage.tsx',
        name: 'LeaveMessageListPage',
      },
      /************* wto end ***************/
      /************* dpac ***************/
      {
        path: '/dpac',
        component: './DPAC/Index.tsx',
        name: 'DPAC',
      },
      //关于我们
      {
        path: '/dpac/AboutUs',
        component: './DPAC/AboutUs.tsx',
        name: 'AboutUs',
      },
      //更多
      {
        path: '/dpac/ArticleListPage/:type?',
        component: './DPAC/ArticleListPage.tsx',
        name: 'DPACArticleListPage',
      },
      //详情
      {
        path: '/dpac/ArticleInfo/:id?',
        component: './DPAC/ArticleInfo.tsx',
        name: 'DPACArticleInfo',
      },

      {
        path: '/dpac/submit/',
        component: './DPAC/submit/SubmitBasicLayout.tsx',
        routes: [
          {
            path: '/dpac/submit/CompanyRecord',
            component: './DPAC/submit/CompanyRecord.tsx',
            name: 'CompanyRecord',
          },
          {
            path: '/dpac/submit/ExpertDatabaseEdit',
            component: './DPAC/submit/ExpertDatabaseEdit.tsx',
            name: 'ExpertDatabaseEdit',
          },
          {
            path: '/dpac/submit/ProductSelectType',
            component: './DPAC/submit/ProductSelectType.tsx',
            name: 'ProductSelectType',
          },
          {
            path: '/dpac/submit/ProductByCustomer',
            component: './DPAC/submit/ProductByCustomer.tsx',
            name: 'ProductByCustomer',
          },

          {
            path: '/dpac/submit/ProductByCar',
            component: './DPAC/submit/ProductByCar.tsx',
            name: 'ProductByCar',
          },
          {
            path: '/dpac/submit/CarThreeSelectType',
            component: './DPAC/submit/CarThreeSelectType.tsx',
            name: 'CarThreeSelectType',
          },
          {
            path: '/dpac/submit/CarThreeConsumerEdit',
            component: './DPAC/submit/CarThreeConsumerEdit.tsx',
            name: 'CarThreeConsumerEdit',
          },

          {
            path: '/dpac/submit/CarThreeCompanyEdit',
            component: './DPAC/submit/CarThreeCompanyEdit.tsx',
            name: 'CarThreeCompanyEdit',
          },
          {
            path: '/dpac/submit/PointCheckEdit',
            component: './DPAC/submit/PointCheckEdit.tsx',
            name: 'PointCheckEdit',
          },
        ]
      },

      /************* dpac end ***************/

      /** 数字标准馆 */
      {
        path: '/DigitStandardLibrary',
        name: 'DigitStandardLibrary',
        component: './DigitStandardLibrary/index.tsx',
      },
      {
        path: '/DigitStandardLibrary/ResultList/:key?',
        name: 'ResultList',
        component: './DigitStandardLibrary/ResultList.tsx'
      },
      {
        path: '/DigitStandardLibrary/ResultDetail/:id?',
        name: 'StandardDetail',
        component: './DigitStandardLibrary/StandardDetail.tsx'
      },
      {
        path: '/DigitStandardLibrary/searchNew/',
        component: './DigitStandardLibrary/SeachNew/SeachNewBasicLayout.tsx',
        routes: [
          {
            path: '/DigitStandardLibrary/searchNew/EnterpriseSearchList',
            name: 'EnterpriseSearchList',
            component: './DigitStandardLibrary/SeachNew/EnterpriseSearchList.tsx'
          },
          {
            path: '/DigitStandardLibrary/searchNew/MemberSearchList',
            name: 'MemberSearchList',
            component: './DigitStandardLibrary/SeachNew/MemberSearchList.tsx'
          },
          {
            path: '/DigitStandardLibrary/searchNew/EnterpriseEdit',
            name: 'EnterpriseEdit',
            component: './DigitStandardLibrary/SeachNew/EnterpriseEdit.tsx'
          },
          {
            path: '/DigitStandardLibrary/searchNew/EnterpriseDetail/:key',
            name: 'EnterpriseDetail',
            component: './DigitStandardLibrary/SeachNew/EnterpriseDetail.tsx'
          },
          {
            path: '/DigitStandardLibrary/searchNew/MemberDetail',
            name: 'MemberDetail',
            component: './DigitStandardLibrary/SeachNew/MemberDetail.tsx'
          },
          {
            path: '/DigitStandardLibrary/searchNew/ModifyInfomation/:id?',
            name: 'ModifyInfomation',
            component: './DigitStandardLibrary/SeachNew/ModifyInfomation.tsx'
          },
        ]
      },
      
      /** 数字标准馆 */

      /************* 检验检测 ***************/
      {
        path: '/Verify',
        component: './Verify/VerifyIndex.tsx',
        name: 'Verify',
      },
      {
        path: '/Verify/InstitutionRepository',
        component: './Verify/InstitutionRepository/InstitutionRepository.tsx',
        name: 'InstitutionRepository',
      },
      {
        path: '/Verify/InstitutionRepository/:divide',
        component: './Verify/InstitutionRepository/InstitutionRepository.tsx',
        name: 'InstitutionRepository',
      },
      {
        path: '/Verify/InstitutionRepository/Organization/:id?',
        component: './Verify/InstitutionRepository/DepartInfo.tsx',
        name: 'InstitutionRepositoryOrganization',
      },
      {
        path: '/Verify/InstitutionRepository/Capability/:id?',
        component: './Verify/InstitutionRepository/DepartmentAbilityFormListDetail.tsx',
        name: 'InstitutionRepositoryCapability',
      },
      {
        path: '/Verify/InstitutionRepository/:org/:pre/:pra',
        component: './Verify/InstitutionRepository/InstitutionRepository.tsx',
        name: 'InstitutionRepository',
      },
      {
        path: '/Verify/InstitutionRepository/:org/:pre',
        component: './Verify/InstitutionRepository/InstitutionRepository.tsx',
        name: 'InstitutionRepository',
      },
      {
        path: './Verify/StandardInfoService',
        component: './Verify/StandardInfoService/index.tsx',
        name: 'StandardInfoService'
      },
      {
        path: './Verify/OrgBid',
        component: './Verify/OrgBid/OrgBid.tsx',
        name: 'OrgBid'
      },
      {
        path: '/Verify/ArticleInfo/:id?',
        component: './Verify/ArticleInfo.tsx',
        name: 'VerifyArticleInfo',
      },
      {
        path: '/Verify/ArticleListPage/:type?',
        component: './Verify/ArticleListPage.tsx',
        name: 'ArticleListPage',
      },
      {
        path: '/Verify/UserBackStage',
        component: './Verify/UserBackStage/UserBackStage.tsx',
        routes: [
          {
            path: '/Verify/UserBackStage',
            redirect: '/Verify/UserBackStage/BaseInfo',
          },
          {
            path: '/Verify/UserBackStage/BaseInfo',
            component: './Verify/UserBackStage/BaseInfo.tsx',
          },
          {
            path: '/Verify/UserBackStage/BaseInfoLogList/BaseInfoDetail/:id?',
            component: './Verify/UserBackStage/BaseInfoDetail.tsx',
          },
          {
            path: '/Verify/UserBackStage/InformationList',
            component: './Verify/UserBackStage/InformationList.tsx',
          },
          {
            path: '/Verify/UserBackStage/InformationList/InformationEdit/:id?',
            component: './Verify/UserBackStage/InformationEdit.tsx',
          },
          {
            path: '/Verify/UserBackStage/AuthorizerList',
            component: './Verify/UserBackStage/AuthorizerList.tsx',
          },
          {
            path: '/Verify/UserBackStage/AuthorizerList/AuthorizerEdit/:id?',
            component: './Verify/UserBackStage/AuthorizerEdit.tsx',
          },
          {
            path: '/Verify/UserBackStage/AuthorizerList/AuthorizerDetail/:id?',
            component: './Verify/UserBackStage/AuthorizedDetail.tsx'
          },
          {
            path: '/Verify/UserBackStage/AuthorizerLogList/AuthorizerLogDetailList/:id?',
            component: './Verify/UserBackStage/AuthorizerLogDetail.tsx'
          },
          {
            path: '/Verify/UserBackStage/CerAndCapabilityList',
            component: './Verify/UserBackStage/CerAndCapabilityList.tsx',
          },
          {
            path: '/Verify/UserBackStage/CerAndCapabilityList/CerAndCapabilityEdit/:id?',
            component: './Verify/UserBackStage/CerAndCapabilityEdit.tsx',
          },
          {
            path: '/Verify/UserBackStage/CerAndCapabilityList/CerAndCapabilityExtension/:id?',
            component: './Verify/UserBackStage/CerAndCapabilityExtension.tsx',
          },
          {
            path: '/Verify/UserBackStage/CerAndCapabilityList/MaintenanceCapabilityList/:id?',
            component: './Verify/UserBackStage/MaintenanceCapabilityList.tsx',
          },
          {
            path: '/Verify/UserBackStage/EquipmentList',
            component: './Verify/UserBackStage/EquipmentList.tsx',
          },
          {
            path: '/Verify/UserBackStage/EquipmentList/EquipmentLogDetailList/:id?',
            component: './Verify/UserBackStage/EquipmentLogDetailList.tsx',
          },
          {
            path: '/Verify/UserBackStage/EquipmentList/EquipmentEdit/:id?',
            component: './Verify/UserBackStage/EquipmentEdit.tsx',
          },

          {
            path: '/Verify/UserBackStage/MemberList',
            component: './Verify/UserBackStage/MemberList.tsx',
          },
          {
            path: '/Verify/UserBackStage/MemberList/MemberLogDetailList/:id?',
            component: './Verify/UserBackStage/MemberLogDetailList.tsx'
          },
          {
            path: '/Verify/UserBackStage/MemberList/MemberEdit/:id?',
            component: './Verify/UserBackStage/MemberEdit.tsx',
          },
          {
            path: '/Verify/UserBackStage/TechnologyConsult',
            component: './Verify/UserBackStage/TechnologyConsult.tsx',
          },
          {
            path: '/Verify/UserBackStage/AccountInfo',
            component: './Verify/UserBackStage/AccountInfo.tsx',
          },

          {
            path: '/Verify/UserBackStage/ResetPassword',
            component: './Verify/UserBackStage/ResetPassword.tsx',
          },
        ],
      },

      /************* 检验检测 end ***************/



      /**     光谷公司 */

      {
        path: '/GuangguCompany',
        component: './GuangGuCompany/Index.tsx',
        name: 'GuangGuCompany',
      },

      /**     光谷公司End */





      {
        path: '/SearchListPage/:type/:key?',
        component: './Search/SearchListPage.tsx',
      },
      {
        path: '/creditCode',
        component: './Index/Index',
        name: 'creditCode',
      },
      {
        path: '/defective',
        component: './Index/Index',
        name: 'defective',
      },
      {
        path: '/productCode',
        component: './Index/Index',
        name: 'productCode',
      },
      {
        path: '/about',
        component: './Index/Index',
        name: 'about',
      },
      {
        component: '404',
      },
    ],
  },
];
