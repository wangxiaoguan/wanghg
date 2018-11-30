import React, { Component } from 'react';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import { Tabs,Select,Button,message, Table,Input,Modal,Form,Radio,Cascader} from 'antd';
import {postService,getService} from '../../myFetch';
import FormAndInput from '../../../component/table/FormAndInput';
import API_PREFIX from '../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action/table/table';
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
class NewVideo extends Component{
  constructor(props){
    super(props);
    this.state={
      dp:[],//视频归属部门
      showAddModal:false,//展示作者列表，数据来源于用于管理
      keyAddModal:1,//作者列表的key值
      set:function(){},
      authorOption:[],
      update:0,
      //三个步骤对象
      steps:[
        {
          title:'填写视频信息',
          content:[ { key: 'title', label: '视频标题', type: 'input', required: true },
            { key: 'digest', label: '视频摘要', type: 'input' },
            {
              key: 'adminid', label: '作者', type: 'select', option: [], disabled: true, ButtonList: [
                { key: 'adminid', label: '添加作者', type: 'Button', onClick: this.addAuthor },
                { key: 'adminid', label: '删除作者', type: 'Button', onClick: this.deleteAuthor },
              ]},
            { key: 'orgId', label: '视频归属', type: 'belong', required: true},
            { key: 'layout', label: '布局形式', type: 'radioButton', option:layoutOption ,required: true },
            { key: 'titleimage', label: '标题图片', type: 'uploadPicture_drop',required: true,isIamge:true},
            { key: 'picUrl', label: '内容图片', type: 'uploadPicture_button', describe:true,required:true,isIamge:true},
            { key: 'content', label: '视频内容', type: 'richText',required:false}, //rich text
            { key: 'video', label: '视频地址', type: 'video', required:true},
            {key:'videoUrl'},
            {key:'videoDesp'},
            {key:'videoTime'},
            { key: 'islive', label: '直播', type: 'live_type'},

            {key:'channel'},
            {key:'channelcontent'},
            { key: 'barrage', label: '弹幕', type: 'radioButton',option:barrageOption },
            { key: 'categoryIdList', label: '所属栏目', type: 'checkTree', required: true },
            {key:'belongOrgType'},
            {key:'orgid'},
          ],
          url:'services/news/video/addNews',
          updateUrl:'services/news/video/update',
        },
        {
          title:'选择发布范围',
          content:'',
          url:'services/news/video/update/updateNewsAutho',
        },
        {
          title:'其他设置',
          content:[],
          url:'services/news/video/update/updateNewsOtherSettings',
          onlineUrl: 'services/news/video/newsInfo/publish',
        },
      ],

    };
  }
  componentDidMount(){
    //页面相关的数据处理
    this.dealData();
    //为steps设置值
    let temp= [...this.state.steps];
    const informationForm=[
      { key: 'title', label: '视频标题', type: 'input', required: true,max:20 },
      { key: 'digest', label: '视频摘要', type: 'input' },
      {
        key: 'adminid', label: '作者', type: 'select', option: this.state.authorOption, disabled: true, ButtonList: [
          { key: 'adminid', label: '添加作者', type: 'Button', onClick: this.addAuthor },
          { key: 'adminid', label: '删除作者', type: 'Button', onClick: this.deleteAuthor },
        ]},
      { key: 'orgId', label: '视频归属', type: 'belong', required: true},
      { key: 'layout', label: '布局形式', type: 'radioButton', option:layoutOption ,required: true },
      { key: 'titleimage', label: '标题图片', type: 'uploadPicture_drop',required: true,isIamge:true},
      { key: 'picUrl', label: '内容图片', type: 'uploadPicture_button', describe:true,required:true,isIamge:true},
      { key: 'content', label: '视频内容', type: 'richText',required:false}, //rich text
      { key: 'video', label: '视频地址', type: 'video',required:true},
      { key: 'islive', label: '直播', type: 'live_type'},
      {key:'videoUrl'},
      {key:'videoDesp'},
      {key:'videoTime'},
      {key:'channel'},
      {key:'channelcontent'},
      {key:'belongOrgType'},
      {key:'orgid'},
      { key: 'barrage', label: '弹幕', type: 'radioButton',option:barrageOption },
      { key: 'categoryIdList', label: '所属栏目', type: 'checkTree', required: true },
    ];
    temp[0].content =informationForm;
    this.setState({steps:temp,update:this.state.update+1});
  }
  dealData=()=> {
    //获取部门的数据
    let organizationData = [];
    getService(API_PREFIX + 'services/system/organization/organizationList/get', data => {
      if (data.retCode === 1) {
        organizationData = data.root.list;
        this.dealDepartmentData(organizationData);
        this.setState({dp: organizationData},()=>{
          let temp= [...this.state.steps];
          //其他设置
          const otherForm=[
            { key: 'point', label: '奖励经验值数', type: 'inputNumber' },
            { key: 'treasure', label: '奖励积分数', type: 'inputNumber' },
            { key: 'treasureProvider', label: '积分提供方',type: 'cascader',options:this.state.dp},
            { key: 'isrequired', label: '是否必修',  type: 'radioButton', option: isRequiredOption, required: true },
            { key: 'iscomment', label: '是否可评论', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isnonamecomment', label: '是否可匿名评论', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isshare', label: '是否可分享',  type: 'radioButton', option: isOrNotOption , required: true},
            { key: 'isinnershare', label: '是否只能内部转发', type: 'radioButton', option: isOrNotOption , required: true},
            { key: 'ishomepage', label: '是否上首页',  type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'ispush', label: '是否推送',  type: 'radioButton', option: isOrNotOption , required: true},
            { key: 'istimepush', label: '是否定时发送', type: 'isTimePush', required: true },
          ];
          temp[2].content =otherForm;
          this.setState({steps:temp,update:this.state.update+1});
        });



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
  //添加作者
  addAuthor= (key,get,set) =>{
    this.setState({
      showAddModal:true,
      keyAddModal:this.state.keyAddModal+1,
      set,
    },()=>{
      console.log('showAddModal',this.state.showAddModal);
    });


  }
  //删除作者
  deleteAuthor=(key,get,set) =>{
    set(key,'');//将对应的input（通过key对应）框置空
  }

  //展示添加作者modal  点击确定
  handleAddModalOK=()=>{
    this.setState({showAddModal:false});
    let selectedData=this.props.selectRowsData;
    console.log('选中的值为：',selectedData[0].userId);
    this.setState({
      authorOption:[
        { value:selectedData[0].lastname, key:  selectedData[0].userId},
      ],
    },()=>{
      let temp= [...this.state.steps];
          temp[0].content[2] = {
            key: 'adminid', label: '作者', type: 'select', option: this.state.authorOption, disabled: true, ButtonList: [
              { key: 'adminid', label: '添加作者', type: 'Button', onClick: this.addAuthor },
              { key: 'adminid', label: '删除作者', type: 'Button', onClick: this.deleteAuthor },
            ]};
      this.setState({
        steps:temp,
      },()=>{
        this.state.set(
          'adminid',selectedData[0].userId
        );
        console.log('*****************');

      });
    }
    );
  }
  //展示添加作者modal 点击取消
  handleAddModalCancel=()=>{
    this.setState({showAddModal:false});
  }
  //新增作者时输入框输入值的变化
  handleInput=(e)=>{
    // console.log("value",value);
    this.props.getData(API_PREFIX+`services/system/systemAndCompanyUser/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=lastname_S_LK=${e.target.value}`);
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
        'taskName': '视频定时发布任务',
        'operateType': 1,
        'queryType': 'get',
        'queryUrl': API_PREFIX+'services/news/video/newsInfo/publish/',
        'queryValue': {
        },
        'queryContentType': 'application/json',
      },

    };
    return(
      <div>
        <EventAndInfoAdd
          update={this.state.update}
          // key={this.state.update}
          type="information"
          steps={this.state.steps}
          submitText="保存并发布"
          style="add"
          save="/InformationManagement/Video"
          timePush={timePush}
          belonged="video"
        />
        <Modal
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
          />
        </Modal>
      </div>
    );
  }

}
//布局形式
const layoutOption = [
  { label: '左右', value: '1' },
  { label: '上下', value: '2' },
];
const isOrNotOption=[
  { label: '是', value: 'true' },
  { label: '否', value: 'false' },
];
const belongsOption=[
  { label: '按照企业部门归属', value: '1' },
  { label: '按照党组织归属', value: '2' },
];
const barrageOption=[
  { label: '显示', value:true },
  { label: '不显示', value:false },
];

const isRequiredOption=[
  { label: '是', value: 2 },
  { label: '否', value: 1 },
];

export default NewVideo;