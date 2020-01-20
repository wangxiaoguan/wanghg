/**
 * WTO通报状态枚举
 */
class WTONoticeStatusEnum {

  static NORMAL = '1';

  static ADDENDUM = '2';


  static REVISE = '3';

  static CORRIGENDUM = '4';

  static ALL_LIST = [WTONoticeStatusEnum.NORMAL, WTONoticeStatusEnum.ADDENDUM, WTONoticeStatusEnum.REVISE, WTONoticeStatusEnum.CORRIGENDUM];

  static toString(value) {
    switch (value) {
      case WTONoticeStatusEnum.NORMAL:
        return '正常';
      case WTONoticeStatusEnum.ADDENDUM:
        return '补遗';
      case WTONoticeStatusEnum.REVISE:
        return '修订';
      case WTONoticeStatusEnum.CORRIGENDUM:
        return '勘误';
      default:
        return '未知';
    }
  }
}

export default WTONoticeStatusEnum;