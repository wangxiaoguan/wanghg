
class DataSourceEnum {
  static ONE = '1';
  static TWO = '2';
  static THREE = '3';
  static FOUR = '4';
  static FIVE = '5';
  static SIX = '6';
  static SEVEN = '7';
  static EIGHT = '8';
  static NINE = '9';
  static A = 'A';
  static J = 'J';
  static N = 'N';
  static Y = 'Y';
  static Z = 'Z';
  static S = 'S';

  static ALL_LIST = [DataSourceEnum.ONE, DataSourceEnum.TWO,
  DataSourceEnum.THREE, DataSourceEnum.FOUR, DataSourceEnum.FIVE, DataSourceEnum.SIX,
  DataSourceEnum.SEVEN, DataSourceEnum.EIGHT, DataSourceEnum.NINE, DataSourceEnum.A
    , DataSourceEnum.J, DataSourceEnum.N, DataSourceEnum.Y, DataSourceEnum.Z
    , DataSourceEnum.S];

  static toString(type) {
    switch (type) {
      case DataSourceEnum.ONE:
        return '机构编制';
      case DataSourceEnum.TWO:
        return '外交';
      case DataSourceEnum.THREE:
        return '司法行政';
      case DataSourceEnum.FOUR:
        return '文化';
      case DataSourceEnum.FIVE:
        return '民政';
      case DataSourceEnum.SIX:
        return '旅游';
      case DataSourceEnum.SEVEN:
        return '宗教';
      case DataSourceEnum.EIGHT:
        return '工会';
      case DataSourceEnum.NINE:
        return '工商';
      case DataSourceEnum.A:
        return '中央军委改革和编制办公室';
      case DataSourceEnum.J:
        return '机构代码库';
      case DataSourceEnum.N:
        return '农业';
      case DataSourceEnum.Y:
        return '其他';
      case DataSourceEnum.Z:
        return '中心';
      case DataSourceEnum.S:
        return '静态存量表';
      default:
        return '未知';
    }
  }
}

export default DataSourceEnum;