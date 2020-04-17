export default class LeaveMessageEnum {
  static PUBLISHED = '1';

  static UNPUBLISH = '0';

  static ALL_LIST = [LeaveMessageEnum.UNPUBLISH, LeaveMessageEnum.PUBLISHED];

  static toString(type) {
    switch (type) {
      case LeaveMessageEnum.PUBLISHED:
        return '是';
      default:
        return '否';
    }
  }
}