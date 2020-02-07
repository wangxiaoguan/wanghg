import React, { Component } from 'react';
import { Tabs, message, Message, Divider, Spin, Popconfirm, Modal,Form,Input,InputNumber,Button } from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { postService, getService, GetQueryString } from '../../../content/myFetch';
import API_PREFIX, { API_FILE_VIEW_INNER, API_FILE_VIEW,API_FILE_MALLVIEW } from '../../../content/apiprefix';
import { BEGIN, getDataSource } from '../../../../redux-root/action/table/table';
import { connect } from 'react-redux';
const TabPane = Tabs.TabPane;
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
export default class GoodsList extends Component {
  constructor(props) {
    super(props);
    // let param = this.props.location.search.replace('?','').split('&');
    // let activeKey = Number(decodeURIComponent(param[0].split('=')[1])) || '0';
    let activeKey = GetQueryString(location.hash, ['id']).id || '0';
    this.departList = [];
    this.state = {
      tabKey: String(activeKey),
      updateKeyOne: 0,
      updateKeyTwo: 0,
      activeKey: String(activeKey),
      loading: false,
      // ossViewPath: sessionStorage.getItem('ossViewPath') || API_FILE_VIEW,
      ossViewPath: API_FILE_MALLVIEW,
      setInfo: {}, //已上架商品设置modal的数据
      setModal: false, //已上架商品设置modal的显示
      merchantId: GetQueryString(location.hash, ['merchantId']).merchantId || sessionStorage.getItem('merchantId'), //商家id
      upStockDisable: false, // 增加商品库存input是否禁用
      downStockDisable: false,// 减少商品库存input是否禁用
      productSave:0    //商品库存
    }
  }

  componentWillReceiveProps(nextProps) {
    // this.child.handleReset()
    let activeKey = GetQueryString(location.hash, ['id']).id || '0';
    activeKey = String(activeKey);
    if (this.state.activeKey !== activeKey) {
      this.setState({
        activeKey,
        tabKey: activeKey,
      });
    }
  }
  
  getData = async (url) => { //获取表格数据
    await this.props.getData(API_PREFIX + `${url}`);
  }
  componentWillMount() {
    localStorage.setItem("selectedRowKeys", '');
  }

  componentDidMount() {
  }
  tabChange = tabKey => {
    localStorage.setItem("selectedRowKeys", '');
    sessionStorage.setItem("TabsKey", tabKey);
    if (tabKey === '0') {
      this.setState({
        tabKey,
        activeKey: tabKey,
        updateKeyOne: this.state.updateKeyOne + 1,
      });
    } else if (tabKey === '1') {
      this.setState({
        tabKey,
        activeKey: tabKey,
        updateKeyTwo: this.state.updateKeyTwo + 1,
      });
    }
  }

