export default class PublishStatusEnum {
  static PUBLISHED = '1';

  static UNPUBLISH = '0';

  static ALL_LIST = [PublishStatusEnum.UNPUBLISH, PublishStatusEnum.PUBLISHED];

  static toString(type) {
    switch (type) {
      case PublishStatusEnum.PUBLISHED:
        return '已发布';
      default:
        return '未发布';
    }
  }
}