/**
 * 统计分析类型
 * dynamicNews: '1',//动态新闻
 * recallNotice: '2',//召回公告
 * consumeWarning: '3',//消费预警
 * knowledgePublicize: '4',//知识宣贯
 * lawsAndRegulations: '5',//法律法规
 */

class StatisticsAnalysisEnum {
  // 后台返回的是number类型
  static DynamicNews = '1'
  static RecallNotice = '2'
  static ConsumeWarning = '3';
  static KnowledgePublicize = '4';
  static LawsAndRegulations = '5';

  static ALL_TYPES = [
    StatisticsAnalysisEnum.DynamicNews,
    StatisticsAnalysisEnum.RecallNotice,
    StatisticsAnalysisEnum.ConsumeWarning,
    StatisticsAnalysisEnum.KnowledgePublicize,
    StatisticsAnalysisEnum.LawsAndRegulations,
  ];

  static toString(type) {
    switch (type) {
      case StatisticsAnalysisEnum.DynamicNews:
        return '动态新闻';
      case StatisticsAnalysisEnum.RecallNotice:
        return '召回公告';
      case StatisticsAnalysisEnum.ConsumeWarning:
        return '消费预警';
      case StatisticsAnalysisEnum.KnowledgePublicize:
        return '知识宣贯';
      case StatisticsAnalysisEnum.LawsAndRegulations:
        return '法律法规';
      default:
        return '未知';
    }
  }
}

export default StatisticsAnalysisEnum;