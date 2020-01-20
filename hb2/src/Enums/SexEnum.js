class SexEnum {
  static MAIE = '1';

  static FEMAIE = '2';

  static ALL_LIST = [SexEnum.MAIE, SexEnum.FEMAIE];

  static toString(type) {
    switch (type) {
      case SexEnum.MAIE:
        return '男';
      case SexEnum.FEMAIE:
        return '女';
      default:
        return '未知';
    }
  }
}

export default SexEnum;