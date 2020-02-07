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
class EditArticle extends  Component{
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
      authorOption:[],
      partyRootId:'',
      dpRootId:'',
      update:0,
      //三个步骤对象
       steps:[
        {
          title:'填写文章信息',
          content:[
            { key: 'type', label: '文章类型', type: 'information_type', option: [], required: true},
            { key: 'title', label: '文章标题', type: 'input', required: true ,max:20},
            { key: 'digest', label: '文章摘要', type: 'input' },
            {
              key: 'adminid', label: '作者', type: 'select', option: [], disabled: true, ButtonList: [
                { key: 'adminid', label: '添加作者', type: 'Button', onClick: this.addAuthor },
                { key: 'adminid', label: '删除作者', type: 'Button', onClick: this.deleteAuthor },
              ]},
            { key: 'orgId', label: '文章归属', type: 'belong', required: true},
            { key: 'layout', label: '布局形式', type: 'radioButton', option:PicLayoutOption ,required: true ,hide:['1','4','5','10']},
            { key: 'layout', label: '布局形式', type: 'radioButton', option:layoutOption ,required: true ,hide:['4','10','2']},
            { key: 'titleimage', label: '标题图片', type: 'uploadPicture_drop',required: true,isIamge:true},
            { key: 'picUrl', label: '内容图片', type: 'uploadPicture_button',describe:true,hide:['4','10'],isIamge:true},
            { key: 'isatlas', label: '是否设置为图集', type: 'radioButton', option:atlasOption ,required: true },
            { key: 'imagetype', label: '图片类型', type: 'radioButton', option:imageTypeOp },
            { key: 'content', label: '文章内容', type: 'richText',hide:['2','4','10'],required: true}, //rich text
            {  label: '关联类型测试', type: 'relation',hide:['2']},
            { key: 'fileUrl', label: '上传附件', type: 'uploadPicture_button', describe:false,hide:['2'],isAttach:true},
            { key: 'categoryIdList', label: '所属栏目', type: 'checkTree', required: true },
            {key:'belongOrgType'},
            {key:'relationAddress'},
            {key:'relationType'},
            {key:'orgid'},
          ],
          updateUrl:'services/news/artical/update',
          data:{},
        },
        {
          title:'选择发布范围',
          content:'',
          url:'services/news/artical/update/updateNewsAutho',
          data:{}
        },
        {
          title:'其他设置',
          content:[
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
          ],
          url:'services/news/artical/update/updateNewsOtherSettings',
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
  //处理lookup字典中的数据
  dealLookup(data){
    data.map((item,index)=>{
      item.key=item.code;
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
    console.log("选中的值为：",selectedData[0].userId);
    this.setState({
          authorOption:[
            { value:selectedData[0].lastname, key:  selectedData[0].userId},
          ]
        },()=>{
          let temp= [...this.state.steps];
          temp[0].content[3]={ key: 'adminid', label: '作者', type: 'select',option:this.state.authorOption,disabled:true};
          this.setState({
            steps:temp
          },()=>{
            this.state.set(
                'adminid',selectedData[0].userId
            );
            console.log("*****************");

          });
        }
    )
  }
//展示添加作者modal 点击取消
  handleAddModalCancel=()=>{
    this.setState({showAddModal:false});
  }
  //新增作者时输入框输入值的变化
  handleInput=(e)=>{
    // console.log("value",value);
    this.props.getData(ServiceApi+`services/system/systemAndCompanyUser/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=lastname_S_LK=${e.target.value}`);
  }
  //文章归属 单选按钮点击事件
  onChange=(e)=>{
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
    const timePush = {
      body: {
        'taskName': '文章定时发布任务',
        'operateType': 1,
        'queryType': 'get',
        'queryUrl': ServiceApi+`services/news/artical/newsInfo/publish/`,
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
              save="/InformationManagement/Article"
              timePush={timePush}
              belonged="article"
              partyRootId={this.state.partyRootId}
              dpRootId={this.state.dpRootId}
          >
          </EventAndInfoAdd>
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
            >

            </FormAndInput>
          </Modal>
        </div>
    );
  }

}
//布局形式——图片
const PicLayoutOption = [
  { label: '左右', value: 1 },
  { label: '上下', value: 2 },
  { label: '三张图片一次排开', value: 3 },
];
//布局形式——非图片
const layoutOption = [
  { label: '左右', value: 1 },
  { label: '上下', value: 2 },

];
//图片类型
const imageTypeOp=[
  { label: '大横幅', value: 1 },
  { label: '小横幅', value: 2},
];
//是否设置为图集
const atlasOption=[
  { label: '是', value: true },
  { label: '否', value: false },
]
const isOrNotOption=[
  { label: '是', value: true },
  { label: '否', value: false },
];
const isRequiredOption=[
    { label: '是', value: 2 },
    { label: '否', value: 1 },
];
export default EditArticle;