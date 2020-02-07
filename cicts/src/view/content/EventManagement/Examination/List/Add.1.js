/**
 * type:1、event活动页面 2、information资讯页面
 * steps:步骤条以及Tabs内容,新建是步骤条,编辑和详情是tabs
 * steps title:每一步的说明。
 * steps content:表单的内容，第二步权限设置不需要传content。
 * submitText:最后一步提交按钮的label,每个页面都不一样
 * style:1、add 新增 2、edit 编辑 3、detail详情
 * eventForm:第一页 表单的格式 type:1、Button按钮 2、radioButton单选 3、input输入框 4、uploadPicture_drop拖拽类型上传图片，uploadPicture_button按钮类型上传图片 describe:true上传描述5、select下拉选择 6、datePicker日期选择 7、inputNumber数字输入 8、富文本框 9、所属栏目selectTree单选树 checkTree勾选树 10、rangePicker时间段选择
 * otherForm:第三页表单数据 如果没有则把steps第三个对象直接写{end:true}
 */
import React, { Component } from 'react';
import EventAndInfoAdd from '../../../../component/EventAndInfoAdd/EventAndInfoAdd';

export default class Add extends Component {
  constructor(props) {
    super(props);
    this.state={
      test:'',
    };
  }
  
  test = (key,get,set) => {
    this.setState({ test: set});
    set(key,'a');
    console.log('key',get);
    set(key,'bbb');
  };
  render() {
    const option2 = [{ label: '图片', value: '1' }, { label: '文字', value: '2' }, { label: '专题', value: '3' }, { label: '网页', value: '4' }, { label: '直播间', value: '5' }];
    console.log('test',this.state.test);
    const eventForm = [
      { keyOne: 'name1', keyTwo: 'name2', keyThree: 'name3', type: 'onHomePage', required: true },
      {  label: '关联类型测试', type: 'relation' },
      { key: 'infosstype', label: '直播测试', type: 'live_type'},
      { key: 'infotype', label: '资讯类型测试', type: 'information_type', option: option2 },
      { key: 'name', label: '按钮测试', type: 'Button', layout: { span: 16, offset: 8 }, onClick: this.test },
      // { key: 'testasd', label: 'radiotest', type: 'radioButton', option:radioOption ,required: true },
      { key: 'name', label: '活动名称', type: 'input', required: true ,max:20},
      { key: 'titleImage', label: '标题图片', type: 'uploadPicture_drop', required: true },
      // { key: 'aaaa', label: '内容图片', type: 'uploadPicture_button', required: true, describe:true },
      // { key: 'aaaas', label: '上传附件', type: 'uploadPicture_button', required: true, describe:false },
      { key: 'test1', label: '活动所属部门', type: 'select', option: option1, required: true ,hide:['1','2']},
      { key: 'beginTime', label: '活动开始时间', type: 'datePicker', required: true },
      { key: 'endTime', label: '活动结束时间', type: 'datePicker', required: true },
      { key: 'test111222', label: '每人最多参与次数', type: 'inputNumber', required: true }, //inputnumber
      { key: 'content', label: '活动内容', type: 'richText', required: true }, //rich text
      { key: 'categoryId', label: '所属栏目', type: 'selectTree', required: true },
      { key:'relationAddress'},
    ];
    const steps = [
      { 
        title: '填写活动信息',
        content: eventForm,
        data: {},
        url: 'services/activityHe/activity/insert',
        typeId:'2',
      },
      {
        title: '权限设置',
        data: {},
        url: '/services/activity/activity/updateActivityPermission',
      },
      {
        title: '其他设置',
        content: otherForm,
        url: '/services/activity/activity/updateActivityOthers',

      },
    ];
    return <EventAndInfoAdd type="event" steps={steps} submitText="设置考试题目" style="add"/>;
  }
}
const radioOption = [
  { label: '是', value: '1' },
  { label: '否', value: '0' },
];

const option1 = [{ key: 'aa', value: '主任' }, { key: 'bb', value: '主任1' }];
const otherForm = [
  { key: 'isHomePage', label: '是否上首页', type: 'radioButton', option: radioOption ,required: true},
  { key: 'isShare', label: '是否可分享', type: 'radioButton', option: radioOption, required: true },
  { key: 'isInnerShare', label: '是否只能内部转发', type: 'radioButton', option: radioOption, required: true },
  { key: 'isComment', label: '是否可评论', type: 'radioButton', option: radioOption, required: true },
  { key: 'isnonameComment', label: '是否可匿名评论', type: 'radioButton', option: radioOption, required: true },
  { key: 'isComment', label: '是否显示参与用户', type: 'radioButton', option: radioOption, required: true },
  { key: 'isComment', label: '奖励参与用户经验值数', type: 'input', required: true },
  { key: 'isComment', label: '惩罚参与用户经验值数', type: 'input', required: true},
];


