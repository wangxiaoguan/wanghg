/**
 * 标准状态
 */
class OrgStatusEnum {

  /**
   * 正常运行
   */
  static NORMAL = 1;

  /**
   * 注销
   */
  static CANCELLATION = 2;

  /**
   * 作废
   */
  static DELET = 3;

  static ALL_LIST = [OrgStatusEnum.NORMAL, OrgStatusEnum.CANCELLATION, OrgStatusEnum.DELET];

  static toString(value) {
    switch (value) {
      case OrgStatusEnum.NORMAL:
        return '正常';
      case OrgStatusEnum.CANCELLATION:
        return '注销';
      case OrgStatusEnum.DELET:
        return '作废';
      default:
        return '未知'
    }
  }
}

export default OrgStatusEnum;