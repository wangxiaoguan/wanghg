/**
 * 标准状态
 */
class FacilityEnum {

  static FIXED = '1';
  static TEMPORARY = '2';
  static MOBILE = '3';
  static MULTI_FACILITY = '4'

  static ALL_LIST = [
    FacilityEnum.FIXED,
    FacilityEnum.TEMPORARY,
    FacilityEnum.MOBILE,
    FacilityEnum.MULTI_FACILITY
  ];

  static toString(type) {
    switch (type) {
      case FacilityEnum.FIXED:
        return '固定';
      case FacilityEnum.TEMPORARY:
        return '临时';
      case FacilityEnum.MOBILE:
        return '可移动';
      case FacilityEnum.MULTI_FACILITY:
        return '多场所'
      default:
        return '';
    }
  }
}

export default FacilityEnum;