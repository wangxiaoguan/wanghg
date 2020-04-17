export default class MajorAreaEnum {

  static ONE = '1';
  static TWO = '2';
  static THREE = '3';
  static FOUR = '4';
  static FIVE = '5';

  static ALL_LIST = [MajorAreaEnum.ONE, MajorAreaEnum.TWO, MajorAreaEnum.THREE, MajorAreaEnum.FOUR, MajorAreaEnum.FIVE];

  static toString(type) {
    switch (type) {
      case MajorAreaEnum.ONE:
        return '评审领域1';
      case MajorAreaEnum.TWO:
        return '评审领域2';
      case MajorAreaEnum.THREE:
        return '评审领域3';
      case MajorAreaEnum.FOUR:
        return '评审领域4';
      case MajorAreaEnum.FIVE:
        return '评审领域5';
      default:
        return '';
    }

  }
}