  setOnline = (id) => {
    console.log('id==>', id)
    postService(API_PREFIX + `services/web/mall/product/info/setProductOnline`, [id], data => {
      if (data.status == 1) {
        Message.success('上架成功')
        this.getData(`services/web/mall/product/info/getList/` + `${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      } else {
        Message.error(data.errorMsg)
      }

    });
  }
  setOffline = (id) => {
    console.log('id==>', id)
    postService(API_PREFIX + `services/web/mall/product/info/setProductOffline`, [id], data => {
      if (data.status == 1) {
        Message.success('下架成功')
        this.getData(`services/web/mall/product/info/getList/` + `${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      } else {
        Message.error(data.errorMsg)
      }

    });
  }
  deleteGoods = (id) => {
    console.log('id==>', id)
    postService(API_PREFIX + `services/web/mall/product/info/delete`, [id], data => {
      if (data.status == 1) {
        Message.success('删除成功')
        this.getData(`services/web/mall/product/info/getList/` + `${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
      } else {
        Message.error(data.errorMsg)
      }

    });
  }

  addStock = (e) => {
    console.log('11111111111111111111111111111', e)
    if (e || e == 0) {
      this.setState({downStockDisable: true})
    } else {
      this.setState({downStockDisable: false})
    }
  }
  downStock = (e) => {
    console.log('11111111111111111111111111111', e)
    if (e || e == 0) {
      this.setState({upStockDisable: true})
    } else {
      this.setState({upStockDisable: false})
    }
  }
  updateProduct = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {     
        postService(API_PREFIX + `services/web/mall/product/info/changeProductIndex/${this.state.setInfo.id}/${values.showIndex}`, null, res => {
          if (res.status != 1) {
            message.error(res.errorMsg)
          } else {
            if (this.state.downStockDisable && !this.state.upStockDisable) {
              postService(API_PREFIX + `services/web/mall/product/info/addProductStock/${this.state.setInfo.id}/${values.upStock}`, null, res => {
                if (res.status === 1) {
                  message.success('设置成功')
                  this.setState({setModal: false, setInfo: {}})
                  this.getData(`services/web/mall/product/info/getList/` + `${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
                } else {
                  message.error(res.errorMsg)
                }
              });
              
            } else if (!this.state.downStockDisable && this.state.upStockDisable) {
              postService(API_PREFIX + `services/web/mall/product/info/reduceProductStock/${this.state.setInfo.id}/${values.downStock}`, null, res => {
                if (res.status === 1) {
                  message.success('设置成功')
                  this.setState({setModal: false, setInfo: {}})
                  this.getData(`services/web/mall/product/info/getList/` + `${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
                } else {
                  message.error(res.errorMsg)
                }
              })
            } else {
              message.success('设置成功')
              this.setState({setModal: false, setInfo: {}})
              this.getData(`services/web/mall/product/info/getList/` + `${this.props.pageData.currentPage}/${this.props.pageData.pageSize}?${this.props.pageData.query}`);
            }
          }
        })
      }
    })
  }
  
  getDetailData=(record)=>{    
    this.setState({ setModal: true, setInfo: record, downStockDisable: false, upStockDisable: false })
     getService(API_PREFIX + `services/web/mall/product/info/getById/${record.id}`, data => {
      if (data.status == 1) {
        this.setState({productSave:data.root.object.productStock})
         } else {
        Message.error(data.errorMsg)
      }
    });
  }


  render() {
    const { tabKey, updateKeyOne, updateKeyTwo } = this.state;
    console.log('updateKeyOne=>', updateKeyOne);
    let tenantId = window.sessionStorage.getItem("tenantId");
    const isEditid = GetQueryString(location.hash, ['id']).id || ''
    const search = [
      { key: 'name', label: '商品名称', qFilter: 'Q=name', type: 'input' }
    ];
    const columns = [
      {
        title: '商品图片',
        dataIndex: 'images',
        key: 'images',
        width: 120,
        // fixed: 'left',
        render: (data, record) => {
          return <img src={`${this.state.ossViewPath}${record.images}`} style={{ width: '100px' }} />
        }
      },
      {
        title: '商品名称',
        dataIndex: 'name',
        key: 'name',
        width: 120,
        // fixed: 'left',
      },
      {
        title: '所属分类',
        dataIndex: 'categoryName',
        key: 'categoryName'
      },
      {
        title: '价格',
        dataIndex: 'price',
        key: 'price'
      },
      {
        title: '销量',
        dataIndex: 'sales',
        key: 'sales'
      },
      {
        title: '库存',
        dataIndex: 'productStock',
        key: 'productStock'
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate'
      },
      {
        title: '显示顺序',
        dataIndex: 'showIndex',
        key: 'showIndex'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        // fixed: 'right',
        // width: 150,
        render: (data, record) => (
          <div>
            {
              record.status != 1 ? (
                <div>
                  <a onClick={this.setOnline.bind(this, record.id)} className='operation'>上架</a>
                  <Divider type="vertical" />
                  <a className='operation' onClick={() => {
                    let path = `EventManagement/Order/EditProduct`
                    if (sessionStorage.getItem('loginUserOrMerchant') == 2) {
                      path = `GoodsManagetion/EditGoods`
                    }
                    location.hash = `${path}?isEdit=true&isFlag=false&id=${record.id}&merchantId=${this.state.merchantId}`

                  }}>编辑</a>
                  <Divider type="vertical" />
                  <a onClick={this.deleteGoods.bind(this, record.id)} className='operation'>删除</a>
                </div>
              ) : (
                  <div>
                    <a onClick={this.setOffline.bind(this, record.id)} className='operation'>下架</a>
                    <Divider type="vertical" />
                    <a onClick={() =>this.getDetailData(record)} className='operation'>设置</a>
                  </div>
                )
            }
          </div>
        ),
      }
    ];
    const { form: { getFieldDecorator } } = this.props
    const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 14 } };
    let addPath = `EventManagement/Order/AddProduct`
    if (sessionStorage.getItem('loginUserOrMerchant') == 2) {
      addPath = `GoodsManagetion/AddGoods`
    }
    return <Spin spinning={this.state.loading}>
      <Tabs type="card" defaultActiveKey={this.state.activeKey} onChange={this.tabChange} className="tabCommon">
        <TabPane tab="未上架" key="0">
          <TableAndSearch key={updateKeyOne} columns={columns} url={'services/web/mall/product/info/getList'} //url={'testkao'}
            search={search} addBtn={{ order: 1, url: `${addPath}?isEdit=false&isFlag=false&merchantId=${this.state.merchantId}`, OnEvent: this.add }}
            offOrOnLineBtn={{ label: '上架', order: 3, url: 'services/web/mall/product/info/setProductOnline',typeLine: '上架' }}
            deleteBtn={{ order: 5, url: 'services/web/mall/product/info/delete', }}
            goBackBtn={sessionStorage.getItem('loginUserOrMerchant') == 1 ? {order: 6, label: '返回', url: '/EventManagement/Order/Merchant'} : null}
            urlfilter={`Q=status=0&Q=merchantId=${this.state.merchantId}`} />
        </TabPane>
        <TabPane tab="已上架" key="1">
          <TableAndSearch key={updateKeyTwo} columns={columns} url={'services/web/mall/product/info/getList/'}
            search={search} offOrOnLineBtn={{ label: '下架', order: 1, url: 'services/web/mall/product/info/setProductOffline',typeLine: '下架' }}
            goBackBtn={sessionStorage.getItem('loginUserOrMerchant') == 1 ? {order: 6, label: '返回', url: ''} : null}
            urlfilter={`Q=status=1&Q=merchantId=${this.state.merchantId}`} />
        </TabPane>
      </Tabs>

      <Modal
        // width={600}
        title="设置"
        visible={this.state.setModal}
        footer={null}
        onCancel={() => this.setState({ setModal: false, })}
        destroyOnClose={true}
      >
        <Form onSubmit={this.updateProduct}>
          <Form.Item {...formItemLayout} label='库存增加'>
            {getFieldDecorator('upStock', {
              rules: [
                {
                  type: 'number',
                  required: false,
                  whitespace: true,
                  min: 0,
                  message: '增加的库存不能小于0'
                },
                {validator: (rule, value, callback) => {
                  if(value<0){
                    callback('请勿输入负数');
                  }else if(String(value).indexOf('.')!=-1){
                    callback('请勿输入小数');
                  }else if(isNaN(value)&&value!=undefined){
                    callback('请勿输入非数字');
                  }else{
                    callback();
                  }
                },}
              ],
            })(
              <InputNumber onChange={this.addStock} disabled={this.state.upStockDisable} style={{ width:'calc(100% - 80px)' }} />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label='库存减少'>
            {getFieldDecorator('downStock', {
              rules: [
                {
                  type: 'number',
                  required: false,
                  whitespace: true,
                  max: this.state.productSave,
                  message: '不可大于商品总库存数量'
                },
                {
                  type: 'number',
                  min: 0,
                  message: '减少的库存不能小于0'
                },
                {validator: (rule, value, callback) => {
                  // if(value<0){
                  //   callback('请勿输入负数');
                  // }else 
                  if(String(value).indexOf('.')!=-1){
                    callback('请勿输入小数');
                  }else if(isNaN(value)&&value!=undefined){
                    callback('请勿输入非数字');
                  }else{
                    callback();
                  }
                },}
              ],
            })(
              <InputNumber onChange={this.downStock} disabled={this.state.downStockDisable}  style={{ width:'calc(100% - 100px)' }} />
            )}
            <span style={{marginLeft: '10px'}}>当前库存量:{this.state.productSave}</span>
          </Form.Item>
          <Form.Item {...formItemLayout} label='显示顺序'>
            {getFieldDecorator('showIndex', {
              rules: [
                {
                  type: 'number',
                  required: false,
                  whitespace: true,
                },
                {validator: (rule, value, callback) => {
                  if(value<0){
                    callback('请勿输入负数');
                  }else if(String(value).indexOf('.')!=-1){
                    callback('请勿输入小数');
                  }else if(isNaN(value)&&value!=undefined){
                    callback('请勿输入非数字');
                  }else{
                    callback();
                  }
                },}
              ],
              initialValue: this.state.setInfo.showIndex || '',
            })(
              <InputNumber  style={{ width:'calc(100% - 80px)' }} />
            )}
          </Form.Item>
          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <Button style={{ borderRadius: '15px' }} onClick={() => this.setState({ setModal: false })}>取消</Button>
            <Button style={{ borderRadius: '15px', marginLeft: '20px' }} type='primary' htmlType='submit'>保存</Button>
          </div>
        </Form>
      </Modal>
    </Spin>
  }
}

