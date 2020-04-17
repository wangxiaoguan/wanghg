export default class GlobalEnum {
  static UPLOAD_IMAGE_ACCEPTS = '.jpg, .png, .svg';

  static UPLOAD_FILE_ACCEPTS = '.xls, .xlsx, .docx, .doc, .pptx, .ppt, .pdf';

  /**
   * 手机
   */
  static REG_MOBILE_PHONE = /^(\+86)?1[0-9]{10}$/;

  /**
   * 邮箱
   */
  static REG_EMAIL = /^[0-9a-zA-Z_]+@[0-9a-zA-Z_]+(\.[0-9a-zA-Z_]+)+$/;

  /**
   * 身份证
   */
  static REG_IDENTITY_CARD = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

  /**
   * 座机
   */
  static REG_PHONE = /^([0-9]{3,4}-?)?[0-9]{7,8}$/;

  /**
   * 邮政
   */
   static REG_POSTAL = /^[0-9]{6}$/;
}