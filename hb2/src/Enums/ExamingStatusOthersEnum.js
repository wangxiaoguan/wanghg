class ExamingStatusOthersEnum {
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

  /**
   * 未提交审核
   */
  static UNSUBMIT = '3';

  // static DRAFT = '4';

  static ALL_LIST = [ExamingStatusOthersEnum.WAIT, ExamingStatusOthersEnum.PASS, ExamingStatusOthersEnum.REFUSE, ExamingStatusOthersEnum.UNSUBMIT];

  static toString(value) {
    if (!value) {
      return '未知';
    }
    switch (value.toString()) {
      case ExamingStatusOthersEnum.WAIT:
        return '审核中';
      case ExamingStatusOthersEnum.PASS:
        return '审核通过';
      case ExamingStatusOthersEnum.REFUSE:
        return '审核不通过';
      case ExamingStatusOthersEnum.UNSUBMIT:
        return '未审核';
      // case ExamingStatusOthersEnum.DRAFT:
      //   return '草稿';
      default:
        return '未知';
    }
  }
}

export default ExamingStatusOthersEnum;
