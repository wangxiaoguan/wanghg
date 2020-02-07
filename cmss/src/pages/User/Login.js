import React, { Component } from 'react';
// import { connect } from 'dva';
// import { Alert } from 'antd';
import WrappedNormalLoginForm from './loginDemo';
import styles from './Login.less';

// @connect(({ login, loading }) => ({
//   login,
//   submitting: loading.effects['login/login'],
// }))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  // onGetCaptcha = () =>
  //   new Promise((resolve, reject) => {
  //     this.loginForm.validateFields(['mobile'], {}, (err, values) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         const { dispatch } = this.props;
  //         dispatch({
  //           type: 'login/getCaptcha',
  //           payload: values.mobile,
  //         })
  //           .then(resolve)
  //           .catch(reject);
  //       }
  //     });
  //   });

  // handleSubmit = (err, values) => {
  //   const { type } = this.state;
  //   if (!err) {
  //     const { dispatch } = this.props;
  //     dispatch({
  //       type: 'login/login',
  //       payload: {
  //         ...values,
  //         type,
  //       },
  //     });
  //   }
  // };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  render() {
    const { autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <WrappedNormalLoginForm autoLogin={autoLogin} />
      </div>
    );
  }
}

export default LoginPage;
