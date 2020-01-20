/**
 * 业务类型枚举
 */
class BusinessTypeEnum {
  static NEW = '0';

  static UPDATE = '1';

  static ALL_LIST = [BusinessTypeEnum.NEW, BusinessTypeEnum.UPDATE];

  static toString(value) {
    switch (value) {
      case BusinessTypeEnum.NEW:
        return '新增';
      case BusinessTypeEnum.UPDATE:
        return '修改';
      default:
        return '';
    }
  }
}

export default BusinessTypeEnum;