import React, { Component } from 'react';

import { Modal, Input } from 'antd';


class CheckModal extends Component {
  /**
   * 
   * @param {*} props 
   * @param {*} modalProps 使用此组件为父类时，可用此参数把Props传给Modal组件
   */
  constructor(props, modalProps) {
    super(props);
    this.state = {
      visible: false,
      reason: '',
      modalProps,
    }

    if (this.props.getInstance) {
      this.props.getInstance(this);
    }
  }

  onOk = () => {
    if (this.props.onOk) {
      this.props.onOk(this.state.reason)
    }
  }

  show = () => {
    this.setState({ visible: true });
  }

  close = () => {
    this.setState({ visible: false });
  }

  onChange = (e) => {
    this.setState({ reason: e.target.value })
  }

  render() {
    return (
      <Modal
        {...this.props}
        maskClosable
        title="审核意见"
        destroyOnClose
        visible={this.state.visible}
        onOk={this.onOk}
        onCancel={() => this.close()}>
        <Input.TextArea rows={3} placeholder="类目描述" onChange={this.onChange} />
      </Modal>
    );
  }
}

export default CheckModal;