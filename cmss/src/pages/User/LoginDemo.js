import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Checkbox, message } from 'antd';
import md5 from 'md5';
import { storage } from '@/utils/utils';
import styles from './loginDemo.less';

const FormItem = Form.Item;
const eyeOpen = require('./assets/eye-open.png');
const eyeClose = require('./assets/eye-close.png');

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};

@connect(({ loginDemo }) => ({
  loginDemo,
}))
class NormalLoginForm extends React.Component {
  constructor(props) {
    super(props);
    const mobile = storage.getLocal('mobile');
    const password = storage.getLocal('password');
    this.state = {
      showPwd: false,
      remember: mobile && password,
      initialValues: {
        mobile,
        password,
      },
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      // 记住密码
      const { remember } = this.state;
      storage.setLocal('mobile', remember ? values.mobile : '');
      storage.setLocal('password', remember ? values.password : '');
      const formData = {
        device: 'Android SDK built for x86',
        mobile: values.mobile,
        msgId: 'APP118',
        password: md5(values.password),
        pushType: 1,
        registrationId: 'b76776ed4b397ac393df7d212d3793c0',
        system: '8.0.0',
        systemType: '4',
        version: 'V2.5.1_20190508_dev185',
      };

      if (!err) {
        dispatch({
          type: 'loginDemo/login',
          payload: {
            text: JSON.stringify(formData),
          },
          callBack: response => {
            if (response.code === '0' && response.resultMap && response.resultMap.userInfo) {
              const userData = response.resultMap.userInfo;
              userData.showMS = response.resultMap.showMS;
              storage.setLocal('userInfo', JSON.stringify(userData));
              window.location = '#/home';
              dispatch({
                type: 'loginDemo/getPartyInfo',
                payload: {
                  text: JSON.stringify({
                    isQryAll: false,
                    isQryChild: false,
                    msgId: 'QRY_MEM_PARTY_INFO',
                    type: 0,
                    userId: userData ? userData.id : '',
                  })
                },
                callBack: (data) => {
                  storage.setLocal('userPartyInfo', JSON.stringify(data));
                }
              })

            } else {
              message.error(response.message || '用户名或密码错误');
            }
          },
        });
      }
    });
  };

  changePwdShow = () => {
    const { showPwd } = this.state;
    this.setState({
      showPwd: !showPwd,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { showPwd, remember, initialValues } = this.state;
    let check;
    if (remember !== '' && remember !== undefined) {
      check = true;
    } else {
      check = false;
    }
    const suffix = showPwd ? (
      <img src={eyeOpen} alt="eye-open.png" onClick={this.changePwdShow} />
    ) : (
        <img src={eyeClose} alt="eye-close.png" onClick={this.changePwdShow} />
      );
    return (
      <div className={styles['login-form']}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="用户名">
            {getFieldDecorator('mobile', {
              initialValue: initialValues.userName,
              rules: [{ required: true, message: '用户名不为空' }],
            })(<Input placeholder="请输入用户名" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {getFieldDecorator('password', {
              initialValue: initialValues.password,
              rules: [{ required: true, message: '密码不为空' }],
            })(
              <Input
                type={showPwd ? 'text' : 'password'}
                placeholder="请输入密码"
                suffix={suffix}
              />
            )}
          </FormItem>
          <FormItem style={{ marginBottom: '19px' }}>
            <Button type="primary" htmlType="submit" className={styles['login-button']}>
              登录
            </Button>
          </FormItem>
        </Form>
        <div className={styles['login-function']}>
          <Checkbox
            defaultChecked={check}
            onChange={() => {
              this.setState({ remember: !remember });
            }}
          >
            记住密码
          </Checkbox>
        </div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);
export default WrappedNormalLoginForm;
