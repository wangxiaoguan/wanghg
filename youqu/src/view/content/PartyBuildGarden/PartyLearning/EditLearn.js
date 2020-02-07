import React, { Component } from 'react';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import FormAndInput from '../../../component/table/FormAndInput';
import { Tabs,Select,Button,message, Table,Input,Modal,Form,Radio,Cascader} from 'antd';
import {GetQueryString,getService} from '../../myFetch';
import ServiceApi from '../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action';
@connect(
    state => ({
      dataSource: state.tableData,
      pageData:state.pageData,
      selectRowsData: state.selectRowsData,
    }),
    dispatch => ({
      getData: n => dispatch(BEGIN(n)),
    })
)
class Editlearn extends  Component{
  constructor(props){
    super(props);
    this.state={
      newsId:GetQueryString(location.hash,['Id']).Id,//获取前一个页面传过来的id
      update:0,
      //三个步骤对象
      steps:[
        {
          title:'填写学习信息',
          content:[
            { key: 'title', label: '学习名称', type: 'input', required: true,max:20 },//学习名称
            { key: 'titleimage', label: '标题图片', type: 'uploadPicture_drop',required: true,isIamge:true},//标题图片
            { key: 'isrequired', label: '是否必修', type: 'isrequired_learn', option: isrequired, required: true},//是否必修
            { key: 'content', label: '学习内容', type: 'richText',hide:['2','4','10']}, //学习内容
            { key: 'videoUrl', label: '视频地址', type: 'input' },
            { key: 'videotime', label: '视频时长', type: 'input' },
            { key: 'videoDesp', label: '视频描述', type: 'input' },
            { key: 'studytime', label: '学习时长',type: 'inputNumber1'},
            { key: 'relation', label: '关联考试', type: 'relation_test' },
            { key: 'treasure', label: '奖励党员荣誉积分', type: 'inputNumber2',required: false },
            { key: 'fileUrl', label: '学习附件', type: 'uploadPicture_button', describe:false,hide:['2'],isAttach:true},
            { key: 'istimepush', label: '是否定时发送', type: 'isTimePush', required: true },
     
           
          ],
          url:'services/partybuilding/partyNews/addNews',
          updateUrl:'services/partybuilding/partyNews/update',
        },
        {
          title:'设置接收人',  
          content:'',
          url:'services/partybuilding/partyNews/update/updateNewsAutho',
          onlineUrl: 'services/partybuilding/partyNews/newsInfo/publish',
        },
      
      ],
    }
  }
  componentDidMount(){
    //页面相关的数据处理
    this.dealData();
  }
  dealData=()=>{


  }


  //处理部门中的数据
  dealPartment(data){
    data.map((item,index)=>{
      if(item.authSelected){//为true则
        this.state.department.push(item.id);
      }
      if(item.subOrganizationList){
        this.dealPartment(item.subOrganizationList);
      }
    });
  }
  //处理党组织中的数据
  dealPartyData(data){
    data.map((item,index)=>{
      if(item.authSelected){//为true则
        this.state.party.push(item.id);
      }
      if(item.partyOrganizationList){
        this.dealPartyData(item.partyOrganizationList);
      }
    });
  }
  //处理虚拟群组中的数据
  dealGroupData(data){
    data.map((item,index)=>{
      if(item.authSelected){//为true则
        this.state.group.push(item.id);
      }
      if(item.children){
        this.dealGroupData(item.children);
      }
    });
  }
  //处理组织机构中的数据
  dealDepartmentData(data){
    data.map((item,index)=>{
      item.value=item.id+'';
      item.label=item.name;
      item.children=item.subOrganizationList;
      if(item.subOrganizationList){//不为空，递归
        this.dealDepartmentData(item.subOrganizationList);
      }
    });
  }
 


  render(){
    console.log('newsTypeOptions',this.state.newsTypeOptions);
  console.log('steps',this.state.steps)
    const columns=[
      {
        title: 'ID',
        dataIndex: 'userId',
        key: 'userId',
      },

      {
        title: '姓名',
        dataIndex: 'lastname',
        key: 'lastname',
      },
      {
        title:'手机号',
        dataIndex:'mobile',
        key:'mobile',
      },
      {
        title:'部门',
        dataIndex:'orginfoName',
        key:'orginfoName',
      },
    ];
    const timePush = {
      body: {
        'taskName': '定时发布任务',
        'operateType': 1,
        'queryType': 'get',
        'queryUrl': ServiceApi+`services/partybuilding/partyNews/newsInfo/publish/`,
        'queryValue': {
        },
        'queryContentType': 'application/json',
      },

    };
    console.log("部门Root",this.state.dpRootId);
    console.log("党组织Root",this.state.partyRootId);
    return(
        <div>
          <EventAndInfoAdd
              key={this.state.update}
              type="information"
              steps={this.state.steps}
              style="edit"
              id={{ id:this.state.newsId}}
              save="/PartyBuildGarden/PartyLearning"
              timePush={timePush}
              belonged="article"
              partyRootId={this.state.partyRootId}
              dpRootId={this.state.dpRootId}
          >
          </EventAndInfoAdd>
          {/* <Modal
              title="添加用户"
              visible={this.state.showAddModal}
              cancelText="取消"
              okText="添加"
              onOk={this.handleAddModalOK}
              onCancel={this.handleAddModalCancel}
              destroyOnClose={true}

          >
            <FormAndInput
                columns={columns}
                url={'services/system/systemAndCompanyUser/list'}
                onSearch={this.handleInput}
            >

            </FormAndInput>
          </Modal> */}
        </div>
    );
  }

}

const isrequired = [
  {key:1,  value:'选修' },
  {key:2,  value:'必修' },
];
export default   Editlearn;