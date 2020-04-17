
class HandleResultEnum {

  static ONE = '1';
  static TWO = '2';
  static THREE = '3';
  static FOUR = '4';
  static FIVE = '5';
  static SIX = '6';
  static SEVEN = '7';
  static EIGHT = '8';
  static NINE = '9';
  static TEN = '10';

  static ALL_LIST = [
    HandleResultEnum.ONE,
    HandleResultEnum.TWO,
    HandleResultEnum.THREE,
    HandleResultEnum.FOUR,
    HandleResultEnum.FIVE,
    HandleResultEnum.SIX,
    HandleResultEnum.SEVEN,
    HandleResultEnum.EIGHT,
    HandleResultEnum.NINE,
    HandleResultEnum.TEN
  ];

  static toString(type) {
    switch (type) {
      case HandleResultEnum.ONE:
        return '车身';
      case HandleResultEnum.TWO:
        return '传动系统';
      case HandleResultEnum.THREE:
        return '电气设备';
      case HandleResultEnum.FOUR:
        return '发动机';
      case HandleResultEnum.FIVE:
        return '车轮和轮胎';
      case HandleResultEnum.SIX:
        return '气囊和安全带';
      case HandleResultEnum.SEVEN:
        return '悬架系统';
      case HandleResultEnum.EIGHT:
        return '制动系统';
      case HandleResultEnum.NINE:
        return '转向系统';
      case HandleResultEnum.TEN:
        return '附加设备';
      default:
        return '';
    }
  }
}

export default HandleResultEnum;