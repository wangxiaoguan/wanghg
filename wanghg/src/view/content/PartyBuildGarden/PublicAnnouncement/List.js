import React, { Component } from 'react';
import { Form, Table,Tabs, Row, Col, Select, Button, Input, DatePicker, Message, Popconfirm, Upload, Cascader,Spin } from 'antd';
import TableAndSearch from '../../../component/table/TableAndSearch';
import API_PREFIX from '../../apiprefix';
import {postService,GetQueryString,getService } from '../../myFetch.js';
import {
  PublicDetail, //张榜公布详情
} from '../URL';
import {connect} from 'react-redux';
const Option = Select.Option;
@connect(
    state => ({
      pageData:state.table.pageData,
    }),
    dispatch => ({
      getData: n => dispatch(BEGIN(n)),
    })
)
export default class List extends  Component {
  constructor(props){
    super(props);
    this.state={
      totalNum:0,
      value:'',
      data:[],
      loading: false,
    }
  }
  componentDidMount(){
    this.setState({ loading: true });
    //页面相关的数据处理
    this.dealData();
  }
  dealData=()=>{
    //获取榜单信息
    getService(API_PREFIX+'services/partybuilding/taskStateTxUI/boardList/get/1/1000/2',(data)=>{
      if(data.retCode===1){
        data.root.list&&data.root.list.map((item,i)=>{
          item.indexN=i+1;
        });
        this.setState({totalNum:data.root.totalNum,data:data.root.list,loading: false});
      }else{
        message.error(data.retMsg);
        this.setState({ loading: false });
      }
      console.log("data22222222",this.state.data)
    });
  }
  //详情
  PublicDetail=(record)=>{
    location.hash = PublicDetail + `?queryRange=${record.queryrange}`;
  }
  handleChange = (e) => {
    this.setState({ value: e });
  }
  //查询
  handleSubmit= e => {
    e.preventDefault();
    let values = this.state.value;
    getService(API_PREFIX+`services/partybuilding/taskStateTxUI/boardList/get/1/1000/${values}`,(data)=>{
      if(data.retCode===1){
        data.root.list&&data.root.list.map((item,i)=>{
          item.indexN=i+1;
        });
        this.setState({totalNum:data.root.totalNum,data:data.root.list});
      }
    });
  }
  render(){
    const columns=[
      {
        title: '序号',
        key: 'indexN',
        dataIndex: 'indexN',
      },
      {
        title: '榜单名称',
        key: 'boardName',
        dataIndex: 'boardName',
      },
      {
        title: '发布时间',
        dataIndex: 'queryrange',
        key: 'queryrange',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render:(data,record)=>(
          <div>
            <a className='operation'  onClick={()=>this.PublicDetail(record)}>详情</a>
          </div>
        )
      },

    ];
    let anotherColumns=[...columns];
     anotherColumns.splice(
         9,
         0,
         {
           title: '是否终止',
           dataIndex: 'isStopDesp',
           key: 'isStopDesp',
         },
     );
     const search = [
       { key: 'listName', label: '榜单名称',qFilter:'Q=taskName_LK',type:'input'},
     ];

    let { data,  totalNum} = this.state;

    console.log("data1==",data);
    let pagination = {
      showQuickJumper: true,
      showSizeChanger: true,
      total: totalNum,
      pageSize: 10,
      // current: 10,
      pageSizeOptions: ['10', '15', '20'],
    };
    const formItemLayout = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
    const formItemLayout1 = { labelCol: { span: 7 }, wrapperCol: { span: 17 } };
    const searchs = search ? (
      <Row className="row">
        {search.map((item, index) => {
          return (
            <div key={index}>
              {item.type==='select' ? (
                <Col span="8" pull={1}>
                  <Form.Item {...formItemLayout} label={item.label}>
                    <Select
                      className="select"
                      style={{width:'100%'}}
                      placeholder="请选择"
                      getPopupContainer={trigger => trigger.parentNode}
                      onChange={value =>
                        this.handleChange(
                          value,
                          item.key,
                          item.qFilter,
                          item.type
                        )
                      }
                    >
                      {
                        item.option&&item.option.map(_=>{
                          return <Option key={_.key} value={_.key}>
                            {_.value}
                          </Option>;
                        })
                      }
                    </Select>
                  </Form.Item>
                </Col>
              ) : (
                <Col span="8" pull={1}>
                  {
                    item.type==='input'?
                      <Form.Item {...formItemLayout1} label={item.label}>
                        <Input style={{ width: '100%' }} className="input1" placeholder="请输入关键字" value={this.state.value} onChange={e => this.handleChange(
                          e.target.value,
                          item.key,
                          item.qFilter,
                          item.type
                        )}/>
                      </Form.Item>:
                      item.type === 'cascader' ?
                        <Form.Item {...formItemLayout1} label={item.label}>
                          <Cascader
                            style={{ width: '100%' }}
                            className="input1"
                            options={item.option}
                            placeholder="请输入关键字"
                            changeOnSelect
                            onChange={value => this.handleChange(
                              value,
                              item.key,
                              item.qFilter,
                              item.type
                            )}
                          />
                        </Form.Item>:null
                  }
                </Col>
              )}
            </div>
          );
        })}
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
              // this.props.form.resetFields();
              this.setState({ value:'' });
              this.dealData();
            }}
          >
            重置
          </Button>
        </Col>
      </Row>
    ) : null;
    return(
      <Spin spinning={this.state.loading}>
        <div>
          <div className='custom-table-search'>
            <Form onSubmit={this.handleSubmit}>{searchs}</Form>
          </div>
          <Table rowKey='id' bordered columns={columns} dataSource={data} pagination={pagination}/>
        </div>
      </Spin>  
    );
  }
}
