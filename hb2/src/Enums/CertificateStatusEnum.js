/**
 * 证书状态
 */
class CertificateStatusEnum {

  static NORMAL = '0';
  static CANCELLATION = '1';

  static ALL_STATUS = [CertificateStatusEnum.NORMAL, CertificateStatusEnum.CANCELLATION];

  static toString(type) {
    switch (type) {

      case CertificateStatusEnum.NORMAL:
        return '正常';
      case CertificateStatusEnum.CANCELLATION:
        return '注销';
      default:
        return '未知';
    }
  }
}

export default CertificateStatusEnum;