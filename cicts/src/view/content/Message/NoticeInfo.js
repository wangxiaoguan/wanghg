import React, { Component } from 'react';
import { Modal, Form } from 'antd';
import API_PREFIX from '../apiprefix';
import { getService } from '../myFetch';
const FormItem = Form.Item;

const FormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
/**
 * 通知详情
 */
class NoticeInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      visible: false,
    };
  }

  show = () => {
    this.setState({ visible: true });
  }

  close = () => {
    this.setState({ visible: false });
  }

  requestData() {
    if (this.props.id) {
      getService(API_PREFIX + 'services/message/message/messageInfo/get/' + this.props.id,
        (res) => {
          this.setState({ data: res.root.object });
        });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if ((this.state.visible && !prevState.visible) || prevProps.id !== this.props.id) {
      this.requestData();
    }
  }

  render() {
    let { data } = this.state;
    return (
      <Modal visible={this.state.visible} title="通知详情" onCancel={() => this.close()}
        footer={null}>
        {/* <Form>
          <FormItem label="发布人" >
            <span>{data.name}</span>
          </FormItem>
          <FormItem label="内容" >
            <label>内容：</label> <span>{data.content}</span>
          </FormItem>
          <FormItem label="添加日期" >
            {data.createdate}
          </FormItem>
        </Form> */}
        <p>发布人：{data.name}</p>
        <p>内容：{data.content}</p>
        <p>添加日期：{data.createdate}</p>
      </Modal>
    );
  }
}

export default NoticeInfo;