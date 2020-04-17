import React, {Component} from 'react';

import {Modal} from 'antd';

/**
 * 建议用ref方式控制打开、关闭的Modal
 * + getInstance--获取当前modal实例，格式为fun(instance)
 * + Modal组件的props
 */
class RefModal extends Component {
  /**
   * 
   * @param {*} props 
   * @param {*} modalProps 使用此组件为父类时，可用此参数把Props传给Modal组件
   */
  constructor(props, modalProps) {
    super(props);
    this.state = {
      visible: false,
      modalProps,
    }

    if (this.props.getInstance) {
      this.props.getInstance(this);
    }
  }

  show() {
    this.setState({visible: true});
  }

  close() {
    this.setState({visible: false});
    if (this.props.form) {
      this.props.form.resetFields();
    }
  }

  /**
   * 使用此组件为父类时，可用此方法给modal创建子元素
   */
  renderChildren() {
    return null;
  }

  createModalProps() {
    return {};
  }

  render() {
    return (
      <Modal {...this.props} {...this.state.modalProps} {...this.createModalProps()} visible={this.state.visible} onCancel={() => this.close()}>
        {
          this.renderChildren()
        }
        {
          this.props.children
        }
      </Modal>
    );
  }
}

export default RefModal;