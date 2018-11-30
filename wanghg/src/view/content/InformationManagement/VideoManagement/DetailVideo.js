import React, { Component } from 'react';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import FormAndInput from '../../../component/table/FormAndInput';
import { Tabs,Select,Button,message, Table,Input,Modal,Form,Radio,Cascader} from 'antd';
import {GetQueryString,getService} from '../../myFetch';
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
class DetailVideo extends Component{
  constructor(props){
    super(props);
    this.state={
      newsTypeOptions:[],//文章类型(lookup字典中)
      dp:[],//文章归属部门
      newsId:GetQueryString(location.hash,['newsId']).newsId,//获取前一个页面传过来的id
      newsData:{},//详情中的数据
      releaseRange:[],//发布范围中处理后的数据
      department:[],//发布范围中处理后的部门数据
      party:[],//发布范围中处理后的部门数据
      group:[],//发布范围中处理后的部门数据
      showAddModal:false,//展示作者列表，数据来源于用于管理
      keyAddModal:1,//作者列表的key值
      inputValue:'',//查询时输入框的内容
      selectedRowKeys:[],//当前选中
      currentValue:'',//文章归属  单选按钮选中的值
      set:function(){},
      categoryIdList:[],//编辑时选中的栏目
      partyRootId:'',
      dpRootId:'',
      update:0,
      //三个步骤对象
      steps:[
        {
          title:'填写视频信息',
          content:[
            { key: 'title', label: '视频标题', type: 'input', required: true,max:20  },
            { key: 'digest', label: '视频摘要', type: 'input' },
            { key: 'author', label: '作者', type: 'input' },
            // { key: 'author', label: '添加作者', type: 'Button',onClick:this.addAuthor},
            // { key: 'author', label: '删除作者', type: 'Button',onClick:this.deleteAuthor},
            { key: 'orgId', label: '视频归属', type: 'belong', required: true},
            { key: 'layout', label: '布局形式', type: 'radioButton', option:layoutOption ,required: true },
            { key: 'titleimage', label: '标题图片', type: 'uploadPicture_drop',required: true,isIamge:true},
            { key: 'picUrl', label: '内容图片', type: 'uploadPicture_button', describe:true,isIamge:true},
            { key: 'content', label: '视频内容', type: 'richText',required:false}, //rich text
            { key: 'video', label: '视频地址', type: 'video', required:true},
            {key:'videoUrl'},
            {key:'videoDesp'},
            {key:'videoTime'},
            { key: 'islive', label: '直播', type: 'live_type'},
            {key:'channel'},
            {key:'channelcontent'},
            {key:'belongOrgType'},
            {key:'orgid'},
            { key: 'barrage', label: '弹幕', type: 'radioButton',option:barrageOption },
            { key: 'categoryIdList', label: '所属栏目', type: 'checkTree', required: true },
          ],
          data:{},
        },
        {
          title:'选择发布范围',
          content:'',
          data:{}
        },
        {
          title:'其他设置',
          content:[],
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
    //获取所选栏目中的数据
    getService(API_PREFIX+`services/system/cateogry/news/artical/updateNews/authCategoryTree/get/${this.state.newsId}`,data=>{
      if(data.retCode==1){
        console.log("处理前的数据：data.root.list[0].subCategoryList",data.root.list[0].subCategoryList);
        this.dealTreeData(data.root.list[0].subCategoryList);

        let body={};
        // data.root.object.categoryIdList=this.state.categoryIdList.toString();//给选中的栏目赋值
        let temp= [...this.state.steps];
        if(this.state.categoryIdList.toString()){
          body={
            categoryIdList:this.state.categoryIdList.toString()
          }
          temp[0].data =body; //基本信息  (归属部门的数据为：treepath)
        }
        const informationForm=[
          { key: 'title', label: '视频标题', type: 'input', required: true },
          { key: 'digest', label: '视频摘要', type: 'input' },
          { key: 'author', label: '作者', type: 'input' },
          // { key: 'author', label: '添加作者', type: 'Button',onClick:this.addAuthor},
          // { key: 'author', label: '删除作者', type: 'Button',onClick:this.deleteAuthor},
          { key: 'orgId', label: '视频归属', type: 'belong', required: true},
          { key: 'layout', label: '布局形式', type: 'radioButton', option:layoutOption ,required: true },
          { key: 'titleimage', label: '标题图片', type: 'uploadPicture_drop',required: true,isIamge:true},
          { key: 'picUrl', label: '内容图片', type: 'uploadPicture_button', describe:true,isIamge:true},
          { key: 'content', label: '视频内容', type: 'richText'}, //rich text
          { key: 'video', label: '内容视频', type: 'video', required:true},
          {key:'videoUrl'},
          {key:'videoDesp'},
          {key:'videoTime'},
          { key: 'islive', label: '直播', type: 'live_type'},
          {key:'channel'},
          {key:'channelcontent'},
          {key:'belongOrgType'},
          {key:'orgid'},
          { key: 'barrage', label: '弹幕', type: 'radioButton',option:barrageOption },
          { key: 'categoryIdList', label: '所属栏目', type: 'checkTree', required: true },
        ];
        // temp[0].content =informationForm;
        this.setState({steps:temp,update:this.state.update+1});
        console.log("处理后的数据",body);
      }

    });
    //获取具体的数据
    getService(API_PREFIX+`services/news/video/newsInfo/get/${this.state.newsId}`,data=>{
      if(data.retCode==1){
        let temp= [...this.state.steps];
        temp[0].data = data.root.object; //基本信息  (归属部门的数据为：treepath)
        temp[2].data = data.root.object;//其他设置
        this.setState({steps:temp,update:this.state.update+1});

      }
    });
    //    积分提供方 所属部门 使用之前部门接口   仅仅是为了修改时，渲染整棵树
    //获取部门的数据
    let organizationData = [];
    getService(API_PREFIX + 'services/system/organization/organizationList/get',data=>{
      if (data.retCode === 1) {
        organizationData = data.root.list;
        //组织机构的数据
        this.dealDepartmentData(organizationData);
        this.setState({ dp:organizationData},()=>{
          let temp= [...this.state.steps];
          //步骤对象3：其他设置
          const otherForm=[
            { key: 'point', label: '奖励经验值数', type: 'inputNumber' },
            { key: 'treasure', label: '奖励积分数', type: 'inputNumber' },
            { key: 'treasureProvider', label: '积分提供方',type: 'cascader',options:this.state.dp},
            { key: 'isrequired', label: '是否必修',  type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'iscomment', label: '是否可评论', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isnonamecomment', label: '是否可匿名评论', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isshare', label: '是否可分享',  type: 'radioButton', option: isOrNotOption , required: true},
            { key: 'isinnershare', label: '是否只能内部转发', type: 'radioButton', option: isOrNotOption , required: true},
            { key: 'ishomepage', label: '是否上首页',  type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'ispush', label: '是否推送',  type: 'radioButton', option: isOrNotOption , required: true},
            { key: 'istimepush', label: '是否定时发送', type: 'isTimePush', required: true },

          ]
          temp[2].content =otherForm;
          this.setState({steps:temp,update:this.state.update+1});
        });

      }
    });
    //获取详情中发布范围中的数据
    getService(API_PREFIX+`services/system/cateogry/news/artical/orgList/get/${this.state.newsId}`,data=>{
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
        console.log("this.state",this.state.department);
        console.log("this.state",this.state.party);
        console.log("this.state",this.state.group);

        if(this.state.department){
          finallyData.department=this.state.department.toString();
        }
        if(this.state.party){
          finallyData.partyid=this.state.party.toString();
        }
        if(this.state.group){
          finallyData.groups=this.state.group.toString();
        }
        console.log("发布权限中的数据：",finallyData);
        let temp= [...this.state.steps];
        temp[1].data=finallyData,
            this.setState({steps:temp,update:this.state.update+1});
      }
    });

  }
  //处理栏目中的数据（提取出authSelected为true的节点id）
  dealTreeData(data){
    //资讯归属
    //获取部门的数据
    getService(API_PREFIX + 'services/system/organization/organizationList/get',data=>{
      if (data.retCode === 1) {
        this.setState({
          dpRootId:data.root.list&&data.root.list[0].id,
        });

      }
    });
    //获取党组织数据
    //获取党组织机构中的数据
    getService(API_PREFIX +'services/system/partyOrganization/partyOrganizationList/get',data=>{
      if (data.retCode === 1) {
        this.setState({
          partyRootId:data.root.list&&data.root.list[0].id,
        });
      }
    });

    // if(data.authSelected){
    //
    //   this.state.categoryIdList.push(item.id);
    // }
    // this.state.categoryIdList.push(data.id);
    data&&data.map((item,index)=>{
      console.log("data.authSelected",item);
      console.log("data.authSelected",item.authSelected);
      if(item.authSelected){//为true则
        this.state.categoryIdList.push(item.id);
      }
      if(item.subCategoryList){
        this.dealTreeData(item.subCategoryList);
      }

    });
  }

  //处理部门中的数据
  dealPartment(data){
    data&&data.map((item,index)=>{
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
    data&&data.map((item,index)=>{
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
    data&&data.map((item,index)=>{
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
    data&&data.map((item,index)=>{
      item.value=item.id+'';
      item.label=item.name;
      item.children=item.subOrganizationList;
      if(item.subOrganizationList){//不为空，递归
        this.dealDepartmentData(item.subOrganizationList);
      }
    });
  }
  //处理lookup字典中的数据
  dealLookup(data){
    data&&data.map((item,index)=>{
      item.key=parseInt(item.code);
      item.value=item.desp;
    });
  }
  //添加作者
  addAuthor= (key,get,set) =>{
    this.setState({
      showAddModal:true,
      keyAddModal:this.state.keyAddModal+1,
      set,
    },()=>{
      console.log("showAddModal",this.state.showAddModal);
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
    console.log("选中的值为：",selectedData);
    this.state.set('author',selectedData[0].lastname);
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
  //文章归属 单选按钮点击事件
  onChange=(e)=> {
    console.log('radio checked', e.target.value);
    this.setState({
      currentValue: e.target.value,
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
    console.log("部门Root",this.state.dpRootId);
    console.log("党组织Root",this.state.partyRootId);
    return(
        <EventAndInfoAdd
            key={this.state.update}
            type="information"
            steps={this.state.steps}
            style="detail"
            id={{ id:this.state.newsId}}
            save="/InformationManagement/Video"
            belonged="video"
            partyRootId={this.state.partyRootId}
            dpRootId={this.state.dpRootId}
        >
        </EventAndInfoAdd>
    );
  }
}
//布局形式
const layoutOption = [
  { label: '左右', value: 1 },
  { label: '上下', value: 2 },
];
const isOrNotOption=[
  { label: '是', value: true },
  { label: '否', value: false },
];
const barrageOption=[
  { label: '显示', value:true },
  { label: '不显示', value:false },
];
export default DetailVideo;