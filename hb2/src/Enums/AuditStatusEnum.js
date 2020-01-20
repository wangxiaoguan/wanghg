export default class AuditStatusEnum {
  /**
   * 待审核
   */
  static CHECKING = '0';

  /**
   * 审核通过
   */
  static CHECKED = '1';

  /**
   * 审核失败
   */
  static UNCHECKED = '-1';
  static ALL_LIST = [
    AuditStatusEnum.CHECKING, AuditStatusEnum.CHECKED, AuditStatusEnum.UNCHECKED,
  ];


  static toString(type) {
    switch (type) {
      case AuditStatusEnum.CHECKED:
        return '通过';
      case AuditStatusEnum.CHECKING:
        return '审核中';
      case AuditStatusEnum.UNCHECKED:
        return '未通过';
      default:
        return '';
    }

  }
}
