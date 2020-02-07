import React, { Component } from 'react';
import { Form, Card, message, Input, Button, Checkbox, Select, Row, Col } from 'antd';
import { connect } from 'react-redux';
import store from '../redux-root/store';
import { getPowers } from '../redux-root/action';
import './login.less';
import { sidebarMenu } from '../router/models';
const FormItem = Form.Item;
@Form.create()
@connect(
  state => ({
    powers: state.powers,
  })
)

export default class Login extends Component {
  constructor(props) {
    super(props);
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(values.username == '123456' && values.password == '123456' ){
        location.hash='/InformationManagement/Article'
      }else {
        message.error('请重新输入')
      }
    });
  };
  render() {
    const { getFieldDecorator} = this.props.form;
    return <div className="login-main">
      <div className="login-middle">
        <div className="login-warpper">
          <div className="login-card">
            <Form layout="horizontal" onSubmit={this.handleSubmit} className="login-form">
              <FormItem >
                {
                  getFieldDecorator('username', {
                    rules: [{required: true,message: '请输入用户名'}],
                    initialValue:'123456'
                  })
                  (<Input  className="login-input" placeholder="请输入用戶名" />)
                }
              </FormItem>
              <FormItem >
                {
                  getFieldDecorator('password', {
                    rules: [{required: true,message: '请输入密码'}],
                    initialValue:'123456'
                  })
                  (<Input className="login-input"     placeholder="请输入密码" />)
                }
              </FormItem>
              <FormItem>
                <Button className="login-btn" onClick={this.handleSubmit}>登录</Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    </div>
  }
}
