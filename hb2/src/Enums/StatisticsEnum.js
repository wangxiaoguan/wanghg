/**
 * 证书状态
 */
class StatisticsEnum {

  static EXPORTS = '1';
  static ENTERPRISES = '2';
  static CAR_THREE_GUARANTEES = '3';
  static CHECK_INFO_REGISTRYS = '4';
  static REPORTS = '5';
  static FEELER_MECHANISMS = '6';

  static ALL_STATUS = [StatisticsEnum.EXPORTS, StatisticsEnum.ENTERPRISES, StatisticsEnum.CAR_THREE_GUARANTEES,
  StatisticsEnum.CHECK_INFO_REGISTRYS, StatisticsEnum.REPORTS, StatisticsEnum.FEELER_MECHANISMS];

  static toString(type) {
    switch (type) {
      case StatisticsEnum.EXPORTS:
        return '专家数';
      case StatisticsEnum.ENTERPRISES:
        return '企业数';
      case StatisticsEnum.CAR_THREE_GUARANTEES:
        return '汽车三包数据';
      case StatisticsEnum.CHECK_INFO_REGISTRYS:
        return '你点我检数据';
      case StatisticsEnum.REPORTS:
        return '缺陷产品数据';
      case StatisticsEnum.FEELER_MECHANISMS:
        return '检测机构数据';
      default:
        return '未知';
    }
  }
}

export default StatisticsEnum;