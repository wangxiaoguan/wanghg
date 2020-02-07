
import React, { Component } from 'react';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import API_PREFIX from '../../apiprefix';
export default class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: '',
    };
  }
  

  test = (key, get, set) => {
    this.setState({ test: set });
    set(key, 'a');
    console.log('key', get);
    set(key, 'bbb');
  };
  render() {
    console.log('test', this.state.test);
    const infoOption = [
      { label: '按照企业部门归属', value: 1 },
       { label: '按照党组织归属', value: 2 },
      { label: '按照工会归属', value: 3 },
    ];
    const eventForm = [
     
      { key: 'activityName', label: '活动名称', type: 'input', required: true,max:60 },
      { key: 'titleImage', label: '标题图片', type: 'uploadPicture_drop', required: true,isIamge:true },
    // { key: 'orgType', label: '活动归属', type: 'radioButton', required: true,option:eventOption},
    //  { key: 'orgId', label: '活动所属部门', type: 'cascader', required: true },
      // { key: 'orgType', label: '活动归属', type: 'infoBelong', required: true,option:infoOption},
      { key: 'orgType', label: '活动归属', type: 'infoBelong', required: true,option:infoOption},
      { key:'orgType'},
      { key:'orgId'},
      { key: 'beginTime', label: '活动开始时间', type: 'datePicker', required: true },
      { key: 'endTime', label: '活动结束时间', type: 'datePicker', required: true },
      { key: 'content', label: '活动内容', type: 'richText', required: true }, //rich text
      // { label: '关联类型', type: 'relation' },
      { key: 'categoryRelevances', label: '所属栏目', type: 'checkTree', required: true },
      { key:'depCategory'}
    ];
    const steps = [
      {
        title: '填写活动信息',
        content: eventForm,
        url: 'services/web/activity/question/insert',
        updateUrl: 'services/web/activity/question/update',
        typeId: '4',
      },
      {
        title: '权限设置',
        url: 'services/web/activity/question/update',
      },
      {
        title: '其他设置',
        content: otherForm,
        url: 'services/web/activity/question/update',

      },
    ];
    return <EventAndInfoAdd type="event"  steps={steps} submitText="设置问卷题目" style="add" linkTo="/EventManagement/Questionnaire/TopicList" timePush={timePush} belonged="questionnaire" save={'/EventManagement/Questionnaire/List'}/>;
  }
}
const radioOption = [
  { label: '是', value: true },
  { label: '否', value: false },
];


const otherForm = [
  { key: 'isHomePage', label: '是否上首页', type: 'radioButton', option: radioOption, required: true },
  { key: 'isShare', label: '是否可分享', type: 'radioButton', option: radioOption, required: true },
  { key: 'isForwarding', label: '是否只能内部转发', type: 'radioButton', option: radioOption, required: true },
  { key: 'isComment', label: '是否可评论', type: 'radioButton', option: radioOption, required: true },
  { key: 'isNick', label: '是否可匿名评论', type: 'radioButton', option: radioOption, required: true },
  { key: 'isShowPeople', label: '是否显示参与用户', type: 'radioButton', option: radioOption, required: true },
  { key: 'isPush', label: '是否推送', type: 'radioButton', option: radioOption, required: true },
  { key: 'isTimePublish', label: '是否定时发送', type: 'isTimePublish', required: true },
  { key: 'isViewReport', label: '统计结果是否可查看', type: 'radioButton', option: radioOption, required: true },
  { key: 'rewardPoint', label: '奖励参与用户经验值数', type: 'inputNumber'  },
  { key: 'punishPoint', label: '惩罚参与用户经验值数', type: 'inputNumber'  },
];
const timePush = {
    url: 'services/web/system/taskParam/taskParam/add',
    body: {
      'name': '问卷活动定时发布任务',
      //'cronDate': '2018-06-19 16:10:00',
      'type': 42,
      'queryType': 'post',
      'queryUrl': API_PREFIX +'services/web/activity/question/publishAndOffline/1',
      'queryValue': '[]',
      'queryContentType': 'application/json',
    },
  
};


