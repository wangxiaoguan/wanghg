class RecallNewsEnum {
  static CAR_NEWS = '1';

  static CONSUME_NEWS = '2';

  static ALL_LIST = [RecallNewsEnum.CAR_NEWS, RecallNewsEnum.CONSUME_NEWS];

  static toString(value) {
    switch (value) {
      case RecallNewsEnum.CAR_NEWS:
        return '汽车产品召回';
      case RecallNewsEnum.CONSUME_NEWS:
        return '消费召回';
      default:
        return '未知';
    }
  }
}

export default RecallNewsEnum;