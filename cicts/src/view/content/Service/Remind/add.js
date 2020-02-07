import React, { Component} from 'react';
import { Tabs,Select,Button,message, Table,Input,Modal,Form,Radio,Cascader} from 'antd';
import NewEventAndInfoAdd from '../../../component/EventAndInfoAdd/NewEventAndInfoAdd';
import {postService,getService} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Search = Input.Search;
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    selectRowsData: state.table.selectRowsData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
class NewArticle extends  Component{
  constructor(props){
    super(props);
    this.state={
      newsTypeOptions:[],//文章类型(lookup字典中)
      dp:[],//文章归属部门
      partyData:[],//文章归属党组织
      keyAddModal:1,//作者列表的key值
      inputValue:'',//查询时输入框的内容
      selectedRowKeys:[],//当前选中
      currentValue:'',//文章归属  单选按钮选中的值
      set:function(){},
      authorOption:[],
      status:1,
      update:0,
      //三个步骤对象
      steps:[
        {
          title:'填写基本信息',
          content:[
            { key: 'content', label: '提醒内容', type: 'input', required: true },
            { key: 'remindType', label: '提醒方式',  type: 'radioButton', option: isOrNotOption },
            { key: 'remindTime', label: '提醒时间', type: 'datePicker', required: true},
            {  label: '关联类型', type: 'relation',hide:['2'],remind:true},
            {key:'relationType'},
            {key:'relationAddress'},
          ],
          url:'services/servicemanager/event/addEvent',
          updateUrl:'services/servicemanager/event/updateEvent',
        },
        {
          title:'设置提醒对象',
          content:'',
          url:'services/servicemanager/event/updateEvent',
          online:'111111',
        },
      ],
    };
  }
  componentDidMount(){
    //页面相关的数据处理
    this.dealData();
    window.sessionStorage.setItem('taskIdUpdate','')
  }
  dealData=()=>{
    //文章类型   lookup字典中的数据
    getService(API_PREFIX+'services/lookup/init/newsType',data=>{
      //返回数据处理
      this.dealLookup(data);
      this.setState({newsTypeOptions:data},()=>{
        //文字——1  图片——2 专题——4 网页——5   直播间——10
        console.log('newsTypeOptions',this.state.newsTypeOptions);
        //为steps设置值
        let temp= [...this.state.steps];
        //step1：基本信息
        const informationForm=[
          // { key: 'content', label: '提醒内容', type: 'input', required: true ,max:20},
          { key: 'content', label: '提醒内容', type: 'textarea', required: true ,max:500}, // 朱劲松  修改type BUG 2754
          { key: 'remindType', label: '提醒方式',  type: 'radioButton', option: isOrNotOption },
          { key: 'remindTime', label: '提醒时间', type: 'datePicker', required: true},
          {  label: '关联类型', type: 'relation',hide:['2'],remind:true},
          {key:'relationType'},
          {key:'relationAddress'},
        ];
        temp[0].content =informationForm;
        // this.setState({steps:temp});
        this.setState({steps:temp,update:this.state.update+1});

      });
    });
    //所属部门 使用之前部门接口
    //获取部门的数据
    // let organizationData = [];
    // getService(API_PREFIX + 'services/system/organization/organizationList/get',data=>{
    //   if (data.retCode === 1) {
    //     organizationData = data.root.list;
    //     this.dealDepartmentData(organizationData);
    //     this.setState({ dp:organizationData},()=>{
    //       let temp= [...this.state.steps];
    //       //步骤对象3：其他设置
    //     //   const otherForm=[
    //     //     { key: 'point', label: '奖励经验值数', type: 'inputNumber' },
    //     //     { key: 'treasure', label: '奖励积分数', type: 'inputNumber' },
    //     //     { key: 'treasureProvider', label: '积分提供方',type: 'cascader',options:this.state.dp},
    //     //     { key: 'isrequired', label: '是否必修',  type: 'radioButton', option: isRequiredOption, required: true },
    //     //     { key: 'iscomment', label: '是否可评论', type: 'radioButton', option: isOrNotOption, required: true },
    //     //     { key: 'isnonamecomment', label: '是否可匿名评论', type: 'radioButton', option: isOrNotOption, required: true },
    //     //     { key: 'isshare', label: '是否可分享',  type: 'radioButton', option: isOrNotOption , required: true},
    //     //     { key: 'isinnershare', label: '是否只能内部转发', type: 'radioButton', option: isOrNotOption , required: true},
    //     //     { key: 'ishomepage', label: '是否上首页',  type: 'radioButton', option: isOrNotOption, required: true },
    //     //     { key: 'ispush', label: '是否推送',  type: 'radioButton', option: isOrNotOption , required: true},
    //     //     { key: 'istimepush', label: '是否定时发送', type: 'isTimePush', required: true },
    //     //   ];
    //     //   temp[2].content =otherForm;
    //       this.setState({steps:temp,update:this.state.update+1});
    //     });

    //   }
    // });
    //获取党组织数据
    //获取党组织机构中的数据
  //   let partyOrganizationData = [];
  //   getService(API_PREFIX +'services/system/partyOrganization/partyOrganizationList/get',data=>{
  //     if (data.retCode === 1) {
  //       partyOrganizationData = data.root.list;
  //       this.dealPartyOrganaitonData(partyOrganizationData);
  //       this.setState({partyOrganization: partyOrganizationData });

  //     }
  //   });

  // }
  //处理组织机构中的数据
  // dealDepartmentData(data){
  //   data.map((item,index)=>{
  //     item.value=item.id+'';
  //     item.label=item.name;
  //     item.children=item.subOrganizationList;
  //     if(item.subOrganizationList){//不为空，递归
  //       this.dealDepartmentData(item.subOrganizationList);
  //     }
  //   });
  // }
  // // 处理党组织关系的函数
  // dealPartyOrganaitonData(po){
  //   po.map((item,index)=>{
  //     item.key=item.id+'';
  //     item.children=item.partyOrganizationList;
  //     if(item.partyOrganizationList){
  //       this.dealPartyOrganaitonData(item.partyOrganizationList);
  //     }
  //   });

  }

  //处理lookup字典中的数据
  dealLookup(data){
    data.map((item,index)=>{
      item.key=item.code;
      item.value=item.desp;
    });
  }

  //文章归属 单选按钮点击事件
  onChange=(e)=>{
    this.setState({
      currentValue: e.target.value, 
    });
  }
  render(){
    const timePush = {
      body: {
        'taskName': '事项提醒发布任务',
        'operateType': 1,
        'queryType': 'get',
        'queryUrl': API_PREFIX+'services/servicemanager/event/pushNotifications/',
        'queryValue': {},
        'queryContentType': 'application/json',
      },
    };
    return(
      <div>
        <NewEventAndInfoAdd
          update={this.state.update}
          type="information"
          steps={this.state.steps}
          submitText="保存并发布" 
          style="add"
          save="/Service/RemindList"
          belonged="article"
          timePush={timePush}
          RemindType='remind'
          addOldKey='RemindOld'
          timePushData=''
          status={this.state.status}
          remindListType='ServiceRemindListId'
        />
      </div>
    );
  }
}

const isOrNotOption=[
  { label: '消息推送', value: 1 },
  // { label: '短信', value: 2},
];

export default NewArticle;
