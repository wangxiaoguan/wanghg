
class SamplingResultEnum {

  static QUALIFIED = 1;
  static UN_QUALIFIED = 0;

  static ALL_LIST = [SamplingResultEnum.QUALIFIED, SamplingResultEnum.UN_QUALIFIED];

  static toString(type) {
    switch (type) {
      case SamplingResultEnum.QUALIFIED:
        return '合格';
      case SamplingResultEnum.UN_QUALIFIED:
        return '不合格';
      default:
        return '';
    }
  }
}

export default SamplingResultEnum;