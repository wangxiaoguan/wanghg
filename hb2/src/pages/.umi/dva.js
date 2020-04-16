import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: 'advert', ...(require('F:/youqu/SBY2/src/models/advert.js').default) });
app.model({ namespace: 'Certificate', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/Certificate.js').default) });
app.model({ namespace: 'AuhorizedSignature', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/DepartmentCheck/AuhorizedSignature.js').default) });
app.model({ namespace: 'DepartCheckAbilityList', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/DepartmentCheck/DepartCheckAbilityList.js').default) });
app.model({ namespace: 'DepartCheckCertificateList', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/DepartmentCheck/DepartCheckCertificateList.js').default) });
app.model({ namespace: 'DepartCheckInstrument', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/DepartmentCheck/DepartCheckInstrument.js').default) });
app.model({ namespace: 'DepartCheckUser', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/DepartmentCheck/DepartCheckUser.js').default) });
app.model({ namespace: 'DepartDatumList', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/DepartmentCheck/DepartDatumList.js').default) });
app.model({ namespace: 'AuthorizerDetail', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/DepartmentSearch/AuthorizerDetail.js').default) });
app.model({ namespace: 'BaseInfo', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/DepartmentSearch/BaseInfo.js').default) });
app.model({ namespace: 'CertificateDetail', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/DepartmentSearch/CertificateDetail.js').default) });
app.model({ namespace: 'Department', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/DepartmentSearch/Department.js').default) });
app.model({ namespace: 'EquipmentDetail', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/DepartmentSearch/EquipmentDetail.js').default) });
app.model({ namespace: 'MemberDetail', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/DepartmentSearch/MemberDetail.js').default) });
app.model({ namespace: 'PartyManagement', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/DepartmentSearch/PartyManagement.js').default) });
app.model({ namespace: 'advert', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/InformationPublish/advert.js').default) });
app.model({ namespace: 'InfoList', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/InformationPublish/InfoList.js').default) });
app.model({ namespace: 'Judge', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/Judge.js').default) });
app.model({ namespace: 'DepartmentStatistics', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/Statistics/DepartmentStatistics.js').default) });
app.model({ namespace: 'LicenseExpire', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/System/LicenseExpire.js').default) });
app.model({ namespace: 'Member', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/System/Member.js').default) });
app.model({ namespace: 'TechnicalAdvisory', ...(require('F:/youqu/SBY2/src/models/CertificationDepartment/TechnicalAdvisory.js').default) });
app.model({ namespace: 'expertDatabase', ...(require('F:/youqu/SBY2/src/models/expertDatabase.js').default) });
app.model({ namespace: 'carThreeCompany', ...(require('F:/youqu/SBY2/src/models/faultyProduct/carThree/carThreeCompany.js').default) });
app.model({ namespace: 'carThreeConsumer', ...(require('F:/youqu/SBY2/src/models/faultyProduct/carThree/carThreeConsumer.js').default) });
app.model({ namespace: 'companyRecord', ...(require('F:/youqu/SBY2/src/models/faultyProduct/companyRecord.js').default) });
app.model({ namespace: 'advert', ...(require('F:/youqu/SBY2/src/models/faultyProduct/contents/advert.js').default) });
app.model({ namespace: 'consumptionWarning', ...(require('F:/youqu/SBY2/src/models/faultyProduct/contents/consumptionWarning.js').default) });
app.model({ namespace: 'friendLink', ...(require('F:/youqu/SBY2/src/models/faultyProduct/contents/friendLink.js').default) });
app.model({ namespace: 'introduction', ...(require('F:/youqu/SBY2/src/models/faultyProduct/contents/introduction.js').default) });
app.model({ namespace: 'knowledge', ...(require('F:/youqu/SBY2/src/models/faultyProduct/contents/knowledge.js').default) });
app.model({ namespace: 'laws', ...(require('F:/youqu/SBY2/src/models/faultyProduct/contents/laws.js').default) });
app.model({ namespace: 'news', ...(require('F:/youqu/SBY2/src/models/faultyProduct/contents/news.js').default) });
app.model({ namespace: 'recallAdvert', ...(require('F:/youqu/SBY2/src/models/faultyProduct/contents/recallAdvert.js').default) });
app.model({ namespace: 'car', ...(require('F:/youqu/SBY2/src/models/faultyProduct/defectProduct/car.js').default) });
app.model({ namespace: 'consumer', ...(require('F:/youqu/SBY2/src/models/faultyProduct/defectProduct/consumer.js').default) });
app.model({ namespace: 'downloadManager', ...(require('F:/youqu/SBY2/src/models/faultyProduct/downloadManager.js').default) });
app.model({ namespace: 'faultProduct', ...(require('F:/youqu/SBY2/src/models/faultyProduct/faultProduct.js').default) });
app.model({ namespace: 'home', ...(require('F:/youqu/SBY2/src/models/faultyProduct/home/home.js').default) });
app.model({ namespace: 'pointCheck', ...(require('F:/youqu/SBY2/src/models/faultyProduct/pointCheck.js').default) });
app.model({ namespace: 'sampleProduct', ...(require('F:/youqu/SBY2/src/models/faultyProduct/sampleProduct.js').default) });
app.model({ namespace: 'newsStatistics', ...(require('F:/youqu/SBY2/src/models/faultyProduct/statistics/newsStatistics.js').default) });
app.model({ namespace: 'article', ...(require('F:/youqu/SBY2/src/models/GeoSign/article.js').default) });
app.model({ namespace: 'category', ...(require('F:/youqu/SBY2/src/models/GeoSign/category.js').default) });
app.model({ namespace: 'expert', ...(require('F:/youqu/SBY2/src/models/GeoSign/expert.js').default) });
app.model({ namespace: 'kinds', ...(require('F:/youqu/SBY2/src/models/GeoSign/kinds.js').default) });
app.model({ namespace: 'products', ...(require('F:/youqu/SBY2/src/models/GeoSign/products.js').default) });
app.model({ namespace: 'tag', ...(require('F:/youqu/SBY2/src/models/GeoSign/tag.js').default) });
app.model({ namespace: 'train', ...(require('F:/youqu/SBY2/src/models/GeoSign/train.js').default) });
app.model({ namespace: 'global', ...(require('F:/youqu/SBY2/src/models/global.js').default) });
app.model({ namespace: 'guangguBase', ...(require('F:/youqu/SBY2/src/models/GuangguBase/guangguBase.js').default) });
app.model({ namespace: 'list', ...(require('F:/youqu/SBY2/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('F:/youqu/SBY2/src/models/login.js').default) });
app.model({ namespace: 'friendLink', ...(require('F:/youqu/SBY2/src/models/main/friendLink.js').default) });
app.model({ namespace: 'quickFunction', ...(require('F:/youqu/SBY2/src/models/main/quickFunction.js').default) });
app.model({ namespace: 'menu', ...(require('F:/youqu/SBY2/src/models/menu.js').default) });
app.model({ namespace: 'news', ...(require('F:/youqu/SBY2/src/models/news.js').default) });
app.model({ namespace: 'newsCategory', ...(require('F:/youqu/SBY2/src/models/newsCategory.js').default) });
app.model({ namespace: 'project', ...(require('F:/youqu/SBY2/src/models/project.js').default) });
app.model({ namespace: 'setting', ...(require('F:/youqu/SBY2/src/models/setting.js').default) });
app.model({ namespace: 'inquiryCodeBase', ...(require('F:/youqu/SBY2/src/models/society/dataQuery/inquiryCodeBase.js').default) });
app.model({ namespace: 'unifiedCodeBase', ...(require('F:/youqu/SBY2/src/models/society/dataQuery/unifiedCodeBase.js').default) });
app.model({ namespace: 'verificationDatabase', ...(require('F:/youqu/SBY2/src/models/society/dataQuery/verificationDatabase.js').default) });
app.model({ namespace: 'centerBack', ...(require('F:/youqu/SBY2/src/models/society/dataStatistics/centerBack.js').default) });
app.model({ namespace: 'questionStatistics', ...(require('F:/youqu/SBY2/src/models/society/dataStatistics/questionStatistics.js').default) });
app.model({ namespace: 'reportingStatistics', ...(require('F:/youqu/SBY2/src/models/society/dataStatistics/reportingStatistics.js').default) });
app.model({ namespace: 'verificationStatistics', ...(require('F:/youqu/SBY2/src/models/society/dataStatistics/verificationStatistics.js').default) });
app.model({ namespace: 'agriculture', ...(require('F:/youqu/SBY2/src/models/society/rawData/agriculture.js').default) });
app.model({ namespace: 'centralData', ...(require('F:/youqu/SBY2/src/models/society/rawData/centralData.js').default) });
app.model({ namespace: 'civilData', ...(require('F:/youqu/SBY2/src/models/society/rawData/civilData.js').default) });
app.model({ namespace: 'civilDataLocal', ...(require('F:/youqu/SBY2/src/models/society/rawData/civilDataLocal.js').default) });
app.model({ namespace: 'culturalData', ...(require('F:/youqu/SBY2/src/models/society/rawData/culturalData.js').default) });
app.model({ namespace: 'diplomaticData', ...(require('F:/youqu/SBY2/src/models/society/rawData/diplomaticData.js').default) });
app.model({ namespace: 'enterpriseData', ...(require('F:/youqu/SBY2/src/models/society/rawData/enterpriseData.js').default) });
app.model({ namespace: 'individualData', ...(require('F:/youqu/SBY2/src/models/society/rawData/individualData.js').default) });
app.model({ namespace: 'judicialData', ...(require('F:/youqu/SBY2/src/models/society/rawData/judicialData.js').default) });
app.model({ namespace: 'laborData', ...(require('F:/youqu/SBY2/src/models/society/rawData/laborData.js').default) });
app.model({ namespace: 'organs', ...(require('F:/youqu/SBY2/src/models/society/rawData/organs.js').default) });
app.model({ namespace: 'others', ...(require('F:/youqu/SBY2/src/models/society/rawData/others.js').default) });
app.model({ namespace: 'receiveStatistics', ...(require('F:/youqu/SBY2/src/models/society/rawData/receiveStatistics.js').default) });
app.model({ namespace: 'religiousData', ...(require('F:/youqu/SBY2/src/models/society/rawData/religiousData.js').default) });
app.model({ namespace: 'reportStatistics', ...(require('F:/youqu/SBY2/src/models/society/rawData/reportStatistics.js').default) });
app.model({ namespace: 'reReporting', ...(require('F:/youqu/SBY2/src/models/society/rawData/reReporting.js').default) });
app.model({ namespace: 'tourismData', ...(require('F:/youqu/SBY2/src/models/society/rawData/tourismData.js').default) });
app.model({ namespace: 'accessoryManagement', ...(require('F:/youqu/SBY2/src/models/society/systemManagement/accessoryManagement.js').default) });
app.model({ namespace: 'friendManagement', ...(require('F:/youqu/SBY2/src/models/society/systemManagement/friendManagement.js').default) });
app.model({ namespace: 'memberManagement', ...(require('F:/youqu/SBY2/src/models/society/systemManagement/memberManagement.js').default) });
app.model({ namespace: 'policyManagement', ...(require('F:/youqu/SBY2/src/models/society/systemManagement/policyManagement.js').default) });
app.model({ namespace: 'privilegeManagement', ...(require('F:/youqu/SBY2/src/models/society/systemManagement/privilegeManagement.js').default) });
app.model({ namespace: 'roleManage', ...(require('F:/youqu/SBY2/src/models/society/systemManagement/roleManage.js').default) });
app.model({ namespace: 'systemLog', ...(require('F:/youqu/SBY2/src/models/society/systemManagement/systemLog.js').default) });
app.model({ namespace: 'userManagement', ...(require('F:/youqu/SBY2/src/models/society/systemManagement/userManagement.js').default) });
app.model({ namespace: 'searchNew', ...(require('F:/youqu/SBY2/src/models/standard/searchNew.js').default) });
app.model({ namespace: 'standardUser', ...(require('F:/youqu/SBY2/src/models/standard/standardUser.js').default) });
app.model({ namespace: 'ProjectManage', ...(require('F:/youqu/SBY2/src/models/StandardDevelop/ProjectManage.js').default) });
app.model({ namespace: 'TaskManage', ...(require('F:/youqu/SBY2/src/models/StandardDevelop/TaskManage.js').default) });
app.model({ namespace: 'systemMenu', ...(require('F:/youqu/SBY2/src/models/systemMenu.js').default) });
app.model({ namespace: 'user', ...(require('F:/youqu/SBY2/src/models/user.js').default) });
app.model({ namespace: 'CountryInfo', ...(require('F:/youqu/SBY2/src/models/wto/dictionary/CountryInfo.js').default) });
app.model({ namespace: 'ExportCountry', ...(require('F:/youqu/SBY2/src/models/wto/dictionary/ExportCountry.js').default) });
app.model({ namespace: 'HSAndISCRelation', ...(require('F:/youqu/SBY2/src/models/wto/dictionary/HSAndISCRelation.js').default) });
app.model({ namespace: 'HSCode', ...(require('F:/youqu/SBY2/src/models/wto/dictionary/HSCode.js').default) });
app.model({ namespace: 'ICSCode', ...(require('F:/youqu/SBY2/src/models/wto/dictionary/ICSCode.js').default) });
app.model({ namespace: 'LawCategory', ...(require('F:/youqu/SBY2/src/models/wto/dictionary/LawCategory.js').default) });
app.model({ namespace: 'LawDepartment', ...(require('F:/youqu/SBY2/src/models/wto/dictionary/LawDepartment.js').default) });
app.model({ namespace: 'NICWithHSCode', ...(require('F:/youqu/SBY2/src/models/wto/dictionary/NICWithHSCode.js').default) });
app.model({ namespace: 'NICWithICSCode', ...(require('F:/youqu/SBY2/src/models/wto/dictionary/NICWithICSCode.js').default) });
app.model({ namespace: 'WTOLabel', ...(require('F:/youqu/SBY2/src/models/wto/dictionary/WTOLabel.js').default) });
app.model({ namespace: 'market', ...(require('F:/youqu/SBY2/src/models/wto/earlyWarning/market.js').default) });
app.model({ namespace: 'Technology', ...(require('F:/youqu/SBY2/src/models/wto/earlyWarning/Technology.js').default) });
app.model({ namespace: 'UpToStandard', ...(require('F:/youqu/SBY2/src/models/wto/earlyWarning/UpToStandard.js').default) });
app.model({ namespace: 'WarnInfo', ...(require('F:/youqu/SBY2/src/models/wto/earlyWarning/WarnInfo.js').default) });
app.model({ namespace: 'aboutUs', ...(require('F:/youqu/SBY2/src/models/wto/english/aboutUs.js').default) });
app.model({ namespace: 'businessNews', ...(require('F:/youqu/SBY2/src/models/wto/english/businessNews.js').default) });
app.model({ namespace: 'certification', ...(require('F:/youqu/SBY2/src/models/wto/english/certification.js').default) });
app.model({ namespace: 'enterpriseMessage', ...(require('F:/youqu/SBY2/src/models/wto/english/enterpriseMessage.js').default) });
app.model({ namespace: 'investigation', ...(require('F:/youqu/SBY2/src/models/wto/english/investigation.js').default) });
app.model({ namespace: 'productTypeDic', ...(require('F:/youqu/SBY2/src/models/wto/english/productTypeDic.js').default) });
app.model({ namespace: 'verfiedSuppliers', ...(require('F:/youqu/SBY2/src/models/wto/english/verfiedSuppliers.js').default) });
app.model({ namespace: 'Events', ...(require('F:/youqu/SBY2/src/models/wto/france/Events.js').default) });
app.model({ namespace: 'ExportValueOfOurProvince', ...(require('F:/youqu/SBY2/src/models/wto/Statistics/ExportValueOfOurProvince.js').default) });
app.model({ namespace: 'OperationTypeStatistics', ...(require('F:/youqu/SBY2/src/models/wto/Statistics/OperationTypeStatistics.js').default) });
app.model({ namespace: 'ProductExportDataOfOutProvince', ...(require('F:/youqu/SBY2/src/models/wto/Statistics/ProductExportDataOfOutProvince.js').default) });
app.model({ namespace: 'advert', ...(require('F:/youqu/SBY2/src/models/wto/synthesizeManage/advert.js').default) });
app.model({ namespace: 'caseLibrary', ...(require('F:/youqu/SBY2/src/models/wto/synthesizeManage/caseLibrary.js').default) });
app.model({ namespace: 'clientTraining', ...(require('F:/youqu/SBY2/src/models/wto/synthesizeManage/clientTraining.js').default) });
app.model({ namespace: 'exportBlock', ...(require('F:/youqu/SBY2/src/models/wto/synthesizeManage/exportBlock.js').default) });
app.model({ namespace: 'exportBusiness', ...(require('F:/youqu/SBY2/src/models/wto/synthesizeManage/exportBusiness.js').default) });
app.model({ namespace: 'leaveMessage', ...(require('F:/youqu/SBY2/src/models/wto/synthesizeManage/leaveMessage.js').default) });
app.model({ namespace: 'periodical', ...(require('F:/youqu/SBY2/src/models/wto/synthesizeManage/periodical.js').default) });
app.model({ namespace: 'repository', ...(require('F:/youqu/SBY2/src/models/wto/synthesizeManage/repository.js').default) });
app.model({ namespace: 'researchResult', ...(require('F:/youqu/SBY2/src/models/wto/synthesizeManage/researchResult.js').default) });
app.model({ namespace: 'servicesProject', ...(require('F:/youqu/SBY2/src/models/wto/synthesizeManage/servicesProject.js').default) });
app.model({ namespace: 'technologyTrade', ...(require('F:/youqu/SBY2/src/models/wto/synthesizeManage/technologyTrade.js').default) });
app.model({ namespace: 'technologyTradePrograma', ...(require('F:/youqu/SBY2/src/models/wto/synthesizeManage/technologyTradePrograma.js').default) });
app.model({ namespace: 'trainingInformation', ...(require('F:/youqu/SBY2/src/models/wto/synthesizeManage/trainingInformation.js').default) });
app.model({ namespace: 'userSupervise', ...(require('F:/youqu/SBY2/src/models/wto/synthesizeManage/userSupervise.js').default) });
app.model({ namespace: 'discussion', ...(require('F:/youqu/SBY2/src/models/wto/tbt/discussion.js').default) });
app.model({ namespace: 'discussionCheck', ...(require('F:/youqu/SBY2/src/models/wto/tbt/discussionCheck.js').default) });
app.model({ namespace: 'notice', ...(require('F:/youqu/SBY2/src/models/wto/tbt/notice.js').default) });
app.model({ namespace: 'NoticeDiscussionCheck', ...(require('F:/youqu/SBY2/src/models/wto/tbt/NoticeDiscussionCheck.js').default) });
app.model({ namespace: 'officialDiscussion', ...(require('F:/youqu/SBY2/src/models/wto/tbt/officialDiscussion.js').default) });
app.model({ namespace: 'OnlineCustomOrder', ...(require('F:/youqu/SBY2/src/models/wto/userOrder/OnlineCustomOrder.js').default) });
app.model({ namespace: 'OnlineLaws', ...(require('F:/youqu/SBY2/src/models/wto/userOrder/OnlineLaws.js').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
