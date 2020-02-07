import React, { Component } from 'react';
import { Form, Button, Input, DatePicker, Table, Modal, Spin } from 'antd';
import { getService, postService } from '../myFetch';
import API_PREFIX from '../apiprefix';
import {connect} from 'react-redux';
import { BEGIN } from '../../../redux-root/action/table/table';

import './NoticeManagement.less';
import NoticeInfo from './NoticeInfo';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const PageSize = 10;
@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
  })
)
/**
 * 消息管理列表
 */
@Form.create()
class NoticeManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: null,
      current: 1,
      loading: false,
      PageSize: 10,             //每页十条数据
      total:0,
      selectLenght:0,
    };

    this.columns = [
      {
        title: "发布人",
        dataIndex: 'name',
        width:100,
      },
      {
        title: "内容",
        dataIndex: 'content',
        width: '30%',
      },
      {
        title: "创建时间",
        dataIndex: 'createDate',
        width:150,
      },
      {
        title: "操作",
        width: 110,
        render: (text, record) => {
          return <a
          disabled={!(this.props.powers && this.props.powers['20008.23002.003'])}
          onClick={() => {
            this.setState({ selectedId: record.id });
            this.refs.noticeInfo.show();
          }}>详情</a>;
        },
      },
    ];
  }

  deleteHandler = () => {
    if (this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0) {
      Modal.confirm(
        {
          title: '操作不可恢复！',
          content: `您确定要删除${this.state.selectedRowKeys.length}条数据吗？ 此操作不可恢复`,
          onOk: () => {
            this.requestDelete();
          },
        }
      );
    }
  }

  submitSearch = (event) => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({ searchParams: values,current:1,PageSize:10 }, this.requestData);
    });
  }

  componentDidMount() {
    this.requestData();
  }

  requestDelete() {
    if (this.state.selectedRowKeys) {
      this.setState({ selectLenght: this.state.selectedRowKeys.length });
      postService(
        API_PREFIX + 'services/message/message/deleteMessageByIdList/delete',
        {'ids':this.state.selectedRowKeys},//修改传给后台的参数，以前是传[],现在修改成{'ids',[]}xwx2019/3/6
        (res) => {
          this.requestData();
          if(res.retCode === 1){
            
            this.state.selectedRowKeys.length = 0;
          }
          console.log(this.state.selectedRowKeys);
        }
      );
    }
  }

  requestData() {
    let params = [];
    const { searchParams,current,PageSize,selectedRowKeys,total,selectLenght } = this.state;
    console.log(current,PageSize,selectLenght)
    if (searchParams) {
      if (searchParams.content) {
        params.push(`content_S_LK=${searchParams.content}`);
      }
      if (searchParams.createDate && searchParams.createDate.length >= 2) {
        params.push(`createDate_D_GE=${searchParams.createDate[0].format('YYYY-MM-DD 00:00:00')}`);
        params.push(`createDate_D_LE=${searchParams.createDate[1].format('YYYY-MM-DD 23:59:59')}`);
      }
    }
    let pageNum=current
    if(selectLenght){
      if((total-selectLenght)%10==0){
        pageNum=current-1
      }
    }
    let searchStr = (params && params.length > 0) ? `?Q=${params.join('&Q=')}` : '';
    this.setState({ loading: true });
    getService(API_PREFIX + `services/message/message/messageList/get/${pageNum}/${this.state.PageSize}${encodeURI(searchStr)}`, (res) => {
      this.setState({ loading: false, data: res.root.list, total: res.root.totalNum });
    });
  }
   //页面大小改变触发xwx2019/3/14
   onPageSizeChange=(page, pageSize)=>{
    this.setState({current:page,PageSize:pageSize},this.requestData)
  }
  render() {
    let powers = this.props.powers;
    console.log(this.state.total)
    console.log('权限码', powers);
    let hasAddPower = powers && powers['20008.23002.001'];
    let hasDelPower = powers && powers['20008.23002.004'];
    const { getFieldDecorator } = this.props.form;
    return (
      <Spin spinning={this.state.loading}>
        <div className="NoticeManagement">
          <Form layout="inline" className="form">
            <FormItem>
              {hasAddPower ?<Button className="queryBtn" onClick={() => {
                location.hash = '#/Message/Notice/Edit';
                }}>添加通知+</Button>:null
              }  
              {hasDelPower ?<Button
                className="deleteBtn"
                disabled={(this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0) ? false : true}
                onClick={this.deleteHandler}
              >
                删除
              </Button>:null
              }
            </FormItem>
            <FormItem label="内容">
              {
                getFieldDecorator('content')(<Input />)
              }
            </FormItem>
            <FormItem label="创建时间">
              {
                getFieldDecorator('createDate')(<RangePicker />)
              }
            </FormItem>
            <FormItem>
              <Button className="queryBtn" onClick={this.submitSearch}>查询</Button>
              <Button className="resetBtn" onClick={() => {
                this.props.form.resetFields();
              }}>重置</Button>
            </FormItem>
          </Form>
          <Table
            className="table"
            rowKey="id"
            bordered={true}
            // rowKey="creator"
            rowSelection={{
              onChange: (selectedRowKeys) => {
                console.log(selectedRowKeys);
                this.setState({ selectedRowKeys });
              },
            }}
            pagination={{
              pageSize: this.state.PageSize,
              current: this.state.current,
              total: this.state.total,
              showQuickJumper: true,
              onShowSizeChange: this.onPageSizeChange,
              showSizeChanger:true,
              pageSizeOptions: ["10", "20", "30", "40"],
              showTotal: total => `共 ${total} 条`,
              onChange: (page,pageSize) => {
                this.setState({ current: page,PageSize:pageSize }, this.requestData);
              },
            }}
            columns={this.columns}
            dataSource={this.state.data}
          />
        </div>
        <NoticeInfo ref="noticeInfo" id={this.state.selectedId} />
      </Spin>
    );
  }
}

export default NoticeManagement;