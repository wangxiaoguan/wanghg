/**
 * 统计分析类型
 * dynamicNews: '1',//动态新闻
 * recallNotice: '2',//召回公告
 * consumeWarning: '3',//消费预警
 * knowledgePublicize: '4',//知识宣贯
 * lawsAndRegulations: '5',//法律法规
 */

class UnitPropertyEnum {
  // 后台返回的是number类型
  static ONE = '1'
  static TWO = '2'
  static THREE = '3';
  static FOUR = '4';
  static FIVE = '5';

  static ALL_TYPES = [
    UnitPropertyEnum.ONE,
    UnitPropertyEnum.TWO,
    UnitPropertyEnum.THREE,
    UnitPropertyEnum.FOUR,
    UnitPropertyEnum.FIVE,
  ];

  static toString(type) {
    switch (type) {
      case UnitPropertyEnum.ONE:
        return '科研院所';
      case UnitPropertyEnum.TWO:
        return '高等院校';
      case UnitPropertyEnum.THREE:
        return '企业';
      case UnitPropertyEnum.FOUR:
        return '政府机构';
      case UnitPropertyEnum.FIVE:
        return '其它';
      default:
        return '未知';
    }
  }
}

export default UnitPropertyEnum;