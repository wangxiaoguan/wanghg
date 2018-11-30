import React, { Component} from 'react';
import { Tabs,Select,Button,message, Table,Input,Modal,Form,Radio,Cascader} from 'antd';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import FormAndInput from '../../../component/table/FormAndInput';
import TableAndSearch from '../../../component/table/TableAndSearch';
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
class Addlearn extends  Component{
  constructor(props){
    super(props);
    this.state={
     
     
      set:function(){},
      authorOption:[],
      update:0,
      steps:[
        {
          title:'填写学习信息',
          content:[
            { key: 'title', label: '学习名称', type: 'input', required: true,max:20 },//学习名称
            { key: 'titleimage', label: '标题图片', type: 'uploadPicture_drop',required: true,isIamge:true},//标题图片
            { key: 'isrequired', label: '是否必修', type: 'information_type', option: [], required: true},//是否必修
            { key: 'content', label: '学习内容', type: 'richText',hide:['2','4','10']}, //学习内容
            { key: 'videoUrl', label: '视频地址', type: 'input' },
            { key: 'videoTime', label: '视频时长', type: 'input' },
            { key: 'videoDesp', label: '视频描述', type: 'input' },
            { key: 'studytime', label: '学习时长',type: 'inputNumber1'},
            { key: 'relation', label: '关联考试', type: 'relation_test' },
            { key: 'treasure', label: '奖励党员荣誉积分', type: 'inputNumber' },
            { key: 'fileUrl', label: '学习附件', type: 'uploadPicture_button', describe:false,hide:['2'],isAttach:true},
            { key: 'istimepush', label: '是否定时发送', type: 'isTimePush', required: true },
          ],
          url:'services/partybuilding/partyNews/addNews',
          updateUrl:'services/partybuilding/partyNews/update',
        },
        {
          title:'设置接收人',  
          content:[{ key: 'categoryIdList', label: '接收人', type: 'checkTree', required: true },],
          url:'services/partybuilding/partyNews/update/updateNewsAutho',
          onlineUrl: 'services/partybuilding/partyNews/newsInfo/publish',
        },
      
      ],
    };
  }
  componentDidMount(){
    //页面相关的数据处理
    this.dealData();
  }
  dealData=()=>{
    
        //为steps设置值
        let temp= [...this.state.steps];
        //step1：基本信息
        const informationForm=[
          { key: 'title', label: '学习名称', type: 'input', required: true },//学习名称
          { key: 'titleimage', label: '标题图片', type: 'uploadPicture_drop',required: true,isIamge:true},//标题图片
          { key: 'isrequired', label: '是否必修', type: 'isrequired_learn', option: isrequired, required: true},//是否必修
          { key: 'content', label: '学习内容', type: 'richText',hide:['2','4','10'],required: true}, //学习内容
          { key: 'videoUrl', label: '视频地址', type: 'input' },
          { key: 'videoTime', label: '视频时长', type: 'input' },
          { key: 'videoDesp', label: '视频描述', type: 'input' },
          { key: 'studytime', label: '学习时长',type: 'inputNumber1'},
          { key: 'examid', label: '关联考试', type: 'relation_test' },
          { key: 'treasure', label: '奖励党员荣誉积分', type: 'inputNumber2',required: false },
          { key: 'fileUrl', label: '学习附件', type: 'uploadPicture_button', describe:false,hide:['2'],isAttach:true},
          { key: 'istimepush', label: '是否定时发送', type: 'isTimePush', required: true },
        ];
        temp[0].content =informationForm;
        // this.setState({steps:temp});
        this.setState({steps:temp,update:this.state.update+1});
       //获取党组织数据
    //获取党组织机构中的数据
    let partyOrganizationData = [];
    getService(API_PREFIX +'services/system/partyOrganization/partyOrganizationList/get',data=>{
      if (data.retCode === 1) {
        partyOrganizationData = data.root.list;
      }
    });
  }

  render(){
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
        'taskName': '文章定时发布任务',
        'operateType': 1,
        'queryType': 'get',
        'queryUrl': API_PREFIX+'services/partybuilding/partyNews/newsInfo/publish/',
        'queryValue': {
        },
        'queryContentType': 'application/json',
      },

    };
    return(
      <div>
        <EventAndInfoAdd
          update={this.state.update}
          type="information"
          steps={this.state.steps}
          submitText="保存并发布"
          style="add"
          save="/PartyBuildGarden/PartyLearning"
          timePush={timePush}
          belonged="article"
        />
      </div>
    );
  }
}
//是否必修
const isrequired = [
  {key:1,  value:'选修' },
  {key:2,  value:'必修' },
];

export default Addlearn;
