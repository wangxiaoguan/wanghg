
class ZsztEnum {

  static ONE = '0';
  static TWO = '1';

  static ALL_LIST = [ZsztEnum.ONE, ZsztEnum.TWO];

  static toString(type) {
    switch (type) {
      case ZsztEnum.ONE:
        return '正常';
      case ZsztEnum.TWO:
        return '注销';
      default:
        return '未知';
    }
  }
}

export default ZsztEnum;