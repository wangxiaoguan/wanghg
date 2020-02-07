import React,{Component} from 'react';
import {message,Spin,Form,Row, Col, Input, Button, Table, Cascader,} from 'antd';
// import PartyEdit from './PartyEdit';
// import TableAndSearch from '../../../component/table/TableAndSearch';
import { getService,postService } from '../../myFetch.js';
import API_PREFIX from '../../apiprefix';
import './partyMemOut.less'
// import {BEGIN} from '../../../../redux-root/action/table/table';
import {connect} from 'react-redux';
const FormItem = Form.Item
@Form.create()
@connect(
  state => ({
    powers: state.powers,
  }),
)
export default class PartyApply extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      query: '',
      data: [],
      partyData: [],
      partyId: -1,
      spinning: false,
    }
  }
  partyDataTree = (partyList, arr) => {
    partyList.forEach(item => {
      if(item.partyOrgList && item.partyOrgList.length>0) {
        arr.push({
          label: item.partyName,
          value: item.id,
          key: item.id,
          children: []
        })
        this.partyDataTree(item.partyOrgList, arr[arr.length - 1].children)
      }else {
        arr.push({
          label: item.partyName,
          value: item.id,
          key: item.id
        })
      }
      
    })
    return arr
  }
  requestData = (page, pageSize, query) => {
    this.setState({
      spinning: true
    })
    let path = `${API_PREFIX}services/web/party/partyUser/getFullList/-1/${page}/${pageSize}?Q=state=11,12${query?`&${query}`:''}`
    getService(path, data => {
      console.log(data)
      if(data.status == '1') {
        data.root.list && data.root.list.forEach((item, i) => {
          item['key'] = i + 1
        })
        this.setState({
          data: data.root.list,
          total: data.root.totalNum,
          spinning: false
        })
      }else {
        this.setState({
          spinning:false
        })
        message.error('获取数据失败')
      }
    })
  }
  componentWillMount() {
    getService(`${API_PREFIX}services/web/party/partyOrganization/getAuthOrg/-1?Q=partyOrgStatus=1`, data => {
      console.log('ttttttttttttttttttt', data)
      let arr = []
      if(data.status == 1) {
        this.partyDataTree(data.root.object, arr)
        this.setState({
          partyData: arr
        })
      }
    })
    this.requestData(this.state.currentPage, this.state.pageSize, '' )
  } 
  reset= () => {
    this.props.form.resetFields()
  }
  querySubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        let userName = values.userName?`Q=userName=${values.userName}&`:''
        let partyId = (values.partyId && values.partyId.length > 0) ? values.partyId[values.partyId.length - 1] : ''
        let query = userName + (partyId ? `Q=partyId=${partyId}` : '')
        this.setState({
          currentPage: 1,
          pageSize: 10,
          query: query,
          partyId
        })
        this.requestData(1, 10, query)
      }
    })
  }
  change = (page,pageSize) => {
    this.setState({
      currentPage: page,
      pageSize: pageSize
    })
    this.requestData(page, pageSize, this.state.query)
  }
  pageSizeChange = (current, size) => {
    this.setState({
      currentPage: 1,
      pageSize: size
    })
    this.requestData(1, size, this.state.query)
  }
  render() {
    let powers = this.props.powers
    let hasAddPower = powers && powers['20005.23007.001'];
    let hasDelPower = powers && powers['20005.23007.004'];
    let hasEditPower = powers && powers['20005.23007.002'];
    let hasSearchPower = powers && powers['20005.23007.003'];
    const columns=[
      // {
      //   title: '编号',
      //   key: 'id',
      //   dataIndex: 'id',
      //   width: 80,
      //   fixed: 'left'
      // },
      // {
      //   title: '用户ID',
      //   dataIndex: 'userId',
      //   width: 100,
      //   key: 'userId',
      //   fixed: 'left'
      // },
      {
        title: '姓名',
        dataIndex: 'userName',
        width: 80,
        key: 'userName',
        fixed: 'left'
      },
      {
        title: '员工号',
        dataIndex: 'userNo',
        width: 100,
        key: 'userNo',
        fixed: 'left'
      },
      {
        title: '所属党组织',
        dataIndex: 'fullName',
        key: 'fullName',
      },
      {
        title: '职务',
        dataIndex: 'postName',
        key: 'postName',          
      },
      {
        title: '转出地点',
        dataIndex: 'turnOutPlace',
        key: 'turnOutPlace',
      },
      {
        title: '转出时间',
        dataIndex: 'turnOutDate',
        width:150,
        key: 'turnOutDate',
        fixed: 'right',
        render:(data,record)=>(
          record.turnOutDate && record.turnOutDate.substr(0,10)
        )
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        width:100,
        fixed: 'right',
        
        render:(data,record)=>(
            <div>
              {/* <Divider type="vertical" /> */}
              <a className='operation' disabled={!hasEditPower} onClick={() => location.hash = `/PartyBuildGarden/PartyEdit?isEdit=true&userid=${record.id}&userNo=${record.userNo}`} >编辑</a>
              {/* <Divider type="vertical"/>
              <a className='operation' onClick={()=>this.applyParty(record) } >详情</a>
              <Divider type="vertical"/> */}
            </div>
          )
      },
    ];
    const { getFieldDecorator } = this.props.form
    let pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      total: this.state.total,
      current: this.state.currentPage,
      pageSize: this.state.pageSize,
      onChange: this.change,
      onShowSizeChange: this.pageSizeChange,
      showTotal: total => `共 ${total} 条`
    }
    return (
      <div className='partyMemOut'>
        <Spin spinning={this.state.spinning} size='large'>
          <div className='search'>
            <Form onSubmit={this.querySubmit}>
              <Row>
              <Col span={10}>
                <FormItem>
                    <label>姓名：</label>
                      {getFieldDecorator('userName')(<Input className='name' placeholder="请输入" />) }  
                  </FormItem>
                </Col>
                <Col span={10}>
                <FormItem>
                    <label>党组织名称：</label>
                    {
                      getFieldDecorator('partyId')(
                        <Cascader options={this.state.partyData} placeholder='请输入' changeOnSelect />
                      )
                    } 
                  </FormItem>
                </Col>
              </Row>
              <Row style={{marginTop: 20}}>
                <Button type="primary" htmlType="submit">查询</Button>
                <Button style={{ marginLeft: 8 }} onClick={this.reset}>重置</Button>
              </Row>
            </Form>
          </div>
          <Table className='tableData' scroll={{ x: 1600}} columns={columns} dataSource={this.state.data} bordered={true} pagination={pagination} />
        </Spin>
      </div>
    )
  }
}