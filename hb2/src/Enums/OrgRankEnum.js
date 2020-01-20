/**
 * 机构级别
 */

class OrgRankEnum {

  static RANK_A = 'A';


  static RANK_B = 'B';


  static RANK_C = 'C';
  static ALL_LIST = [
    OrgRankEnum.RANK_A,
    OrgRankEnum.RANK_B,
    OrgRankEnum.RANK_C,
  ];

  static toString(type) {
    switch (type) {
      case OrgRankEnum.RANK_A:
        return 'A';
      case OrgRankEnum.RANK_B:
        return 'B';
      case OrgRankEnum.RANK_C:
        return 'C';
      default:
        return '';
    }

  }
}

export default OrgRankEnum
