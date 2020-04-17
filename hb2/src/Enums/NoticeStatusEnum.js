
class NoticeStatusEnum {

  static WAILT = '0';
  static PASS = '1';
  static ALL_LIST = [NoticeStatusEnum.WAILT, NoticeStatusEnum.PASS];
  static toString(type) {
    switch (type) {
      case NoticeStatusEnum.WAILT:
        return '未公示';
      case NoticeStatusEnum.PASS:
        return '已公示';
    }
  }
}

export default NoticeStatusEnum;