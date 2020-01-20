
 export default class HbCitysEnum {
  
  static CITY1 = '420100';
  static CITY2 = '420200';
  static CITY3 = '420300';
  static CITY5 = '420500';
  static CITY6 = '420600';
  static CITY7 = '420700';
  static CITY8 = '420800';
  static CITY9 = '420900';
  static CITY10 = '421000';
  static CITY11 = '421100';
  static CITY12 = '421200';
  static CITY13 = '421300';
  static CITY14 = '422800';
  static CITY15 = '429004';
  static CITY16 = '429005';
  static CITY17 = '420106';
  static CITY18 = '429021';


  static ALL_LIST = [
    HbCitysEnum.CITY1,
    HbCitysEnum.CITY2,
    HbCitysEnum.CITY3,
    HbCitysEnum.CITY5,
    HbCitysEnum.CITY6,
    HbCitysEnum.CITY7,
    HbCitysEnum.CITY8,
    HbCitysEnum.CITY9,
    HbCitysEnum.CITY10,
    HbCitysEnum.CITY11,
    HbCitysEnum.CITY12,
    HbCitysEnum.CITY13,
    HbCitysEnum.CITY14,
    HbCitysEnum.CITY15,
    HbCitysEnum.CITY16,
    HbCitysEnum.CITY17,
  ];


  static toString(type) {
    switch (type) {
      case HbCitysEnum.CITY1:
        return '武汉市';
      case HbCitysEnum.CITY2:
        return '黄石市';
      case HbCitysEnum.CITY3:
        return '宜昌市';
      case HbCitysEnum.CITY5:
        return '襄樊市';
      case HbCitysEnum.CITY6:
        return '鄂州市';
      case HbCitysEnum.CITY7:
        return '荆门市';
      case HbCitysEnum.CITY8:
        return '孝感市';
      case HbCitysEnum.CITY9:
        return '荆州市';
      case HbCitysEnum.CITY10:
        return '黄冈市';
      case HbCitysEnum.CITY11:
        return '咸宁市';
      case HbCitysEnum.CITY12:
        return '随州市';
      case HbCitysEnum.CITY13:
        return '恩施土';
      case HbCitysEnum.CITY14:
        return '仙桃市';
      case HbCitysEnum.CITY15:
        return '潜江市';
      case HbCitysEnum.CITY16:
        return '天门市';
      case HbCitysEnum.CITY17:
        return '神农架';
    }

  }
}

