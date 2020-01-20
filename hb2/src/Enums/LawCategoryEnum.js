class LawCategoryEnum {
  static PRODUCT = '0';

  static COUNTRY = '1';

  static ALL = [LawCategoryEnum.PRODUCT, LawCategoryEnum.COUNTRY];

  static toString(type) {
    switch (type) {
      case LawCategoryEnum.PRODUCT:
        return '产品分类';
      case LawCategoryEnum.COUNTRY:
        return '国家分类';
      default:
        return '';
    }
  }
}

export default LawCategoryEnum;