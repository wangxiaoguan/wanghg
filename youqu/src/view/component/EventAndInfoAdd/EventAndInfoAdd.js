import React, { Component } from 'react';
import { Row, Form, Steps, Button, Tabs, Message, Modal,Col } from 'antd';
import { getService, postService, GetQueryString} from '../../content/myFetch';
import { setEventData, setLeaveData, setIsSubmit,setTimePushData} from '../../../redux-root/action';
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
    AllTreeData: state.treeCheckData,
    selectTreeData: state.column,
    uploadData: state.uploadPictureData,
    editorData: state.editorData,
    flowData: state.flowData,
    timePushData: state.timePushData,
    leaveModal: state.leaveModal,
    leaveData: state.leaveData,
    isSubmit:state.isSubmit,
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
  dealGetData = data => {return data}
  handleSubmit = (e, type, linkTo, save, online, leave) => {
    setTimeout(() => {
      const { current } = this.state;
      e && e.preventDefault();
      this.props.form.validateFields((err, fieldsValue) => {
        if (!err) {
          console.log(fieldsValue)
          if (current == 0) {
            if (type === 'next') {
              this.next(fieldsValue);
            }else if (save) {
              location.hash = save;
            }
            this.props.setIsSubmit(false);
            let leaveData = { ...this.props.leaveData };
            leaveData[this.props.belonged] = {};
            this.props.setLeaveData(leaveData);
          }
          if (current == 1) {
              this.props.setIsSubmit(false);
              let leaveData = { ...this.props.leaveData };
              leaveData[this.props.belonged] = {};
              this.props.setLeaveData(leaveData);
              if (type === 'next') {
                this.next({ ...fieldsValue, ...this.state.checkData});
              }else if (save) {
                location.hash = save;
              }
          }
           
          if (current == 2) {
            if (save) {location.hash = save}
            this.props.setIsSubmit(false);
            let leaveData = { ...this.props.leaveData };
            leaveData[this.props.belonged] = {};
            this.props.setLeaveData(leaveData);
          }
        }
      })
    }, 0)
  };
  tabChange = value => {
    this.setState({ current: value, updateFormWrapper: this.state.updateFormWrapper+1});
  };
  componentWillUnmount() {
    let isSubmit = this.props.isSubmit;
    if (isSubmit==='ok') {
      let fieldsValue = this.props.form.getFieldsValue();
      let leaveData = this.props.leaveData;
      leaveData[this.props.belonged] = {};
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
    console.log('------------------------------->',this.props)
    console.log('===============================>',this.state)
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