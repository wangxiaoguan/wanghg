import React, { Component } from 'react';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import { getService, GetQueryString, postService } from '../../myFetch';
import ServiceApi from '../../apiprefix';
export default class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: GetQueryString(location.hash, ['id']).id || '',
      initData: {},
      update: 0,
      dpRootId:'-1',
      steps: [
        {
          title: '填写活动信息',
          content: eventForm,
          data: {},
        },
        {
          title: '权限设置',
          data: {},
        },
        {
          title: '其他设置',
          content: otherForm,
          data: {},
        },
      ],
    };
  }
  componentDidMount() {
    this.getData();
  }

  getData = () => {

  }
  render() {
    return <EventAndInfoAdd key={this.state.update} type="event" steps={this.state.steps} style="detail" id={{ id: this.state.id }} save={'/EventManagement/Questionnaire/List'} belonged="questionnaire" dpRootId={this.state.dpRootId}/>;
  }
}
const eventForm = [
  { key: 'name', label: '活动名称', type: 'input', required: true },
  { key: 'titleImage', label: '标题图片', type: 'uploadPicture_drop', required: true,isIamge:true },
  { key: 'organizationId', label: '活动所属部门', type: 'cascader', required: true },
  { key: 'beginTime', label: '活动开始时间', type: 'datePicker', required: true },
  { key: 'endTime', label: '活动结束时间', type: 'datePicker', required: true },
  { key: 'content', label: '活动内容', type: 'richText', required: true }, //rich text
  { label: '关联类型', type: 'relation' },
  { key: 'categoryId', label: '所属栏目', type: 'checkTree', required: true },
];
const radioOption = [
  { label: '是', value: true },
  { label: '否', value: false },
];

const otherForm = [
  { key: 'isHomePage', label: '是否上首页', type: 'radioButton', option: radioOption, required: true },
  { key: 'isShare', label: '是否可分享', type: 'radioButton', option: radioOption, required: true },
  { key: 'isInnerShare', label: '是否只能内部转发', type: 'radioButton', option: radioOption, required: true },
  { key: 'isComment', label: '是否可评论', type: 'radioButton', option: radioOption, required: true },
  { key: 'isNick', label: '是否可匿名评论', type: 'radioButton', option: radioOption, required: true },
  { key: 'isShowPeople', label: '是否显示参与用户', type: 'radioButton', option: radioOption, required: true },
  { key: 'isPush', label: '是否推送', type: 'radioButton', option: radioOption, required: true },
  { key: 'isTimePush', label: '是否定时发送', type: 'isTimePush', required: true },
  { key: 'point', label: '奖励参与用户经验值数', type: 'inputNumber', required: true },
  { key: 'punishPoint', label: '惩罚参与用户经验值数', type: 'inputNumber', required: true },
];