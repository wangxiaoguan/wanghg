
class HandleCompareTime {

    // G 大于等于  L小于


    static inner = 'L';

    static outside = 'G';
  
    static ALL_LIST = [HandleCompareTime.inner, HandleCompareTime.outside];
  
    static toString(type) {
      switch (type) {
        case HandleCompareTime.inner:
          return '不超过5个工作日';
        case HandleCompareTime.outside:
          return '超过5个工作日';
        default:
          return '';
      }
    }
  }
  
  export default HandleCompareTime;