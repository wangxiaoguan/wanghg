import React, { Component } from 'react';
import {message, Divider, Spin, Modal, Form, Input, InputNumber, Button,Radio,Popconfirm } from 'antd';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import { postService, getService,GetQueryString } from '../../../myFetch';
import API_PREFIX,{API_FILE_VIEW_INNER,API_FILE_VIEW} from '../../../apiprefix';
import { connect } from 'react-redux';
import { BEGIN, getDataSource ,getPageData} from '../../../../../redux-root/action/table/table';
@connect(
  state => ({
    pageData: state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    setPageData:n=>dispatch(getPageData(n)),
    retSetData: n => dispatch(getDataSource(n)),
  })
)
@Form.create()
export default class Merchant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      ossViewPath: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW,
      editInfo: {},       //编辑的modal回填数据
      addModal: false,    //控制新建和编辑modal的显示
      isEditModal: false, //是否编辑的modal
    };
  }

  componentWillMount() {
    localStorage.setItem("selectedRowKeys", '');
  }

  componentDidMount() {
  }
  
  getData = async (url) => { //获取表格数据
    await this.props.getData(API_PREFIX + `${url}`);
  }
  updateStatu = (record, code) => {
    let body = {
      id: record.id,
      status: record.status == 0 ? 1 : 0
    }
    if (code === 'delete') {
      body.status = 2
    }
    postService(API_PREFIX + `services/web/merchant/updateStatus`, body, (res) => {
      if (res.status == 1) {
        message.success(code === 'delete' ? '删除成功' : '操作成功')
        let pageData = this.props.pageData
        this.getData(`services/web/merchant/getList/${code === 'delete' ? 1 : pageData.currentPage}/${pageData.pageSize}?${pageData.query}`)
        if (code === 'delete') {
          this.props.setPageData({currentPage: 1, pageSize:pageData.pageSize, query: pageData.query});
        }
      } else {
        message.error(res.errorMsg)
      }
    })
  }
  addClassify = () => {
    this.setState({addModal: true, isEditModal: false, editInfo: {}})
  }
  editClassify = (record) => {
    this.setState({ addModal: true, isEditModal: true, editInfo: record ||  {} })
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
      if (this.state.isEditModal && value == this.state.editInfo.mobile) {
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
      if (this.state.isEditModal && value == this.state.editInfo.email) {
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
      values.tenantId = sessionStorage.getItem('tenantId')
      if (this.state.isEditModal) {
        values.id = this.state.editInfo.id
        postService(API_PREFIX + `services/web/merchant/update`, values, res => {
          if (res.status == 1) {
              message.success('修改成功')
              this.setState({addModal: false, isEditModal: false, editInfo: {}})
              this.getData(`services/web/merchant/getList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`)
          } else {
            message.error(res.errorMsg)
          }
        })
      } else {
        postService(API_PREFIX + `services/web/merchant/insert`, values, res => {
          if (res.status == 1) {
            message.success('新增成功')
            this.setState({addModal: false, isEditModal: false, editInfo: {}})
            this.getData(`services/web/merchant/getList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`)
          } else {
            message.error(res.errorMsg)
          }
        })
      }

      
    })
  }
  render() {
    const statusOption = [
      { key: '', value: '全部' },
      { key: '0', value: '禁用' },
      { key: '1', value: '启用' },
    ]
    const search = [
      { key: 'name', label: '商家名称', qFilter: 'Q=name', type: 'input' },
      { key: 'status', label: '状态', qFilter: 'Q=status', type: 'select', option: statusOption }
    ];
    const columns = [
      {
        title: '商家名称',
        dataIndex: 'merchantName',
        key: 'merchantName'
      },
      {
        title: '联系人',
        dataIndex: 'linkName',
        key: 'linkName',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile'
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email'
      },
      {
        title: '商品数量',
        dataIndex: 'productCount',
        key: 'productCount'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          if (record.status == 1) {
            return '启用'
          } else if (record.status == 0) {
            return '禁用'
          } else {
            return ''
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        // fixed: 'right',
        // width: 150,
        render: (data, record) => {
          return <div>
            <a className='operation' onClick={() => this.editClassify(record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.updateStatu(record)} className='operation'>{record.status == 1 ? '禁用':'启用'}</a>
            <Divider type="vertical" />
            <a onClick={() => location.hash = `/EventManagement/Order/MerchantProduct?merchantId=${record.id}`} className='operation'>商品</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除改商家吗?" onConfirm={()=>this.updateStatu(record, 'delete')}><span><a className='operation'>删除</a></span></Popconfirm>
          </div>
        }
      }
    ];
    const { form: { getFieldDecorator } } = this.props
    const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 14 } };
    return <Spin spinning={this.state.loading}>
      <TableAndSearch columns={columns} url={'services/web/merchant/getList/'}
        search={search} addBtn={{ order: 1, OnEvent: this.addClassify }}
        // deleteBtn={{ order: 5, url: 'services/web/mall/product/category/delete', }}
        // urlfilter='Q=status=0,1'
      />
      <Modal
        title={this.state.isEditModal ? '编辑' : '新建'}
        visible={this.state.addModal}
        footer={null}
        onCancel={() => this.setState({ addModal: false, editInfo: {}, isEditModal: false })}
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
                    initialValue: this.state.editInfo.merchantName || ''
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
                    initialValue: this.state.editInfo.linkName || ''
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
                    initialValue: this.state.editInfo.mobile || '',
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
                    initialValue: this.state.editInfo.email || '',
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
                    initialValue: this.state.editInfo.sex === false ? '2' : '1',
                  })(
                    <Radio.Group>
                      <Radio value='1'>男</Radio >
                      <Radio value='2'>女</Radio >
                    </Radio.Group>
                  )}
                </Form.Item>
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                  <Button style={{ borderRadius: '15px' }} onClick={() => this.setState({ addModal: false, editInfo: {}, isEditModal: false  })}>取消</Button>
                  <Button style={{ borderRadius: '15px', marginLeft: '20px' }} type='primary' htmlType="submit">保存</Button>
                </div>
              </Form>
            </Modal>
    </Spin>
  }
}