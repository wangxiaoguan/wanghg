/**
 * 标准状态
 */
class EducationDegreeEnum {

  static Illiteracy = '1';
  static HalfIlliteracy = '2';
  static PrimarySchool = '3';
  static MiddleSchool = '4'
  static HighSchool = '5'
  static TechnicalSchool = '6'
  static TechnicalSecondarySchool = '7'
  static JuniorCollege = '8'
  static UndergraduateCourse = '9'
  static Master = '10'
  static Doctor = '11'

  static ALL_LIST = [
    EducationDegreeEnum.Illiteracy,
    EducationDegreeEnum.HalfIlliteracy,
    EducationDegreeEnum.PrimarySchool,
    EducationDegreeEnum.MiddleSchool,
    EducationDegreeEnum.HighSchool,
    EducationDegreeEnum.TechnicalSchool,
    EducationDegreeEnum.TechnicalSecondarySchool,
    EducationDegreeEnum.JuniorCollege,
    EducationDegreeEnum.UndergraduateCourse,
    EducationDegreeEnum.Master,
    EducationDegreeEnum.Doctor,
  ];

  static toString(type) {
    switch (type) {
      case EducationDegreeEnum.Illiteracy:
        return '文盲';
      case EducationDegreeEnum.HalfIlliteracy:
        return '半文盲';
      case EducationDegreeEnum.PrimarySchool:
        return '小学';
      case EducationDegreeEnum.MiddleSchool:
        return '初中';
      case EducationDegreeEnum.HighSchool:
        return '高中';
      case EducationDegreeEnum.TechnicalSchool:
        return '技工学校';
      case EducationDegreeEnum.TechnicalSecondarySchool:
        return '中专';
      case EducationDegreeEnum.JuniorCollege:
        return '大专';
      case EducationDegreeEnum.UndergraduateCourse:
        return '本科';
      case EducationDegreeEnum.Master:
        return '硕士';
      case EducationDegreeEnum.Doctor:
        return '博士';
      default:
        return '';
    }
  }
}

export default EducationDegreeEnum;