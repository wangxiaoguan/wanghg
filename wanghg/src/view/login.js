import React, { Component } from 'react';
import { Form, Card, message, Input, Checkbox, Select, Row, Col } from 'antd';
import { connect } from 'react-redux';
import store from '../redux-root/store';
import { getPowers } from '../redux-root/action/powers';
import './login.less';
import { Button } from 'antd';
import { sidebarMenu } from '../router/models';
import { postService, getService } from './content/myFetch';
import API_PREFIX from './content/apiprefix';
import $ from 'jquery';
// import filterRouter from '../router/filterRouter';
//import sidebarMenu from '../router/models';
const icon_logo = require('../styles/images/login/logo_WC.png');
const icon_user = require('../styles/images/login/icon_user.png');
const icon_pasword = require('../styles/images/login/icon_pasword.png');
const icon_verification = require('../styles/images/login/icon_verification.png');
const FormItem = Form.Item;
var mydate = new Date();
var uuid = "cms" + mydate.getDay() + mydate.getHours() + mydate.getMinutes() + mydate.getSeconds() + mydate.getMilliseconds();//根据时间来自动生成uuid，保证生成的id是唯一的
const getsidebarMenu = (obj, powers) => {

  let arr = [];
  obj.forEach(v => {
    if (v.subMenu) {
      const arr2 = getsidebarMenu(v.subMenu, powers);
      if (arr2.length > 0) {
        arr = [...arr, ...arr2]
      }
    } else {
      if (v === undefined || powers[v]) {
        arr.push(v.url);
      }
    }
  });
  return arr;

};
@Form.create()
@connect(
  state => ({
    powers: state.powers,
  })
)
class HorizontalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }


  componentDidMount() {
   

  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log("values", values)
      if (values.username == '123456' && values.password == '123456' ){
        location.hash='/PersonalWork/Examine'
      }else {
        message.error('请重新输入')
      }
    });
  };
  
  
 
  
  render() {

    const { getFieldDecorator} = this.props.form;
   
    return <div className="login-card">
      
      <Form layout="horizontal" onSubmit={this.handleSubmit} className="login-form">
       
            <FormItem >
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户名',
                  },
                ],
                initialValue:''
              })(<Input  className="login-input" placeholder="请输入用戶名" />)}
            </FormItem>
         
           
         

       
        <FormItem >
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: '请输入密码',
              },
            ],initialValue:''
          })(<Input className="login-input"     placeholder="请输入密码" />)}
        </FormItem>
    
        <FormItem>
          <Button className="login-btn" onClick={this.handleSubmit}>登录</Button>
        </FormItem>
      </Form>
      
    </div>;
  }
}

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="login-main">
      <div className="login-middle">
        <div className="login-warpper">
          <HorizontalLoginForm />
        </div>
      </div>
    </div>;
  }
}
