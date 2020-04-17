export default class AdvertEnum {

  /**
   * 资讯类广告
   */
  static NEWS_AD = '1';

  /**
   * 自定义链接的广告
   */
  static URL_AD = '2';

  static dicStr = {
    '1': '自有资讯',
    '2': '自定义链接',
  };

  static toString(type) {
    return AdvertEnum.dicStr[type.toString()] || '未知';
  }
}