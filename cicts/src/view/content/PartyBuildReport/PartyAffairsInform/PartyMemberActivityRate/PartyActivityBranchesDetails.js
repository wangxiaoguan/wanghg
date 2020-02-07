import React, { Component } from 'react';
import { Form, Button, Input, Table, Row, Col, Spin,message } from 'antd';
import { getService, exportExcelService1 } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import './PartyActivityBranchesDetails.less'
import { Link } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'react-redux';
const FormItem = Form.Item;

// Excel表导出权限码配置
@connect(
  state => ({
    partyId: state.head.headPartyIdData,
    powers: state.powers
  })
)

@Form.create()
class PartyActivityBranchesDetails extends Component {
  constructor(props) {
    super(props);
    let oldPartyId = Number(sessionStorage.getItem('partyid')) || nextProps.partyId;
    //获取地址栏的id
    let listId = props.location.search.split("&")[0].substr(4)
    let startValue = JSON.parse(sessionStorage.getItem('time')).startTime
    let endValue = JSON.parse(sessionStorage.getItem('time')).endTime
    this.state = {
      PageSize: 10, //每页十条数据
      current: 1, //当前页
      total: 0,//查询的总数量
      loading: false,
      spinning: false,
      data: [],//table表格初始值
      id: listId,
      query: '',
      startTime: startValue,
      endTime: endValue,
      partyId: '',
      oldPartyId,
      reportExcel: false,//导出按钮可点击
    }
    this.columns = [
      {
        title: "序号",
        dataIndex: 'key',
        key: 'key',
        width: 71,
        render: (text, record, index) => {
          return <div>
            <span>{(this.state.current - 1) * (this.state.PageSize) * 1 + index * 1 + 1}</span>
          </div>
        },
      },
      {
        title: "姓名",
        dataIndex: 'name',
        key: 'name',
        width: 164
      },
      {
        title: "员工号",
        dataIndex: 'userNo',
        key: 'userNo',
        width: 273
      },
      {
        title: "党建任务",
        dataIndex: 'taskcr',
        key: 'taskcr',
        width: 207
      },
      {
        title: "资讯活动",
        dataIndex: 'activitycr',
        key: 'activitycr',
        width: 193
      },
      {
        title: "掌上党校",
        dataIndex: 'schoolcr',
        key: 'schoolcr',
        width: 192
      }, {
        title: "党建考试",
        dataIndex: 'examcr',
        key: 'examcr',
        width: 232
      }, {
        title: "平均活跃率",
        dataIndex: 'average',
        key: 'average',
        width: 157
      },
    ];
  }

  //接口请求的函数封装
  commonServer = (current, pageSize, id, query) => {
    this.setState({ spinning: true })
    // let queryAll = query ? `${query}` : ''
    let queryAll = `Q=parentId=${id}&Q=startTime=${this.state.startTime}&Q=endTime=${this.state.endTime}${query ? query : ''}`
    getService(`${API_PREFIX}services/web/party/activeRate/activeGroupList/${current}/${pageSize}?${queryAll}`, data => {
      if (data.status === 1) {
        // data.root.list.forEach((item, i) => {
        //     item['key'] = i + 1
        //     console.log(i)
        //   })
        this.setState({
          data: data.root.list,
          total: data.root.totalNum,
          spinning: false
        })
      } else if (data.status === 0) {
        this.setState({ spinning: false })
        message.error(data.errorMsg);
      }
    })
  }

  //点击进入详情页初始化渲染
  componentWillMount() {
    this.commonServer(this.state.current, this.state.PageSize, this.state.id)
  }

  //当props改变时触发
  componentWillReceiveProps(nextProps) {
    let partyId = Number(sessionStorage.getItem('partyid')) || nextProps.partyId;
    if (partyId !=this.state.oldPartyId) {
      window.location.href=`#/PartyBuildReport/PartyAffairsInform/PartyMemberActivityRate`
      this.setState({partyId:nextProps.partyId},()=>{
        this.commonServer(this.state.current, this.state.PageSize, this.state.partyId)
      })
      // getService(`${API_PREFIX}services/partybuildingreport/partyfee/torf?id=${nextProps.partyId}`, data => {
      //   if (data === 0 || nextProps.partyId == -1) {
      //     location.hash = `#/PartyBuildReport/PartyAffairsInform/PartyMemberActivityRate`;
      //     return
      //   } else {
      //     this.commonServer(this.state.current, this.state.PageSize, nextProps.partyId)
      //   }
      // })
    }
  }

