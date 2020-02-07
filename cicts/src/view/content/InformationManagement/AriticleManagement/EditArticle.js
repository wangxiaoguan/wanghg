import React, { Component } from 'react';
import EventAndInfoAdd from '../../../component/EventAndInfoAdd/EventAndInfoAdd';
import FormAndInput from '../../../component/table/FormAndInput';
import { Tabs,Select,Button,Message, Table,Input,Modal,Form,Radio,Cascader} from 'antd';
import {GetQueryString,getService,postService} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import {connect} from 'react-redux';
import {BEGIN,getPageData} from '../../../../redux-root/action/table/table';// yelu 2019-01-16 取出缓存里面设置分页数据函数getPageData
import { setTimePushData } from '../../../../redux-root/action/eventAndInfoData/timePushData';
import SingleTree from '../../../component/EventAndInfoAdd/SingleTree';//栏目管理
import VerifyTree from '../../../component/EventAndInfoAdd/verifyTree';
import {setSelectTreeData,setCheckTreeData,} from '../../../../redux-root/action/tree/tree';//栏目管理树形选择
import { pageJummps } from '../PageJumps';
const TextArea = Input.TextArea
@connect(
    state => ({
      dataSource: state.table.tableData,
      pageData:state.table.pageData,
      selectRowsData: state.table.selectRowsData,
      checkTreeData: state.tree.treeCheckData,
      selectDetail: state.tree.treeSelectData.selectDetail,
      selectTreeData: state.tree.treeSelectData,
      timePushData: state.flowData.timePushData,
      powers: state.powers,//权限码xwx2018/12/24
    }),
    dispatch => ({
      getData: n => dispatch(BEGIN(n)),
      setSelectData: n => dispatch(setSelectTreeData(n)),
      setCheckData: n => dispatch(setCheckTreeData(n)),
      setTimePushData: n => dispatch(setTimePushData(n)),
      getPageData:n=>dispatch(getPageData(n)), // yelu 2019-01-02 每次查询时初始缓冲里面的页码为默认值
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
      partyid:[],//发布范围中处理后的部门数据
      groups:[],//发布范围中处理后的部门数据
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
      taskIdUpdate:'',//更新时，获取到的任务id
      qfilter: '', // yelu 2019-01-16 添加作者查询条件字段 
      newsType:1,
      valueOne:1,
      valueTwo:0,
      //三个步骤对象
       steps:[
        {
          title:'填写文章信息',
          content:[
            { key: 'newsType', label: '文章类型', type: 'information_type', option:[], required: true},
            { key: 'title', label: '文章标题', type: 'input', required: true, max:60},
            { key: 'digest', label: '文章摘要', type: 'input' },
            {
              key: 'auth', label: '作者', type: 'infoAuth', disabled: true, ButtonList: [
                { key: 'auth', label: '添加作者', type: 'Button', onClick: this.addAuthor },
                { key: 'auth', label: '删除作者', type: 'Button', onClick: this.deleteAuthor },
              ]},
            { key: 'orgType', label: '资讯归属', type: 'infoBelong', required: true,option:infoOption},
            { key: 'layout', label: '布局形式', type: 'radioButton', option:PicLayoutOption ,required: true ,hide:[1,4]},
            { key: 'layout', label: '布局形式', type: 'radioButton', option:layoutOption ,required: true ,hide:[2]},
            { key: 'titleImage', label: '标题图片', type: 'uploadPicture_drop',required:true,isIamge:true},
            { key: 'contentImage', label: '内容图片', type: 'filePicture',describe:true,hide:[4],isIamge:true,style:'edit',datatype:'articleContent',required: false,},
            { key: 'isAtlas', label: '是否设置为图集', type: 'radioButton', option:atlasOption ,required: true,hide:[4] },
            { key: 'imageType', label: '图片类型', type: 'radioButton', option:imageTypeOp,hide:[4] },
            { key: 'url', label: '网页地址', type: 'inputUrl', describe:false,hide:[1,2],required:true},
            { key: 'content', label: '文章内容', type: 'richText',hide:[2,4],required:true},
            { label: '关联类型测试', type: 'relation',hide:[2,4]},
            { key: 'categoryIdList', label: '所属栏目', type: 'infoColumnTree', required: true},
            { key: 'newsAttachs', label: '上传附件', type: 'filePicture', describe:false,hide:[4],isAttach:true,style:'edit',datatype:'articleAttachs'},
            { key:'orgType'},
            { key:'orgId'},
            { key:'relationType'},
            { key:'url'},
            { key:'depCategory'},
            { key:'remark'}
          ],
          updateUrl:pageJummps.ArticleEditOne,
          data:{},
        },
        {
          title:'选择发布范围',
          content:'',
          url:pageJummps.InfoAuthorityAdd,
          data:{}
        },
        {
          title:'其他设置',
          content:[
            { key: 'exp', label: '奖励经验值数', type: 'inputNumber' },
            // { key: 'point', label: '奖励积分数', type: 'inputNumber' },
            { key: 'isComment', label: '是否可评论', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isNickComment', label: '是否可匿名评论', type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isShare', label: '是否可分享',  type: 'radioButton', option: isOrNotOption , required: true},
            { key: 'isInnerShare', label: '是否只能内部转发', type: 'radioButton', option: isOrNotOption , required: true},
            { key: 'isHomePage', label: '是否上首页',  type: 'radioButton', option: isOrNotOption, required: true },
            { key: 'isPush', label: '是否推送',  type: 'radioButton', option: isOrNotOption , required: true},
            { key: 'isTimePublish', label: '是否定时发送', type: 'isTimePublish', required: true },
            { key: 'isImportant', label: '是否永不清理', type: 'radioButton', option: isOrNotOption , required: true },
        ],
          url:pageJummps.ArticleEditThree,
          data:{}
        },
      ],
      publishModal:false,//内容发布
      submithModal:false,//提交审核
      allData:[],
      submitTxt:'',
      allvalue:'',
      type:'',
      allData:{},
      liveList:[],//直播间数据
      reviewerList:[],
    }
  }
  componentWillMount(){}

  componentDidMount(){
    //页面相关的数据处理
    this.dealData();
    Promise.all([this.getData(),this.getAuth()]).then(data=>{

      let temp= [...this.state.steps];
      let allData = {...data[0],...data[1],orgId:data[0]['orgTreePath']}
      temp[0].data = allData; 
      temp[1].data = allData; 
      temp[2].data = allData; 
      if(allData['departments'].length||allData['partys'].length||allData['groups'].length||allData['unions'].length){
        this.setState({valueOne:2});
      } 
      if(allData['companyList'].length){
        let tenantId = window.sessionStorage.getItem('tenantId');
        if(allData.companyList.indexOf(tenantId)>-1){
          this.setState({valueTwo:1});
        }else{
          this.setState({valueTwo:2});
        }
        
      }
      this.setState({orgName:allData.orgName,steps:temp,update:this.state.update+1,newsType:allData.newsType});
    })
  }
  componentWillUnmount() {
    sessionStorage.removeItem('eventAndInfoKey') //yelu 移除session中保存的权限设置tab对应的key值
  }
  getData = () =>{
    return new Promise((pass,fail)=>{
      getService(API_PREFIX+`${pageJummps.ArticleDetail}/${this.state.newsId}`,data=>{
        if(data.status===1){
          pass(data.root.object)
        }else{
          Message.error(data.errorMsg)
        }
      })
    })
  }
  getAuth = () => {
    return new Promise((pass,fail)=>{
      postService(API_PREFIX+`${pageJummps.InfoAuthorityDetail}/${this.state.newsId}`,{},data=>{
        if(data.status===1){
          pass(data.root.object)
        }else{
          Message.error(data.errorMsg)
        }
      })
    })
  }
  getCompany = () => {
    return new Promise((pass,fail)=>{
      getService(API_PREFIX+`${pageJummps.companyUrl}`,data=>{
        if(data.status===1){
          let companyData = data.root.object;
          let unionCheckedKeys = []
            for (let index = 0; index < companyData.length; index++) {
              let node = companyData[index];
              node.key = node.id;
              unionCheckedKeys.push(node.id)
            }
            pass(unionCheckedKeys)
        }else{
            Message.error(data.errorMsg)
        }
      })
    })
  }
  dealData=()=>{
    //文章类型
    getService(API_PREFIX+pageJummps.ArticleType,data=>{
        if(data.status === 1){
            let steps = this.state.steps;
            this.dealLookup(data.root.object);
            steps[0].content[0].option = data.root.object
            this.setState({steps});
        }else{
          Message.error(data.errorMsg)
        }
    });
  }
 
  //处理文章类型的数据
  dealLookup(data) {
    data.map((item, index) => {
      item.key = Number(item.code);
      item.value = item.fieldName;
    });
  }
  //添加作者
  addAuthor = (key, get, set) => {
    localStorage.setItem("selectedRowKeys", '')
    this.setState({showAddModal: true,keyAddModal: this.state.keyAddModal + 1,set});
  }
  //删除作者
  deleteAuthor = (key, get, set) => {
    set(key, '');
  }
  //添加作者
  handleAddModalOK = () => {
    this.setState({ showAddModal: false });
    let selectedData = this.props.selectRowsData;
    this.state.set('auth',selectedData[0].name);
  }
  //展示添加作者modal 点击取消
  handleAddModalCancel = () => {
    this.setState({ showAddModal: false });
  }
  //新增作者时输入框输入值的变化
  handleInput = (e) => {
    let qfilter = e.target.value == '' ? '' : `Q=name=${e.target.value}`
    this.setState({qfilter,})
    this.props.getPageData({currentPage: 1, pageSize: 10, query: qfilter});
    this.props.getData(API_PREFIX+`${pageJummps.InfoAuthor}/1/10?${qfilter}`);
  }

  render(){
      const columns = [
        {
          title: '员工号',
          dataIndex: 'userNo',
          key: 'userNo',
        },

        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          key: 'mobile',
        },
        {
          title: '部门',
          dataIndex: 'fullName',
          key: 'fullName',
        },
      ];
      const timePush = {
        body: {
            "name": "文章资讯定时发布任务",
            "type": "41",
            "runTime": "2019-08-23 15:39:08",
            "queryType": "post",
            "queryUrl": API_PREFIX+pageJummps.ArticlePush,
            "queryValue": "{}",
            "queryContentType": "application/json"
        },
      };
    return (
      <div>
        <EventAndInfoAdd
          key={this.state.update}
          type="information"
          steps={this.state.steps}
          style="edit"
          id={{ id: this.state.newsId }}
          save={`/InformationManagement/Article?tabsVale=${sessionStorage.getItem('TabsKey')}`}
          timePush={timePush}
          belonged="article"
          partyRootId={this.state.partyRootId}
          dpRootId={this.state.dpRootId}
          datatype={'article'}
          saveReturn={'saveReturn'}
          saveKeep={'save'}
          newsType={this.state.newsType}
          valueOne={this.state.valueOne}
          valueTwo={this.state.valueTwo}
          orgName={this.state.orgName}
          getUrl={`${pageJummps.ArticleDetail}/${this.state.newsId}`}
        >
        </EventAndInfoAdd>
        <Modal
          width={1000}
          title="添加作者"
          visible={this.state.showAddModal}
          cancelText="取消"
          okText="添加"
          onOk={this.handleAddModalOK}
          onCancel={this.handleAddModalCancel}
          destroyOnClose={true}
        >
          <FormAndInput
            columns={columns}
            url={pageJummps.InfoAuthor}
            onSearch={this.handleInput}
            qfilter={this.state.qfilter} // yelu 2019-01-16 传递过去查询条件，修改分页后不带查询条件的问题
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
  { label: '纯文本', value: 0 },

];
//图片类型
const imageTypeOp = [
  { label: '大横幅', value: 1 },
  { label: '小横幅', value: 2 },
];
//是否设置为图集
const atlasOption = [
  { label: '是', value: true },
  { label: '否', value: false },
]
const isOrNotOption = [
  { label: '是', value: true },
  { label: '否', value: false },
];
const infoOption = [
  { label: '按照企业部门归属', value: 1 },
  { label: '按照党组织归属', value: 2 },
  { label: '按照工会归属', value: 3 },
]
export default EditArticle;