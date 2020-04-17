class NewsTypeEnum {
  static HOME_NEWS = '1';

  static WORLD_NEWS = '2';

  static ALL_LIST = [NewsTypeEnum.HOME_NEWS, NewsTypeEnum.WORLD_NEWS];

  static toString(value) {
    switch (value) {
      case NewsTypeEnum.HOME_NEWS:
        return '国内新闻';
      case NewsTypeEnum.WORLD_NEWS:
        return '国际新闻';
      default:
        return '未知';
    }
  }
}

export default NewsTypeEnum;