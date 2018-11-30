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
class NewArticle extends  Component{
  constructor(props){
    super(props);
    this.state={
      newsTypeOptions:[],//文章类型(lookup字典中)
      dp:[],//文章归属部门
      partyData:[],//文章归属党组织
      showAddModal:false,//展示作者列表，数据来源于用于管理
      keyAddModal:1,//作者列表的key值
      inputValue:'',//查询时输入框的内容
      selectedRowKeys:[],//当前选中
      currentValue:'',//文章归属  单选按钮选中的值
      set:function(){},
      authorOption:[],
      update:0,
      //三个步骤对象
      steps:[
        {
          title:'填写文章信息',
          content:[{ key: 'type', label: '文章类型', type: 'information_type', option: [], required: true},
            { key: 'title', label: '文章标题', type: 'input', required: true },
            { key: 'digest', label: '文章摘要', type: 'input' },
            {
              key: 'adminid', label: '作者', type: 'select', option: [], disabled: true, ButtonList: [
                { key: 'adminid', label: '添加作者', type: 'Button', onClick: this.addAuthor },
                { key: 'adminid', label: '删除作者', type: 'Button', onClick: this.deleteAuthor },
              ]},
            { key: 'orgId', label: '视频归属', type: 'belong', required: true},
            { key: 'layout', label: '布局形式', type: 'radioButton', option:PicLayoutOption ,required: true ,hide:['1','4','5','10']},
            { key: 'layout', label: '布局形式', type: 'radioButton', option:layoutOption ,required: true ,hide:['4','10','2']},
            { key: 'titleimage', label: '标题图片', type: 'uploadPicture_drop',required: true,isIamge:true},
            { key: 'picUrl', label: '内容图片', type: 'uploadPicture_button',describe:true,hide:['4','10'],isIamge:true},
            { key: 'isatlas', label: '是否设置为图集', type: 'radioButton', option:atlasOption ,required: true },
            { key: 'imagetype', label: '图片类型', type: 'radioButton', option:imageTypeOp },
            { key: 'content', label: '文章内容', type: 'richText',hide:['2','4','10']}, //rich text
            {  label: '关联类型测试', type: 'relation',hide:['2']},
            { key: 'fileUrl', label: '上传附件', type: 'uploadPicture_button', describe:false,hide:['2'],isAttach:true},
            { key: 'categoryIdList', label: '所属栏目', type: 'checkTree', required: true },
            {key:'belongOrgType'},
            {key:'orgid'},
            {key:'relationType'},
            {key:'relationAddress'},
          ],

          url:'services/news/artical/addNews',
          updateUrl:'services/news/artical/update',
        },
        {
          title:'选择发布范围',
          content:'',
          url:'services/news/artical/update/updateNewsAutho',
        },
        {
          title:'其他设置',
          content:[],
          url:'services/news/artical/update/updateNewsOtherSettings',
          onlineUrl: 'services/news/artical/newsInfo/publish',
        },
      ],
    };
  }
  componentDidMount(){
    //页面相关的数据处理
    this.dealData();
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
          { key: 'type', label: '文章类型', type: 'information_type', option: this.state.newsTypeOptions, required: true},
          { key: 'title', label: '文章标题', type: 'input', required: true ,max:20},
          { key: 'digest', label: '文章摘要', type: 'input' },
          { key: 'adminid', label: '作者', type: 'select',option:this.state.authorOption,disabled:true,ButtonList:[
            { key: 'adminid', label: '添加作者', type: 'Button', onClick: this.addAuthor },
            { key: 'adminid', label: '删除作者', type: 'Button', onClick: this.deleteAuthor },
          ],
          },
          { key: 'orgId', label: '视频归属', type: 'belong', required: true},
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
          {key:'orgid'},

        ];
        temp[0].content =informationForm;
        // this.setState({steps:temp});
        this.setState({steps:temp,update:this.state.update+1});

      });
    });
    //所属部门 使用之前部门接口
    //获取部门的数据
    let organizationData = [];
    getService(API_PREFIX + 'services/system/organization/organizationList/get',data=>{
      if (data.retCode === 1) {
        organizationData = data.root.list;
        this.dealDepartmentData(organizationData);
        this.setState({ dp:organizationData},()=>{
          let temp= [...this.state.steps];
          //步骤对象3：其他设置
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
    //获取党组织数据
    //获取党组织机构中的数据
    let partyOrganizationData = [];
    getService(API_PREFIX +'services/system/partyOrganization/partyOrganizationList/get',data=>{
      if (data.retCode === 1) {
        partyOrganizationData = data.root.list;
        this.dealPartyOrganaitonData(partyOrganizationData);
        this.setState({partyOrganization: partyOrganizationData });

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
  // 处理党组织关系的函数
  dealPartyOrganaitonData(po){
    po.map((item,index)=>{
      item.key=item.id+'';
      item.children=item.partyOrganizationList;
      if(item.partyOrganizationList){
        this.dealPartyOrganaitonData(item.partyOrganizationList);
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
      temp[0].content[3] = {
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
  //文章归属 单选按钮点击事件
  onChange=(e)=>{
    console.log('radio checked', e.target.value);
    this.setState({
      currentValue: e.target.value,
    });

  }
  render(){
    console.log('dp',this.state.newsTypeOptions);
    console.log('this.state.steps',this.state.steps);

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
        'queryUrl': API_PREFIX+'services/news/artical/newsInfo/publish/',
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
          // linkTo="/InformationManagement/Article"
          save="/InformationManagement/Article"
          timePush={timePush}
          belonged="article"
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
  { label: '是', value:true },
  { label: '否', value: false },
];
const isOrNotOption=[
  { label: '是', value: true },
  { label: '否', value: false},
];
const isRequiredOption=[
    { label: '是', value: 2 },
    { label: '否', value: 1},
];


export default NewArticle;
