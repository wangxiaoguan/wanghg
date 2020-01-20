/**
 * 统计分析类型
 * dynamicNews: '1',//动态新闻
 * recallNotice: '2',//召回公告
 * consumeWarning: '3',//消费预警
 * knowledgePublicize: '4',//知识宣贯
 * lawsAndRegulations: '5',//法律法规
 */

class HistoryTypeEnum {
  // 后台返回的是number类型
  static ZERO = '0'
  static ONE = '1'
  static TWO = '2'
  static THREE = '3';
  static FOUR = '4';
  static FIVE = '5';

  static ALL_TYPES = [
    HistoryTypeEnum.ZERO,
    HistoryTypeEnum.ONE,
    HistoryTypeEnum.TWO,
    HistoryTypeEnum.THREE,
    // HistoryTypeEnum.FOUR,
    // HistoryTypeEnum.FIVE,
  ];

  static toString(type) {
    switch (type) {
      case HistoryTypeEnum.ZERO:
        return '检测机构历史';
      case HistoryTypeEnum.ONE:
        return '授权人历史';
      case HistoryTypeEnum.TWO:
        return '设备仪器历史';
      case HistoryTypeEnum.THREE:
        return '人员历史';
      // case HistoryTypeEnum.FOUR:
      //   return '政府机构';
      // case HistoryTypeEnum.FIVE:
      //   return '其它';
      default:
        return '未知';
    }
  }
}

export default HistoryTypeEnum;