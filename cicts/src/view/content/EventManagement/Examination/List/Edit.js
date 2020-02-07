import React, { Component } from 'react';
import EventAndInfoAdd from '../../../../component/EventAndInfoAdd/EventAndInfoAdd';
import { GetQueryString, getService,postService} from '../../../myFetch';
import API_PREFIX from'../../../apiprefix';
export default class Add extends Component {
  constructor(props) {
    super(props);
    let param = this.props.location.search.replace('?','').split('&');
    let activeKey = param[1] && Number(decodeURIComponent(param[1].split('=')[1])) || '0';
    this.state = {
      id: GetQueryString(location.hash, ['id']).id || '',
      update: 0,
      dpRootId:'-1',
      isExamination:false,
      activeKey:String(activeKey),
      steps: [
        {
          title: '填写活动信息',
          content: eventForm,
          data: {},
          updateUrl: 'services/web/activity/exam/update',
          typeId: '2',
        },
        {
          title: '权限设置',
          data: {},
          url: 'services/web/activity/exam/update',
        },
        {
          title: '其他设置',
          content: otherForm,
          data: {},
          url: 'services/web/activity/exam/update',
        },
      ],
    };
  }
  componentDidMount() {
    this.getData();

  }

  getData1=()=>{
    let promise = new Promise((pass,fail)=>{
      getService(API_PREFIX +`services/web/activity/exam/getById/${this.state.id}`,data=>{
        console.log('data0202==',data);
        if (data.status === 1) {
          console.log('请求结果',data);
          pass(data);
        }
      });
    });
    return promise;
  }
  getData2=()=>{
    let promise = new Promise((pass,fail)=>{
      let body=this.state.id;
      postService(API_PREFIX +`services/web/auth/authdata/getAllByDataId/${this.state.id}`,{},data=>{
        if (data.status ===1) {
          console.log('请求结果',data);
          pass(data);
        }
  
      });
    });
    return promise;
  }

  getData = () => {
    Promise.all([this.getData1(),this.getData2()]).then(data=>{
      console.log(data);
      let allData = {...data[0].root.object,...data[1].root.object};
      console.log(allData);
      this.state.steps.map(item=>{
        item.data = allData;
      });
      console.log('data0729==',this.state.steps);
      this.setState({ steps: this.state.steps, update:this.state.update+1});
    });

    //获取部门的数据
    let isAll='Q=isAll=false';
    let haveUsers="Q=haveUsers=false";
    getService(API_PREFIX +`services/web/company/org/orgList/get?${isAll}&${haveUsers}`, data => {
      if (data.status === 1) {
        this.setState({
          dpRootId:data.root.object&&data.root.object.id,
        });

      }
    });
  }
  
  render() {
    // ?'examination':null
    console.log("this.state.dpRootIdthis.state.dpRootId",this.state.dpRootId);
    return <EventAndInfoAdd key={this.state.update}   datatype='examination' examination={this.state.isExamination} type="event" steps={this.state.steps} style="edit" id={{ id: this.state.id }} timePush={timePush} save={`/EventManagement/Examination/List?id=${this.state.activeKey}`} belonged="examination" 
    dpRootId={this.state.dpRootId}
    getUrl= { `services/web/activity/exam/getById/${this.state.id}`} />;
  }
}
const radioOption = [
  { label: '是', value: true },
  { label: '否', value: false },
  
];
const viewAnserParseradioOption = [
  { label: '活动截止可查看(活动结束过后才能查看答案及解析)', value: 1},
  { label: '考试完成可查看(考试完成，答题结束过后才能查看答案及解析)', value: 2},
  { label: '答题完可查看(每答完一题便可查看答案及解析)', value: 3},
];
const infoOption = [
  { label: '按照企业部门归属', value: 1 },
   { label: '按照党组织归属', value: 2 },
  { label: '按照工会归属', value: 3 },
];
const option1 = [{ key: 'aa', value: '主任' }, { key: 'bb', value: '主任1' }];
const eventForm = [
  { key: 'activityName', label: '活动名称', type: 'input', required: true,max:60 },
  { key: 'titleImage', label: '标题图片', type: 'uploadPicture_drop', required: true,isIamge:true },
  // { key: 'orgType', label: '活动归属', type: 'radioButton', required: true,option:eventOption},
  //  { key: 'orgId', label: '活动所属部门', type: 'cascader', required: true },
  // { key: 'orgType', label: '活动归属', type: 'infoBelong', required: true,option:eventOption},
  { key: 'orgType', label: '活动归属', type: 'infoBelong', required: true,option:infoOption},
  { key:'orgType'},
  { key:'orgId'},
  { key: 'beginTime', label: '活动开始时间', type: 'datePicker', required: true },
  { key: 'endTime', label: '活动结束时间', type: 'datePicker', required: true },
  { key: 'dayCount', label: '每人最多参与次数', type: 'inputNumber', required: true }, //inputnumber
  { key: 'content', label: '活动内容', type: 'richText', required: true }, //rich text
  // { label: '关联类型', type: 'relation' },
  { key: 'categoryRelevances', label: '所属栏目', type: 'checkTree', required: true },
  { key:'depCategory'}
];
const otherForm = [
  { key: 'isHomePage', label: '是否上首页', type: 'radioButton', option: radioOption, required: true },
  { key: 'isShare', label: '是否可分享', type: 'radioButton', option: radioOption, required: true },
  { key: 'isForwarding', label: '是否只能内部转发', type: 'radioButton', option: radioOption, required: true },
  { key: 'isComment', label: '是否可评论', type: 'radioButton', option: radioOption, required: true },
  { key: 'isNick', label: '是否可匿名评论', type: 'radioButton', option: radioOption, required: true },
  { key: 'isShowPeople', label: '是否显示参与用户', type: 'radioButton', option: radioOption, required: true },
  { key: 'viewAnserParse', label: '查看答案解析场景', type: 'radioButton', option: viewAnserParseradioOption, required: true },
  { key: 'isPush', label: '是否推送', type: 'radioButton', option: radioOption, required: true },
  { key: 'isTimePublish', label: '是否定时发送', type: 'isTimePublish', required: true },
  { key: 'isViewReport', label: '统计结果是否可查看', type: 'radioButton', option: radioOption, required: true },
  { key: 'rewardPoint', label: '奖励参与用户经验值数', type: 'inputNumber'  },
  { key: 'punishPoint', label: '惩罚参与用户经验值数', type: 'inputNumber' },
];

const timePush = {
    url: 'services/web/system/taskParam/taskParam/add',
    body: {
      'name': '考试活动定时发布任务',
      //'cronDate': '2018-06-19 16:10:00',
      'type': 42,
      'queryType': 'post',
      'queryUrl': API_PREFIX +'services/web/activity/exam/publishAndOffline/1',
      'queryValue': '[]',
      'queryContentType': 'application/json',
    },
  
};


