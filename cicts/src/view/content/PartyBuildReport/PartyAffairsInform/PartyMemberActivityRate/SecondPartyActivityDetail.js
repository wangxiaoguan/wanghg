import React, { Component } from 'react';
import { Form, Button, Input,Table, Row, Col} from 'antd';
import { getService ,exportExcelFileService} from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import './SecondPartyActivityDetail.less'
import { Link } from 'react-router-dom';
import moment from 'moment';
import {connect} from 'react-redux';
const FormItem = Form.Item;

// Excel表导出权限码配置
@connect(
  state => ({
    powers: state.powers
  })
)


@Form.create()
class SecondPartyActivityDetail extends Component{
    constructor(props){
        super(props);
        //获取地址栏的id，
        let listId = props.location.search.split("&")[0].substr(4)
        let startValue=JSON.parse( sessionStorage.getItem('time')).startTime
        let endValue=JSON.parse( sessionStorage.getItem('time')).endTime
        this.state={
            PageSize:5, //每页十条数据
            current: 1, //当前页
            total: 0,//查询的总数量
            loading: false,
            data:[],//table表格初始值
            id: listId, //***正式调试的时候使用的id*** */
            query: '',
            startTime:startValue,
            endTime:endValue,
        }
        this.columns = [
            {
              title: "序号",
              dataIndex: 'key',
              key:'key',
              width:71
            },
            {
              title: "党组织名称",
              dataIndex: 'name',
              key:'name',
              width:231
            },
            {
              title: "党员人数",
              dataIndex: 'total',
              key:'total',
              width:143
            },
            {
                title: "党建任务活跃人数",
                dataIndex: 'task',
                key:'task',
                width:181
              },
              {
                title: "资讯活动活跃人数",
                dataIndex: 'activity',
                key:'activity',
                width:169
              },
              {
                title: "掌上党校活跃人数",
                dataIndex: 'school',
                key:'school',
                width:168
              },{
                title: "党建考试活跃人数",
                dataIndex: 'exam',
                key:'exam',
                width:183
              },{
                title: "党员活跃率",
                dataIndex: 'activecr',
                key:'activecr',
                width:157
              },
            {
              title: "操作",
              width:186,
              // key:'feeno',
              render: (text, record) => {
                return  <a className='operation' onClick={()=>this.GotoPartyActivityBranchesDetails(record) } >详情</a>;
              },
            },
          ];
    }

//接口请求的函数封装
commonServer = ( current, pageSize,id, query) => {
  let queryAll = query ? `${query}` : ''
  getService(`${API_PREFIX}services/partybuildingreport/activeRate/activeList/${current}/${pageSize}/${id}?Q=startime_EQ=${this.state.startTime}&Q=endtime_EQ=${this.state.endTime}${queryAll}`, data => {
    if (data.retCode === 1) {
      data.root.list.forEach((item, i) => {
        item['key'] = i + 1
      })
      this.setState({
        data: data.root.list,
        total: data.root.totalNum
      })
    }
  })
}
    
//点击进入详情页初始化渲染
componentWillMount() {
  this.commonServer(this.state.current, this.state.PageSize,this.state.id)
}


    goback=()=>{
        history.go(-1)
    }
    
//二级组织详情
    GotoPartyActivityBranchesDetails=(record)=>{
    getService(`${API_PREFIX}services/partybuildingreport/partyClass/minorg/${record.partyid}?`, data => {
      if (data.root.count===0) {//count等于0时依次跳下一级
        location.hash=`/PartyBuildReport/PartyAffairsInform/PartyActivityBranchesDetails?id=${record.partyid}`
      }else{//count等于1时往最后一个页面跳转
        location.hash = `/PartyBuildReport/PartyAffairsInform/PartyActivityBranchesDetails?id=${record.partyid}`
      }
    })
  }

  //form表单提交
  submitSearch = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, fieldsValue) => {
        if (!err) {
          let username = fieldsValue.title ? `&Q=name_LK=${fieldsValue.title}` : '';
          let queryOne = `${username}`
          this.setState({
            current: 1,
            PageSize: 5,
            query: queryOne
          })
          // this.commonServer(this.state.id,this.state.current,this.state.PageSize,queryOne)
          this.commonServer( 1, 5,this.state.id,queryOne)
        }
      })
    }

  //页面大小改变触发
   onPageSizeChange=(current, pageSize)=>{
    let query = this.state.query ? `${this.state.query}` : ''
    this.commonServer( current, pageSize,this.state.id,query)
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
    this.commonServer( page, pageSize,this.state.id,this.state.query)
  }   
  
  //Excel表单导出
  ExportExcel = () => {
    let queryname = this.state.query ? `${this.state.query}` : ''
    // let path= `${API_PREFIX}services/partybuildingreport/partyfee/PartyFeeExcel?id=${this.state.id}&page=${this.state.current}&pageSize=${this.state.PageSize}${queryname}`
    let path = `${API_PREFIX}services/partybuildingreport/activeRate/exportActive/${this.state.id}?Q=startime_EQ=${this.state.startTime}&Q=endtime_EQ=${this.state.endTime}${queryname}`
    exportExcelFileService(path, '党员活跃率党组织表统计')
  }

    render(){
        const { getFieldDecorator } = this.props.form;
        var userJsonStr = sessionStorage.getItem('time');
        var userEntity = JSON.parse(userJsonStr);
        const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
        let powers = this.props.powers;
        let exportExcelPower=powers && powers['20011.25006.202']
        return(
            <div className="SecondPartyActivityDetail">
                <p className="header">{userEntity.startTime} - {userEntity.endTime}</p>
                <Form layout="inline" className="form" onSubmit={this.submitSearch}>
                    <FormItem label="党组织名称" className="name"  {...formItemLayout}>
                    {
                    getFieldDecorator('title')(<Input placeholder="请输入" />)
                     }
                    </FormItem>
                    <FormItem>
                        {/* <Button className="queryBtn" onClick={this.submitSearch}>查询</Button> */}
                        <Button className="queryBtn" type="primary" htmlType="submit">查询</Button>
                        <Button className="resetBtn" onClick={() => {
                    this.props.form.resetFields();
                    }}>重置</Button>
                    </FormItem>
                </Form>
               <div className="ExportExcelDiv">
               {exportExcelPower?(<Button className="resetBtn ExportExcel " onClick={this.ExportExcel}>导出Excel</Button>):''}
              </div>
                <Table
            className="table"
            rowKey={this.key}
            bordered
            pagination={{
              pageSize: this.state.PageSize,
              current: this.state.current,
              total: this.state.total,
              showSizeChanger :true,
              showQuickJumper: true,
              onShowSizeChange: this.onPageSizeChange,
              pageSizeOptions:['10', '20', '30', '40'],
              onChange:this.changePage,
              showTotal: total => `共 ${total} 条`
            }}
            columns={this.columns}
            dataSource={this.state.data}
          />
          <div className="goback">
            <Button className="queryBtn" onClick={this.goback}>返回</Button>
          </div>
            </div>
        )
    }
}

export default SecondPartyActivityDetail;