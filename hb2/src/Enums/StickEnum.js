class StickEnum {
  static STICK = 1;

  static NONE_STICK = 0;

  static ALL_LIST = [StickEnum.STICK, StickEnum.NONE_STICK];

  static toString(type) {
    switch (type) {
      case StickEnum.STICK:
        return '置顶';
      case StickEnum.NONE_STICK:
        return '非置顶';
      default:
        return '未知';
    }
  }
}

export default StickEnum;