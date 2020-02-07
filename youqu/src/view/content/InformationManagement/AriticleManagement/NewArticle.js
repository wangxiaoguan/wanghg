import React, { Component} from 'react';
import { Tabs,Select,Button,message, Table,Input,Modal,Form,Radio,Cascader} from 'antd';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import FormAndInput from '../../../component/table/FormAndInput';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {postService,getService} from '../../myFetch';
import ServiceApi from '../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN} from '../../../../redux-root/action';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Search = Input.Search;
@connect(
  state => ({
    dataSource: state.tableData,
    pageData:state.pageData,
    selectRowsData: state.selectRowsData,
    allData:state,
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
            { key: 'type',    label: '文章类型', type: 'Select', option: optionSelect, },
            { key: 'title',   label: '文章标题', type: 'Input'},
            { key: 'digest',  label: '文章摘要', type: 'Input'},
            {
              key: 'author', label: '文章作者', type: 'InputButton',disabled: true, ButtonList: [
                { key: 'author', label: '添加作者', type: 'Button', onClick: this.addAuthor },
                { key: 'author', label: '删除作者', type: 'Button', onClick: this.deleteAuthor },
              ]},
            { key: 'orgId',     label: '咨询归属', type: 'radioButton', option:optionRadio1},
            { key: 'layout',    label: '布局形式', type: 'radioButton', option:optionRadio2},
            { key: 'isatlas',   label: '是否图集', type: 'radioButton', option:optionRadio3},
            { key: 'orgType',   label: '咨询选择', type: 'cascader'},
           
            { key: 'titleimg',  label: '标题图片', type: 'uploadPicture',isIamge:true},
            { key: 'content',   label: '文章内容', type: 'richText'}, 
            { key: 'relation',  label: '关联类型', type: 'relation',option:optionRadio1},
            { key: 'address'},
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
            { key: 'isrequired',        label: '是否必修',  type: 'radioButton', option: optionRadio2},
            { key: 'istimepush',        label: '是否定时发送', type: 'isTimePush',  },
          ],
          url:'services/news/artical/update/updateNewsOtherSettings',
          onlineUrl: 'services/news/artical/newsInfo/publish',
        },
      ],
    };
  }
  componentDidMount(){
    console.log(this.props)
  }
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
    console.log(selectedData)
    this.state.set('author',selectedData[0].name);
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
    console.log(this.props)
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
const optionRadio1 = [
  { label:'左右', value: 1 },
  { label:'上下', value: 2 },
  { label:'前后', value: 3 },
];
const optionRadio2=[
  { label:'是',value:true },
  { label:'否',value:false },
];
const optionRadio3 = [
  {label:'文章',value:'1'},
  {label:'图集',value:'2'},
  {label:'视频',value:'3'},
];
const optionSelect = [
  {key:'1',value:'文章'},
  {key:'2',value:'图集'},
  {key:'3',value:'视频'}
]
export default NewArticle;
