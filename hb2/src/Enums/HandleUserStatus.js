

class HandleUserStatus {

    static WAILT = '0';

    static PASS = '1';

    static FAIL = '2';
  
    static ALL_LIST = [HandleUserStatus.WAILT, HandleUserStatus.PASS, HandleUserStatus.FAIL];
  
    static toString(type) {
      switch (type) {
        case HandleUserStatus.WAILT:
          return '已删除';
        case HandleUserStatus.PASS:
          return '正常';
        case HandleUserStatus.FAIL:
          return '锁定';
        default:
          return '';
      }
    }
  }
  
  export default HandleUserStatus;