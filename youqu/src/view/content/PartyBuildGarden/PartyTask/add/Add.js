import React, { Component } from 'react';
import { Form, Icon, Steps, Input, Button, Row, Col, Select, Modal, Checkbox, DatePicker, InputNumber, Radio } from 'antd';
import {
  PartyTaskList, //党建任务列表
} from '../../URL';
import ServiceApi from '../../../apiprefix';
import { postService, GetQueryString, getService } from '../../../myFetch.js';
import '../add.css';
import { setFormData, setTopicId, setPartyId, setRecevicer, setArticleData, setArticleAdd, setActivityData, setActivityAdd, setFileAdd, setFileData } from '../../../../../redux-root/action';

import AddBase from './AddBase';
import AddRecevicer from './AddRecevicer';
import { connect } from 'react-redux';
const Step = Steps.Step;
@connect(
  state => ({
    getFormData: state.getFormData,
    getRecevicer: state.getRecevicer,
  }),
  dispatch => ({
    setTopicId: n => dispatch(setTopicId(n)),
    setPartyId: n => dispatch(setPartyId(n)),
    setFormData: n => dispatch(setFormData(n)),
    setRecevicer: n => dispatch(setRecevicer(n)),
    setArticleData: n => dispatch(setArticleData(n)),
    setArticleAdd: n => dispatch(setArticleAdd(n)),
    setActivityData: n => dispatch(setActivityData(n)),
    setActivityAdd: n => dispatch(setActivityAdd(n)),
    setFileData: n => dispatch(setFileData(n)),
    setFileAdd: n => dispatch(setFileAdd(n)),
    setTopicId: n => dispatch(setTopicId(n)),
    setPartyId: n => dispatch(setPartyId(n)),
  })
)
export default class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,//当前处于第几步   从0开始
    }
  }
  componentWillMount() {
    //页面相关的数据处理
    this.dealData();
  }
  dealData = () => {
    //将reduce中的数据置空
    this.props.setFormData({});
    this.props.setPartyId('');
    this.props.setTopicId('');
    this.props.setRecevicer('');
    this.props.setArticleData('');
    this.props.setArticleAdd('');
    this.props.setActivityData('');
    this.props.setActivityAdd('');
    this.props.setFileData('');
    this.props.setFileAdd('');
    this.props.setTopicId('');
    this.props.setPartyId('');

  }
  next = () => {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev = () => {
    const current = this.state.current - 1;
    this.setState({ current });
  }
  render() {
    console.log('flowData取出', this.props.getFormData);
    const steps = [{
      title: '填写任务信息',
      content: <AddBase
        next={this.next}
        flowData={this.props.getFormData}
      />,
    }, {
      title: '设置接收人',
      content: <AddRecevicer
        prev={this.prev}
        flowData={this.props.getRecevicer}
      />,
    }];
    const { current } = this.state;
    return (
      <div>
        <Steps current={current}>
          {
            steps.map((item) => {
              return (
                <Step key={item.title} title={item.title} />
              )
            })
          }
        </Steps>
        <div  >{steps[current].content}</div>
      </div>

    );
  }
}