import React, { Component } from 'react';
import { Form, Input, Button, message, Spin } from 'antd';
import './AddMessageNotice.less';
import { connect } from 'react-redux';
import API_PREFIX from '../apiprefix';
import MultipleTree from '../../component/EventAndInfoAdd/MultipleTree';
import { postService } from '../myFetch';


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
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  addMessage() {
    //从this.props.treeData中可以获取到选中的部门，党组织，虚拟群组等信息
    console.log('tree data', this.props);
    // let title = this.props.form.getFieldValue('title');
    let content = this.props.form.getFieldValue('content');

    //部门Id列表
    let orgsyncidList = this.props.treeData.department_messageNotice;
    let messageIdList = this.props.treeData.partyid_messageNotice;
    let groupidList = this.props.treeData.virtualgroupid_messageNotice;

    //如果未选择任何部门，提示用户
    if ((!orgsyncidList || orgsyncidList.length === 0)
      && (!groupidList || groupidList.length === 0)
      && (!messageIdList || messageIdList.length === 0)) {
      message.warn('请至少选择一个部门');
    }
    else {
      this.setState({ loading: true });
      postService(API_PREFIX + "services/message/message/addMessageNotification/add",
        {
          content,
          // title,
          orgsyncidList,
          groupidList,
          messageIdList,
        },
        (res) => {
          this.setState({ loading: false });
          if (res.retCode === 1) {
            window.location.hash = 'Message/Notice';
          }
          else {
            message.error(res.retMsg);
          }
        });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="AddMessageNotice">
        <Spin spinning={this.state.loading}>
          <Form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              this.props.form.validateFields((err, values) => {
                if (!err) {
                  console.log('Received values of form: ', values);
                  this.addMessage();
                }
              });
            }}
          >
            {/* <FormItem label="标题"  {...FormItemLayout}>
            {
              getFieldDecorator('title', {
                rules: [
                  { required: true, message: '请输入标题' },
                  { max: 20, message: '标题不能超过20个字符' },
                ],
              })(<Input />)
            }
          </FormItem> */}
            <FormItem label="内容" {...FormItemLayout}>
              {
                getFieldDecorator('content', {
                  rules: [
                    { required: true, message: '请输入内容' },
                    { max: 100, message: '内容不能超过100个字符' },
                  ],
                })(<TextArea />)
              }
            </FormItem>
            <hr />
            <FormItem>
              <MultipleTree
                type="messageNotice"
                enable={true}
                disabled={false}
                add='add'
                datatype='notice'
              />
            </FormItem>
            <FormItem className="formItemControl" wrapperCol={{ span: 24 }}>
              <Button type="primary" className="resetBtn" onClick={() => {
                window.location.hash = '/Message/Notice';
              }}>返回</Button>
              <Button type="primary" className="queryBtn" htmlType="submit">确认</Button>
            </FormItem>
          </Form>
        </Spin>
      </div>
    );
  }
}

export default AddMessageNotice;