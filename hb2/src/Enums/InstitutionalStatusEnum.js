class InstitutionalStatusEnum {

    /**
     * 正常
     */
    static PASS = '1';
  
    /**
     * 注销	
     */
    static REFUSE = '2';
  
    static ALL_LIST = [InstitutionalStatusEnum.PASS, InstitutionalStatusEnum.REFUSE];
  
    static toString(value) {
      if (!value) {
        return '未知'
      }
      switch (value.toString()) {
        case InstitutionalStatusEnum.PASS:
          return '正常';
        case InstitutionalStatusEnum.REFUSE:
          return '注销';
        default:
          return '未知'
      }
    }
  }
  
  export default InstitutionalStatusEnum;