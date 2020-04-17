/**
 * 标准状态
 */
class StandardStatusEnum {

  static NORMAL = 1;
  static SUSPEND = 2;
  static DISCARD = 3;

  static ALL_LIST = [StandardStatusEnum.NORMAL, StandardStatusEnum.SUSPEND, StandardStatusEnum.DISCARD];

  static toString(type) {
    switch (type) {
      case StandardStatusEnum.NORMAL:
        return '正常';
      case StandardStatusEnum.SUSPEND:
        return '暂停';
      case StandardStatusEnum.DISCARD:
        return '作废';
      default:
        return '';
    }
  }
}

export default StandardStatusEnum;