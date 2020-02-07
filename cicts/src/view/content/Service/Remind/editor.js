import React, { Component } from 'react';
import NewEventAndInfoAdd from '../../../component/EventAndInfoAdd/NewEventAndInfoAdd';
import { Tabs, Select, Button, message, Table, Input, Modal, Form, Radio, Cascader } from 'antd';
import { GetQueryString, getService } from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import { connect } from 'react-redux';
import { BEGIN } from '../../../../redux-root/action/table/table';
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData: state.table.pageData,
    selectRowsData: state.table.selectRowsData,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
class EditArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newsTypeOptions: [],//文章类型(lookup字典中)
      dp: [],//文章归属部门
      newsId: GetQueryString(location.hash, ['newsId']).newsId,//获取前一个页面传过来的id
      newsData: {},//详情中的数据
      releaseRange: [],//发布范围中处理后的数据
      department: [],//发布范围中处理后的部门数据
      party: [],//发布范围中处理后的部门数据
      group: [],//发布范围中处理后的部门数据
      showAddModal: false,//展示作者列表，数据来源于用于管理
      keyAddModal: 1,//作者列表的key值
      inputValue: '',//查询时输入框的内容
      selectedRowKeys: [],//当前选中
      currentValue: '',//文章归属  单选按钮选中的值
      set: function () { },
      categoryIdList: [],//编辑时选中的栏目
      authorOption: [],
      partyRootId: '',
      dpRootId: '',
      update: 0,
      //三个步骤对象
      steps: [
        {
          title: '填写文章信息',
          content: [],
          updateUrl: 'services/servicemanager/event/updateEvent',
          data: {},
        },
        {
          title: '选择发布范围',
          content: '',
          online: 'services/servicemanager/event/pushNotifications/', //朱劲松  2018-12-21 BUG 2587
          url: 'services/servicemanager/event/updateEvent',
          data: {},
        },
      ],
    };
  }
  componentDidMount() {
    //页面相关的数据处理
    this.dealData();
  }
  dealData = () => {
    //资讯归属
    //获取部门的数据
    getService(API_PREFIX + 'services/system/organization/organizationListNotUserList/get/0', data => {
      if (data.retCode === 1) {
        this.setState({
          dpRootId: data.root.list && data.root.list[0].id,
        });

      }
    });
    //获取党组织数据
    //获取党组织机构中的数据
    getService(API_PREFIX + 'services/system/partyOrganization/partyOrganizationList/get', data => {
      if (data.retCode === 1) {
        this.setState({
          partyRootId: data.root.list && data.root.list[0].id,
        });
      }
    });
    //文章类型   lookup字典中的数据
    getService(API_PREFIX + 'services/lookup/init/newsType', data => {
      //返回数据处理
      this.dealLookup(data);
      this.setState({ newsTypeOptions: data }, () => {
        let temp = [...this.state.steps];
        const informationForm = [
          // { key: 'content', label: '提醒内容', type: 'input', required: true ,max:20},
          { key: 'content', label: '提醒内容', type: 'textarea', required: true, max: 500 }, // 朱劲松  修改type BUG 2754
          { key: 'remindType', label: '提醒方式', type: 'radioButton', option: isOrNotOption },
          { key: 'remindTime', label: '提醒时间', type: 'datePicker', required: true },
          { label: '关联类型', type: 'relation', hide: ['2'], remind: true },
          { key: 'relationType' },
          { key: 'relationAddress' },
        ];
        temp[0].content = informationForm;
        this.setState({ steps: temp, update: this.state.update + 1 });
      });
    });

    // 获取具体的数据
    getService(API_PREFIX + `services/servicemanager/event/queryEventById/${this.state.newsId}`, data => {
      if (data.retCode == 1) {
        let temp = [...this.state.steps];
        let allData = data.root.object;
        temp[0].data = data.root.object; //基本信息  (归属部门的数据为：treepath)

        temp[1].data = {
          id: allData.id,
          department: allData.dept,
          groups: allData.groups,
          partyid: allData.party,
        };
        // temp[2].data = data.root.object;//其他设置
        this.setState({ steps: temp, update: this.state.update + 1 });
      }
    });

    //积分提供方 所属部门 使用之前部门接口   仅仅是为了修改时，渲染整棵树
    //获取部门的数据
    // let organizationData = [];
    // getService(API_PREFIX + 'services/system/organization/organizationList/get',data=>{
    //   if (data.retCode === 1) {
    //     organizationData = data.root.list;
    //     //组织机构的数据
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
    //     //   ]
    //     //   temp[2].content =otherForm;
    //       this.setState({steps:temp,update:this.state.update+1});
    //     });

    //   }
    // });
    //获取详情中发布范围中的数据
    // getService(API_PREFIX+`services/system/cateogry/news/artical/orgList/get/${this.state.newsId}`,data=>{
    //   if(data.retCode==1){
    //     console.log("this.state",data.root.object);
    //     //部门中的数据处理
    //     this.dealPartment( data.root.object.organizationList);
    //     //党组织的数据处理
    //     this.dealPartyData(data.root.object.partyOrganizationsList);

    //     //虚拟群组中的数据处理
    //     this.dealGroupData(data.root.object.virtualGroupList);
    //     let finallyData={
    //       id:this.state.newsId,
    //       department:"",
    //       partyid:"",
    //       groups:"",
    //     }
    //     console.log("this.state",this.state.department);
    //     console.log("this.state",this.state.party);
    //     console.log("this.state",this.state.group);

    //     if(this.state.department){
    //       finallyData.department=this.state.department.toString();
    //     }
    //     if(this.state.party){
    //       finallyData.partyid=this.state.party.toString();
    //     }
    //     if(this.state.group){
    //       finallyData.groups=this.state.group.toString();
    //     }
    //     console.log("发布权限中的数据：",finallyData);
    //     let temp= [...this.state.steps];
    //     temp[1].data=finallyData;
    //     this.setState({steps:temp,update:this.state.update+1});
    //   }
    // });

  }
  //处理栏目中的数据（提取出authSelected为true的节点id）
  //   dealTreeData(data){

  //     // if(data.authSelected){
  //     //
  //     //   this.state.categoryIdList.push(item.id);
  //     // }
  //     // this.state.categoryIdList.push(data.id);
  //     data.map((item,index)=>{
  //       console.log("data.authSelected",item);
  //       console.log("data.authSelected",item.authSelected);
  //         if(item.authSelected){//为true则
  //           this.state.categoryIdList.push(item.id);
  //         }
  //         if(item.subCategoryList){
  //           this.dealTreeData(item.subCategoryList);
  //         }

  //     });
  // }

  //   //处理部门中的数据
  //   dealPartment(data){
  //     data.map((item,index)=>{
  //       if(item.authSelected){//为true则
  //         this.state.department.push(item.id);
  //       }
  //       if(item.subOrganizationList){
  //         this.dealPartment(item.subOrganizationList);
  //       }
  //     });
  //   }
  //   //处理党组织中的数据
  //   dealPartyData(data){
  //     data.map((item,index)=>{
  //       if(item.authSelected){//为true则
  //         this.state.party.push(item.id);
  //       }
  //       if(item.partyOrganizationList){
  //         this.dealPartyData(item.partyOrganizationList);
  //       }
  //     });
  //   }
  //   //处理虚拟群组中的数据
  //   dealGroupData(data){
  //     data.map((item,index)=>{
  //       if(item.authSelected){//为true则
  //         this.state.group.push(item.id);
  //       }
  //       if(item.children){
  //         this.dealGroupData(item.children);
  //       }
  //     });
  //   }
  //   //处理组织机构中的数据
  //   dealDepartmentData(data){
  //     data.map((item,index)=>{
  //       item.value=item.id+'';
  //       item.label=item.name;
  //       item.children=item.subOrganizationList;
  //       if(item.subOrganizationList){//不为空，递归
  //         this.dealDepartmentData(item.subOrganizationList);
  //       }
  //     });
  //   }
  //处理lookup字典中的数据
  dealLookup(data) {
    data.map((item, index) => {
      item.key = item.code;
      item.value = item.desp;
    });
  }

  render() {
    const timePush = {
      body: {
        'taskName': '文章定时发布任务',
        'operateType': 1,
        'queryType': 'get',
        'queryUrl': API_PREFIX + `services/servicemanager/event/pushNotifications/`,
        'queryValue': {
        },
        'queryContentType': 'application/json',
      },
    };
    return (
      <div>
        <NewEventAndInfoAdd
          key={this.state.update}
          type="information"
          steps={this.state.steps}
          // style="edit"
          style='remindEdit'
          id={{ id: this.state.newsId }}
          save="/Service/RemindList"
          timePush={timePush}
          belonged="article"
          RemindType='remind'
          addOldKey='RemindOld'
          partyRootId={this.state.partyRootId}
          dpRootId={this.state.dpRootId}
        >
        </NewEventAndInfoAdd>
      </div>
    );
  }

}

const isOrNotOption = [
  { label: '消息推送', value: 1 },
  // { label: '短信', value: 2},
];
export default EditArticle;