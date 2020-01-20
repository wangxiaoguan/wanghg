
class HandleStatusEnum {

    static WAILT = '0';
    static PASS = '1';
    static FAIL = '2';
  
    static ALL_LIST = [HandleStatusEnum.WAILT, HandleStatusEnum.PASS, HandleStatusEnum.FAIL];
  
    static toString(type) {
      switch (type) {
        case HandleStatusEnum.WAILT:
          return '待审核';
        case HandleStatusEnum.PASS:
          return '审核通过';
        case HandleStatusEnum.FAIL:
          return '退回';
        default:
          return '';
      }
    }
  }
  
  export default HandleStatusEnum;