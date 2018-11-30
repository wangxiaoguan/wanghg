import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {GetQueryString, postService, getService, exportExcelService} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import { connect } from 'react-redux';
import { BEGIN, getDataSource, getPageData, getSelectRows } from '../../../../redux-root/action/table/table';
import { Form, Row, Col, Input, Select, Modal, Cascader, Divider, Button, message, Table,Spin} from 'antd';
import AlterPoint from './AlterPoint';
import {ImportPart} from '../../SystemSettings/PartyMembers/PartyMembers';
const FormItem = Form.Item;
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
export default class UserPoint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pointData:[], //列表展示数据
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
      values: {}, //查询条件
      departmentOption: [],

      dataInfo: {}, //获取列表的某行数据
      pointCount: 589, //经验值Modal-key值
      pointFlag: false, //是否显示 经验值变更Modal
      treasureCount: 987, //积分Modal-key值
      treasureFlag: false, //是否显示 积分变更Modal

      importFlag: false, //是否显示 导入Modal
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
    //获取用户积分管理列表初始数据
    getService(API_PREFIX + 'services/system/pointTreasure/list/1/10',data=>{
      console.log('initUserPoint:',data);
      if(data.retCode === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          loading:false,
        },()=>{
          console.log('pointdata:',this.state.pointData);
        });
      } else{
        message.error(data.retMsg);
        this.setState({
          loading:false
        })
      }
    });

    //部门下拉框数据
    getService(API_PREFIX + 'services/system/organization/getFirstGradeOrg',data=>{
      console.log('department:', data.root.list);
      if(data.retCode === 1){
        let dep = data.root.list;
        let temp = [];
        dep & dep.map((item, index) => {
          let obj = {};
          obj['key'] = item.id;
          obj['value'] = item.name;
          temp.push(obj);
        });
        this.setState({
          departmentOption: temp,
          loading:false,
        },()=>{
          console.log('departmentOption',this.state.departmentOption);
        });
      } else{
        message.error(data.retMsg);
        this.setState({
          loading:false
        })
      }
    });
  }

  //打开导入弹窗
  showImportModal = () => {
    this.setState({
      importFlag: true,
    });
  }

  exportExcel = () =>{
    // debugger;
    let values = this.valuesDeal(this.state.values);

    let queryFilter = 'Q=lastname_S_LK=' + values.lastname
          + '&Q=mobile_S_LK=' + values.mobile
          + '&Q=orginfo_S_EQ=' + values.orginfo;
    let path = API_PREFIX + 'services/system/pointTreasure/export/pointTreasure' + '?' + `${queryFilter}`;
    exportExcelService(path, '', '用户积分');
  }

  //确定导入
  importOk = () =>{
    this.setState({
      importFlag: false,
    });
    this.refreshData();
  }

  //取消导入
  importCancel = () => {
    this.setState({
      importFlag: false,
    });
  }

  //打开经验值变更弹窗
  changePoint = (value) => {
    this.setState({
      pointFlag: true,
      pointCount: this.state.pointCount++,
      dataInfo: value,
    },()=>{
      console.log('changePoint:',this.state.dataInfo);
    });
  }

  //关闭经验值变更弹窗
  outPoint = () => {
    this.setState({
      pointFlag: false,
    });
  }

  //打开普通积分变更弹窗
  changeTreasure = (value) => {
    this.setState({
      treasureFlag: true,
      treasureCount: this.state.treasureCount++,
      dataInfo: value,
    });
  }

  //关闭普通积分变更弹窗
  outTreasure = () => {
    this.setState({
      treasureFlag: false,
    });
  }

  //当查询条件变化时
  onChangeData = value => {
    this.setState({
      pointData: value.root.list,
      totalNum: value.root.totalNum,
    });
  }

  getParametersFromChild = value => {
    this.setState({
      values: value,
    });
  }

  //处理查询条件的数组
  valuesDeal = (originValues) =>{
    let values = originValues;
    if(typeof(values.lastname) === 'undefined'){
      values.lastname = '';
    }
    if(typeof(values.mobile) === 'undefined'){
      values.mobile = '';
    }
    if(typeof(values.orginfo) === 'undefined'){
      values.orginfo = '';
    }
    return values;
  }

  //刷新列表展示数据
  refreshData = () => {
    let values = this.valuesDeal(this.state.values);

    let queryFilter = 'Q=lastname_S_LK=' + values.lastname
      + '&Q=mobile_S_LK=' + values.mobile
      + '&Q=orginfo_S_EQ=' + values.orginfo;

    getService(API_PREFIX + `services/system/pointTreasure/list/${this.state.currentPage}/${this.state.pageSize}?${queryFilter}`, data => {
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
    let values = this.valuesDeal(this.state.values);
    let queryFilter = 'Q=lastname_S_LK=' + values.lastname
        + '&Q=mobile_S_LK=' + values.mobile
        + '&Q=orginfo_S_EQ=' + values.orginfo;

    getService(API_PREFIX + `services/system/pointTreasure/list/${current}/${pageSize}?${queryFilter}`,data =>{
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
    let values = this.valuesDeal(this.state.values);
    let queryFilter = 'Q=lastname_S_LK=' + values.lastname
        + '&Q=mobile_S_LK=' + values.mobile
        + '&Q=orginfo_S_EQ=' + values.orginfo;

    getService(API_PREFIX + `services/system/pointTreasure/list/${current}/${pageSize}?${queryFilter}`, data=>{
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
    const { departmentOption} = this.state;

    let currentPage = this.state.currentPage;
    let pageSize = this.state.pageSize;

    let powers = this.props.powers;
    console.log('权限码', powers);
    let updatePowers = powers && powers['20001.21601.002'];
    let exportPowers = powers && powers['20001.21601.202']; 

    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '部门',
        dataIndex: 'orgname',
        key: 'orgname',
      },
      {
        title: '经验值',
        dataIndex: 'point',
        key: 'point',
        render: (text, record) => {
          return <a onClick={() => {
            const userid = JSON.stringify(record.userid);
            window.sessionStorage.setItem('point-userid', userid);
            location.hash = '#/PointManagement/PointInfo';
          }}
          >
            {text}
          </a>;
        },
      },
      {
        title: '普通积分',
        dataIndex: 'treasure',
        key: 'treasure',
        render: (text, record) => {
          return <a onClick={() => {
            const userid = JSON.stringify(record.userid);
            window.sessionStorage.setItem('treasure-userid', userid);
            location.hash = '#/PointManagement/TreasureInfo';
          }}
          >
            {text}
          </a>;
        },
      },
      {
        title: '党员荣誉积分',
        dataIndex: 'partyMemHonor',
        key: 'partyMemHonor',
        render: (text, record) => {
          return <a href="#/PointManagement/PartyMemHonorInfo"
            onClick={() => {
              const userid = JSON.stringify(record.userid);
              window.sessionStorage.setItem('partyMemHonor-userid',userid);
            }}
          >
            {text}
          </a>;
        },
      },
      {
        title: '生日券积分',
        dataIndex: 'birthdayTicket',
        key: 'birthdayTicket',
        render: (text, record) => {
          return <a href="#/PointManagement/BirthdayTicketInfo"
            onClick={() => {
              const userid = JSON.stringify(record.userid);
              window.sessionStorage.setItem('birthdayTicket-userid',userid);
            }}
          >
            {text}
          </a>;
        },
      },
      {
        title: '电影票积分',
        dataIndex: 'cinemaTicket',
        key: 'cinemaTicket',
        render: (text, record) => {
          return <a href="#/PointManagement/CinemaTicketInfo"
            onClick={() => {
              const userid = JSON.stringify(record.userid);
              window.sessionStorage.setItem('cinemaTicket-userid',userid);
            }}
          >
            {text}
          </a>;
        },
      },
      {
        title: '过节物资积分',
        dataIndex: 'festivitiesMaterial',
        key: 'festivitiesMaterial',
        render: (text, record) => {
          return <a href="#/PointManagement/FestivitiesMaterialInfo"
            onClick={ () => {
              const userid = JSON.stringify(record.userid);
              window.sessionStorage.setItem('festivitiesMaterial-userid',userid);
            }}
          >
            {text}
          </a>;
        },
      },
      /*{
          title: '是否启用',
          dataIndex: 'isEnabled',
          key: 'isEnabled',
          render: (text, record) => {
            if(record.isEnabled == true){
              return <span>是</span>;
            }else {
              return <span>否</span>;
            }
          },
        },*/
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          return <div>
            <a className="operation" onClick={this.changePoint.bind(this,record)}
              style={{ display: 'inline-block' }} >经验值变更 </a>
            <Divider type="vertical" />
            <a className="operation" onClick={this.changeTreasure.bind(this,record)}
              style={{ display: 'inline-block' }} > 普通积分变更</a>
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
      <div className="custom-table-search">
        <WrappedSearchForm onChangeData={this.onChangeData} currentPage={this.state.currentPage} pageSize={this.state.pageSize}
          departmentOption={departmentOption}
          getParametersFromChild={this.getParametersFromChild} />
      </div>
      <div className="custom-table-btn">
        <Button className="resetBtn" style={{order: 1}} onClick={this.showImportModal}>
            导入
        </Button>
        <Button className="exportBtn" style={{order: 2}} onClick={this.exportExcel}>
          导出
        </Button>
      </div>
      <Table className="tabCommon" dataSource={this.state.pointData} columns={columns} pagination={pagination} bordered/>
      <Modal
        title="普通积分导入"
        visible={this.state.importFlag}
        cancelText="返回"
        okText="确定"
        onCancel={this.importCancel}
        onOk={this.importOk}
        destroyOnClose={true}
      >
        <ImportPart importUrl="/services/system/import/treasure" downlodUrl={API_PREFIX + 'services/system/pointTreasure/template/export/pointTreasure'}
          listurl={'services/system/pointTreasure/list'}
          pageData={this.props.pageData}
          getData={this.getData}
          fileName="普通积分导入模板" />
      </Modal>
      <Modal
        title="经验值操作"
        visible={this.state.pointFlag}
        key={this.state.pointCount}
        onCancel={this.outPoint}
        footer={null} //底部内容，当不需要默认底部按钮时--null
        destroyOnClose={true}
      >
        <AlterPoint dataInfo={this.state.dataInfo} flag="point" refreshData={this.refreshData} outPoint={this.outPoint}/>
      </Modal>
      <Modal
        title="积分值操作"
        visible={this.state.treasureFlag}
        key={this.state.treasureCount}
        onCancel={this.outTreasure}
        footer={null} //底部内容，当不需要默认底部按钮时--null
        destroyOnClose={true}
      >
        <AlterPoint dataInfo={this.state.dataInfo} flag="treasure" refreshData={this.refreshData} outTreasure={this.outTreasure}/>
      </Modal>
    </div></Spin> ;
  }
}

class SearchForm extends Component{
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

      if(typeof(values.lastname) === 'undefined'){
        values.lastname = '';
      }
      if(typeof(values.mobile) === 'undefined'){
        values.mobile = '';
      }
      if(typeof(values.orginfo) === 'undefined'){
        values.orginfo = '';
      }

      let queryFilter = ''
      if(values.lastname){
        queryFilter += '&Q=lastname_S_LK=' + values.lastname 
      }
      if(values.mobile){
        queryFilter += '&Q=mobile_S_LK=' + values.mobile
      }
      if(values.orginfo){
        queryFilter += '&Q=orginfo_S_LK=' + values.orginfo;
      }

      queryFilter=queryFilter.substring(1,100)
      console.log('queryFilter',queryFilter)

      getService(API_PREFIX + `services/system/pointTreasure/list/${this.props.currentPage}/${this.props.pageSize}?${queryFilter}`,data => {
        if(data.retCode === 1){
          this.props.onChangeData(data);
          this.props.getParametersFromChild(values);
        } else if(data.retCode === 0){
          message.error(data.retMsg);
        }
      });
    });
  }

  render(){
    const {getFieldDecorator} = this.props.form;

    const formItemLayout = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 17,
      },
    };
    const formItemLayout1 = {
      labelCol: {
        span: 7,
      },
      wrapperCol: {
        span: 17,
      },
    };

    const config = {
      rules: [{
        required: false,
      }],
    };

    return (
      
        <Form onSubmit={this.handleSubmit} >
          <Row style={{marginTop: "17px"}}>
            <Col span={8} pull={1}>
              <FormItem {...formItemLayout1} label="姓名" maxLength="60">
                {getFieldDecorator('lastname', config)(
                  <Input
                    className="input1"
                    style={{ width: '100%' }}
                    placeholder="请输入关键字"/>
                )}
              </FormItem>
            </Col>
            <Col span={8} pull={1}>
              <FormItem {...formItemLayout} label="手机号" maxLength="11">
                {getFieldDecorator('mobile', config)(
                  <Input
                    className="input1"
                    style={{ width: '100%' }}
                    placeholder="请输入关键字"/>
                )}
              </FormItem>
            </Col>
            <Col span={8} pull={1}>
              <FormItem {...formItemLayout} label="部门">
                {getFieldDecorator('orginfo', { initialValue: '' },config)(
                  <Select
                    className="select"
                    style={{width: '100%'}} >
                    <Option value="">全部</Option>
                    {this.props.departmentOption && this.props.departmentOption.map((_)=>{
                      return(<Option key={_.key} value={_.key}>
                        {_.value}
                      </Option>);
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
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
                }}
              >
                重置
              </Button>
            </Col>
          </Row>
        </Form>
      
    );
  }
}
const WrappedSearchForm = Form.create()(SearchForm);


