
class HandleResultEnum {

  static WAILT = '0';
  static PASS = '1';
  static PUB = '2';

  static ALL_LIST = [HandleResultEnum.WAILT, HandleResultEnum.PASS, HandleResultEnum.PUB];

  static toString(type) {
    switch (type) {
      case HandleResultEnum.WAILT:
        return '待处理';
      case HandleResultEnum.PASS:
        return '已处理';
      case HandleResultEnum.PUB:
        return '已公示';
      default:
        return '';
    }
  }
}

export default HandleResultEnum;