import React, { Component } from 'react';
import { Form, Button, Input, DatePicker, Table, Row, Col, Cascader, Spin,message } from 'antd';
import { getService, exportExcelService1 } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import './PartyFeePay.less';
import moment from 'moment';
import { connect } from 'react-redux';
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
const monthFormat = 'YYYY-MM';

// Excel表导出权限码配置以及刚进入时的用户partyId判断
@connect(
  state => ({
    partyId: state.head.headPartyIdData,
    powers: state.powers
  })
)

@Form.create()
class PartyFeePay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PageSize: 10, //每页十条数据
      current: 1, //当前页
      total: 0,//查询的总数量
      loading: false,
      spinning: false,
      data: [],//table表格数据
      name: '',//输入框的值
      sTime: '',//开始时间
      eTime: '',//结束时间
      partyId: null,
      query: '',
      partyValue: null,
      organizations: [],
      reportExcel: false,//导出按钮可点击
    };
    this.columns = [
      {
        title: "序号",
        dataIndex: 'xuhao',
        width: 71,
        render: (text, record, index) => {
            return  <div>
                <span>{(this.state.current-1)*(this.state.PageSize) + index + 1}</span>
            </div>
        }
      },
      {
        title: "党组织名称",
        dataIndex: 'name',
        width: 353
      },
      {
        title: "党员人数",
        dataIndex: 'feeNum',
        width: 263
      },
      {
        title: "已缴人数/已缴占比",
        dataIndex: '',
        width: 275,
        render: (text, record) => {
          return `${record.feeYesNum}/${record.feeYes}`
        }
      },
      {
        title: "未缴人数/未缴占比",
        dataIndex: '',
        width: 333,
        render: (text, record) => {
          return `${record.feeNoNum}/${record.feeNo}`
        }
      },
      {
        title: "操作",
        width: 193,
        render: (text, record) => {
          return <a className='operation' onClick={() => this.GotoFirstLevelOrganizationDetails(record)} >详情</a>;
        },
      },
    ];

  }

  //接口请求的函数封装
  commonServer = (partyId, current, pageSize, query) => {
    this.setState({ spinning: true })
    getService(`${API_PREFIX}services/web/party/fee/idAndNameList/${current}/${pageSize}?Q=id=${partyId}${query}`, data => {
      if (data.status === 1) {
        this.setState({
          data: data.root.list || [],
          total: data.root.totalNum,
          spinning: false
        })
      } else if (data.status === 0) {
        this.setState({ spinning: false })
        message.error(data.errorMsg);
      }
    })
  }

  //级联递归取出接口返回的部门的数据
  getDepartmentData(dpData) {
    dpData.map((item, index) => {
      item.value = item.id;
      item.label = item.partyName;
      item.children = item.partyOrgList;
      if (item.partyOrgList) {//不为空，递归
        this.getDepartmentData(item.partyOrgList)
      }
    });
  }

  //初始化进入页面
  componentWillMount() {
    this.setState({ spinning: true })
    getService(`${API_PREFIX}services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1`, data => {
      if (data.status == 1) {
        let orgs = data.root.object;
        if (orgs) {
          //直接调用处理数据的方法===》处理数据
          this.getDepartmentData(orgs);
          this.setState({
            organizations: orgs,
            spinning: false,
          });
        }
      } else {
        message.error(data.errorMsg);
        this.setState({ spinning: false });
      }
    })

    let start = moment().subtract(30, 'days').format('YYYY-MM-DD');//默认开始值
    let startYear = start.substring(0, 4)
    let startMonth = start.substring(5, 7)
    let startValue = moment(new Date(startYear, startMonth - 1, 1)).format('YYYY-MM-DD')+"%2000:00:00";

    let end = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
    let endYear = end.substring(0, 4)
    let endMonth = end.substring(5, 7)
    let endValue = moment(new Date(endYear, endMonth, 0)).format('YYYY-MM-DD')+"%2023:59:59"

    let query = `&Q=startTime=${startValue}&Q=endTime=${endValue}`
    if (!this.props.partyId) {
      return false
    }
    this.setState({
      sTime: startValue,
      eTime: endValue,
      query,
      partyId: this.props.partyId
    })
    if (this.props.partyId) {
      //判断如果为1就跳到详情页面，如果不是就在原页面
      // getService(`${API_PREFIX}services/partybuildingreport/partyfee/torf?id=${this.props.partyId}`, data => {
      //   if (data === 1) {
      //     location.hash = `/PartyBuildReport/PartyAffairsInform/PartyBranchesDetails?id=${this.props.partyId}`
      //   }
      // })
      getService(`${API_PREFIX}services/web/party/fee/initialize?Q=id=${this.props.partyId}${query}`, data => {
        if (data.status === 1) {
          data.root.object.forEach((item, i) => {
            item['xuhao'] = i + 1
          })
          this.setState({
            data: data.root.object,
            total: 1,
            spinning: false
          })
        } else {
          message.error(data.errorMsg);
        }
      })
    }
  }


  // 当props改变时而触发的生命周期函数
  componentWillReceiveProps(nextProps) {
    if (!this.props.partyId) {
      return false
    }

    let start = moment().subtract(30, 'days').format('YYYY-MM-DD');//默认开始值
    let startYear = start.substring(0, 4)
    let startMonth = start.substring(5, 7)
    let startValue = moment(new Date(startYear, startMonth - 1, 1)).format('YYYY-MM-DD')+"%2000:00:00"

    let end = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
    let endYear = end.substring(0, 4)
    let endMonth = end.substring(5, 7)
    let endValue = moment(new Date(endYear, endMonth, 0)).format('YYYY-MM-DD')+"%2023:59:59"
    //当前的partyId与切换职务改变后的partyId不同时执行
    if (this.state.partyId != nextProps.partyId) {
      //将输入框以及时间框恢复到默认值
      this.props.form.resetFields()
      let query = `&Q=startTime=${startValue}&Q=endTime=${endValue}`
      //并将对应的时间sTime、eTime进行存储
      this.setState({
        current: 1,
        partyId: nextProps.partyId,
        sTime: moment(new Date(startYear, startMonth - 1, 1)).format('YYYY-MM-DD'),
        eTime: moment(new Date(endYear, endMonth, 0)).format('YYYY-MM-DD'),
        query
      })

      //判断如果为1就跳到详情页面，如果不是(有权限)就在原页面
      // getService(`${API_PREFIX}services/partybuildingreport/partyfee/torf?id=${nextProps.partyId}`, data => {
      //   if (data === 1) {
      //     location.hash = `/PartyBuildReport/PartyAffairsInform/PartyBranchesDetails?id=${nextProps.partyId}`
      //   }else{
      //     this.commonServer(nextProps.partyId, 1, 10, query)
      //   }
      // })

      //当partyId改变时触发，显示对应的党组织名称
      getService(`${API_PREFIX}services/web/party/fee/initialize?Q=id=${nextProps.partyId}${query}`, data => {
        if (data.status === 1) {
          data.root.object.forEach((item, i) => {
            item['xuhao'] = i + 1
          })
          this.setState({
            data: data.root.object,
            total: 1,
          })
        } else {
          message.error(data.errorMsg);
        }
      })
    }
  }

  //一级组织详情
  GotoFirstLevelOrganizationDetails = (record) => {
    if (record.servlet === 0) {//为0时依次跳往下一级
      location.hash = `/PartyBuildReport/PartyAffairsInform/FirstLevelOrganizationDetails?id=${record.feeId}`
    } else {//否则跳转到最后的一个详情页
      location.hash = `/PartyBuildReport/PartyAffairsInform/PartyBranchesDetails?id=${record.feeId}`
    }
  }

  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    let query = `${this.state.name}&Q=startTime=${this.state.sTime}&Q=endTime=${this.state.eTime}`
    this.setState({
      current: 1,
      PageSize: pageSize
    })
    if (this.state.name == '') {
      let queryThree = `&Q=startTime=${this.state.sTime}&Q=endTime=${this.state.eTime}`
      getService(`${API_PREFIX}services/web/party/fee/initialize?Q=id=${this.props.partyId}${queryThree}`, data => {
        if (data.status === 1) {
          data.root.object.forEach((item, i) => {
            item['xuhao'] = i + 1
          })
          this.setState({
            data: data.root.list,
            total: 1,
          })
        } else if (data.errorMsg === 0) {
          message.error(data.retMsg);
        }
      })
    } else {
      this.commonServer(this.props.partyId, 1, pageSize, query)
    }
  }

  //form表单提交
  submitSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        // let username = fieldsValue.name ? `&name=${fieldsValue.name[fieldsValue.name.length - 1]}` : '';
        let username = fieldsValue.name ? `&Q=name=${fieldsValue.name}` : '';
        if (username == `&Q=name=` + undefined) {
          username = ''
        }
        let startYear = fieldsValue.time1.format('YYYY')//获取年
        let startMonth = fieldsValue.time1.format('MM')//获取月
        let startYearMonthDate = moment(new Date(startYear, startMonth - 1, 1)).format('YYYY-MM-DD')+"%2000:00:00"    //获取开始日期的第一天

        let endYear = fieldsValue.time2.format('YYYY')//获取年
        let endMonth = fieldsValue.time2.format('MM')//获取月
        let endYearMonthDate = moment(new Date(endYear, endMonth, 0)).format('YYYY-MM-DD')+"%2023:59:59"   //获取结束日期的最后一天

        let query = `${username}&Q=startTime=${startYearMonthDate}&Q=endTime=${endYearMonthDate}`
        this.setState({
          name: username,
          sTime: startYearMonthDate,
          eTime: endYearMonthDate,
          current: 1,
          PageSize: 10,
          query
        })
        if (username == '' || (fieldsValue.name && `${fieldsValue.name[fieldsValue.name.length - 1]}`== this.props.partyId)) {
          getService(`${API_PREFIX}services/web/party/fee/initialize?Q=id=${this.props.partyId}${query}`, data => {
            if (data.status === 1) {
              data.root.object.forEach((item, i) => {
                item['xuhao'] = i + 1
              })
              this.setState({
                data: data.root.object,
                total: 1,
              })
            } else if (data.status === 0) {
              message.error(data.errorMsg);
            }
          })
        } else {
              // if(`${fieldsValue.name[fieldsValue.name.length - 1]}`==this.props.partyId){
              //   getService(`${API_PREFIX}services/partybuildingreport/partyfee/initialize?id=${this.props.partyId}${query}`, data => {
              //     if (data.retCode === 1) {
              //       data.root.list.forEach((item, i) => {
              //         item['xuhao'] = i + 1
              //       })
              //       this.setState({
              //         data: data.root.list,
              //         total: data.root.totalNum,
              //       })
              //     } else if (data.retCode === 0) {
              //       message.error(data.retMsg);
              //     }
              //   })
              // }else{
                this.commonServer(this.props.partyId, 1, 10, query)
              // }

        }

      }
    })
  }

  //级联
  onChangeParty = (value) => {
    this.setState({ partyValue: value });
  }

  changePage = (page, pageSize) => {//跳转对应的第几页触发的事件

    this.setState({
      current: page,
      PageSize: pageSize
    })
    if (this.state.name == '') {
      let queryTwo = `&Q=startTime=${this.state.sTime}&Q=endTime=${this.state.eTime}`
      getService(`${API_PREFIX}services/web/party/fee/initialize?Q=id=${this.props.partyId}${queryTwo}`, data => {
        if (data.status === 1) {
          data.root.object.forEach((item, i) => {
            item['xuhao'] = i + 1
          })
          this.setState({
            data: data.root.object,
            total: 1,
          })
        } else if (data.status === 0) {
          message.error(data.errorMsg);
        }
      })
    } else {
      this.commonServer(this.props.partyId, page, pageSize, this.state.query)
    }
  }


  //Excel表单导出
  ExportExcel = () => {
    this.setState({reportExcel: true})//点击后置灰
    let path=''
    //导出当前页数据xwx2018/12/22
    if(this.state.name&&(this.state.name).split("=")[1]==this.props.partyId||this.state.name==''){
      path=`${API_PREFIX}services/web/party/fee/partyFeeInitializeExcel?Q=id=${this.state.partyId}${this.state.query}`//新增导出本页面数据接口xwx2018/12/22
    }else{
       path = `${API_PREFIX}services/web/party/fee/partyFeeExcel?Q=id=${this.state.partyId}${this.state.query}`
    }
       exportExcelService1(path, '党费缴纳党组织表统计').then(data=>{
        console.log(data)
        this.setState({reportExcel:data})
      })
  }


  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
    let powers = this.props.powers;
    let exportExcelPower = powers && powers['20011.25005.202']
    //存储时间
    sessionStorage.setItem('time', JSON.stringify(this.state));
    //默认开始值
    let start = moment().subtract(30, 'days').format('YYYY-MM-DD');//默认开始值
    let startYear = start.substring(0, 4)
    let startMonth = start.substring(5, 7)
    //默认结束值
    let end = moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD')
    let endYear = end.substring(0, 4)
    let endMonth = end.substring(5, 7)
    return (
      <div className="PartyFeePay">
        <Spin size='large' spinning={this.state.spinning}>
          <Form layout="inline" className="form" onSubmit={this.submitSearch}>

            <Row>
              <Col span={10}>
                <FormItem {...formItemLayout} label="党组织名称" className="dangname">
                  {
                    getFieldDecorator('name', { initialValue: '' })(
                      // <Input placeholder="请输入" className="nameInput"/>
                      <Cascader style={{ width: 200}} options={this.state.organizations} placeholder='请输入' changeOnSelect onChange={this.onChangeParty} />
                    )
                  }
                </FormItem>

              </Col>
              <Col span={14}>

                <FormItem {...formItemLayout} label="选择时间" maxLength="56">
                  {getFieldDecorator('time1', { initialValue: moment(moment(new Date(startYear, startMonth - 1, 1)), monthFormat) })(
                    <MonthPicker format={monthFormat} allowClear={false} disabledDate={this.disabledStartDate} />

                  )}
                </FormItem>
                <label className="formItemLabel">至</label>
                <FormItem>
                
                  {getFieldDecorator('time2', { initialValue: moment(moment(new Date(endYear, endMonth, 0)), monthFormat) })(
                    <MonthPicker format={monthFormat} className="month" allowClear={false} disabledDate={this.disabledEndDate} />
                  )}
                </FormItem>

              </Col>
            </Row>

            <Row className="allBtn">
              <Button className="queryBtn" type="primary" htmlType="submit">查询</Button>
              <Button className="resetBtn" onClick={() => {
                this.props.form.resetFields();
              }}>重置</Button>
            </Row>
          </Form>
        {exportExcelPower ? (<div className="ExportExcelDiv">
          <Button className="resetBtn ExportExcel " onClick={this.ExportExcel} disabled={this.state.reportExcel} >导出Excel</Button>
        </div>) : ''}
        {/* <div className="ExportExcelDiv">
          <Button className="resetBtn ExportExcel " onClick={this.ExportExcel} disabled={(exportExcelPower ? false:true)||this.state.reportExcel} >导出Excel</Button>
        </div> */}
        <Table
          className="table"
          rowKey={(record, index) => `${index}`}
          bordered
          pagination={{
            pageSize: this.state.PageSize,
            current: this.state.current,
            total: this.state.total,
            showSizeChanger: true,
            showQuickJumper: true,
            onShowSizeChange: this.onPageSizeChange,
            pageSizeOptions: ['10', "20", "30", "40"],
            onChange: this.changePage,
            showTotal: total => `共 ${total} 条`
          }}
          columns={this.columns}
          dataSource={this.state.data}
        />
         </Spin>
      </div>
    )
  }
}

export default PartyFeePay;