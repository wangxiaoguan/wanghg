
class HandleSelectEnum {

  static WAILT = '0';
  static PASS = '1';
  static ALL_LIST = [HandleSelectEnum.WAILT, HandleSelectEnum.PASS];
  static toString(type) {
    switch (type) {
      case HandleSelectEnum.WAILT:
        return '待处理';
      case HandleSelectEnum.PASS:
        return '已处理';
    }
  }
}

export default HandleSelectEnum;