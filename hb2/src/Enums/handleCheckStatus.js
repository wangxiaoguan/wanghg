
class handleCheckStatus {

    // 查新来源（0内部，1为外部）

    static inner = '0';

    static outside = '1';
  
    static ALL_LIST = [handleCheckStatus.inner, handleCheckStatus.outside];
  
    static toString(type) {
      switch (type) {
        case handleCheckStatus.inner:
          return '内部';
        case handleCheckStatus.outside:
          return '外部';
        default:
          return '';
      }
    }
  }
  
  export default handleCheckStatus;