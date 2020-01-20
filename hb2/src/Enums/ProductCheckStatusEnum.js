
class ProductCheckStatusEnum {

  static ZERO = '0';
  static ONE = '1';
  static TWO = '2';
  static THREE = '3';

  static ALL_LIST = [ProductCheckStatusEnum.ZERO,ProductCheckStatusEnum.ONE, ProductCheckStatusEnum.TWO, ProductCheckStatusEnum.THREE];

  static toString(type) {
    switch (type) {
      case ProductCheckStatusEnum.ZERO:
        return '召回';
      case ProductCheckStatusEnum.ONE:
        return '移交';
      case ProductCheckStatusEnum.TWO:
        return '上报';
      case ProductCheckStatusEnum.THREE:
        return '待处理';
      default:
        return '未知';
    }
  }
}

export default ProductCheckStatusEnum;