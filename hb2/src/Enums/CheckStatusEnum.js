

class CheckStatusEnum {

  /**
   * 审核中=>正常运行
   */
  static WAIT = '0';

  /**
   * 审核通过=>注销
   */
  static PASS = '1';

  /**
   * 审核不通过=>删除
   */
  // static REFUSE = '2';

  /**
   * 未提交审核
   */
  static UNSUBMIT = '3';

  static ALL_LIST = [CheckStatusEnum.WAIT, CheckStatusEnum.PASS];

  static toString(value) {
    if (!value) {
      return '未知'
    }
    switch (value.toString()) {
      case CheckStatusEnum.WAIT:
        return '正常运行';
      case CheckStatusEnum.PASS:
        return '注销';
      // case CheckStatusEnum.REFUSE:
      //   return '删除';
      case CheckStatusEnum.UNSUBMIT:
        return '未提交';
      default:
        return '未知'
    }
  }
}

export default CheckStatusEnum;