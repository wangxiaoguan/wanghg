

class LagalLabEnum {

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

  static ALL_LIST = [LagalLabEnum.ASSO, LagalLabEnum.CAUSE, LagalLabEnum.ENTERPRISE, LagalLabEnum.OTHER];

  static toString(value) {
    switch (value) {
      case LagalLabEnum.ASSO:
        return '社团法人';
      case LagalLabEnum.CAUSE:
        return '事业法人';
      case LagalLabEnum.ENTERPRISE:
        return '企业法人';
      case LagalLabEnum.OTHER:
        return '其他'
      default:
        return ''
    }
  }
}

export default LagalLabEnum;