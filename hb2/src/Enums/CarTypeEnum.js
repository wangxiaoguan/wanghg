
class CarTypeEnum {

  static SELF = '0';
  static JOINT = '1';
  static IMPORT = '2';

  static ALL_LIST = [CarTypeEnum.SELF, CarTypeEnum.JOINT, CarTypeEnum.IMPORT];

  static toString(type) {
    switch (type) {
      case CarTypeEnum.SELF:
        return '自主';
      case CarTypeEnum.JOINT:
        return '合资';
      case CarTypeEnum.IMPORT:
        return '进口';
      default:
        return '';
    }
  }
}

export default CarTypeEnum;