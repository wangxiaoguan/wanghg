class SampleTypeEnum {
  static ZERO = '0';

  static ONE = '1';

  static TWO = '2';

  static THREE = '3';

  static FOUR = '4';

  static FIVE = '5';

  static SIX = '6';

  static SEVEN = '7';

  static EIGHT = '8';

  static NINE = '9';

  static ALL_LIST = [
    SampleTypeEnum.ZERO,
    SampleTypeEnum.ONE,
    SampleTypeEnum.TWO,
    SampleTypeEnum.THREE,
    SampleTypeEnum.FOUR,
    SampleTypeEnum.FIVE,
    SampleTypeEnum.SIX,
    SampleTypeEnum.SEVEN,
    SampleTypeEnum.EIGHT,
    SampleTypeEnum.NINE,
  ];

  static toString(type) {
    switch (type) {
      case SampleTypeEnum.ZERO:
        return '文体教育用品';
      case SampleTypeEnum.ONE:
        return '家用电器及电器附件';
      case SampleTypeEnum.TWO:
        return '信息技术产品';
      case SampleTypeEnum.THREE:
        return '儿童用品';
      case SampleTypeEnum.FOUR:
        return '家具及建筑装饰装修材料';
      case SampleTypeEnum.FIVE:
        return '服装鞋帽及家用纺织品';
      case SampleTypeEnum.SIX:
        return '卫生用品';
      case SampleTypeEnum.SEVEN:
        return '交通用具及相关产品';
      case SampleTypeEnum.EIGHT:
        return '食品相关产品';
      case SampleTypeEnum.NINE:
        return '日用杂品';
      default:
        return '';
    }
  }
}

export default SampleTypeEnum;
