import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {GetQueryString, postService, getService, exportExcelService} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import { connect } from 'react-redux';
import { BEGIN, getDataSource, getPageData, getSelectRows } from '../../../../redux-root/action/table/table';
import { Form, Row, Col, Input, InputNumber, Select, Modal, Radio, Cascader, Divider, Button, message, Table, Popconfirm,Spin} from 'antd';
import {RuleConfig} from  '../../ruleConfig';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
// import './CarouselDetail.less';

@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    getPageData:n=>dispatch(getPageData(n)),
    retSetData: n=>dispatch(getDataSource(n)),
    getSelectRowData: n => dispatch(getSelectRows(n)),
  })
)
export default class RechargePoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pointData:[], //列表展示数据
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
      selectedRowKeys: [], //指定选中项的 key 数组，需要和 onChange 进行配合

      visible: false, //显示弹窗 --true:显示,false:关闭
      dataInfo: {}, //获取列表的某行数据
      flag: false, //是否显示 编辑Modal,true-显示，false-不显示
      loading: false,
    };
  }

  componentWillUnmount(){
    //this.getPageData(1, 10, '');
    // this.props.retSetData({ root: { list: [] } });
    // this.props.getSelectRowData([]);
  }

  componentDidMount(){
    this.setState({ loading: true });
    //获取积分充值配置列表初始数据
    getService(API_PREFIX + 'services/system/treasureRecharge/list/1/10',data=>{
      console.log('initRechargePoint:',data);
      if(data.retCode === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          loading:false,
        },()=>{
          console.log('pointData:',this.state.pointData);
        });
      }  else{
        message.error(data.retMsg);
        this.setState({
          loading:false
        })
      }
    });

  }

  //table选中项发生变化时的回调
  onSelectChange = (selectedRowKeys) => {
    this.setState({selectedRowKeys}, () => {
      console.log('selectedRowKeys:', this.state.selectedRowKeys);
    });
  }

  //删除积分充值配置记录
  deleteData = ()=>{
    let body = { ['ids']: this.state.selectedRowKeys };
    console.log('body:',body);

    postService(API_PREFIX+'services/system/treasureRecharge/remove/TreasureRecharge', body, data => {
      if(data.retCode === 1){
        message.success('删除成功');
        this.setState({
          selectedRowKeys: [],
        });
        this.setState({
          currentPage: 1,
        }, () => {
          this.refreshData();
        });
      }
    });
  }

  //新增Modal
  addData = () => {
    this.setState({
      dataInfo: {},
      visible: true,
      flag: false,
    });
  }

  //编辑Modal
  editData = (value) => {
    this.setState({
      visible: true,
      flag: true,
      dataInfo: value,
    },()=>{
      console.log('rechargePoint:',this.state.dataInfo);
    });
  }

  //关闭Modal
  closeModal = () => {
    this.setState({
      visible: false,
    });
  }

  //当查询条件变化时
  onChangeData = value => {
    this.setState({
      pointData: value.root.list,
      totalNum: value.root.totalNum,
    });
  }

  //刷新列表展示数据
  refreshData = () => {
    getService(API_PREFIX + `services/system/treasureRecharge/list/${this.state.currentPage}/${this.state.pageSize}`, data => {
      if(data.retCode === 1){
        this.setState({
          pointData: data.root.list,
          totalNum: data.root.totalNum,
        });
      } else if(data.retCode === 0){
        message.error(data.retMsg);
      }
    });
  }

  //页码改变触发
  onPageChange = (current, pageSize) =>{
    getService(API_PREFIX + `services/system/treasureRecharge/list/${current}/${pageSize}`,data =>{
      console.log("data=====>",data)
      if(data.retCode === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          currentPage: current,
          pageSize: pageSize,
        });
      } else if(data.retCode === 0){
        message.error(data.retMsg);
      }
    });
  }

  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    getService(API_PREFIX + `services/system/treasureRecharge/list/${current}/${pageSize}`, data=>{
      if(data.retCode === 1){
        this.setState({
          totalNum: data.root.totalNum,
          currentPage: current,
          pageSize: pageSize,
          pointData: data.root.list,
        });
      } else if(data.retCode === 0){
        message.error(data.retMsg);
      }
    });
  }

  render() {
    let currentPage = this.state.currentPage;
    let pageSize = this.state.pageSize;

    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

      let powers = this.props.powers;
      console.log('权限码', powers);
      let createPowers = powers && powers['20001.21603.001'];
      let updatePowers = powers && powers['20001.21603.002'];
      let readPowers = powers && powers['20001.21603.003'];
      let deletePowers = powers && powers['20001.21603.004'];

    const columns = [
      {
        title: '充值积分',
        dataIndex: 'point',
        key: 'point',
      },
      {
        title: '所需金额/元',
        dataIndex: 'money',
        key: 'money',
      },
      {
        title: '显示顺序',
        dataIndex: 'sort',
        key: 'sort',
      },
      {
        title: '是否启用',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          if(record.status == 1){
            return <span>是</span>;
          }else {
            return <span>否</span>;
          }
        },
      },
      {
        title: '是否默认选中',
        dataIndex: 'checked',
        key: 'checked',
        render: (text, record) => {
          if(record.checked == 1){
            return <span>是</span>;
          }else {
            return <span>否</span>;
          }
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createdate',
        key: 'createdate',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          return <div>
            <a className="operation" onClick={this.editData.bind(this,record)}
              style={{ display: 'inline-block' }} >编辑</a>
          </div>;
        },
      },
    ];

    this.state.pointData && this.state.pointData.map((item, index) => {
      item['key'] = index + 1;
    });

    let pagination = {
      total: this.state.totalNum,
      pageSize: this.state.pageSize,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '15', '20'],
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange,
    };

    //设置formItem的格式
    const formItemLayout = {
      labelCol: {
        xs: { span: 12},
        sm: { span: 2},
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 },
      },
    };

    return <Spin spinning={this.state.loading}><div className="custom-table">
      <div className="custom-table-btn">
        <Button className="queryBtn" type="primary" style={{order: 1}} onClick={this.addData}>
              添加
        </Button>
        <Popconfirm title="确定删除所选项吗？" onConfirm={this.deleteData}
          okText="确定" cancelText="取消">
          <Button type="primary" className="deleteBtn" style={{order: 2}} disabled={selectedRowKeys.length>0 ? false : true}>
              删除
          </Button>
        </Popconfirm>
      </div>
      <Table className="tabCommon" dataSource={this.state.pointData} columns={columns} pagination={pagination}
        rowKey="id" rowSelection={rowSelection} bordered/>
      <Modal
        title={this.state.flag ? '编辑充值配置' : '添加充值配置'}
        visible={this.state.visible}
        key={'rechargePointModal'}
        onCancel={this.closeModal}
        footer={null} //底部内容，当不需要默认底部按钮时--null
        destroyOnClose={true}
      >
        <WrappedPointForm dataInfo={this.state.dataInfo} flag={this.state.flag} refreshData={this.refreshData} closeModal={this.closeModal}/>
      </Modal>
    </div></Spin>;
  }
}

