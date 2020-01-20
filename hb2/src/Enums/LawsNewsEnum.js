class LawsNewsEnum {
  static LAWS_NEWS = '1';

  static KNOWLEDGE_NEWS = '2';

  static ALL_LIST = [LawsNewsEnum.LAWS_NEWS, LawsNewsEnum.KNOWLEDGE_NEWS];

  static toString(value) {
    switch (value) {
      case LawsNewsEnum.LAWS_NEWS:
        return '法律法规';
      case LawsNewsEnum.KNOWLEDGE_NEWS:
        return '知识宣贯';
      default:
        return '未知';
    }
  }
}

export default LawsNewsEnum;