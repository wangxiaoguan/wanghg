import React, { Component } from 'react';
import EventAndInfoAdd from '../../../../component/EventAndInfoAdd/EventAndInfoAdd';
import { getService, GetQueryString, postService } from '../../../myFetch';
import ServiceApi from '../../../apiprefix';
export default class Add extends Component {
  constructor(props) {
    super(props);
    this.state={
      id: GetQueryString(location.hash, ['id']).id || '',
      update:0,
      dpRootId:'-1',
      visible: false,
      num:'',
      steps:[
        {
          title: '填写活动信息',
          content: eventForm,
          data: {},
          updateUrl: 'services/activity/orderActivity/update',
          typeId: '7',
        },
        {
          title: '权限设置',
          data: {},
          url: 'services/activity/orderActivity/permission/update',
        },
        {
          title: '其他设置',
          content: otherForm,
          data: {},
          url: 'services/activity/orderActivity/others/update',
        },
      ],
    };
  }
  componentDidMount(){
    this.getData();
  }

  showModal = (item) => {
    this.setState({
      visible: true,
      num:item,
    });
  }

  getData=()=>{

  }

  render() {
    return <EventAndInfoAdd key={this.state.update} num={this.state.num} showModal={this.showModal} type="event" steps={this.state.steps} style="edit" id={{ id: this.state.id }} timePush={timePush} save={'/EventManagement/Order/List'} belonged="order" dpRootId={this.state.dpRootId}/>;
  }
}


const eventForm = [
  { key: 'name', label: '活动名称', type: 'input', required: true ,max:12 },
  { key: 'titleImage', label: '标题图片', type: 'uploadPicture_drop', required: true,isIamge:true },
  { key: 'organizationId', label: '活动所属部门', type: 'cascader', required: true },
  { key: 'beginTime', label: '活动开始时间', type: 'datePicker', required: true },
  { key: 'endTime', label: '活动结束时间', type: 'datePicker', required: true },
  // 新增内容开始
  { key: 'orderTime', label: '订餐时间', type: 'input', required: true,word:'每周一09：00-每周三16：00' },
  { key: 'pickUpTime', label: '取货时间', type: 'input', required: true ,word:'每周五（11：30-12：30；17：00-18：00）'},
  { key: 'address', label: '取货地点', type: 'input', required: true ,max:50,word:''},
  // 新增内容结束
  { key: 'content', label: '活动内容', type: 'richText', required: true }, //rich text
  { key:'relationType',label: '关联类型', type: 'relation' },
  {key:'shopping',label:'商家',type:'shopping',required:false},
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
const timePush = {
  body: {
    'taskName': '问卷定时发布任务',
    'operateType': 1,
    'queryType': 'post',
    'queryUrl': ServiceApi + 'services/activity/orderActivity/online',
    'queryValue': {
    },
    'queryContentType': 'application/json',
  },

};

