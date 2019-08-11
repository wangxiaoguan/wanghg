import React,{ Component } from 'react';
import { Form, Table, Row, Col, Select, Button, Input, DatePicker, Message, Popconfirm, Upload, Cascader } from 'antd';
// import zhCN from 'antd/lib/locale-provider/zh_CN';
import {connect} from 'react-redux';
import { BEGIN, getDataSource, getPageData, getSelectRows } from '../../../redux-root/action/table/table';
import './TableStyle.less';
import { arrayToString } from '../tools';
import ServiceApi from '../.././content/apiprefix';
import { illegalInput } from '../../../utils/checkForm';
import {postService,exportExcelService} from '../.././content/myFetch';
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
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
  componentWillUnmount(){
    // this.getPageData(1, 10, '');
    // this.props.retSetData({ root: { list: [] } });
    // this.props.getSelectRowData([]);
  }
  componentDidUpdate(){
    // if (this.state.dataSourceUpdate&&this.props.dataSource.root) {
    //   this.setState({ totalNum: this.props.dataSource.root.totalNum, dataSourceUpdate:false});
    // }
  }
  componentDidMount() {
    // this.getPageData(1, 10, '');
    // this.props.retSetData({ root: { list: [] } });
    // if(this.props.query){
    //   this.setState({
    //     query:this.props.query,
    //   },() => {
    //     this.getData(`${this.props.url}/1/10?${this.state.query}`);
    //     this.getPageData(1,10,this.state.query);
    //   });
    // }else{
    //   this.getData(`${this.props.url}/1/10?${this.state.query}`);
    //   this.getPageData(1,10,this.state.query);
    // }
  }

  getPageData(currentPage,pageSize,query){
    let data = {currentPage,pageSize,query}; 
    this.props.getPageData(data);
  }
  getData = async(url) => {
    await this.props.getData(ServiceApi + `${url}`);
  }
  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (nextProps.dataSource !== prevState.dataSource) {
  //     return { dataSource: nextProps.dataSource,dataSourceUpdate:true};
  //   }
  //   return null;
  // }

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
    if (key ==='categoryId') {
      let tempValue = '';
      tempValue = value[value.length - 1]||'';
      queryFilter[key] = `${qFilter}=${tempValue}`;
    }else 
    if (type === 'rangePicker') {
      if(value.length != 0) {
        queryFilter[key] = `Q=${key}_D_GE=${value[0].format('YYYY-MM-DD HH:mm:ss')}&Q=${key}_D_LE=${value[1].format('YYYY-MM-DD HH:mm:ss')}`;
      } else{
        queryFilter[key] = '';
      }
    } else {
      queryFilter[key] = `${qFilter}=${value}`;
    }
    this.setState({ queryFilter });
  }

  handleSubmit = e => {
    const { currentPage, pageSize}=this.state;
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        fieldsValue['organizationId'] = fieldsValue['organizationId']?eval(fieldsValue['organizationId']):'';
        fieldsValue['categoryId'] = fieldsValue['categoryId']?arrayToString(fieldsValue['categoryId']):'';
        this.setState({
          fieldsValue:fieldsValue,
        });
        let query = '';
        Object.values(this.state.queryFilter).map(item => {
          if (query === '') {
            query =  item;
          } else {
            query = query + '&' + item;
          }
        });
        if(this.props.special){
          if (query==='') {
            query = this.props.special;
          }else{
            query = query+'&'+this.props.special;
          }
        }
        if (this.props.urlfilter) {
          if (query === '') {
            query = this.props.urlfilter;
          } else {
            query = query + '&' + this.props.urlfilter;
          }
        }
        
        this.setState({ query },() => {
          this.getData(`${this.props.url}/1/10?${query}`);
          //查询重置
          this.setState({
            currentPage:1,
          },() => {
            this.getPageData(this.state.currentPage,pageSize,query);
          });
        });
        
      }
    });
  };
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
    let body = { ids: selectedRowKeys };
    postService(ServiceApi + url, body, data => {
      if (data.retCode === 1) {
        Message.success('操作成功');
        this.getData(`${this.props.url}/1/10?${this.state.query}`);
      }
    });
  }
  render() {
    const refresh = this.getData;
    const url = this.props.url;
    const currentPage1 = this.state.currentPage;
    const pageSize1 = this.state.pageSize;
    const query = this.state.query;
    let uploadProps;

    //导入
    if(this.props.importBtn){
      uploadProps = {
        name: 'file',
        action: ServiceApi + this.props.importBtn.url,
        /*'services/systemA/import/groupMember'+'?groupId='+`${this.props.groupId}`,*/
        accept: 'application/vnd.ms-excel',
        multiple: false,
        data: null,
        showUploadList: false,
        onChange(info) {
          if(info.file.response){
            if ( info.file.response.retCode == '1' ) {
              Message.success( info.file.name + ' 上传成功。', 3 );
              refresh(`${url}/${currentPage1}/${pageSize1}?${query}`);
            } else if ( info.file.response.retCode == '0' ) {
              Message.error(info.file.response.retMsg + '失败原因：' + info.file.response.root.list[0], 5 );
            }
          }

        },
      };
    }else{
      uploadProps={};
    }
    
    
    const { totalNum, pageSize, currentPage ,selectedRowKeys} = this.state;
    const {

      form: { getFieldDecorator },
      children,
    } = this.props;
    /**
 * 待处理dataSource格式
 * totalNum
 * pagesize  完成
 * currentPage  完成
 */
    let data;
    const dataSource = this.state.dataSource.root&&this.state.dataSource.root.list;
    dataSource&&dataSource.map((item, index) => {
      item.sNum = index + 1 + (this.state.currentPage-1)*10;
    });

    console.log('this.props.typeId=>',this.props.typeId)
    if(this.props.typeId == 'Vote'){
      data = dataSource&&dataSource.filter(item => item.typeId === '4' && item.status == this.props.tabKey);
    }else if(this.props.typeId == 'shopping'){
      data = dataSource&&dataSource.filter(item => item.typeId === '5' && item.status == this.props.tabKey);
    }else if(this.props.typeId == 'Magazine'){
      /*   dataSource.map((item,index) => {
        item.pictureUrl = <img src={item.pictureUrl} style={{width:"50px"}} onClick={this.props.handleMagazinePreview.bind(this,item.pictureUrl)}/>
      })    */  
      data = dataSource;
    }else{
      data = dataSource;
    }
    //按照时间进行倒序；
    if(data&&data.length>1){
      data = data.sort(function(a,b){
        return a.createDate<b.createDate;
      })
    }

    data&&data.map((item, index) => {
      item.sNum = index + 1 + (this.state.currentPage-1)*10;

      if(item.selectCount){
        item.maxmultipleSize=item.multiSelectCount;
        item.maxsingleSize=item.singleSelectCount;
      }else if(item.selectCount===0){
        item.maxmultipleSize=0;
        item.maxsingleSize=0;
      }
    })
    
    let pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      total: totalNum,
      pageSize: pageSize,
      current: currentPage,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange,
      pageSizeOptions: ['10', '15', '20'],
    };
    const locale = {
      filterTitle: '筛选',
      filterConfirm: '确定',
      filterReset: '重置',
      emptyText: '暂无数据',
    };
    const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
    const formItemLayout1 = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
    const formItemLayout2 = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
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
    };
    
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
        {this.props.search.map((item, index) => {
          return (
            <div key={index}>
              {item.type==='select' ? (
                <Col span="8" pull={1}>
                  <Form.Item {...formItemLayout} label={item.label}>
                    {
                      getFieldDecorator(item.key, { initialValue: '' })
                      (
                        <Select className="select" style={{width:'100%'}} getPopupContainer={trigger => trigger.parentNode} onChange={value =>this.handleChange(value,item.key,item.qFilter,item.type)}>
                          {
                            item.option&&item.option.map(_=>{return <Option key={_.key} value={_.key}>{_.value}</Option>})
                          }
                        </Select>
                      )
                    }
                  </Form.Item>
                </Col>
              ) : ( 
                <Col span="8" pull={1}>
                  {item.type === 'rangePicker' ? (
                    <Form.Item className="RangePicker" {...formItemLayout2} label={item.label}>
                      {
                        getFieldDecorator(item.key, { initialValue: '' })
                        (<RangePicker style={{ width: '100%' }} format="YYYY-MM-DD HH:mm:ss" className="input1" showTime={{ format: 'HH:mm:ss' }} onChange={value =>this.handleChange(value,item.key,item.qFilter,item.type)}/>)
                      }
                    </Form.Item>
                  ) : (
                    item.type==='input'?
                      <Form.Item {...formItemLayout1} label={item.label}>
                        {
                          getFieldDecorator(item.key, {
                            initialValue: '', 
                            rules: [{required: false, whitespace: true,validator: (rule, value, callback) => illegalInput(rule, value, callback)}]
                          })
                          (<Input style={{ width: '100%' }} className="input1" placeholder="请输入关键字" onChange={e => this.handleChange(e.target.value,item.key,item.qFilter,item.type)}/>)
                        }
                      </Form.Item>
                    :item.type === 'cascader' ?
                        <Form.Item {...formItemLayout1} label={item.label}>
                          {
                            getFieldDecorator(item.key, { initialValue: '' })
                            (<Cascader  style={{ width: '100%' }} className="input1" options={item.option}  placeholder="请输入关键字" changeOnSelect onChange={value => this.handleChange( value,  item.key, item.qFilter, item.type )} />)
                          }
                        </Form.Item>:null
                  )}
                </Col>
              )}
            </div>
          );
        })}
        <Col span="24" className="colBtn">
          <Button
            type="primary"
            htmlType="submit"
            className="queryBtn"
          >
            查询
          </Button>
          <Button
            type="primary"
            className="resetBtn"
            onClick={() => {
              this.props.form.resetFields();
              this.setState({ queryFilter: {} });
            }}
          >
            重置
          </Button>
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
    console.log(addBtn)
    
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
          {/* {optionalBtn} */}
          {/* {optionalBtn1} */}
          {/* {optionalBtn2} */}
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
          onRow={(record)=>{
          return {
            onClick:(e)=>{
              console.log('e',e.target.tagName);
              if (e.target.tagName !== 'TD' && e.target.tagName !=='DIV') {
                return;
              }
              let checkedProps = this.props.getCheckboxProps ? this.props.getCheckboxProps(record) : '';
              let recordKey = record[this.props.rowkey ? this.props.rowkey : 'id'];
              let selectedRowKeys = this.state.selectedRowKeys;
              let selectedRows = this.state.selectedRows;
              if (this.props.type == 'radio') {
                if (!checkedProps.disabled) {
                  this.props.getSelectRowData([record]);
                  selectedRowKeys = [recordKey];
                  this.setState({ selectedRowKeys }, () => {
                    if (this.props.getSelectKey) {
                      this.props.getSelectKey(selectedRowKeys);
                    }
                  });
                }
              } else {
                if (!checkedProps.disabled) {
                  if (selectedRows.some(item =>
                    item[this.props.rowkey ? this.props.rowkey : 'id'] === recordKey
                  )) {
                    selectedRows.filter(item => item[this.props.rowkey ? this.props.rowkey : 'id'] !== recordKey);
                  } else {
                    selectedRows.push(record);
                  }
                  this.props.getSelectRowData(selectedRows);
                  if (selectedRowKeys.indexOf(recordKey) > -1) {
                    selectedRowKeys = selectedRowKeys.filter(_ => _ !== recordKey);
                  } else {
                    selectedRowKeys = [...this.state.selectedRowKeys, recordKey];
                  }
                  this.setState({ selectedRowKeys }, () => {
                    if (this.props.getSelectKey) {
                      this.props.getSelectKey(selectedRowKeys);
                    }
                  });
                }
              }
            },
          };}}/>
      </div>)
    ;
  }
}