/**
 * 证书状态
 */
class CertificateFlagEnum {

  static FIRST = '1';
  static EXPANSION = '2';
  static REVIEW = '3';
  static OTHER = 4;

  static ALL_STATUS = [CertificateFlagEnum.FIRST, CertificateFlagEnum.EXPANSION, CertificateFlagEnum.REVIEW, CertificateFlagEnum.OTHER];

  static toString(type) {
    switch (type) {
      case CertificateFlagEnum.FIRST:
        return '首次';
      case CertificateFlagEnum.EXPANSION:
        return '扩项';
      case CertificateFlagEnum.REVIEW:
        return '复查';
      case CertificateFlagEnum.OTHER:
        return '其他';
      default:
        return '未知';
    }
  }
}

export default CertificateFlagEnum;