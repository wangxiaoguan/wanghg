import React,{ Component } from 'react';
import { Form, Table, Row, Col, Select, Button, Input, DatePicker, Message, Popconfirm, Upload, Cascader } from 'antd';
// import zhCN from 'antd/lib/locale-provider/zh_CN';
import {connect} from 'react-redux';
import { BEGIN, getDataSource, getPageData, getSelectRows } from '../../../redux-root/action';
import './TableStyle.less';
import { arrayToString } from '../tools';
import ServiceApi from '../.././content/apiprefix';
import { illegalInput } from '../../../utils/checkForm';
import {postService,exportExcelService} from '../.././content/myFetch';
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
@connect(
  state => ({
    dataSource: state.tableData,
    pageData:state.pageData,
    allData:state,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    getPageData:n=>dispatch(getPageData(n)),
    retSetData: n=>dispatch(getDataSource(n)),
    getSelectRowData: n => dispatch(getSelectRows(n)),
  })
)
@Form.create()
export default class TableAndSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
      queryFilter: {},
      query: this.props.urlfilter?this.props.urlfilter:'',
      dataSource:this.props.dataSource,
      selectedRowKeys: [],
      selectedRows:[],
      fieldsValue:{},
      dataSourceUpdate:false,
    };
  }
  componentWillUnmount(){}
  componentDidUpdate(){}
  componentDidMount(){}

  getPageData(currentPage,pageSize,query){
    let data = {currentPage,pageSize,query}; 
    this.props.getPageData(data);
  }
  getData = async(url) => {
    await this.props.getData(ServiceApi + `${url}`);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.dataSource !== prevState.dataSource) {
      return { dataSource: nextProps.dataSource,dataSourceUpdate:true};
    }
    return null;
  }

  onPageChange = (currentPage, pageSize) => {
    this.getPageData(currentPage,pageSize,this.state.query);
    this.setState({ currentPage, pageSize });
    this.getData(
      `${this.props.url}/${currentPage}/${pageSize}?${this.state.query}`
    );
  };
  onPageSizeChange = (currentPage, pageSize) => {
    this.getPageData(currentPage,pageSize,this.state.query);
    this.setState({ currentPage, pageSize });
    this.getData(
      `${this.props.url}/${currentPage}/${pageSize}?${this.state.query}`
    );
  };

  handleChange(value, key, qFilter, type) {
    const { queryFilter } = this.state;
    queryFilter[key] = `${qFilter}=${value}`;
    this.setState({ queryFilter });
  }

  handleSubmit = e => {
      e.preventDefault();
      this.props.form.validateFields((err, fieldsValue) => {
          if (!err) {
              Object.values(this.state.queryFilter).map(item => {
                  if (query === '') {
                      query =  item;
                  } else {
                      query = query + '&' + item;
                  }
              })
          }
      })
  }
  custom = (selectedRowKeys)=>{
    this.props.customBtn.onClick(selectedRowKeys);
  }

  add = () => {
    location.hash=this.props.addBtn.url
  }
  goBackBtn = () => {
  }
  deleteData = () => {
  }
  importData = () => {
  }
  exportData = () => {
  }
  offLine=(selectedRowKeys,url)=>{
  }
  render() {
    const { totalNum, pageSize, currentPage ,selectedRowKeys} = this.state;
    const getFieldDecorator = this.props.form.getFieldDecorator;
    const children = this.props.children
    let pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      total: totalNum,
      pageSize: pageSize,
      current: currentPage,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange,
      pageSizeOptions: ['10', '15', '20'],
    }
    const locale = {
      filterTitle: '筛选',
      filterConfirm: '确定',
      filterReset: '重置',
      emptyText: '暂无数据',
    }
    const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
    const rowSelection = {
      selectedRowKeys,
      type:this.props.type=='radio'?'radio':'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        this.props.getSelectRowData(selectedRows);
        this.setState({selectedRowKeys},() => {
          if(this.props.getSelectKey){
            this.props.getSelectKey(selectedRowKeys);
          }
        });
      },
      getCheckboxProps: this.props.getCheckboxProps ? this.props.getCheckboxProps : '',
    }
    const offOrOnLineBtn = this.props.offOrOnLineBtn?<Button className="queryBtn"  onClick={this.offLine}>上线</Button> : null;
    const customBtn = this.props.customBtn ?<Button className='lineBtn'　onClick={this.custom}>按钮</Button> : null;
    const addBtn = this.props.addBtn?<Button className="queryBtn" type="primary" onClick={this.add}>新建</Button> : null;
    const goBackBtn = this.props.goBackBtn ?<Button className="resetBtn" onClick={this.goBackBtn}>返回</Button>:null;
    const updateBtn = this.props.updateBtn ?<Button className="queryBtn" onClick={this.getData}>刷新</Button> : null;
    const importBtn = this.props.importBtn ?<div><Upload {...uploadProps}><Button className="resetBtn"  onClick={this.importData}>{this.props.importBtn.label ? this.props.importBtn.label : '导入'}</Button></Upload></div>: null;
    const exportBtn = this.props.exportBtn ?<Button className="exportBtn" onClick={this.exportData}>导出</Button> : null;
    const deleteBtn = this.props.deleteBtn ?<Popconfirm title="确定删除所选项吗？" onConfirm={this.deleteData} okText="确定" cancelText="取消"><Button type="primary" className="deleteBtn" >删除</Button></Popconfirm> : null;
    const search = this.props.search ? (
      <Row className="row">
        {
          this.props.search.map((item, index) => {
          return (
            <div key={index}>
              {
                item.type==='select' ? 
                (
                    <Col span="8" pull={1}>
                        <Form.Item {...formItemLayout} label={item.label}>
                            {
                                getFieldDecorator(item.key, { initialValue: '' })
                                (
                                    <Select className="select" style={{width:'100%'}} getPopupContainer={trigger => trigger.parentNode} onChange={value =>this.handleChange(value,item.key,item.qFilter,item.type)}>
                                        {item.option&&item.option.map(_=>{return <Option key={_.key} value={_.key}>{_.value}</Option>})}
                                    </Select>
                                )
                            }
                        </Form.Item>
                    </Col>
                ) 
                : item.type === 'rangePicker' ?
                (
                    <Col span="8" pull={1}>
                        <Form.Item className="RangePicker" {...formItemLayout} label={item.label}>
                            {
                                getFieldDecorator(item.key, { initialValue: '' })
                                (<RangePicker style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" className="input1" showTime={{ format: 'HH:mm:ss' }} onChange={value =>this.handleChange(value,item.key,item.qFilter,item.type)}/>)
                            }
                        </Form.Item>
                    </Col>
                )
                : item.type === 'input' ?
                (
                    <Col span="8" pull={1}>
                        <Form.Item {...formItemLayout} label={item.label}>
                            {
                                getFieldDecorator(item.key, {
                                  initialValue: '', 
                                  rules: [{required: false, whitespace: true,validator: (rule, value, callback) => illegalInput(rule, value, callback)}]
                                })
                                (<Input style={{ width: '100%' }} className="input1" placeholder="请输入关键字" onChange={e => this.handleChange(e.target.value,item.key,item.qFilter,item.type)}/>)
                            }
                        </Form.Item>
                    </Col>
                )
                : item.type === 'cascader' ?
                (
                    <Col span="8" pull={1}>
                        <Form.Item {...formItemLayout} label={item.label}>
                            {
                                getFieldDecorator(item.key, { initialValue: '' })
                                (<Cascader  style={{ width: '100%' }} className="input1" options={item.option}  placeholder="请输入关键字" changeOnSelect onChange={value => this.handleChange( value,  item.key, item.qFilter, item.type )} />)
                            }
                        </Form.Item>
                    </Col>
                ):null
              }
            </div>
          );
        })}
        <Col span="24" className="colBtn">
          <Button type="primary" htmlType="submit" className="queryBtn" >查询</Button>
          <Button type="primary" className="resetBtn" onClick={() => { this.props.form.resetFields(); this.setState({ queryFilter: {} })}}>重置</Button>
        </Col>
      </Row>
    ) : null;
    const num = this.props.scroll&&this.props.scroll.width;
    const dataSourceList = [
      {
        userId: '1',
        name: '胡彦斌',
        age: 32,
        mobile: '17700000000',
      },
      {
        userId: '2',
        name: '胡彦祖',
        age: 42,
        mobile: '16600000000',
      },
      {
        userId: '3',
        name: '胡带飞',
        age: 26,
        mobile: '13812345678',
      },
      {
        userId: '4',
        name: '注射液',
        age: 28,
        mobile: '16512345687',
      },
      {
        userId: '5',
        name: '凤飞飞',
        age: 30,
        mobile: '19923145678',
      },
    ];
    const columns=[
      {
        title: 'ID',
        dataIndex: 'userId',
        key: 'userId',
      },

      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title:'手机号',
        dataIndex:'mobile',
        key:'mobile',
      },
      {
        title:'年龄',
        dataIndex:'age',
        key:'age',
      },
    ];
    return(
      <div className="custom-table">
        <div className={this.props.search ? 'custom-table-search' : null}>
          <Form onSubmit={this.handleSubmit}>{search}</Form>
        </div>
        {children}
        <div className="custom-table-btn">
          {offOrOnLineBtn}
          {customBtn}
          {addBtn}
          {goBackBtn}
          {updateBtn}
          {importBtn}
          {exportBtn}
          {deleteBtn}
        </div>
        <Table 
          scroll={{ x: num }} 
          rowKey={this.props.rowkey?this.props.rowkey:'id'} 
          bordered 
          columns={columns} 
          dataSource={dataSourceList} 
          locale={locale} 
          pagination={pagination} 
          rowSelection={rowSelection} 
          onRow={record=>{
            return {
              onClick:(e)=>{
                this.props.getSelectRowData([record])
              }
            }
          }
        }
        />
      </div>)
    ;
  }
}