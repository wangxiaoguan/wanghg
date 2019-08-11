import React, { Component} from 'react';
import { Tabs,Select,Button,message, Table,Input,Modal,Form,Radio,Cascader} from 'antd';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import FormAndInput from '../../../component/table/FormAndInput';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {postService,getService} from '../../myFetch';
import ServiceApi from '../../apiprefix';
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
          content:[
            { key: 'type',    label: '文章类型', type: 'information_type', option: newsTypeOption, required: true},
            { key: 'title',   label: '文章标题', type: 'input', required: true },
            { key: 'digest',  label: '文章摘要', type: 'input' },
            {
              key: 'adminid', label: '文章作者', type: 'select', option: [], disabled: true, ButtonList: [
                { key: 'adminid', label: '添加作者', type: 'Button', onClick: this.addAuthor },
                { key: 'adminid', label: '删除作者', type: 'Button', onClick: this.deleteAuthor },
              ]},
            { key: 'orgId',     label: '咨询归属', type: 'belong', required: true,option:imageTypeOp},
            { key: 'orgType',   label: '咨询选择', type: 'belongSelect', required: true,},
            { key: 'layout',    label: '布局形式', type: 'radioButton', option:PicLayoutOption ,required: true ,hide:['1','4','5','10']},
            { key: 'titleimage', label: '标题图片', type: 'uploadPicture_drop',required: true,isIamge:true},
            { key: 'picUrl',    label: '内容图片', type: 'uploadPicture_button',describe:true,hide:['4','10'],isIamge:true},
            { key: 'isatlas',   label: '是否图集', type: 'radioButton', option:atlasOption ,required: true },
            { key: 'imagetype', label: '图片类型', type: 'radioButton', option:imageTypeOp },
            { key: 'content',   label: '文章内容', type: 'richText',hide:['2','4','10']}, //rich text
            { label: '关联类型测试', type: 'relation',hide:['2']},
            { key: 'fileUrl',   label: '上传附件', type: 'uploadPicture_button', describe:false,hide:['2'],isAttach:true},
            { key:'belongOrgType'},
            { key:'orgid'},
            { key:'relationType'},
            { key:'relationAddress'},
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
          content:[
            { key: 'point',             label: '奖励经验值数', type: 'inputNumber' },
            { key: 'treasureProvider',  label: '积分提供方',type: 'cascader',options:[]},
            { key: 'isrequired',        label: '是否必修',  type: 'radioButton', option: isRequiredOption, required: true },
            { key: 'istimepush',        label: '是否定时发送', type: 'isTimePush', required: true },
          ],
          url:'services/news/artical/update/updateNewsOtherSettings',
          onlineUrl: 'services/news/artical/newsInfo/publish',
        },
      ],
    };
  }
  componentDidMount(){}
  //添加作者
  addAuthor= (key,get,set) =>{
    this.setState({showAddModal:true,keyAddModal:this.state.keyAddModal+1,set,});
  }
  //删除作者
  deleteAuthor=(key,get,set) =>{
    set(key,'');
  }
  //确定作者
  handleAddModalOK=()=>{
    this.setState({showAddModal:false});
    let selectedData=this.props.selectRowsData;
    this.state.set('adminid',selectedData[0].name);
  }
  //取消作者
  handleAddModalCancel=()=>{
    this.setState({showAddModal:false});
  }
  //搜索作者
  handleInput=(e)=>{
    this.props.getData(ServiceApi+`services/system/systemAndCompanyUser/list/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=lastname_S_LK=${e.target.value}`);
  }
  //文章归属 单选按钮点击事件
  onChange=(e)=>{
    this.setState({currentValue: e.target.value})
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

    return(
      <div>
        <EventAndInfoAdd
          update={this.state.update}
          type="information"
          steps={this.state.steps}
          submitText="保存并发布"
          style="add"
          save="/InformationManagement/Article"
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
const newsTypeOption=[
  { value: '是', key: 2 },
  { value: '否', key: 1},
];

export default NewArticle;
