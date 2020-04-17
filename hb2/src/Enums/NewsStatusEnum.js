export default class NewsStatusEnum {
  /**
   * 正在审核
   */
  static CHECKING = '0';

  /**
   * 审核通过
   */
  static CHECKED = '1';

  /**
   * 审核未通过
   */
  static UNCHECKED = '-1';

  static toString(type) {
    switch (type) {
      case NewsStatusEnum.CHECKED:
        return '通过';
      case NewsStatusEnum.CHECKING:
        return '审核中';
      case NewsStatusEnum.UNCHECKED:
        return '未通过';
      default:
        return '';
    }

  }
}