/**
 * 检查情况
 */
class CheckCaseEnum {

  static SATISFIED = 1;
  static DISSATISFIED = 2;
  static QUALIFIED = 3;
  static UNQUALIFIED = 4;

  static ALL_LIST = [CheckCaseEnum.SATISFIED, CheckCaseEnum.DISSATISFIED, CheckCaseEnum.QUALIFIED, CheckCaseEnum.UNQUALIFIED];

  static toString(type) {
    switch (type) {
      case CheckCaseEnum.SATISFIED:
        return '满意';
      case CheckCaseEnum.DISSATISFIED:
        return '不满意';
      case CheckCaseEnum.QUALIFIED:
        return '合格';
      case CheckCaseEnum.UNQUALIFIED:
        return '不合格';
      default:
        return '';
    }
  }
}

export default CheckCaseEnum;