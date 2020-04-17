/**
 * AN001,院领导;
 * AN002,其他;
 * DN20,服务所;
 * DN21,资环所;
 * DN22,物流所;
 * DN001,党办;
 * DN004,院办;
 * DN005,数据中心;
 * DN006,文献馆;
 * DN007,高新所;
 * DN009,财资部;
 * DN011,物品编码部;
 * DN014,国际所;
 * DN015,质量所
 */
class UpholdEnum {
  static UPHOLD1 = 'AN001';

  static UPHOLD2 = 'AN002';

  static UPHOLD3 = 'DN20';

  static UPHOLD4 = 'DN21';

  static UPHOLD5 = 'DN22';

  static UPHOLD6 = 'DN001';

  static UPHOLD7 = 'DN004';

  static UPHOLD8 = 'DN005';

  static UPHOLD9 = 'DN006';

  static UPHOLD10 = 'DN007';

  static UPHOLD11 = 'DN009';

  static UPHOLD12 = 'DN011';

  static UPHOLD13 = 'DN014';

  static UPHOLD14 = 'DN015';

  static ALL = [
    UpholdEnum.UPHOLD1,
    UpholdEnum.UPHOLD2,
    UpholdEnum.UPHOLD3,
    UpholdEnum.UPHOLD4,
    UpholdEnum.UPHOLD5,
    UpholdEnum.UPHOLD6,
    UpholdEnum.UPHOLD7,
    UpholdEnum.UPHOLD8,
    UpholdEnum.UPHOLD9,
    UpholdEnum.UPHOLD10,
    UpholdEnum.UPHOLD11,
    UpholdEnum.UPHOLD12,
    UpholdEnum.UPHOLD13,
    UpholdEnum.UPHOLD14,
  ];


  static toString(value) {
    switch (value) {
      case UpholdEnum.UPHOLD1:
        return ' 院领导 ';
      case UpholdEnum.UPHOLD2:
        return ' 其他 ';
      case UpholdEnum.UPHOLD3:
        return ' 服务所 ';
      case UpholdEnum.UPHOLD4:
        return ' 资环所 ';
      case UpholdEnum.UPHOLD5:
        return ' 物流所 ';
      case UpholdEnum.UPHOLD6:
        return ' 党办 ';
      case UpholdEnum.UPHOLD7:
        return ' 院办 ';
      case UpholdEnum.UPHOLD8:
        return ' 数据中心';
      case UpholdEnum.UPHOLD9:
        return ' 文献馆 ';
      case UpholdEnum.UPHOLD10:
        return ' 高新所 ';
      case UpholdEnum.UPHOLD11:
        return ' 财资部 ';
      case UpholdEnum.UPHOLD12:
        return ' 物品编码部 ';
      case UpholdEnum.UPHOLD13:
        return ' 国际所 ';
      case UpholdEnum.UPHOLD14:
        return ' 质量所 ';
      default:
        return '';
    }
  }


}

export default UpholdEnum;