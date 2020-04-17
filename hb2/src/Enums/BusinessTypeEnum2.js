/**
 * 业务类型枚举
 */
class BusinessTypeEnum2 {
  static NEW = '1';

  static UPDATE = '2';

  static DELETE = '3';

  static CHANGE = '4';

  static ALL_LIST = [BusinessTypeEnum2.NEW, BusinessTypeEnum2.UPDATE,
  BusinessTypeEnum2.DELETE, BusinessTypeEnum2.CHANGE];

  static toString(value) {
    switch (value) {
      case BusinessTypeEnum2.NEW:
        return '新增';
      case BusinessTypeEnum2.UPDATE:
        return '修改';
      case BusinessTypeEnum2.DELETE:
        return '删除';
      case BusinessTypeEnum2.CHANGE:
        return '变更';
      default:
        return '';
    }
  }
}

export default BusinessTypeEnum2;