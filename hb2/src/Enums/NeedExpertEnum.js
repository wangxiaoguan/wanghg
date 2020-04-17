
class NeedExpertEnum {

  static YES = '1';
  static NO = '2';
  static ALL_LIST = [NeedExpertEnum.YES, NeedExpertEnum.NO];
  static toString(type) {
    switch (type) {
      case NeedExpertEnum.YES:
        return '是';
      case NeedExpertEnum.NO:
        return '否';
    }
  }
}

export default NeedExpertEnum;