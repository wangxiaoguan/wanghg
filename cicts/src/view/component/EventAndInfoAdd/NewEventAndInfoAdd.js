import React, { Component } from 'react';
import { Row, Form, Steps, Button, Tabs, Message, Modal,Col } from 'antd';
import { getService, postService, GetQueryString} from '../../content/myFetch';
import { setEventData, setLeaveData, setIsSubmit} from '../../../redux-root/action/eventAndInfoData/eventAndInfoData';
import { setTimePushData } from '../../../redux-root/action/eventAndInfoData/timePushData';
import API_PREFIX,{ masterUrl,API_CHOOSE_SERVICE} from'../../content/apiprefix';
import MultipleTree from './MultipleTree';
import InfoTree from './InfoTree'
import FormWrapper from './FormWrapper.js';
import { Prompt } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { cloneObj} from '../tools';
import moment from 'moment';
import './addStyle.less';
const Step = Steps.Step;
const TabPane = Tabs.TabPane;
@Form.create()
@connect(
  state => ({
    AllTreeData: state.tree.treeCheckData,
    selectTreeData: state.tree.treeSelectData.column,
    uploadData: state.uploadPicture.uploadPictureData,
    editorData: state.editor.editorData,
    flowData: state.flowData.flowData,
    timePushData: state.flowData.timePushData,
    leaveModal: state.modal.leaveModal,
    leaveData: state.flowData.leaveData,
    isSubmit:state.flowData.isSubmit,
  }), 
  dispatch => ({
    setEventData: n => dispatch(setEventData(n)),
    setTimePushData: n => dispatch(setTimePushData(n)),
    setLeaveData: n => dispatch(setLeaveData(n)),
    setIsSubmit: n => dispatch(setIsSubmit(n)),
  })
)
export default class EventAdd extends Component { 
  constructor(props) {
    super(props);
    this.state = {
      current: parseInt(GetQueryString(location.hash, ['step']).step) || 0,
      treeData: [],
      checkData: {},
      id: this.props.id, //编辑时的唯一标识
      shoppingId: [],
      name:'',
      titleImage:'',
      categoryId:'',
      showPrompt:true,
      dpRootId:this.props.dpRootId,
      partyRootId:this.props.partyRootId,
      updateFormWrapper:0,
      idCord: this.props.id?this.props.id.id:null,// 朱劲松 BUG 2587
      idAdd: null, //yelu 添加 新建不停的点保存会新建很多的问题
      infoId:''
    };
  }
  componentDidMount() {
    console.log('1111')
    if(this.props.remindListType=='ServiceRemindListId'){
      sessionStorage.setItem("ServiceRemindListId",'')
    }
    if(this.props.belongedType === 'General'||this.props.belongedType==='unionLearn'){
      this.setId()
    }
    if(this.props.belongedType==='partyLearn'){
      let id = GetQueryString(location.hash, ['Id']).Id
      console.log(id)
      this.setState({infoId:id});
    }
  }
  setId = () => {
    let id = window.location.hash.split('=')[1];
    this.setState({infoId:id});

  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.AllTreeData !== prevState.AllTreeData) {
      let checkData = { ...prevState.checkData };
      checkData = { ...checkData, ...nextProps.AllTreeData };
      return { checkData, AllTreeData: nextProps.AllTreeData };
    }
    if (nextProps.flowData !== prevState.flowData) {
      return { flowData: nextProps.flowData };
    }
    return null;
  }
  next = (values,id) => {
    
    this.props.setEventData(values); //保存上一页内容
    const current = this.state.current + 1;
    /**
     * 朱劲松 2018-12-11
     * 修改 ‘事项提醒--编辑--修改提交按钮为 保存并下一步 ’ 新增判断
     */
    if(location.hash.indexOf('?newsId=')>-1){
      if (location.hash.indexOf('&step')>-1) {
        location.hash = location.hash.replace(/\&step=[0-2]/,`&step=${current}&id=${id}`);
      }else{
        location.hash += `&step=${current}&id=${id}`;
      }
    }else{
      if (location.hash.indexOf('?step')>-1) {
        location.hash = location.hash.replace(/\?step=[0-2]/,`?step=${current}&id=${id}`);
      }else{
        location.hash += `?step=${current}&id=${id}`;
      }
    }
    // if (location.hash.indexOf('?step')>-1) {
    //   location.hash = location.hash.replace(/\?step=[0-2]/,`?step=${current}&id=${id}`);
    // }else{
    //   location.hash += `?step=${current}&id=${id}`;
    // }
    this.setState({ current, showPrompt: false });
  };
  prev = () => {
    const current = this.state.current - 1;
    this.setState({ current, showPrompt:false },()=>{
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
          str = str + ',' + item;
        }
      });
    return str;
  };
  getShoppingId = num => {
    this.setState({
      shoppingId: num,
    });
  };
    dealFiles = files =>{
    let data = [];
    files && files.map((item, index) => {
      if (item.type === 4) {
        data.push({ response: { root: {object:[{ filePath: item.url, fileName:item.name }] }}, describe: item.desp,id:item.id});
      } else if (item.type === 1||item.type === 3) {
        data.push({size:item.size,type:item.type, response: { root: {object:[{ filePath: item.url,fileName:item.name }] }}, describe: item.desp, id: item.id });
      } else if (item.type === 2){
        data.push({size:item.size,type:item.type, response: { root: {object:[{ filePath: item.url,fileName:item.name }] }}, describe: item.desp, id: item.id });
      }
    });
    return data;
  }
  dealGetData = data => {
    let newTreePath=[];
    let newPath=[];
    let pic = [];
    let file = [];
    let video=[];
    let videoNew={
      videoUrl:'',
      videoDesp:'',
      videoTime:0,

    };
    let temp = data['newsAttachList'] && data['newsAttachList'];
    
    temp && temp.map((item, index) => {
        if (item.type == '1') {
          //图片

          pic.push({ response: { entity: [{ filePath: item.url, fileName:item.name }] }, describe: item.description,id:item.id});
        } else if (item.type == '3') {

          file.push({ response: { entity: [{ filePath: item.url,fileName:item.name }] }, describe: item.description, id: item.id });
        }
        // else if(item.type == '2'){
        //   video.push({ response: { entity: [{ filePath: item.url, fileName: item.name }] }, describe: item.description, id: item.id });
        //
        // }
        else if(item.type == '2'){
          videoNew.videoUrl=item.url;
          videoNew.videoDesp=item.description;
          videoNew.videoTime=item.timelong;
        }
      });


    // if (this.props.style == 'edit' || this.props.style == 'detail') {
    //   data['categoryIdList'] =data['categoryUnionId'] && data['categoryUnionId'].split(',');
    // } else {
    //   data['categoryIdList'] &&
    //     data['categoryIdList'].map((item, index) => {
    //       item = item + '';
    //     });
    // }

    if (data['treepath'] && (this.props.partyRootId || this.props.dpRootId)){
      newTreePath=data['treepath'].split(',');
      // newPath=data['treepath'].split(',').splice(newTreePath.indexOf(this.props.dpRootId));
      if(data['belongOrgType']=='2'){
        let temp = newTreePath.indexOf(this.props.partyRootId);
        if (temp>0) {
          newTreePath.splice(0, temp-1);
        }
      }else{
        let temp = newTreePath.indexOf(this.props.dpRootId);
        if (temp > 0) {
          newTreePath.splice(0, temp - 1);
        }
      }
      //data['treepath']=newTreePath;
    }
    let titleimage;
    if(API_CHOOSE_SERVICE==1){
      if(data['type']==='2'&&data['layout']===3){
        titleimage=JSON.parse(data['titleimage'])
      }else{
        titleimage=data['titleimage'] &&data['titleimage'].split(',');
      }
    }else{
      titleimage=data['titleimage'] &&
      data['titleimage'].replace(/(\w+),(\w+),/g, '$1,$2;').split(';');
    }

    let result = {
      ...data,
      videoUrl:videoNew.videoUrl,
      videoDesp:videoNew.videoDesp,
      videoTime:videoNew.videoTime,
      newsAttachs:data['newsAttachs']&&this.dealFiles(data['newsAttachs']),
      picUrl: pic,
      fileUrl: file,
      orgId:newTreePath,   //todo
      orgid:newTreePath,
      organizationId:newTreePath,
      applyBegin: data['applyBegin'] && moment(data['applyBegin']),
      applyEnd: data['applyEnd'] && moment(data['applyEnd']),
      beginTime: data['beginTime'] && moment(data['beginTime']),
      endTime: data['endTime'] && moment(data['endTime']),
      remindTime:data['remindTime'] && moment(data['remindTime']),
      titleImage:
        data['titleImage'] &&
        data['titleImage'].replace(/(\w+),(\w+),/g, '$1,$2;').split(';'),
      // titleimage:data['titleimage'] &&data['titleimage'].replace(/(\w+),(\w+),/g, '$1,$2;').split(';'),
      titleimage:titleimage,
      categoryId: data['categoryId'] && data['categoryId'].split(','),
      coverimage:
        data['coverimage'] &&
        data['coverimage'].replace(/(\w+),(\w+),/g, '$1,$2;').split(';'),

      // department: data['department'] && data['department'].split(','),
      // partyid: data['partyid'] ? data['partyid'].split(',') : [],
      // groups: data['groups'] && data['groups'].split(','),
      department: data['departments'] && data['departments'],
      // partyid: data['partys']&&data['partys'],
      groups: data['groups'] && data['groups'],
      // department_join: data['department'] && data['department'].split(','),
      department_join: data['departments'],
      department_view: data['depView'] && data['depView'].split(','),
      partyid_view: data['partyView'] && data['partyView'].split(','),
      partyid_join: data['partys']||[],
      virtualgroupid_join: data['groups'] && data['groups'],
      union_join: data['unions']&&data['unions']||[],
      virtualgroupid_view: data['groupView'] && data['groupView'].split(','),
      treasureProvider:data['treasureProviderTreepath'] && data['treasureProviderTreepath'].split(','),
      remindTime:data['remindTime'] && moment(data['remindTime']),
      // categoryIdList:data['categoryIds']&&data['categoryIds'].split(','),
      // adminid:data['author']&&data['author'],
    };
    if (this.props.type === 'information') {
      result['partyid_join'] = data['partys'];
    } else if (this.props.type === 'event') {
      result['partyid_join'] = data['party'] && data['party'].split(',');
    }
    this.state.name = data['name']&&data['name'];
    this.state.titleImage = data['titleImage'] && data['titleImage'];
    this.state.categoryId = data['categoryId'] && data['categoryId'];
    // if(this.props.belongedType === 'unionLearn'){
    //   result['categoryId'] = data['categoryId']
    // }
    return result;
  };

  handleSubmit = (e, type, linkTo, save, online, leave) => {
    setTimeout(() => {

      const { current } = this.state;
      const { steps } = this.props;
      let url = steps[current].url; //url
      let fieldKeys = [];
      let tempContent = cloneObj(steps);
      tempContent[1].content = [
        { key: 'isAlowFamily' },
        { key: 'actMinCredits' },
        { key: 'actMinTreasure' },
        { key: 'upperLimit' },
      ];
      tempContent[current].content && tempContent[current].content.map(
        item => {
          fieldKeys.push(item.key);
        }
      );
      let ts=window.sessionStorage.getItem('taskIdUpdate')||''
      let updateUrl = steps[current].updateUrl;
      let typeId = steps[current].typeId;
      let taskId = steps[current].data&&steps[current].data['taskId'] ? steps[current].data['taskId'] : ts;
      e && e.preventDefault();
      this.props.form.validateFields(fieldKeys, (err, fieldsValue) => {

        if(fieldsValue.isTimePublish&&!this.props.timePushData){
          Message.error('请选择定时发布时间');
          return;
      }
        if (!err) {


          console.log(fieldsValue)
          console.log(this.state)
          console.log(this.props)


          let values = {};
          if (current == 0) {
            sessionStorage.setItem('remindTime',fieldsValue.remindTime);
          //处理时间格式
            let fileUrl = fieldsValue['fileUrl'] && fieldsValue['fileUrl'].map(
              (item, index) => {
              //附件
                if (item != undefined) {
                  if(Array.isArray(item)){
                    let isMasterUrl = item[0].response.entity[0].filePath.indexOf(masterUrl) > -1;
                  return {
                    url: isMasterUrl ? item[0].response.entity[0].filePath:masterUrl+'' + item[0].response.entity[0].filePath,
                    type: 3,
                    name: item[0].response.entity[0].fileName,
                    size:item[0].size/1024,
                  };
                  }else{
                    let isMasterUrl = item.response.entity[0].filePath.indexOf(masterUrl) > -1;
                    return {
                      url: isMasterUrl ? item.response.entity[0].filePath:masterUrl+'' + item.response.entity[0].filePath,
                      type: 3,
                      name: item.response.entity[0].fileName,
                      size:item.size/1024,
                    };
                  }
                  
                }
              }
            );

            let picUrl = [];
            
            picUrl = fieldsValue['picUrl'] && fieldsValue['picUrl'].map(
              (item, index) => {
              //内容图片
                if (item != undefined) {
                    if(Array.isArray(item)){
                      let isMasterUrl = item[0].response.entity[0].filePath.indexOf(masterUrl) > -1;
                      return {
                        url: isMasterUrl ? item[0].response.entity[0].filePath:masterUrl+  '' + item[0].response.entity[0].filePath,
                        description: item[0].describe,
                        name: item[0].response.entity[0].fileName,
                        type: 1,
                      };
                    }else{
                      let isMasterUrl = item.response.entity[0].filePath.indexOf(masterUrl) > -1;
                      return {
                        url: isMasterUrl ? item.response.entity[0].filePath:masterUrl+  '' + item.response.entity[0].filePath,
                        description: item.describe,
                        name: item.response.entity[0].fileName,
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

            values = { ...this.state.id, 
              ...fieldsValue, typeId, 
              // type: fieldsValue['type'] ? fieldsValue['type'] : 3, 
              orgId: fieldsValue['orgId'] && fieldsValue['orgId'][fieldsValue['orgId'].length - 1], 
              orgid: fieldsValue['orgid'] && fieldsValue['orgid'][fieldsValue['orgid'].length - 1], 
              organizationId: fieldsValue['organizationId'] && fieldsValue['organizationId'][fieldsValue['organizationId'].length - 1], 
              treasureprovider: fieldsValue['treasureprovider'] && fieldsValue['treasureprovider'][fieldsValue['treasureprovider'].length - 1], applyBegin: fieldsValue['applyBegin'] && fieldsValue['applyBegin'].format('YYYY-MM-DD HH:mm:ss'), 
              applyEnd: fieldsValue['applyEnd'] && fieldsValue['applyEnd'].format('YYYY-MM-DD HH:mm:ss'), 
              beginTime: fieldsValue['beginTime'] && fieldsValue['beginTime'].format('YYYY-MM-DD HH:mm:ss'), 
              endTime: fieldsValue['beginTime'] && fieldsValue['endTime'].format('YYYY-MM-DD HH:mm:ss'), 
              titleImage: fieldsValue['titleImage'] && this.arrayToString(fieldsValue['titleImage']), 
              titleimage: fieldsValue['titleimage'] && this.arrayToString(fieldsValue['titleimage']), 
              coverimage: fieldsValue['coverimage'] && this.arrayToString(fieldsValue['coverimage']), 
              // categoryIdList: fieldsValue['categoryIdList'], //资讯-文章-新建视屏，默认type=6 // categoryid: fieldsValue['categoryid']&&this.arrayToString(fieldsValue['categoryid']),
              newsAttachList: [...arr] };
            if (this.props.type === 'event' && values['categoryId']) {
              values['categoryId'] = this.arrayToString(values['categoryId']);
            }
            if(values.content){
              if(Array.isArray(values.content)&&values.content.length===0){
                values.content='';
              }
            }else{
              values.content='';
            }

            let body = { ...values };
            if(body['remindTime']){
              body['remindTime']= body['remindTime'].format('YYYY-MM-DD HH:mm:ss')
            }
            //服务管理 事项提醒管理   新增接口参数
            if(this.props.addOldKey === 'RemindOld' && body['relationAddress']){
              if(body['relationAddress'].indexOf('&id=')>-1){
                const old = body['relationAddress'].split('&id=')[1];
                body['old']=old;
              }
            }
            /**
             * 朱劲松 2018-12-12
             * 修改‘新建事项提醒，点击保存并发布，页面报错’ BUG 1998
             * 新增判断
             */
            let nowDate = moment(new Date());
            let endData = moment(body['remindTime']);
            let diffDate = endData - nowDate;
            if(diffDate < 0){
              Message.error('任务截止时间必须大于当前时间！');
              return;
            }
            if(this.state.idAdd) { //yelu 添加 新建的时候点保存后再点击保存添加之前新建好返回的id
                body['id'] = this.state.idAdd
            }
            if(!body.id){
              body.id = this.state.infoId
            }
            console.log(body)
            if(this.props.style === 'edit'&&this.props.belongedType === 'General'){
              body.taskId = this.props.steps[0].data.taskId;
              body.publishDate = this.props.timePushData
            }
            if(this.props.datatype=='special'&&!fieldsValue.isTimePublish){
              body.taskId = '';
              body.publishDate = '';
            }

            //学习管理
            if(this.props.belongedType === 'unionLearn'){
                body['categoryId ']= body['categoryIdList'].join(',')
                body.contentImage = [{url:body.url?body.url:'',desp:body.desp?body.desp:'',videoLong:body.videoLong||0,type:2}]
                let newsAttachs = []
                fieldsValue['newsAttachs'].map(item=>{
                    if(Array.isArray(item)){
                        newsAttachs.push({name:item[0].response.root.object[0].fileName,url:item[0].response.root.object[0].filePath,size:item[0].size,type:3});
                    }else{
                        newsAttachs.push({name:item.response.root.object[0].fileName,url:item.response.root.object[0].filePath,size:item.size,type:3});
                    }
                })
                body.newsAttachs = newsAttachs
            }

            //党建学习
            if(this.props.belongedType === 'partyLearn'){
                body.categoryId = body.categoryIdList.join(',')
                body.contentImage = [{url:body.url?body.url:'',desp:body.desp?body.desp:'',videoLong:body.videoLong||0,type:2}]
                let newsAttachs = []
                fieldsValue['newsAttachs'].map(item=>{
                    if(Array.isArray(item)){
                        newsAttachs.push({name:item[0].response.root.object[0].fileName,url:item[0].response.root.object[0].filePath,size:item[0].size,type:3});
                    }else{
                        newsAttachs.push({name:item.response.root.object[0].fileName,url:item.response.root.object[0].filePath,size:item.size,type:3});
                    }
                })
                body.newsAttachs = newsAttachs
            }
              postService(   //yelu 添加idAdd 新建后停留在新建页面，再点击保存的时候调用updata更新接口
                API_PREFIX + `${this.state.id || this.state.idAdd ||this.props.remindListType=='ServiceRemindListId'&&sessionStorage.getItem('ServiceRemindListId')? updateUrl : url}`,
                body,
                data => {
                  if (data.status === 1) {
                    if(!this.props.timePushData){
                      Message.success('保存成功！');
                    }
                    console.log(this.props)
                    console.log(this.state)
                    if(this.props.belongedType === 'General'||this.props.belongedType === 'unionLearn'||this.props.belongedType === 'partyLearn'){
                      
                      if(!this.state.infoId){
                        let tenantId = window.sessionStorage.getItem("tenantId");
                        let body = {
                            dataId: data.root.object.id,
                            dataType:this.props.belongedType === 'unionLearn'?1:6,
                            departments: [],
                            partys:[],
                            groups: [],
                            companyList: [],
                            viewTenantId: [tenantId],
                            partysJoin: [],
                            departmentsJoin: [],
                            groupsJoin: [],
                            companyJoinList: [],
                            unions:[],
                            unionsJoin:[],
                            joinTenantId: [],
                          };
                          postService(API_PREFIX + `services/web/auth/authdata/updAuthData`, body, data => {
                            if (data.status === 1) {
                              
                            }else{
                              Message.error(data.errorMsg);
                            }
                          });
                          this.setState({infoId:data.root.object.id})
                      }
                      

                    }
                    if(data.root.id) {
                      this.setState({idCord: data.root.id, idAdd: data.root.id}); //yelu 添加，新建或者更新后保存返回的id
                      if(this.props.remindListType=='ServiceRemindListId'){
                        sessionStorage.setItem("ServiceRemindListId",data.root.id)
                      }
                    }
                    if(data.root.object&&data.root.object.id){
                      let id = { id: data.root.object.id };
                      this.setState({id})
                    }
                    //判断普通专题的定时发布
                    if((this.props.datatype=='special'||this.props.belongedType === 'unionLearn'||this.props.belongedType === 'partyLearn')&&fieldsValue.isTimePublish){ 
                      let  bodyTime= {
                        "name": "普通专题定时发布任务",
                        "type": "41",
                        "runTime": this.props.timePushData,
                        "queryType": "get",
                        "queryUrl": API_PREFIX+`services/web/news/special/normal/publish/${data.root.object.id}`,
                        "queryValue": "{}",
                        "queryContentType": "application/json"
                      };
                      if(this.props.belongedType === 'unionLearn'){
                        bodyTime['queryUrl'] = `${API_PREFIX}services/web/union/studyManage/publishUnionStudy/${data.root.object.id||this.state.infoId}`
                        bodyTime['queryType'] = 'post';
                        bodyTime['name'] = "学习管理定时发布任务";

                      }
                      if(this.props.belongedType === 'partyLearn'){
                        bodyTime['queryUrl'] = `${API_PREFIX}services/web/party/partyStudy/publishPartyStudy/${this.state.infoId||data.root.object.id}`
                        bodyTime['queryType'] = 'post';
                        bodyTime['name'] = "党建学习管理定时发布任务";

                      }
                      let taskId = ''
                      if(this.props.style === 'edit'){
                          taskId = this.props.steps[0].data.taskId;
                          bodyTime.id = taskId
                      }
                      postService(API_PREFIX + `services/web/system/taskParam/${taskId ? 'update' : 'add'}`, bodyTime, timeData => {
                        if (timeData.status === 1) {
                          Message.success(`保存成功！将于${this.props.timePushData}定时发布`)
                          if(this.props.style !== 'edit'){
                              let bodyUpdate = {...body,id:data.root.object.id,publishDate:this.props.timePushData,taskId:timeData.root.object.id}
                              if(this.props.belongedType === 'unionLearn'){
                                  postService(API_PREFIX+`services/web/union/studyManage/updateUnionStudy`,bodyUpdate,updateData=>{
                                      if(updateData.status === 1 ){
                                      }else{
                                        Message.error(updateData.errorMsg);
                                      }
                                  })
                              }if(this.props.belongedType === 'partyLearn'){
                                  postService(API_PREFIX+`services/web/party/partyStudy/updatePartyStudy`,bodyUpdate,updateData=>{
                                      if(updateData.status === 1 ){
                                      }else{
                                        Message.error(updateData.errorMsg);
                                      }
                                  })
                              }else{
                                  postService(API_PREFIX+`services/web/news/special/normal/update`,bodyUpdate,updateData=>{
                                      if(updateData.status === 1 ){
                                      }else{
                                        Message.error(updateData.errorMsg);
                                      }
                                  })
                              }
                          }else{
                            let bodyUpdate = {...body,id:data.root.object.id||this.state.infoId,publishDate:this.props.timePushData,taskId:timeData.root.object.id}
                            if(this.props.belongedType === 'partyLearn'){
                                postService(API_PREFIX+`services/web/party/partyStudy/updatePartyStudy`,bodyUpdate,updateData=>{
                                    if(updateData.status === 1 ){
                                    }else{
                                      Message.error(updateData.errorMsg);
                                    }
                                })
                            }
                          }
                        }else{
                          Message.error(timeData.errorMsg);
                        }
                      });
                    }
                    if((this.props.datatype=='special'||this.props.belongedType === 'unionLearn'||this.props.belongedType === 'partyLearn')&&taskId&&!fieldsValue.isTimePublish){ 
                      postService(API_PREFIX + `services/web/system/taskParam/delete/${taskId}`, {}, timeData => {
                        if (timeData.status === 1) {
                        }else{
                          Message.error(timeData.errorMsg);
                        }
                      });
                    }
                    // this.props.setIsSubmit(false); //关闭缓存
                    /**保存完之后缓存置空 */
                    // let leaveData = { ...this.props.leaveData };
                    // leaveData[this.props.belonged] = {};
                    // this.props.setLeaveData(leaveData);
                    
                    if (type === 'next') {
                      this.next(fieldsValue,data.root.object.id);
                    }else if (save) {
                      location.hash = save;
                    }
                  } else {
                    Message.error(data.errorMsg); 
                  }
                }
              );

          }
          if (current == 1) {
            values = { ...fieldsValue, ...this.state.id };
            values['dept'] = this.state.checkData['department_join'] && this.arrayToString(this.state.checkData['department_join']);
            values['department'] = this.state.checkData['department_join'] && this.arrayToString(this.state.checkData['department_join']);
            values['depView'] = this.state.checkData['department_view'] && this.arrayToString(this.state.checkData['department_view']);
            values['party'] = this.state.checkData['partyid_join'] && this.arrayToString(this.state.checkData['partyid_join']);
            values['partyView'] = this.state.checkData['partyid_view'] && this.arrayToString(this.state.checkData['partyid_view']);
            values['groups'] = this.state.checkData['virtualgroupid_join'] && this.arrayToString(this.state.checkData['virtualgroupid_join']);
            values['groupView'] = this.state.checkData['virtualgroupid_view'] && this.arrayToString(this.state.checkData['virtualgroupid_view']);
            values['partyid'] = this.state.checkData['partyid_join'] && this.arrayToString(this.state.checkData['partyid_join']);
            values['departments'] = this.state.checkData['department_join'];
            if(this.props.RemindType==='remind' && online) {
              values['status'] = 1;
              values['id'] = this.state.idCord;
            }else {
              values['status'] = 0;
              values['id'] = this.state.idCord;
            } 
            /**
             * 朱劲松 2018-12-12
             * 修改‘新建事项提醒，点击保存并发布，页面报错’ BUG 1998
             * 新增判断
             */
            let nowDate = moment(new Date());
            let endData = moment(sessionStorage.getItem('remindTime'));
            let diffDate = endData - nowDate;
            if(diffDate < 0){
              Message.error('任务截止时间必须大于当前时间！');
              return;
            }
            let auth = {
              viewTenantId:[],
              partysJoin: [],
              departmentsJoin: [],
              groupsJoin: [],
              companyJoinList: [],
              joinTenantId:[],
              companyList:[],
            };
            if(this.props.belongedType === 'General'||this.props.belongedType === 'unionLearn'){
              values = {...auth}
              values['departments'] = this.state.checkData['department_join']||[];
              values['partys'] = this.state.checkData['partyid_join']||[];
              values['groups'] = this.state.checkData['virtualgroupid_join'] && this.state.checkData['virtualgroupid_join']||[];
              values['unions'] = this.state.checkData['union_join'] && this.state.checkData['union_join']||[];
              values['id'] = this.state.id.id;
              values['dataId'] = values.id||this.state.infoId;
              values['dataType'] = this.props.belongedType === 'unionLearn'?1:6
              if(!values['departments'].length&&!values['partys'].length&&!values['groups'].length&&!values['unions'].length){
                let tenantId = window.sessionStorage.getItem('tenantId');
                values['viewTenantId'] = [tenantId]
              }
            }
            if(this.props.belongedType === 'partyLearn'){
              if(this.state.checkData['partys']&&this.state.checkData['partys'].length){
                values = {...auth}
                values['departments'] = [];
                values['partys'] = this.state.checkData['partys'];
                values['groups'] = [];
                values['unions'] = [];
                values['id'] = this.state.id.id;
                values['dataId'] = values.id||this.state.infoId;
                values['dataType'] = 1
              }else{
                Message.warning('请选择接收人')
                return
              }
              
            }
            postService(API_PREFIX + url, values, data => {
              if (data.status === 1) {
                if(!online){
                  Message.success('保存成功！');
                  if (save) {
                      location.hash = save;
                  }
                }else{
                  if (save) {
                    location.hash = save;
                  }
                }

                let id = { id: data.root.id };
                let id2=data.root.id;
                if(this.props.datatype=='special'&&this.props.style=='add'&&!online&&this.props.timePushData){
                  getService(API_PREFIX+`services/news/special/normal/list/1/10?Q=id_S_EQ=${this.state.idCord}`,dataTwo=>{
                    if(dataTwo.retCode==1){
                        let temp = dataTwo.root.list[0].isTimePublish; //基本信息  (归属部门的数据为：treepath)
                        let result=dataTwo.root.list[0];
                        if(temp){
                              this.props.timePush(result.id,this.props.style,this.props.timePushData)
                        }
                    }
                  });
                }

                if(this.props.RemindType==='remind'&&online){
                  let bodyS=this.props.timePush.body;
                  bodyS.cronDate = moment(sessionStorage.getItem('remindTime')).format('YYYY-MM-DD HH:mm:ss');
                  bodyS.queryUrl =bodyS.queryUrl+data.root.id;
                  // if (taskId) {
                    // bodyS.id = taskId;
                  // }else {
                    // bodyS.id = this.state.idCord
                    // bodyS.queryValue = {ids:[this.state.idCord]};
                  // }
                     if (taskId) {
                    bodyS.id = taskId;
                  }
                  postService(API_PREFIX + `services/automation/job/${taskId ? 'update' : 'add'}`,
                    bodyS,
                    timeData => {
                      if (timeData.retCode === 1) {
                        getService(API_PREFIX + `services/servicemanager/event/addTaskId/${timeData.root.id}/${data.root.id}`,Data => {
                          if (Data.retCode === 1) {
                            sessionStorage.setItem("taskIdUpdate",timeData.root.id)
                            Message.success(
                              // `保存成功！将于${this.props.timePushData}定时发布`
                              `保存成功！将于${this.props.timePush.body.cronDate}定时发布`
                            );
                          }
                        });
                      }else{
                        Message.error(timeData.errorMsg);
                      }
                    }
                  );
                }else{
                  if(online){
                    let id = id2?id2:this.state.id.id
                    if(this.props.belongedType === 'partyLearn'){
                      postService(API_PREFIX+ online+'/'+id,{},data=>{
                        if (data.status ===1) {
                          if (save) {
                            location.hash = save;
                          }
                        }else{
                            message.error(data.errorMsg);
                        }
                    });
                    }else{
                      getService(API_PREFIX + online+'/'+id, data=>{
                        if(data.status === 1){
                          Message.success('发布成功！');
                          if (save) {
                            location.hash = save;
                          }
                        }else{
                          Message.error(data.errorMsg);
                        }
                      });
                    }
 
                  }
                }
                this.props.setIsSubmit(false); //关闭缓存

                /**保存完之后缓存置空 */
                let leaveData = { ...this.props.leaveData };
                leaveData[this.props.belonged] = {};
                this.props.setLeaveData(leaveData);
                /* */

                this.setState({ id, showPrompt: steps[steps.length - 1].end ?false:true },()=>{
                  if (type === 'next') {
                    // this.next(this.dealGetData(data.root));
                    this.next({ ...fieldsValue, ...this.state.checkData,...data.root.id});
                  }
                  if (save) {
                    if(this.props.datatype=='special'&&this.props.style=='add'&&this.props.timePushData){
                      null;
                    }else{
                      location.hash = save;
                    }
                    
                    
                  }
                });
              
              } else {
                Message.error(data.errorMsg);
              }
              });
          }
        }
      });
    }, 0);
  };
  tabChange = value => {
    this.setState({ current:value, updateFormWrapper: this.state.updateFormWrapper+1},()=>{
      const id = this.state.id.id;
      const current = this.state.current ;
      /**
       * 朱劲松 2018-12-11
       * 修改 ‘事项提醒--编辑--修改提交按钮为 保存并下一步 ’ 新增判断
       */
      // if(location.hash.indexOf('?newsId=')>-1){
      //   if (location.hash.indexOf('&step')>-1) {
      //     location.hash = location.hash.replace(/\?step=[0-2]/,`&step=${current}&id=${id}`);
      //   }else{
      //     location.hash += `&step=${current}&id=${id}`;
      //   }
      // }else{
      //   if (location.hash.indexOf('?step')>-1) {
      //     location.hash = location.hash.replace(/\?step=[0-2]/,`?step=${current}&id=${id}`);
      //   }else{
      //     location.hash += `?step=${current}&id=${id}`;
      //   }
      // }
      this.setState({  showPrompt: false });
    });
  };
  componentWillUnmount() {
    //this.handleSubmit();
    let isSubmit = this.props.isSubmit;
    if (isSubmit==='ok') {
      // this.handleSubmit(null, null, null, null, null, 'leaveAndSave');
      let fieldsValue = this.props.form.getFieldsValue();
      let leaveData = this.props.leaveData;
      // leaveData[this.props.belonged] = { ...this.state.checkData, ...fieldsValue };
      leaveData[this.props.belonged] = {};           //20181031  编辑成功之后，清空缓存
      this.props.setLeaveData(leaveData);
    }else if(isSubmit==='cancel'){
      let leaveData = { ...this.props.leaveData };
      leaveData[this.props.belonged] = {};
      this.props.setLeaveData(leaveData);
    }
    this.props.setEventData({});
    this.props.setTimePushData('');
  }
  render() {
    const { current } = this.state;
    const { flowData, leaveData } = this.props;
    const disabled = this.props.style === 'detail';
    const disappear=this.props.style === 'add';
    let steps = cloneObj(this.props.steps);
    steps.map((item, index) => {
      if (item.content) {
        //表单页
        item.content = (
          <div key={index}>
            <FormWrapper
              key={this.state.updateFormWrapper}
              {...this.props}
              getShoppingId={this.getShoppingId}
              flowData={flowData}
              content={item.content}
              disabled={disabled}
              disappear={disappear}
              RemindType={this.props.RemindType} //朱劲松    针对事项提醒 新增属性
              initialValue={item.data ? this.dealGetData(item.data) : null} 
            />
          </div>
        );
      } else {
        if (this.props.type === 'information') {
          item.content = (
            <div key={index}>
              <InfoTree
                type="join"
                disabled={disabled}
                flowData={flowData}
                leaveData={leaveData}
                belongedType={this.props.belongedType}
                initialValue={item.data ? this.dealGetData(item.data) : null}
                add={this.props.style}
              />
            </div>
          );
        }
      }
    });
    return (
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
                {this.state.current < steps.length - 1 && (
                  <Row className="center ButtonCenter" style={{  }}>
                    {/* <Button className="resetBtn" onClick={() => this.props.history.goBack()}>
                      返回
                    </Button> */}
                    <Button className="resetBtn" style={{height:'27px',lineHeight:'23px'}}>
                      <Link       
                        to={this.props.save}
                      >
                        返回
                      </Link>
                    </Button>
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
                {this.state.current === steps.length - 1 && (
                  <Row style={{}} className="center DepartmentEdit">
                    <Button className="resetBtn" style={{height:'27px',lineHeight:'22px'}} onClick={this.prev}>
                      上一步
                    </Button>
                    {
                      steps[steps.length - 1].end?
                        <Button className="queryBtn" onClick={e => this.handleSubmit(e, '', '', this.props.save)}>
                          保存并返回
                        </Button>:this.props.datatype==='special'?<Button className="queryBtn" onClick={e => this.handleSubmit(e, '', '', this.props.save)}>
                          保存并返回
                        </Button>:
                        this.props.belongedType === 'partyLearn'?
                        <Button className="queryBtn" onClick={e => this.handleSubmit(e, '', '', this.props.save)}>保存并返回</Button>:
                        <Button className="queryBtn" onClick={this.handleSubmit}>保存</Button>
                    }
                    {
                      this.props.belongedType === 'unionLearn'?
                      <Button className="queryBtn" onClick={e => this.handleSubmit(e, '', '', this.props.save)}>保存并返回</Button>:
                      <Button className="queryBtn" onClick={e =>this.handleSubmit(e,'',null,this.props.save,this.props.steps[this.state.current].online)}>保存并发布</Button>
                    }
                      
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
                  return ;
                }
                return (
                  <TabPane tab={item.title} key={index}>
                    {item.content}
                    {this.props.style === 'edit' ? (
                      <Row className="center EditButtonCenter">
                        <Button className="resetBtn" onClick={() => location.hash=this.props.save}>返回</Button>
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
                        <Button  className="queryBtn" onClick={this.handleSubmit}>保存</Button>
                        <Button
                          className="queryBtn"
                          onClick={e =>
                            this.handleSubmit(e, '', '', this.props.save)
                          }
                        >
                          保存并返回
                        </Button>
                      </Row>
                    ) : 
                    /**
                     * 朱劲松 2018-12-08 新增
                     * 修改 ‘编辑事项提醒，编辑完成后，没有发布功能’ BUG 1716
                     */
                    this.props.style === 'remindEdit' ? (
                      <Row style={{}} className="center ButtonCenter">
                        <Button className="resetBtn" onClick={() => location.hash=this.props.save}>返回</Button>
                        {this.state.current < steps.length - 1 ?
                          <Button
                          className="queryBtn"
                          onClick={e =>
                            this.handleSubmit(e, '', '')
                            }
                          >
                            保存
                          </Button>:null}
                          <Button
                            className="queryBtn"
                            onClick={e =>
                              this.handleSubmit(e, '', '', this.props.save)
                            }
                          >
                            保存并返回
                          </Button>
                          {this.state.current < steps.length - 1 ?
                          null:<Button
                            className="queryBtn"
                            onClick={e =>
                              this.handleSubmit(
                                e,
                                '',
                                null,
                                this.props.save,
                                this.props.steps[this.state.current].online
                              )
                            }
                          >
                            保存并发布
                          </Button>}
                          
                        
                      </Row>
                    ):
                    (
                      <Row>
                        <Col span={24} style={{textAlign:'center',marginBottom:'20px'}}>
                          <Button className="resetBtn" onClick={() => history.back()}>返回</Button>
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
          message="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点击&quot;确定&quot;,将保存当前页面数据，跳转到目标页面，点击&quot;取消&quot;，则不会保存当前数据。"
          when={this.state.showPrompt}
        /> */}
        <div id="EventAddModal" />
      </div>
    );
  }
}
const option1 = [{ value: true, label: '是' }, { value: false, label: '否' }];