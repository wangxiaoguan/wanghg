
 export default class ArgueStatusEnum {
  
  static SERVICE = 'SERVICE';
  static REPLACE = 'REPLACE';
  static REJECTED = 'REJECTED';
  static OTHERS = 'OTHERS';



  static ALL_LIST = [
    ArgueStatusEnum.SERVICE,
    ArgueStatusEnum.REPLACE,
    ArgueStatusEnum.REJECTED,
    ArgueStatusEnum.OTHERS,
  ];


  static toString(type) {
    switch (type) {
      case ArgueStatusEnum.SERVICE:
        return '维修';
      case ArgueStatusEnum.REPLACE:
        return '更换';
      case ArgueStatusEnum.REJECTED:
        return '退货';
      case ArgueStatusEnum.OTHERS:
        return '其他';
    }
  }
}

