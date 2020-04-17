
class SamplingTypeEnum {

  static ONE = 1;
  static TWO = 2;
  static THREE = 3;

  static ALL_LIST = [SamplingTypeEnum.ONE, SamplingTypeEnum.TWO, SamplingTypeEnum.THREE];

  static toString(type) {
    switch (type) {
      case SamplingTypeEnum.ONE:
        return '类型1';
      case SamplingTypeEnum.TWO:
        return '类型2';
      case SamplingTypeEnum.THREE:
        return '类型3';
      default:
        return '';
    }
  }
}

export default SamplingTypeEnum;