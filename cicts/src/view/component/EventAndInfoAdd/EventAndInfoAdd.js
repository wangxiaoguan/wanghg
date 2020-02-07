import React, { Component } from 'react';
import { Row, Form, Steps, Button, Tabs, Message, Modal, Col, Spin, Radio } from 'antd';
import { getService, postService, GetQueryString } from '../../content/myFetch';
import { setEventData, setLeaveData, setIsSubmit, setEventTwoData } from '../../../redux-root/action/eventAndInfoData/eventAndInfoData';
import { setTimePushData } from '../../../redux-root/action/eventAndInfoData/timePushData';
import API_PREFIX, { masterUrl, API_CHOOSE_SERVICE } from '../../content/apiprefix';
import MultipleTree from './MultipleTree';
import CompanyTree from './CompanyTree';
import InfoTree from './InfoTree';
import FormWrapper from './FormWrapper.js';
import { Prompt } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { cloneObj } from '../tools';
import moment from 'moment';
import './addStyle.less';

const Step = Steps.Step;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;//xwx2018/12/11
let alldata = '';
@Form.create()
@connect(
  state => ({
    AllTreeData: state.tree.treeCheckData,
    selectTreeData: state.tree.treeSelectData.column,
    uploadData: state.uploadPicture.uploadPictureData,
    editorData: state.editor.editorData,
    flowData: state.flowData.flowData,
    eventData: state.flowData.eventData,
    timePushData: state.flowData.timePushData,
    leaveModal: state.modal.leaveModal,
    leaveData: state.flowData.leaveData,
    isSubmit: state.flowData.isSubmit,
    getMerchantData: state.attach.MerchantData,//获取添加用户的数据
    authInfo: state.authInfo,
  }),
  dispatch => ({
    setEventData: n => dispatch(setEventData(n)),
    setEventTwoData: n => dispatch(setEventTwoData(n)),
    setTimePushData: n => dispatch(setTimePushData(n)),
    setLeaveData: n => dispatch(setLeaveData(n)),
    setIsSubmit: n => dispatch(setIsSubmit(n)),
  })
)
export default class EventAdd extends Component {
  constructor(props) {
    super(props);
    let arr = [];
    if (this.props.edit == 'shopTimeEdit' && this.props.steps[0].data&&this.props.steps[0].data.merchants) {
      this.props.steps[0].data.merchants.forEach(item => {
        arr.push(parseInt(item.id));
      });
    }
    let valueJoin = '1';
    let valueView = '1';
    if (this.props.type === 'event' && this.props.steps[0].data && (this.props.style === 'edit' || this.props.style === 'detail')) {
      let stepsEdit = cloneObj(this.props.steps);
      if (stepsEdit && stepsEdit[1].data && JSON.stringify(stepsEdit[1].data) != "{}") {
        let data = stepsEdit[1].data;
        console.log("data5555", data);
        if (data.partysJoin&&data.partysJoin.length > 0 ||data.departmentsJoin&&data.departmentsJoin.length > 0 || data.groupsJoin&&data.groupsJoin.length > 0 || data.unionsJoin&&data.unionsJoin.length > 0) {
          valueJoin = '2';
        }
        if (data.partys&&data.partys.length > 0 || data.departments&&data.departments.length > 0 || data.groups&&data.groups.length > 0 || data.unions&&data.unions.length > 0) {
          valueView = '2';
        }
      }
    }

    // debugger
    let currentKey = parseInt(GetQueryString(location.hash, ['step']).step);
    if (sessionStorage.getItem('eventAndInfoKey')) { //yelu 获取从部门、党组织、虚礼群组管理页面返回过来时保存的权限设置tab对应的key值
      currentKey = sessionStorage.getItem('eventAndInfoKey');
    }
    this.state = {
      //   current: parseInt(GetQueryString(location.hash, ['step']).step) || 0,
      current: currentKey || 0,
      treeData: [],
      checkData: {},
      id: this.props.id, //编辑时的唯一标识
      shoppingId: [],
      name: '',
      titleImage: '',
      categoryId: '',
      showPrompt: true,
      dpRootId: this.props.dpRootId,
      partyRootId: this.props.partyRootId,
      updateFormWrapper: 0,
      addid: '',
      merchantList: arr, //订购活动里面编辑、项目里面的商家数据
      // isExamination:false,//是否是考试活动
      numberOne: '1',
      loading: false,
      picUrl: [],
      daleteFlag: false,
      picUrltwo: [],
      editFlag: false,
      isSave: false, //yelu 记录用户是否已经保存过页面数据
      categoryIdList: [],
      categoryRelevances: [],
      Data: {},
      isAuthSuccess: false,
      valueJoin: valueJoin,
      valueView: valueView,
      valueCompanyJoin: "1",
      valueCompanyView: "1",
      valueOne: 1,
      valueTwo: 0,
      infoId: '',
      eventUpdataId: "",
      orgName: '',
      companyIdsData: [],
      infoType: 1,
      upperLimit: "",
      arrJoin: [],
      pickupAddressList: [],//订购活动取货地点数据
    };
  }

