class BusineseScopeEnum {
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

  static ONEONE = '11';

  static ONETWO = '12';

  static ONETHREE = '13';

  static ONEFOUR = '14';

  static ONEFIVE = '15';

  static ONESIX = '16';

  static ALL_LIST = [
    BusineseScopeEnum.ONE,
    BusineseScopeEnum.TWO,
    BusineseScopeEnum.THREE,
    BusineseScopeEnum.FOUR,
    BusineseScopeEnum.FIVE,
    BusineseScopeEnum.SIX,
    BusineseScopeEnum.SEVEN,
    BusineseScopeEnum.EIGHT,
    BusineseScopeEnum.NINE,
    BusineseScopeEnum.TEN,
    BusineseScopeEnum.ONEONE,
    BusineseScopeEnum.ONETWO,
    BusineseScopeEnum.ONETHREE,
    BusineseScopeEnum.ONEFOUR,
    BusineseScopeEnum.ONEFIVE,
    BusineseScopeEnum.ONESIX,
  ];

  static toString(type) {
    switch (type) {
      case BusineseScopeEnum.ONE:
        return '农副食品加工业';
      case BusineseScopeEnum.TWO:
        return '纺织服装、服饰业';
      case BusineseScopeEnum.THREE:
        return '皮革、毛皮、羽毛及其制品和制造业';
      case BusineseScopeEnum.FOUR:
        return '家具制造业';
      case BusineseScopeEnum.FIVE:
        return '造纸和纸制品业';
      case BusineseScopeEnum.SIX:
        return '文教、美工、体育和娱乐用品制造业';
      case BusineseScopeEnum.SEVEN:
        return '化学纤维制造业';
      case BusineseScopeEnum.EIGHT:
        return '橡胶和塑料制造业';
      case BusineseScopeEnum.NINE:
        return '金属制品业';
      case BusineseScopeEnum.TEN:
        return '通用设备制造业';
      case BusineseScopeEnum.ONEONE:
        return '专业设备制造业';
      case BusineseScopeEnum.ONETWO:
        return '汽车制造业';
      case BusineseScopeEnum.ONETHREE:
        return '电器机械和器材制造业';
      case BusineseScopeEnum.ONEFOUR:
        return '计算机、通信和其他电子设备制造业';
      case BusineseScopeEnum.ONEFIVE:
        return '仪器仪表制造业';
      case BusineseScopeEnum.ONESIX:
        return '其他制造业';
      default:
        return '';
    }
  }
}

export default BusineseScopeEnum;
