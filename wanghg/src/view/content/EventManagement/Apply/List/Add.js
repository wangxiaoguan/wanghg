/**
 * type:1、event活动页面 2、information资讯页面
 * steps:步骤条以及Tabs内容,新建是步骤条,编辑和详情是tabs
 * steps title:每一步的说明。
 * steps content:表单的内容，第二步权限设置不需要传content。
 * submitText:最后一步提交按钮的label,每个页面都不一样
 * style:1、add 新增 2、edit 编辑 3、detail详情
 * eventForm:第一页 表单的格式 type:1、Button按钮 2、redioButton单选 3、input输入框 4、uploadPicture_drop拖拽类型上传图片，uploadPicture_button按钮类型上传图片5、select下拉选择 6、datePicker日期选择 7、inputNumber数字输入 8、富文本框 9、所属栏目selectTree单选树 checkTree勾选树 10、rangePicker时间段选择
 * otherForm:第三页表单数据 如果没有则把steps第三个对象直接写{end:true}
 */
import React, { Component } from 'react';
import API_PREFIX from '../../../apiprefix';
import EventAndInfoAdd from '../../../../component/EventAndInfoAdd/EventAndInfoAdd';
export default class Add extends Component {
  render() {
    return <EventAndInfoAdd type="event" steps={steps} submitText="设置报名表单" style="add" linkTo="/EventManagement/Apply/ApplyFields" timePush={timePush} belonged="apply" save={'/EventManagement/Apply/List'} />;
  }
}

const radioOption = [
  { label: '是', value: true },
  { label: '否', value: false },
];

const eventForm = [
  { key: 'name', label: '活动名称', type: 'input', required: true,max:20 },
  { key: 'titleImage', label: '标题图片', type: 'uploadPicture_drop', required: true, isIamge:true },
  { key: 'organizationId', label: '活动所属部门', type: 'cascader', required: true },
  { key: 'applyBegin', label: '报名开始时间', type: 'datePicker', required: true},
  { key: 'applyEnd', label: '报名结束时间', type: 'datePicker', required: true },
  { key: 'beginTime', label: '活动开始时间', type: 'datePicker', required: true},
  { key: 'endTime', label: '活动结束时间', type: 'datePicker', required: true },
  { key: 'address', label: '活动地点', type: 'input', required: false },
  { key: 'linkman', label: '联系人', type: 'input', required: true,max:8 },
  { key: 'mobile', label: '联系人电话', type: 'input', required: true ,max:11},
  { key: 'content', label: '活动内容', type: 'richText', required: true }, //rich text
  { label: '关联类型', type: 'relation' },
  { key: 'categoryId', label: '所属栏目', type: 'checkTree', required: true },
  { key:'relationAddress'},
];
const otherForm = [
  { key: 'isHomePage', label: '是否上首页',  type: 'radioButton', option: radioOption, required: true },
  { key: 'isShare', label: '是否可分享',  type: 'radioButton', option: radioOption, required: true },
  { key: 'isInnerShare', label: '是否只能内部转发',  type: 'radioButton', option: radioOption, required: true },
  { key: 'isComment', label: '是否可评论', type: 'radioButton', option: radioOption, required: true },
  { key: 'isNick', label: '是否可匿名评论', type: 'radioButton', option: radioOption, required: true },
  { key: 'isShowPeople', label: '是否显示参与用户', type: 'radioButton', option: radioOption, required: true },
  { key: 'isPush', label: '是否推送', type: 'radioButton', option: radioOption, required: true },
  { key: 'isTimePush', label: '是否定时发送', type: 'isTimePush', required: true },
  { key: 'point', label: '奖励参与用户经验值数', type: 'inputNumber' },
  { key: 'punishPoint', label: '惩罚参与用户经验值数', type: 'inputNumber' },
];
const steps = [
  {
    title: '填写活动信息',
    content: eventForm,   
    url: 'services/activity/signUpActivity/insert',
    updateUrl: 'services/activity/signUpActivity/updateActivity',
    typeId: '1',
  },
  {
    title: '权限设置',
    url: 'services/activity/signUpActivity/updateActivityPermission',
  },
  {
    title: '其他设置',
    content: otherForm,
    url: 'services/activity/signUpActivity/updateActivityOthers',
  },
];

const timePush = {
  url: 'services/activity/signUpActivity/online',
  body: {
    'taskName': '报名活动定时发布任务',
    //'cronDate': '2018-06-19 16:10:00',
    'operateType': 1,
    'queryType': 'post',
    'queryUrl': API_PREFIX +'services/activity/signUpActivity/online',
    'queryValue': {
      // 'commentType': 0,
      // 'commentTypeId':1,
      // 'targetId':'1111',
      // 'content': '反馈测试评论121',
      // 'imageUrl': 'http://',
      // 'userId': 110,
    },
    'queryContentType': 'application/json',
  },

};

