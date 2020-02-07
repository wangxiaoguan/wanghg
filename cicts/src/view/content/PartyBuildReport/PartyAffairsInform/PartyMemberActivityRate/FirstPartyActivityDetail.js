import React, { Component } from 'react';
import { Form, Button, Input, Table, Row, Col, Cascader, Spin,message } from 'antd';
import { getService, exportExcelService1 } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import './FirstPartyActivityDetail.less'
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
class FirstPartyActivityDetail extends Component {
  constructor(props) {
    super(props);
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
      partyValue: null,
      organizations: [],
      reportExcel: false,//导出按钮可点击
    }
    this.columns = [
      {
        title: "序号",
        dataIndex: 'key',
        key: 'key',
        width: 71
      },
      {
        title: "党组织名称",
        dataIndex: 'name',
        key: 'name',
        width: 231
      },
      {
        title: "党员人数",
        dataIndex: 'total',
        key: 'total',
        width: 143
      },
      {
        title: "党建任务活跃人数",
        dataIndex: 'task',
        key: 'task',
        width: 181
      },
      {
        title: "资讯活动活跃人数",
        dataIndex: 'activity',
        key: 'activity',
        width: 169
      },
      {
        title: "掌上党校活跃人数",
        dataIndex: 'school',
        key: 'school',
        width: 168
      }, {
        title: "党建考试活跃人数",
        dataIndex: 'exam',
        key: 'exam',
        width: 183
      }, {
        title: "党员活跃率",
        dataIndex: 'activecr',
        key: 'activecr',
        width: 157
      },
      {
        title: "操作",
        width: 186,
        // key:'feeno',
        render: (text, record) => {
          return <a className='operation' onClick={() => this.GotoSecondPartyActivityDetail(record)} >详情</a>;
        },
      },
    ];
  }

  //接口请求的函数封装
  commonServer = (current, pageSize, id, query) => {
    this.setState({ spinning: true })
    // let queryAll = query ? `${query}` : ''
    let queryAll = `Q=parentId=${id}&Q=startTime=${this.state.startTime}&Q=endTime=${this.state.endTime}${query ? query : ''}`
    getService(`${API_PREFIX}services/web/party/activeRate/activeList/${current}/${pageSize}?${queryAll}`, data => {
      if (data.status === 1) {
        data.root.list && data.root.list.forEach((item, i) => {
          item['key'] = i + 1
        })
        this.setState({
          data: data.root.list || [],
          total: data.root.totalNum,
          spinning: false
        })
      } else {
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

  //点击进入详情页初始化渲染
  componentWillMount() {
    //级联请求获取数据
    getService(`${API_PREFIX}services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1`, data => {
      if (data.status == 1) {
        let orgs = data.root.object;
        if (orgs) {
          //直接调用处理数据的方法===》处理数据
          this.getDepartmentData(orgs);
          this.setState({
            organizations: orgs,
            loading: false,
          });
        }
      } else {
        message.error(data.errorMsg);
        this.setState({ loading: false });
      }
    })

    let query = `&Q=type=parentId`
    this.setState({
      query,
    })
    this.commonServer(this.state.current, this.state.PageSize, this.state.id, query)
  }

  //props改变时触发
  componentWillReceiveProps(nextProps) {
    let listId = nextProps.location.search.substr(4);
    let query = `&Q=type=parentId`
    if (listId !== this.state.id) {
      this.setState({
        data: [],
        id: listId,
        current: 1,
        PageSize: 10
      })
      this.commonServer(1, 10, listId, query)
    }
  }

  //二级组织详情
  GotoSecondPartyActivityDetail = (record) => {
    getService(`${API_PREFIX}services/web/party/palmPartyClass/checkMinOrg/${record.partyId}?`, data => {
      if (data.root.object.count === 0) {//count等于0时依次跳下一级
        location.hash = `/PartyBuildReport/PartyAffairsInform/FirstPartyActivityDetail?id=${record.partyId}`
        // this.commonServer(this.state.current, this.state.PageSize, record.partyid)
      } else {//count等于1时往最后一个页面跳转
        location.hash = `/PartyBuildReport/PartyAffairsInform/PartyActivityBranchesDetails?id=${record.partyId}`
      }
    })
  }

  //form表单提交
  submitSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        let username = fieldsValue.title ? `&Q=nameId=${fieldsValue.title[fieldsValue.title.length - 1]}` : '';
        //对级联里面的清除图标做处理
        if (username == `&Q=nameId=` + undefined) {
          username = ''
        }
        let queryOne = `&Q=type=parentId${username}`
        this.setState({
          current: 1,
          PageSize: 10,
          query: queryOne
        })
        this.commonServer(1, 10, this.state.id, queryOne)
      }
    })
  }

  //级联
  onChangeParty = (value) => {
    this.setState({ partyValue: value });
  }

  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    let query = this.state.query ? `${this.state.query}` : ''
    this.commonServer(1, pageSize, this.state.id, query)
    this.setState({
      current: 1,
      PageSize: pageSize
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

  //Excel表单导出
  ExportExcel = () => {
    this.setState({reportExcel: true})//点击后置灰
    let queryname = this.state.query ? `${this.state.query}` : ''
    let path = `${API_PREFIX}services/web/party/activeRate/exportActive?Q=parentId=${this.state.id}&Q=startTime=${this.state.startTime}&Q=endTime=${this.state.endTime}${queryname}`
    exportExcelService1(path, '党员活跃率党组织表统计').then(data=>{
      this.setState({reportExcel:data})
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
    let userJsonStr = sessionStorage.getItem('time');
    let userEntity = JSON.parse(userJsonStr);
    // let userEntityStartTime = userEntity.startTime.substring(0, 4) + "年" + userEntity.startTime.substring(5, 7) + "月" + userEntity.startTime.substring(8, 10) + "日"
    // let userEntityEndTime = userEntity.endTime.substring(0, 4) + "年" + userEntity.endTime.substring(5, 7) + "月" + userEntity.endTime.substring(8, 10) + "日"
    let userEntityStartTime = userEntity.startTime.substring(0, 4) + "年" + userEntity.startTime.substring(5, 7) + "月"
    let userEntityEndTime = userEntity.endTime.substring(0, 4) + "年" + userEntity.endTime.substring(5, 7) + "月"
    let powers = this.props.powers;
    let exportExcelPower = powers && powers['20011.25006.202']
    return (
      <div className="FirstPartyActivityDetail">
        <Spin size='large' spinning={this.state.spinning}>
          <p className="header">{userEntityStartTime} - {userEntityEndTime}</p>
          <Form layout="inline" className="form" onSubmit={this.submitSearch}>
            <FormItem label="党组织名称" className="name"  {...formItemLayout}>
              {
                getFieldDecorator('title')(
                  // <Input placeholder="请输入" />
                  <Cascader style={{ width: 200}} options={this.state.organizations} placeholder='请输入' changeOnSelect onChange={this.onChangeParty} />
                )
              }
            </FormItem>
            <FormItem>
              <Button className="queryBtn" type="primary" htmlType="submit">查询</Button>
              <Button className="resetBtn" onClick={() => {
                this.props.form.resetFields();
              }}>重置</Button>
            </FormItem>
          </Form>
          <div className="ExportExcelDiv">
            {exportExcelPower ? (<Button className="resetBtn ExportExcel " onClick={this.ExportExcel} disabled={this.state.reportExcel}>导出Excel</Button>) : ''}
            {/* <Button className="resetBtn ExportExcel " onClick={this.ExportExcel} disabled={(exportExcelPower ? false:true)||this.state.reportExcel}>导出Excel</Button> */}
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
            <Button className="resetBtn" onClick={() => { history.back() }}>返回</Button>
          </div>
        </Spin>
      </div>
    )
  }
}

export default FirstPartyActivityDetail;