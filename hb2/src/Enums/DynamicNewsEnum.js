class DynamicNewsEnum {
  static SOCIETY_NEWS = '1';

  static INFO_NEWS = '2';

  static ALL_LIST = [DynamicNewsEnum.SOCIETY_NEWS, DynamicNewsEnum.INFO_NEWS];

  static toString(value) {
    switch (value) {
      case DynamicNewsEnum.SOCIETY_NEWS:
        return '社会热点';
      case DynamicNewsEnum.INFO_NEWS:
        return '信息公告';
      default:
        return '未知';
    }
  }
}

export default DynamicNewsEnum;