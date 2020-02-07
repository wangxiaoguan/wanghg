import React, { Component } from 'react';
import { Form, Button, Input, Table, Spin } from 'antd';
import { getService, exportExcelFileService } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import './SecondOrganizationDetails.less'
import {connect} from 'react-redux';
const FormItem = Form.Item;

// Excel表导出权限码配置
@connect(
  state => ({
    powers: state.powers
  })
)

@Form.create()
class SecondOrganizationDetails extends Component {
  constructor(props) {
    super(props);
    let listId = props.location.search.split("&")[0].substr(4)
    let startValue=JSON.parse( sessionStorage.getItem('time')).sTime//** */
    let endValue=JSON.parse( sessionStorage.getItem('time')).eTime//** */
    this.state = {
      PageSize: 5, //每页五条数据
      current: 1, //当前页
      total: 0,//查询的总数量
      loading: false,
      data: [],
      id: listId,
      query: '',
      startTime:startValue,//**** */
      endTime:endValue,//***** */
    };
    this.columns = [
      {
        title: "序号",
        dataIndex: 'xuhao',
        width:71
      },
      {
        title: "党组织名称",
        dataIndex: 'name',
        width:353
      },
      {
        title: "党员人数",
        dataIndex: 'feenum',
        width:264
      },
      {
        title: "已缴人数/已缴占比",
        dataIndex: '',
        width:275,
        render: (text, record) => {
          return `${record.feeyesnum}/${record.feeyes}`
        }
      },
      {
        title: "未缴人数/未缴占比",
        dataIndex: '',
        width:333,
        render: (text, record) => {
          return `${record.feenonum}/${record.feeno}`
        }
      },
      {
        title: "操作",
        width:193,
        render: (text, record) => {
          return <a className='operation' onClick={() => this.GotoPartyBranchesDetails(record)} >详情</a>;
        },
      },
    ];
  }

  //接口请求的函数封装
  commonServer = (id, current, pageSize, query) => {
    let queryAll = query ? `${query}` : ''
    getService(`${API_PREFIX}services/partybuildingreport/partyfee/IdAndNameList?startTime=${this.state.startTime}&endTime=${this.state.endTime}&id=${id}&page=${current}&pageSize=${pageSize}${queryAll}`, data => {
      if (data.retCode === 1) {
        this.setState({
          data: data.root.list,
          total: data.root.totalNum
        })
      }
    })
  }

  //点击进入详情页初始化渲染
  componentWillMount() {
    this.commonServer(this.state.id, this.state.current, this.state.PageSize)
  }

  goback = () => {
    history.go(-1)
  }
  //党支部详情
  // GotoPartyBranchesDetails = (record) => {
  //   if (record.servlet === 0) {
  //     location.hash = `/PartyBuildReport/PartyAffairsInform/PartyBranchesDetails?id=${record.feeid}`
  //   } else {//直接跳转到最后的一个详情页
  //     location.hash = `/PartyBuildReport/PartyAffairsInform/PartyBranchesDetails?id=${record.feeid}`
  //   }

  // }

  //form表单提交
  submitSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        let username = fieldsValue.title ? `&name=${fieldsValue.title}` : '';
        let queryOne = `${username}`
        this.setState({
          current: 1,
          PageSize: 5,
          query: queryOne
        })
        // this.commonServer(this.state.id,this.state.current,this.state.PageSize,queryOne)
        this.commonServer(this.state.id, 1, 5, queryOne)
      }
    })
  }

  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    let query = this.state.query ? `${this.state.query}` : ''
    this.commonServer(this.state.id, current, pageSize, query)
    this.setState({
      current,
      PageSize: pageSize
    })
  }

  //跳转对应的第几页触发的事件
  changePage = (page, pageSize) => {
    this.setState({
      current: page,
      PageSize: pageSize
    })
    this.commonServer(this.state.id, page, pageSize, this.state.query)
  }

  //Excel表单导出
  ExportExcel = () => {
    let queryname = this.state.query ? `${this.state.query}` : ''
    // let path= `${API_PREFIX}services/partybuildingreport/partyfee/PartyFeeExcel?id=${this.state.id}&page=${this.state.current}&pageSize=${this.state.PageSize}${queryname}`
    let path = `${API_PREFIX}services/partybuildingreport/partyfee/PartyFeeExcel?startTime=${this.state.startTime}&endTime=${this.state.endTime}&id=${this.state.id}${queryname}`
    exportExcelFileService(path, '党费缴纳党组织表统计')
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    var userJsonStr = sessionStorage.getItem('time');
    var userEntity = JSON.parse(userJsonStr);
    let powers = this.props.powers;
    let exportExcelPower=powers && powers['20011.25005.202']
    return (
      <Spin spinning={this.state.loading}>
        <div className="SecondOrganizationDetails">
          <p className="header">{userEntity.sTime.substring(0,7)} - {userEntity.eTime.substring(0,7)}</p>
          <Form layout="inline" className="form" onSubmit={this.submitSearch} >
            <FormItem label="党组织名称">
              <div className="partyOrganizationInput">
                {
                  getFieldDecorator('title')(<Input placeholder="请输入" className="titleInput" />)
                }
              </div>
            </FormItem>
            <FormItem className="allBtn">
              {/* <Button className="queryBtn" onClick={this.submitSearch}>查询</Button> */}
              <Button className="queryBtn" type="primary" htmlType="submit">查询</Button>
              <Button className="resetBtn" onClick={() => {
                this.props.form.resetFields();
              }}>重置</Button>
            </FormItem>
          </Form>
          <div className="ExportExcelDivDetail">
          {exportExcelPower?(<Button className="resetBtn ExportExcel " onClick={this.ExportExcel}>导出Excel</Button>):''}
          </div>
          <Table
            className="table"
            rowKey={record => record.feeid}
            bordered
            pagination={{
              pageSize: this.state.PageSize,
              current: this.state.current,
              total: this.state.total,
              showSizeChanger: true,
              showQuickJumper: true,
              onShowSizeChange: this.onPageSizeChange,
              pageSizeOptions: ['10', '20', '30', '40'],
              onChange: this.changePage,
              showTotal: total => `共 ${total} 条`
            }}
            columns={this.columns}
            dataSource={this.state.data}
          />
          <div className="goback">
            <Button className="queryBtn" onClick={this.goback}>返回</Button>
          </div>
        </div>
      </Spin>
    )
  }

}

export default SecondOrganizationDetails;