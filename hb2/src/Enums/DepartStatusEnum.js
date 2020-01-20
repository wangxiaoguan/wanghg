

class DepartStatusEnum {

  /**
   * 正常运行
   */
  static NORMAL = '1';

  /**
   * 注销
   */
  static CANCELLATION = '2';

  /**
   * 删除
   */
  static DELET = '3';

  static ALL_LIST = [DepartStatusEnum.NORMAL, DepartStatusEnum.CANCELLATION, DepartStatusEnum.DELET];

  static toString(value) {
    switch (value) {
      case DepartStatusEnum.NORMAL:
        return '正常';
      case DepartStatusEnum.CANCELLATION:
        return '注销';
      case DepartStatusEnum.DELET:
        return '撤销';
      default:
        return '未知'
    }
  }
}

export default DepartStatusEnum;