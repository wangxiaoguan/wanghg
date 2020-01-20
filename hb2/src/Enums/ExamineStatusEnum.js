class ExamineStatusEnum {

  static UNSUBMIT = '0';  //未审核
  static PASS = '1';      //审核通过
  static REFUSE = '-1';   //审核失败

  static ALL_LIST = [ExamineStatusEnum.UNSUBMIT, ExamineStatusEnum.PASS, ExamineStatusEnum.REFUSE];

  static toString(value) {
    if (!value) {
      return '未知';
    }
    switch (value.toString()) {
      case ExamineStatusEnum.UNSUBMIT:
        return '未审核';
      case ExamineStatusEnum.PASS:
        return '审核通过';
      case ExamineStatusEnum.REFUSE:
        return '审核失败';
      default:
        return '未知';
    }
  }
}

export default ExamineStatusEnum;
