
class handleSearchNewStatus {

    // 审核状态（0待审核、1通过、2退回）

    static WAILT = '0';

    static PASS = '1';

    static FAIL = '2';
  
    static ALL_LIST = [handleSearchNewStatus.WAILT, handleSearchNewStatus.PASS, handleSearchNewStatus.FAIL];
  
    static toString(type) {
      switch (type) {
        case handleSearchNewStatus.WAILT:
          return '待审核';
        case handleSearchNewStatus.PASS:
          return '审核通过';
        case handleSearchNewStatus.FAIL:
          return '退回';
        default:
          return '';
      }
    }
  }
  
  export default handleSearchNewStatus;