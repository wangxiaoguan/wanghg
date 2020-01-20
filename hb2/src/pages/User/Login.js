import Login from '@/components/Login';

import {connect} from 'dva';

import {Alert, Checkbox, Icon} from 'antd';

import React, {Component} from 'react';

import Link from 'umi/link';
import {FormattedMessage, formatMessage} from 'umi/locale';

import styles from './Login.less';

const {Tab, UserName, Password, Mobile, Captcha, Submit} = Login;

@connect(({login, loading}) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({type});
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const {dispatch} = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    if (!err) {
      const {dispatch} = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
        callBack: () => {
          dispatch({
            type: 'user/fetchCurrent',
          });
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{marginBottom: 24}} message={content} type="error" showIcon />
  );

  render() {
    const {login, submitting} = this.props;
    const {type, autoLogin} = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          {
            login.status === 'error' &&
            login.type === 'account' &&
            !submitting &&
            this.renderMessage(formatMessage({id: 'app.login.message-invalid-credentials'}))
          }
          <UserName
            name="username"
            placeholder={`${formatMessage({id: 'app.login.userName'})}: admin or wto`}
            rules={[
              {
                required: true,
                message: formatMessage({id: 'validation.userName.required'}),
              },
            ]}
          />
          <Password
            name="password"
            placeholder={`${formatMessage({id: 'app.login.password'})}: 1`}
            rules={[
              {
                required: true,
                message: formatMessage({id: 'validation.password.required'}),
              },
            ]}
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>
            <Link style={{float: 'right'}} to="/user/register">
              <FormattedMessage id="app.login.signup" />
            </Link>
            <a style={{float: 'right', marginRight: 10}} href="">
              <FormattedMessage id="app.login.forgot-password" />
            </a>
          </div>
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
