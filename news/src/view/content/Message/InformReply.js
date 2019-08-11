import React, { Component } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { getService, postService } from '../myFetch';
import ServiceApi, { PictrueUrl,ChooseUrl,API_FILE_VIEW_INNER } from '../apiprefix';
import Zmage from 'react-zmage';

import './InformReply.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const FormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

/**
 * 举报管理处理窗口
 * id--举报消息id
 * replyHandler--处理成功后，回调的函数
 */
class InformReply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  requestData() {
    if (this.props.id) {
      getService(ServiceApi + `services/message/report/reportInfo/get/${this.props.id}`, (res) => {
        this.setState({ data: res.root.object });
      });
    }
  }

  requestReply() {
    if (this.props.id) {
      postService(ServiceApi + `services/message/report/updateDispose/${this.state.reply}/${this.props.id}`, null, (res) => {
        this.afterDeal(res);
      });
    }
  }

  requestIgnore() {
    if (this.props.id) {
      postService(ServiceApi + `services/message/report/updateNeglect/${this.state.reply}/${this.props.id}`, null, (res) => {
        this.afterDeal(res);
      });
    }
  }

  afterDeal(res) {
    if (res.retCode === 1) {
      message.success('操作成功');
      this.close();
      if (this.props.replyHandler) {
        this.props.replyHandler();
      }
    }
    else {
      message.error(res.retMsg);
    }
  }

  show = () => {
    this.setState({ visible: true });
    this.requestData();
  }

  close = () => {
    this.setState({ visible: false });
    this.setState({ data: {} });
  }

  saveReply = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.close();
      this.setState({ loading: false });
    }, 1000);
  }

  render() {
    let { data } = this.state;
    let imgUrl = [];
    if (!data) {
      data = {};
    }
    else if (data.imageUrl) {
      imgUrl = JSON.parse(data.imageUrl);
    }
    return (
      <Modal className="InformReply" title="回复" visible={this.state.visible} onCancel={this.close} onOk={this.saveReply} confirmLoading={this.state.loading}
        footer={
          <div>
            <Button onClick={() => { this.close(); }}>返回</Button>
            <Button type="danger" onClick={() => {
              this.requestIgnore();
            }}>忽略</Button>
            <Button type="primary" onClick={() => {
              this.requestReply();
            }}>接受并处理</Button>
          </div>
        }
      >
        <Form>
          <FormItem label="被举报人" {...FormItemLayout}>
            <span>{data.bname}</span>
          </FormItem>
          <FormItem label="被举报人手机号" {...FormItemLayout}>
            <span>{data.bmobile}</span>
          </FormItem>
          <FormItem label="举报人" {...FormItemLayout}>
            <span>{data.jname}</span>
          </FormItem>
          <FormItem label="举报人手机号" {...FormItemLayout}>
            <span>{data.jmobile}</span>
          </FormItem>
          <FormItem label="举报原因" {...FormItemLayout}>
            <span>{data.reason}</span>
          </FormItem>
          <FormItem label="举报描述" {...FormItemLayout}>
            <span>{data.describle}</span>
          </FormItem>
          <FormItem label="举报内容" {...FormItemLayout}>
            <span>{data.content}</span>
          </FormItem>
          <FormItem className="itemImage" label="举报图片" {...FormItemLayout}>
            {
              imgUrl &&
              imgUrl.map((item) => {
                return <span>
                  {ChooseUrl==1?<Zmage src={PictrueUrl + item} alt="" />:<Zmage src={API_FILE_VIEW_INNER + item} alt="" />

                  }
                </span>
                
                
                
              })
            }
          </FormItem>
          <FormItem label="处理批注" {...FormItemLayout}>
            <TextArea value={this.state.reply} style={{ resize: 'none', height: 100 }} onChange={(event) => {
              this.setState({ reply: event.target.value.substr(0, 200) });
            }} />
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default InformReply;