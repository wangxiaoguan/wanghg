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
    array&&array.map((item, index) => {
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
    let tree=[];
    let file = [];
    data['file'].map((item, index) => {
        file.push({ response: { entity: [{ filePath: item.url,fileName:item.name }] }, describe: item.description, id: item.id });
    })
    let result = {
      ...data,
      fileUrl:file,
      orgId:tree,
      beginTime: data['beginTime']&&moment(data['beginTime']),
      endTime: data['endTime']&&moment(data['endTime']),
      titleImage:data['titleImage']&&data['titleImage'].split(';'),
      categoryId:data['categoryId']&&data['categoryId'].split(','),
      coverimage:data['coverimage']&&data['coverimage'].split(';'),
      department:data['department']&&data['department'].split(','),
      partyid:data['partyid']&&data['partyid'].split(','),
      groups:data['groups']&&data['groups'].split(','),
    };
    return result;
  };

  handleSubmit = (e, type, linkTo, save, online, leave) => {
    setTimeout(() => {
      const { current } = this.state;
      const { steps } = this.props;
      let url = steps[current].url;
      let updateUrl = steps[current].updateUrl;
      let tempContent = cloneObj(steps);
      e && e.preventDefault();
      this.props.form.validateFields(fieldKeys, (err, fieldsValue) => {
        if (!err) {
          let values = {};
          if(current == 0){
            let fileUrl = fieldsValue['fileUrl'].map(item => {return {url: item.filePath,name: item.fileName,size:item.size}});
            let arr = [];
            values = {
              ...this.state.id, 
              ...fieldsValue, 
              type:         fieldsValue['type'], 
              orgId:        fieldsValue['orgId'] && fieldsValue['orgId'][fieldsValue['orgId'].length - 1], 
              beginTime:    fieldsValue['beginTime'] && fieldsValue['beginTime'].format('YYYY-MM-DD HH:mm:ss'), 
              endTime:      fieldsValue['beginTime'] && fieldsValue['endTime'].format('YYYY-MM-DD HH:mm:ss'), 
              titleImage:   this.arrayToString(fieldsValue['titleImage']), 
              coverimage:   this.arrayToString(fieldsValue['coverimage']), 
              file:         arr
            };
            let body = { ...values };
            postService(ServiceApi+`${this.state.id?updateUrl:url}`,body,data =>{
                if (data.retCode === 1) {
                  Message.success('保存成功!');
                  let id = { id: data.root.id };
                  this.props.setIsSubmit(false); //关闭缓存
                  let leaveData = { ...this.props.leaveData };//保存完之后缓存置空
                  leaveData[this.props.belonged] = {};
                  this.props.setLeaveData(leaveData);
                  this.setState({ id, name: data.root.name, titleImage: data.root.titleImage.split(','), categoryId:data.root.categoryId });
                  if(type === 'next'){
                    this.next(fieldsValue);
                  }else if(save){
                    location.hash = save;
                  }
                }else{
                  Message.error(data.retMsg);
                }
              }
            );
          }
          if(current == 1){
            values = { ...fieldsValue, ...this.state.id };
            values['groups']=this.arrayToString(this.state.checkData['groups']);
            postService(ServiceApi + url,values, data => {
              if (data.retCode === 1) {
                 message.success('保存成功！');
                let id = { id: data.root.id };
                this.props.setIsSubmit(false); //关闭缓存
                let leaveData = { ...this.props.leaveData };//保存完之后缓存置空
                leaveData[this.props.belonged] = {};
                this.props.setLeaveData(leaveData);
                this.setState({id});
                if(type === 'next'){
                  this.next({ ...fieldsValue, ...this.state.checkData});
                }
                if(save){
                  location.hash = save;
                }
              }else{
                Message.error(data.retMsg);
              }
            })
          }
          if(current == 2){
            const values = { ...fieldsValue, ...this.state.id };
              postService(ServiceApi + url, values, data => {
                if (data.retCode === 1) {
                  Message.success('保存成功!');
                  let id = { id: data.root.id };
                  this.setState({ id})
                  this.props.setIsSubmit(false); //关闭缓存
                  let leaveData = { ...this.props.leaveData };//保存完之后缓存置空
                  leaveData[this.props.belonged] = {};
                  this.props.setLeaveData(leaveData);
                  if(save){
                    location.hash = save;
                  }
                } else {
                  Message.error(data.retMsg);
                }
              })
          }
        }
      })
    },0)
  }


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
              initialValue={this.dealGetData(item.data)}
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
              <FormWrapper key={this.state.updateFormWrapper} flowData={flowData}  disabled={disabled} disappear={disappear} initialValue={item.data ? this.dealGetData(item.data) : null} {...this.props}  />
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
        {
          this.props.style === 'add' ? 
          (
            <div>
              <Steps current={current}>
                {
                  steps.map(item => <Step key={item.title} title={item.title}/>)
                }
              </Steps>
              <Row>
                <Form onSubmit={this.handleSubmit}>
                  {
                    steps.map((item, index) => {
                        if (current === index) {
                            return item.content;
                        }
                    })
                  }
                  {
                    this.state.current === 0 && 
                    (
                      <Row className="center">
                        <Button className="resetBtn"><Link to={this.props.save}>返回</Link></Button>
                        <Button className="queryBtn" onClick={this.handleSubmit}>保存</Button>
                        <Button className="queryBtn" onClick={e => this.handleSubmit(e, 'next')}>保存并下一步</Button>
                      </Row>
                    )
                  }
                  {
                    this.state.current === 1 && 
                    (
                      <Row className="center">
                        <Button className="resetBtn" onClick={this.prev}>上一步</Button>
                        <Button className="queryBtn" onClick={this.handleSubmit}>保存</Button>
                        <Button className="queryBtn" onClick={e => this.handleSubmit(e, 'next')}>保存并下一步</Button>
                      </Row>
                    )
                  }
                  {
                    this.state.current === 2 && 
                    (
                      <Row className="center">
                        <Button className="resetBtn" onClick={this.prev}>上一步</Button>
                        <Button className="queryBtn" onClick={this.handleSubmit}>保存</Button>
                      </Row>
                    )
                  }
                </Form>
              </Row>
            </div>
          ) : 
          (
            <div>
              <Tabs activeKey={current} animated={false} onChange={this.tabChange}>
                {
                  steps.map((item, index) => {
                    return (
                      <TabPane tab={item.title} key={index}>
                        {item.content}
                        <Row className="center">
                          <Button className="resetBtn" onClick={() => location.hash=this.props.save}>返回</Button>
                          <Button  className="queryBtn" onClick={this.handleSubmit}>保存</Button>
                        </Row>
                      </TabPane>
                    )
                  })
                }
              </Tabs>
            </div>
          )
        }
      </div>
    )
  }
}