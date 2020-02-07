import React, { Component } from 'react';
import { Button, Form, message, Modal, Row, Col, Input, Select, Spin, Table, InputNumber,Radio,Icon  } from 'antd';
import { postService, getService } from '../../content/myFetch';
import TableAndSearch from '../../component/table/TableAndSearch';
import API_PREFIX, { masterUrl } from '../../content/apiprefix';
import { connect } from 'react-redux';
import { BEGIN, getDataSource } from '../../../redux-root/action/table/table';
import './list.less'

@Form.create()
export default class List extends Component {
  constructor(props) {
    super(props);
    this.departList = []
    this.state = {
      dataSource: [],
      loading: false,
      editModal: false,
      passwordModal: false,
      validatorCurrentWord: false,
      merchantId: sessionStorage.getItem('merchantId'),
      merchantInfo: {},
      acount: '',
      newPassword: '',
      // timeout: null,
    };
    this.timeout = null
  }
  componentWillMount() {
    this.getMerchantData()
  }
  getMerchantData = () => {
    this.setState({ loading: true })
    getService(API_PREFIX + `services/web/merchant/getById/${this.state.merchantId}`, res => {
      if (res.status == 1) {
        let merchantInfo = res.root.object
        let dataSource = [
          { key: '1', attribute: '商家名称', value: merchantInfo.merchantName, },
          { key: '2', attribute: '联系人', value: merchantInfo.linkName, },
          { key: '3', attribute: '手机号', value: merchantInfo.mobile, },
          { key: '4', attribute: '邮箱', value: merchantInfo.email, },
          { key: '5', attribute: '商品数量', value: merchantInfo.productCount || 0, },
        ];
        this.setState({ dataSource, merchantInfo, loading: false,acount: merchantInfo.mobile })
      } else {
        message.error(res.errorMsg)
        this.setState({ loading: false, })
      }
    })
  }
  //手机号的校验  先校验格式是否符合要求，再到数据库校验是否唯一
  handleValidMobile = (rule, value, callback) => {
    console.log('输入的手机号：', value);
    let patrn = /^[0-9]*$/;
    if (value === undefined) {//再增加判断为undefined时将值设置为空xwx2018/12/27
      value = '';
    }
    if (!patrn.test(value) || value.length != 11 && value.length != 0) {
      callback('手机号只能为数字且只能为11位');
    } else if (value.length == 0) {
      callback('');
    } else {   //通过校验
      // 发起请求，判断该手机号是否存在
      // callback(); 
      if (value == this.state.merchantInfo.mobile) {
        callback()
      } else {
        getService(API_PREFIX + `services/web/merchant/getByAcount/${value}`, res => {
          if (res.root && res.root.object) {
            callback('该手机号已存在')
          } else {
            callback()
          }
        })
      }
    }
  }
  //邮箱的校验
  handleValidEmail = (rule, value, callback) => {
    console.log('邮箱：', value);
    if (value == '' || value == undefined) {
      callback();
    } else {
      // callback();
      if (value == this.state.merchantInfo.email) {
        callback()
      } else {
        getService(API_PREFIX + `services/web/merchant/getByEmail/${value}`, res => {
          if (res.root && res.root.object) {
            callback('该邮箱已存在')
          } else {
            callback()
          }
        })
      }
    }

  }
  editInfo = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }
      console.log('哈哈哈哈哈哈哈呵哈', values)
      if (values.sex == 2) {
        values.sex = false
      } else {
        values.sex = true
      }
      values.id = this.state.merchantId
      postService(API_PREFIX + `services/web/merchant/update`, values, res => {
        if (res.status == 1) {
          if (values.mobile != this.state.acount) {
            message.success('手机号已修改，请重新登陆')
            location.hash = 'login'
          } else {
            message.success('修改成功')
            this.setState({ editModal: false })
            this.getMerchantData()
          }
        } else {
          message.error(res.errorMsg)
        }
      })
    })
  }
  // handleCurrentPass = (e) => {
  //   console.log('2222222222222222222222222', e.target.value)
  //   let body = {
  //     username: this.state.acount,
  //     password: e.target.value,
  //   }
  //   postService(API_PREFIX + `services/web/merchant/confirmpsd`, body, res => {
  //     if (res.status == 1) {
  //       if (res.root.object === true) {
  //         this.setState({validatorCurrentWord: {statu: 'success'}})
  //       } else {
  //         this.setState({validatorCurrentWord: {statu: 'error'}})
  //       }
  //     } else {
  //       message.error(res.errorMsg)
  //     }
  //   })
  // }
  handleOldPass = (rules, value, callback) => {
    if (!value) {
      callback('请输入当前密码')
    } else {
      callback()
      clearTimeout(this.timeout); // 每当用户输入的时候把前一个 setTimeout clear 掉
      this.timeout = setTimeout(() => { // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
        let body = {
          username: this.state.acount,
          password: value,
        }
        postService(API_PREFIX + `services/web/merchant/confirmpsd`, body, res => {
          if (res.status == 1) {
            if (res.root.object === true) {
              this.setState({validatorCurrentWord: {statu: 'success'}})
            } else {
              this.setState({validatorCurrentWord: {statu: 'error'}})
            }
          } else {
            message.error(res.errorMsg)
          }
        })
      }, 500);
    }
  }
  handleNewPassword = (rules, value, callback) => {
    console.log('1111111111111111111111', value)
    console.log('2222222222222222222222', /^[0-9A-Za-z]{6,}$/.test(value))
    if (!value) {
      callback('新密码为必填项')
    } else if (!/^[0-9A-Za-z]{6,}$/.test(value)) {
      callback('请输入6位及以上的数字和字母')
    } else {
      callback()
      this.setState({newPassword: value})
    }
  }
  confirmNewPass = (rules, value, callback) => {
    console.log('1111111111111111111111', value)
    if (value !== this.state.newPassword) {
      callback('与新密码保持一致')
    }else {
      callback()
    }
  }
  updatePassword = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      console.log('呵呵呵呵呵呵呵额呵呵', this.state.validatorCurrentWord)
      if (err || (this.state.validatorCurrentWord && this.state.validatorCurrentWord.statu === 'error')) {
        console.log('5555555555555555555')
        return
      }
      console.log('666666666666666666666')
      let body = {
        id: this.state.merchantId,
        password: values.password
      }
      postService(API_PREFIX + `services/web/merchant/update`, body, res => {
        if (res.status == 1) {
          message.success('密码已修改，请重新登陆')
          location.hash = 'login'
        } else {
          message.error(res.errorMsg)
        }
      })
    })
  }
  render() {

    const columns = [
      {
        title: '',
        dataIndex: 'attribute',
        key: 'attribute',
        width: 100
      },
      {
        title: '',
        dataIndex: 'value',
        key: 'value',
        width: 150,
        render: (text, record, index) => {
          if (index == 4) {
            return <a onClick={() => location.hash = `/GoodsManagetion/GoodsList`}>{record.value}</a>
          } else {
            return record.value
          }
        }
      },
    ];
    const { validatorCurrentWord, loading, editModal, passwordModal, dataSource, merchantInfo } = this.state
    const validatorIcon = !validatorCurrentWord ? '' : validatorCurrentWord.statu == 'success' ? <Icon type="check-circle" style={{fontSize: 20,marginLeft: 10, color: '#52c41a'}} /> : <Icon type="close-circle" style={{fontSize: 20,marginLeft: 10, color: '#f5222d'}} />
    const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 15 } };
    const { form: { getFieldDecorator } } = this.props
    return (
      // <TableAndSearch
      //     columns={columns} url={'services/web/company/userInfo/list'} search={search} 
      //     rowkey={'id'}
      //     scroll={{ width: 1600 }}
      //   />
      <Spin spinning={loading}>
        <div className='merchantInfo'>
          <Table className='table' columns={columns} dataSource={dataSource} bordered showHeader={false} />
          <div>
            <Button type='primary' style={{ margin: '30px 30px 0 150px', borderRadius: '15px' }} onClick={() => this.setState({ editModal: true })}>编辑</Button>
            <Button type='primary' style={{ borderRadius: '15px' }} onClick={() => this.setState({ passwordModal: true })}>修改密码</Button>
          </div>
        </div>
        {
          editModal ? (
            <Modal
              // width={600}
              title="编辑"
              visible={editModal}
              footer={null}
              onCancel={() => this.setState({ editModal: false, })}
              destroyOnClose={true}
            >
              <Form onSubmit={this.editInfo}>
                <Form.Item {...formItemLayout} label='商家名称'>
                  {getFieldDecorator('merchantName', {
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        max: 20,
                        message: `商家名称为必填项,且最大长度不能超过20个字`,
                      },
                    ],
                    initialValue: merchantInfo.merchantName
                  })(
                    <Input placeholder="20个字以内" />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label='联系人'>
                  {getFieldDecorator('linkName', {
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: `联系人为必填项`,
                      },
                    ],
                    initialValue: merchantInfo.linkName
                  })(
                    <Input />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label='手机号'>
                  {getFieldDecorator('mobile', {
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        max: 11,
                        message: `手机号为必填项`,
                      },
                      {
                        validator: this.handleValidMobile,
                      }
                    ],
                    initialValue: merchantInfo.mobile,
                  })(
                    <Input />
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label='邮箱'>
                  {getFieldDecorator('email', {
                    rules: [
                      { type: 'email', message: '您输入的邮箱格式不正确，请输入正确的邮箱' },
                      { required: true, message: '请输入您的邮箱' },
                      { validator: this.handleValidEmail, }
                    ],
                    initialValue: merchantInfo.email,
                  })(
                    <Input />
                  )}
                </Form.Item>

                <Form.Item {...formItemLayout} label='性别'>
                  {getFieldDecorator('sex', {
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: `性别为必填项`,
                      },
                    ],
                    initialValue: !merchantInfo.sex ? '2' : '1',
                  })(
                    <Radio.Group>
                      <Radio value='1'>男</Radio >
                      <Radio value='2'>女</Radio >
                    </Radio.Group>
                  )}
                </Form.Item>
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                  <Button style={{ borderRadius: '15px' }} onClick={() => this.setState({ editModal: false })}>取消</Button>
                  <Button style={{ borderRadius: '15px', marginLeft: '20px' }} type='primary' htmlType="submit">保存</Button>
                </div>
              </Form>
            </Modal>
          ) : null
        }
        {
          passwordModal ? (
            <Modal
              // width={600}
              title="修改密码"
              visible={passwordModal}
              footer={null}
              onCancel={() => this.setState({ passwordModal: false, validatorCurrentWord: false })}
              destroyOnClose={true}
            >
              <Form onSubmit={this.updatePassword}>
                <Form.Item {...formItemLayout} label='当前密码'>
                  {getFieldDecorator('oldPassword', {
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        // message: `当前密码为必填项`,
                        validator: this.handleOldPass
                      },
                    ],
                    // validator: this.handleCurrentPass
                  })(
                    <Input.Password style={{width: 'calc(100% - 30px)'}} />
                  )}
                  {validatorIcon}
                </Form.Item>
                <Form.Item {...formItemLayout} label='新密码'>
                  {getFieldDecorator('newPassword', {
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        // message: `新密码为必填项`,
                        validator: this.handleNewPassword
                      },
                    ],
                  })(
                    <Input.Password  style={{width: 'calc(100% - 30px)'}}/>
                  )}
                </Form.Item>
                <Form.Item {...formItemLayout} label='确认密码'>
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        // message: `确认密码为必填项`,
                        validator: this.confirmNewPass,
                      },
                    ],
                  })(
                    <Input.Password  style={{width: 'calc(100% - 30px)'}}/>
                  )}
                </Form.Item>
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                  <Button style={{ borderRadius: '15px' }} onClick={() => this.setState({ passwordModal: false,validatorCurrentWord: false })}>取消</Button>
                  <Button style={{ borderRadius: '15px', marginLeft: '20px' }} type='primary' htmlType='submit'>保存</Button>
                </div>
              </Form>
            </Modal>
          ) : null
        }
      </Spin>
    )
  }
}
