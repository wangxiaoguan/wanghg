import React, { Component } from 'react';
import { Row, Form, Steps, Button, Tabs, Message, Modal,Col } from 'antd';
import { getService, postService, GetQueryString} from '../../content/myFetch';
import { setEventData, setLeaveData, setIsSubmit} from '../../../redux-root/action/eventAndInfoData/eventAndInfoData';
import { setTimePushData } from '../../../redux-root/action/eventAndInfoData/timePushData';
import ServiceApi,{ masterUrl,ChooseUrl} from'../../content/apiprefix';
import MultipleTree from './MultipleTree';
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
    };
  }
  componentDidMount() {
    
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
  next = values => {
    this.props.setEventData(values); //保存上一页内容
    const current = this.state.current + 1;
    this.setState({ current, showPrompt: false },()=>{
      if (location.hash.indexOf('?step')>-1) {
        location.hash = location.hash.replace(/\?step=[0-2]/,`?step=${current}`);
      }else{
        location.hash += `?step=${current}`;
      }
    });
    
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
  dealGetData = data => {
    console.log(data)
    debugger;
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
    if (this.props.style == 'edit' || this.props.style == 'detail') {
      data['categoryIdList'] =
        data['categoryUnionId'] && data['categoryUnionId'].split(',');
    } else {
      data['categoryIdList'] &&
        data['categoryIdList'].map((item, index) => {
          item = item + '';
        });
    }

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

    console.log('data',data)
    console.log('data_type',data['type'])
    let titleimage
    if(ChooseUrl==1){
      titleimage=data['titleimage'] &&data['titleimage'].split(',')
    }else{
      titleimage=data['titleimage'] &&
      data['titleimage'].replace(/(\w+),(\w+),/g, '$1,$2;').split(';')
    }

    let result = {
      ...data,
      videoUrl:videoNew.videoUrl,
      videoDesp:videoNew.videoDesp,
      videoTime:videoNew.videoTime,
      picUrl: pic,
      fileUrl: file,
      orgId:
      newTreePath,   //todo
      orgid:
      newTreePath,
      organizationId:
        newTreePath,
      applyBegin: data['applyBegin'] && moment(data['applyBegin']),
      applyEnd: data['applyEnd'] && moment(data['applyEnd']),
      beginTime: data['beginTime'] && moment(data['beginTime']),
      endTime: data['endTime'] && moment(data['endTime']),

      titleImage:
        data['titleImage'] &&
        data['titleImage'].replace(/(\w+),(\w+),/g, '$1,$2;').split(';'),
      // titleimage:data['titleimage'] &&data['titleimage'].replace(/(\w+),(\w+),/g, '$1,$2;').split(';'),
      titleimage:titleimage,
      categoryId: data['categoryId'] && data['categoryId'].split(','),
      coverimage:
        data['coverimage'] &&
        data['coverimage'].replace(/(\w+),(\w+),/g, '$1,$2;').split(';'),

      department: data['department'] && data['department'].split(','),
      partyid: data['partyid'] ? data['partyid'].split(',') : [],
      groups: data['groups'] && data['groups'].split(','),
      department_join: data['department'] && data['department'].split(','),
      department_view: data['depView'] && data['depView'].split(','),
      partyid_view: data['partyView'] && data['partyView'].split(','),
      virtualgroupid_join: data['groups'] && data['groups'].split(','),
      virtualgroupid_view: data['groupView'] && data['groupView'].split(','),
      treasureProvider:
        data['treasureProviderTreepath'] &&
        data['treasureProviderTreepath'].split(','),
      // adminid:data['author']&&data['author'],
    };
    if (this.props.type === 'information') {
      result['partyid_join'] = data['partyid'] && data['partyid'].split(',');
    } else if (this.props.type === 'event') {
      result['partyid_join'] = data['party'] && data['party'].split(',');
    }
    this.state.name = data['name']&&data['name'];
    this.state.titleImage = data['titleImage'] && data['titleImage'];
    this.state.categoryId = data['categoryId'] && data['categoryId'];
    if(this.props.style==='detail'){

      if(result.isrequired===2){
        result.isrequired = true
      }else if(result.isrequired===1){
        result.isrequired=false
      }
    }
    console.log("result==>",result)
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
      let updateUrl = steps[current].updateUrl;
      let typeId = steps[current].typeId;
      let taskId = steps[current].data ? steps[current].data['taskId'] : null;
      e && e.preventDefault();

      console.log('current==>',current)
      console.log('steps==>',steps)
      this.props.form.validateFields(fieldKeys, (err, fieldsValue) => {
        // if (leave === 'leaveAndSave') {
        //   let leaveData = this.props.leaveData;
        //   leaveData[this.props.belonged] = { ...this.state.checkData, ...fieldsValue};
        //   this.props.setLeaveData(leaveData);
        //   return;
        // }
        console.log("form",this.props.form)
        if (!err) {
          let values = {};
          if (current == 0) {
            console.log('******')
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

            // let videoUrl= fieldsValue['videoUrl'] && fieldsValue['videoUrl'].map(
            //   (item, index) => {
            //   //附件
            //     if (item != undefined) {
            //       let isMasterUrl = item.response.entity[0].filePath.indexOf(masterUrl) > -1;
            //       return {
            //         url: isMasterUrl ? item.response.entity[0].filePath:masterUrl+'' + item.response.entity[0].filePath,
            //         type: 3,
            //         name: item.response.entity[0].fileName,
            //       };
            //     }
            //   }
            // );
            let picUrl = [];
            console.log("fieldsValue['picUrl']",fieldsValue['picUrl'])
            picUrl = fieldsValue['picUrl'] && fieldsValue['picUrl'].map(
              (item, index) => {
              //内容图片
                if (item != undefined) {
                    if(Array.isArray(item)){
                      let isMasterUrl = item[0].response.entity[0].filePath.indexOf(masterUrl) > -1;
                      console.log(isMasterUrl)
                      return {
                        url: isMasterUrl ? item[0].response.entity[0].filePath:masterUrl+  '' + item[0].response.entity[0].filePath,
                        description: item[0].describe,
                        name: item[0].response.entity[0].fileName,
                        type: 1,
                      };
                    }else{
                      let isMasterUrl = item.response.entity[0].filePath.indexOf(masterUrl) > -1;
                      console.log(isMasterUrl)
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

            console.log('picUrl==>',picUrl)
            console.log('fileUrl==>',fileUrl)
            if (picUrl && fileUrl) {
              arr = [...fileUrl, ...picUrl];
            } else if (!picUrl && fileUrl) {
              arr = [...fileUrl];
            } else if (picUrl && !fileUrl) {
              arr = [...picUrl];
            }
            // }
            if(fieldsValue['videoUrl']){
              arr.push({
                url:fieldsValue['videoUrl'],
                description:fieldsValue['videoDesp'],
                timelong:fieldsValue['videoTime'],
                type:2,
              });
            }

            console.log('fieldsValue==>',fieldsValue) 
            console.log('arr==>',arr)

            values = { ...this.state.id, ...fieldsValue, typeId, type: fieldsValue['type'] ? fieldsValue['type'] : 6, orgId: fieldsValue['orgId'] && fieldsValue['orgId'][fieldsValue['orgId'].length - 1], orgid: fieldsValue['orgid'] && fieldsValue['orgid'][fieldsValue['orgid'].length - 1], organizationId: fieldsValue['organizationId'] && fieldsValue['organizationId'][fieldsValue['organizationId'].length - 1], treasureprovider: fieldsValue['treasureprovider'] && fieldsValue['treasureprovider'][fieldsValue['treasureprovider'].length - 1], applyBegin: fieldsValue['applyBegin'] && fieldsValue['applyBegin'].format('YYYY-MM-DD HH:mm:ss'), applyEnd: fieldsValue['applyEnd'] && fieldsValue['applyEnd'].format('YYYY-MM-DD HH:mm:ss'), beginTime: fieldsValue['beginTime'] && fieldsValue['beginTime'].format('YYYY-MM-DD HH:mm:ss'), endTime: fieldsValue['beginTime'] && fieldsValue['endTime'].format('YYYY-MM-DD HH:mm:ss'), titleImage: fieldsValue['titleImage'] && this.arrayToString(fieldsValue['titleImage']), titleimage: fieldsValue['titleimage'] && this.arrayToString(fieldsValue['titleimage']), coverimage: fieldsValue['coverimage'] && this.arrayToString(fieldsValue['coverimage']), // categoryIdList: fieldsValue['categoryIdList'], //资讯-文章-新建视屏，默认type=6 // categoryid: fieldsValue['categoryid']&&this.arrayToString(fieldsValue['categoryid']),
              newsAttachList: [...arr] };
            if (this.props.type === 'event' && values['categoryId']) {
              values['categoryId'] = this.arrayToString(values['categoryId']);
            }
            if(values.content){
              if(Array.isArray(values.content)&&values.content.length===0){
                values.content=''
              }
            }else{
              values.content=''
            }

            let body = { ...values };

            console.log("values==>",values)
            if(values.videoUrl){
              let regUrl= /(http|https)\:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/gi;
              console.log("true==>",values['videoUrl'])
              let arrV=regUrl.exec(values['videoUrl'])
              if(arrV === null){
                Message.warning('视频地址请输入正确的网址！');
                return false;
              }
            }

            debugger;
            
            if(values.titleimage){
              let titleImages=values.titleimage.split(',')
              if(values.type==='2'&&values.layout===3&&titleImages.length<3){
                Message.warning('标题图片至少上传3张！');
                return false;
              }
            }

            if(values['type']==='5'){
              let regUrlNum=0
              let regUrl= /(http|https)\:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/gi;
              console.log("true==>",values['content'])
              let arrT=regUrl.exec(values['content'])

              if(arrT===null){
                Message.warning('资讯类型为‘网页’时，资讯内容只能是网址！');
              }else{
                let regUrl= /(http|https)\:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/gi;
                let arrW=values['content'].match(regUrl)
                values['content']=arrW[0]
                postService(
                  ServiceApi + `${this.state.id ? updateUrl : url}`,
                  body,
                  data => {
                    if (data.retCode === 1) {
                      Message.success('保存成功!');
                      let id = { id: data.root.id };
                      this.props.setIsSubmit(false); //关闭缓存
    
                      /**保存完之后缓存置空 */
                      let leaveData = { ...this.props.leaveData };
                      leaveData[this.props.belonged] = {};
                      this.props.setLeaveData(leaveData);
                      /* */
                      if(data.root.titleImage){
                        this.setState({ id, name: data.root.name, titleImage: data.root.titleImage.split(','), categoryId:data.root.categoryId });
                      }else{
                        this.setState({ id, name: data.root.name, categoryId:data.root.categoryId });
                      }
                      
                      if (type === 'next') {
                      // this.next(this.dealGetData(data.root));
                        this.next(fieldsValue);
                      }else
                      if (save) {
                        location.hash = save;
                      }
                    } else {
                      Message.error(data.retMsg);
                    }
                  }
                );
              }
            }else{
              postService(
                ServiceApi + `${this.state.id ? updateUrl : url}`,
                body,
                data => {
                  if (data.retCode === 1) {
                    Message.success('保存成功!');
                    let id = { id: data.root.id };
                    this.props.setIsSubmit(false); //关闭缓存
  
                    /**保存完之后缓存置空 */
                    let leaveData = { ...this.props.leaveData };
                    leaveData[this.props.belonged] = {};
                    this.props.setLeaveData(leaveData);
                    /* */
                    if(data.root.titleImage){
                      this.setState({ id, name: data.root.name, titleImage: data.root.titleImage.split(','), categoryId:data.root.categoryId });
                    }else{
                      this.setState({ id, name: data.root.name, categoryId:data.root.categoryId });
                    }
                    
                    if (type === 'next') {
                    // this.next(this.dealGetData(data.root));
                      this.next(fieldsValue);
                    }else
                    if (save) {
                      location.hash = save;
                    }
                  } else {
                    Message.error(data.retMsg);
                  }
                }
              );
            }
          }
          if (current == 1) {
            values = { ...fieldsValue, ...this.state.id };
            values['department'] = this.state.checkData['department_join'] && this.arrayToString(this.state.checkData['department_join']);
            values['depView'] = this.state.checkData['department_view'] && this.arrayToString(this.state.checkData['department_view']);
            values['party'] = this.state.checkData['partyid_join'] && this.arrayToString(this.state.checkData['partyid_join']);
            values['partyView'] = this.state.checkData['partyid_view'] && this.arrayToString(this.state.checkData['partyid_view']);
            values['groups'] = this.state.checkData['virtualgroupid_join'] && this.arrayToString(this.state.checkData['virtualgroupid_join']);
            values['groupView'] = this.state.checkData['virtualgroupid_view'] && this.arrayToString(this.state.checkData['virtualgroupid_view']);
            values['partyid'] = this.state.checkData['partyid_join'] && this.arrayToString(this.state.checkData['partyid_join']);
            postService(ServiceApi + url, values, data => {
              if (data.retCode === 1) {
                 Message.success('保存成功！');
                let id = { id: data.root.id };
                let id2=data.root.id
                if(online){
                  getService(ServiceApi + online+'/'+id2, data=>{
                    if(data.retCode === 1){
                      Message.success('发布成功！');
                      if (save) {
                        location.hash = save;
                      }
                    }else{
                      Message.error(data.retMsg);
                    }
                  })
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
                    this.next({ ...fieldsValue, ...this.state.checkData});
                  }
                  if (save) {
                    location.hash = save;
                  }
                });
              
              } else {
                Message.error(data.retMsg);
              }
              });
           
           
          } else if (current == 2) {
            const values = { ...fieldsValue, ...this.state.id };
            values['treasureProvider'] = values['treasureProvider'] && values['treasureProvider'][values['treasureProvider'].length - 1];
            values['point'] = values['point'] && parseInt(values['point']);
            values['treasure'] = values['treasure'] && parseInt(values['treasure']);
            if (values['isHomePage']) {
              values['name'] = this.state.name;
              values['titleImage'] = this.state.titleImage;
              values['categoryId'] = this.state.categoryId;
            }
          
            //处理数据
            console.log("fieldsValue",fieldsValue)
            console.log(values)
            if (this.props.timePushData && this.props.timePushData !== '') {
              let body = { ...this.props.timePush.body };
              body.queryValue = this.props.type === 'event' ? { ...{ ids: [this.state.id.id] }, ...body.queryValue } : { ...body.queryValue };
              body.cronDate = this.props.timePushData;
              if (this.props.type==='information') {
                body.queryUrl+= this.state.id.id;
              }
              if (taskId) {
                body.id = taskId;
              }

              postService(
                ServiceApi +
                `services/automation/job/${taskId ? 'update' : 'add'}`,
                body,
                timeData => {
                  if (timeData.retCode === 1) {
                    let id = timeData.root.id;
                    getService(
                      ServiceApi +
                    `services/${this.props.type==='information'?'news/artical/':'activity/activity/'}addTaskId/${
                      this.state.id.id
                    }/${id}`,
                      bindData => {
                        if (bindData.retCode !== 1) {
                          Message.error(bindData.retMsg);
                        }
                      }
                    );
                    postService(ServiceApi + url, values, data => {
                      if (data.retCode === 1) {
                        Message.success(
                          `保存成功！将于${this.props.timePushData}定时发布`
                        );
                        let id = { id: data.root.id };
                        this.setState({ id,showPrompt:false },()=>{
                          if (type === 'submit') {
                          //history.back();
                            location.hash = `${linkTo}?id=${this.state.id.id}`;
                          }else
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
                        Message.error(data.retMsg);
                      }
                    });
                  } else {
                    Message.error(timeData.retMsg);
                  }
                }
              );
            } else {
              if(typeof(values.iscomment)==="string"){
                if(values.iscomment==='false'){
                  values.iscomment=false
                }else{
                  values.iscomment=true
                }
              }
              if(typeof(values.ishomepage)==="string"){
                if(values.ishomepage==='false'){
                  values.ishomepage=false
                }else{
                  values.ishomepage=true
                }
              }
              if(typeof(values.isinnershare)==="string"){
                if(values.isinnershare==='false'){
                  values.isinnershare=false
                }else{
                  values.isinnershare=true
                }
              }
              if(typeof(values.isnonamecomment)==="string"){
                if(values.isnonamecomment==='false'){
                  values.isnonamecomment=false
                }else{
                  values.isnonamecomment=true
                }
              }
              if(typeof(values.ispush)==="string"){
                if(values.ispush==='false'){
                  values.ispush=false
                }else{
                  values.ispush=true
                }
              }
              if(typeof(values.isshare)==="string"){
                if(values.isshare==='false'){
                  values.isshare=false
                }else{
                  values.isshare=true
                }
              }
              if(typeof(values.istimepush)==="string"){
                if(values.istimepush==='false'){
                  values.istimepush=false
                }else{
                  values.istimepush=true
                }
              }
              
              postService(ServiceApi + url, values, data => {
                console.log(data)
                debugger
                if (data.retCode === 1) {
                  if (!online) {
                    Message.success('保存成功!');
                  }
                  let id = { id: data.root.id };
                  this.setState({ id, showPrompt: false  },()=>{
                    if (type === 'submit') {
                    //history.back();
                      location.hash = `${linkTo}?id=${this.state.id.id}`;
                    } else
                    if (online) {
                      getService(
                        ServiceApi + `${online}/${this.state.id.id}`,
                        data => {
                          if (data.retCode === 1) {
                            if (save) {
                              Message.success('保存并发布成功!');
                              location.hash = save;
                            }
                          }
                        }
                      );
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
                  Message.error(data.retMsg);
                }
              });
            }
          }
        }
      });
    }, 0);
  };
  tabChange = value => {
    this.setState({ current: value, updateFormWrapper: this.state.updateFormWrapper+1});
  };
  componentWillUnmount() {
    //this.handleSubmit();
    let isSubmit = this.props.isSubmit;
    if (isSubmit==='ok') {
      // this.handleSubmit(null, null, null, null, null, 'leaveAndSave');
      let fieldsValue = this.props.form.getFieldsValue();
      console.log('获取表单数据',this.props.form.getFieldsValue());
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

    console.log('steps==>',steps)
    console.log("current==>",this.state.current)
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
              initialValue={item.data ? this.dealGetData(item.data) : null}
            />
          </div>
        );
      } else {
        //树形页
        if (this.props.type === 'event') {
          //活动
          item.content = <div key={index}>
            <span style={{ }} className="warnning">
                参加权限设置(若不勾选则默认为全部用户可参加)
            </span>
            <MultipleTree type="join" disabled={disabled} flowData={flowData} leaveData={leaveData[this.props.belonged]} initialValue={item.data ? this.dealGetData(item.data) : null} />
            <span style={{  }} className="warnning">
                查看权限设置(若不勾选则默认为全部用户可查看)
            </span>
            <MultipleTree type="view" disabled={disabled} flowData={flowData} leaveData={leaveData[this.props.belonged]} initialValue={item.data ? this.dealGetData(item.data) : null} />
            <span style={{ marginLeft: '31%' }}>
                其他权限设置
            </span>
            <div style={{ paddingLeft: '13%' }}>
              <FormWrapper key={this.state.updateFormWrapper} flowData={flowData}  disabled={disabled} disappear={disappear} initialValue={item.data ? this.dealGetData(item.data) : null} {...this.props} content={[{ key: 'isAlowFamily', label: '是否允许家人参加', type: 'radioButton', option: option1, required: true }, { key: 'actMinCredits', label: '参与该活动的最低经验值', type: 'inputNumber' }, { key: 'actMinTreasure', label: '参与该活动的最低积分', type: 'inputNumber' }, { key: 'upperLimit', label: '参与人数上限', type: 'inputNumber' }]} />
            </div>
          </div>;
        } else if (this.props.type === 'information') {
          //资讯
          item.content = (
            <div key={index}>
              <MultipleTree
                type="join"
                disabled={disabled}
                flowData={flowData}
                leaveData={leaveData}
                initialValue={item.data ? this.dealGetData(item.data) : null}
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
                {this.state.current < steps.length - 2 && (
                  <Row className="center" style={{  }}>
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
                    <Button
                      className="resetBtn"
                      style={{
                        display:
                          this.props.type === 'event' ? 'inline-block' : 'none',
                      }}
                    >
                      预览
                    </Button>
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
                  <Row style={{}} className="center">
                    <Button className="resetBtn" style={{height:'27px',lineHeight:'22px'}} onClick={this.prev}>
                      上一步
                    </Button>
                    {
                      steps[steps.length - 1].end?
                        <Button className="queryBtn" onClick={e => this.handleSubmit(e, '', '', this.props.save)}>
                          保存并返回
                        </Button>:
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
                  <Row className="center">
                    <Button className="resetBtn" onClick={this.prev}>
                      上一步
                    </Button>
                    <Button
                      className="queryBtn"
                      onClick={e =>
                        this.handleSubmit(e, '', null, this.props.save)
                      }
                    >
                      保存
                    </Button>
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
                  return ;
                }
                return (
                  <TabPane tab={item.title} key={index}>
                    {item.content}
                    {this.props.style === 'edit' ? (
                      <Row className="center">
                        <Button className="resetBtn" onClick={() => location.hash=this.props.save}>返回</Button>
                        <Button
                          className="queryBtn"
                          style={{
                            display:
                              this.props.type === 'event'
                                ? 'inline-block'
                                : 'none',
                          }}
                        >
                          预览
                        </Button>
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
                    ) : (
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