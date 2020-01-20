/**
 * 是否黑名单
 */
class LinkEnum {

  static QUALITY = '1';
  static DEFECT = '2';
  static RELATED = '3';
  static ABROAD = '4';

  static ALL_LIST = [LinkEnum.QUALITY, LinkEnum.DEFECT, LinkEnum.RELATED,LinkEnum.ABROAD];

  static toString(type) {
    switch (type) {
      case LinkEnum.QUALITY:
        return '市场监督管理网站';
      case LinkEnum.DEFECT:
        return '缺陷召回网站';
      case LinkEnum.RELATED:
        return '国内相关网站';
      case LinkEnum.ABROAD:
        return '国外相关网站';
      default:
        return '';
    }
  }
}

export default LinkEnum;