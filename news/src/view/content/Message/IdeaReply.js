import React, { Component } from 'react';
import { Modal, Form, Input, message } from 'antd';
import Zmage from 'react-zmage';
import { postService, getService } from '../myFetch';
import ServiceApi, { PictrueUrl,API_FILE_VIEW_INNER,ChooseUrl } from '../apiprefix';
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
      getService(ServiceApi + `services/message/feedback/feedbackInfo/get/${this.props.id}`, (res) => {
        this.setState({ data: res.root.object });
      });
    }
  }

  requestReply() {
    this.setState({ loading: true });
    postService(ServiceApi + `services/message/feedback/update/${this.props.id}/${this.state.replyContent}`,
      {
        id: this.props.id,
        replyContent: this.state.replyContent,
      },
      (res) => {
        this.setState({ loading: false });
        if (res.retCode === 1) {
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
    if (data.imageurl) {
      images = JSON.parse(data.imageurl);
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
              images &&
              images.map((item, index) => {
                return <span>
                  {ChooseUrl==1?<Zmage key={index} src={PictrueUrl + item} alt='' />:
                    <Zmage key={index} src={API_FILE_VIEW_INNER + item} alt='' />
                  }
                </span>
                
                
              })
            }
          </FormItem>
          <FormItem label="回复" {...FormItemLayout}>
            <TextArea value={this.state.replyContent} style={{ resize: 'none', height: 100 }} onChange={(event) => {
              this.setState({ replyContent: event.target.value.substr(0, 200) });
            }} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default IdeaReply;