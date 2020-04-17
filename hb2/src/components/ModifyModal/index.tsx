import React, { Component } from 'react';
import { Form, Modal } from 'antd';
import IFormAndDvaInterface from '@/Interfaces/IFormAndDvaInterface';
import FormItem from 'antd/lib/form/FormItem';
import { connect } from 'dva';

const formLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ loading }) => ({
  loading,
}))
class ModifyModal extends Component<IFormAndDvaInterface, any> {

  render() {
    const formItems = this.props.createFormItemList();
    return (
      <Modal
        visible={this.props.visible}
        onOk={() => this.props.submit()}
        onCancel={() => {this.props.clear();}}
        title='用户信息修改'
        destroyOnClose={true}
      >
        <Form>
          {formItems &&
            formItems.map(item => {
              return (
                <FormItem key={item.label} {...formLayout} label={item.label}>
                  {item.content}
                </FormItem>
              );
            })}
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ModifyModal);