class PointForm extends Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){

  }

  handleSubmit= e => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) =>{
      if(err){
        return;
      }

      const values = {
        ...fieldsValue,
      };
      // console.log('money',typeof values.money);
      console.log('this.props.flag', this.props.flag);

      if(this.props.flag) {
        values.id = this.props.dataInfo.id;
        postService(API_PREFIX + 'services/system/treasureRecharge/update/TreasureRecharge', values, data => {
          if (data.retCode === 1) {
            message.success(data.retMsg);
            this.props.refreshData();
            this.props.closeModal();
          } else if (data.retCode === 0) {
            message.error(data.retMsg);
          }
        });
      } else {
        postService(API_PREFIX + 'services/system/treasureRecharge/add/TreasureRecharge', values, data => {
          if (data.retCode === 1) {
            message.success(data.retMsg);
            this.props.refreshData();
            this.props.closeModal();
          } else if (data.retCode === 0) {
            message.error(data.retMsg);
          }
        });
      }
    });
  }

  render(){
    console.log('dataInfo',this.props.dataInfo);

    //获取数据
    const { getFieldDecorator } = this.props.form;
    //设置formItem的格式
    const formItemLayout = {
      labelCol: {
        sm: { span: 8},
      },
      wrapperCol: {
        sm: { span: 10 },
      },
    };

    const config = {
      rules: [{
        required: false,
      }],
    };

    return (
      <Form onSubmit={this.handleSubmit} >
        <FormItem {...formItemLayout} label="充值积分" >
          {getFieldDecorator('point', {
            initialValue: this.props.dataInfo.point ? this.props.dataInfo.point : '',
            ...RuleConfig.rechargePointCofig,
          })(
            <InputNumber min={1} max={99999} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="所需金额" maxLength="11">
          {getFieldDecorator('money',
            {initialValue: this.props.dataInfo.money ? this.props.dataInfo.money : '',
              ...RuleConfig.moneyCofig,
            })(
            <InputNumber min={1} max={99999} step={1} />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="显示顺序" maxLength="3">
          {getFieldDecorator('sort',
            {initialValue: this.props.dataInfo.sort ? this.props.dataInfo.sort : '',
              ...RuleConfig.sortCofig,
            })(
            <InputNumber min={1} max={999}/>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="是否启用"
        >{
            getFieldDecorator('status',
              {initialValue: JSON.stringify(this.props.dataInfo)!='{}' ? this.props.dataInfo.status : 1,
                ...RuleConfig.statusCofig,
              })
            (<RadioGroup>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>)
          }
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="是否默认选中"
        >{
            getFieldDecorator('checked',{
              initialValue: JSON.stringify(this.props.dataInfo)!='{}' ? this.props.dataInfo.checked : 1,
              ...RuleConfig.statusCofig,
            })
            (<RadioGroup>
              <Radio value={1}>是</Radio>
              <Radio value={0}>否</Radio>
            </RadioGroup>)
          }
        </FormItem>
        <Row>
          <Col>
            <Button style={{marginLeft:'165px'}} className="queryBtn" type="primary" htmlType="submit" size="large">确定</Button>
            <Button className="resetBtn" onClick={()=>this.props.closeModal()}>返回</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
const WrappedPointForm = Form.create()(PointForm);