  //所有模块的编辑数据回旋 2018/12/17
  componentDidMount() {

    getService(API_PREFIX + `services/web/system/tree/getSubCompaniesByParentIds`, data => {
      if (data.status === 1) {
        let arr = [];
        data.root.object.map((item, index) => {
          arr.push(item.id);
        });
        this.setState({ arrJoin: [] }, () => {
          this.setState({ arrJoin: arr })
        })
      }
    });
    alldata = '';
    let datatype = this.props.datatype;
    if (this.props.style == 'edit' && (datatype == 'article' || datatype == 'magazine' || datatype == 'special' || datatype == 'applyedit' || datatype == 'examination' || datatype == 'orderList' || datatype == 'votelist' || datatype == "questionnaire")) {
      console.log(this.props.getUrl);
      // debugger;
      getService(API_PREFIX + this.props.getUrl, data => {
        if (data.status == 1) {
          alldata = data.root.object ? data.root.object : Array.isArray(data.root.list) ? data.root.list[0] : data.root.list;
          if (alldata && alldata.name) {
            alldata['title1'] = alldata.name;
          }
          if (alldata && alldata.orgName) {
            this.setState({ orgName: alldata.orgName });
          }
        }
      });
    }
    if ((datatype == 'article' || datatype == 'video' || datatype == "magazine") && (this.props.style == 'edit' || this.props.style == 'detail')) {
      this.setTreeParams();
      this.setState({ infoType: this.props.newsType || 1 });
    }
    if (this.props.style == 'edit' && this.props.type == 'information') {
      this.setId();
    }
    if (this.props.style == 'edit' && this.props.type == 'event') {
      this.getEventId();
    }

    /////这是下级企业的
    let valueCompanyJoin = '1';
    let valueCompanyView = '1';
    if (this.props.type === 'event' && this.props.steps[0].data && (this.props.style === 'edit' || this.props.style === 'detail')) {
      getService(API_PREFIX + `services/web/system/tree/getSubCompaniesByParentIds`, data => {
        if (data.status === 1) {
          console.log("organizationDataorganizationData", data.root.object);
          let arr = [];
          data.root.object.map((item, index) => {
            arr.push(item.id);
          });

          let tenantId = window.sessionStorage.getItem("tenantId");
          console.log("arr", arr, this.state);
          let stepsEdit = cloneObj(this.props.steps);
          if (stepsEdit && stepsEdit[1].data && JSON.stringify(stepsEdit[1].data) != "{}") {
            let data = stepsEdit[1].data;
            console.log("data", data, arr);
            if (data.companyJoinList&&data.companyJoinList.indexOf(tenantId) > -1) {
              valueCompanyJoin = '2';
            } else if (data.companyJoinList&&0 <data.companyJoinList.length &&data.companyJoinList.indexOf(tenantId) == -1) {
              valueCompanyJoin = '3';
            } else if (data.companyJoinList&&data.companyJoinList.length == 0) {
              valueCompanyJoin = '1';
            }
            if (data.companyList&&data.companyList.indexOf(tenantId) > -1) {
              valueCompanyView = '2';
            } else if (data.companyList&&0 < data.companyList.length && data.companyList.indexOf(tenantId) == -1) {
              valueCompanyView = '3';
            } else if (data.companyList&&data.companyList.length == 0) {
              valueCompanyView = '1';
            }
             this.setState({
              valueCompanyView, valueCompanyJoin, companyIdsData: arr,
            });

          }
        } else {
          //Message.error(data.retMsg);
          // this.setState({ loading: false });
        }
      });

    }

  }



  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.AllTreeData !== prevState.AllTreeData) {
      let checkData = { ...prevState.checkData };
      checkData = { ...checkData, ...nextProps.AllTreeData };
      return { checkData, AllTreeData: nextProps.AllTreeData };
    }
    // console.log("qqq",nextProps.flowData);
    if (nextProps.flowData !== prevState.flowData) {
      return { flowData: nextProps.flowData };
    }
    return null;
  }
  setInfoType = (e) => {
    this.setState({ infoType: e });
  }
  setTreeParams = () => {
    this.setState({ valueOne: this.props.valueOne || 1, valueTwo: this.props.valueTwo || 0 });
  }
  setId = () => {
    let id = window.location.hash.split('=')[1];
    this.setState({ infoId: id });

  }

  //  //处理下级企业的id的数据
  //  dealDepartmentData=(data) =>{
  //   data.map((item, index) => {
  //      arr.push(item.id)
  //     item.children = item.subCompanyList;
  //     if (item.subCompanyList) {//不为空，递归
  //       this.dealDepartmentData(item.subCompanyList);
  //     }
  //   });
  //   console.log("arr",arr)
  //   this.setState({
  //     companyIdsData:arr
  //   })
  // }
  getEventId = () => {
    let id = GetQueryString(location.hash, ['id']).id || '';
    this.setState({ eventUpdataId: id });
  };

  next = (values, id) => {
    this.setState({ addid: id });
    this.props.setEventData(values); //保存上一页内容
    const current = this.state.current + 1;
    if (location.hash.indexOf('?step') > -1) {
      location.hash = location.hash.replace(/\?step=[0-2]/, `?step=${current}`);
    } else {
      location.hash += `?step=${current}&id=${id}`;
    }
    this.setState({ current, showPrompt: false });

  };
  prev = (str) => {
    /**
     * 朱劲松   2018-12-10 新增
     * 修改 ‘党建园地-党建学习管理-新建党建学习，将页面*上一步*功能取消，新增取消按钮’  BUG 2099
     * 新增了一个参数 str
     */
    if (str === 'back' && this.props.datatype === 'partylearn') {
      location.hash = '/PartyBuildGarden/PartyLearning';
      return;
    } else if (str === 'back' && this.props.datatype === 'LearnManagation') {
      location.hash = '/TradeManager/LearnManagation/List';
      return;
    }

    const current = this.state.current - 1;
    this.setState({ current, showPrompt: false }, () => {
      if (location.hash.indexOf('?step') > -1) {
        location.hash = location.hash.replace(/\?step=[0-2]/, `?step=${current}`);
      } else {
        location.hash += `?step=${current}`;
      }
    });

  };
  arrayToString = array => {
    let str = '';
    array &&
      array.map((item, index) => {
        if (index === 0) {
          str = item;
        } else {
          str = str + ';' + item;
        }
      });
    return str;
  };


  onChangeJoin = (e) => {
    this.setState({
      valueJoin: e.target.value,
    });
  }
  onChangeCompanyJoin = (e) => {
    this.setState({
      valueCompanyJoin: e.target.value,
    });
  }
  onChangeCompanyView = (e) => {
    this.setState({
      valueCompanyView: e.target.value,
    });
  }

  onChangeView = (e) => {
    this.setState({
      valueView: e.target.value,
    });
  }
  getShoppingId = num => {
    this.setState({
      shoppingId: num,
    });
  };
  dealFiles = files => {
    let data = [];
    files && files.map((item, index) => {
      if (item.type === 4) {
        data.push({ response: { root: { object: [{ filePath: item.url, fileName: item.name }] } }, describe: item.desp, id: item.id });
      } else if (item.type === 1 || item.type === 3) {
        data.push({ size: item.size, type: item.type, response: { root: { object: [{ filePath: item.url, fileName: item.name }] } }, describe: item.desp, id: item.id });
      } else if (item.type === 2) {
        data.push({ size: item.size, type: item.type, response: { root: { object: [{ filePath: item.url, fileName: item.name }] } }, describe: item.desp, id: item.id });
      }
    });
    return data;
  }
  dealGetData = data => {
    if (data.categoryId == "108") {
      data.categoryId = "";
    }
    let newTreePath = [];
    let newPath = [];
    let pic = [];
    let file = [];
    let video = [];
    let videoNew = {
      videoUrl: '',
      videoDesp: '',
      videoTime: 0,

    };
    let temp = data['newsAttachList'] && data['newsAttachList'].length;

    temp && temp.map((item, index) => {
      if (item.type == '1') {
        //图片

        pic.push({ response: { root: { object: [{ filePath: item.url, fileName: item.name }] } }, describe: item.description, id: item.id });
      } else if (item.type == '3') {

        file.push({ size: item.size, type: item.type, response: { root: { object: [{ filePath: item.url, fileName: item.name }] } }, describe: item.description, id: item.id });
      }
      // else if(item.type == '2'){
      //   video.push({ response: { entity: [{ filePath: item.url, fileName: item.name }] }, describe: item.description, id: item.id });
      //
      // }
      else if (item.type == '2') {
        videoNew.videoUrl = item.url;
        videoNew.videoDesp = item.description;
        videoNew.videoTime = item.timelong;
      }
    });
    // if (this.props.style == 'edit' || this.props.style == 'detail') {
    //   data['categoryIdList'] =
    //     data['categoryUnionId'] && data['categoryUnionId'].split(',');
    // } else {
    //   data['categoryIdList'] &&
    //     data['categoryIdList'].map((item, index) => {
    //       item = item + '';
    //     });
    // }

    //  debugger;
    if (data['orgTreePath'] && (this.props.partyRootId || this.props.dpRootId)) {
      newTreePath = data['orgTreePath'].split(',');

      // newPath=data['treepath'].split(',').splice(newTreePath.indexOf(this.props.dpRootId));
      if (data['belongOrgType'] == '2') {
        let temp = newTreePath.indexOf(this.props.partyRootId);
        if (temp > 0) {
          newTreePath.splice(0, temp - 1);
        }
      } else {
        let temp = newTreePath.indexOf(this.props.dpRootId);
        if (temp > 0) {
          newTreePath.splice(0, temp - 1);
        }
      }
      //data['treepath']=newTreePath;  
    }

    // console.log("this.props=======>",this.props,data);
    if (this.props.belonged === "video" && data['treepath']) {
      newTreePath = data['treepath'].split(',');
    }
    if (this.props.belonged === "article" && data['orgId']) {
      newTreePath = data['orgId'].split(',');
    }
    if (this.props.belonged === "video" && data['orgId']) {
      newTreePath = data['orgId'].split(',');
    }
    if (this.props.belonged === "magazine" && data['orgId']) {
      newTreePath = data['orgId'].split(',');
    }
    if (this.props.type === "event" && data['orgTreePath']) {
      newTreePath = data['orgTreePath'].split(',');
    }
    let titleimage;
    if (API_CHOOSE_SERVICE == 1) {
      titleimage = data['titleimage'] && data['titleimage'].split(';');
    } else {
      titleimage = data['titleimage'] &&
        data['titleimage'].replace(/(\w+),(\w+),/g, '$1,$2;').split(';');
    }
    const props = this.props;
    let result = {
      ...data,
      videoUrl: videoNew.videoUrl,
      videoDesp: videoNew.videoDesp,
      videoTime: videoNew.videoTime,
      picUrl: pic,
      contentImage: data['contentImage'] && this.dealFiles(data['contentImage']),
      fileUrl: file,
      newsAttachs: data['newsAttachs'] && this.dealFiles(data['newsAttachs']),
      orgId: newTreePath,
      orgid: newTreePath,
      createOrgId: newTreePath,
      organizationId: newTreePath,
      applyBegin: data['applyBegin'] && moment(data['applyBegin']),
      applyEnd: data['applyEnd'] && moment(data['applyEnd']),
      beginTime: data['beginTime'] && moment(data['beginTime']),
      endTime: data['endTime'] && moment(data['endTime']),
      title1: data['name'],
      nameM: data['name'],
      titleImage: data['titleImage'] && data['titleImage'].replace(/(\w+),(\w+),/g, '$1,$2;').split(','),
      titleimage: titleimage,
      categoryId: data['categoryId'] && data['categoryId'].split(','),
      coverimage: data['coverimage'] && data['coverimage'].replace(/(\w+),(\w+),/g, '$1,$2;').split(';'),
      coverImage: data['coverImage'] && data['coverImage'].replace(/(\w+),(\w+),/g, '$1,$2;').split(';'),
      department: data['department'] && data['department'].length && data['department'].split(','),
      partyid_join: data['partys'] || [],
      groups: data['groups'] && data['groups'].length && data['groups'] || [],
      department_join: data['department'] && data['department'].length && data['department'].split(','),
      department_view: data['depView'] && data['depView'].split(','),
      partyid_view: data['partyView'] && data['partyView'].split(','),
      virtualgroupid_join: data['groups'] && data['groups'].length && data['groups'] || [],
      virtualgroupid_view: data['groupView'] && data['groupView'].split(','),
      treasureProvider: data['treasureProviderTreepath'] && data['treasureProviderTreepath'].split(','),
      categoryIdList: this.props.belonged === 'video' || this.props.belonged === 'article' ? data['categoryIdList'] : data['categoryIds'] && data['categoryIds'].split(','),
    };

    if (this.props.type === 'event') {
      result['department_join'] = data['departmentsJoin'];
      result['department_view'] = data['departments'];
      result['virtualgroupid_join'] = data['groupsJoin'];
      result['virtualgroupid_view'] = data['groups'];
      result['company_join'] = data['companyJoinList'];
      result['company_view'] = data['companyList'];
      result['union_join'] = data['unionsJoin'];
      result['union_view'] = data['unions'];
      // result['union_join']= data['unionsJoin'];
      // result['union_view']= data['unions'];
    }
    if (this.props.type === 'event') {
      result['partyid_join'] = data['party'] && data['party'].split(',');
    }
    this.state.name = data['name'] && data['name'];
    this.state.titleImage = data['titleImage'] && data['titleImage'];
    this.state.categoryId = data['categoryId'] && data['categoryId'];
    this.state.Data = result;
    return result;
  };
  dealInfoData = data => {
    let result = {
      id: data['id'],
      union_join: data['unions'],
      department_join: data['departments'],
      virtualgroupid_join: data['groups'],
      company_join: data['companyList'],
      partyid_join: data['partys'] || [],
    };
    return result;
  }

  handleSubmit = (e, type, linkTo, save, online, leave, typeB, tabCurrent, tabChange, currentValue) => { // yelu 添加tabCurrent, tabChange, currentValue三个参数，用于直接点击tab切换提示是否保存更改数据

    let isEditid = GetQueryString(location.hash, ['isEditid']).isEditid || '';
    this.setState({ isSave: true });
    setTimeout(() => {
      let current = null;
      if (tabChange == 'tabChange') { //yelu tab切换保存数据是的当前页current
        current = tabCurrent;
      } else {
        current = this.state.current;
      }
      let props = this.props;
      let state = this.state;
      console.log(props);
      console.log(state);

      const { steps } = this.props;
      let url = steps[current].url; //url
      let fieldKeys = [];
      let tempContent = cloneObj(steps);
      tempContent[1].content = [
        { key: 'isFamilyJoin' },
        { key: 'actminCredits' },
        { key: 'actminTreasure' },
        { key: 'upperLimit' },
      ];
      tempContent[current].content && tempContent[current].content.map(
        item => {
          fieldKeys.push(item.key);
        }
      );
      let ts = window.sessionStorage.getItem('taskId') || '';
      let updateUrl = steps[current].updateUrl;
      let typeId = steps[current].typeId;
      let taskId = steps[current].data && steps[current].data['taskId'] ? steps[current].data['taskId'] : ts;
      // e && e.preventDefault();
      e && e.persist();

      this.props.form.validateFields(fieldKeys, (err, fieldsValue2) => {
        if (fieldsValue2['picUrl'] && fieldsValue2['picUrl'] <= 0) {
          if (this.state.daleteFlag && this.state.picUrl.length > 0) {
            fieldsValue2['picUrl'] = this.state.picUrl;
          }
        }
        if (fieldsValue2['picUrl'] && this.state.editFlag) {
          fieldsValue2['picUrl'] = this.state.picUrltwo;
        }
        if (this.props.datatype == 'examination') {
          fieldsValue2['name'] = fieldsValue2.title1;
        }
        if (this.props.datatype == 'article' && fieldsValue2.layout != 3 && fieldsValue2.titleimage) {
          if ((fieldsValue2.titleimage[0] && fieldsValue2.titleimage[0].indexOf(';') != -1) || fieldsValue2.titleimage.length > 1) {
            Message.error('布局形式为上下和左右时，标题图片只能为一张');
            return;
          }

        }
        if (fieldsValue2.isTimePublish && !this.props.timePushData) {
          Message.error('请选择定时发布时间');
          return;
        }
        let newstr = '';
        if (fieldsValue2.content && fieldsValue2.content.indexOf('border="0"') != -1) {
          let reg = new RegExp('border="0"', "g");
          let stringObj = fieldsValue2.content;
          newstr = stringObj.replace(reg, "border='1'");

        }
        let fieldsValue = fieldsValue2.content && fieldsValue2.content.indexOf('border="0"') != -1 ? { ...fieldsValue2, content: newstr } : { ...fieldsValue2 };
        if (!err) {
          let values = {};
          if (current == 0) {
            console.log(fieldsValue);

            if (this.props.type == "event" && (fieldsValue.dayCount === null || fieldsValue.dayCount === "")) {
              delete fieldsValue.dayCount;
              console.log("fieldsValue====", fieldsValue);
            }


            //文章管理——新建——内容图片与上传附件处理
            let contentImage = [], newsAttachs = [];
            if (props.belonged === 'article' && props.style === 'add') {
              if (fieldsValue.layout === 3) {
                let isThree = fieldsValue['titleImage'][0].split(';').length === 3 ? true : false;
                if (!isThree) {
                  Message.warning('标题图片必须为三张');
                  return;
                }
              }
              fieldsValue['contentImage'] && fieldsValue['contentImage'].length && fieldsValue['contentImage'].map(item => {
                if (Array.isArray(item)) {
                  contentImage.push({ desp: item[0].describe, name: item[0].response.root.object[0].fileName, url: item[0].response.root.object[0].filePath, size: item[0].size, type: 1 });
                } else {
                  if (item.url) {
                    contentImage.push(item);
                  } else {
                    contentImage.push({ desp: item.describe, name: item.response.root.object[0].fileName, url: item.response.root.object[0].filePath, size: item.size, type: 1 });
                  }
                }
              });
              fieldsValue['newsAttachs'] && fieldsValue['newsAttachs'].length && fieldsValue['newsAttachs'].map(item => {
                if (Array.isArray(item)) {
                  newsAttachs.push({ name: item[0].response.root.object[0].fileName, url: item[0].response.root.object[0].filePath, size: item[0].size, type: 3 });
                } else {
                  if (item.url) {
                    newsAttachs.push(item);
                  } else {
                    newsAttachs.push({ name: item.response.root.object[0].fileName, url: item.response.root.object[0].filePath, size: item.size, type: 3 });
                  }
                }
              });
              fieldsValue['contentImage'] = contentImage;
              fieldsValue['newsAttachs'] = newsAttachs;
              fieldsValue['orgName'] = state.orgName;
            }
            //文章管理——编辑——内容图片与上传附件处理
            if (props.belonged === 'article' && props.style === 'edit') {
              if (fieldsValue.layout === 3) {

                let isThree =fieldsValue['titleImage'].length === 3 ? true : fieldsValue['titleImage'][0].split(';').length === 3 ? true : false;
                if (!isThree) {
                  Message.warning('标题图片必须为三张');
                  return;
                }
                let ossViewPath = sessionStorage.getItem('ossViewPath')
                if(fieldsValue['titleImage'].length===3){
                  fieldsValue['titleImage'].map(item=>{
                    item.replace(new RegExp(ossViewPath,'ig'),'')
                  })
                }else{
                  let dealImage = fieldsValue['titleImage'][0].replace(new RegExp(ossViewPath,'ig'),'')
                  fieldsValue['titleImage'] = [dealImage]
                }
              }
              fieldsValue['contentImage'] && fieldsValue['contentImage'].length && fieldsValue['contentImage'].map(item => {
                if (Array.isArray(item)) {
                  contentImage.push({
                    desp: item[0].describe ? item[0].describe : '',
                    name: item[0].response.root.object[0].fileName,
                    url: item[0].response.root.object[0].filePath,
                    size: item[0].size,
                    type: 1,
                  });
                } else {
                  contentImage.push({
                    desp: item.describe ? item.describe : '',
                    name: item.response.root.object[0].fileName,
                    url: item.response.root.object[0].filePath,
                    size: item.size,
                    type: 1,
                  });
                }

              });
              fieldsValue['newsAttachs'] && fieldsValue['newsAttachs'].length && fieldsValue['newsAttachs'].map(item => {
                if (Array.isArray(item)) {
                  newsAttachs.push({ name: item[0].response.root.object[0].fileName, url: item[0].response.root.object[0].filePath, size: item[0].size, type: 3 });
                } else {
                  newsAttachs.push({ name: item.response.root.object[0].fileName, url: item.response.root.object[0].filePath, size: item.size, type: 3 });
                }
              });
              fieldsValue['contentImage'] = contentImage;
              fieldsValue['newsAttachs'] = newsAttachs;
              fieldsValue['orgName'] = state.orgName;
            }
            //视频管理——新增——内容图片处理
            if (props.belonged === 'video' && props.style === 'add') {
              fieldsValue['contentImage'] && fieldsValue['contentImage'].length && fieldsValue['contentImage'].map(item => {
                if (Array.isArray(item)) {
                  contentImage.push({ name: item[0].response.root.object[0].fileName, url: item[0].response.root.object[0].filePath, size: item[0].size, type: 1 });
                } else {
                  if (item.url) {
                    contentImage.push(item);
                  } else {
                    contentImage.push({ name: item.response.root.object[0].fileName, url: item.response.root.object[0].filePath, size: item.size, type: 1 });
                  }
                }

              });
              fieldsValue['contentImage'] = contentImage;
              fieldsValue['newsType'] = 3;
              fieldsValue['orgName'] = state.orgName;
            }
            //视频管理——编辑——内容图片处理
            if (props.belonged === 'video' && props.style === 'edit') {

              fieldsValue['contentImage'] && fieldsValue['contentImage'].length && fieldsValue['contentImage'].map(item => {
                if (Array.isArray(item)) {
                  contentImage.push({ name: item[0].response.root.object[0].fileName, url: item[0].response.root.object[0].filePath, size: item[0].size, type: 1 });
                } else {
                  if (item.url) {
                    contentImage.push(item);
                  } else {
                    contentImage.push({ name: item.response.root.object[0].fileName, url: item.response.root.object[0].filePath, size: item.size, type: 1 });
                  }
                }
              });
              fieldsValue['contentImage'] = contentImage;
              fieldsValue['newsType'] = 3;
              fieldsValue['orgName'] = state.orgName;

            }


            //处理时间格式
            let fileUrl = fieldsValue['fileUrl'] && fieldsValue['fileUrl'].map(
              (item, index) => {
                //附件
                if (item != undefined) {
                  if (Array.isArray(item)) {
                    let isMasterUrl = item[0].response.root.object[0].filePath.indexOf(masterUrl) > -1;
                    return {
                      url: isMasterUrl ? item[0].response.root.object[0].filePath : masterUrl + '' + item[0].response.root.object[0].filePath,
                      type: 3,
                      name: item[0].response.root.object[0].fileName,
                      size: item[0].size,
                    };
                  } else {
                    let isMasterUrl = item.response.root.object[0].filePath.indexOf(masterUrl) > -1;
                    return {
                      url: isMasterUrl ? item.response.root.object[0].filePath : masterUrl + '' + item.response.root.object[0].filePath,
                      type: 3,
                      name: item.response.root.object[0].fileName,
                      size: item.size,
                    };
                  }

                }
              }
            );

            // let videoUrl= fieldsValue['videoUrl'] && fieldsValue['videoUrl'].map(
            //   (item, index) => {
            //   //附件
            //     if (item != undefined) {
            //       let isMasterUrl = item.response.root.object[0].filePath.indexOf(masterUrl) > -1;
            //       return {
            //         url: isMasterUrl ? item.response.root.object[0].filePath:masterUrl+'' + item.response.root.object[0].filePath,
            //         type: 3,
            //         name: item.response.root.object[0].fileName,
            //       };
            //     }
            //   }
            // );
            let picUrl = [];

            picUrl = fieldsValue['picUrl'] && fieldsValue['picUrl'].map(
              (item, index) => {
                //内容图片
                if (item != undefined) {
                  if (Array.isArray(item)) {
                    let isMasterUrl = item[0].response.root.object[0].filePath.indexOf(masterUrl) > -1;
                    return {
                      url: isMasterUrl ? item[0].response.root.object[0].filePath : masterUrl + '' + item[0].response.root.object[0].filePath,
                      description: item[0].describe,
                      name: item[0].response.root.object[0].fileName,
                      size: item.size,
                      type: 1,
                    };
                  } else {
                    let isMasterUrl = item.response.root.object[0].filePath.indexOf(masterUrl) > -1;
                    return {
                      url: isMasterUrl ? item.response.root.object[0].filePath : masterUrl + '' + item.response.root.object[0].filePath,
                      description: item.describe,
                      name: item.response.root.object[0].fileName,
                      size: item.size,
                      type: 1,
                    };
                  }
                }
              }
            );

            let arr = [];
            // if(videoUrl){//视屏管理中的
            //   if (picUrl && videoUrl) {
            //     arr = [...videoUrl, ...picUrl];
            //   } else if (!picUrl && videoUrl) {
            //     arr = [...videoUrl];
            //   } else if (picUrl && !videoUrl) {
            //     arr = [...picUrl];
            //   }
            // }else{  //文章管理

            if (picUrl && fileUrl) {
              arr = [...fileUrl, ...picUrl];
            } else if (!picUrl && fileUrl) {
              arr = [...fileUrl];
            } else if (picUrl && !fileUrl) {
              arr = [...picUrl];
            }
            // }
            if (fieldsValue['videoUrl']) {
              arr.push({
                url: fieldsValue['videoUrl'],
                description: fieldsValue['videoDesp'],
                timelong: fieldsValue['videoTime'],
                type: 2,
              });
            }

            values = {
              ...this.state.id, ...fieldsValue, typeId, type: fieldsValue['type'] ? fieldsValue['type'] : 3,
              orgId: fieldsValue['orgId'] && fieldsValue['orgId'][fieldsValue['orgId'].length - 1],
              orgid: fieldsValue['orgid'] && fieldsValue['orgid'][fieldsValue['orgid'].length - 1],
              createOrgId: fieldsValue['createOrgId'] && fieldsValue['createOrgId'][fieldsValue['createOrgId'].length - 1],
              organizationId: fieldsValue['organizationId'] && fieldsValue['organizationId'][fieldsValue['organizationId'].length - 1], treasureprovider: fieldsValue['treasureprovider'] && fieldsValue['treasureprovider'][fieldsValue['treasureprovider'].length - 1], applyBegin: fieldsValue['applyBegin'] && fieldsValue['applyBegin'].format('YYYY-MM-DD HH:mm:ss'), applyEnd: fieldsValue['applyEnd'] && fieldsValue['applyEnd'].format('YYYY-MM-DD HH:mm:ss'),
              titleImage: fieldsValue['titleImage'] && this.arrayToString(fieldsValue['titleImage']),
              titleimage: fieldsValue['titleimage'] && this.arrayToString(fieldsValue['titleimage']),
              coverimage: fieldsValue['coverimage'] && this.arrayToString(fieldsValue['coverimage']),
              newsAttachList: [...arr]
            };

            if(props.belonged === 'article'){
              console.log(values['titleImage'] )
              let ArtImage = values['titleImage']&&values['titleImage'].split(';')
              if(values['layout']<3&&ArtImage&&ArtImage.length>1){
                values['titleImage'] = ArtImage[0]
              }
            }
            console.log(values['titleImage'] )
            if (this.props.code == 'orderList') { //订购活动页面里面的订购时间和取货时间特有字段
              let shopTime1 = parseInt(fieldsValue['shopTime'][1].valueOf() / 1000);
              if (parseInt(fieldsValue['shopTime'][1].valueOf() / 1000) > parseInt(fieldsValue['pickTime'][0].valueOf() / 1000)) {
                Message.error('取货时间必须不小于订购结束时间');
                return;
              }
              if (fieldsValue['pickDate']) {
                if (parseInt(fieldsValue['pickDate'].valueOf() / 1000) < parseInt(fieldsValue['shopTime'][1].valueOf() / 1000)) {
                  Message.error('取货提醒时间必须不小于订购结束时间');
                  return;
                } else if (parseInt(fieldsValue['pickDate'].valueOf() / 1000) > parseInt(fieldsValue['pickTime'][1].valueOf() / 1000)) {
                  Message.error('取货提醒时间必须不大于取货结束时间');
                  return;
                }
              }
              values.beginTime = fieldsValue['shopTime'] && fieldsValue['shopTime'][0].format('YYYY-MM-DD HH:mm:ss');
              values.endTime = fieldsValue['shopTime'] && fieldsValue['shopTime'][1].format('YYYY-MM-DD HH:mm:ss'),
                values.pickStartDate = fieldsValue['pickTime'] && fieldsValue['pickTime'][0].format('YYYY-MM-DD HH:mm:ss');
              values.pickEndDate = fieldsValue['pickTime'] && fieldsValue['pickTime'][1].format('YYYY-MM-DD HH:mm:ss');
              values.pickRemindDate = fieldsValue['pickDate'] && fieldsValue['pickDate'].format('YYYY-MM-DD HH:mm:ss');
            } else if (this.props.type === 'event') {//活动里面对时间进行限制(报名结束时间大于报名开始时间，活动结束时间大于活动开始时间，活动结束时间大于报名结束时间)xwx2019/1/4
              if (fieldsValue['applyBegin'] && fieldsValue['applyEnd']) {//如果报名开始和报名结束时间存在
                if (parseInt(fieldsValue['applyBegin'].valueOf() / 1000) > parseInt(fieldsValue['applyEnd'].valueOf() / 1000)) {
                  Message.error('报名结束时间必须大于报名开始时间');
                  return;
                }
              }
              if (fieldsValue['beginTime'] && fieldsValue['endTime']) {//如果活动开始时间和活动结束时间存在
                if (parseInt(fieldsValue['beginTime'].valueOf() / 1000) > parseInt(fieldsValue['endTime'].valueOf() / 1000)) {
                  Message.error('活动结束时间必须大于活动开始时间');
                  return;
                }

                if (!isEditid) {
                  if (Number(fieldsValue['endTime'].valueOf() / 1000) < Number((new Date()).getTime() / 1000)) {
                    Message.error('活动结束时间必须大于当前时间');
                    return;
                  }
                }

              }
              if (fieldsValue['applyBegin'] && fieldsValue['applyEnd'] && fieldsValue['beginTime'] && fieldsValue['endTime']) {//如果报名开始和结束时间、活动开始和结束时间存在
                if (parseInt(fieldsValue['applyEnd'].valueOf() / 1000) > parseInt(fieldsValue['endTime'].valueOf() / 1000)) {
                  Message.error('活动结束时间必须大于报名结束时间');
                  return;
                }
              }
              values.applyBegin = fieldsValue['applyBegin'] && fieldsValue['applyBegin'].format('YYYY-MM-DD HH:mm:ss');
              values.applyEnd = fieldsValue['applyEnd'] && fieldsValue['applyEnd'].format('YYYY-MM-DD HH:mm:ss');
              values.beginTime = fieldsValue['beginTime'] && fieldsValue['beginTime'].format('YYYY-MM-DD HH:mm:ss');
              values.endTime = fieldsValue['endTime'] && fieldsValue['endTime'].format('YYYY-MM-DD HH:mm:ss');
            } else {
              values.beginTime = fieldsValue['beginTime'] && fieldsValue['beginTime'].format('YYYY-MM-DD HH:mm:ss');
              values.endTime = fieldsValue['beginTime'] && fieldsValue['endTime'].format('YYYY-MM-DD HH:mm:ss');
              values.pickStartDate = fieldsValue['pickStartDate'] && fieldsValue['pickStartDate'].format('YYYY-MM-DD HH:mm:ss');
              values.pickEndDate = fieldsValue['pickEndDate'] && fieldsValue['pickEndDate'].format('YYYY-MM-DD HH:mm:ss');
            }
            let newsAttachLists = [];
            values.newsAttachList.map(v => {
              if (v) {
                newsAttachLists.push(v);
              }
            });
            values.newsAttachList = newsAttachLists;
            if (this.props.type === 'event' && values['categoryId']) {
              // values['categoryId'] = this.arrayToString(values['categoryId']);
              values['categoryId'] = values['categoryId'].join(',');
            }
            if (values.content) {
              if (Array.isArray(values.content) && values.content.length === 0) {
                values.content = '';
              }
            } else {
              values.content = '';
            }
            if (this.props.datatype == 'partylearn' && this.props.style == 'edit') {

              values['partyid'] = this.props.editData.partyid;
            }
            let body = { ...values };
            const merchantList = this.state.merchantList;
            values['merchant'] = merchantList;
            if (values.videoUrl) {
              let regUrl = /(http|https)\:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/gi;
              let arrV = regUrl.exec(values['videoUrl']);
              if (arrV === null) {
                Message.warning('视频地址请输入正确的网址！');
                return false;
              }
            }

            // if (this.props.code == 'orderList' && values.merchant.length <= 0) {
            //   Message.error('请添加商家');
            //   return;
            // }
            if (this.props.code == 'orderList' && sessionStorage.getItem('MerchantCount') > values.merchant.length) {
              Message.error('请选择商家用户');
              return;
            }
            if (values.titleimage) {
              let titleImages = values.titleimage.indexOf(';') == -1 ? values.titleimage : values.titleimage.split(';');
              if (values.type === '2' && values.layout === 3 && titleImages.length != 3) {
                Message.warning('标题图片必须上传3张！');
                return false;
              }
            }
            if (values.titleimage && values.titleimage.indexOf('http') != -1) {
              let image = '';
              if (values.titleimage.indexOf(';') == -1) {
                image = values.titleimage.split('com/')[1];
              } else {
                let images = values.titleimage.split(';');
                image = images.map(item => {
                  return item.indexOf('com/') != -1 ? item.split('com/')[1] : item;
                });
              }
              values['titleimage'] = image.join(';');
            }
            body = { ...values };
            if (values['type'] === '2') {
              if (values['picUrl'].length <= 0) {
                Message.warning('内容图片为必填项,请在内容图片中上传图片！');
                return false;
              }
            }
            if (values['periods']) {
              let CHperiods = Math.floor(values['periods']);
              let CHperiods1 = Math.ceil(values['periods']);
              if (CHperiods != CHperiods1) {
                Message.error('期数不能为小数！');
                return false;
              }
            }

            if (body['title1']) {
              body['name'] = body['title1'];
            }
            if (body['nameM']) {
              body['name'] = body['nameM'];
            }

            if (body['content']) {
              body['content'] = body['content'].replace(/text-decoration-line/img, 'text-decoration');
            }
            if (values['type'] === '5') {
              let regUrlNum = 0;
              let regUrl = /(http|https)\:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/gi;
              let arrT = regUrl.exec(values['content']);

              if (arrT === null) {
                Message.warning('资讯类型为‘网页’时，资讯内容只能是网址！');
              } else {
                let regUrl = /(http|https)\:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/gi;
                let arrW = values['content'].match(regUrl);
                values['content'] = arrW[0];
                body = {
                  ...values,
                };
                postService(
                  API_PREFIX + `${this.state.id ? updateUrl : url}`,
                  body,
                  data => {
                    if (data.retCode === 1) {
                      Message.success('保存成功!');
                      let id = { id: data.root.id };
                      this.props.setIsSubmit(false); //关闭缓存
                      this.setState({ numberOne: '1' });
                      /**保存完之后缓存置空 */
                      let leaveData = { ...this.props.leaveData };
                      leaveData[this.props.belonged] = {};
                      this.props.setLeaveData(leaveData);
                      /* */
                      if (data.root.titleImage) {
                        this.setState({ id, name: data.root.name, titleImage: data.root.titleImage.split(','), categoryId: data.root.categoryId });
                      } else {
                        this.setState({ id, name: data.root.name, categoryId: data.root.categoryId });
                      }

                      if (type === 'next') {
                        // this.next(this.dealGetData(data.root));

                        this.next(fieldsValue, data.root.id);
                      } else
                        if (save) {
                          location.hash = save;
                        }
                    } else {
                      Message.error(data.errorMsg);
                    }
                    if (tabChange == 'tabChange') {
                      this.setState({ current: currentValue, updateFormWrapper: this.state.updateFormWrapper + 1 }); //yelu tab切换保存数据后跳转到下一个tab栏
                    }
                  }
                );
              }
            } else {
              if (this.props.datatype == 'partylearn') {
                let nowDate = moment(new Date());
                let endData = moment(this.props.timePushData);
                let diffDate = endData - nowDate;
                if (diffDate < 0 && GetQueryString(location.hash, ['activeKey']).activeKey != 1) {
                  Message.error('定时发布时间必须大于当前时间！');
                  return;
                }
              }
              // 朱劲松 新增判断
              if (typeof (this.state.id) == 'string') {
                body.id = this.state.id;
              } else if (typeof (this.state.id) == 'object') {
                body.id = this.state.id.id;
              }
              this.setState({ loading: true });
              // if (this.props.type === 'event') {
              //   let newBody = { ...body };
              //   if (newBody.orgId.indexOf('&') > -1) {

              //     body.orgId = newBody.orgId.split("&")[0];
              //     body.orgName = newBody.orgId.split("&")[1];
              //   }
              // }

              if (props.belonged === 'video') {
                let list = [{
                  desp: values.desp ? values.desp : '',
                  videoLong: values.videoLong ? values.videoLong : 0,
                  type: 2,
                  url: values.url,
                }];
                body['contentImage'][0].desp = values.desp;
                body['newsAttachs'] = list;
                body['categoryIdList'] = [...new Set(body['categoryIdList'])];

              }
              body.coverImage = values.coverImage && values.coverImage[0];
              if (this.props.style == 'edit' && this.props.type == 'information') {
                values.id = state.infoId;
              }
              if (this.props.style == 'edit' && this.props.type == 'event') {
                values.id = this.state.eventUpdataId;
              }
              if (props.belonged === 'magazine') {
                if (body.nameM) {
                  delete body.nameM;
                  delete body.merchant;
                  delete body.newsAttachList;
                  delete body.type;
                  delete body.content;
                }
                body.orgName = '';
              }
              if (props.belonged === 'article') {
                if (fieldsValue.layout === 3) {
                  body['titleImage'] = body['titleImage'].replace(/\;/g, ',');
                }
              }

              if(props.belonged === 'order'){           
                 body['pickupAddress']=JSON.parse(JSON.stringify(this.state.pickupAddressList));              
                 body['applyBegin']=body['pickStartDate'];
                 body['applyEnd']=body['pickEndDate'];          
                 delete body['pickEndDate'];
                 delete body['pickStartDate'];
                 delete body['pickTime'];
                 delete body['shopTime'];
                 delete body['merchant'];
                 delete body['newsAttachList'];
                 delete body['pickDate'];
              }
         
              postService(API_PREFIX + `${this.state.id ? updateUrl : url}`, body, data => {
                if (data.status === 1) {
                  Message.success('保存成功');
                  if((updateUrl&&(updateUrl=='services/web/news/article/update'||updateUrl=='services/web/activity/enrolment/update'||updateUrl=='services/web/activity/ordering/update'||updateUrl=='services/web/activity/voting/update'||updateUrl=='services/web/activity/question/update'||updateUrl=='services/web/activity/exam/update'))||(url&&(url=='services/web/news/article/add'||url=='services/web/news/vedio/add'||url=='services/web/activity/enrolment/insert'||url=='services/web/activity/ordering/insert'||url=='services/web/activity/voting/insert'||url=='services/web/activity/question/insert'||url=='services/web/activity/exam/insert'))){
                    let params={};
                    params['categoryId']=body.depCategory;
                    params['newsId']=data.root.object.id?data.root.object.id:data.root.object;
                
                    if(updateUrl){
                      params['type']=body.newsType?(body.newsType==1?1:2):3;
                    }else{
                      params['type']= url=='services/web/news/article/add'?1:(url=='services/web/news/vedio/add'?2:3)
                    }          
                    postService(API_PREFIX + `services/web/news/special/rel/insert`, [params], data => {});
                 }
                  if (props.belonged === 'magazine' || props.belonged === 'article' || props.belonged === 'video') {

                    if (!state.infoId) {
                      let tenantId = window.sessionStorage.getItem("tenantId");
                      let bodyAuth = {
                        dataId: data.root.object.id,
                        dataType: props.belonged === 'magazine' ? 3 : 1,
                        departments: [],
                        partys: [],
                        groups: [],
                        companyList: [],
                        viewTenantId: [tenantId],
                        partysJoin: [],
                        departmentsJoin: [],
                        groupsJoin: [],
                        companyJoinList: [],
                        unions: [],
                        unionsJoin: [],
                        joinTenantId: [],
                      };
  
                      postService(API_PREFIX + `services/web/auth/authdata/updAuthData`, bodyAuth, data => {
                        if (data.status === 1) {

                        }
                      });
                      if (props.belonged === 'magazine') {
                        postService(API_PREFIX + `services/web/news/magazine/updateAuth`, bodyAuth, data => {
                          if (data.status === 1) {

                          }
                        });
                      }
                    }
                    this.setState({ infoId: data.root.object.id });
                  }
                  this.setState({ categoryIdList: body['categoryIdList'], categoryRelevances: body['categoryRelevances'] });
                  this.setState({ numberOne: '1', loading: false });
                  //文章管理和视频管理已上线之编辑：栏目管理（有审核人）=编辑后下线    栏目管理（无审核人）=编辑后依然上线
                  if (this.props.datatype == 'article' && this.props.style == 'edit' && this.props.steps[0].data.onlineState == '1' && this.props.steps[0].data.hasReview) {
                    getService(API_PREFIX + `services/news/artical/newsInfo/onlineState/${data.root.id}/0`, data => {
                      if (data.retCode === 1) {
                        Message.success('您的文章重新编辑需要再次审核，请在已下线中审核上线');
                      }
                    });
                  }
                  if (this.props.datatype == 'video' && this.props.style == 'edit' && this.props.steps[0].data.onlineState == '1' && this.props.steps[0].data.hasReview) {
                    getService(API_PREFIX + `services/news/video/newsInfo/onlineState/${data.root.id}/0`, data => {
                      if (data.retCode === 1) {
                        Message.success('您的视频重新编辑需要再次审核，请在已下线中审核上线');
                      }
                    });
                  }

                  if (this.props.type === 'event' && this.props.style === 'add') {
                    let authUrl = `services/web/auth/authdata/updAuthData`;
                    let tenantId = window.sessionStorage.getItem("tenantId");
                    if (!this.state.infoId) {
                      let body = {
                        dataId: data.root.object.id || this.state.id.id,
                        dataType: 2,
                        departments: [],
                        partys: [],
                        groups: [],
                        companyList: [],
                        viewTenantId: [tenantId],
                        partysJoin: [],
                        departmentsJoin: [],
                        groupsJoin: [],
                        companyJoinList: [],
                        unions: [],
                        unionsJoin: [],
                        joinTenantId: [tenantId],
                      };
                      console.log("dataId", body, this.state);

                      postService(API_PREFIX + authUrl, body, data => {

                        if (data.status === 1) {
                          this.setState({
                            isAuthSuccess: true,
                          });
                        }
                      });
                      this.setState({ infoId: data.root.object.id });
                    }

                  }
                  this.props.setIsSubmit(false); //关闭缓存
                  /**保存完之后缓存置空 */
                  let leaveData = { ...this.props.leaveData };
                  leaveData[this.props.belonged] = {};
                  this.props.setLeaveData(leaveData);
                  /* */
                  let id = { id: data.root.object.id || this.state.id.id };
                  this.setState({ id: data.root.object.id || this.state.id.id });
                  //单独判断党建学习的定时发布
                  if (this.props.datatype == 'partylearn' && fieldsValue.isTimePublish) {
                    if (this.props.editData && this.props.editData.onlineState != '1') {

                      this.props.timePush(data.root.object.id, this.props.style, this.props.timePushData);
                    }
                    if (this.props.addlearnType == "addlearnTimePush") {
                      this.props.timePush(data.root.object.id, this.props.style, this.props.timePushData);
                    }

                  }

                  if (data.root.object.titleImage) {
                    this.setState({ id, name: data.root.object.name, titleImage: data.root.object.titleImage.split(','), categoryId: data.root.object.categoryId });
                  } else {
                    this.setState({ id, name: data.root.object.name, categoryId: data.root.object.categoryId });
                  }

                  if (type === 'next') {
                    // this.next(this.dealGetData(data.root));
                    fieldsValue.pickupAddress=this.state.pickupAddressList;

                    this.next(fieldsValue, data.root.object.id || this.state.id.id);
                  } else if (save) {
                    location.hash = save;
                  }
                } else {
                  Message.error(data.errorMsg);
                  this.setState({ loading: false });
                }
                if (tabChange == 'tabChange') {
                  this.setState({ current: currentValue, updateFormWrapper: this.state.updateFormWrapper + 1 });//yelu tab切换保存数据后跳转到下一个tab栏
                }
              }
              );
            }
          }
          if (current == 1) {
            //单独判断党建学习的第二步
            if (steps[1].content && steps[1].content[0].type == 'LearnTree') {
              if (this.props.style == 'edit') {
                let column = this.props.AllTreeData.column;
                let partyid = '';
                if (column.length > 1) {
                  partyid = column.join(',');
                } else if (column.length == 1) {
                  partyid = column[0];
                } else {
                  Message.error('请选择接收人');
                  return;
                }
                values = { ...fieldsValue, ...this.state.id };
                values['partyid'] = partyid;
                postService(API_PREFIX + url, values, data => {
                  if (data.retCode === 1) {
                    if (!online) {
                      Message.success('编辑成功！');
                    }
                    let id = { id: data.root.id };
                    let id2 = data.root.id;
                    this.setState({ numberOne: '1' });
                    if (online) {
                      getService(API_PREFIX + online + '/' + id2, data => {
                        if (data.retCode === 1) {
                          Message.success('发布成功！');
                          if (save) {
                            location.hash = save;
                          }
                        } else {
                          Message.error(data.errorMsg);
                        }
                      });
                    }
                    /**
                    * 朱劲松  2018-12-06
                    * 修改‘ 编辑党建学习--> 设置接收人 --> 点击‘保存并返回’按钮不能返回 ’的BUG
                    */
                    else {
                      location.hash = this.props.save;
                    }
                  }
                  if (tabChange == 'tabChange') {
                    this.setState({ current: currentValue, updateFormWrapper: this.state.updateFormWrapper + 1 });//yelu tab切换保存数据后跳转到下一个tab栏
                  }
                });
              }

              if (this.props.style == 'add') {
                let column = [];
                if (this.props.AllTreeData.column != undefined) {
                  column = this.props.AllTreeData.column;
                }
                let partyid = '';
                if (column.length > 1) {
                  partyid = column.join(',');
                } else if (column.length == 1) {
                  partyid = column[0];
                } else {
                  Message.error('请选择接收人');
                  return;
                }
                values = { id: this.state.addid };
                values['partyid'] = partyid;
                postService(API_PREFIX + url, values, data => {
                  if (data.retCode === 1) {
                    if (!online) {
                      Message.success('保存成功！');
                    }
                    let id = { id: data.root.id };
                    let id2 = data.root.id;
                    this.setState({ numberOne: '1' });
                    if (online) {
                      getService(API_PREFIX + online + '/' + id2, data => {
                        if (data.retCode === 1) {
                          Message.success('发布成功！');
                          if (save) {
                            location.hash = this.props.save;
                          }
                        } else {
                          Message.error(data.errorMsg);
                        }
                      });
                    } else if (save) {
                      location.hash = save;
                    }
                  }
                  if (tabChange == 'tabChange') {
                    this.setState({ current: currentValue, updateFormWrapper: this.state.updateFormWrapper + 1 });//yelu tab切换保存数据后跳转到下一个tab栏
                  }
                });
              }


            } else if (steps[1].content && steps[1].content[0].type === 'LearnManagationTree') {//学习管理第二步
              if (this.props.style === 'add') {//新建
                values['department'] = this.state.checkData['department_LearnManagationTree'] && this.state.checkData['department_LearnManagationTree'].join(',');//部门数数据
                values['party'] = this.state.checkData['partyid_LearnManagationTree'] && this.state.checkData['partyid_LearnManagationTree'].join(',');//部门数数据
                values['groups'] = this.state.checkData['virtualgroupid_LearnManagationTree'] && this.state.checkData['virtualgroupid_LearnManagationTree'].join(',');//虚拟圈数数据
              } else if (this.props.style == 'edit') {
              }

            } else {
              values = { ...fieldsValue, ...this.state.id };
              console.log("111",values,this.state);
              // values['department'] = this.state.checkData['department_join'] && this.arrayToString(this.state.checkData['department_join']);
              // values['depView'] = this.state.checkData['department_view'] && this.arrayToString(this.state.checkData['department_view']);
              // values['party'] = this.state.checkData['partyid_join'] && this.arrayToString(this.state.checkData['partyid_join']);
              // values['partyView'] = this.state.checkData['partyid_view'] && this.arrayToString(this.state.checkData['partyid_view']);
              // values['groups'] = this.state.checkData['virtualgroupid_join'] && this.arrayToString(this.state.checkData['virtualgroupid_join']);
              // values['groupView'] = this.state.checkData['virtualgroupid_view'] && this.arrayToString(this.state.checkData['virtualgroupid_view']);
              // values['partyid'] = this.state.checkData['partyid_join'] && this.arrayToString(this.state.checkData['partyid_join']);
              values['department'] = this.state.checkData['department_join'] && this.state.checkData['department_join'].join(',');
              values['depView'] = this.state.checkData['department_view'] && this.state.checkData['department_view'].join(',');
              values['party'] = this.state.checkData['partyid_join'] && this.state.checkData['partyid_join'].join(',');
              values['partyView'] = this.state.checkData['partyid_view'] && this.state.checkData['partyid_view'].join(',');
              values['groups'] = this.state.checkData['virtualgroupid_join'] && this.state.checkData['virtualgroupid_join'].join(',');
              values['groupView'] = this.state.checkData['virtualgroupid_view'] && this.state.checkData['virtualgroupid_view'].join(',');
              values['partyid'] = this.state.checkData['partyid_join'] && this.state.checkData['partyid_join'].join(',');
              values['companyJoinList'] = this.state.checkData['company_join'] && this.state.checkData['company_join'].join(',');
              values['companyList'] = this.state.checkData['company_view'] && this.state.checkData['company_view'].join(',');
              values['partysJoin'] = this.state.checkData['partyid_join'] && this.state.checkData['partyid_join'].join(',');
              values['partys'] = this.state.checkData['partyid_view'] && this.state.checkData['partyid_view'].join(',');
              console.log("2222",values)
              if (values.upperLimit == null || values.upperLimit == "") {
                // values.upperLimit=null;
                delete values.upperLimit;
              } else {
                values.upperLimit = parseInt(values.upperLimit);
                this.setState({
                  upperLimit: values.upperLimit,
                });
                const upperLimit = JSON.stringify(values.upperLimit);
                window.sessionStorage.setItem('upperLimit', upperLimit);
              }
              if (props.belonged === 'article' || props.belonged === 'video') {
                // if(state.valueOne === 2){
                //     values['departments'] = this.state.checkData['department_join'] && this.state.checkData['department_join']||[];
                //     values['partys'] = [];
                //     values['groups'] = this.state.checkData['virtualgroupid_join'] && this.state.checkData['virtualgroupid_join']||[];
                //     values['unions'] = this.state.checkData['union_join'] && this.state.checkData['union_join']||[];
                //     if(!values['departments'].length&&!values['partys'].length&&!values['groups'].length&&!values['unions'].length){
                //         Message.warning('请选择本级企业发布范围')
                //         return
                //     }
                // }
                if (state.valueTwo === 2) {
                  values['companyList'] = this.state.checkData['company_join'] && this.state.checkData['company_join'] || [];
                  if (!values['companyList'].length) {
                    Message.warning('请选择下级企业发布权限范围')
                    return
                  }
                }
              }
              let auth = {
                viewTenantId: [],
                partysJoin: [],
                departmentsJoin: [],
                groupsJoin: [],
                companyJoinList: [],
                joinTenantId: [],
              };
              if (props.belonged === 'magazine' || props.belonged === 'article' || props.belonged === 'video') {
                values = { ...this.state.id, ...auth };
                values['departments'] = this.state.checkData['department_join'] && this.state.checkData['department_join'] || [];
                values['partys'] = this.state.checkData['partyid_join'] && this.state.checkData['partyid_join'] || [];
                values['groups'] = this.state.checkData['virtualgroupid_join'] && this.state.checkData['virtualgroupid_join'] || [];
                values['unions'] = this.state.checkData['union_join'] && this.state.checkData['union_join'] || [];
                if (props.belonged === 'article' || props.belonged === 'video') {
                  values['companyList'] = this.state.checkData['company_join'] && this.state.checkData['company_join'] || [];
                  values['dataId'] = values.id || state.infoId;
                  values['dataType'] = 1;
                  if (state.valueOne === 1) {
                    values['departments'] = [];
                    values['partys'] = [];
                    values['groups'] = [];
                    values['unions'] = [];
                    let tenantId = window.sessionStorage.getItem('tenantId');
                    values['viewTenantId'] = [tenantId];
                  }
                  if (state.valueTwo === 0) {
                    values['companyList'] = [];
                  }
                  if (state.valueTwo === 1) {
                    let tenantId = window.sessionStorage.getItem('tenantId');
                    let companyList = values['companyList'];
                    companyList.push(tenantId)
                    values['companyList'] = companyList;
                  }

                  if (state.valueOne === 2 && state.valueTwo === 0 && !values['departments'].length && !values['partys'].length && !values['groups'].length && !values['unions'].length) {
                    let tenantId = window.sessionStorage.getItem('tenantId');
                    values['viewTenantId'] = [tenantId];
                  }
                }
                if (props.belonged === 'magazine') {
                  values['dataId'] = values.id || state.infoId;
                  values['dataType'] = 3;
                  values['companyList'] = [];
                  if (!values['departments'].length && !values['partys'].length && !values['groups'].length && !values['unions'].length) {
                    let tenantId = window.sessionStorage.getItem('tenantId');
                    values['viewTenantId'] = [tenantId];
                  }
                  if (state.valueOne === 1) {
                    values['departments'] = [];
                    values['partys'] = [];
                    values['groups'] = [];
                    values['unions'] = [];
                    let tenantId = window.sessionStorage.getItem('tenantId');
                    values['viewTenantId'] = [tenantId];
                  }
                }
              }

              if (props.type === 'event') {
                values['categoryRelevances'] = this.state.categoryRelevances;
                // console.log("categoryRelevances",this.state);
                const list = JSON.stringify(this.state.flowData);
                window.sessionStorage.setItem('setApply', list);
                if (this.props.style == 'edit' && this.props.type == 'event') {
                  values.id = this.state.eventUpdataId;
                  if (values['categoryRelevances'].length == 0 && this.state.categoryRelevances == 0) {
                    values['categoryRelevances'] = this.state.checkData.column;
                  }
                }
                /////单独做新增和修改的数据鉴权
                let authUrl = `services/web/auth/authdata/updAuthData`;
                let tenantId = window.sessionStorage.getItem("tenantId");
                // console.log("dataId",values,this.state);          
                let body = {
                  dataId: values.id,
                  dataType: 2,
                  departments: [],
                  partys: [],
                  groups: [],
                  companyList: [],
                  // viewTenantId,
                  partysJoin: [],
                  departmentsJoin: [],
                  groupsJoin: [],
                  companyJoinList: [],
                  unions: [],
                  unionsJoin: [],
                  // joinTenantId,
                };

                //参加的权限
                if (this.state.valueJoin == '2') {
                  let departmentsJoin = [];
                  let groupsJoin = [];
                  let partys = [];
                  let partysJoin = [];
                  if (values.department && values.department.indexOf(",") > -1) {
                    departmentsJoin = values.department.split(",");
                    if (departmentsJoin.indexOf(tenantId) > -1) {
                      let index = departmentsJoin.indexOf(tenantId);
                      departmentsJoin.splice(index, 1);
                    }
                  } else if (values.department == undefined || values.department == "") {
                    departmentsJoin = [];
                  } else {
                    departmentsJoin.push(values.department);
                  }
                  if (values.groups && values.groups.indexOf(',') > -1) {
                    groupsJoin = values.groups.split(",");
                  } else if (values.groups == undefined || values.groups == "") {
                    groupsJoin = [];
                  } else {
                    groupsJoin.push(values.groups);
                  }

                  // if (values.partys && values.partys.indexOf(',') > -1) {
                  //   partys = values.partys.split(",");
                  // } else if (values.partys == undefined || values.partys == "") {
                  //   partys = [];
                  // } else {
                  //   partys.push(values.partys);
                  // }

                  if (values.partysJoin && values.partysJoin.indexOf(',') > -1) {
                    partysJoin = values.partysJoin.split(",");
                  } else if (values.partysJoin == undefined || values.partysJoin == "") {
                    partysJoin = [];
                  } else {
                    partysJoin.push(values.partysJoin);
                  }

                  body.departmentsJoin = departmentsJoin;
                  body.groupsJoin = groupsJoin;
                  // body.partys = partys;
                  body.partysJoin = partysJoin;

                  body.unionsJoin = this.state.checkData['union_join'];
                  if (body.unionsJoin && body.unionsJoin.length > 0 && body.unionsJoin.indexOf(tenantId) > -1) {
                    let index = body.unionsJoin.indexOf(tenantId);
                    body.unionsJoin.splice(index, 1);
                  }
                  if (body.unionsJoin == undefined) {
                    body.unionsJoin = [];
                  }
                } else {
                  body.departmentsJoin = [];
                  body.groupsJoin =  [];
                  body.unionsJoin =  [];
                  body.partysJoin =  [];
                  body.joinTenantId = [tenantId];
                }

                ////下级企业的发布权限
                if (this.state.valueCompanyJoin == '3') {
                  body.companyJoinList = this.state.checkData['company_join'] && this.state.checkData['company_join'];
                } else if (this.state.valueCompanyJoin == '2') {
                  let { companyIdsData } = this.state;
                  let companyIdsData1 = [...companyIdsData];
                  companyIdsData1.push(tenantId);
                  body.companyJoinList = companyIdsData1;
                } else {
                  body.companyJoinList = [];
                }
                console.log("dataId", values, this.state, body);
                if (this.state.valueJoin == '2' && !body.departmentsJoin[0] && !body.groupsJoin[0] && !body.unionsJoin[0] && !body.companyJoinList[0] && !body.partysJoin[0]) {
                  Message.error('请选择参加权限范围');
                  return;
                }
          
                //查看的权限
                if (this.state.valueView == '2' || body.departmentsJoin[0] || body.groupsJoin[0] || body.unionsJoin[0]||body.partys[0]) {
                  let departments = [];
                  let groups = [];
                  if (values.depView && values.depView.indexOf(",") > -1) {
                    departments = values.depView.split(",");
                    if (departments.indexOf(tenantId) > -1) {
                      let index = departments.indexOf(tenantId);
                      departments.splice(index, 1);
                    }
                  } else if (values.depView == undefined || values.depView == "") {
                    departments = [];
                  } else {
                    departments.push(values.depView);
                  }
                  if (values.groupView && values.groupView.indexOf(",") > -1) {
                    groups = values.groupView.split(",");
                  } else if (values.groupView == undefined || values.groupView == "") {
                    groups = [];
                  } else {
                    groups.push(values.groupView);
                  }
                  // body.departments = departments;
                  // body.groups = groups;
                  body.unions = this.state.checkData['union_view'] && this.state.checkData['union_view'];
                  if (body.unions && body.unions.length > 0 && body.unions.indexOf(tenantId) > -1) {
                    let index = body.unions.indexOf(tenantId);
                    body.unions.splice(index, 1);
                  }
                  if (body.unions == undefined) {
                    body.unions = [];
                  }

                  // 党组织查看权限
                  body.partys = this.state.checkData['partyid_view'];
                  if (body.partys && body.partys.length > 0 && body.partys.indexOf(tenantId) > -1) {
                    let index = body.partys.indexOf(tenantId);
                    body.partys.splice(index, 1);
                  }
                  if (body.partys == undefined) {
                    body.partys = [];
                  }

                  //  body.departments=[...departments, ...body.departmentsJoin];
                  body.departments = [...departments];
                  body.groups = [...groups];
                  body.unions = [...body.unions];
                  body.partys = [...body.partys];
                }
                if (this.state.valueView == '1') {
                  body.departments = [];
                  body.groups = [];
                  body.unions = [];
                  body.partys = [];
                  body.viewTenantId = [tenantId];
                }

                ////下级企业的查看权限
                if (this.state.valueCompanyView == '3') {
                  body.companyList = this.state.checkData['company_view'] && this.state.checkData['company_view'];
                } else if (this.state.valueCompanyView == '2') {
                  let { companyIdsData } = this.state;
                  let companyIdsData2 = [...companyIdsData];
                  companyIdsData2.push(tenantId);
                  body.companyList = companyIdsData2;
                } else {
                  body.companyList = [];
                }
                // body.companyList=[... body.companyList,...body.companyJoinList];

                console.log("1111",this.props)
                if (this.state.valueView == '2'&&!body.departments[0] && !body.groups[0] && !body.unions[0] && !body.companyList[0] && !body.partys[0]) {
                    Message.error('请选择查看权限范围');
                    return;         
                }   
                 
                // if(this.props.AllTreeData.partyid_view){
                //   body.partys =this.props.AllTreeData.partyid_view;
                // }
                // if(this.props.AllTreeData.partyid_join){
                //   body.partysJoin =this.props.AllTreeData.partyid_join;
                // }             
                                 
                if (this.state.valueCompanyView == "2") {
                  body.companyList = this.state.arrJoin;
                  // body.companyJoinList=[...body.companyJoinList]
                }
                if (this.state.valueCompanyJoin == "2") {
                  body.companyJoinList = this.state.arrJoin
                }
                body.companyList = Array.from(new Set(body.companyList));
                body.companyJoinList = Array.from(new Set(body.companyJoinList))

                //  if(body.companyList.length>0&&body.companyJoinList.length>0){
                //   let paramsArr=JSON.parse(JSON.stringify(body.companyList));
                //   body.companyList=body.companyJoinList;
                //   body.companyJoinList=paramsArr;
                //  }

                //  if( body.companyList.length>0&&body.companyJoinList.length>0){
                //     let paramsArr=JSON.parse(JSON.stringify(body.companyList));
                //     body.companyList=body.companyJoinList;
                //     body.companyJoinList=paramsArr;
                //   }    

                postService(API_PREFIX + authUrl, body, data => {
                  if (data.status === 1) {
                    this.setState({
                      isAuthSuccess: true,
                    });
                  } else {
                    Message.error(data.errorMsg);
                  }
                });
              }
              if (this.props.style == 'edit' && this.props.type == 'information') {
                values.id = state.infoId;
              }
              if (this.props.style == 'edit' && this.props.type == 'event') {
                values.id = this.state.eventUpdataId;
              }

              if (props.style === 'add' && props.type === 'event') {
                let saveValue = { upperLimit: values.upperLimit, actminCredits: values.actminCredits, actminTreasure: values.actminTreasure }
                this.props.setEventTwoData(saveValue)
              }


              if (props.belonged === 'magazine') {
                postService(API_PREFIX + `services/web/news/magazine/updateAuth`, values, data => {
                  if (data.status === 1) {

                  }
                });
              }
              postService(API_PREFIX + url, values, data => {
                if (data.status === 1) {
                  if (!online) {
                    if (this.state.isAuthSuccess) {
                      Message.success('保存成功！');
                    } else {
                      Message.success('保存成功！');
                    }
                  }
                  this.setState({ numberOne: '1' });
                  let id = { id: data.root.object.id || this.state.id.id };
                  let id2 = data.root.id;
                  if (online) {
                    getService(API_PREFIX + online + '/' + id2, data => {
                      if (data.retCode === 1) {
                        Message.success('发布成功！');
                        if (save) {
                          location.hash = save;
                        }
                      } else {
                        Message.error(data.errorMsg);
                      }
                    });
                  }
                  this.props.setIsSubmit(false); //关闭缓存
                  /**保存完之后缓存置空 */
                  let leaveData = { ...this.props.leaveData };
                  leaveData[this.props.belonged] = {};
                  this.props.setLeaveData(leaveData);
                  /* */

                  this.setState({ id, showPrompt: steps[steps.length - 1].end ? false : true }, () => {
                    if (type === 'next') {
                      // this.next(this.dealGetData(data.root));
                      console.log("ssss",this.props.flowData)
                      this.next({ ...this.props.flowData, ...fieldsValue, ...this.state.checkData, ...data.root.id }); // yelu 修改，解决返回上一步数据没回填问题
                    }
                    if (save) {
                      location.hash = save;
                    }
                  });

                } else {
                  Message.error(data.errorMsg);
                }
                if (tabChange == 'tabChange') {
                  this.setState({ current: currentValue, updateFormWrapper: this.state.updateFormWrapper + 1 });//yelu tab切换保存数据后跳转到下一个tab栏
                }
              });
            }
          } else if (current == 2) {
            if (this.props.datatype == 'orderList') {
              this.setState({ loading: true });
            }

            const values = { ...fieldsValue, ...this.state.id };
            values['treasureProvider'] = values['treasureProvider'] && values['treasureProvider'][values['treasureProvider'].length - 1];
            values['point'] = values['point'] && parseInt(values['point']);
            values['treasure'] = values['treasure'] && parseInt(values['treasure']);
            if (values['isHomePage']) {
              values['name'] = this.state.name;
              values['titleImage'] = this.state.titleImage;
              values['categoryId'] = this.state.categoryId;
            }
            if (props.belonged === 'article') {
              values['exp'] = values['exp'] ? values['exp'] : 0
              values['point'] = values['point'] ? values['point'] : 0
            }

            if (props.style === 'add' && values['isTimePublish'] && props.type === 'information' && online) {
              values['publishDate'] = this.props.timePushData;
              if (!values.id) {
                values.id = state.infoId;
              }
              postService(API_PREFIX + url, values, data => {
                if (data.status === 1) {
                  let params = { ...this.state.id, categoryIdList: this.state.categoryIdList};
                  if (!params.id) {
                    params.id = state.infoId;
                  }
                  postService(API_PREFIX + `${online}`, params, data => {
                    if (data.status === 1) {
                      if (save) {
                        if(data.root.object){
                          Message.success('该数据发布到待审核列表');
                        }else{
                          Message.success('发布成功');
                        }
                        location.hash = save;
                      }
                    } else {
                      Message.success('保存成功，发布失败!');
                    }
                  }
                  );
                  this.setState({ id, showPrompt: false, loading: false }, () => {
                    if (type === 'submit') {
                      location.hash = `${linkTo}?id=${this.state.id.id}`;
                    } else if (save) {
                      location.hash = save;
                    }
                  });
                  this.props.setIsSubmit(false);
                  let leaveData = { ...this.props.leaveData };
                  leaveData[this.props.belonged] = {};
                  this.props.setLeaveData(leaveData);
                } else {
                  Message.error(data.errorMsg);
                }
              });
            } else if (this.props.timePushData && this.props.timePushData !== '') {
              let body = { ...this.props.timePush.body };
              if (values['isTimePublish'] && props.type === 'information') {
                let queryValue = {};
                if (props.style === 'add') {
                  queryValue = { ...this.state.id, categoryIdList: this.state.categoryIdList };
                } else {
                  queryValue = {
                    id: props.steps[0].data.id,
                    categoryIdList: state.categoryIdList.length ? state.categoryIdList : props.steps[0].data.categoryIdList
                  };
                }


                body.queryValue = JSON.stringify(queryValue);
                body.runTime = this.props.timePushData;
                if (taskId) {
                  body.id = taskId;
                }
                postService(API_PREFIX+'services/web/config/review/getPanListByCategoryId',queryValue.categoryIdList,data=>{
                  if(data.status === 1){
                      if(data.root.object){//true  待审核
                        if (values && values.id.id) {
                          values.id = values.id.id;
                        }
                        if (!values.id) {
                          values.id = state.infoId;
                        }
                        values['publishDate'] = this.props.timePushData;
                        // values['taskId'] = timeData.root.object.id;
                        postService(API_PREFIX + url, values, data => {
                          if (data.status === 1) {
                            Message.success(
                              `保存成功！需要审核通过才能发布`
                            );
                            let id = { id: data.root.id };
    
                            this.setState({ id, showPrompt: false, loading: false }, () => {
                              if (type === 'submit') {
                                //history.back();
                                location.hash = `${linkTo}?id=${this.state.id.id}`;
                              } else
                                if (save) {
                                  location.hash = save;
                                }
                            });
                            this.props.setIsSubmit(false); //关闭缓存
                            /**保存完之后缓存置空 */
                            let leaveData = { ...this.props.leaveData };
                            leaveData[this.props.belonged] = {};
                            this.props.setLeaveData(leaveData);
                            /* */
    
                          } else {
                            Message.error(data.errorMsg);
                          }
                        });
                          
                      }else{//不待审核
                        postService(API_PREFIX + `services/web/system/taskParam/${taskId ? 'update' : 'add'}`, body, timeData => {
                          if (timeData.status === 1) {
                            if (values && values.id.id) {
                              values.id = values.id.id;
                            }
                            if (!values.id) {
                              values.id = state.infoId;
                            }
                            values['publishDate'] = this.props.timePushData;
                            values['taskId'] = timeData.root.object.id;
                            postService(API_PREFIX + url, values, data => {
                              if (data.status === 1) {
                                Message.success(
                                  `保存成功！将于${this.props.timePushData}定时发布`
                                );
                                let id = { id: data.root.id };
        
                                this.setState({ id, showPrompt: false, loading: false }, () => {
                                  if (type === 'submit') {
                                    //history.back();
                                    location.hash = `${linkTo}?id=${this.state.id.id}`;
                                  } else
                                    if (save) {
                                      location.hash = save;
                                    }
                                });
                                this.props.setIsSubmit(false); //关闭缓存
                                /**保存完之后缓存置空 */
                                let leaveData = { ...this.props.leaveData };
                                leaveData[this.props.belonged] = {};
                                this.props.setLeaveData(leaveData);
                                /* */
        
                              } else {
                                Message.error(data.errorMsg);
                              }
                            });
                          } else {
                            Message.error(timeData.errorMsg);
                          }
                          if (tabChange == 'tabChange') {
                            this.setState({ current: currentValue, updateFormWrapper: this.state.updateFormWrapper + 1 });//yelu tab切换保存数据后跳转到下一个tab栏
                          }
                        });
                      }
                  }else{
                    Message.error(data.errorMsg)
                  }
                })
                // postService(API_PREFIX + `services/web/system/taskParam/${taskId ? 'update' : 'add'}`, body, timeData => {
                //   if (timeData.status === 1) {
                //     if (values && values.id.id) {
                //       values.id = values.id.id;
                //     }
                //     if (!values.id) {
                //       values.id = state.infoId;
                //     }
                //     values['publishDate'] = this.props.timePushData;
                //     values['taskId'] = timeData.root.object.id;
                //     postService(API_PREFIX + url, values, data => {
                //       if (data.status === 1) {
                //         Message.success(
                //           `保存成功！将于${this.props.timePushData}定时发布`
                //         );
                //         let id = { id: data.root.id };

                //         this.setState({ id, showPrompt: false, loading: false }, () => {
                //           if (type === 'submit') {
                //             //history.back();
                //             location.hash = `${linkTo}?id=${this.state.id.id}`;
                //           } else
                //             if (save) {
                //               location.hash = save;
                //             }
                //         });
                //         this.props.setIsSubmit(false); //关闭缓存

                //         /**保存完之后缓存置空 */
                //         let leaveData = { ...this.props.leaveData };
                //         leaveData[this.props.belonged] = {};
                //         this.props.setLeaveData(leaveData);
                //         /* */

                //       } else {
                //         Message.error(data.errorMsg);
                //       }
                //     });
                //   } else {
                //     Message.error(timeData.errorMsg);
                //   }
                //   if (tabChange == 'tabChange') {
                //     this.setState({ current: currentValue, updateFormWrapper: this.state.updateFormWrapper + 1 });//yelu tab切换保存数据后跳转到下一个tab栏
                //   }
                // });
              } else if (values['isTimePublish'] && props.type === 'event') {
                values['categoryRelevances'] = this.state.categoryRelevances;
                let eventId = this.state.eventUpdataId || state.id.id || props.steps[0].data.id;
                values.id = eventId;
                // if( values['categoryRelevances'].length==0 && this.state.categoryRelevances==0){
                //     values['categoryRelevances'] =this.state.checkData.column;
                // }
                values.publishDate = this.props.timePushData;
                if (this.props.style == 'edit' && this.props.type == 'event') {
                  // values.id = this.state.eventUpdataId;
                  if (values['categoryRelevances'].length == 0 && this.state.categoryRelevances == 0) {
                    values['categoryRelevances'] = this.state.checkData.column;
                  }
                }

                let queryValue = [eventId];
                body.queryValue = JSON.stringify(queryValue);
                body.runTime = this.props.timePushData;
                if (taskId) {
                  body.id = taskId;
                }

                postService(API_PREFIX + 'services/web/auth/authdata/addAuthDataToRedis', { dataId: eventId, dataType: 2 }, data => {
                  if (data.status === 1) {
                    postService(API_PREFIX + `services/web/system/taskParam/${taskId ? 'update' : 'add'}`, body, timeData => {
                      if (timeData.status === 1) {
                        values.taskId = timeData.root.object.id;
                        postService(API_PREFIX + url, values, data => {
                          if (data.status === 1) {

                            if (isEditid && isEditid == 1) {
                              Message.success(
                                `保存成功！`
                              );
                            } else {
                              Message.success(
                                `保存成功！将于${this.props.timePushData}定时发布`
                              );
                            }

                            let id = { id: data.root.object.id || this.state.id.id };
                            this.setState({ id, showPrompt: false, loading: false }, () => {
                              if (type === 'submit') {
                                //history.back();
                                location.hash = `${linkTo}?id=${this.state.id.id}`;
                              } else
                                if (save) {
                                  location.hash = save;
                                }
                            });
                            this.props.setIsSubmit(false); //关闭缓存
                            /**保存完之后缓存置空 */
                            let leaveData = { ...this.props.leaveData };
                            leaveData[this.props.belonged] = {};
                            this.props.setLeaveData(leaveData);
                            /* */

                          } else {
                            Message.error(data.errorMsg);
                          }
                        });
                      } else {
                        Message.error(timeData.errorMsg);
                      }
                    });
                  }
                });
              }
              else {
                if (this.props.type != 'information') {
                  postService(
                    API_PREFIX +
                    `services/automation/job/${taskId ? 'update' : 'add'}`,
                    body,
                    timeData => {
                      if (timeData.retCode === 1) {
                        let id = timeData.root.id;
                        window.sessionStorage.setItem('taskId', id);
                        getService(
                          API_PREFIX +
                          `services/${this.props.type === 'information' ? 'news/artical/' : 'activity/activity/'}addTaskId/${
                          this.state.id.id
                          }/${id}`,
                          bindData => {
                            if (bindData.retCode !== 1) {
                              Message.error(bindData.errorMsg);
                            }
                          }
                        );
                        postService(API_PREFIX + url, values, data => {
                          if (data.retCode === 1) {
                            Message.success(
                              `保存成功！将于${this.props.timePushData}定时发布`
                            );
                            let id = { id: data.root.id };
                            this.setState({ id, showPrompt: false, loading: false }, () => {
                              if (type === 'submit') {
                                //history.back();
                                location.hash = `${linkTo}?id=${this.state.id.id}`;
                              } else
                                if (save) {
                                  location.hash = save;
                                }
                            });
                            this.props.setIsSubmit(false); //关闭缓存

                            /**保存完之后缓存置空 */
                            let leaveData = { ...this.props.leaveData };
                            leaveData[this.props.belonged] = {};
                            this.props.setLeaveData(leaveData);
                            /* */

                          } else {
                            Message.error(data.errorMsg);
                          }
                        });
                      } else {
                        Message.error(timeData.errorMsg);
                      }
                      if (tabChange == 'tabChange') {
                        this.setState({ current: currentValue, updateFormWrapper: this.state.updateFormWrapper + 1 });//yelu tab切换保存数据后跳转到下一个tab栏
                      }
                    }
                  );
                }
                if (!values.id) {
                  values.id = state.infoId;
                }
                postService(API_PREFIX + url, values, data => {
                  if (data.status === 1) {
                    Message.success(
                      `保存成功！`
                    );

                    let id = { id: data.root.id };
                    this.setState({ id, showPrompt: false, loading: false }, () => {
                      if (type === 'submit') {
                        //history.back();
                        location.hash = `${linkTo}?id=${this.state.id.id}`;
                      } else
                        if (save) {
                          location.hash = save;
                        }
                    });
                    this.props.setIsSubmit(false); //关闭缓存
                    /**保存完之后缓存置空 */
                    let leaveData = { ...this.props.leaveData };
                    leaveData[this.props.belonged] = {};
                    this.props.setLeaveData(leaveData);
                    /* */

                  } else {
                    Message.error(data.errorMsg);
                  }
                  if (tabChange == 'tabChange') {
                    this.setState({ current: currentValue, updateFormWrapper: this.state.updateFormWrapper + 1 });//yelu tab切换保存数据后跳转到下一个tab栏
                  }
                });
              }

            }
            // }
            else {
              if (typeof (values.iscomment) === "string") {
                if (values.iscomment === 'false') {
                  values.iscomment = false;
                } else {
                  values.iscomment = true;
                }
              }
              if (typeof (values.ishomepage) === "string") {
                if (values.ishomepage === 'false') {
                  values.ishomepage = false;
                } else {
                  values.ishomepage = true;
                }
              }
              if (typeof (values.isinnershare) === "string") {
                if (values.isinnershare === 'false') {
                  values.isinnershare = false;
                } else {
                  values.isinnershare = true;
                }
              }
              if (typeof (values.isnonamecomment) === "string") {
                if (values.isnonamecomment === 'false') {
                  values.isnonamecomment = false;
                } else {
                  values.isnonamecomment = true;
                }
              }
              if (typeof (values.ispush) === "string") {
                if (values.ispush === 'false') {
                  values.ispush = false;
                } else {
                  values.ispush = true;
                }
              }
              if (typeof (values.isshare) === "string") {
                if (values.isshare === 'false') {
                  values.isshare = false;
                } else {
                  values.isshare = true;
                }
              }
              if (typeof (values.isTimePublish) === "string") {
                if (values.isTimePublish === 'false') {
                  values.isTimePublish = false;
                } else {
                  values.isTimePublish = true;
                }
              }
              if (props.type === 'event') {
                values['categoryRelevances'] = this.state.categoryRelevances;
                if (this.state.upperLimit != '') {
                  values['upperLimit'] = this.state.upperLimit;
                }
                console.log("values555555", values, this.state);

                if (this.props.style == 'edit' && this.props.type == 'event') {
                  values.id = this.state.eventUpdataId;
                  if (values['categoryRelevances'].length == 0 && this.state.categoryRelevances == 0) {
                    values['categoryRelevances'] = this.state.checkData.column;
                  }

                }
                console.log("values66666", values, this.state);

                if (Array.isArray(values.titleImage)) {
                  values.titleImage = values.titleImage[0];
                }
                if (values && (values.categoryRelevances.length == 0 || values.categoryRelevances == undefined) && this.state.id == undefined) {
                  values.id = GetQueryString(location.hash, ['id']).id;
                  let setApply = JSON.parse(window.sessionStorage.getItem("setApply"));
                  let upperLimit = JSON.parse(window.sessionStorage.getItem("upperLimit"));
                  console.log("upperLimit=====", upperLimit);
                  if (upperLimit && upperLimit != null) {
                    values.upperLimit = upperLimit;
                  }
                  values.categoryRelevances = setApply.categoryRelevances;
                  values.titleImage = setApply.titleImage;
                  console.log("values22222", values, setApply);
                  window.sessionStorage.removeItem("upperLimit");
                }
              }

              if (this.props.style == 'edit' && this.props.type == 'information') {
                values.id = this.state.id.id;
              }
              if (this.props.style == 'edit' && this.props.type == 'event') {
                values.id = this.state.eventUpdataId;
              }
              let infoIds = values.id;

              // if (values.id&&values.id.id) {
              //   values.id = values.id.id;
              // }else if(values.id&&!values.id.id){
              //   values.id = values.id;
              // }
              if (taskId && !values['isTimePublish']) {
                postService(API_PREFIX + `services/web/system/taskParam/delete/${taskId}`, {}, data => {
                  if (data.status === 1) {
                    console.log('删除成功');
                  }
                });
              }
              values['taskId'] = '';
              postService(API_PREFIX + url, values, data => {
                console.log("API_PREFIX + url", API_PREFIX + url, values, this.state);
                if (data.status === 1) {
                  if (!online) {
                    Message.success('保存成功!');
                    this.setState({ loading: false });
                    this.setState({ numberOne: '1' });
                  }
                  ////let id = { id: data.root.id };
                  let id = { id: data.root.object.id || values.id || this.state.id.id };
                  // let id = ''
                  // if(data.root.object.id){
                  //    id = { id: data.root.id };
                  // }
                  // else{
                  //    id = { id: this.state.id.id.id };
                  // }
                  this.setState({ id, showPrompt: false }, () => {
                    if (type === 'submit') {
                      //history.back();
                      let setId = "";
                      if (this.state.id.id == undefined && values.id) {
                        setId = values.id;
                      } else {
                        setId = this.state.id.id;
                      }
                      location.hash = `${linkTo}?id=${setId}`;
                    } else if (online) {
                      if (props.style === 'add' && (props.belonged === 'article' || props.belonged === 'video')) {
                        let params = { ...this.state.id, categoryIdList: this.state.categoryIdList };
                        postService(API_PREFIX + `${online}`, params,
                          data => {
                            if (data.status === 1) {
                              if (save) {
                                if(data.root.object){
                                  Message.success('该数据发布到待审核列表');
                                }else{
                                  Message.success('发布成功');
                                }
                                location.hash = save;
                              }
                            }else{
                                Message.error(data.errorMsg);
                            }
                          }
                        );
                      } else {
                        getService(
                          API_PREFIX + `${online}/${this.state.id.id}`,
                          data => {
                            if (data.status === 1) {
                              if (save) {
                                Message.success('保存并发布成功!');
                                location.hash = save;
                              }
                            }else{
                                Message.error(data.errorMsg);
                            }
                          }
                        );
                      }

                    } else if (save) {
                      location.hash = save;
                    }
                  });
                  this.props.setIsSubmit(false); //关闭缓存

                  /**保存完之后缓存置空 */
                  let leaveData = { ...this.props.leaveData };
                  leaveData[this.props.belonged] = {};
                  this.props.setLeaveData(leaveData);
                  /* */
                } else {
                  Message.error(data.errorMsg);
                }
                if (tabChange == 'tabChange') {
                  this.setState({ current: currentValue, updateFormWrapper: this.state.updateFormWrapper + 1 });//yelu tab切换保存数据后跳转到下一个tab栏
                }
              });
            }
          }
        }
      });
    }, 0);
  };
  tabChange = value => {
    let that = this;
    if (this.props.style == 'edit' && !this.state.isSave) { // yelu 切换tab提示是否保存当前页面已修改的信息
      confirm({
        title: '是否保存',
        content: '即将离开本页面，是否保存当前页面已修改的数据？',
        onOk() {
          that.handleSubmit(null, null, null, null, null, null, null, that.state.current, 'tabChange', value);
          //   that.setState({ current: value, updateFormWrapper: that.state.updateFormWrapper+1});
        },
        onCancel() {
          that.setState({ current: value, updateFormWrapper: that.state.updateFormWrapper + 1 });
        },
      });
    } else {
      that.setState({ current: value, updateFormWrapper: that.state.updateFormWrapper + 1 });
    }
    this.setState({ isSave: false });
    // this.setState({ current: value, updateFormWrapper: this.state.updateFormWrapper+1});
  };
  //杂志点击返回弹框xwx/2018/12/11
  showConfirm = () => {
    confirm({
      title: '离开提醒',
      content: '点击"确定"，将跳转至上一页，当前数据不会保存，点击"取消"，则停留在当前页',
      onOk() {
        history.go(-1);
      },
      onCancel() {
      },
    });
  }
  componentWillUnmount() {
    //this.handleSubmit();
    if (this.props.type == 'event') {
      sessionStorage.removeItem('eventAndInfoKey'); //yelu 移除session中保存的权限设置tab对应的key值
    }
    this.props.setEventTwoData({})
    let isSubmit = this.props.isSubmit;
    if (isSubmit === 'ok') {
      // this.handleSubmit(null, null, null, null, null, 'leaveAndSave');
      let fieldsValue = this.props.form.getFieldsValue();
      let leaveData = this.props.leaveData;
      // leaveData[this.props.belonged] = { ...this.state.checkData, ...fieldsValue };
      leaveData[this.props.belonged] = {};           //20181031  编辑成功之后，清空缓存
      this.props.setLeaveData(leaveData);
    } else if (isSubmit === 'cancel') {
      let leaveData = { ...this.props.leaveData };
      leaveData[this.props.belonged] = {};
      this.props.setLeaveData(leaveData);
    }
    this.props.setEventData({});
    this.props.setTimePushData('');
  }
  merchantList = (value, code, selectOption, MerchantArr) => {
    //code 为1时删除 ；code 为2时 添加
    let arr = this.state.merchantList;
    if (code == 1) {
      let key = value.option[0].key;
      let array = [];
      arr.forEach(v => {
        if (v != key) {
          array.push(v);
        }
      });
      this.setState({ merchantList: array });
      // this.props.merchants = array
    }
    if (code == 2) {
      let select = [];//取出对应的option及value
      MerchantArr && MerchantArr.map((item, index) => {
        selectOption.map((s) => {
          if (s.key == item.key) {
            select.push(...s.option);
          }
        });
      });
      let ARR = [];
      if (select) {
        select.map(v => {
          ARR.push(v.key);
        });
      }

      // arr.push(value[0].id)
      this.setState({ merchantList: ARR });
      // this.props.merchants = arr
    }


  }
  //所有模块的编辑数据回旋 2018/12/17
  componentDidUpdate() {
    console.log(this.props)
    if (this.state.numberOne == '1') {
      alldata = '';
      this.setState({ numberOne: '2' });
      let datatype = this.props.datatype;
      if (this.props.style == 'edit' && (datatype == 'applyedit' || datatype == 'examination' || datatype == 'orderList' || datatype == 'votelist' || datatype == "questionnaire")) {
        getService(API_PREFIX + this.props.getUrl, data => {
          if (data.status == 1) {
            alldata = data.root.object ? data.root.object : Array.isArray(data.root.list) ? data.root.list[0] : data.root.list;
            if (alldata.name) {
              alldata['title1'] = alldata.name;
            }
          }
        });
      }
    }
  }
  getpicUrl = (e) => {
    if (e.length > 0) {
      this.setState({ picUrl: e, daleteFlag: true });
    }

  }
  editpicUrl = (e) => {
    if (e.length > 0) {
      this.setState({ picUrltwo: e, editFlag: true });
    }

  }
  DetailBack = () => {
    history.back();
    // if (this.props.articleDetail == "articleDetail") {
    //   location.hash = `/InformationManagement/Article?tabsVale=${sessionStorage.getItem('TabsKey')}`;
    // } else if (this.props.videoDetail == "videoDetail") {
    //   location.hash = `/InformationManagement/Video?tabsVale=${sessionStorage.getItem('videoTabsKey')}`;
    // } else {
    //   history.back();
    // }
  };
  onChangeOne = e => {
    this.setState({ valueOne: e });
  };
  onChangeTwo = e => {
    this.setState({ valueTwo: e });
  };
  getCreateOrgName = e => {
    this.setState({ orgName: e });
  }
  getPickupAddressList = (value) => {
    this.setState({pickupAddressList: value})
  }
  render() {
    const { current, valueJoin, valueView, valueCompanyJoin, valueCompanyView } = this.state;
    const { flowData, leaveData } = this.props;
    const disabled = this.props.style === 'detail';
    const disappear = this.props.style === 'add';
    let steps = cloneObj(this.props.steps);
    alldata = this.props.style === 'edit' ? alldata : '';
    if ((this.props.datatype == 'article' || this.props.datatype == 'video') && steps[0].data && steps[0].data.taskDate) {
      if (!this.props.timePushData) {
        this.props.setTimePushData(steps[0].data.taskDate);
      }
    }

   
    console.log("22222",flowData);
    steps.map((item, index) => {
      if (item.content) {
        //表单页
        item.content = (
          <div key={index}>
            <FormWrapper
              merchantList={this.merchantList}
              key={this.state.updateFormWrapper}
              {...this.props}
              getShoppingId={this.getShoppingId}
              flowData={flowData}
              content={item.content}
              disabled={disabled}
              disappear={disappear}
              // initialValue={item.data ? this.dealGetData(item.data) : null}
              initialValue={alldata ? this.dealGetData(alldata) : item.data ? this.dealGetData(item.data) : null}
              // defaultValue={item.data}
              getpicUrl={this.getpicUrl}
              editpicUrl={this.editpicUrl}
              getCreateOrgName={this.getCreateOrgName}
              infoType={this.state.infoType}
              setInfoType={this.setInfoType}
              getPickupAddressList={this.getPickupAddressList}
            />
          </div>
        );
      } else {
        // let examination;
        // if(this.props.style === 'edit' && this.props.belonged==="examination"){
        //   examination = this.props.examination;
        // }else if(this.props.style === 'add' && this.props.belonged==="examination"){
        //   examination = this.state.isExamination;
        // }else if(this.props.style === 'detail' && this.props.belonged==="examination"){
        //   examination = this.props.examination;
        // }
        //树形页
        // if(this.props.type === 'event' && this.props.belonged==="examination"){
        //   //活动
        //   item.content = <div key={index}>
        //     <span style={{ }} className="warnning">
        //         参加权限设置(若不勾选则默认为全部用户可参加)
        //     </span>
        //     <MultipleTree add={this.props.style} examination={examination?examination:null} type="join" disabled={disabled} flowData={flowData} leaveData={leaveData[this.props.belonged]} initialValue={item.data ? this.dealGetData(item.data) : null} />
        //     <span style={{  }} className="warnning">
        //         查看权限设置(若不勾选则默认为全部用户可查看)
        //     </span>
        //     <MultipleTree add={this.props.style} examination={examination?examination:null}  type="view" disabled={disabled} flowData={flowData} leaveData={leaveData[this.props.belonged]} initialValue={item.data ? this.dealGetData(item.data) : null} />
        //     <span style={{ marginLeft: '31%' }}>
        //         其他权限设置
        //     </span>
        //     <div style={{ paddingLeft: '13%' }}>
        //       <FormWrapper key={this.state.updateFormWrapper} flowData={flowData}  disabled={disabled} disappear={disappear} initialValue={item.data ? this.dealGetData(item.data) : null} {...this.props} content={[{ key: 'isAlowFamily', label: '是否允许家人参加', type: 'radioButton', option: option1, required: true }, { key: 'actMinCredits', label: '参与该活动的最低经验值', type: 'inputNumber',required:false }, { key: 'actMinTreasure', label: '参与该活动的最低积分', type: 'inputNumber',required:false }, { key: 'upperLimit', label: '参与人数上限', type: 'inputNumber',required:false }]} />
        //     </div>
        //   </div>;
        // } else
        if (this.props.type === 'event') {
          //活动
          item.content = <div key={index}>
            
            {/* 查看权限设置(若不勾选则默认为全部用户可查看) */}
            <Row>
              <Col span={19}>
                <Row>
                  <Col><span style={{ color: 'red', marginLeft: '50px', marginTop: '30px' }} className="warnning">选择对本企业的查看范围(默认为全部用户可查看):</span></Col>
                </Row>
                <Row>
                  <Radio.Group onChange={this.onChangeView} value={valueView} disabled={disabled}>
                    <Radio style={{ display: 'block', height: '20px', lineHeight: '20px', marginLeft: '30px' }} value={'1'}>
                      全部
              </Radio>
                    <Radio style={{ display: 'block', height: '20px', lineHeight: '20px', marginLeft: '30px' }} value={'2'}>
                      选择部分
              </Radio>
                  </Radio.Group>
                </Row>
                {/* {valueView !== '1' ? ( */}
                <div style={{ display: valueView !== '1' ? 'block' : 'none' }}>
                  <MultipleTree add={this.props.style} type="view" disabled={disabled} flowData={flowData} leaveData={leaveData[this.props.belonged]} initialValue={item.data ? this.dealGetData(item.data) : null} />
                </div>
                {/* ) : null} */}
              </Col>
              <Col span={5}>
                <Row>
                  <Col><span style={{ color: 'red' }} className="warnning">选择对下级企业的查看范围(默认为无):</span></Col>
                </Row>
                <Row>
                  <Radio.Group onChange={this.onChangeCompanyView} value={valueCompanyView} disabled={disabled}>
                    <Radio style={{ display: 'block', height: '20px', lineHeight: '20px', marginLeft: '30px' }} value={'1'}> 无 </Radio>
                    <Radio style={{ display: 'block', height: '20px', lineHeight: '20px', marginLeft: '30px' }} value={'2'}>全部</Radio>
                    <Radio style={{ display: 'block', height: '20px', lineHeight: '20px', marginLeft: '30px' }} value={'3'}>部分用户</Radio>
                  </Radio.Group>
                </Row>
                <div style={{ display: valueCompanyView == '3' ? 'block' : 'none' }}>  <CompanyTree add={this.props.style} type="view" disabled={disabled} flowData={flowData} leaveData={leaveData[this.props.belonged]} initialValue={item.data ? this.dealGetData(item.data) : null} /></div>
              </Col>
            </Row>
            {/* 参加权限设置 */}
            <Row>
              <Col span={19}>
                <Row>
                  <Col><span style={{ color: 'red', marginLeft: '50px' }} className="warnning">选择对本企业的发布范围(默认为全部用户可参加):</span></Col>
                </Row>
                <Row>
                  <Radio.Group onChange={this.onChangeJoin} value={valueJoin} disabled={disabled}>
                    <Radio style={{ display: 'block', height: '20px', lineHeight: '20px', marginLeft: '30px' }} value={'1'} >
                      全部
              </Radio>
                    <Radio style={{ display: 'block', height: '20px', lineHeight: '20px', marginLeft: '30px' }} value={'2'}>
                      选择部分
              </Radio>
                  </Radio.Group>
                </Row>
                {/* {valueJoin !== '1' ? ( */}

                <div style={{ display: valueJoin !== '1' ? 'block' : 'none' }}>
                  {/* qwqwqwqwqwqw{disabled} */}
                  <MultipleTree add={this.props.style} type="join" disabled={disabled} flowData={flowData} leaveData={leaveData[this.props.belonged]} initialValue={item.data ? this.dealGetData(item.data) : null} />
                </div>
                {/* ) : null} */}
              </Col>
              <Col span={5}>
                {/* {valueCompanyJoin} */}
                <Row>
                  <Col><span style={{ color: 'red' }} className="warnning">选择对下级企业的发布范围(默认为无):</span></Col>
                </Row>
                <Row>
                  <Radio.Group onChange={this.onChangeCompanyJoin} value={valueCompanyJoin} disabled={disabled}>
                    <Radio style={{ display: 'block', height: '20px', lineHeight: '20px', marginLeft: '30px' }} value={'1'}> 无 </Radio>
                    <Radio style={{ display: 'block', height: '20px', lineHeight: '20px', marginLeft: '30px' }} value={'2'}>全部</Radio>
                    <Radio style={{ display: 'block', height: '20px', lineHeight: '20px', marginLeft: '30px' }} value={'3'}>部分用户</Radio>
                  </Radio.Group>
                </Row>
                <div style={{ display: valueCompanyJoin == '3' ? 'block' : 'none' }}><CompanyTree add={this.props.style} type="join" disabled={disabled} flowData={flowData} leaveData={leaveData[this.props.belonged]} initialValue={item.data ? this.dealGetData(item.data) : null} /></div>
              </Col>
            </Row>


            <span style={{ marginLeft: '31%' }}>
              其他权限设置
            </span>
            <div>
              <FormWrapper
                key={this.state.updateFormWrapper}
                flowData={flowData}
                disabled={disabled}
                disappear={disappear}
                initialValue={alldata ? this.dealGetData(alldata) : item.data ? this.dealGetData(item.data) : null}
                // initialValue={item.data ? this.dealGetData(item.data) : null} 
                {...this.props}
                content={
                  [
                    // { key: 'isFamilyJoin', label: '是否允许家人参加', type: 'radioButton', option: option1, required: true },
                    { key: 'actminCredits', label: '参与该活动的最低经验值', type: 'inputNumber', required: false },
                    { key: 'actminTreasure', label: '参与该活动的最低积分', type: 'inputNumber', required: false },
                    { key: 'upperLimit', label: '参与人数上限', type: 'inputNumber', required: false },
                  ]} />
            </div>


          </div>;

          // item.content = <div key={index}>
          //   {/* <span style={{marginLeft:'20px'}} className="warnning">
          //       参加权限设置(若不勾选则默认为全部用户可参加)
          //   </span> */}


          //   <MultipleTree add={this.props.style} type="join" disabled={disabled} flowData={flowData} leaveData={leaveData[this.props.belonged]} initialValue={item.data ? this.dealGetData(item.data) : null} />
          //   <span style={{marginLeft:'20px'}} className="warnning">
          //       查看权限设置(若不勾选则默认为全部用户可查看)
          //   </span>
          //   <MultipleTree add={this.props.style}  type="view" disabled={disabled} flowData={flowData} leaveData={leaveData[this.props.belonged]} initialValue={item.data ? this.dealGetData(item.data) : null} />
          //   <span style={{ marginLeft: '31%' }}>
          //       其他权限设置
          //   </span>
          //   <div style={{ paddingLeft: '13%' }}>
          //     <FormWrapper key={this.state.updateFormWrapper} flowData={flowData}  disabled={disabled} disappear={disappear} initialValue={item.data ? this.dealGetData(item.data) : null} {...this.props} content={[{ key: 'isFamilyJoin', label: '是否允许家人参加', type: 'radioButton', option: option1, required: true }, { key: 'actminCredits', label: '参与该活动的最低经验值', type: 'inputNumber',required:false }, { key: 'actminTreasure', label: '参与该活动的最低积分', type: 'inputNumber',required:false }, { key: 'upperLimit', label: '参与人数上限', type: 'inputNumber',required:false }]} />
          //   </div>
          // </div>;
        } else if (this.props.type === 'information') {
          //资讯
          item.content = (
            <div key={index}>
              <InfoTree
                type="join"
                disabled={disabled}
                flowData={flowData}
                leaveData={leaveData}
                add={this.props.style}
                onChangeOne={this.onChangeOne}
                onChangeTwo={this.onChangeTwo}
                belonged={this.props.belonged}
                valueOne={this.state.valueOne}
                valueTwo={this.state.valueTwo}
                initialValue={item.data ? this.dealInfoData(item.data) : null}
              />
            </div>
          );
        }
      }
    });

    return (
      <Spin spinning={this.state.loading}>
        <div id="EventAdd">
          {this.props.style === 'add' ? (
            <div>
              <Steps current={current}>
                {steps
                  .filter(item => !item.end)
                  .map(item => <Step key={item.title} title={item.title} />)}
              </Steps>
              <Row>
                <Form onSubmit={this.handleSubmit}>
                  {steps.map((item, index) => {
                    if (current === index) {
                      return item.content;
                    }
                  })}
                  {this.state.current < steps.length - 2 && (
                    <Row className="center ButtonCenter" style={{}}>
                      {/* <Button className="resetBtn" onClick={() => this.props.history.goBack()}>
                      返回
                    </Button> */}
                      {//杂志编辑增加一个离开提醒xwx/2018/12/11
                        this.props.dataType === "informationmagazineAdd" ?
                          <Button className="resetBtn" style={{ height: '27px', lineHeight: '23px' }} onClick={this.showConfirm} >
                            返回
                          </Button>
                          :
                          <Button className="resetBtn" style={{ height: '27px', lineHeight: '23px' }} >
                            <Link to={this.props.save}>
                              返回
                    </Link>
                          </Button>
                      }

                      {/* <Button
                      className="resetBtn"
                      style={{
                        display:
                          this.props.type === 'event' ? 'inline-block' : 'none',
                      }}
                    >
                      预览
                    </Button> */}
                      <Button className="queryBtn" onClick={this.handleSubmit}>
                        保存
                    </Button>
                      <Button
                        className="queryBtn"
                        onClick={e => this.handleSubmit(e, 'next')}
                      >
                        保存并下一步
                    </Button>
                    </Row>
                  )}
                  {this.state.current === steps.length - 2 && (
                    <Row style={{}} className="center ButtonCenter">
                      <Button className="resetBtn" style={{ height: '27px', lineHeight: '22px' }} onClick={() => { this.prev(this.props.partyReturn); }}>
                        {/**
                      * 朱劲松   2018-12-10 新增
                      * 修改 ‘党建园地-党建学习管理-新建党建学习，将页面*上一步*功能取消，新增取消按钮’  BUG 2099
                      */}
                        {this.props.datatype === 'partylearn' || this.props.datatype === 'LearnManagation' ? '取消' : '上一步'}
                      </Button>
                      {
                        steps[steps.length - 1].end ?
                          <Button className="queryBtn" onClick={e => this.handleSubmit(e, '', '', this.props.save)}>
                            保存并返回
                        </Button> :
                          <Button className="queryBtn" onClick={this.handleSubmit}>
                            保存
                        </Button>
                      }
                      <Button
                        className="queryBtn"
                        onClick={e => this.handleSubmit(e, 'next')}
                        style={{
                          display: !steps[steps.length - 1].end
                            ? 'inline-block'
                            : 'none',
                        }}
                      >
                        保存并下一步
                    </Button>
                    </Row>
                  )}
                  {this.state.current > steps.length - 2 && (
                    <Row className="center ButtonCenter">
                      <Button className="resetBtn" onClick={this.prev}>
                        上一步
                    </Button>
                      {
                        /**
                         * 朱劲松 2018-12-10 修改 增加判断
                         * 修改 ‘党建学习管理，设置定时和接收人之后，点击保存，建议新增返回按钮’ BUG 2093
                         */
                        this.props.datatype === 'partylearn' ?
                          <Button
                            className="queryBtn"
                            onClick={e => this.handleSubmit(e, '', null, this.props.save)}
                          >
                            保存并返回
                        </Button>
                          :
                          <Button
                            className="queryBtn"
                            onClick={e =>
                              this.handleSubmit(e, '', null, this.props.save, null, null, 'baocun')
                            }
                          >
                            保存并返回
                        </Button>
                      }
                      {this.props.type === 'event' ? (
                        <Button
                          className="queryBtn"
                          onClick={e =>
                            this.handleSubmit(
                              e,
                              'submit',
                              this.props.linkTo,
                              this.props.save
                            )
                          }
                        >
                          {this.props.submitText}
                        </Button>
                      ) : this.props.datatype === 'article' || this.props.datatype === 'video' ? (
                        <Button
                          className="queryBtn"
                          onClick={e =>
                            this.handleSubmit(e, '', null, this.props.save, this.props.steps[this.state.current].onlineUrl)
                          }
                        >
                          保存并发布
                    </Button>
                      ) : (
                            <Button
                              className="queryBtn"
                              onClick={e =>
                                this.handleSubmit(
                                  e,
                                  '',
                                  null,
                                  this.props.save,
                                  this.props.steps[this.state.current].onlineUrl
                                )
                              }
                            >
                              保存并发布
                      </Button>
                          )}
                    </Row>
                  )}
                </Form>
              </Row>
            </div>
          ) : (
              //编辑和详情
              <div>
                <Tabs
                  activeKey={current + ''}
                  animated={false}
                  onChange={this.tabChange}
                >
                  {steps.map((item, index) => {
                    if (item.end) {
                      return;
                    }
                    return (
                      <TabPane tab={item.title} key={index}>
                        {item.content}
                        {this.props.style === 'edit' ? (
                          <Row className="center EditButtonCenter">
                            <Button className="resetBtn" onClick={() => location.hash = this.props.save}>返回</Button>
                            {/* <Button
                          className="queryBtn"
                          style={{
                            display:
                              this.props.type === 'event'
                                ? 'inline-block'
                                : 'none',
                          }}
                        >
                          预览
                        </Button> */}
                            <Button className="queryBtn" onClick={e => this.handleSubmit(e, this.props.saveKeep ? this.props.saveKeep : '')}>保存</Button>
                            <Button
                              className="queryBtn"
                              onClick={e =>
                                this.handleSubmit(e, this.props.saveReturn ? this.props.saveReturn : '', '', this.props.save)
                              }
                            >
                              保存并返回
                        </Button>
                          </Row>
                        ) : (
                            <Row>
                              <Col span={24} style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <Button className="resetBtn" onClick={this.DetailBack}>返回</Button>
                              </Col>
                            </Row>
                          )}
                      </TabPane>
                    );
                  })}
                </Tabs>
              </div>
            )}
          {/* <Prompt
          Message="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点击&quot;确定&quot;,将保存当前页面数据，跳转到目标页面，点击&quot;取消&quot;，则不会保存当前数据。"
          when={this.state.showPrompt}
        /> */}
          <div id="EventAddModal" />
        </div>
      </Spin>
    );
  }
}
const option1 = [{ value: true, label: '是' }, { value: false, label: '否' }];