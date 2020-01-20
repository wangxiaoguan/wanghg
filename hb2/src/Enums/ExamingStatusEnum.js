class ExamingStatusEnum {
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

  static DRAFT = '4';

  static ALL_LIST = [ExamingStatusEnum.WAIT, ExamingStatusEnum.PASS, ExamingStatusEnum.REFUSE,ExamingStatusEnum.DRAFT];

  static toString(value) {
    if (!value) {
      return '未知';
    }
    switch (value.toString()) {
      case ExamingStatusEnum.WAIT:
        return '审核中';
      case ExamingStatusEnum.PASS:
        return '审核通过';
      case ExamingStatusEnum.REFUSE:
        return '审核不通过';
      case ExamingStatusEnum.UNSUBMIT:
        return '未审核';
      case ExamingStatusEnum.DRAFT:
        return '草稿';
      default:
        return '未知';
    }
  }
}

export default ExamingStatusEnum;
