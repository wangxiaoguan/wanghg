
class ProblemEnum {

  static ONE = 1;
  static TWO = 2;
  static THREE = 3;
  static FOUR = 4;
  static FIVE = 5;


  static ALL_LIST = [ProblemEnum.ONE, ProblemEnum.TWO, ProblemEnum.THREE, ProblemEnum.FOUR, ProblemEnum.FIVE];

  static toString(type) {
    switch (type) {
      case ProblemEnum.ONE:
        return '错码';
      case ProblemEnum.TWO:
        return '一码多赋';
      case ProblemEnum.THREE:
        return '重复赋码';
      case ProblemEnum.FOUR:
        return '码段问题';
      case ProblemEnum.FIVE:
        return '回传信息质量问题';
      default:
        return '';
    }
  }
}

export default ProblemEnum;