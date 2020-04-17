/**
 * 法规在线需求订购-回复状态枚举
 */
class OnlineLawsOrderReplyStatus {
  /**
   * 新建
   */
  static NEW = '0';

  /**
   * 已提交
   */
  static SUBMITTED = '1';

  static ALL_LIST = [OnlineLawsOrderReplyStatus.NEW, OnlineLawsOrderReplyStatus.SUBMITTED];

  static toString(value) {
    switch (value) {
      case OnlineLawsOrderReplyStatus.NEW:
        return '新建';
      case OnlineLawsOrderReplyStatus.SUBMITTED:
        return '已提交';
      default:
        return '未知';
    }
  }
}

export default OnlineLawsOrderReplyStatus;