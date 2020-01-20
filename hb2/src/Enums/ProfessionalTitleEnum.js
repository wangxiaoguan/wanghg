/**
 * 职称枚举
 */
class ProfessionalTitleEnum {

  static JuniorEngineer = '1';

  static IntermediateEngineer = '2';

  static SeniorEngineer = '3';

  static NoTitle = '4'

  static ALL_LIST = [
    ProfessionalTitleEnum.JuniorEngineer,
    ProfessionalTitleEnum.IntermediateEngineer,
    ProfessionalTitleEnum.SeniorEngineer,
    ProfessionalTitleEnum.NoTitle
  ];

  static toString(type) {
    switch (type) {
      case ProfessionalTitleEnum.JuniorEngineer:
        return '初级工程师';
      case ProfessionalTitleEnum.IntermediateEngineer:
        return '中级工程师';
      case ProfessionalTitleEnum.SeniorEngineer:
        return '高级工程师';
      case ProfessionalTitleEnum.NoTitle:
        return '无职称';
      default:
        return '未知';
    }
  }
}

export default ProfessionalTitleEnum;