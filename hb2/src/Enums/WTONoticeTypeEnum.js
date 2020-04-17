/**
 * WTO通报类型
 */
class WTONoticeTypeEnum {

  static TBT = 'TBT';

  static SPS = 'SPS';

  static ALL_LIST = [WTONoticeTypeEnum.TBT, WTONoticeTypeEnum.SPS];

  static toString(value) {
    switch (value) {
      case WTONoticeTypeEnum.TBT:
        return 'TBT';
      case WTONoticeTypeEnum.SPS:
        return 'SPS';
      default:
        return '未知';
    }
  }
}

export default WTONoticeTypeEnum;