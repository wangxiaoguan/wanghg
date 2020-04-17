
 export default class HbCitysCerEnum {
  
  static CITY1 = '4201';
  static CITY2 = '4202';
  static CITY3 = '4203';
  static CITY5 = '4205';
  static CITY6 = '4206';
  static CITY7 = '4207';
  static CITY8 = '4208';
  static CITY9 = '4209';
  static CITY10 = '4210';
  static CITY11 = '4211';
  static CITY12 = '4212';
  static CITY13 = '4213';
  static CITY14 = '4228';
  static CITY15 = '429004';
  static CITY16 = '429005';
  static CITY17 = '420106';
  static CITY18 = '429021';


  static ALL_LIST = [
    HbCitysCerEnum.CITY1,
    HbCitysCerEnum.CITY2,
    HbCitysCerEnum.CITY3,
    HbCitysCerEnum.CITY5,
    HbCitysCerEnum.CITY6,
    HbCitysCerEnum.CITY7,
    HbCitysCerEnum.CITY8,
    HbCitysCerEnum.CITY9,
    HbCitysCerEnum.CITY10,
    HbCitysCerEnum.CITY11,
    HbCitysCerEnum.CITY12,
    HbCitysCerEnum.CITY13,
    HbCitysCerEnum.CITY14,
    HbCitysCerEnum.CITY15,
    HbCitysCerEnum.CITY16,
    HbCitysCerEnum.CITY17,
  ];


  static toString(type) {
    switch (type) {
      case HbCitysCerEnum.CITY1:
        return '武汉市';
      case HbCitysCerEnum.CITY2:
        return '黄石市';
      case HbCitysCerEnum.CITY3:
        return '宜昌市';
      case HbCitysCerEnum.CITY5:
        return '襄樊市';
      case HbCitysCerEnum.CITY6:
        return '鄂州市';
      case HbCitysCerEnum.CITY7:
        return '荆门市';
      case HbCitysCerEnum.CITY8:
        return '孝感市';
      case HbCitysCerEnum.CITY9:
        return '荆州市';
      case HbCitysCerEnum.CITY10:
        return '黄冈市';
      case HbCitysCerEnum.CITY11:
        return '咸宁市';
      case HbCitysCerEnum.CITY12:
        return '随州市';
      case HbCitysCerEnum.CITY13:
        return '恩施土';
      case HbCitysCerEnum.CITY14:
        return '仙桃市';
      case HbCitysCerEnum.CITY15:
        return '潜江市';
      case HbCitysCerEnum.CITY16:
        return '天门市';
      case HbCitysCerEnum.CITY17:
        return '神农架';
    }

  }
}

