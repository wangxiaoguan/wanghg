import React, { Component } from 'react';
import { Form, Button, Input, Table, Spin, Cascader,message } from 'antd';
import { getService, exportExcelService1 } from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import './FirstLevelOrganizationDetails.less'
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
class FirstLevelOrganizationDetails extends Component {
  constructor(props) {
    super(props);
    let listId = props.location.search.split("&")[0].substr(4)
    // console.log()
    let startValue = JSON.parse(sessionStorage.getItem('time')).sTime
    let endValue = JSON.parse(sessionStorage.getItem('time')).eTime
    this.state = {
      PageSize: 10, //每页十条数据
      current: 1, //当前页
      total: 0,//查询的总数量
      loading: false,
      spinning: false,
      data: [],
      id: listId,
      query: '',
      startTime: startValue,
      endTime: endValue,
      partyValue: null,
      organizations: [],
      reportExcel:false
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
        width: 264
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
          return <a className='operation' onClick={() => this.GotoSecondOrganizationDetails(record)} >详情</a>;
        },
      },
    ];
  }

  //接口请求的函数封装
  commonServer = (id, current, pageSize, query) => {
    this.setState({ spinning: true })
    // let queryAll = query ? `${query}` : ''
    let queryAll = `Q=startTime=${this.state.startTime}&Q=endTime=${this.state.endTime}&Q=id=${id}${query ? query : ''}`
    getService(`${API_PREFIX}services/web/party/fee/idAndNameList/${current}/${pageSize}?${queryAll}`, data => {
      if (data.status === 1) {
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

    this.commonServer(this.state.id, this.state.current, this.state.PageSize)
  }

  //props改变时触发
  componentWillReceiveProps(nextProps) {
    let listId = nextProps.location.search.substr(4);
    if (listId !== this.state.id) {
      this.setState({
        data: [],
        id: listId,
        current: 1,
        PageSize: 10
      })
      // this.commonServer(listId, this.state.current, this.state.PageSize)
      this.commonServer(listId, 1, 10)
    }

  }


  //二级组织详情(继续跳回原页面)
  GotoSecondOrganizationDetails = (record) => {
    if (record.servlet === 0) {
      location.hash = `/PartyBuildReport/PartyAffairsInform/FirstLevelOrganizationDetails?id=${record.feeId}`
      // this.commonServer(record.feeid, this.state.current, this.state.PageSize)
    } else {//直接跳转到最后的一个详情页
      location.hash = `/PartyBuildReport/PartyAffairsInform/PartyBranchesDetails?id=${record.feeId}`
    }
  }

  //form表单提交
  submitSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        // let username = fieldsValue.title ? `&name=${fieldsValue.title[fieldsValue.title.length - 1]}` : '';
        let username = fieldsValue.title ? `&Q=name=${fieldsValue.title}` : '';
        if (username == `&Q=name=` + undefined) {
          username = ''
        }
        this.commonServer(this.state.id, 1, 10, username)
        // let queryOne = `${username}`
        this.setState({
          current: 1,
          PageSize: 10,
          query: username
        })
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
    this.setState({reportExcel: true})//点击后置灰
    let queryname = this.state.query ? `${this.state.query}` : ''
    let path = `${API_PREFIX}services/web/party/fee/partyFeeExcel?Q=startTime=${this.state.startTime}&Q=endTime=${this.state.endTime}&Q=id=${this.state.id}${queryname}`
    exportExcelService1(path, '党费缴纳党组织表统计').then(data=>{
      this.setState({reportExcel:data})
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    let userJsonStr = sessionStorage.getItem('time');
    let userEntity = JSON.parse(userJsonStr);
    let userEntitySTime = userEntity.sTime.substring(0, 4) + "年" + userEntity.sTime.substring(5, 7) + "月"
    let userEntityETime = userEntity.eTime.substring(0, 4) + "年" + userEntity.eTime.substring(5, 7) + "月"
    let powers = this.props.powers;
    let exportExcelPower = powers && powers['20011.25005.202']
    return (

      <div className="FirstLevelOrganizationDetails">
       <Spin size='large' spinning={this.state.spinning}>
        <p className="header">{userEntitySTime} - {userEntityETime}</p>
          <Form layout="inline" className="form" onSubmit={this.submitSearch} >
            <FormItem label="党组织名称">
              <div className="partyOrganizationInput">
                {
                  getFieldDecorator('title')(
                    // <Input placeholder="请输入" className="titleInput" />
                    <Cascader options={this.state.organizations} placeholder='请输入' changeOnSelect onChange={this.onChangeParty} />
                  )
                }
              </div>
            </FormItem>
            <FormItem className="allBtn">
              <Button className="queryBtn" type="primary" htmlType="submit">查询</Button>
              <Button className="resetBtn" onClick={() => {
                this.props.form.resetFields();
              }}>重置</Button>
            </FormItem>
          </Form>
        <div className="ExportExcelDivDetail">
          {exportExcelPower ? (<Button className="resetBtn ExportExcel " onClick={this.ExportExcel} disabled={this.state.reportExcel}>导出Excel</Button>) : ''}
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
          <Button className="resetBtn" onClick={() => { history.back() }}>返回</Button>
        </div>
        </Spin>
      </div>

    )
  }
}

export default FirstLevelOrganizationDetails;