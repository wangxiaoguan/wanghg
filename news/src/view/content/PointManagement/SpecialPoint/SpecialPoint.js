import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {GetQueryString, postService, getService, exportExcelService} from '../../myFetch';
import ServiceApi from '../../apiprefix';
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
export default class SpecialPoint extends Component {
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
    //获取专项积分发放管理列表初始数据
    getService(ServiceApi + 'services/system/specialTreasureTask/taskList/1/10',data=>{
      console.log('initSpecialPoint:',data);
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

  //删除 专项积分发放
  deleteData = ()=>{
    let body = { ['ids']: this.state.selectedRowKeys };
    console.log('body:',body);

    postService(ServiceApi+'services/system/specialTreasureTask/delete/task', body, data => {
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

  //编辑Modal
  // editData = (value) => {
  //   this.setState({
  //     visible: true,
  //     flag: true,
  //     dataInfo: value,
  //   },()=>{
  //     console.log('rechargePoint:',this.state.dataInfo);
  //   });
  // }

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
  stopTask=(record)=>{
    let status=1;
    if(record.status==1){status=2}else{status=1}
      getService(ServiceApi+`services/system/specialTreasureTask/updateJobIdStatus/${record.id}/`+status,data=>{
        if(data.retCode === 1){
          if(data.root.status==2){
            message.success("停止任务成功")
          }else{
            message.success("开启任务成功")
          }
          getService(ServiceApi + `services/system/specialTreasureTask/taskList/${this.state.currentPage}/${this.state.pageSize}`, data => {
            if(data.retCode === 1){
              this.setState({
                pointData: data.root.list,
                totalNum: data.root.totalNum,
              });
            } else if(data.retCode === 0){
              message.error(data.retMsg);
            }
          })

        } else{
          message.error(data.retMsg);
        }
      })
  }
  //刷新列表展示数据
  refreshData = () => {
    getService(ServiceApi + `services/system/specialTreasureTask/taskList/${this.state.currentPage}/${this.state.pageSize}`, data => {
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
    getService(ServiceApi + `services/system/specialTreasureTask/taskList/${current}/${pageSize}`,data =>{
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
    getService(ServiceApi + `services/system/specialTreasureTask/taskList/${current}/${pageSize}`, data=>{
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
    let createPowers = powers && powers['20001.21602.001'];
    let updatePowers = powers && powers['20001.21602.002'];
    let readPowers = powers && powers['20001.21602.003'];
    let deletePowers = powers && powers['20001.21602.004'];

    const columns = [
      {
        title: '任务名称',
        dataIndex: 'taskname',
        key: 'taskname',
      },
      {
        title: '积分类型',
        dataIndex: 'typeName',
        key: 'typeName',
      },
      {
        title: '积分值',
        dataIndex: 'value',
        key: 'value',
      },
      {
        title: '任务类型',
        dataIndex: 'operateTypeDesp',
        key: 'operateTypeDesp',
      },
      {
        title: '执行方式',
        dataIndex: 'modelTypeDesp',
        key: 'modelTypeDesp',
      },
      {
        title: '积分发放时间',
        dataIndex: 'deliveryDesp',
        key: 'deliveryDesp',
      },
      {
        title: '活动截止时间',
        dataIndex: 'expireddate',
        key: 'expireddate',
      },
      {
        title: '积分生效时间',
        dataIndex: 'startdate',
        key: 'startdate',
      },
      {
        title: '积分失效时间',
        dataIndex: 'enddate',
        key: 'enddate',
      },
      {
        title: '创建时间',
        dataIndex: 'createdate',
        key: 'createdate',
      },
      {
        title: '任务状态',
        dataIndex: 'statusDesp',
        key: 'statusDesp',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          return <div>
              {
                record.status==1?<Popconfirm title="确定停止任务吗?" onConfirm={()=>this.stopTask(record)}>
                <a className='operation' >停止任务</a></Popconfirm>:
                <Popconfirm title="确定开启任务吗?" onConfirm={()=>this.stopTask(record)}>
                <a className='operation' >开启任务</a></Popconfirm>
              }
            <Divider type="vertical" />
            <a className="operation" onClick={() => (location.hash = `/PointManagement/SpecialPoint/EditTask?id=${record.id}`)}
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
        <Button className="queryBtn" type="primary" style={{order: 1}} onClick={() => {location.hash = '#/PointManagement/SpecialPoint/AddTask';}}>
              添加
        </Button>
        <Button className="resetBtn" type="primary" style={{order: 1}} onClick={() => {
          location.hash='#/PointManagement/CategoryManagement';
        }}>
            类别管理
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
        postService(ServiceApi + 'services/system/treasureRecharge/update/TreasureRecharge', values, data => {
          if (data.retCode === 1) {
            message.success(data.retMsg);
            this.props.refreshData();
            this.props.closeModal();
          } else if (data.retCode === 0) {
            message.error(data.retMsg);
          }
        });
      } else {
        postService(ServiceApi + 'services/system/treasureRecharge/add/TreasureRecharge', values, data => {
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
