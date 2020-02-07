import React, { Component } from 'react';
import { Form, Select, InputNumber, Input, DatePicker, Popconfirm, Radio, Button, Modal, Cascader, Row, Col, Icon ,Tooltip} from 'antd';
// const masterUrl = 'http://10.110.200.62:9080/';
import SingleTree from './SingleTree';
import PartyTree from './PartyTree';
import ColumnTree from './ColumnTree';
import LearnManagationTree from './LearnManagationTree';
import UploadPicture from './uploadPic';
import TitlePicture from './titlePic';//公共标题图片组件
import FilePicture from './filePic';//公共标题图片组件
// import RichText from '../richTexteditor/editor';
import RichText from '../richTexteditor/braftEditor';
import moment from 'moment';
import { connect } from 'react-redux';
import FormAndInput from '../../component/table/FormAndInput';
import { BEGIN, getPageData } from '../../../redux-root/action/table/table';
import { setTimePushData } from '../../../redux-root/action/eventAndInfoData/timePushData';
import { postService, getService } from '../../content/myFetch';
import API_PREFIX, { masterUrl, API_FILE_VIEW, API_FILE_UPLOAD,API_CHOOSE_SERVICE,API_FILE_VIEW_INNER } from '../../content/apiprefix';
import { exportExcelService,GetQueryString } from '../.././content/myFetch';
import TableSearch from '../table/TableSearch';
import Merchant from './Merchant';
import PickupAddress from './PickupAddress'
import { checkVideo ,checkAddress} from '../../../utils/checkForm';
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;
const FormItem = Form.Item;
let tenantId = window.sessionStorage.getItem('tenantId');
let uuid = 0;
let i = 1;
let sum = [];
function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}
function disabledDate(current) {
  // Can not select days before today and today
  return moment(new Date()).subtract(1, 'd').isAfter(current);
}
// function disabledDateTime() {
//   return {
//     disabledHours: () => range(0, 24).splice(4, 20),
//     disabledMinutes: () => range(30, 60),
//     disabledSeconds: () => [55, 56],
//   };
// }

@connect(state => ({
  uploadData: state.uploadPicture.uploadPictureData,         //图片上传数据
  uploadSpecial: state.uploadPicture.contentPictureData,//描述图片，附件，视频上传
  selectTreeData: state.tree.treeSelectData.column,     //选择树数据
  selectPartyData: state.tree.treeSelectData.party,        //多选树数据
  checkTreeData: state.tree.treeCheckData.column,        //多选树数据
  partyTreeData: state.tree.treeCheckData.partys,        //多选树数据
  editorData: state.editor.editorData,           //富文本数据
  pageData: state.table.pageData,              //封装表格分页查询条件数据
  selectRowsData: state.table.selectRowsData,  //封装表格选择数据
  getMerchantData:state.attach.MerchantData,//获取添加用户的数据
  eventData: state.flowData.eventData,
  powers:state.powers,
}),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    setTimePushData: n => dispatch(setTimePushData(n)),
    getPageData:n=>dispatch(getPageData(n)), // yelu 2019-01-02 每次查询时初始缓冲里面的页码为默认值
  }))
export default class FormWrapper extends Component { 
  constructor(props) {
    super(props);
    this.isPush = true;
    this.departList = [];
    this.partyList = [];
    this.unionList = [];
    this.state = {
      homeType: false,
      relation: this.props.flowData.relationType?this.props.flowData.relationType:'1',
      // topicType:'1',
      // urlType:'0',
      liveType: true,
      infoType: this.props.infoType ||1,
      RadioValue: '',
      selectTreeData: this.props.selectTreeData,
      updateTree: false,
      updateCheckTree: false,
      uploadData: this.props.uploadData,
      updatePicture: false,
      updatePartyTree:false,
      partyTreeKey:'',
      selectTreeKey: '', 
      checkTreeKey: '',
      pictureKey: '',
      contentKey: '',
      richTextKey: '',
      editorData: this.props.editorData,
      updateEditor: false,
      img_review: false,
      imgValue: '',
      uploadSpecial: this.props.uploadSpecial,
      specialStatus: false,
      showAddModal: '0',
      dp: [],//部门的数据
      partyOrganization: [],//党组织机构的数据
      unions:[],//工会数据
      belongsData: [],//归属的数据
      shopping: [],
      pushModal: false,
      timePushValue: '',
      picOption: [],
      allData: [],
      isAttach: false,//是否是附件
      isRadio: false,//是否是视频
      fileName: '',//下载时的文件名
      isValid: false,//当奖励积分数大于0时，积分提供方必填
      shoppingNum: [1],
      shoppingId: [],
      // urltypeShow:true,//是否显示大图和小图
      isrequired: '1',
      learnisrequired:2, //朱劲松 修改 BUG 4063
      learnTime: 0,
      testModal: false,
      testList:[],//关联考试
      showbarrage:true,
      number:2,
      ArticleRadio:false,
      ArticleRadioTwo:false,
      // relationType:'1',
      qfilter: '',
      isProject:false,
      belongsValue:1,
      projectTree:[],
      infoOption:[],//归属部门
      isAdmin:true,//超级管理员
      ossViewPath: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW, //根据登陆人员来获取oss地址
      departColumn:[],
      Mlayout:1,
      isExamine:false,
    };
  }
  //下载
  onDownLoad(url) {
    exportExcelService(url, null, this.state.fileName);
  }

  /**
   * 设置回填数据
   */
  setInitialValue = (data) => {
    let that=this;
    if(JSON.stringify(data)!='{}'){
      this.setState({learnisrequired:data.isrequired});
    }
    if(data.examId){
      getService(API_PREFIX + `services/web/activity/exam/getById/${data.examId}`, data => {
        if (data.status === 1) {
          let testList = [data.root.object];
          this.setState({testList});
        }
      });
    }
    const { content } = this.props;
    content.map((item, index) => {
      //初始值
      // let keys = [item.keyOne,item.keyTwo,item.keyThree];
      if(item.key === 'shopTime'){ //订购活动取货、订购、取货提醒时间数据回显
        this.props.form.setFieldsValue({ shopTime:[data.beginTime?moment(data.beginTime):'',data.endTime?moment(data.endTime):''] });
      }else if(item.key === 'pickTime') {
        this.props.form.setFieldsValue({ pickTime:[data.applyBegin?moment(data.applyBegin):'',data.applyEnd?moment(data.applyEnd):''] });
      }else if(item.key === 'pickDate') {
          this.props.form.setFieldsValue({ pickDate:data.pickRemindDate?moment(data.pickRemindDate):''});
      }else if(item.key === 'orgType'&&data!="{}"&&data.orgId&&data.orgId.length>0) { 
        if(data.orgId.length>2){
          this.getDepartClomn(data.orgId[1]) 
        }else{
          this.getDepartClomn(data.orgId[data.orgId.length-1]) 
        }
              
    }

      if(this.props.code == 'personWork') { //修改内容审核中资讯归属数据回显问题
        this.props.form.setFieldsValue({
          ['orgid']: data['treepath'] && data['treepath'].split(','),
          ['belongOrgType']: data['belongOrgType'],
        });
      }
      if (!Array.isArray(item.key)) {
        if (data[item.key] !== undefined) {
          if (item.key === 'islive') {
            this.setState({ islive: data[item.key] });
          }
          if (item.key === 'type') {
            getService(
              API_PREFIX +
              'services/system/cateogry/news/artical/addNews/authCategoryTree/get',
              treeData => {
                if (treeData.retCode === 1) {
                  this.setState({
                    allData: treeData.root.list,
                    infoType: data[item.key],
                  });
                }
              }
            );
          }
          if(item.key==='layout'&&data.layout==3){
            this.setState({RadioValue:3});
          }
          if(item.key==='layout'&&data.layout!==0){
            this.props.steps[0].content[7].required = true
          }
          if(item.key==='layout'&&data.layout===0){
            this.props.steps[0].content[7].required = false
            this.props.steps[0].content[8].hide = [1,4]
            this.props.steps[0].content[9].hide = [1,4]
            this.props.steps[0].content[10].hide = [1,4] 
          }
          if (item.key === 'picUrl' || item.key === 'fileUrl') {
            this.setState({ picOption: { [item.key]: data[item.key] } });
          }
          if (item.key === 'islive') {
            this.setState({ liveType: data[item.key] });
          }
          if(data.orgType &&this.props.type=='event' && item.key === 'orgType' ){
            data.orgType=data.orgType*1;
            }
          this.props.form.setFieldsValue({
            [item.key]: data[item.key],
          });
          if(item.key === 'orgType'){
            this.setState({belongsValue:data['orgType']})
          }
          if(data.orgTreePath && item.key === 'orgId' ){
              if(data.orgTreePath.indexOf(",")>-1){
                  let obj=data.orgTreePath;
                  let orgId=obj.split(",");
                  this.props.form.setFieldsValue({orgId});
              }
          }
          if(data.unionTreePath && item.key === 'orgId' ){
              if(data.unionTreePath.indexOf(",")>-1){
                  let obj=data.unionTreePath;
                  let orgId=obj.split(",");
                  this.props.form.setFieldsValue({orgId});
              }
          } 
        }



        // this.props.form.setFieldsValue({
        //   ['title1']: data['name'] ? data['name'] : data['title1'],
        //   ['nameM']:data['name'] ? data['name'] : data['nameM'],
        // });
        //pyj 20190305  修复定时任务的时间异常bug
  
        if (item.key == 'isTimePublish') {
          if(data.isTimePublish!=undefined){
            if(!data.isTimePublish){
              that.props.setTimePushData('');
              that.setState({ timePushValue: '' });
            }else{
              if (data['publishDate']) {         // 定时发布初始值
                that.setState({ timePushValue: data['publishDate'] });
                that.props.setTimePushData(data['publishDate']); //将定时发布的初始值保存到缓存里面
              }
            }
          }
        }
      } else {
        item.key && item.key.map((keyItem, index) => {              //杂志文章 是否上首页
          if (data[keyItem] !== undefined) {
            if (keyItem === 'indexImage') {
              this.setState({
                picOption: { [keyItem]: data[keyItem] },
              });
            }
            if (keyItem === 'isHomePage') {
              this.props.form.setFieldsValue({
                isHomePage: data['isHomePage'],
              }, () => {
                if (data['isHomePage']) {
                  if (this.props.indexImage) {
                    this.props.form.setFieldsValue({
                      indexImage: this.props.indexImage['indexImage'],
                      layout: this.props.indexImage['layout'],
                    });
                  }
                }
              });
            }
            if (index === 0) {
              this.setState({
                homeType: data[keyItem] ? true : false,
              });
            }
          }
        });
      }
    });
  }

  componentDidMount() {
    let props = this.props;
    console.log(props)
    if(props.belonged === 'magazine'&&props.initialValue){
      this.setState({Mlayout:props.initialValue.layout})
    }
    if((props.type === 'information'||props.type === 'event')&&(props.style === 'edit'||props.style === 'detail')){
        if(props.steps[0]&&props.steps[0].data&&props.steps[0].data['orgType']){
          if(props.steps[0].data['orgType'] === 1){
            let orgId = props.steps[0].data['orgTreePath'].split(',')
            if(orgId.length>1){
              this.getDepartClomn(orgId[1])    
            }else{
              this.getDepartClomn(orgId[0])    
            }
            
          }
        }
    }else if(props.belonged === 'magazine'){
        if(props.initialValue&&props.initialValue.orgType === 1){
          let orgId = props.initialValue['orgId']
          this.getDepartClomn(orgId[orgId.length-1])
        }
    }
    this.setAdmin();
    //归属部门鉴权
    const {powers} = this.props;
    let departPower=powers && powers['20004.21501.003'];//部门权限
    let partyPower= powers && powers['20005.23002.003'];;//党组织权限
    let unionPower=powers && powers['20007.21704.000'];//工会权限
    let infoOption = [];
    if(departPower){
        infoOption.push({ label: '按照企业部门归属', value: 1 });
    }
    if(partyPower){
        infoOption.push({ label: '按照党组织归属', value: 2 });
    }
    if(unionPower){
        infoOption.push({ label: '按照工会归属', value: 3 });
    }
    this.setState({infoOption});
    this.props.content.map(item => {
      if (item.type === 'selectTree') {

        this.setState({ selectTreeKey: item.key });
      } else if (item.type === 'checkTree') {
        this.setState({ checkTreeKey: item.key });
      }else if (item.type === 'columnTree') {
        this.setState({ checkTreeKey: item.key });
      }else if (item.type === 'infoColumnTree') {
        this.setState({ checkTreeKey: item.key });
      }else if (item.type === 'LearnTree') {
        this.setState({ partyTreeKey: item.key });
      } else if (item.type === 'richText') {
        this.setState({ richTextKey: item.key });
      } else if (
        item.type === 'uploadPicture_drop'
      ) {
        this.setState({ pictureKey: item.key });
      }else if(item.type === 'titlePicture'){
        this.setState({ pictureKey: item.key });
      } else if (item.type === 'uploadPicture_button') {
        if (item.describe) {
          this.setState({ contentKey: item.key });
        } else {
          this.setState({ enclosureKey: item.key });
        }
      }else if (item.type === 'filePicture') {
        if (item.describe) {
          this.setState({ contentKey: item.key });
        } else {
          this.setState({ enclosureKey: item.key });
        }
      }
    });
    if(this.props.initialValue&&this.props.initialValue.relationType){
      this.setState({ relation: this.props.initialValue.relationType });
    }

    if (this.props.initialValue) {
      this.setInitialValue(this.props.initialValue);
    } else if (this.props.flowData && JSON.stringify(this.props.flowData) !== '{}') {
      let allFlowData = {...this.props.flowData,...this.props.eventData}
      this.setInitialValue(allFlowData);
    } else if (this.props.leaveData && JSON.stringify(this.props.leaveData) !== '{}') {
      this.setInitialValue(this.props.leaveData[this.props.belonged]);
    }

    //获取部门的数据
    if(departPower){
      let organizationData = [];
      getService(API_PREFIX +`services/web/company/org/orgList/get?Q=isAll=false&Q=haveUsers=false`, data => {
        if (data.status === 1) {
          organizationData = data.root.object;
          let selectData = this.getDpData(organizationData);
          this.dealDepartmentData(organizationData,selectData);
          let type = this.props.form.getFieldValue('orgType');
          if (type == 1) {
            this.setState({ dp: organizationData,belongsData:organizationData});
          } else {
            this.setState({ dp: organizationData});
          }
        }
      });
    }

    //获取工会的数据
    if(unionPower){
      let unionData = [];
      getService(API_PREFIX + 'services/web/union/org/getUnionOrgList/0',data => {
        if (data.status === 1) {
          unionData = data.root.object;
          let selectData = this.getUnData(unionData);
          this.dealUnionData(unionData,selectData);
          let type = this.props.form.getFieldValue('orgType');
          if (type == 3) {
            this.setState({ unions: unionData,belongsData:unionData});
          } else {
            this.setState({ unions: unionData});
          }
        }
      });
    }

    //获取资讯部门专题
    getService(API_PREFIX +`services/web/news/special/getListTree`, data => {
      if (data.status === 1) {
        let tree = data.root.object;
        this.dealProjectData(tree);
          this.setState({projectTree: tree });
      }
    });
    //获取党组织数据
    if(partyPower){
        let partyData = [];
        getService(API_PREFIX + `services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1`, data => {
          if (data.status === 1) {
            partyData = data.root.object;
            let selectData = this.getPartyData(partyData);
            this.dealPartyOrganaitonData(partyData,selectData);
            let type = this.props.form.getFieldValue('orgType');
            if (type == 2) {
              this.setState({ partyOrganization: partyData,belongsData:partyData});
            } else {
              this.setState({ partyOrganization: partyData});
            }
          }
        });
      }
  }

