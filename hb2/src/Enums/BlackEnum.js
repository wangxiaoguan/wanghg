/**
 * 是否黑名单
 */
class BlackEnum {

  static HAS = '1';
  static NONE = '0';

  static ALL_LIST = [BlackEnum.HAS, BlackEnum.NONE];

  static toString(type) {
    switch (type) {
      case BlackEnum.HAS:
        return '是';
      case BlackEnum.NONE:
        return '否';
      default:
        return '';
    }
  }
}

export default BlackEnum;