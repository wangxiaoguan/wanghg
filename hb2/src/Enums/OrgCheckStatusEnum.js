
/**
 * 机构审核
 */
class OrgCheckStatusEnum {
  static CHECKING = '0'

  static RESOLVE = '1'

  static REJECT = '2'

  static UNCHECKED = '3'

  static DRAFT = '4'

  static ALL_LIST = [
    OrgCheckStatusEnum.CHECKING,
    OrgCheckStatusEnum.RESOLVE,
    OrgCheckStatusEnum.REJECT,
    OrgCheckStatusEnum.UNCHECKED,
    OrgCheckStatusEnum.DRAFT
  ]

  static toString(type) {
    switch (type) {
      case OrgCheckStatusEnum.CHECKING:
        return '审核中';
      case OrgCheckStatusEnum.RESOLVE:
        return '审核通过';
      case OrgCheckStatusEnum.REJECT:
        return '审核不通过';
      case OrgCheckStatusEnum.DRAFT:
        return '草稿';
      case OrgCheckStatusEnum.UNCHECKED:
        return '未审核';
      default:
        return '';
    }
  }
}

export default OrgCheckStatusEnum