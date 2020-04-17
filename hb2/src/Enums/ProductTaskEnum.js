
class ProductTaskEnum {

  static ONE = 1;
  static TWO = 2;
  static THREE = 3;

  static ALL_LIST = [ProductTaskEnum.ONE, ProductTaskEnum.TWO, ProductTaskEnum.THREE];

  static toString(type) {
    switch (type) {
      case ProductTaskEnum.ONE:
        return '类型1';
      case ProductTaskEnum.TWO:
        return '类型2';
      case ProductTaskEnum.THREE:
        return '类型3';
      default:
        return '';
    }
  }
}

export default ProductTaskEnum;