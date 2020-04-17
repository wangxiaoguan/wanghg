

class LabBelongToEnum {

  /**
   * 社团法人
   */
  static ASSO = '1';

  /**
   * 事业法人
   */
  static CAUSE = '2';

  /**
   * 企业法人
   */
  static ENTERPRISE = '3';

  /**
   * 其他
   */
  static OTHER = '4';

  static ALL_LIST = [LabBelongToEnum.ASSO, LabBelongToEnum.CAUSE, LabBelongToEnum.ENTERPRISE, LabBelongToEnum.OTHER];

  static toString(value) {
    switch (value) {
      case LabBelongToEnum.ASSO:
        return '社团法人';
      case LabBelongToEnum.CAUSE:
        return '事业法人';
      case LabBelongToEnum.ENTERPRISE:
        return '企业法人';
      case LabBelongToEnum.OTHER:
        return '其他'
      default:
        return ''
    }
  }
}

export default LabBelongToEnum;