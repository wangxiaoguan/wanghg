class ProfessionLevelStatusEnum {

  static SENIOR = '1';        //正高级
  static SUBSENIOR = '2';     //副高级
  static MIDDLE = '3';        //中级
  static ASSISTANT = '4';     //初(助理)级
  static ELEMENTARY = '5';    //初(员级)级

  static ALL = [ProfessionLevelStatusEnum.SENIOR,ProfessionLevelStatusEnum.SUBSENIOR, ProfessionLevelStatusEnum.MIDDLE, ProfessionLevelStatusEnum.ASSISTANT, ProfessionLevelStatusEnum.ELEMENTARY];

  static toString(value) {
    if (!value) {
      return '未知';
    }
    switch (value.toString()) {
      case ProfessionLevelStatusEnum.SENIOR:
        return '正高级';
      case ProfessionLevelStatusEnum.SUBSENIOR:
        return '副高级';
      case ProfessionLevelStatusEnum.MIDDLE:
        return '中级';
      case ProfessionLevelStatusEnum.ASSISTANT:
        return '初(助理)级';
      case ProfessionLevelStatusEnum.ELEMENTARY:
        return '初(员级)级';
      default:
        return '其他';
    }
  }
}

export default ProfessionLevelStatusEnum;
