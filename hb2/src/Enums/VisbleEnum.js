class VisbleEnum {
  static HIDDEN = '1';

  static VISBLE = '0';

  static ALL_LIST = [VisbleEnum.HIDDEN, VisbleEnum.VISBLE];

  static toString(type) {
    switch (type) {
      case VisbleEnum.HIDDEN:
        return '显示';
      case VisbleEnum.VISBLE:
        return '隐藏';
      default:
        return '未知';
    }
  }
}

export default VisbleEnum;