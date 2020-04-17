/**
 * 证书状态
 */
class CertificateValidityEnum {

  static EFFECTIVE = '0';
  static WILL_EXPIRE = '1';
  static EXPIRE = '2';
  static ALL = '3';
  static HISTORY = '4';
  static ALL_STATUS = [CertificateValidityEnum.ALL, CertificateValidityEnum.EFFECTIVE, CertificateValidityEnum.WILL_EXPIRE, CertificateValidityEnum.EXPIRE, CertificateValidityEnum.HISTORY];

  static toString(type) {
    switch (type) {


      case CertificateValidityEnum.ALL:
        return '全部';
      case CertificateValidityEnum.EFFECTIVE:
        return '有效期内';
      case CertificateValidityEnum.WILL_EXPIRE:
        return '即将过期';
      case CertificateValidityEnum.EXPIRE:
        return '已过期';
      case CertificateValidityEnum.HISTORY:
        return '历史证书';
      default:
        return '未知';
    }
  }
}

export default CertificateValidityEnum;