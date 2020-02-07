import React, { Component } from 'react';
import { Form, Card, message, Input, Checkbox, Select, Row, Col } from 'antd';
import { connect } from 'react-redux';
import store from '../redux-root/store';
import { getPowers } from '../redux-root/action/powers';
import { setAuthInfo } from '../redux-root/action/login'
import './login.less';
import { Button } from 'antd';
import { sidebarMenu } from '../router/models';
import { merchatSidebarMenu } from '../router/merchantModels';
import { postService, getService } from './content/myFetch';
import API_PREFIX from './content/apiprefix';
import $ from 'jquery';
// import filterRouter from '../router/filterRouter';
//import sidebarMenu from '../router/models';
const icon_logo = require('../styles/images/login/logo.png');
const icon_user = require('../styles/images/login/icon_user.png');
const icon_pasword = require('../styles/images/login/icon_pasword.png');
const icon_verification = require('../styles/images/login/icon_verification.png');
const FormItem = Form.Item;
let mydate = new Date();
let uuid = "cms" + mydate.getDay() + mydate.getHours() + mydate.getMinutes() + mydate.getSeconds() + mydate.getMilliseconds();//根据时间来自动生成uuid，保证生成的id是唯一的
const getsidebarMenu = (obj, powers) => {

  let arr = [];
  obj.forEach(v => {
    if (v.subMenu) {
      const arr2 = getsidebarMenu(v.subMenu, powers);
      if (arr2.length > 0) {
        arr = [...arr, ...arr2];
      }
    } else {
      if (v.power === undefined || powers[v.power]) {
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
  }),
  dispatch => ({
    setAuthInfo: n => dispatch(setAuthInfo(n)),

  })
)
class HorizontalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: '',
      uuid: "cms" + mydate.getDay() + mydate.getHours() + mydate.getMinutes() + mydate.getSeconds() + mydate.getMilliseconds(),
      url: "http://10.110.200.62:443/services/system/captcha/validateCode/",
      showPassword: false,
      verification: 200,
      choose: false,
      company: [],
    };
  }


  componentDidMount() {
    if (window.localStorage.getItem('company')) {
      this.props.form.setFieldsValue({
        username: window.localStorage.acount,
      });
    }

  }
  onkeydown = (event) => {
    let e = event || window.event;
    if (e.keyCode === 13) {
      this.handleSubmit(e);
    }
  };

  //正式登录
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if ((values.username == undefined && values.password == undefined) || (values.username == '' && values.password == '')) {
        //this.setState({msg : '请输入用户名密码!'});
        message.error('请输入用户名密码!');
      } else if ((values.username == undefined || values.username == '') && (values.password != undefined || values.password != '')) {
        //this.setState({msg : '请输入用户名!'});
        message.error('请输入用户名!');
      } else if ((values.username != undefined || values.username != '') && (values.password == undefined || values.password == '')) {
        //this.setState({msg : '请输入密码!'});
        message.error('请输入密码!');
      }
      /*      else if((values.password != undefined || values.password != '') && (values.verification == undefined || values.verification == '')){
              //this.setState({msg : '请输入验证码!'});
              message.error('请输入验证码!')
            }*/
      else if (this.state.choose && (values.tenantId == undefined)) {
        message.error('请选择登录企业!');
      }
      else {
        if (!err) {
          // getService(API_PREFIX + `services/system/captcha/checkCaptcha/` + this.state.uuid + '/' + values.verification, data => {
          //   this.setState({
          //     verification: data.retCode == 1 ? 200 : 500
          //   }, () => {
          if (this.state.company.length == 1) {
            values.tenantId = this.state.company[0].id;
          }
          if (values.userOrMerchantLogin == 1) {
            this.userLogin(values)
          } else if (values.userOrMerchantLogin == 2) {
            this.merchantLogin(values)
          }
          console.log('哈哈哈哈哈哈哈呵哈', values)
          return
        }
      }
    });
  };

  userLogin = (values) => {
    // delete values.userOrMerchantLogin
    values.rememberMe = 'true';//调试接口参数，调试完毕后需删除xwx2019/7/25
    $q.post($q.url + '/web/security/login', JSON.stringify(values), data => {//正式接口xwx2019/7/25                
      if (data.status === 1) {
        this.props.setAuthInfo(data.root.authInfo);
        window.localStorage.setItem("LoginauthInfo", JSON.stringify(data.root.authInfo))
        sessionStorage.setItem('loginUserOrMerchant', 1)
        let authInfo = data.root.authInfo;
        if (authInfo.dataResource.orgIds) {//部门
          window.sessionStorage.authorityOrgIds = authInfo.dataResource.orgIds.join(',') ? authInfo.dataResource.orgIds.join(',') : 'no'
        }
        if (authInfo.dataResource.partyIds) {//党组织
          window.sessionStorage.authorityPartyIds = authInfo.dataResource.partyIds.join(',') ? authInfo.dataResource.partyIds.join(',') : 'no'
        }
        if (authInfo.dataResource.virtualGroupIds) {//虚拟圈
          window.sessionStorage.authorityGroupIds = authInfo.dataResource.virtualGroupIds.join(',') ? authInfo.dataResource.virtualGroupIds.join(',') : 'no'
        }
        if (authInfo.dataResource.unionIds) {//虚拟圈
          window.sessionStorage.authorityUnionIds = authInfo.dataResource.unionIds.join(',') ? authInfo.dataResource.unionIds.join(',') : 'no'
        }
        if (!authInfo.dataResource.orgIds && !authInfo.dataResource.partyIds && !authInfo.dataResource.virtualGroupIds && !authInfo.dataResource.unionIds) {
          window.sessionStorage.removeItem("authorityOrgIds");
          window.sessionStorage.removeItem("authorityPartyIds");
          window.sessionStorage.removeItem("authorityGroupIds");
          window.sessionStorage.removeItem("authorityUnionIds");
        }
        window.sessionStorage.userName = data.root.authInfo.name;
        window.localStorage.acount = data.root.authInfo.account;
        window.sessionStorage.tenantId = data.root.authInfo.tenantId;
        //window.sessionStorage.orginfo = data.orginfo;
        if (data.root.authInfo.account === '') {//增加判断acount为空时，显示用户名xwx2018/12/27
          window.sessionStorage.acount = data.name;
        } else {
          window.sessionStorage.acount = data.root.authInfo.account;
        }
        if (data.root.ossViewPath) {
          window.sessionStorage.ossViewPath = data.root.ossViewPath;
        }
        window.sessionStorage.id = data.root.authInfo.userId;
        window.sessionStorage.password = values.password;
        window.sessionStorage.roleIds = data.root.authInfo.roles;
        window.sessionStorage.userRoleLevel = data.root.authInfo.level;
        if (values.username === 'root' && data.root.authInfo.permissions.length === 0) {
          store.dispatch(getPowers(false));
        } else if (data.root.authInfo.permissions && data.root.authInfo.permissions.length == 0) {
          message.error('当前账户没有权限');
          store.dispatch(getPowers(false));
          //this.setState({ msg: '当前账户没有权限' });
        } else {
          let obj = {};
          data.root.authInfo.permissions && data.root.authInfo.permissions.map(v => {
            obj[v] = true;
          });
          store.dispatch(getPowers(obj));
        }
        window.sessionStorage.permissions = data.root.authInfo.permissions;
        const powers = this.props.powers;
        const models = sidebarMenu;
        // const models = merchatSidebarMenu
        let url = getsidebarMenu(models, powers);
        location.hash = url[0];

      } else {
        message.error(data.errorMsg);
        this.refresh();
      }
    });
  }
  merchantLogin = (values) => {
    // delete values.userOrMerchantLogin
    $q.post($q.url + '/web/merchant/login', JSON.stringify(values), res => { 
      if (res.status == 1) {
        window.localStorage.removeItem("LoginauthInfo")
        sessionStorage.setItem('loginUserOrMerchant', 2)
        if (res.root.ossViewPath) {
          window.sessionStorage.ossViewPath = res.root.ossViewPath;
        }
        if (res.root.authInfo.acount === '') {//增加判断acount为空时，显示用户名xwx2018/12/27
          window.sessionStorage.acount = res.merchantName;
        } else {
          window.sessionStorage.acount = res.root.authInfo.acount;
        }
        sessionStorage.setItem('merchantId', res.root.authInfo.id)
        location.hash = `MerchantInfomatin`
      } else {
        message.error(res.errorMsg)
      }
    })
  }
  remenberUserChange = (e) => {
    if (e.target.checked && this.props.form.getFieldValue('username') !== '' && this.props.form.getFieldValue('username') != undefined) {
      window.localStorage.remenberUser = this.props.form.getFieldValue('username');
      window.localStorage.isCheck = '1';
    } else {
      window.localStorage.removeItem('remenberUser');
      window.localStorage.removeItem('isCheck');
    }
  }
  /*  remenberUser = (checked) => {
      console.log('username', this.props.form.getFieldValue('username'));
      if (checked && this.props.form.getFieldValue('username') !== ''&&this.props.form.getFieldValue('username') !== 'undefined') {
        window.localStorage.remenberUser = this.props.form.getFieldValue('username');
        window.localStorage.isCheck = '1';
      } else {
        window.localStorage.removeItem('remenberUser');
        window.localStorage.removeItem('isCheck');
      }
    }*/
  //刷新验证码
  refresh = () => {
    let mydate = new Date();
    let uuid = "cms" + mydate.getDay() + mydate.getHours() + mydate.getMinutes() + mydate.getSeconds() + mydate.getMilliseconds();//根据时间来自动生成uuid，保证生成的id是唯一的
    this.setState({
      uuid: uuid,
    });
  }
  onChange = (e) => {
    if (e.target.value !== '' && e.target.value !== undefined) {
      getService(API_PREFIX + `services/web/company/enterprise/list/` + e.target.value, data => {
        if (data.status == 1) {
          this.setState({
            company: data.root.object,
          });
          if (data.root.object.length > 1) {
            this.setState({
              choose: true,
              company: data.root.object,
            });
          } else {
            this.setState({
              choose: false,
            });
          }
        }
        // else {
        //   message.error(data.errorMsg);
        // }
      });
    }
  }
  onBlur = () => {
    //请求企业名称
    if (this.props.form.getFieldValue('username') !== '' && this.props.form.getFieldValue('username') !== undefined) {
      getService(API_PREFIX + `services/web/company/enterprise/list/` + this.props.form.getFieldValue('username'), data => {
        if (data.status == 1) {
          this.setState({
            company: data.root.object,
          });
          if (data.root.object.length > 1) {
            this.setState({
              choose: true,
              company: data.root.object,
            });
          } else {
            this.setState({
              choose: false,
            });
          }
        }
        // else {
        //   message.error(data.errorMsg);
        // }
      });
    }
  }

  render() {
    const { showPassword } = this.state;
    const { getFieldDecorator, getFieldError, isFieldTouched } = this.props.form;
    const userNameError = isFieldTouched('username') && getFieldError('username');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return <div className="login-card" onKeyDown={this.onkeydown}>
      <div className="login-title">
        {/* <img src={icon_logo} /> */}
        {/* <span>-武船党建平台</span> */}
        <span>智慧党建管理平台</span>
      </div>
      <Form layout="horizontal" onSubmit={this.handleSubmit} className="login-form">
        <Row>
          <Col span={this.state.choose ? 12 : 24}>
            <FormItem validateStatus={userNameError ? 'error' : ''} help={userNameError || ''}>
              {getFieldDecorator('username', {
                rules: [],
                initialValue: window.localStorage.remenberUser,
              })(<Input autoFocus="autoFocus" className="login-input" prefix={<img src={icon_user} className="login-icon" />} placeholder="请输入用戶名" onChange={this.onChange} onFocus={this.onBlur} onBlur={this.onBlur} />)}
            </FormItem>
          </Col>
          {
            this.state.choose ? <Col span={12}>
              <FormItem
                validateStatus={userNameError ? 'error' : ''}
                help={userNameError || ''}>
                {getFieldDecorator('tenantId', {
                  rules: [{ required: true, message: '请选择登录企业' }],
                })(
                  <Select placeholder="选择登录企业">
                    {
                      this.state.company.map((item, index) => {
                        return <option key={index} value={item.id}>{item.shortCompanyName}</option>;
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col> : null
          }

        </Row>
        <FormItem validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
          {getFieldDecorator('password', {
            rules: [
              {
                //required: true,
                //message: '请输入密码!',
              },
            ],
            icon_pasword,
          })(<Input className="login-input" prefix={<img src={icon_pasword} className="login-icon" />} type={'password'} placeholder="请输入密码" />)}
        </FormItem>
        <Row style={{marginTop: '-20px'}}>
          <Col offset={12} span={12}>
            <FormItem >
              {getFieldDecorator('userOrMerchantLogin', {
                rules: [
                  {
                    //required: true,
                    //message: '请输入密码!',
                  },
                ],
                initialValue: '1',
              })(
                <Select style={{border: 'none'}} className='selectUser'>
                  <Select.Option key='1' value='1'>企业用户</Select.Option>
                  <Select.Option key='2' value='2'>商家用户</Select.Option>
                </Select>
              )}
            </FormItem>

          </Col>
        </Row>
        {/*    <FormItem validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
          {getFieldDecorator('verification', {
            rules: [
              {
                //required: true,
                //message: '请输入验证码!',
              },
            ],
          })(<div>
            <Input className="login-input-verification" prefix={<img src={icon_verification} className="login-icon" />} type={'input'} placeholder="请输入验证码" />
             <img style={{width:"90px",height:"30px",marginLeft:"16px",borderRadius:"5px",marginTop:"3px"}} onClick={this.refresh.bind(this)} src={this.state.url + this.state.uuid}></img> 
          </div>)}
        </FormItem>*/}
        {/*   <FormItem>
          <Checkbox onChange={this.remenberUserChange} defaultChecked={window.localStorage.isCheck == '1'}>
              记住用户名
          </Checkbox>
        </FormItem>*/}
        <div className="error-msg" style={{ color: 'red', fontSize: 16, marginTop: "10px" }}>
          {this.state.msg}
        </div>
        <FormItem>
          <Button className="login-btn" onClick={this.handleSubmit}>
            登录
          </Button>
        </FormItem>
      </Form>
      <div className="copyright">
        Copyright(C) FiberHome 2010.All Rights RESERVED
      </div>
    </div>;
  }
}

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //存储文章、视频的值xwx2018/12/19
    sessionStorage.setItem('TabsKey', 1);
    sessionStorage.setItem('videoTabsKey', 1);
    sessionStorage.setItem('projectGeneralTabsKey', 1);
    return <div className="login-main">
      <div className="login-middle">
        {/* <div className="login-illustration" /> */}
        <div className="login-warpper">
          <HorizontalLoginForm />
        </div>
      </div>
    </div>;
  }
}
