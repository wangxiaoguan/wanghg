import React, { Component } from 'react';
import { message, Divider, Spin, Modal, Form, Input, InputNumber, Button,Radio  } from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { postService, getService, GetQueryString } from '../../../content/myFetch';
import API_PREFIX, { API_FILE_VIEW_INNER, API_FILE_VIEW } from '../../../content/apiprefix';
import { BEGIN, getDataSource } from '../../../../redux-root/action/table/table';
import { connect } from 'react-redux';
@connect(
  state => ({
    pageData: state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    retSetData: n => dispatch(getDataSource(n)),
  })
)
@Form.create()
export default class FirstClassifyList extends Component {
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
  deleteClassify = (record) => {
    postService(API_PREFIX + `services/web/mall/product/category/delete`, [record.id], (res) => {
      if (res.status == 1) {
        message.success('删除成功')
        this.getData(`services/web/mall/product/category/getList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`)
      } else {
        message.error(res.errorMsg)
      }
    })
  }
  updateStatu = (record) => {
    postService(API_PREFIX + `services/web/mall/product/category/updateCategoryStatus/${record.id}/${record.status == 0 ? 1 : 0}`, null, (res) => {
      if (res.status == 1) {
        message.success('操作成功')
        this.getData(`services/web/mall/product/category/getList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`)
      } else {
        message.error(res.errorMsg)
      }
    })
  }
  addClassify = () => {
    this.setState({addModal: true, isEditModal: false})
  }
  editClassify = (record) => {
    getService(API_PREFIX + `services/web/mall/product/category/getById/${record.id}`, res => {
      if (res.status == 1) {
        this.setState({ addModal: true, isEditModal: true, editInfo: res.root.object || {} })
      } else {
        message.error(res.errorMsg)
      }
    })
  }
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.level = 1
        values.parentId = '-1'
        if (!this.state.isEditModal) {
          postService(API_PREFIX + `services/web/mall/product/category/insert`, values, res => {
            if (res.status == 1) {
              message.success('新增分类成功')
              this.setState({ addModal: false, isEditModal: false, editInfo: {} })
              this.getData(`services/web/mall/product/category/getList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`)
            } else {
              message.error(res.errorMsg)
            }
          })
        } else {
          values.id = this.state.editInfo.id
          postService(API_PREFIX + `services/web/mall/product/category/update`, values, res => {
            if (res.status == 1) {
              message.success('修改分类成功')
              this.setState({ addModal: false, isEditModal: false, editInfo: {} })
              this.getData(`services/web/mall/product/category/getList/${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`)
            } else {
              message.error(res.errorMsg)
            }
          })
        }
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
      { key: 'name', label: '分类名称', qFilter: 'Q=name', type: 'input' },
      { key: 'status', label: '状态', qFilter: 'Q=status', type: 'select', option: statusOption }
    ];
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 120,
        // fixed: 'left',
      },
      {
        title: '分类名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '级别',
        dataIndex: 'level',
        key: 'level',
        render: (text, record) => {
          return '一级'
        }
      },
      {
        title: '显示顺序',
        dataIndex: 'showIndex',
        key: 'showIndex'
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
            <a onClick={() => {
              let path = ''
              if (sessionStorage.getItem('loginUserOrMerchant') == 1) {
                path = `EventManagement/Order/secondClassify`
              } else if (sessionStorage.getItem('loginUserOrMerchant') == 2) {
                path = `GoodsManagetion/secondClassify`
              }
              location.hash = `${path}?id=${record.id}`
            }} className='operation'>下级</a>
            <Divider type="vertical" />
            <a className='operation' onClick={() => this.editClassify(record)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.updateStatu(record)} className='operation'>{record.status == 1 ? '禁用':'启用'}</a>
            <Divider type="vertical" />
            <a onClick={() => this.deleteClassify(record)} className='operation'>删除</a>
          </div>
        }
      }
    ];
    const { form: { getFieldDecorator } } = this.props
    const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 14 } };
    return <Spin spinning={this.state.loading}>
      <TableAndSearch columns={columns} url={'services/web/mall/product/category/getList/'} //url={'testkao'}
        search={search} addBtn={{ order: 1, OnEvent: this.addClassify }}
        deleteBtn={{ order: 5, url: 'services/web/mall/product/category/delete', }}
      urlfilter={`Q=parentId=-1`}
      />

      <Modal
        // width={600}
        title={this.state.isEditModal ? '编辑' : '新建'}
        visible={this.state.addModal}
        footer={null}
        onCancel={() => this.setState({ addModal: false, editInfo: {}, isEditModal: false })}
        destroyOnClose={true}
      >
        <Form onSubmit={this.handleSubmit}>
          <Form.Item {...formItemLayout} label='一级分类'>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '一级分类名称为必填项'
                },
              ],
              initialValue: this.state.editInfo.name || '',
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label='显示顺序'>
            {getFieldDecorator('showIndex', {
              rules: [
                {
                  type: 'number',
                  required: false,
                  whitespace: true,
                },
              ],
              initialValue: this.state.editInfo.showIndex || 0,
            })(
              <InputNumber />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label='状态'>
            {getFieldDecorator('status', {
              rules: [
                {
                  type: 'number',
                  required: false,
                  whitespace: true,
                },
              ],
              initialValue: this.state.editInfo.status == 0 ? 0 : 1,
            })(
              <Radio.Group>
                <Radio value={1}>启用</Radio>
                <Radio value={0}>禁用</Radio>
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

