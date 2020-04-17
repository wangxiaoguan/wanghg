

class CheckCommentEnum {

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
  static REFUSE = '2';

  static ALL_LIST = [CheckCommentEnum.WAIT, CheckCommentEnum.PASS,CheckCommentEnum.REFUSE];

  static toString(value) {
    if (!value) {
      return '未知'
    }
    switch (value.toString()) {
      case CheckCommentEnum.WAIT:
        return '未审核';
      case CheckCommentEnum.PASS:
        return '审核成功';
      case CheckCommentEnum.REFUSE:
        return '审核失败';
      default:
        return '未知'
    }
  }
}

export default CheckCommentEnum;