  setAdmin=()=>{
    let orgIds = window.sessionStorage.getItem('authorityOrgIds')?window.sessionStorage.getItem('authorityOrgIds'):false;
    let partyIds = window.sessionStorage.getItem('authorityPartyIds')?window.sessionStorage.getItem('authorityPartyIds'):false;
    let UnionIds = window.sessionStorage.getItem('authorityUnionIds')?window.sessionStorage.getItem('authorityUnionIds'):false;
    let GroupIds = window.sessionStorage.getItem('authorityGroupIds')?window.sessionStorage.getItem('authorityGroupIds'):false;
    if(orgIds||partyIds||UnionIds||GroupIds){
      this.setState({isAdmin:false});
    }else{
      this.setState({isAdmin:true});
    }

  }
  //处理组织机构中的数据
  dealDepartmentData(data,e) {
    let isAdmin = this.state.isAdmin;
    data.map((item, index) => {
      item.value = item.id;
      item.label = item.name;
      item.disabled = isAdmin?false:e.indexOf(item.id)>-1?false:true;
      item.children = item.subCompanyOrgList;
      if (item.subCompanyOrgList) {//不为空，递归
        this.dealDepartmentData(item.subCompanyOrgList,e);
      }
    });
  }
  getDpData(data) {
    let orgIds = window.sessionStorage.getItem('authorityOrgIds')?window.sessionStorage.getItem('authorityOrgIds'):false;
    if(orgIds !== 'no'&&orgIds){
      orgIds = orgIds.split(',')
    }
    data.map((item, index) => {
      if(orgIds&&orgIds.indexOf(item.id)>-1){
        this.departList.push(item.treePath.split(','));
      }
      if (item.subCompanyOrgList) {
        this.getDpData(item.subCompanyOrgList);
      }
    });
    let List = this.departList.join(',').split(',');
    return [...new Set(List)];
  }
  getUnData(data) {
    let UnionIds = window.sessionStorage.getItem('authorityUnionIds')?window.sessionStorage.getItem('authorityUnionIds'):false;
    if(UnionIds !== 'no'&&UnionIds){
      UnionIds = UnionIds.split(',')
    }
    data.map((item, index) => {
      if(UnionIds&&UnionIds.indexOf(item.id)>-1){
        this.unionList.push(item.treePath.split(','));
      }
      if (item.unionOrgList) {//不为空，递归
        this.getUnData(item.unionOrgList);
      }
    });
    let List = this.unionList.join(',').split(',');
    return [...new Set(List)];
  }
  getPartyData=data=>{
    let partyIds = window.sessionStorage.getItem('authorityPartyIds')?window.sessionStorage.getItem('authorityPartyIds'):false;
    if(partyIds !== 'no'&&partyIds){
      partyIds = partyIds.split(',')
    }
    data.map((item, index) => {
      if(partyIds&&partyIds.indexOf(item.id)>-1){
        this.partyList.push(item.treePath.split(','));
      }
      if (item.partyOrgList) {//不为空，递归
        this.getPartyData(item.partyOrgList);
      }
    });
    let List = this.partyList.join(',').split(',');
    return [...new Set(List)];
  }
  //处理工会的数据
  dealUnionData(data,e) {
    let isAdmin = this.state.isAdmin;
    data.map((item, index) => {
      item.value = item.id;
      item.label = item.name;
      item.disabled = isAdmin?false:e.indexOf(item.id)>-1?false:true;
      item.children = item.unionOrgList;
      if (item.unionOrgList) {//不为空，递归
        this.dealUnionData(item.unionOrgList,e);
      }
    });
  }
  //处理资讯专题数据
  dealProjectData(data) {
    data.map((item, index) => {
      item.value = item.specialId?item.specialId:item.categoryId;
      item.label = item.specialTitle?item.specialTitle:item.categoryName;
      item.children = item.subSpecialCategoryTreeVO;
      if (item.subSpecialCategoryTreeVO) {//不为空，递归
        this.dealProjectData(item.subSpecialCategoryTreeVO);
      }
    });
  }
  // 处理党组织关系的函数
  dealPartyOrganaitonData(party,e) {
    let isAdmin = this.state.isAdmin;
    party.map((item, index) => {
      item.value = item.id + '';
      item.label = item.partyName;
      item.disabled = isAdmin?false:e.indexOf(item.id)>-1?false:true;
      item.children = item.partyOrgList;
      if (item.partyOrgList) {
        this.dealPartyOrganaitonData(item.partyOrgList,e);
      }
    });

  }
  getMerchantList = (value, code,selectOption,MerchantArr) => {
    this.props.merchantList(value, code,selectOption,MerchantArr);
    // let arr = this.state.merchantList
    // if(code == 1) {
    //   let key = value.option[0].key
    //   let array = []
    //   arr.forEach(v => {
    //     if(v != key) {
    //       array.push(v)
    //     }
    //   })
    //   this.setState({merchantList: array})
    //   // this.props.merchants = array
    // }
    // if(code == 2) {
    //   arr.push(value[0].id)
    //   this.setState({merchantList: arr})
    //   // this.props.merchants = arr
    // }
  }
  infoTypeChange = (value) => {
      let content = this.props.steps[0].content;
      if(value=='1'){
          content[7]['required']=false;//标题图片不必填
      }else if(value=='2'){
          content[7]['required']=true;//标题图片必填
      }else if(value=='4'){
          content[7]['required']=true;//标题图片必填
      }
      let layout = this.props.form.getFieldValue('layout')
      if(value!==2){
          if(layout===3){
            setTimeout(() => {
              this.props.form.setFieldsValue({layout:1})
              this.props.steps[0].content[7]['required']=true
              window.setUploadTitle(1)
            }, 100);
          }
      }
      this.setState({ infoType: value });
      this.props.setInfoType(value);
  }
  liveChange=(value)=>{
  }
  requiredChange = (value) => {
    this.setState({ isrequired: value,number:value });
    
  }
  learnChange = (value) => {
    if(value==2){
      this.props.form.setFieldsValue({treasure:2});
    }else{
      this.props.form.setFieldsValue({treasure:1});
    }
    
    this.setState({ learnisrequired: value,number:value});
  }
  onLiveChange = (e) => {
    this.setState({ liveType: e.target.value,showbarrage:e.target.value });
  }
  onbarrageChange=(e,key)=>{
    this.props.form.setFieldsValue({ [key]: e.target.value });
  }
  onRelationChange = (e) => {
    this.props.form.setFieldsValue({ url: '' });
    this.setState({ relation: e.target.value });
  }
  //学习内容字数120字为一分钟
  wordCount = (value) => {
    this.setState({ learnTime: Math.ceil((value.length - 7) / 120) });
  }
  //  //添加投票类型
  //  onTopictypeChange=(e)=>{
  //   this.setState({ topicType: e.target.value});
  //   if(e.target.value==2){
  //     this.setState({urltypeShow:false,urlType:'0'})
  //   }else{
  //     this.setState({urltypeShow:true,urlType:'0'});

  //   }
  // }

  // //是否大图
  // onUrltypeChange=(e)=>{
  //   this.setState({ urlType: e.target.value});
  // }
  //关联考试
  testClick = () => {
    this.setState({ testModal: true });
  }
  //testmodal 取消
  testCancel = () => {
    this.setState({
      testModal: false,
      qfilter:''
    });
  }
  //选择考试
  testOk = () => {
      this.setState({testModal: false});
      let selectedData=this.props.selectRowsData;
      this.setState({testList:selectedData});
      setTimeout(()=>{
          this.props.form.setFieldsValue({examId:selectedData[0].id});
      },100)
  }
  //关联类型输入框输入值的变化
  handleInput = (e, url, type, qilter) => {
    let qfilter = e.target.value == '' ? `${qilter}` : `Q=${type}=${e.target.value}&&${qilter}`; // yelu 2019-01-16 修改选择人员查询后分页后不带查询条件
    this.setState({qfilter});
    // yelu 2019-01-16 每次查询的时候要重置页码为1
    this.props.getPageData({currentPage: 1, pageSize: 10, query: qfilter}); // 每次查询时初始缓冲里面的页码为默认值
    this.props.getData(API_PREFIX + `${url}/1/10?${qfilter}`);
    // this.props.getData(API_PREFIX + `${url}/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?Q=${type}_S_LK=${e.target.value}&&${qilter}`);
  }


  searchInput = (e) => {
    let url = 'services/web/party/partyStudy/getActivityWithoutRel';
    let tenantId = window.sessionStorage.getItem("tenantId");
    let qfilter = e.target.value?`Q=typeId=2&Q=status=1&Q=tenantId=${tenantId}&Q=activityName=${e.target.value}`:`Q=typeId=2&Q=status=1&Q=tenantId=${tenantId}`;
    this.setState({qfilter});
    this.props.getPageData({currentPage: 1, pageSize: 10, query: qfilter}); 
    this.props.getData(API_PREFIX + `${url}/1/10?${qfilter}`);
  }

