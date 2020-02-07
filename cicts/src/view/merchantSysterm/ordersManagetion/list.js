import React, { Component } from 'react';
import { message, Divider, Spin, Modal, Form, Input, Col, Table } from 'antd';
import TableAndSearch from '../../component/table/TableAndSearch';
import { postService, getService, GetQueryString } from '../../content/myFetch';
import API_PREFIX, { API_FILE_VIEW_INNER, API_FILE_VIEW,API_FILE_MALLVIEW } from '../../content/apiprefix';
import { BEGIN, getDataSource } from '../../../redux-root/action/table/table';
import { connect } from 'react-redux';
import './list.less'
// @connect(
//   state => ({
//     pageData: state.table.pageData,
//     powers: state.powers,
//   }),
//   dispatch => ({
//     getData: n => dispatch(BEGIN(n)),
//     retSetData: n => dispatch(getDataSource(n)),
//   })
// )
@Form.create()
export default class OrdersList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      // ossViewPath: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW,
      ossViewPath: API_FILE_MALLVIEW,
      // editInfo: {},       //详情的modal回填数据
      detailModal: false,    //控制详情modal的显示
      detailInfo: [], //购买详情表格数据
      merchantId: sessionStorage.getItem('merchantId'), //商家id
    };
  }

  componentWillMount() {
    localStorage.setItem("selectedRowKeys", '');
  }
  detailUpdate = (record) => {
    this.setState({ detailModal: true })
    getService(API_PREFIX + `services/web/mall/order/getById/${record.id}`, res => {
      if (res.status == 1) {
        let obj = res.root.object
        if (obj) {
          if (obj.status == 1) {
            obj.statusName =  '创建'
          } else if (obj.status == 2) {
            obj.statusName =   '接单'
          }else if (obj.status == 3) {
            obj.statusName =   '配送'
          }else if (obj.status == 4) {
            obj.statusName =   '取消'
          }else if (obj.status == 5) {
            obj.statusName =   '完成'
          }else if (obj.status == 6) {
            obj.statusName =   '爽约'
          } else {
            obj.statusName =   ''
          }
        }
        this.setState({detailInfo: obj || {}})
      } else {
        message.error(res.errorMsg)
      }
    })
  }

  render() {
    const statusOption = [
      { key: '', value: '全部' },
      { key: '1', value: '创建' },
      { key: '2', value: '接单' },
      { key: '3', value: '配送' },
      { key: '4', value: '取消' },
      { key: '5', value: '完成' },
      { key: '6', value: '爽约' },
    ]
    const search = [
      { key: 'id', label: '订单编号', qFilter: 'Q=id', type: 'input' },
      { key: 'receiverName', label: '收货人', qFilter: 'Q=receiverName', type: 'input' },
      { key: 'status', label: '状态', qFilter: 'Q=status', type: 'select', option: statusOption }
    ];
    const columns = [
      {
        title: '订单号',
        dataIndex: 'id',
        key: 'id',
        // width: 120,
        // fixed: 'left',
      },
      {
        title: '下单时间',
        dataIndex: 'createDate',
        key: 'createDate'
      },
      {
        title: '收货人',
        dataIndex: 'receiverName',
        key: 'receiverName',
      },
      {
        title: '商品件数',
        dataIndex: 'productCount',
        key: 'productCount'
      },
      {
        title: '总价',
        dataIndex: 'totalAmount',
        key: 'totalAmount'
      },
      {
        title: '订单状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          if (record.status == 1) {
            return '创建'
          } else if (record.status == 2) {
            return '接单'
          }else if (record.status == 3) {
            return '配送'
          }else if (record.status == 4) {
            return '取消'
          }else if (record.status == 5) {
            return '完成'
          }else if (record.status == 6) {
            return '爽约'
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
            <a onClick={() => this.detailUpdate(record)} className='operation'>详情</a>
          </div>
        }
      }
    ];
    const detailColumns = [
      {
        title: '商品图片',
        dataIndex: 'productImages',
        key: 'productImages',
        width: 120,
        // fixed: 'left',
        render: (data, record) => {
          return <img src={`${this.state.ossViewPath}${record.productImages}`} style={{ width: '100px' }} />
        }
      },
      {
        title: '商品名称',
        dataIndex: 'productName',
        key: 'productName',
        width: 120,
      },
      {
        title: '分类',
        dataIndex: 'categoryName',
        key: 'categoryName',
        width: 120,
      },
      {
        title: '价格',
        dataIndex: 'discountPrice',
        key: 'discountPrice',
        width: 120,
      },
      {
        title: '数量',
        dataIndex: 'productAmount',
        key: 'productAmount',
        width: 120,
      },
      {
        title: '实付金额',
        dataIndex: 'discountPrice',
        key: 'discountPrice',
        render: (text, record) => {
          let total = Number(record.productAmount) * Number(record.discountPrice)
          return `${total.toFixed(2)}`
        }
      },
    ]
    const { form: { getFieldDecorator } } = this.props
    const formItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
    return <Spin spinning={this.state.loading}>
      <TableAndSearch columns={columns} url={'services/web/mall/order/getList'}
        search={search}
        urlfilter={`Q=merchantId=${this.state.merchantId}`}
      />
      <Modal
        width={800}
        title="详情"
        visible={this.state.detailModal}
        footer={null}
        onCancel={() => this.setState({ detailModal: false, })}
        destroyOnClose={true}
      >
        <div id='ordersDetail'>
          <div style={{fontSize: '16px', backgroundColor: 'rgba(238,241,248,1)', marginBottom: '20px', paddingLeft: '5px', lineHeight: '30px'}}>基本信息</div>
          <Form style={{overflow: 'hidden'}}>
            <Col span='12'>
              <Form.Item {...formItemLayout} label='订单编号'>
                {getFieldDecorator('orderNo', {
                  initialValue: this.state.detailInfo.id || '',
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col span='12'>
              <Form.Item {...formItemLayout} label='订单状态'>
                {getFieldDecorator('orderStatus', {
                  initialValue: this.state.detailInfo.statusName || '',
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col span='12'>
              <Form.Item {...formItemLayout} label='收货人'>
                {getFieldDecorator('orderName', {
                  initialValue: this.state.detailInfo.receiverName || '',
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col span='12'>
              <Form.Item {...formItemLayout} label='联系方式'>
                {getFieldDecorator('orderMobile', {
                  initialValue: this.state.detailInfo.receiverPhone || '',
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col span='12'>
              <Form.Item {...formItemLayout} label='收获地址'>
                {getFieldDecorator('address', {
                  initialValue: this.state.detailInfo.receiverAddress || '',
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
            <Col span='12'>
              <Form.Item {...formItemLayout} label='下单时间'>
                {getFieldDecorator('orderDate', {
                  initialValue: this.state.detailInfo.createDate || '',
                })(
                  <Input />
                )}
              </Form.Item>
            </Col>
          </Form>
          <div style={{fontSize: '16px', backgroundColor: 'rgba(238,241,248,1)', marginBottom: '20px', paddingLeft: '5px', lineHeight: '30px'}}>购买详情</div>
          <Table id='productInfo' columns={detailColumns} dataSource={this.state.detailInfo.orderDetailList || []}  scroll={{ y: 300 }} />
        </div>


      </Modal>

    </Spin>
  }
}

