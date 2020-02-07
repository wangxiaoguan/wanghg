import React, { Component } from 'react';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import {GetQueryString,getService} from '../../myFetch';
import ServiceApi from '../../apiprefix';
class Detaillearn extends  Component{
  constructor(props){
    super(props);
    this.state={
      newsId:GetQueryString(location.hash,['Id']).Id,//获取前一个页面传过来的id
      update:0,
      //三个步骤对象
      steps:[
        {
          title:'填写文章信息',
          content:[],
          data:{},
        },
        {
          title:'设置接收人',
          content:'',
          data:{}
        },
       
      ],
    }
  }

  componentDidMount(){
    //页面相关的数据处理
    this.dealData();
   
  }
  dealData=()=>{
    console.log('this.state.newsId',this.state.newsId)

    //获取党组织数据
    //获取党组织机构中的数据
    getService(ServiceApi +'services/system/partyOrganization/partyOrganizationList/get',data=>{
      if (data.retCode === 1) {
        this.setState({
          partyRootId:data.root.list&&data.root.list[0].id,
        });
      }
    });

        let temp= [...this.state.steps];
        const informationForm=[
          { key: 'title', label: '学习名称', type: 'input', required: true,max:20 },//学习名称
          { key: 'titleimage', label: '标题图片', type: 'uploadPicture_drop',required: true,isIamge:true},//标题图片
          { key: 'isrequired', label: '是否必修', type: 'isrequired_learn', option: isrequired, required: true},//是否必修
          { key: 'content', label: '学习内容', type: 'richText',hide:['2','4','10'],required: true}, //学习内容
          { key: 'videoUrl', label: '视频地址', type: 'input' },
          { key: 'timelong', label: '视频时长', type: 'input' },
          { key: 'videoDesp', label: '视频描述', type: 'input' },
          { key: 'studytime', label: '学习时长',type: 'inputNumber1'},
          { key: 'relation', label: '关联考试', type: 'relation_test' },
          { key: 'treasure', label: '奖励党员荣誉积分', type: 'inputNumber' },
          { key: 'fileUrl', label: '学习附件', type: 'uploadPicture_button', describe:false,hide:['2'],isAttach:true},
          { key: 'istimepush', label: '是否定时发送', type: 'isTimePush', required: true },
        ];
        temp[0].content =informationForm;
        this.setState({steps:temp,update:this.state.update+1});
    
    //获取具体的数据   GET /partybuilding/partyNews/newsInfo/get/{newsId}
    getService(ServiceApi+`services/partybuilding/partyNews/newsInfo/get/${this.state.newsId}`,data=>{
      if(data.retCode==1){
        console.log("this.state",data.root.object);
        let temp= [...this.state.steps];
        temp[0].data = data.root.object; //基本信息  
       
        this.setState({steps:temp,update:this.state.update+1});

      }
    });
   
      getService(ServiceApi+`services/system/cateogry/news/artical/orgList/get/${this.state.newsId}`,data=>{
      if(data.retCode==1){
        console.log("this.state",data.root.object);
        //部门中的数据处理
        this.dealPartment( data.root.object.organizationList);
        //党组织的数据处理
        this.dealPartyData(data.root.object.partyOrganizationsList);

        //虚拟群组中的数据处理
        this.dealGroupData(data.root.object.virtualGroupList);
        let finallyData={
          id:this.state.newsId,
          department:"",
          partyid:"",
          groups:"",
        }
       

        if(this.state.department){
          finallyData.department=this.state.department.toString();
        }
        if(this.state.party){
          finallyData.partyid=this.state.party.toString();
        }
        if(this.state.group){
          finallyData.groups=this.state.group.toString();
        }
        let temp= [...this.state.steps];
        temp[1].data=finallyData,
            this.setState({steps:temp,update:this.state.update+1});
      }
    });

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
    return(
        <div>
          <EventAndInfoAdd
              key={this.state.update}
              type="information"
              steps={this.state.steps}
              style="detail"
              id={{ id:this.state.newsId}}
              save="/InformationManagement/Article"
              belonged="article"
              partyRootId={this.state.partyRootId}
              dpRootId={this.state.dpRootId}
          >
          </EventAndInfoAdd>
         
        </div>
    );
  }

}
//是否必修
const isrequired = [
  {key:1,  value:'选修' },
  {key:2,  value:'必修' },
];

export default Detaillearn;