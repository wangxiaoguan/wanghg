class AptitudeEnum {

  static ONE = '1';
  static TWO = '2';

  static ALL_LIST = [AptitudeEnum.ONE, AptitudeEnum.TWO];

  static toString(type) {
    switch (type) {
      case AptitudeEnum.ONE:
        return 'CMA计量认证';
      case AptitudeEnum.TWO:
        return 'CNAS国家认证认可证书';
      default:
        return '';
    }
  }
}

export default AptitudeEnum;