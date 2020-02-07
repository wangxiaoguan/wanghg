import React, { Component } from 'react';
import { Modal, Form, Input, message } from 'antd';
import Zmage from 'react-zmage';
import { postService, getService } from '../myFetch';
import API_PREFIX, { API_FILE_VIEW, API_FILE_VIEW_INNER, API_CHOOSE_SERVICE } from '../apiprefix';
import './IdeaReply.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const FormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

/**
 * 意见反馈回复
 * id--意见id
 * replyHandler--回复成功的回调函数
 */
class IdeaReply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  requestData() {
    if (this.props.id) {
      getService(API_PREFIX + `services/message/feedback/feedbackInfo/get/${this.props.id}`, (res) => {
        this.setState({ data: res.root.object });
      });
    }
  }

  requestReply() {
    //限制回复内容为空 2019.1.12 wkjj
    let replyContents = this.state.replyContent.replace(/(^\s*)|(\s*$)/g, '');//去除空格;
    if(replyContents === ''|| replyContents === undefined || replyContents === null){
      message.error('请填写回复内容!');
      return false;
    }
    this.setState({ loading: true });
    postService(API_PREFIX + `services/message/feedback/update/${this.props.id}`,
      {
        id: this.props.id,
        replyContent: this.state.replyContent,
      },
      (res) => {
        this.setState({ loading: false });
        if (res.retCode === 1) {
          //回复成功后清空回复内容 2019.1.12 wkjj
          this.state.replyContent='';
          message.success('回复成功');
          this.close();
          if (this.props.replyHandler) {
            this.props.replyHandler();
          }
        }
        else {
          message.error(res.retMsg);
        }
      });
  }

  show = () => {
    this.setState({ visible: true });
    this.requestData();
  }

  close = () => {
    this.setState({ visible: false });
  }

  saveReply = () => {
    this.requestReply();
  }

  render() {
    let { data } = this.state;
    if (!data) {
      data = {};
    }
    let images = [];
    // if (data.imageurl) {
    //   images = JSON.parse(data.imageurl);
    // }
    console.log(data)
    if(JSON.stringify(data)!="{}"&&data.imageurl){

      images=JSON.parse(data.imageurl)
    }
    console.log(images)
    let src = ''
    console.log('啊哦结构设计公司加哦就哦接送机哦接送给', this.props)
    if(this.props.typeInfo == 4) {
        src = 'http://yq-fiberhome-prod.img-cn-hangzhou.aliyuncs.com/' //电脑版反馈的意见图片前缀
    }else {
        src = 'http://yq-common-prod.img-cn-hangzhou.aliyuncs.com/'  //app反馈的意见图片前缀
    }
    return (
      <Modal className="IdeaReply" title="回复" visible={this.state.visible} onCancel={this.close} onOk={this.saveReply} confirmLoading={this.state.loading}>
        <Form>
          <FormItem label="意见类型" {...FormItemLayout}>
            <span>{data.name}</span>
          </FormItem>
          <FormItem label="意见描述" {...FormItemLayout}>
            <span>{data.content}</span>
          </FormItem>
          <FormItem className="formItemImage" label="图片" {...FormItemLayout}>
            {
              images && images.length > 0 ?
                images.map((item, index) => {
                  return (
                    <span>
                      {/* {API_CHOOSE_SERVICE === 1 ? <Zmage key={index} 
                      // src={API_FILE_VIEW + item} 
                      src={item}
                      alt='' /> :
                        <Zmage key={index} src={API_FILE_VIEW_INNER + item} alt='' />
                      } */}
                      {/* <Zmage key={index} src={`http://yq-common-prod.img-cn-hangzhou.aliyuncs.com/${item}`} alt='' /> */}
                      <Zmage key={index} src={`${src}${item}`} alt='' />
                    </span>
                  );
                }) : <span>无图片</span>
            }
          </FormItem>
          <FormItem label="回复" {...FormItemLayout}>
            <TextArea 
              value={this.state.replyContent} 
              style={{ resize: 'none', height: 100 }} 
              onChange={(event) => {
                  this.setState({ replyContent: event.target.value.substr(0, 200) });
                }
              } 
            />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default IdeaReply;