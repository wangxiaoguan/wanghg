

class RegonEnum {

  static VALUE_ONE = '4201';
  static VALUE_TWO = '4202';
  static VALUE_THREE = '4203';
  static VALUE_FOUR = '4205';
  static VALUE_FIVE = '4206';
  static VALUE_SIX = '4207';
  static VALUE_SEVEN = '4208';
  static VALUE_EIGHT = '4209';
  static VALUE_NINE = '4210';
  static VALUE_TEN = '4211';
  static VALUE_ELEVEN = '4212';
  static VALUE_TWELVE = '4213';
  static VALUE_THIRTEEN = '4228';
  static VALUE_FOURTEEN = '429004';
  static VALUE_FIFTEEN = '429005';
  static VALUE_SIXTEEN = '429006';
  static VALUE_SEVENTEEN = '429021';

  static ALL_LIST = [RegonEnum.VALUE_ONE, RegonEnum.VALUE_TWO, RegonEnum.VALUE_THREE,
  RegonEnum.VALUE_FOUR, RegonEnum.VALUE_FIVE, RegonEnum.VALUE_SIX,
  RegonEnum.VALUE_SEVEN, RegonEnum.VALUE_EIGHT, RegonEnum.VALUE_NINE,
  RegonEnum.VALUE_TEN, RegonEnum.VALUE_ELEVEN, RegonEnum.VALUE_TWELVE,
  RegonEnum.VALUE_THIRTEEN, RegonEnum.VALUE_FOURTEEN, RegonEnum.VALUE_FIFTEEN,
  RegonEnum.VALUE_SIXTEEN, RegonEnum.VALUE_SEVENTEEN];

  static toString(value) {
    switch (value) {
      case RegonEnum.VALUE_ONE:
        return '武汉市';
      case RegonEnum.VALUE_TWO:
        return '黄石市';
      case RegonEnum.VALUE_THREE:
        return '十堰市';
      case RegonEnum.VALUE_FOUR:
        return '宜昌市';
      case RegonEnum.VALUE_FIVE:
        return '襄阳市';
      case RegonEnum.VALUE_SIX:
        return '鄂州市';
      case RegonEnum.VALUE_SEVEN:
        return '荆门市';
      case RegonEnum.VALUE_EIGHT:
        return '孝感市';
      case RegonEnum.VALUE_NINE:
        return '荆州市';
      case RegonEnum.VALUE_TEN:
        return '黄冈市';
      case RegonEnum.VALUE_ELEVEN:
        return '咸宁市';
      case RegonEnum.VALUE_TWELVE:
        return '随州市';
      case RegonEnum.VALUE_THIRTEEN:
        return '恩施市';
      case RegonEnum.VALUE_FOURTEEN:
        return '仙桃市';
      case RegonEnum.VALUE_FIFTEEN:
        return '潜江市';
      case RegonEnum.VALUE_SIXTEEN:
        return '天门市';
      case RegonEnum.VALUE_SEVENTEEN:
        return '神农架';
      default:
        return ''
    }
  }
}

export default RegonEnum;