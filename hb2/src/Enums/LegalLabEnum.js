/**
 * 法人
 */
class LegalLabEnum {

  static JuridicalLegalPerson = 1;//社团法人
  static BusinessLegalPerson = 2;//事业法人
  static EnterpriseLegalPerson = 3;//企业法人
  static Other = 4//其他

  static ALL_LIST = [
    LegalLabEnum.JuridicalLegalPerson, 
    LegalLabEnum.BusinessLegalPerson, 
    LegalLabEnum.EnterpriseLegalPerson,
    LegalLabEnum.Other
  ];

  static toString(type) {
    switch (type) {
      case LegalLabEnum.JuridicalLegalPerson:
        return '社团法人';
      case LegalLabEnum.BusinessLegalPerson:
        return '事业法人';
      case LegalLabEnum.EnterpriseLegalPerson:
        return '企业法人';
      case LegalLabEnum.Other: 
        return '其他'
      default:
        return '';
    }
  }
}

export default LegalLabEnum;