/**
 * 几大洲
 */
class ContinentEnum {
  static ASIA = 1;

  static EUROPE = 2;

  static AFRICA = 3;

  static Oceania = 4;

  static NorthAmerica = 5;

  static SorthAmerica = 6;

  static International = 7;

  static ALL = [ContinentEnum.ASIA, ContinentEnum.EUROPE,
  ContinentEnum.AFRICA, ContinentEnum.Oceania,
  ContinentEnum.NorthAmerica, ContinentEnum.SorthAmerica, ContinentEnum.International];

  static toString(type) {
    switch (type) {
      case ContinentEnum.ASIA:
        return '亚洲';
      case ContinentEnum.EUROPE:
        return '欧洲';
      case ContinentEnum.AFRICA:
        return '非洲';
      case ContinentEnum.Oceania:
        return '大洋洲';
      case ContinentEnum.NorthAmerica:
        return '北美洲';
      case ContinentEnum.SorthAmerica:
        return '南美洲';
      case ContinentEnum.International:
        return '国际组织';
      default:
        return '未知';
    }
  }

  /**
   * 通过国家编号获取所属区域
   * @param {*} code 
   */
  static getValueByCountryCode(code) {
    if (code) {
      return Number(code.toString()[0]);
    }
    return null;
  }

}

export default ContinentEnum;