  goback = () => {
    history.go(-1)
  }

  submitSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        let dangName = fieldsValue.name ? `&Q=userName=${fieldsValue.name}` : ''
        let danguserNo = fieldsValue.userno ? `&Q=userNo=${fieldsValue.userno}` : ''
        let query = `${dangName}${danguserNo}`
        this.setState({
          current: 1,
          PageSize: 10,
          query
        })
        this.commonServer(1, 10, this.state.id, query)
      }
    })
  }

  //跳转对应的第几页触发的事件
  changePage = (page, pageSize) => {
    this.setState({
      current: page,
      PageSize: pageSize
    })
    this.commonServer(page, pageSize, this.state.id, this.state.query)
  }

  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    let query = this.state.query ? `${this.state.query}` : ''
    this.commonServer(1, pageSize, this.state.id, query)
    this.setState({
      current:1,
      PageSize: pageSize
    })
  }

  //Excel表单导出
  ExportExcel = () => {
    this.setState({reportExcel: true})//点击后置灰
    let queryname = this.state.query ? `${this.state.query}` : ''
    let path = `${API_PREFIX}services/web/party/activeRate/exportActiveGroup?Q=parentId=${this.state.id}&Q=startTime=${this.state.startTime}&Q=endTime=${this.state.endTime}${queryname}`
    exportExcelService1(path, '党员活跃率人员详细统计').then(data=>{
      this.setState({reportExcel:data})
    })
  }



  render() {
    const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
    const { getFieldDecorator } = this.props.form;
    let userJsonStr = sessionStorage.getItem('time');
    let userEntity = JSON.parse(userJsonStr);
    // let userEntityStartTime = userEntity.startTime.substring(0, 4) + "年" + userEntity.startTime.substring(5, 7) + "月" + userEntity.startTime.substring(8, 10) + "日"
    // let userEntityEndTime = userEntity.endTime.substring(0, 4) + "年" + userEntity.endTime.substring(5, 7) + "月" + userEntity.endTime.substring(8, 10) + "日"
    let userEntityStartTime = userEntity.startTime.substring(0, 4) + "年" + userEntity.startTime.substring(5, 7) + "月"
    let userEntityEndTime = userEntity.endTime.substring(0, 4) + "年" + userEntity.endTime.substring(5, 7) + "月"
    let powers = this.props.powers;
    let exportExcelPower = powers && powers['20011.25006.202']
    return (
      <div className="PartyActivityBranchesDetails">
        <Spin size='large' spinning={this.state.spinning}>
          <p className="header">{userEntityStartTime} - {userEntityEndTime}</p>
          <Form layout="inline" className="form" onSubmit={this.submitSearch}>
            <Row className="name">
              <Col span={6}>
                <FormItem label="姓名" {...formItemLayout}>
                  {
                    getFieldDecorator('name', { initialValue: '' })(
                      <Input placeholder="请输入" className="nameInput" />

                    )
                  }
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem label="员工号"  {...formItemLayout}>
                  {
                    getFieldDecorator('userno', { initialValue: '' })(
                      <Input placeholder="请输入" className="nameInput" />
                    )
                  }
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
          <div className="ExportExcelDiv">
            {exportExcelPower ? (<Button className="resetBtn ExportExcel " onClick={this.ExportExcel} disabled={this.state.reportExcel} >导出Excel</Button>) : ''}
            {/* <Button className="resetBtn ExportExcel " onClick={this.ExportExcel} disabled={(exportExcelPower ? false:true)||this.state.reportExcel} >导出Excel</Button> */}
          </div>
          <Table
            className="table"
            rowKey={(record, index) => `complete${record.id}${index}`}
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
          <div className="goback">
            <Button className="resetBtn" onClick={this.goback}>返回</Button>
          </div>
        </Spin>
      </div>
    )
  }
}

export default PartyActivityBranchesDetails;