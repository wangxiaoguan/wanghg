/**
 * 预警等级枚举
 */
class WarnInfoLevelEnum {
  static LEVEL1 = '0';

  static LEVEL2 = '1';

  static LEVEL3 = '2'; // 7.30修改与数据库对应 预警等级(0：一般预警;1:重大预警；2：贸易关注

  static ALL_LIST = [WarnInfoLevelEnum.LEVEL1, WarnInfoLevelEnum.LEVEL2, WarnInfoLevelEnum.LEVEL3];

  static toString(value) {
    switch (value) {
      case WarnInfoLevelEnum.LEVEL1:
        return '一般预警';
      case WarnInfoLevelEnum.LEVEL2:
        return '重大预警';
      case WarnInfoLevelEnum.LEVEL3:
        return '贸易关注';
      default:
        return '未知';
    }
  }
}

export default WarnInfoLevelEnum;