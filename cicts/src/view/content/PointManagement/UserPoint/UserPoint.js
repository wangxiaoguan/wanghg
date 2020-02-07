import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import {GetQueryString, postService, getService, exportExcelService,exportExcelService1} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import { connect } from 'react-redux';
import { BEGIN, getDataSource, getPageData, getSelectRows } from '../../../../redux-root/action/table/table';
import { Form, Row, Col, Input, Select, Modal, Cascader, Divider, Button, message, Table,Spin} from 'antd';
import AlterPoint from './AlterPoint';
import {ImportPart} from '../../PartyBuildGarden/PartyMembers/PartyMembers';
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
    getService(API_PREFIX + 'services/web/point/info/getUserInfo/1/10',data=>{
      console.log('initUserPoint:',data);
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          loading:false,
        },()=>{
          console.log('pointdata:',this.state.pointData);
        });
      } else{
        message.error(data.errorMsg);
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

    let queryFilter = 
            (values.userName?'Q=userName=' + values.userName:'')
          + (values.mobile? '&Q=mobile=' + values.mobile:'')
          + (values.orgId?'&Q=orgId=' + values.orgId[values.orgId.length-1]:'');
    let path = API_PREFIX + 'services/web/point/info/export/getUserInfo' + '?' + `${queryFilter}`;
    exportExcelService1(path,'用户积分');
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
  onChangeData = (value, currentPage)=> {
    this.setState({
      pointData: value.root.list,
      totalNum: value.root.totalNum,
      currentPage:currentPage,
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
    if(typeof(values.userName) === 'undefined'){
      values.userName = '';
    }
    if(typeof(values.mobile) === 'undefined'){
      values.mobile = '';
    }
    if(typeof(values.orgId) === 'undefined'){
      values.orgId = '';
    }
    return values;
  }

  //刷新列表展示数据
  refreshData = () => {
    let values = this.valuesDeal(this.state.values);

    let queryFilter = 
        (values.userName?'Q=userName=' + values.userName:'')
      + (values.mobile?'&Q=mobile=' + values.mobile:'')
      + (values.orgId? '&Q=orgId=' + values.orgId[values.orgId.length-1]:'');

    getService(API_PREFIX + `services/web/point/info/getUserInfo/${this.state.currentPage}/${this.state.pageSize}?${queryFilter}`, data => {
      if(data.status === 1){
        this.setState({
          pointData: data.root.list,
          totalNum: data.root.totalNum,
        });
      } else if(data.status === 0){
        message.error(data.errorMsg);
      }
    });
  }

  //页码改变触发
  onPageChange = (current, pageSize) =>{
    this.setState({ loading: true });
    let values = this.valuesDeal(this.state.values);
    let queryFilter = 
          (values.userName?'Q=userName=' + values.userName:'')
        + (values.mobile?'&Q=mobile=' + values.mobile:'')
        + (values.orgId?'&Q=orgId=' + values.orgId[values.orgId.length-1]:'');

    getService(API_PREFIX + `services/web/point/info/getUserInfo/${current}/${pageSize}?${queryFilter}`,data =>{
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          currentPage: current,
          pageSize: pageSize,
          loading:false
        });
      } else if(data.status === 0){
        message.error(data.errorMsg);
        this.setState({loading:false})
      }
    });
  }

  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    this.setState({ loading: true });
    let values = this.valuesDeal(this.state.values);
    let queryFilter = 
         (values.userName?'Q=userName=' + values.userName:'')
        + (values.mobile? '&Q=mobile=' + values.mobile:'')
        + (values.orgId?'&Q=orgId=' + values.orgId[values.orgId.length-1]:'');

    getService(API_PREFIX + `web/point/info/getUserInfo/${current}/${pageSize}?${queryFilter}`, data=>{
      if(data.status === 1){
        this.setState({
          totalNum: data.root.totalNum,
          currentPage: current,
          pageSize: pageSize,
          pointData: data.root.list,
          loading:false
        });
      } else if(data.status === 0){
        message.error(data.errorMsg);
        this.setState({loading:false})
      }
    });
  }

  render() {
    const { departmentOption} = this.state;

    let currentPage = this.state.currentPage;
    let pageSize = this.state.pageSize;

    let powers = this.props.powers;
    console.log('权限码', powers);
    let hasExpPower = powers && powers['20010.24001.500']
    let hasPointPower = powers && powers['20010.24001.501']
    // let updatePowers = powers && powers['20011.21601.002'];
    let exportPowers = powers && powers['20010.24001.202']; 
    // let leadPowers=powers&&powers['20011.21611.201']
    // let exportPowers = true; 
    let leadPowers=powers&&powers['20011.21611.201']
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
        dataIndex: 'fullName',
        key: 'fullName',
      },
      {
        title: '经验值',
        dataIndex: 'exp',
        key: 'exp',
        render: (text, record) => {
          return <a onClick={() => {
            const userid = JSON.stringify(record.id);
            window.sessionStorage.setItem('point-userid', record.id);
            location.hash = `#/PointManagement/PointInfo?id=${record.id}`;
          }}
          >
            {text}
          </a>;
        },
      },
      {
        title: '普通积分',
        dataIndex: 'commonPoint',
        key: 'commonPoint',
        render: (text, record) => {
          return <a onClick={() => {
            const userid = JSON.stringify(record.id);
            window.sessionStorage.setItem('treasure-userid', record.id);
            location.hash = `#/PointManagement/TreasureInfo?id=${record.id}`;
          }}
          >
            {text}
          </a>;
        },
      },
      {
        title: '党员荣誉积分',
        dataIndex: 'partyPoint',
        key: 'partyPoint',
        render: (text, record) => {
          return <a href={`#/PointManagement/PartyMemHonorInfo?id=${record.id}`}
            onClick={() => {
              const userid = JSON.stringify(record.id);
              window.sessionStorage.setItem('partyMemHonor-userid',record.id);
            }}
          >
            {text}
          </a>;
        },
      },
      {
        title: '生日券积分',
        dataIndex: 'birthPoint',
        key: 'birthPoint',
        render: (text, record) => {
          return <a href={`#/PointManagement/BirthdayTicketInfo?id=${record.id}`}
            onClick={() => {
              const userid = JSON.stringify(record.id);
              window.sessionStorage.setItem('birthdayTicket-userid',record.id);
            }}
          >
            {text}
          </a>;
        },
      },
      {
        title: '电影票积分',
        dataIndex: 'moviePoint',
        key: 'moviePoint',
        render: (text, record) => {
          return <a href={`#/PointManagement/CinemaTicketInfo?id=${record.id}`}
            onClick={() => {
              const userid = JSON.stringify(record.id);
              window.sessionStorage.setItem('cinemaTicket-userid',record.id);
            }}
          >
            {text}
          </a>;
        },
      },
      {
        title: '过节物资积分',
        dataIndex: 'holidayPoint',
        key: 'holidayPoint',
        render: (text, record) => {
          return <a href={`#/PointManagement/FestivitiesMaterialInfo?id=${record.id}`}
            onClick={ () => {
              const userid = JSON.stringify(record.id);
              window.sessionStorage.setItem('festivitiesMaterial-userid',record.id);
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
            {
                hasExpPower?<a className="operation" onClick={()=>this.changePoint(record)} style={{ display: 'inline-block' }} >经验值变更 </a>:null
            }
            <Divider type="vertical" />
            {
                hasPointPower?<a className="operation" onClick={()=>this.changeTreasure(record)} style={{ display: 'inline-block' }} > 普通积分变更</a>:null
            }
            
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
      pageSizeOptions: ['10', '20', '30','40'],
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange,
      current:this.state.currentPage,
      showTotal: total => `共 ${total} 条`
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
        <WrappedSearchForm 
          onChangeData={this.onChangeData} 
          refreshData={this.refreshData} 
          pageSize={this.state.pageSize}
          departmentOption={departmentOption}
          getParametersFromChild={this.getParametersFromChild} 
        />
      </div>
      <div className="custom-table-btn">
        {leadPowers?(<Button className="resetBtn" style={{order: 1}} onClick={this.showImportModal}>导入</Button>):null}
        {exportPowers?(<Button className="exportBtn" style={{order: 2}} onClick={this.exportExcel}>导出</Button>):null}
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
        <ImportPart 
          importUrl="services/awardpoint/import/treasure" 
          downlodUrl={API_PREFIX + 'services/awardpoint/pointTreasure/template/export/pointTreasure'}
          listurl={'services/web/point/info/getUserInfo'}
          pageData={this.props.pageData}
          getData={this.getData}
          fileName="普通积分导入模板" 
        />
      </Modal>
      <Modal
        title="经验值操作"
        visible={this.state.pointFlag}
        key={this.state.pointCount}
        onCancel={this.outPoint}
        footer={null} //底部内容，当不需要默认底部按钮时--null
        destroyOnClose={true}
      >
        <AlterPoint 
          dataInfo={this.state.dataInfo} 
          flag="point" 
          refreshData={this.refreshData} 
          outPoint={this.outPoint}
        />
      </Modal>
      <Modal
        title="积分值操作"
        visible={this.state.treasureFlag}
        key={this.state.treasureCount}
        onCancel={this.outTreasure}
        footer={null} //底部内容，当不需要默认底部按钮时--null
        destroyOnClose={true}
      >
        <AlterPoint 
          dataInfo={this.state.dataInfo} 
          flag="treasure" 
          refreshData={this.refreshData} 
          outTreasure={this.outTreasure}
        />
      </Modal>
    </div></Spin> ;
  }
}

class SearchForm extends Component{
  constructor(props){
    super(props);
    this.state={
        expList:[]
    }
  }

  componentDidMount(){
    getService(API_PREFIX + 'services/web/company/org/orgList/get?Q=isAll=false&Q=haveUsers=false',data=>{
      if(data.status === 1){
        let dep = data.root.object;
        if(dep){
          this.getDepartmentData(dep);
          this.setState({departmentOption: dep,loading:false})
        }

      } else{
        message.error(data.errorMsg);
        this.setState({loading:false})
      }
    });
    getService(API_PREFIX + 'services/web/point/level/getList/1/100',data=>{
      if(data.status === 1){
          let expList = [{key:0,value:'全部'}];
          let allData = data.root.list;
          allData.map(item=>{
            expList.push({key:item.level,value:`${item.pointMin}-${item.pointMax}`})
          })
          this.setState({expList})

      } else{
        message.error(data.errorMsg);
      }
    });
  }

  getDepartmentData(dpData){
    dpData.map((item,index)=>{
      item.value=item.id;
      item.label=item.name;
      item.children=item.subCompanyOrgList;
      if(item.subCompanyOrgList){
        this.getDepartmentData(item.subCompanyOrgList)
      }
    });
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
      if(typeof(values.userName) === 'undefined'){
        values.userName = '';
      }
      if(typeof(values.mobile) === 'undefined'){
        values.mobile = '';
      }
      if(typeof(values.orgId) === 'undefined'){
        values.orgId = '';
      }

      const List = [
        {key:1},
        {key:2, min:'1',max:'20'},
        {key:3, min:'21',max:'40'},
        {key:4, min:'41',max:'60'},
        {key:5, min:'61',max:'80'},
        {key:6, min:'81',max:'100'},
        {key:7, min:'101',max:'200'},
        {key:8, min:'201',max:'300'},
        {key:9, min:'301',max:'400'},
        {key:10, min:'401',max:'500'},
      ]
      let queryFilter = ''
      if(values.level>0){
        queryFilter += `&Q=level=${values.level}`
      }
      if(values.commonPoint===1){
        queryFilter += `&Q=commonPoint=0`
      }
      if(values.commonPoint>1&&values.commonPoint<11){
        queryFilter += `&Q=commonPointmin=${List[values.commonPoint-1].min}&Q=commonPointmax=${List[values.commonPoint-1].max}`
      }
      if(values.commonPoint===11){
        queryFilter += `&Q=commonPoint=501`
      }
      if(values.partyPoint===1){
        queryFilter += `&Q=partyPoint=0`
      }
      if(values.partyPoint>1&&values.partyPoint<11){
        queryFilter += `&Q=partyPoint=${List[values.partyPoint-1].min}&Q=commonPointmax=${List[values.partyPoint-1].max}`
      }
      if(values.partyPoint===11){
        queryFilter += `&Q=partyPoint=501`
      }
      if(values.userName){
        queryFilter += '&Q=userName=' + values.userName 
      }
      if(values.mobile){
        queryFilter += '&Q=mobile=' + values.mobile
      }
      if(values.orgId){
        queryFilter += '&Q=orgId=' + values.orgId[values.orgId.length-1];
      }
      queryFilter=queryFilter.substring(1,100)
      getService(API_PREFIX + `services/web/point/info/getUserInfo/1/${this.props.pageSize}?${queryFilter}`,data => {
        if(data.status === 1){
          this.props.onChangeData(data,1);
          this.props.getParametersFromChild(values);
        } else if(data.status === 0){
          message.error(data.errorMsg);
        }
      });
    });
  }

  handleChange(value) {
  }

  render(){
    const {getFieldDecorator} = this.props.form;
    let { departmentOption,expList } = this.state;

    const formItemLayout = {labelCol: {span: 7},wrapperCol: {span: 17}};
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
    const List = [
      {key:0, value:'全部'},
      {key:1, value:'0分'},
      {key:2, value:'1-20'},
      {key:3, value:'21-40'},
      {key:4, value:'41-60'},
      {key:5, value:'61-80'},
      {key:6, value:'81-100'},
      {key:7, value:'101-200'},
      {key:8, value:'201-300'},
      {key:9, value:'301-400'},
      {key:10, value:'401-500'},
      {key:11, value:'500以上'},
    ]
    return (
      
        <Form onSubmit={this.handleSubmit} >
          <Row style={{marginTop: "17px"}}>
            <Col span={8} pull={1}>
              <FormItem {...formItemLayout} label="姓名" maxLength="60">
                {
                  getFieldDecorator('userName', config)
                  (<Input className="input1" style={{ width: '100%' }} placeholder="请输入关键字"/>)
                }
              </FormItem>
            </Col>
            <Col span={8} pull={1}>
              <FormItem {...formItemLayout} label="手机号" maxLength="11">
                {
                  getFieldDecorator('mobile', config)
                  (<Input className="input1" style={{ width: '100%' }} placeholder="请输入关键字"/>)
                }
              </FormItem>
            </Col>
            <Col span={8} pull={1}>
              <FormItem {...formItemLayout} label="部门">
                {
                  getFieldDecorator('orgId', { initialValue: '' })
                  (
                    <Cascader
                        style={{ width: '100%' }}
                        className="select"
                        options={departmentOption}
                        placeholder="全部"
                        changeOnSelect
                        onChange={(value) => this.handleChange(value)}
                    />
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} pull={1}>
              <FormItem {...formItemLayout} label="经验值" maxLength="60">
                {getFieldDecorator('level', { initialValue: 0 })(
                  <Select style={{width: '100%'}}>
                    {
                        expList.map(item=>{return <Option key={item.key} value={item.key}>{item.value}</Option>})
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8} pull={1}>
              <FormItem {...formItemLayout} label="普通积分" maxLength="11">
                {getFieldDecorator('commonPoint', { initialValue: 0 })(
                  <Select style={{width: '100%'}}>
                      {
                          List.map(item=>{return <Option key={item.key} value={item.key}>{item.value}</Option>})
                      }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8} pull={1}>
              <FormItem {...formItemLayout} label="党员荣誉积分">
                {getFieldDecorator('partyPoint', { initialValue: 0 })(
                  <Select style={{width: '100%'}}>
                    {
                        List.map(item=>{return <Option key={item.key} value={item.key}>{item.value}</Option>})
                    }
                </Select>
                )}
              </FormItem>
            </Col>
            <Col span="24" className="colBtn" style={{marginLeft:'33px'}}>
              <Button type="primary" htmlType="submit" className="queryBtn" >查询</Button>
              <Button type="primary" className="resetBtn" onClick={() => this.props.form.resetFields()}>重置</Button>
            </Col>
          </Row>
        </Form>
      
    );
  }
}
const WrappedSearchForm = Form.create()(SearchForm);


