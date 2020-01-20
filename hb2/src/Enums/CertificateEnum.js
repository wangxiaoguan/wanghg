/**
 * 有无证书
 */
class CertificateEnum {

  static HAS = 'HAS';

  static NONE = 'NONE';

  static ALL_LIST = [CertificateEnum.HAS, CertificateEnum.NONE];

  static toString(type) {
    switch (type) {
      case CertificateEnum.HAS:
        return '有';
      case CertificateEnum.NONE:
        return '无';
      default:
        return '全部';
    }
  }
}

export default CertificateEnum;