  //根据选择，展示 部门或者党组织
  onBelongChange = (e) => {
    this.props.form.setFieldsValue({ orgId: [],depCategory:'' });
    if (e.target.value == '1') {//传入部门数据
      this.setState({ belongsData: this.state.dp });
    } else if (e.target.value == '2') {//传入党组织数据
      this.setState({ belongsData: this.state.partyOrganization });
    }else if(e.target.value == '3'){
      this.setState({ belongsData: this.state.unions });
    }
    this.setState({belongsValue:e.target.value,departColumn:[]});
  }
  timePushCancel = () => {
    this.setState({ pushModal: false });
    this.props.form.setFieldsValue({ isTimePublish: false });
  }
  timePush = () => {
    this.props.setTimePushData(this.state.timePushValue);
    this.setState({ pushModal: false });
  }
  removeDuplicatedItem = (arr) => {
    let ret = [];
    for (let i = 0, j = arr.length; i < j; i++) {
      if (arr[i] != undefined) {
        if (ret.indexOf(arr[i]) === -1) {
          ret.push(arr[i]);
        }
      } else {
        ret.push(arr[i]);
      }
    }
    return ret;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.checkTreeData !== prevState.checkTreeData) {
      return { checkTreeData: nextProps.checkTreeData, updateCheckTree: true };
    }
    if (nextProps.partyTreeData !== prevState.partyTreeData) {
      return { partyTreeData: nextProps.partyTreeData, updatePartyTree: true };
    }
    if (nextProps.selectTreeData !== prevState.selectTreeData) {
      return { selectTreeData: nextProps.selectTreeData, updateTree: true };
    }
    if (nextProps.uploadData !== prevState.uploadData) {
      return { uploadData: nextProps.uploadData, updatePicture: true };
    }
    if (nextProps.editorData !== prevState.editorData) {
      return { editorData: nextProps.editorData, updateEditor: true };
    } if (nextProps.uploadSpecial !== prevState.uploadSpecial) {
      return { uploadSpecial: nextProps.uploadSpecial, specialStatus: true };
    }
    if (nextProps.selectRowsData !== prevState.selectRowsData) {
      return { selectRowsData: nextProps.selectRowsData, numStatus: true };
    }
    return null;
  }
  onChangeContentImage=(type,files)=>{
      let list = files.length&&files.filter(item=>{
        return item!=undefined;
      });
      setTimeout(()=>{
        this.props.form.setFieldsValue({[type]:list?list:[]});
      },50);
      
  }
  
  //检测栏目是否待审核
  checkExamine = body => {
      postService(API_PREFIX+'services/web/config/review/getPanListByCategoryId',body,data=>{
          if(data.status === 1){
              if(data.root.object){//true  待审核
                  this.setState({isExamine:true},()=>{
                    if(this.props.style!=='add'){
                      setTimeout(()=>{
                        this.props.form.setFieldsValue({remark:this.props.steps[0].data['remark']||''})
                      },500)
                    }
                  })
                  
              }else{//不待审核
                  this.setState({isExamine:false})
              }
          }else{
            Message.error(data.errorMsg)
          }
      })
  }
  
  componentDidUpdate(nextProps, nextState) {
      if(this.props.datatype=='article'&&(this.props.style=='edit'||this.props.style=='detail')){
          if(nextProps.infoType!==nextState.infoType){
              this.setState({infoType:nextProps.infoType,
                belongsData:nextProps.infoType==1?this.state.dp:nextProps.infoType==2?this.state.partyOrganization:this.state.unionData,
              });
          }
      }

    const { selectTreeData, checkTreeData, uploadData, editorData, uploadSpecial, num,partyTreeData } = this.props;
    const { pictureKey, specialStatus, contentKey, enclosureKey, shoppingId, shoppingNum ,testname} = this.state;
    if (this.state.numStatus) {
      const merchants = "merchants" + this.props.num;
      let obj = {};
      if (this.props.selectRowsData.length != 0) {
        if (shoppingId.length == 0) {
          //shoppingId.push(this.props.selectRowsData[0].id)
          const num2 = num - 1;
          shoppingId[num2] = this.props.selectRowsData[0].id;
        } else {
          /* shoppingNum.map((item,index) => {
             if(num == item){
               shoppingId.splice(num-1,1,this.props.selectRowsData[0].id)
             }else{
               shoppingId.push(this.props.selectRowsData[0].id)
             }
           })*/
          if (shoppingNum.some(item => item == num)) {
            shoppingId.splice(num - 1, 1, this.props.selectRowsData[0].id);
          } else {
            shoppingId.push(this.props.selectRowsData[0].id);
          }
        }
        const shoppingId1 = this.removeDuplicatedItem(shoppingId);
        this.setState({
          shoppingId: shoppingId1,
        }, () => {
        });
        obj[merchants] = this.props.selectRowsData[0].lastname;
      }
      this.props.form.setFieldsValue(obj);
      this.setState({ numStatus: false });
    }

    if (this.state.updateTree) {
      this.props.form.setFieldsValue({
        [this.state.treeKey]: selectTreeData
          ? selectTreeData : [],
      });
      this.setState({ updateTree: false });
    }
    if (this.state.updateCheckTree) {
      if (this.props.datatype == 'article' || this.props.datatype == 'video') { 
          checkTreeData&&checkTreeData.length?this.checkExamine(checkTreeData):null;
      }
      this.props.form.setFieldsValue({
        [this.state.checkTreeKey]: checkTreeData
          ? checkTreeData : [],
      });
      this.setState({ updateCheckTree: false });
    }
    if (this.state.updatePartyTree) {
      this.props.form.setFieldsValue({
        [this.state.partyTreeKey]: partyTreeData?partyTreeData : [],
      });
      this.setState({ updatePartyTree: false });
    }
    if (this.state.updatePicture) {
      let content = '';
      // this.state.pictureKey.map(item=>{
      if (uploadData && JSON.stringify(uploadData) !== '[]') {
        uploadData[pictureKey] && uploadData[pictureKey].map(item => {
          if (item.response && item.response !== ''&&JSON.stringify(item.response)!=='{}') {
            if (content === '') {
              content = masterUrl + item.response.root.object[0].filePath;
            } else {
              content = content + ';' + masterUrl + item.response.root.object[0].filePath;
            }
          } else {
            if (content === '') {
              content = item.url;
            } else {
              content = content + ';' + item.url;
            }
          }
        });
        this.props.form.setFieldsValue({
          [pictureKey]: [content],
        });
      }

      // });

      this.setState({ updatePicture: false });
    }
    if (specialStatus) {
      // this.props.form.setFieldsValue({
      //   [uploadSpecial.type]:uploadSpecial.content,
      // });
      // this.setState({ specialStatus:false});
      let data = uploadSpecial;
      let picOption = this.state.picOption;
      if (data.type && !picOption[data.type]) {
        picOption[data.type] = [];
      }
      if (data.content) {
        this.isPush = true;
        for (let index = 0; index < picOption[data.type].length; index++) {
          if (picOption[data.type][index]) {
            if (picOption[data.type][index].uid !== undefined) {
              if (data.content.uid === picOption[data.type][index].uid) {
                picOption[data.type][index] = data.content;
                this.isPush = false;
                break;
              } else {
                this.isPush = true;
              }
            } else
              if (picOption[data.type][index].id !== undefined) {
                if (data.key === picOption[data.type][index].id) {
                  picOption[data.type][index] = data.content;
                  this.isPush = false;
                  break;
                } else {
                  this.isPush = true;
                }
              } else {
                this.isPush = true;
              }
          }
        }
        if (this.isPush) {
          picOption[data.type].push(data.content);
        }
        this.setState({ specialStatus: false, picOption });
        this.props.form.setFieldsValue({ [uploadSpecial.type]: picOption[data.type] });
      } else if (data.key !== undefined) {
        picOption[data.type] = picOption[data.type].filter(item => item && (item.id !== data.key));
        this.setState({ specialStatus: false, picOption });
        this.props.form.setFieldsValue({ [uploadSpecial.type]: picOption[data.type] });
      }
    }
    if (this.state.updateEditor) {
      this.props.form.setFieldsValue({
        [this.state.richTextKey]: editorData ? editorData : [],
      });
      this.setState({ updateEditor: false });
    }
  }
  onLayoutChange = e =>{
    this.props.setRequired(e.target.value)
    this.setState({Mlayout:e.target.value})
  }
  onRadioChange = (e, key,label) => {
    if(label==='是否可评论'){
      if(e.target.value===false){//当点击不可评论时，按钮置灰
        this.props.form.resetFields(['isnick']);
      this.setState({
        ArticleRadio:true,
      });
    }else if(e.target.value===true){//当点击可评论时，按钮恢复正常
      this.setState({ArticleRadio:false});
       }
    }
    if(label==='是否可分享'){
      if(e.target.value===false){//当点击不可评论时，按钮置灰
        this.props.form.resetFields(['isinnershare']);
      this.setState({ArticleRadioTwo:true});
    }else if(e.target.value===true){//当点击可评论时，按钮恢复正常
      this.setState({ArticleRadioTwo:false});
       }
    }
    if(label==='布局形式'){
        console.log(e, key,label)
        console.log(this.props.form.getFieldValue('titleImage'))
        if(e.target.value===0){
          this.props.steps[0].content[7].required = false 
          this.props.steps[0].content[8].hide = [1,4]
          this.props.steps[0].content[9].hide = [1,4]
          this.props.steps[0].content[10].hide = [1,4] 

        }else{
          this.props.steps[0].content[7].required = true 
          this.props.steps[0].content[8].hide = [4]
          this.props.steps[0].content[9].hide = [4]
          this.props.steps[0].content[10].hide = [4] 
          window.setUploadTitle(e.target.value)
        }
        // this.props.form.setFieldsValue({ titleImage:[]});
    }
    this.setState({ RadioValue: e.target.value });
    this.props.form.setFieldsValue({ [key]: e.target.value });
  };
  //单独是否设置为图集
  onIsatlasChange = (e, key) => {
    if(e.target.value){
      this.props.steps[0].content[14].hide.push('2');
    }else{
      this.props.steps[0].content[14].hide=['5','10'];
    }
    
    this.setState({IsatlasModal: e.target.value });
    this.props.form.setFieldsValue({ [key]: e.target.value });
  };
  get = (key) => {
    return this.props.form.getFieldValue(key);
  }
  set = (key, value) => {
    this.props.form.setFieldsValue({ [key]: value });
  }
  handleBtn = (item, get, set) => {
    item.onClick(item.key, get(item.key), set);
  }
  getDetailByTypeId = (id) => {
    localStorage.setItem("selectedRowKeys", '');
    let tenantId = sessionStorage.getItem('tenantId')
    switch (id) {
      case '1':
        return { url: 'services/web/news/article/newsList/get', code: 'title', desp: '文章', qilter: 'Q=onlineState=1' };
      case '2':
        return { url: 'services/web/activity/enrolment/getList', code: 'activityName', desp: '活动', qilter: `Q=tenantId=${tenantId}&Q=status=1` };
      case '3':
        return { url: '', code: '', desp: '链接', qilter: '' };
      case '4':
      /**
       * 朱劲松 事项提醒 -- 选择杂志 -- 杂志参数不对
       */
        if(this.props.RemindType === 'remind'){
          return { 
            // url: 'services/news/magazine/article/list', code: 'title', desp: '杂志', qilter: '',
            url: 'services/web/news/magazine/getList', code: 'name', desp: '杂志', qilter: 'Q=state=1', 
          };
        }else{
          return { 
            url: 'services/web/news/magazine/getList', code: 'name', desp: '杂志', qilter: 'Q=state=1',
          };
        }
      default:
        return { url: '', code: '', desp: '', qilter: '' };
    }
  }
  handleAddModalOK = () => {
    let url = '';
    let selectRowsData = this.props.selectRowsData[0];
    /** 
     * 朱劲松 
     * ‘事项提醒添加 --> 相关地址 id修改’  BUG  2746
     * 新增判断
     */
    // if(this.props.RemindType === 'remind'){
    //   switch (this.state.relation) {
    //     case '1':
    //       url = `http://www.urlgenerator.com?objectType=1&type=${selectRowsData.type}&isAtlas=${selectRowsData.isatlas}&id=${selectRowsData.id}`;
    //       break;
    //     case '2':
    //       url = `http://www.urlgenerator.com?objectType=2&type=${selectRowsData.typeId}&id=${selectRowsData.id}`;
    //       break;
    //     case '4':
    //       url = `http://www.urlgenerator.com?objectType=5&id=${selectRowsData.magazineId}`;
    //       break;
    //     default:
    //       break;
    //   }
    // }else{
      switch (this.state.relation) {
        case '1':
          url = `http://www.urlgenerator.com?objectType=1&type=${selectRowsData.newsType}&isAtlas=${selectRowsData.isAtlas?selectRowsData.isAtlas:false}&id=${selectRowsData.id}`;
          break;
        case '2':
          url = `http://www.urlgenerator.com?objectType=2&type=${selectRowsData.typeId}&id=${selectRowsData.id}`;
          break;
        case '4':
          url = `http://www.urlgenerator.com?objectType=4&id=${selectRowsData.id}`;
          break;
        default:
          break;
      }
    // }
    this.props.form.setFieldsValue({ url: url });
    this.setState({ showAddModal: '0' });
  }
  //选择商家
  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');

    // We need at least one passenger
    if (keys.length < 1) {
      return;
    }
    this.setState({
      shopping: keys.filter(key => key !== k),
    });
    this.setState({
      shoppingId: this.state.shoppingId.filter((item, index) => index == k),
    }, () => {
      this.props.getShoppingId(this.state.shoppingId);
    });
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }
  //奖励积分
  handleTreasureChange = (value, key) => {
    //当key值为  奖励积分时，才需要处理
    if (key == 'treasure') {
      if (value > 0) {
        this.setState({ isValid: true });
      }
    }
  }

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');

    const nextKeys = keys.concat(uuid);
    this.setState({
      shopping: nextKeys,
    });
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }
  addShopping = () => {
    const shoppingNum = this.state.shoppingNum;
    i++;
    shoppingNum.push(i);
    this.setState({
      shoppingNum: shoppingNum,
    });
  }
  deleteShopping = (item) => {
    const shoppingNum = this.state.shoppingNum;
    const shoppingId = this.state.shoppingId;
    const index = item - 1;
    shoppingNum.splice(index, 1, "undefined");
    shoppingId.splice(index, 1, "undefined");
    this.setState({
      shoppingNum: shoppingNum,
      shoppingId: shoppingId,
    }, () => {
    });
  }
   //禁止选择部分日期
   disabledDate=(current)=> {
    // Can not select days before today and today
    return  current && current < moment().add(-1, 'd');
    // return current && current < moment().endOf('day');
  }
  disabledDateTime=()=> {
    return {
      disabledHours: () => range(0, 24).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }
  changeTreasure=(e)=>{
    if(e){
      this.setState({number:e});
    }else{
      this.setState({number:0});
    }
  }
  changeCascader = (value, name) => {
    this.props.form.setFieldsValue({depCategory:''})
    this.props.getCreateOrgName(name[name.length-1].name);
    this.setState({isProject:value.length>1?true:false});
    if(this.state.belongsValue === 1){
      if(value.length>1){
        this.getDepartClomn(value[1])
      }else{
        this.getDepartClomn(value[0])
      }
    }
    
    
  }
  getDepartClomn = id => {
    // ${window.sessionStorage.getItem("tenantId")}_
    let list = [];
    let powers = this.props.powers
    let depProjectPower = powers && powers['20001.21607.000']  //部门专题权限
    depProjectPower && getService(API_PREFIX+`services/web/news/special/department/getCategoryByOrgId/${id}`,data=>{
      if(data.status === 1){
        list = data.root.object
        this.dealDepartClomn(list)
        this.setState({departColumn:list})
      }else{

      }
    })
  }
  dealDepartClomn= (data) => {
    console.log(data)
    data.map((item, index) => {
      item.key = item.categoryId;
      item.value = item.categoryName;
    });
  }
  confirm = () => {
    Modal.confirm({
        title: '您确定直接前往部门专题吗？',
        content: '直接前往部门专题会丢失已填写的数据,建议先点击下方保存按钮!',
        okText: '确认',
        cancelText: '取消',
        onOk() {
            location.hash = "/InformationManagement/project/Bank?back=1";
        },
    });
  }
  render() {
    const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 11 } };
    const specialFormItemLayout = { labelCol: { span: 10 }, wrapperCol: { span: 12 } };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    let  liveid='';
    if(this.props.datatype=='article'&&this.props.style=='edit'&&this.props.steps[0].data.liveid){
      liveid=Number(this.props.steps[0].data.liveid); 
      
    }
    const { form: { getFieldDecorator }, disabled, initialValue, flowData, disappear,checkTreeData,belonged } = this.props;
    const { getFieldValue } = this.props.form;
    const {departColumn, infoType, liveType, relation, showAddModal, homeType ,testList,learnisrequired,relationType,ArticleRadio,ArticleRadioTwo,isProject,belongsValue,projectTree,infoOption,ossViewPath,Mlayout,isExamine} = this.state;
    getFieldDecorator('keys', { initialValue: [] });

    console.log("aaaaa",departColumn)

    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? '商家' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`names${index}`, {
            validateTrigger: ['onChange', 'onBlur'],
            initialValue: this.state['names' + index],
            rules: [{
              required: true,
              whitespace: true,
              message: '请选择商家',
            }],

          })(
            <Input placeholder="请选择商家" style={{ width: '100%', marginRight: 8 }} />
          )}
          {keys.length >= 1 ? (
            <span>
              <Button onClick={this.props.showModal.bind(this, index)}>选择用户</Button>
              <Button onClick={() => this.remove(k)}>删除</Button>
            </span>
          ) : null}
        </FormItem>
      );
    });
    let url = this.getDetailByTypeId(showAddModal).url;
    let qilter = this.getDetailByTypeId(showAddModal).qilter;
    let typeCode = this.getDetailByTypeId(showAddModal).code;
    const isEditid=GetQueryString(location.hash, ['isEditid']).isEditid || '';
    const activeKey=GetQueryString(location.hash, ['activeKey']).activeKey || '';
    console.log("wwwww",this.props);

    let isforbed=false;
    if(this.props&&this.props.belonged=="order"&&activeKey==2){
        if(this.props.initialValue&&this.props.initialValue.applyEnd){
             if(moment(this.props.initialValue.applyEnd)>moment(new Date())){
              isforbed=true;
             }else{
              isforbed=false;
             }
        }
    }

    if(this.props&&this.props.belonged=="order"&&activeKey==1){
        isforbed=true;
    }

    let powers = this.props.powers
    let depProjectPowers = powers && powers['20001.21607.000']  //部门专题权限
    let content = this.props.content.map((item, index) => {
      return (
        <React.Fragment key={index}>
          {item.hide && item.hide.some(_ => _ === infoType) ? null :
            item.type === 'pickupAddress' ? (
              <div>
                <Form.Item {...formItemLayout} label={item.label} >
                  {getFieldDecorator(`pickupAddress`, {
                    initialValue: '',
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '必填项',
                      },
                    ],
                  })(
                    <PickupAddress 
                    // defaultMerchant={this.props.defaultValue.merchant}
                    {...this.props}
                    getPickupAddressList={this.props.getPickupAddressList}
                    flowData={flowData?flowData.pickupAddress:[]}   disabled={disabled||(isEditid&&isEditid==1)}/>
                  )}
                </Form.Item>
            </div>
            ) :
            item.type === 'select' ? (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  rules: [
                    {
                      // type: item.key === 'adminid' ? 'number' : 'string',
                      required: item.required,
                      whitespace: true,
                      // message: `${item.label}必填项`,
                      validator: (rule, value, callback)=>{
                        if((typeof value)=='string'||(typeof value)=='number'){
                          callback();
                        }else{
                          callback();
                        }
                    },
                    },
                  ],
                })(
                  <Select
                    className="select"
                    getPopupContainer={trigger => trigger.parentNode}
                    disabled={disabled || item.disabled}
                    style={{ width: '100%' }}//增加样式xwx2018/12/25
                  >
                    {item.option &&
                      item.option.map(_ => {
                        return (
                          <Option key={_.key} value={_.key}>
                            {_.value}
                          </Option>
                        );
                      })}
                  </Select>
                )}
                {
                  item.ButtonList ?
                    item.ButtonList.map(i => {
                      return (
                        <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                      );
                    }) : null
                }
              </Form.Item>
            ) :item.type === 'infoAuth'?(
              <Form.Item {...formItemLayout} label={item.label}>
                  {
                      getFieldDecorator(item.key,{rules:[{type:'string',required:item.required,whitespace:true,message:`${item.label}为必填项`}]})
                      (<Input disabled style={{width:'calc(100% - 200px)'}}/>)
                  }
                  {
                      item.ButtonList?item.ButtonList.map(i => {return (<Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>);}) : null
                  }
              </Form.Item>
            ):item.label==='奖励参与用户经验值数'?(
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  initialValue: 3,
                  rules: [
                    {
                      required: item.required,
                      whitespace: true,
                      type: 'number',
                      validator: (rule, value, callback) => {
                        if(value<0){
                            callback('请勿输入负数');
                        }else if(value>100){
                            callback('数值不得超过100');
                        }else if(String(value).indexOf('.')!=-1){
                            callback('请勿输入小数');
                        }else if(isNaN(value)&&value!=undefined){
                          callback('请勿输入非数字');
                        }else if(item.required && !value) {  // yelu 添加 增加为空的提示，解决为空点保存未验证的bug
                            callback(`${item.label}为必填项`);
                        }else{
                            callback();
                        }
                      },
                    },
                  ],
                })(
                  <InputNumber
                    className="input1"
                    placeholder="请输入数字"
                    disabled={disabled||(isEditid&&isEditid==1)}
                  />
                )}
              </Form.Item>
              )
              :item.label==='惩罚参与用户经验值数'?(
                <Form.Item {...formItemLayout} label={item.label}>
                  {getFieldDecorator(item.key, {
                    initialValue: 6,
                    rules: [
                      {
                        required: item.required,
                        whitespace: true,
                        type: 'number',
                        validator: (rule, value, callback) => {
                          if(value<0){
                              callback('请勿输入负数');
                          }else if(value>100){
                              callback('数值不得超过100');
                          }else if(String(value).indexOf('.')!=-1){
                              callback('请勿输入小数');
                          }else if(isNaN(value)&&value!=undefined){
                            callback('请勿输入非数字');
                        }else if(item.required && !value) {  // yelu 添加 增加为空的提示，解决为空点保存未验证的bug
                            callback(`${item.label}为必填项`);
                        }else{
                              callback();
                          }
                        },
                      },
                    ],
                  })(
                    <InputNumber
                      className="input1"
                      placeholder="请输入数字"
                      disabled={disabled||(isEditid&&isEditid==1)}
                    />
                  )}
                </Form.Item>
                )
                :item.label==='每天最多投票次数'?(
                  <Form.Item {...formItemLayout} label={item.label}>
                    {getFieldDecorator(item.key, {
                      initialValue: "",
                      rules: [
                        {
                          required: item.required,
                          whitespace: true,
                          type: 'number',
                          validator: (rule, value, callback) => {
                            if(value<0){
                                callback('请勿输入负数');
                            }else if(String(value).indexOf('.')!=-1){
                                callback('请勿输入小数');
                            }else if(isNaN(value)&&value!=undefined){
                              callback('请勿输入非数字');
                          }else if(value===0){
                            callback('参与人数上限不能为0');
                           }else{
                                callback();
                          }
                          },
                        },
                      ],
                    })(
                      <InputNumber
                        className="input1"
                        placeholder="请输入数字"
                        disabled={disabled}
                      />
                    )}
                  </Form.Item>
                  )
                :item.label===('参与人数上限')?(
                  <Form.Item {...formItemLayout} label={item.label}>
                    {getFieldDecorator(item.key, {
                      initialValue:"",
                      rules: [
                        {
                          required: item.required,
                          whitespace: true,
                          type: 'number',
                          validator: (rule, value, callback) => {
                            if(value<0){
                                callback('请勿输入负数');
                            }else if(String(value).indexOf('.')!=-1){
                                callback('请勿输入小数');
                            }else if(isNaN(value)&&value!=undefined){
                              callback('请勿输入非数字');
                          }else if(value===0){
                            callback('参与人数上限不能为0');
                           }else{
                                callback();
                            }
                          },
                        },
                      ],
                    })(
                      <InputNumber
                        className="input1"
                        placeholder="请输入数字"
                        disabled={disabled||(isEditid&&isEditid==1)}
                      />
                    )}
                  </Form.Item>
                  ):
               item.type === 'inputNumber' ?(
                <Form.Item {...formItemLayout} label={item.label}>
                  {getFieldDecorator(item.key, {
                    initialValue: "",
                    rules: [
                      {
                        required: item.required,
                        whitespace: true,
                        type: 'number',
                        validator: (rule, value, callback) => {
                          if(value<0){
                              callback('请勿输入负数');
                          }
                          // else if(value>9999){
                          //     callback('数值不得超过9999');
                          // }
                          else if(String(value).indexOf('.')!=-1){
                              callback('请勿输入小数');
                          }else if(isNaN(value)&&value!=undefined){
                              callback('请勿输入非数字');
                          }else if(item.required && !value) {  // yelu 添加 增加为空的提示，解决为空点保存未验证的bug
                              callback(`${item.label}为必填项`);
                          }else{
                              callback();
                          }
                        },
                      },
                    ],
                  })(
                    <InputNumber
                      className="input1"
                      placeholder="请输入数字"
                      disabled={disabled||(isEditid&&isEditid==1)}
                    />
                  )}
                </Form.Item>
                ): item.type === 'rangePicker' ? (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  initialValue:"",
                  rules: [
                    {
                      type: 'array',
                      required: item.required,
                      whitespace: true,
                      message: `${item.label}必填项`,
                    },               
                  ],
                })(<RangePicker className="input" disabled={disabled||isforbed} showTime format="YYYY-MM-DD HH:mm:ss"/>)}
                {
                  item.ButtonList ?
                    item.ButtonList.map(i => {
                      return (
                        <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                      );
                    }) : null
                }
                {
                  item.code == 'pickTime' ? (<span style={{paddingLeft: 6, color: '#000'}}>备注:取货时间必须不小于订购结束时间!!!</span>) : null
                }
              </Form.Item>
            ) : item.type === 'inputLive' ? (
              <Form.Item {...formItemLayout} label={item.label}>
                    {getFieldDecorator(item.key, {
                      rules: [
                        {
                          required: item.required,
                          whitespace: item.required,
                          max: item.max,
                          message: `${item.label}为必填项,且最大长度不能超过${item.max}个字`,
  
                        },
                      ],
                    })(
                      <Input
                        className="input1"
                        placeholder="请输入关键字"
                        disabled={disabled}
                      />
                    )}
                  </Form.Item>
            ) : item.type === 'input' ? (
              item.word === '' || item.word === undefined ? (
                <Form.Item {...formItemLayout} label={item.label}>
                  {getFieldDecorator(item.key, {
                    rules: [
                      {
                        required: item.required,
                        whitespace: item.required,
                        max: item.max,
                        message: `${item.label}为必填项,且最大长度不能超过${item.max}个字`,

                      },
                    ],
                  })(
                    <Input
                      className="input1"
                      placeholder="请输入关键字"
                      disabled={disabled}
                    />
                  )}
                  {
                    item.ButtonList ?
                      item.ButtonList.map(i => {
                        return (
                          <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                        );
                      }) : null
                  }
                </Form.Item>
              ) :
              (
                  <Form.Item {...formItemLayout} label={item.label}>
                    {getFieldDecorator(item.key, {
                      initialValue: `${item.word}`,
                      rules: [
                        {
                          required: item.required,
                          whitespace: item.required,
                          message: `${item.label}为必填项`,

                        },
                      ],
                    })(
                      <Input
                        className="input1"
                        disabled={disabled}
                      />
                    )}
                    {
                      item.ButtonList ?
                        item.ButtonList.map(i => {
                          return (
                            <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                          );
                        }) : null
                    }
                  </Form.Item>
                )
            ): item.type === 'textarea' ? (
              /**
               * 朱劲松 修改‘事项提醒内容字数限制太少，需限制到最大可输入500字，输入框修改为多行输入框’
               * BUG 2754
               * 新增 判断
               */
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  rules: [
                    {
                      required: item.required,
                      whitespace: item.required,
                      max: item.max,
                      message: `${item.label}为必填项,且最大长度不能超过${item.max}个字`,

                    },
                  ],
                })(
                  <TextArea 
                    className="input1"
                    placeholder="请输入关键字"
                    disabled={disabled}
                    autosize={ {minRows: 3, maxRows: 3 }}
                  />
                )}
                {
                  item.ButtonList ?
                    item.ButtonList.map(i => {
                      return (
                        <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                      );
                    }) : null
                }
              </Form.Item>
            ) : item.type==='inputPhone' ? (
              //非必填项验证手机格式xwx/2018/12/10
              item.word === '' || item.word === undefined ? (
                <Form.Item {...formItemLayout} label={item.label}>
                  {getFieldDecorator(item.key, {
                    rules: [
                      {
                        required: item.required,
                        whitespace: item.required,
                        max: item.max,
                        pattern :/^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,  
                        type:'string',
                        message: `${item.label}格式不正确，请输入正确的${item.label}`,

                      },
                    ],
                  })(
                    <Input
                      className="input1"
                      placeholder="请输入关键字"
                      disabled={disabled}
                    />
                  )}
                  {
                    item.ButtonList ?
                      item.ButtonList.map(i => {
                        return (
                          <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                        );
                      }) : null
                  }
                </Form.Item>
              ) : (
                  <Form.Item {...formItemLayout} label={item.label}>
                    {getFieldDecorator(item.key, {
                      initialValue: `${item.word}`,
                      rules: [
                        {
                          required: item.required,
                          whitespace: item.required,
                          message: `${item.label}为必填项`,

                        },
                      ],
                    })(
                      <Input
                        className="input1"
                        disabled={disabled}
                      />
                    )}
                    {
                      item.ButtonList ?
                        item.ButtonList.map(i => {
                          return (
                            <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                          );
                        }) : null
                    }
                  </Form.Item>
                )
              //非必填项验证网址格式xwx/2018/12/10
            ):item.type==='inputUrl' ? (
              item.word === '' || item.word === undefined ? (
                <Form.Item {...formItemLayout} label={item.label}>
                  {getFieldDecorator(item.key, {
                    rules: [
                      {
                        required: item.required,
                        whitespace: item.required,
                        max: item.max,
                        type:'url',
                        message: `${item.label}格式不正确，请输入正确的${item.label}`,

                      },
                    ],
                  })(
                    <Input
                      className="input1"
                      placeholder="请输入关键字"
                      disabled={disabled}
                    />
                  )}
                  {
                    item.ButtonList ?
                      item.ButtonList.map(i => {
                        return (
                          <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                        );
                      }) : null
                  }
                </Form.Item>
              ) : (
                  <Form.Item {...formItemLayout} label={item.label}>
                    {getFieldDecorator(item.key, {
                      initialValue: `${item.word}`,
                      rules: [
                        {
                          required: item.required,
                          whitespace: item.required,
                          message: `${item.label}为必填项`,

                        },
                      ],
                    })(
                      <Input
                        className="input1"
                        disabled={disabled}
                      />
                    )}
                    {
                      item.ButtonList ?
                        item.ButtonList.map(i => {
                          return (
                            <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                          );
                        }) : null
                    }
                  </Form.Item>
                )
              //非必填项验证邮箱格式xwx/2018/12/10
            )
            :item.type==='inputEmail' ? (
              item.word === '' || item.word === undefined ? (
                <Form.Item {...formItemLayout} label={item.label}>
                  {getFieldDecorator(item.key, {
                    rules: [
                      {
                        required: item.required,
                        whitespace: item.required,
                        max: item.max,
                        type:'email',
                        message: `${item.label}格式不正确，请输入正确的${item.label}`,

                      },
                    ],
                  })(
                    <Input
                      className="input1"
                      placeholder="请输入关键字"
                      disabled={disabled}
                    />
                  )}
                  {
                    item.ButtonList ?
                      item.ButtonList.map(i => {
                        return (
                          <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                        );
                      }) : null
                  }
                </Form.Item>
              ) : (
                  <Form.Item {...formItemLayout} label={item.label}>
                    {getFieldDecorator(item.key, {
                      initialValue: `${item.word}`,
                      rules: [
                        {
                          required: item.required,
                          whitespace: item.required,
                          message: `${item.label}为必填项`,

                        },
                      ],
                    })(
                      <Input
                        className="input1"
                        disabled={disabled}
                      />
                    )}
                    {
                      item.ButtonList ?
                        item.ButtonList.map(i => {
                          return (
                            <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                          );
                        }) : null
                    }
                  </Form.Item>
                )
              //非必填项验证手机格式xwx/2018/12/10
            )
            :item.type === 'relation_test' ? (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  rules: [
                    {
                      required: item.required,
                      whitespace: item.required,
                      max: item.max,
                      message: `${item.label}为必填项`,

                    },
                  ],
                })
                (
                    <Select style={{width:'50%'}}  disabled={disabled} >
                        {testList&&testList.map((e,index)=><Option value={e.id} key={e.id} >{e.activityName}</Option>)}
                    </Select>
                )
                }　　　
                {
                  <Button onClick={this.testClick}  disabled={disabled}>选择考试</Button>
                }
              </Form.Item>
            ) : item.type === 'selectTree' || item.type === 'checkTree' ? (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  initialValue: [],
                  rules: [
                    {
                      type: 'array',
                      required: item.required,
                      whitespace: true,
                      message: `${item.label}必填项`,
                    },
                  ],
                })(
                  <SingleTree
                    moduleType={this.props.type}
                    type={item.type}
                    disabled={disabled}
                    // treeType={this.state.infoType}
                    style={this.props.style}
                    allData={this.state.allData}
                    leaveData={this.props.leaveData[this.props.belonged][item.key]}
                    flowData={this.props.flowData[item.key]}
                    initialValue={initialValue ? initialValue[item.key] : ''}
                  />
                )}
              </Form.Item>
            ) : item.type === 'columnTree'? 
            (<Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  initialValue: [],
                  rules: [
                    {
                      type: 'array',
                      required: item.required,
                      whitespace: true,
                      message: `${item.label}必填项`,
                    },
                  ],
                })(
                  <ColumnTree
                    moduleType={this.props.type}
                    belongedType={this.props.belongedType}
                    type={item.type}
                    disabled={disabled}
                    // treeType={this.state.infoType}
                    style={this.props.style}
                    allData={this.state.allData}
                    leaveData={this.props.leaveData[this.props.belonged][item.key]}
                    flowData={this.props.flowData[item.key]}
                    initialValue={initialValue ? initialValue[item.key] : ''}
                  />
                )}
              </Form.Item>)
              : item.type === 'infoColumnTree'? 
              <Row>
                  <Col span={24}>
                      <Form.Item {...formItemLayout} label={item.label}>
                      {getFieldDecorator(item.key, {
                        initialValue: [],
                        rules: [
                          {
                            type: 'array',
                            required: item.required,
                            whitespace: true,
                            message: `${item.label}必填项`,
                          },
                        ],
                      })(
                        <ColumnTree
                          moduleType={this.props.type}
                          belongedType={this.props.belongedType}
                          type={item.type}
                          disabled={disabled}
                          // treeType={this.state.infoType}
                          style={this.props.style}
                          allData={this.state.allData}
                          leaveData={this.props.leaveData[this.props.belonged][item.key]}
                          flowData={this.props.flowData[item.key]}
                          initialValue={initialValue ? initialValue[item.key] : ''}
                        />
                      )}
                    </Form.Item>
                  </Col>
                  {
                    isExamine?
                    <Col span={24}>
                    <Form.Item {...formItemLayout} label='备注信息'>
                        {getFieldDecorator('remark', {
                          rules: [
                            {
                              type:'string',
                              required: true,
                              whitespace: true,
                              // message: `备注信息为必填项`,
                              validator: (rule, value, callback) => {
                                if(!value){
                                    callback('备注信息为必填项');
                                }else if(value.length>255){
                                    callback('备注信息字数不得超过255字');
                                }else{
                                    callback();
                                }
                              },
                            },
                          ],
                        })(
                          <TextArea rows={4} style={{width:'100%'}} placeholder="请填写备注信息，审核人可以查看您的备注信息" disabled={disabled} />
                        )}
                      </Form.Item>
                  </Col>:null
                  }
              </Row>
              : item.type === 'LearnTree' ? (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  initialValue: [],
                  rules: [
                    {
                      type: 'array',
                      required: item.required,
                      whitespace: true,
                      message: `${item.label}必填项`,
                    },
                  ],
                })(
                  <PartyTree
                    moduleType={this.props.type}
                    type={item.type}
                    disabled={disabled}
                    // treeType={this.state.infoType}
                    style={this.props.style}
                    allData={this.state.allData}
                    leaveData={this.props.leaveData[this.props.belonged][item.key]}
                    flowData={this.props.flowData[item.key]}
                    initialValue={initialValue ? initialValue[item.key] : ''}
                    // userId={this.props.id?this.props.id.id:null}
                  />
                )}
              </Form.Item>
            ):item.type==='LearnManagationTree'?(
                 <LearnManagationTree
                    moduleType={this.props.type}
                    type={item.type}
                    disabled={disabled}
                    // treeType={this.state.infoType}
                    style={this.props.style}
                    allData={this.state.allData}
                    leaveData={this.props.leaveData[this.props.belonged][item.key]}
                    flowData={this.props.flowData[item.key]}
                    initialValue={initialValue ? initialValue[item.key] : ''}
                    userId={this.props.id?this.props.id.id:null}
                  />
            ): item.type === 'datePicker' ? 
            (item.label==='提醒时间'?
            (<Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  initialValue: '',
                  rules: [
                    {
                      type: 'object',
                      required: item.required,
                      whitespace: true,
                      message: `${item.label}必填项`,
                    },
                  ],
                })(
                    // <DatePicker disabled={disabled} disabledDate={this.disabledDate} disabledDateTime={this.disabledDateTime} showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} format="YYYY-MM-DD HH:mm:ss"/>
                    /**
                     * 朱劲松
                     * 2018-12-07
                     * 修改 ‘服务管理---事项提醒管理---新建---提醒时间 默认时间应为当前时间 ’ BUG 1704
                     */
                    <DatePicker disabled={disabled} disabledDate={this.disabledDate} disabledDateTime={this.disabledDateTime} showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }} format="YYYY-MM-DD HH:mm:ss"/>
                  )}
                {
                  item.ButtonList ?
                    item.ButtonList.map(i => {
                      return (
                        <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                      );
                    }) : null
                }
              </Form.Item>
            ) :            (<Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  rules: [
                    {
                      type: 'object',
                      required: item.required,
                      whitespace: true,
                      message: `${item.label}必填项`,
                    },
                  ],
                })(<DatePicker disabled={disabled||(isEditid&&isEditid==1)||isforbed} showTime format="YYYY-MM-DD HH:mm:ss"/>)}
                {
                  item.code == 'pickDate' ? (<span style={{paddingLeft: 6, color: '#000'}}>
                  备注:取货提醒时间必须不小于订购结束时间不大于取货结束时间!!!
                  </span>) : null
                }
                {
                  item.ButtonList ?
                    item.ButtonList.map(i => {
                      return (
                        <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                      );
                    }) : null
                }
              </Form.Item>
            ) 
            )

            : item.type === 'inputNumber' ? 
            (item.label==='参与人数上限'?
            (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  initialValue: '',
                })(<Input className="input1" disabled={disabled} />)}
                {
                  item.ButtonList ?
                    item.ButtonList.map(i => {
                      return (
                        <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                      );
                    }) : null
                }
              </Form.Item>
            ):
            item.label==='奖励参与用户经验值数'?//添加奖励和惩罚的用户经验值数的默认值xwx/2018/12/10
            (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  initialValue: '3',
                  //2018/12/7xwx新增min={0} step={1}
                })(<InputNumber className="input1" disabled={disabled||(isEditid&&isEditid==1)} min={0} onChange={(value) => this.handleTreasureChange(value, item.key)} />)}
                {
                  item.ButtonList ?
                    item.ButtonList.map(i => {
                      return (
                        <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                      );
                    }) : null
                }
              </Form.Item>
            ):
            item.label==='惩罚参与用户经验值数'?
            (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  initialValue: '6',  
                  //2018/12/7xwx新增min={0} step={1}
                })(<InputNumber className="input1" disabled={disabled||(isEditid&&isEditid==1)} min={0} onChange={(value) => this.handleTreasureChange(value, item.key)} />)}
                {
                  item.ButtonList ?
                    item.ButtonList.map(i => {
                      return (
                        <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                      );
                    }) : null
                }
              </Form.Item>
            ):item.label==='期数'?
            (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  rules: [
                    {
                      type: 'number',
                      required: item.required,
                      whitespace: true,
                      // message: `${item.label}为必填项,且必须为整数！`,
                      validator: (rule, value, callback) => {
                          if(!value){
                              callback('期数为必填项且为大于0的整数');
                          }else if(value<1){
                              callback('请勿输入负数');
                          }else if(value>999999999){
                              callback('数值不得超过999999999');
                          }else if(String(value).indexOf('.')!=-1){
                              callback('请勿输入小数');
                          }else if(isNaN(value)){
                              callback('请勿输入非数字');
                          }{
                              callback();
                          }
                      },
                    },
                  ],
                  initialValue:'',
                })(<InputNumber className="input1" disabled={disabled||(isEditid&&isEditid==1)}  />)}
              </Form.Item>
            ):item.label==='序号'?
            (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  rules: [
                    {
                      type: 'number',
                      required: item.required,
                      whitespace: true,
                      // message: `${item.label}为必填项,且必须为整数！`,
                      validator: (rule, value, callback) => {
                        if(!value){
                            callback('序号为必填项且为大于0的整数');
                        }else if(value<1){
                            callback('请勿输入负数');
                        }else if(value>999999999){
                            callback('数值不得超过999999999');
                        }else if(String(value).indexOf('.')!=-1){
                            callback('请勿输入小数');
                        }else if(isNaN(value)){
                            callback('请勿输入非数字');
                        }{
                            callback();
                        }
                    },
                    },
                  ],
                  initialValue: '',
                })(<InputNumber className="input1" disabled={disabled||(isEditid&&isEditid==1)}/>)}
                {
                  item.ButtonList ?
                    item.ButtonList.map(i => {
                      return (
                        <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                      );
                    }) : null
                }
              </Form.Item>
            ):
            (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  rules: [
                    {
                      type: 'number',
                      required: item.required,
                      whitespace: true,
                      message: `${item.label}为必填项,且必须为整数！`,
                    },
                  ],
                  initialValue: null,
                  //2018/12/7xwx新增min={0} step={1}
                })(<InputNumber className="input1" disabled={disabled||(isEditid&&isEditid==1)} min={0} onChange={(value) => this.handleTreasureChange(value, item.key)} />)}
                {
                  item.ButtonList ?
                    item.ButtonList.map(i => {
                      return (
                        <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                      );
                    }) : null
                }
              </Form.Item>
            )
            )
            : item.type === 'inputNumber1' ? (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  rules: [
                    {
                      type: 'number',
                      required: item.required,
                      whitespace: true,
                      message: `${item.label}为必填项,且必须为整数！`,
                    },
                  ],
                })(<InputNumber disabled={disabled||(isEditid&&isEditid==1)} className="input1"  />)}
              </Form.Item>
            )  : item.type === 'inputNumber2' ? (
              <Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  rules: [
                    {
                      type: 'number',
                      required: item.required,
                      whitespace: true,
                      message: `${item.label}必须为整数！`,
                    },
                  ],initialValue:this.state.number,
                })(<InputNumber  onChange={e=>this.changeTreasure(e)} disabled={disabled||(isEditid&&isEditid==1)}  className="input1"  />)}
              </Form.Item>
               ):item.type === 'titlePicture'?
               (<Form.Item {...formItemLayout} label={item.label}>
               {getFieldDecorator(item.key, {
                 initialValue: [],
                 rules: [
                   {
                     required: item.required,
                     whitespace: true,
                     validator: (rule, value, callback) => {
                       if (!item.required) {
                         callback();
                       }
                       if (value && value.length&&value[0]!='' > 0) {
                         if (typeof value === 'string' || 'array') {
                           callback();
                         }
                       } else {
                         callback(`${item.label}为必填项`);
                       }
                     },
                   },
                 ],
               })(
                 (
                   <TitlePicture keys={item.key} type={item.type} modal={this.props.type}  RadioValue={this.state.RadioValue} disabled={disabled} titleimage={initialValue!=null?initialValue[item.key]:null}
                     datatype={item.datatype}
                     isIamge={item.isIamge ? true : false}
                     initialValue={this.props.initialValue ? this.props.initialValue[item.key] : this.props.flowData[item.key] ? this.props.flowData[item.key] : this.props.leaveData ? this.props.leaveData[this.props.belonged][item.key] : ''} describe={item.describe} mode={item.label} />
                 ) 
               )}
             </Form.Item>
              ):item.type === 'filePicture'?
              (<Form.Item {...formItemLayout} label={item.label}>
              {getFieldDecorator(item.key, {
                initialValue: [],
                rules: [
                  {
                    required: item.required,
                    whitespace: true,
                    validator: (rule, value, callback) => {
                      if (!item.required) {
                        callback();
                      }
                      if (value && value.length&&value[0]!='' > 0) {
                        if (typeof value === 'string' || 'array') {
                          callback();
                        }
                      } else {
                        callback(`${item.label}为必填项`);
                      }
                    },
                  },
                ],
              })(
               (
                 <FilePicture keys={item.key} type={item.type} modal={this.props.type}  RadioValue={this.state.RadioValue} disabled={disabled||(isEditid&&isEditid==1)} titleimage={initialValue!=null?initialValue[item.key]:null}
                   datatype={item.datatype}
                   isAttach={item.isAttach ? true : false}
                   isIamge={item.isIamge ? true : false}
                   style = {item.style}
                   onChangeContentImage={this.onChangeContentImage}
                   initialValue={this.props.initialValue ? this.props.initialValue[item.key] : this.props.flowData[item.key] ? this.props.flowData[item.key] : this.props.leaveData ? this.props.leaveData[this.props.belonged][item.key] : ''} describe={item.describe} mode={item.label} />
               ) 
              )}
            </Form.Item>
              ): item.type === 'uploadPicture_drop' ||
              item.type === 'uploadPicture_button' ?
              (item.magazineType==='magazine'?
              (<Form.Item {...formItemLayout} label={item.label}>
                {getFieldDecorator(item.key, {
                  initialValue: [],
                  rules: [
                    {
                      //type:'array',
                      required: item.required,
                      whitespace: true,
                      //message: `${item.label}为必填项`,
                      validator: (rule, value, callback) => {
                        if (!item.required) {
                          callback();
                        }
                        if (value && value.length&&value[0]!='' > 0) {
                          if (typeof value === 'string' || 'array') {
                            callback();
                          }
                        } else {
                          callback(`${item.label}为必填项`);
                        }
                      },
                    },
                  ],
                })(
                  // !disabled ? 
                  (
                    <UploadPicture keys={item.key} magazineType={'magazine'} type={item.type} modal={this.props.type} isRadio={item.isRadio} RadioValue={this.state.RadioValue} disabled={disabled} titleimage={initialValue!=null?initialValue[item.key]:null}
                      datatype={item.datatype}
                      isAttach={item.isAttach ? true : false}
                      isRadio={item.isRadio ? true : false}
                      isIamge={item.isIamge ? true : false}
                      initialValue={this.props.initialValue ? this.props.initialValue[item.key] : this.props.flowData[item.key] ? this.props.flowData[item.key] : this.props.leaveData ? this.props.leaveData[this.props.belonged][item.key] : ''} describe={item.describe} mode={item.label} />
                  ) 
                  // : (
                  //     <div>
                  //       <Button onClick={() => this.setState({ img_review: item.isIamge ? true : false, isAttach: item.isAttach ? true : false, isRadio: item.isRadio ? true : false, fileName: item.type === 'uploadPicture_drop' ? initialValue[item.key] : initialValue[item.key], imgValue: item.type === 'uploadPicture_drop' ? initialValue[item.key] : initialValue[item.key] })}>查看</Button>
                  //     </div>
                  //   )
                )}
              </Form.Item>
            ) : (item.magazineType==='magazine1'?
            (<Form.Item {...formItemLayout} label={item.label}>
              {getFieldDecorator(item.key, {
                initialValue: [],
                rules: [
                  {
                    //type:'array',
                    required: item.required,
                    whitespace: true,
                    //message: `${item.label}为必填项`,
                    validator: (rule, value, callback) => {
                      if (!item.required) {
                        callback();
                      }
                      if (value && value.length&&value[0]!='' > 0) {
                        if (typeof value === 'string' || 'array') {
                          callback();
                        }
                      } else {
                        callback(`${item.label}为必填项`);
                      }
                    },
                  },
                ],
              })(
                // !disabled ? 
                (
                  <UploadPicture keys={item.key} magazineType={'magazine1'} type={item.type} modal={this.props.type} isRadio={item.isRadio} RadioValue={this.state.RadioValue} disabled={disabled} titleimage={initialValue!=null?initialValue[item.key]:null}
                    datatype={item.datatype}
                    isAttach={item.isAttach ? true : false}
                    isRadio={item.isRadio ? true : false}
                    isIamge={item.isIamge ? true : false}
                    initialValue={this.props.initialValue ? this.props.initialValue[item.key] : this.props.flowData[item.key] ? this.props.flowData[item.key] : this.props.leaveData ? this.props.leaveData[this.props.belonged][item.key] : ''} describe={item.describe} mode={item.label} />
                ) 
                // : (
                //     <div>
                //       <Button onClick={() => this.setState({ img_review: item.isIamge ? true : false, isAttach: item.isAttach ? true : false, isRadio: item.isRadio ? true : false, fileName: item.type === 'uploadPicture_drop' ? initialValue[item.key] : initialValue[item.key], imgValue: item.type === 'uploadPicture_drop' ? initialValue[item.key] : initialValue[item.key] })}>查看</Button>
                //     </div>
                //   )
              )}
            </Form.Item>) :
                        (<Form.Item {...formItemLayout} label={item.label}>
                          {getFieldDecorator(item.key, {
                            initialValue: [],
                            rules: [
                              {
                                //type:'array',
                                required: item.required,
                                whitespace: true,
                                //message: `${item.label}为必填项`,
                                validator: (rule, value, callback) => {
                                  if (!item.required) {
                                    callback();
                                  }
                                  if (value && value.length&&value[0]!='' > 0) {
                                    if (typeof value === 'string' || 'array') {
                                      callback();
                                    }
                                  } else {
                                    callback(`${item.label}为必填项`);
                                  }
                                },
                              },
                            ],
                          })(
                            // !disabled ? 
                            (
                              <UploadPicture 
                                keys={item.key} 
                                type={item.type} 
                                modal={this.props.type} 
                                isRadio={item.isRadio} 
                                RadioValue={this.state.RadioValue} 
                                disabled={disabled} 
                                titleimage={initialValue!=null?initialValue[item.key]:null}
                                datatype={item.datatype} getpicUrl={this.props.getpicUrl} editpicUrl={this.props.editpicUrl}
                                isAttach={item.isAttach ? true : false}
                                isRadio={item.isRadio ? true : false}
                                isIamge={item.isIamge ? true : false}
                                style = {item.style}
                                // onChange={this.onChangeContentImage}
                                initialValue={this.props.initialValue ? this.props.initialValue[item.key] : this.props.flowData[item.key] ? this.props.flowData[item.key] : this.props.leaveData ? this.props.leaveData[this.props.belonged][item.key] : ''} describe={item.describe} mode={item.label} />
                            ) 
                            // : (
                            //     <div>
                            //       <Button onClick={() => this.setState({ img_review: item.isIamge ? true : false, isAttach: item.isAttach ? true : false, isRadio: item.isRadio ? true : false, fileName: item.type === 'uploadPicture_drop' ? initialValue[item.key] : initialValue[item.key], imgValue: item.type === 'uploadPicture_drop' ? initialValue[item.key] : initialValue[item.key] })}>查看</Button>
                            //     </div>
                            //   )
                          )}
                        </Form.Item>)     
                        )
                          )
                              : item.type === 'radioButton' ? 
                              (item.label==="是否可匿名评论"?
                              (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    initialValue: item.option[1].value,
                                    rules: [
                                      {
                                        type: typeof item.option[1].value,
                                        required: item.required,
                                        whitespace: true,
                                        message: `${item.label}为必填项`,
                                      },
                                    ],
                                  })(
                                    <RadioGroup
                                      disabled={disabled?true:ArticleRadio}
                                      options={item.option}
                                      onChange={e => this.onRadioChange(e, item.key,item.label)}
                                    />
                                  )}
                                  {
                                    item.ButtonList ?
                                      item.ButtonList.map(i => {
                                        return (
                                          <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                                        );
                                      }) : null
                                  }
                                </Form.Item>
                              )
                              :item.label==='是否只能内部转发'?
                              (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    initialValue: item.option[1].value,
                                    rules: [
                                      {
                                        type: typeof item.option[1].value,
                                        required: item.required,
                                        whitespace: true,
                                        message: `${item.label}为必填项`,
                                      },
                                    ],
                                  })(
                                    <RadioGroup
                                      disabled={disabled?true:ArticleRadioTwo}
                                      options={item.option}
                                      onChange={e => this.onRadioChange(e, item.key,item.label)}
                                    />
                                  )}
                                  {
                                    item.ButtonList ?
                                      item.ButtonList.map(i => {
                                        return (
                                          <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                                        );
                                      }) : null
                                  }
                                </Form.Item>
                              )
                              :item.label==='是否推送'?
                              (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    initialValue: item.option[1].value,
                                    rules: [
                                      {
                                        type: typeof item.option[1].value,
                                        required: item.required,
                                        whitespace: true,
                                        message: `${item.label}为必填项`,
                                      },
                                    ],
                                  })(
                                    <RadioGroup
                                      disabled={disabled}
                                      options={item.option}
                                      onChange={e => this.onRadioChange(e, item.key)}
                                    />
                                  )}
                                  {
                                    item.ButtonList ?
                                      item.ButtonList.map(i => {
                                        return (
                                          <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                                        );
                                      }) : null
                                  }
                                </Form.Item>
                              ):item.label==='是否设置为图集'?
                              (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    initialValue: item.option[1].value,
                                    rules: [
                                      {
                                        type: typeof item.option[0].value,
                                        required: item.required,
                                        whitespace: true,
                                        message: `${item.label}为必填项`,
                                      },
                                    ],
                                  })(
                                    <RadioGroup
                                      disabled={disabled}
                                      options={item.option}
                                      // onChange={e => this.onIsatlasChange(e, item.key)}
                                      onChange={e => this.onRadioChange(e, item.key,item.label)}
                                    />
                                  )}
                                </Form.Item>
                              ):item.key === 'isImportant'?
                              (
                                <Form.Item {...formItemLayout} label={<Tooltip title="选是该资讯永远在线,选否该资讯会自动下线">{item.label}</Tooltip>}>
                                {getFieldDecorator(item.key, {
                                  initialValue: item.option[0].value,
                                  rules: [
                                    {
                                      type: typeof item.option[0].value,
                                      required: item.required,
                                      whitespace: true,
                                      message: `${item.label}为必填项`,
                                    },
                                  ],
                                })(
                                  <RadioGroup
                                    disabled={disabled}
                                    options={item.option}
                                    onChange={e => this.onRadioChange(e, item.key,item.label)}
                                  />
                                )}
                                
                              </Form.Item>
                              ):
                              (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    initialValue: item.option[0].value,
                                    rules: [
                                      {
                                        type: typeof item.option[0].value,
                                        required: item.required,
                                        whitespace: true,
                                        message: `${item.label}为必填项`,
                                      },
                                    ],
                                  })(
                                    <RadioGroup
                                      disabled={disabled}
                                      options={item.option}
                                      onChange={e => this.onRadioChange(e, item.key,item.label)}
                                    />
                                  )}
                                  {
                                    item.ButtonList ?
                                      item.ButtonList.map(i => {
                                        return (
                                          <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                                        );
                                      }) : null
                                  } 
                                </Form.Item>
                              ))
                              : item.type === 'richText' ? 
                                (item.label==='视频内容'?(
                                  <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    
                                  })(<RichText wordCount={this.wordCount.bind(this)} disabled={disabled} initialValue={initialValue ? initialValue[item.key] : ''} flowData={this.props.flowData[item.key]} leaveData={this.props.leaveData[this.props.belonged][item.key]} />)}
                                </Form.Item>
                                ):(<Form.Item {...formItemLayout} label={item.label}>
                                {getFieldDecorator(item.key, {
                                  rules: [
                                    {
                                      required: item.required,
                                      message: `${item.label}为必填项`,
                                      whitespace: true,
                                    },
                                  ],
                                })(<RichText wordCount={this.wordCount.bind(this)} disabled={disabled} initialValue={initialValue ? initialValue[item.key] : ''} flowData={this.props.flowData[item.key]} leaveData={this.props.leaveData[this.props.belonged][item.key]} />)}
                              </Form.Item>))
                              : item.type === 'textArea' ? (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    rules: [
                                      {
                                        required: item.required,
                                        whitespace: true,
                                        message: `${item.label}必填项`,
                                      },
                                    ],
                                  })(
                                    <TextArea
                                      className="textarea"
                                      placeholder="请输入关键字"
                                      disabled={disabled}
                                    />
                                  )}
                                </Form.Item>)
                                  : item.type === 'txtArea' ? (
                                    <Form.Item {...formItemLayout} label={item.label}>
                                      {getFieldDecorator(item.key, {
                                        rules: [
                                          {
                                            required: item.required,
                                            whitespace: true,
                                            // message: `${item.label}必填项`,
                                            validator: (rule, value, callback)=>{
                                              if(!value){
                                                callback(`${item.label}必填项`);
                                              }else if(value.length>100){
                                                callback(`${item.label}字数不得超过100`);
                                              }else{
                                                callback();
                                              }
                                          },
                                            
                                          },
                                        ],
                                      })(
                                        <TextArea
                                          className="textarea"
                                          placeholder="请输入关键字"
                                          disabled={disabled}
                                        />
                                      )}
                                    </Form.Item>
                              ) : item.type === 'cascader' ? (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    rules: [
                                      {
                                        type: 'array',
                                        required: item.key == 'treasureProvider' && this.state.isValid == true ? true : item.required,
                                        whitespace: true,
                                        message: `${item.label}必填项`,
                                      },
                                    ],
                                  })(
                                    <Cascader
                                      className="input"
                                      options={this.state.dp}
                                      placeholder="请输入关键字"
                                      disabled={disabled}
                                      changeOnSelect
                                      style={{width:'100%'}}
                                    />
                                  )}
                                  {
                                    item.ButtonList ?
                                      item.ButtonList.map(i => {
                                        return (
                                          <Button onClick={() => this.handleBtn(i, this.get, this.set)}>{i.label}</Button>
                                        );
                                      }) : null
                                  }
                                </Form.Item>
                              ) : item.type === 'isrequired' ? (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    initialValue: '',
                                    rules: [
                                      {
                                        type:'string',
                                        required: item.required,
                                        whitespace: true,
                                        message: `${item.label}必填项`,
                                      },
                                    ],
                                  })(
                                    <Select
                                      disabled={disabled}
                                      onChange={this.requiredChange}
                                      style={{ width: '100%' }}
                                    >
                                      {item.option &&
                                        item.option.map(_ => {
                                          return (
                                            <Option key={_.key} value={_.key}>
                                              {_.value}
                                            </Option>
                                          );
                                        })}
                                    </Select>
                                  )}
                                </Form.Item>
                              ) :item.type === 'isrequired_learn' ? (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    initialValue: 2,
                                    rules: [
                                      {
                                        type:'number',
                                        required: item.required,
                                        whitespace: true,
                                        message: `${item.label}必填项`,
                                      },
                                    ],
                                  })(
                                    <Select
                                      disabled={disabled}
                                      onChange={this.learnChange}
                                      style={{ width:'100%' }}
                                    >
                                      {item.option&&item.option.map(_ => {
                                          return (
                                            <Option key={_.key} value={_.key}>
                                              {_.value}
                                            </Option>
                                          );
                                        })}
                                    </Select>
                                  )}
                                </Form.Item>
                                ):item.type === 'unionlearn' ? (
                                  <Form.Item {...formItemLayout} label={item.label}>
                                    {getFieldDecorator(item.key, {
                                      initialValue: 1,
                                      rules: [
                                        {
                                          type:'number',
                                          required: item.required,
                                          whitespace: true,
                                          message: `${item.label}必填项`,
                                        },
                                      ],
                                    })(
                                      <Select
                                        disabled={disabled}
                                        onChange={this.learnChange}
                                        style={{ width:'100%' }}
                                      >
                                        {item.option&&item.option.map(_ => {
                                            return (
                                              <Option key={_.key} value={_.key}>
                                                {_.value}
                                              </Option>
                                            );
                                          })}
                                      </Select>
                                    )}
                                  </Form.Item>
                                  ): item.type === 'information_type' ? (
                                <Form.Item {...formItemLayout} label={item.label}>
                                  {getFieldDecorator(item.key, {
                                    initialValue: 1,
                                    rules: [
                                      {
                                        type:'number',
                                        required: item.required,
                                        whitespace: true,
                                        message: `${item.label}必填项`,
                                      },
                                    ],
                                  })(
                                    <Select
                                      placeholder="请输入关键字"
                                      disabled={disabled}
                                      onChange={this.infoTypeChange}
                                      style={{ width: '100%' }}
                                    >
                                      {item.option &&
                                        item.option.map(_ => {
                                          return (
                                            <Option key={_.key} value={_.key}>
                                              {_.value}
                                            </Option>
                                          );
                                        })}
                                    </Select>
                                  )}
                                </Form.Item>
                                 ) : item.type === 'videoInput' ? (
                                  <Form.Item {...formItemLayout} label={item.label}>
                                    {getFieldDecorator(item.key, {
                                      initialValue: '',
                                      rules: [
                                        {
                                          type:'string',
                                          required: item.required,
                                          whitespace: true,
                                          // message: `${item.label}必填项`,
                                          validator: (rule, value, callback) => checkVideo(rule, value, callback),
                                        },
                                      ],
                                    })(
                                      <Input placeholder={'格式为http://或https://样式'} disabled={disabled}/>
                                    )}
                                  </Form.Item>
                                ): item.type === 'liveTelecast_type' ? (
                                  <Form.Item {...formItemLayout} label={item.label}>
                                    {getFieldDecorator(item.key, {
                                      initialValue: liveid,
                                      rules: [
                                        {
                                          // type:'number',
                                          required: item.required,
                                          whitespace: true,
                                          // message: `${item.label}必填项`,
                                          validator: (rule, value, callback)=>{
                                            if((typeof value)=='string'||(typeof value)=='number'){
                                              callback();
                                            }else{
                                              callback();
                                            }
                                        },
                                        },
                                      ],
                                    })(
                                      <Select
                                        placeholder="请输入关键字"
                                        disabled={disabled}
                                        onChange={this.liveChange}
                                        style={{ width: '300px' }}
                                      >
                                        {item.option &&
                                          item.option.map(_ => {
                                            return (
                                              <Option key={_.key} value={_.key}>
                                                {_.value}
                                              </Option>
                                            );
                                          })}
                                      </Select>
                                    )}
                                  </Form.Item>
                             ):item.type === 'barrageShow'&&this.state.showbarrage&&liveType ? (
                              
                              <Form.Item {...formItemLayout} label="弹幕" >
                              {getFieldDecorator(item.key, {
                                initialValue: false,
                                rules: [
                                  {
                                    type: 'boolean',
                                    required: false,
                                    whitespace: true,
                                    message: '弹幕为必填项',
                                  },
                                ],
                              })(
                                <RadioGroup
                                  disabled={disabled}
                                  options={[
                                    { label: '显示', value: true },
                                    { label: '不显示', value: false },
                                  ]}
                                  onChange={e => this.onbarrageChange(e, item.key)} />
                              )}
                            </Form.Item>
                                ):item.type === 'live_type' ? (
                                <div>
                                  <Form.Item {...formItemLayout} label="直播" >
                                    {getFieldDecorator(item.key, {
                                      initialValue: true,
                                      rules: [
                                        {
                                          type: 'boolean',
                                          required: item.required,
                                          whitespace: true,
                                          message: '直播为必填项',
                                        },
                                      ],
                                    })(
                                      <RadioGroup
                                        disabled={disabled}
                                        options={[
                                          { label: '是', value: true },
                                          { label: '否', value: false },
                                        ]}
                                        onChange={this.onLiveChange} />
                                    )}
                                  </Form.Item>
                                  {liveType == true ?
                                    <React.Fragment>
                                      <Form.Item {...formItemLayout} label="频道">
                                        {getFieldDecorator('channel', {
                                          initialValue: '',
                                          rules: [
                                            {
                                              required: true,
                                              whitespace: true,
                                              max: 100,
                                              message: '频道为必填项,且最大长度不能超过100',
                                            },
                                          ],
                                        })(
                                          <Input disabled={disabled} />
                                        )}
                                      </Form.Item>

                                      <Form.Item {...formItemLayout} label="频道内容">
                                        {getFieldDecorator('channelcontent', {
                                          initialValue: '',
                                          rules: [
                                            {
                                              required: false,
                                              whitespace: true,
                                              max: 100,
                                              message: '必填项,且最大长度不能超过100',
                                            },
                                          ],
                                        })(
                                          <Input disabled={disabled} />
                                        )}
                                      </Form.Item>
                                      
                                    </React.Fragment>
                                    : null
                                  }
                                </div>
                              ) : item.type === 'relation' ? (
                                <div>
                                  <Form.Item {...formItemLayout} label="关联类型">
                                  {getFieldDecorator('relationType', {
                                    // initialValue: flowData.relationType?flowData.relationType:'1',
                                    initialValue: '1',
                                    rules: [
                                      {
                                        required: false,
                                        whitespace: true,
                                        message: '关联类型必填项',
                                      },
                                    ],
                                  })(
                                    <RadioGroup
                                      disabled={disabled}
                                      options={[
                                        { label: '文章', value: '1' },
                                        { label: '活动', value: '2' },
                                        { label: '链接', value: '3' },
                                        { label: '杂志', value: '4' },
                                      ]}
                                      onChange={this.onRelationChange}
                                    />
                                  )}
                                </Form.Item>
                                  
                                  <Form.Item {...formItemLayout} label={'相关' + `${this.getDetailByTypeId(relation).desp}` + '地址'}>
                                    {getFieldDecorator('url', {
                                      initialValue: '',
                                      rules: [
                                        {
                                          required: false,
                                          whitespace: true,
                                          // message: '必填项',
                                          validator: (rule, value, callback)=>checkAddress(rule, value, callback),
                                        
                                        },
                                      ],
                                    })(
                                      <Input className="input1" style={{width:'calc(100% - 110px)'}} readOnly={relation !== '3' ? true : false} disabled={disabled} />
                                    )}
                                    {relation !== '3' ? <Button style={{ marginLeft: '5px' }} disabled={disabled} onClick={() => 
                                    {
                                        qilter = this.getDetailByTypeId(relation).qilter;//yelu 获取初始qfilter并保存在state中
                                        this.setState({ showAddModal: relation, qfilter: qilter});
                                    }
                                    }>添加{this.getDetailByTypeId(relation).desp}</Button> : null}
                                  </Form.Item>

                                </div>

                              ): item.type === 'infoBelong' ? (
                                <div>
                                  <Form.Item {...formItemLayout} label={item.label? item.label:"资讯归属"}>
                                    {getFieldDecorator('orgType', {
                                      initialValue: 1,
                                      rules: [
                                        {
                                          type:'number',
                                          required: item.required,
                                          whitespace: true,
                                          message: '资讯归属必填项',
                                        },
                                      ],
                                    })(
                                      <RadioGroup
                                        options={infoOption}
                                        onChange={this.onBelongChange}
                                        disabled={disabled}
                                      />)
                                    }
                                  </Form.Item>
                                  <Row>
                                    <Col>
                                      <Form.Item {...formItemLayout} label={'归属选择'}>
                                        {getFieldDecorator('orgId', {
                                          rules: [
                                            {
                                              type: 'array',
                                              required: item.required,
                                              whitespace: true,
                                              message: '必填项',
                                            },
                                          ],
                                        })(
                                          <Cascader style={{width:'100%'}}
                                            className="input"
                                            options={this.state.belongsData}
                                            placeholder="请选择"
                                            disabled={disabled}
                                            onChange={this.changeCascader}
                                            changeOnSelect
                                          />
                                        )
                                        }
                                      </Form.Item> 
                                    </Col>
                                  </Row>
                                  {
                                    belongsValue === 1&&belonged!=='magazine'&&depProjectPowers?
                                    <Row>
                                    <Col>
                                      <Form.Item {...formItemLayout} label={'归属部门专题'}>
                                        {getFieldDecorator('depCategory', {
                                          rules: [
                                            {
                                              type: 'string',
                                              required: item.required,
                                              whitespace: true,
                                              message: '必填项',
                                            },
                                          ],
                                        })(
                                          <Select className="select" disabled={disabled} style={{ width:'calc(100% - 120px)' }}>
                                            {
                                              departColumn && departColumn.map(_ => {
                                                return (<Option key={_.key} value={_.key}>{_.value}</Option>);
                                              })
                                            }
                                          </Select>
                                        )
                                        }　
                                        <Button onClick={()=>this.confirm()}>部门专题</Button>
                                      </Form.Item> 
                                    </Col>
                                  </Row>:null
                                  }

                                  {
                                  //   isProject&&belongsValue==='1'?
                                  //   <Row>
                                  //   <Col>
                                  //     <Form.Item {...formItemLayout} label={'专题选择'}>
                                  //       {getFieldDecorator('projectId', {
                                  //         rules: [
                                  //           {
                                  //             type: 'array',
                                  //             required: item.required,
                                  //             whitespace: true,
                                  //             message: '必填项',
                                  //           },
                                  //         ],
                                  //       })(
                                  //         <Cascader style={{width:'100%'}}
                                  //           className="input"
                                  //           options={this.state.projectTree}
                                  //           placeholder="请选择"
                                  //           disabled={disabled}
                                  //           changeOnSelect
                                  //         />
                                  //       )
                                  //       }
                                  //     </Form.Item> 
                                  //   </Col>
                                  // </Row>:null
                                  }

                                </div>
                              )  : item.type === 'belong' ? (//资讯归属
                                <div>
                                  <Form.Item {...formItemLayout} label="资讯归属">
                                    {getFieldDecorator('belongOrgType', {
                                      initialValue: '1',
                                      rules: [
                                        {
                                          required: item.required,
                                          whitespace: true,
                                          message: '资讯归属必填项',
                                        },
                                      ],
                                    })(
                                      <RadioGroup
                                        options={[
                                          { label: '按照企业部门归属', value: '1' },
                                          { label: '按照党组织归属', value: '2' },
                                        ]}
                                        onChange={this.onBelongChange}
                                        disabled={disabled}
                                      />)
                                    }
                                  </Form.Item>
                                  <Row>
                                    <Col>
                                      <Form.Item {...formItemLayout} label={'归属选择'}>
                                        {getFieldDecorator(item.magazine ? 'orgId' : 'orgid', {
                                          rules: [
                                            {
                                              type: 'array',
                                              required: item.required,
                                              whitespace: true,
                                              message: '必填项',
                                            },
                                          ],
                                        })(
                                          <Cascader style={{width:'100%'}}
                                            className="input"
                                            options={this.state.belongsData}
                                            placeholder="请输入关键字"
                                            disabled={disabled}
                                            changeOnSelect
                                          />
                                        )
                                        }
                                      </Form.Item> 
                                    </Col>
                                  </Row>
                                </div>
                              ) :item.type==='LearnManagationAdd'?(
                                <div>
                                   <Form.Item {...formItemLayout} label="活动归属">
                                    {getFieldDecorator('orgType', {
                                      initialValue: 1,
                                      rules: [
                                        {
                                          type:'number',
                                          required: item.required,
                                          whitespace: true,
                                          message: '资讯归属必填项',
                                        },
                                      ],
                                    })(
                                      <RadioGroup
                                        options={item.option}
                                        onChange={this.onBelongChange}
                                        disabled={disabled}
                                      />)
                                    }
                                  </Form.Item>
                                  <Row>
                                    <Col>
                                      <Form.Item {...formItemLayout} label={'归属选择'}>
                                        {getFieldDecorator('orgId', {
                                          rules: [
                                            {
                                              type: 'array',
                                              required: item.required,
                                              whitespace: true,
                                              message: '必填项',
                                            },
                                          ],
                                        })(
                                          <Cascader style={{width:'100%'}}
                                            className="input"
                                            options={this.state.unions}
                                            placeholder="请选择"
                                            disabled={disabled}
                                            // onChange={this.changeCascader}
                                            changeOnSelect
                                          />
                                        )
                                        }
                                      </Form.Item> 
                                    </Col>
                                  </Row>
                                </div>
                              ) : item.type==='shoppingT'?
                                (//商家选择
                                  <div>
                                   <Form.Item {...formItemLayout} label="商家" >
                                      {getFieldDecorator(`merchants`, {
                                        initialValue: '',
                                        rules: [
                                          {
                                            required: true,
                                            whitespace: true,
                                            message: '必填项',
                                          },
                                        ],
                                      })(
                                        <Merchant 
                                        // defaultMerchant={this.props.defaultValue.merchant}
                                        {...this.props}
                                        getMerchantList={this.getMerchantList}
                                        flowData={flowData?flowData.merchants:[]}/>
                                      )}
                                    </Form.Item>
                                </div>)
                                : item.type === 'onHomePage' ? (
                                  <div>
                                    <Form.Item {...formItemLayout} label="是否上首页" >
                                      {getFieldDecorator(item.key[0], {
                                        initialValue: false,
                                        rules: [
                                          {
                                            type: 'boolean',
                                            required: false,
                                            whitespace: true,
                                            message: '必填项',
                                          },
                                        ],
                                      })(
                                        <RadioGroup
                                          disabled={disabled}
                                          options={[
                                            { label: '是', value: true },
                                            { label: '否', value: false },
                                          ]}
                                          onChange={e => {this.props.isAdd?this.props.setRequired(1):null,this.setState({ homeType: e.target.value })}
                                          }
                                        />
                                      )}
                                    </Form.Item>
                                    {
                                      homeType ?
                                        <React.Fragment>
                                          <Form.Item {...formItemLayout} label="布局形式"  >
                                            {getFieldDecorator(item.key[2], {
                                              initialValue: 1,
                                              rules: [
                                                {
                                                  type: 'number',
                                                  required: false,
                                                  whitespace: true,
                                                  message: '必填项',
                                                },
                                              ],
                                            })(
                                              <RadioGroup
                                                disabled={disabled}
                                                onChange={this.onLayoutChange}
                                                options={[
                                                  { label: '左右', value: 1 },
                                                  { label: '上下', value: 2 },
                                                  { label: '纯文本', value: 0 },
                                                ]}
                                              />
                                            )}
                                          </Form.Item>
                                          {
                                            Mlayout?
                                            <Form.Item {...formItemLayout} label="首页图片" >
                                            {getFieldDecorator('indexImage', {
                                              rules: [
                                                {
                                                  type: 'array',
                                                  required: true,
                                                  whitespace: true,
                                                  message: '必填项',
                                                },
                                              ],
                                            })
                                              (
                                              !disabled ? (//添加了一个Magazinetype类型xwx/2018/12/8
                                                <FilePicture 
                                                  keys={'indexImage'} 
                                                  type={'filePicture'} 
                                                  modal={this.props.type}  
                                                  RadioValue={this.state.RadioValue} 
                                                  disabled={disabled} 
                                                  titleimage={initialValue!=null?initialValue[item.key]:null}
                                                  datatype={'video'}
                                                  isAttach={item.isIamge?true:false}
                                                  isIamge={ true}
                                                  style = {item.style}
                                                  initialValue={this.props.initialValue ? this.props.initialValue['indexImage'] : this.props.flowData['indexImage'] ? this.props.flowData['indexImage'] : this.props.leaveData ? this.props.leaveData[this.props.belonged]['indexImage'] : ''} describe={item.describe} mode={item.label} />
                                                // <UploadPicture keys={item.key[1]} type={'uploadPicture_button'}
                                                //   Magazinetype={"MagazineManagementArticle"}
                                                //   isAttach={item.isAttach ? true : false}
                                                //   isRadio={item.isRadio ? true : false}
                                                //   isIamge={'true'}
                                                //   modal={this.props.type}
                                                //   initialValue={this.props.flowData[item.key[1]] ? this.props.flowData[item.key[1]] : this.props.initialValue ? this.props.initialValue[item.key[1]] : ''} describe={item.describe} />
                                              ) : (
                                                  <div>
                                                    <Button onClick={() => this.setState({ img_review: true, imgValue: initialValue[item.key[1]][0].response.root.object[0].filePath })}>查看</Button>
                                                    {/* <Button onClick={() => this.setState({ img_review: true, imgValue: initialValue[item.key[1]]})}>查看</Button> */}
                                                  </div>
                                                )
                                              )}
                                          </Form.Item>:null
                                          }
                                          
                                          
                                        </React.Fragment> : null
                                    }

                                  </div>) : item.type === 'isTimePublish' ?
                                                      <Row>
                                                        <div>
                                                          <Form.Item style={{ width: '100%' }} {...formItemLayout} label="是否定时发送">
                                                            {getFieldDecorator(item.key ? item.key : isTimePublish, {
                                                              initialValue: false,
                                                              rules: [
                                                                {
                                                                  type: 'boolean',
                                                                  required: item.required,
                                                                  whitespace: true,
                                                                  message: '必填项',
                                                                },
                                                              ],
                                                            })(
                                                              <RadioGroup
                                                                disabled={disabled}
                                                                options={[
                                                                  { label: '是', value: true },
                                                                  { label: '否', value: false },
                                                                ]}
                                                                onChange={e => {
                                                                  if (e.target.value) {
                                                                    this.setState({ pushModal: true });
                                                                  } else {
                                                                    this.props.setTimePushData('');
                                                                    this.setState({ timePushValue: '' });
                                                                  }
                                                                }}
                                                              />
                                                            )}
                                                            {this.props.style === 'detail' ? <span>{this.state.timePushValue}</span> : <span onClick={() => this.setState({ pushModal: true })}>{this.state.timePushValue}</span>

                                                            }

                                                          </Form.Item>
                                                        </div>
                                                      </Row>
                                                      : item.type === 'isTimePublish' ?
                                                        <Row>
                                                          <div>
                                                            <Form.Item style={{ width: '100%' }} {...formItemLayout} label="是否定时发送">
                                                              {getFieldDecorator('isTimePublish', {
                                                                initialValue: false,
                                                                rules: [
                                                                  {
                                                                    type: 'boolean',
                                                                    required: item.required,
                                                                    whitespace: true,
                                                                    message: '必填项',
                                                                  },
                                                                ],
                                                              })(
                                                                <RadioGroup
                                                                  disabled={disabled}
                                                                  options={[
                                                                    { label: '是', value: true },
                                                                    { label: '否', value: false },
                                                                  ]}
                                                                  onChange={e => {
                                                                    if (e.target.value) {
                                                                      this.setState({ pushModal: true });
                                                                    } else {
                                                                      this.props.setTimePushData('');
                                                                      this.setState({ timePushValue: '' });
                                                                    }
                                                                  }}
                                                                />
                                                              )}<span onClick={() => this.setState({ pushModal: true })}>{this.state.timePushValue}</span>
                                                            </Form.Item>

                                                          </div>
                                                        </Row> :
                                                        item.type === 'video' ?

                                                          <Row>
                                                            <Col >
                                                              <Form.Item {...formItemLayout} label={item.label}>
                                                                {getFieldDecorator('url', {
                                                                  rules: [
                                                                    {
                                                                      required: item.required,
                                                                      whitespace: item.required,
                                                                      max: item.max,
                                                                      message: `视频地址为必填项`,

                                                                    },
                                                                  ],
                                                                })(
                                                                  <Input
                                                                    className="input1"
                                                                    placeholder="请输入视频地址"
                                                                    disabled={disabled}
                                                                  />
                                                                )}
                                                              </Form.Item>
                                                            </Col>
                                                            <Col >
                                                              <Form.Item {...formItemLayout} label={'视频时长(s)'}>
                                                                {getFieldDecorator('videoLong', {
                                                                })(
                                                                  <InputNumber
                                                                    className="input1"
                                                                    placeholder="请输入视频时长"
                                                                    disabled={disabled}
                                                                    min={0}
                                                                  />
                                                                )}
                                                              </Form.Item>
                                                            </Col>
                                                            <Col >
                                                              <Form.Item {...formItemLayout} label={'描述'}>
                                                                {getFieldDecorator('desp', {
                                                                })(
                                                                  <Input
                                                                    className="input1"
                                                                    placeholder="请输入视频描述"
                                                                    disabled={disabled}
                                                                  />
                                                                )}
                                                              </Form.Item>
                                                            </Col>
                                                            <Col style={{ display: disappear ? 'none' : 'block' }}>
                                                              <Form.Item {...formItemLayout} label={'视频'}>
                                                                <a href={this.props.form.getFieldValue('url')}
                                                                  target="_blank">查看</a>
                                                              </Form.Item>

                                                            </Col>
                                                          </Row>:
                                                          item.type === 'videoLearn' ?
  
                                                            <Row>
                                                              <Col >
                                                                <Form.Item {...formItemLayout} label={'视频地址'}>
                                                                  {getFieldDecorator('url', {
                                                                    rules: [
                                                                      {
                                                                        required: item.required,
                                                                        whitespace: item.required,
                                                                        max: item.max,
                                                                        message: `视频地址为必填项`,
  
                                                                      },
                                                                    ],
                                                                  })(
                                                                    <Input
                                                                      className="input1"
                                                                      placeholder="请输入视频地址"
                                                                      disabled={disabled}
                                                                    />
                                                                  )}
                                                                </Form.Item>
                                                              </Col>
                                                              <Col >
                                                                <Form.Item {...formItemLayout} label={'视频时长'}>
                                                                  {getFieldDecorator('videoLong', {
                                                                  })(
                                                                    <InputNumber
                                                                      className="input1"
                                                                      placeholder="请输入视频时长"
                                                                      disabled={disabled}
                                                                      min={0}
                                                                    />
                                                                  )}
                                                                </Form.Item>
                                                              </Col>
                                                              <Col >
                                                                <Form.Item {...formItemLayout} label={'视频描述'}>
                                                                  {getFieldDecorator('desp', {
                                                                  })(
                                                                    <Input
                                                                      className="input1"
                                                                      placeholder="请输入视频描述"
                                                                      disabled={disabled}
                                                                    />
                                                                  )}
                                                                </Form.Item>
                                                              </Col>
                                                            </Row>:null}
        </React.Fragment>
      );
    });
    return <div>{content}
      <Modal
        className="img-review-modal"
        visible={this.state.img_review}
        onCancel={() => this.setState({ img_review: false })}
        footer={null}
        destroyOnClose
      >
      {API_CHOOSE_SERVICE==1?<div className='imgsize'><img src={ossViewPath + this.state.imgValue} /></div>:
      <div className='imgsize'><img src={API_FILE_VIEW_INNER + this.state.imgValue}  /></div>
      }
      {/* {this.state.imgValue?API_CHOOSE_SERVICE==1?<div>
                      <img src={ossViewPath + this.state.imgValue[0].response.root.object[0].filePath} style={{ width: '520px', height: '300px' }} />
                      <img src={ossViewPath + this.state.imgValue[1].response.root.object[0].filePath} style={{ width: '520px', height: '300px' }} />
                      <img src={ossViewPath + this.state.imgValue[2].response.root.object[0].filePath} style={{ width: '520px', height: '300px' }} />
                    </div>:
                    <div>
                      <img src={API_FILE_VIEW_INNER + this.state.imgValue[0].response.root.object[0].filePath} style={{ width: '520px', height: '300px' }} />
                      <img src={API_FILE_VIEW_INNER + this.state.imgValue[1].response.root.object[0].filePath} style={{ width: '520px', height: '300px' }} />
                      <img src={API_FILE_VIEW_INNER + this.state.imgValue[2].response.root.object[0].filePath} style={{ width: '520px', height: '300px' }} />
                    </div>:null
      } */}
      </Modal>
      <Modal
        className="img-review-modal"
        visible={this.state.isRadio}
        onCancel={() => this.setState({ isRadio: false })}
        footer={null}
        destroyOnClose
      >
        <video id="my-player" className="video-js" controls preload="auto" poster="" data-setup="{}">
          <source src={this.state.imgValue} type="video/mp4" />
        </video>
      </Modal>
      <Modal

        className="img-review-modal"
        visible={this.state.isAttach}
        onCancel={() => this.setState({ isAttach: false })}
        footer={null}
        destroyOnClose
      >
       
          {
            typeof(this.state.imgValue[0])!='string'?
            this.state.imgValue&&this.state.imgValue.map((item,index)=>{
              return <div key={index}>
                <a className="attach" href={ossViewPath+item.response.root.object[0].filePath} download={ossViewPath+item.response.root.object[0].fileName}>{item.response.root.object[0].fileName}</a>
              </div>;
            }):<a className="attach" href={ossViewPath+this.state.imgValue} download={ossViewPath+this.state.fileName}>{this.state.fileName}</a>
          
          }
       
        
        {/* <a className="attach" href={ossViewPath+this.state.imgValue} download={ossViewPath+this.state.fileName}>{this.state.fileName}</a> */}
       

      </Modal>
      <Modal width='50%'
        title={`添加${this.getDetailByTypeId(relation).desp}`}
        visible={this.state.showAddModal !== '0' ? true : false}
        footer={
          <React.Fragment>
            <Button onClick={this.handleAddModalOK}
              disabled={!(this.props.selectRowsData && this.props.selectRowsData.length > 0)}>添加</Button>
            <Button onClick={() => this.setState({ showAddModal: '0' })
            }>取消</Button>
          </React.Fragment>}
        onCancel={() => this.setState({ showAddModal: '0' })
        }
        destroyOnClose={true}
      >
        <FormAndInput
          columns={relation === '4' ? 
          /**
           * 朱劲松 事项提醒 -- 选择杂志 -- 杂志参数不对
           */
          this.props.RemindType === 'remind'? [
            {
              title: '所属系列',
              dataIndex: 'seriesId',
              key: 'seriesId',
            },
            {
              title: '期刊名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '期数',
              dataIndex: 'periods',
              key: 'periods',
            },
            // {
            //   title: '标题',
            //   dataIndex: 'title',
            //   key: 'title',
            // },
          ]:[
            {
              title: '所属系列',
              dataIndex: 'seriesId',
              key: 'seriesId',
            },
            {
              title: '期刊名称',
              dataIndex: 'name',
              key: 'name',
            },
            {
              title: '期数',
              dataIndex: 'periods',
              key: 'periods',
            },
            // {
            //   title: '标题',
            //   dataIndex: 'title',
            //   key: 'title',
            // },
          ] : [
              {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
              },
              {
                title: '标题',
                dataIndex: relation === '1' ? 'title' : 'activityName',
                key: relation === '1' ? 'title' : 'activityName',
              },
              {
                title: '创建时间',
                dataIndex: relation === '2' ? 'createDate' : 'createDate',
                key: relation === '2' ? 'createDate' : 'createDate',
              },
            ]}
          url={url}
        //   qfilter={qilter}
          qfilter={this.state.qfilter}
          onSearch={e => this.handleInput(e, url, typeCode, qilter)}
        />
      </Modal>
      <Modal
        title="定时发布"
        visible={this.state.pushModal}
        footer={null}
        onCancel={this.timePushCancel}
        destroyOnClose={true}>
        <label style={{ marginRight: '10px' }}>定时发布时间</label>
        <DatePicker format="YYYY-MM-DD HH:mm:ss"
          disabledDate={disabledDate}
          //disabledTime={disabledDateTime}
          onChange={
              (moment, str) => {
                  this.setState({ timePushValue: str });
                  this.props.setTimePushData(str); // yelu 添加，时间改变后缓存没存值，不点确定，直接点击保存提示选择时间bug
                }
            }
          showTime />
        <Button className="resetBtn" onClick={this.timePushCancel}>取消</Button>
        <Button className="queryBtn" onClick={this.timePush}>确定</Button>
      </Modal>
      <Modal
        width={1000}
        title="选择考试"
        visible={this.state.testModal}
        maskClosable={false}
        destroyOnClose={true}
        onOk={this.testOk}
        onCancel={this.testCancel}
      >
        {/* <TableSearch
          columns={[
            {
              title: '序号',
              key: 'sNum',
              dataIndex: 'sNum',
            },
            {
              title: '考试活动名称',
              dataIndex: 'name',
              key: 'categoryName',
            },
            {
              title: '活动开始时间',
              dataIndex: 'beginTime',
              key: 'beginTime',
            },
            {
              title: '活动结束时间',
              dataIndex: 'endTime',
              key: 'endTime',
            },
          ]}
          url={'services/activity/examActivity/list'}
          qfilter={this.state.qfilter ? this.state.qfilter : 'Q=typeid_S_EQ=6&Q=status_I_EQ=1&Q=relation_Z_EQ=false'}
          // qfilter={this.state.qfilter}
          onSearch={e => this.searchInput(e)}
        /> */}
        {/* 上面TableSearch公共组件有问题，现修改为FormAndInput组件xwx2019/2/26 */}
        <FormAndInput
          columns={[
            {
              title: '序号',
              key: 'sNum',
              dataIndex: 'sNum',
            },
            {
              title: '考试活动名称',
              dataIndex: 'activityName',
              key: 'activityName',
            },
            {
              title: '活动开始时间',
              dataIndex: 'beginTime',
              key: 'beginTime',
            },
            {
              title: '活动结束时间',
              dataIndex: 'endTime',
              key: 'endTime',
            },
          ]}
          url={'services/web/party/partyStudy/getActivityWithoutRel'}
          qfilter={this.state.qfilter ? this.state.qfilter : `Q=typeId=2&Q=status=1&Q=tenantId=${window.sessionStorage.getItem("tenantId")}`}
          onSearch={e => this.searchInput(e)}
        />
      </Modal>
    </div>;
  }
}