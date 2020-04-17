
class RiskLevelEnum {

  static ONE = 1;
  static TWO = 2;
  static THREE = 3;

  static ALL_LIST = [RiskLevelEnum.ONE, RiskLevelEnum.TWO, RiskLevelEnum.THREE];

  static toString(type) {
    switch (type) {
      case RiskLevelEnum.ONE:
        return '高';
      case RiskLevelEnum.TWO:
        return '中';
      case RiskLevelEnum.THREE:
        return '低';
      default:
        return '';
    }
  }
}

export default RiskLevelEnum;