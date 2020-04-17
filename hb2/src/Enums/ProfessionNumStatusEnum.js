class ProfessionNumStatusEnum {

  static NUM1 = '1';        //土木建筑
  static NUM2 = '2';        //电子信息工程
  static NUM3 = '3';        //医药工程
  static NUM4 = '4';        //地质勘查
  static NUM5 = '5';        //计量标准化质量
  static NUM6 = '6';        //测量技术
  static NUM7 = '7';        //水利电力工程
  static NUM8 = '8';        //统计
  static NUM9 = '9';        //路桥港航
  static NUM10 = '10';      //机械
  static NUM11 = '11';      //化工
  static NUM12 = '12';      //采矿
  static NUM13 = '13';      //冶金
  static NUM14 = '14';      //建材
  static NUM15 = '15';      //建筑工程
  static NUM16 = '16';      //经济
  static NUM17 = '17';      //安全工程
  static NUM18 = '18';      //地震
  static NUM19 = '19';      //卫生


  static ALL = [
    ProfessionNumStatusEnum.NUM1,
    ProfessionNumStatusEnum.NUM2,
    ProfessionNumStatusEnum.NUM3,
    ProfessionNumStatusEnum.NUM4,
    ProfessionNumStatusEnum.NUM5,
    ProfessionNumStatusEnum.NUM6,
    ProfessionNumStatusEnum.NUM7,
    ProfessionNumStatusEnum.NUM8,
    ProfessionNumStatusEnum.NUM9,
    ProfessionNumStatusEnum.NUM10,
    ProfessionNumStatusEnum.NUM11,
    ProfessionNumStatusEnum.NUM12,
    ProfessionNumStatusEnum.NUM13,
    ProfessionNumStatusEnum.NUM14,
    ProfessionNumStatusEnum.NUM15,
    ProfessionNumStatusEnum.NUM16,
    ProfessionNumStatusEnum.NUM17,
    ProfessionNumStatusEnum.NUM18,
    ProfessionNumStatusEnum.NUM19,
  ];

  static toString(value) {
    if (!value) {
      　return '未知';
    }
    switch (value.toString()) {
      case ProfessionNumStatusEnum.NUM1:
      　return '土木建筑';
      case ProfessionNumStatusEnum.NUM2:
      　return '电子信息工程';
      case ProfessionNumStatusEnum.NUM3:
      　return '医药工程';
      case ProfessionNumStatusEnum.NUM4:
      　return '地质勘查';
      case ProfessionNumStatusEnum.NUM5:
      　return '计量标准化质量';
      case ProfessionNumStatusEnum.NUM6:
      　return '测量技术';
      case ProfessionNumStatusEnum.NUM7:
      　return '水利电力工程';
      case ProfessionNumStatusEnum.NUM8:
      　return '统计';
      case ProfessionNumStatusEnum.NUM9:
      　return '路桥港航';
      case ProfessionNumStatusEnum.NUM10:
      　return '机械';
      case ProfessionNumStatusEnum.NUM11:
      　return '化工';
      case ProfessionNumStatusEnum.NUM12:
      　return '采矿';
      case ProfessionNumStatusEnum.NUM13:
      　return '冶金';
      case ProfessionNumStatusEnum.NUM14:
      　return '建材';
      case ProfessionNumStatusEnum.NUM15:
      　return '建筑工程';
      case ProfessionNumStatusEnum.NUM16:
      　return '经济';
      case ProfessionNumStatusEnum.NUM17:
      　return '安全工程';
      case ProfessionNumStatusEnum.NUM18:
      　return '地震';
      case ProfessionNumStatusEnum.NUM19:
        return '卫生';
      default:
        return '其他';
    }
  }
}

export default ProfessionNumStatusEnum;
