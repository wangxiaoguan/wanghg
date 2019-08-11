import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import './AddMessageNotice.less';
import { connect } from 'react-redux';
import MultipleTree from '../../component/EventAndInfoAdd/MultipleTree';


const FormItem = Form.Item;
const { TextArea } = Input;
const FormItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 10 },
};

@connect(
  state => ({
    treeData: state.tree.treeCheckData,
  })
)
@Form.create()
class AddMessageNotice extends Component {
  render() {
    console.log(this.props.form);
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="AddMessageNotice">
        <Form
          className="form"
          onSubmit={(e) => {

            //从this.props.treeData中可以获取到选中的部门，党组织，虚拟群组等信息
            console.log('tree data', this.props);
            e.preventDefault();
            this.props.form.validateFields((err, values) => {
              if (!err) {
                console.log('Received values of form: ', values);
              }
            });
          }}
        >
          <FormItem label="标题" required={true} {...FormItemLayout}>
            {
              getFieldDecorator('title')(<Input />)
            }
          </FormItem>
          <FormItem label="内容" required={true} {...FormItemLayout}>
            {
              getFieldDecorator('content')(<TextArea />)
            }
          </FormItem>
          <hr />
          <FormItem>
            <MultipleTree type="messageNotice" />
          </FormItem>
          <FormItem className="formItemControl" wrapperCol={{ span: 24 }}>
            <Button type="primary" className="resetBtn" onClick={() => {
              window.location.hash = '/Message/Notice';
            }}>返回</Button>
            <Button type="primary" className="queryBtn" htmlType="submit">确认</Button>
          </FormItem>
        </Form>
      </div >
    );
  }
}

export default AddMessageNotice;