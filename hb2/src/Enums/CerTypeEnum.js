/**
 * 标准状态
 */
class CerTypeEnum {

  static CMA = 'CMA计量认证';
  static CMAF = 'CMAF食品';
  static CAL = 'CAL验收/认可';
  static CNAS = 'CNAS国家认证认可证书'

  static ALL_LIST = [
    CerTypeEnum.CMA, 
    CerTypeEnum.CMAF, 
    CerTypeEnum.CAL,
    CerTypeEnum.CNAS
  ];

  static toString(type) {
    switch (type) {
      case CerTypeEnum.CMA:
        return 'CMA计量认证';
      case CerTypeEnum.CMAF:
        return 'CMAF食品';
      case CerTypeEnum.CAL:
        return 'CAL验收/认可';
      case CerTypeEnum.CNAS:
        return 'CNAS国家认证认可证书';
      default:
        return '';
    }
  }
}

export default CerTypeEnum;