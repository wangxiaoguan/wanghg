
/**
 * 授权签字人信息
 */
class AuthorizedCheckStatusEnum {
  static CHECKING  = '0'

  static RESOLVE   = '1'

  static REJECT    = '2'
  
  static UNCHECKED = '3'

  static ALL_LIST = [
    AuthorizedCheckStatusEnum.CHECKING,
    AuthorizedCheckStatusEnum.RESOLVE,
    AuthorizedCheckStatusEnum.REJECT,
    AuthorizedCheckStatusEnum.UNCHECKED
  ]

  static toString(type) {
    switch (type) {
      case AuthorizedCheckStatusEnum.CHECKING:
        return '审核中';
      case AuthorizedCheckStatusEnum.RESOLVE:
        return '审核通过';
      case AuthorizedCheckStatusEnum.REJECT:
        return '审核不通过';
      case AuthorizedCheckStatusEnum.UNCHECKED:
        return '未提交审核';
      default:
        return '';
    }
  }
}

export default AuthorizedCheckStatusEnum