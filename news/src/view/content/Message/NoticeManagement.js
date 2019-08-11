import React, { Component } from 'react';
import { Form, Button, Input, DatePicker, Table, Modal, Spin } from 'antd';
import { getService, postService } from '../myFetch';
import ServiceApi from '../apiprefix';

import './NoticeManagement.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const PageSize = 10;

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
    };

    this.columns = [
      {
        title: "发布人",
        dataIndex: 'name',
      },
      {
        title: "标题",
        dataIndex: 'title',
      },
      {
        title: "创建时间",
        dataIndex: 'createDate',
      },
      {
        title: "操作",
        render: (text, record) => {
          return <a>详情</a>;
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
      this.setState({ searchParams: values }, this.requestData);
    });
  }

  componentDidMount() {
    this.requestData();
  }

  requestDelete() {
    if (this.state.selectedRowKeys) {
      console.log(this.state.selectedRowKeys);
      postService(
        ServiceApi + 'services/message/message/deleteMessageByIdList/delete',
        JSON.stringify(this.state.selectedRowKeys),
        (res) => {

        }
      );
    }
  }

  requestData() {
    let params = [];
    const { searchParams } = this.state;
    if (searchParams) {
      if (searchParams.title) {
        params.push(`title_S_LK=${searchParams.title}`);
      }
      if (searchParams.createDate && searchParams.createDate.length >= 2) {
        params.push(`createDate_D_GE=${searchParams.createDate[0].format('YYYY-MM-DD 00:00:00')}`);
        params.push(`createDate_D_LE=${searchParams.createDate[1].format('YYYY-MM-DD 23:59:59')}`);
      }
    }

    let searchStr = (params && params.length > 0) ? `?Q=${params.join('&&Q=')}` : '';
    this.setState({ loading: true });
    getService(ServiceApi + `services/message/message/messageList/get/${this.state.current}/${PageSize}${searchStr}`, (res) => {
      this.setState({ loading: false, data: res.root.list, total: res.root.totalNum });
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
     
        <div className="NoticeManagement">
          <Form layout="inline" className="form">
            <FormItem>
              <Button className="queryBtn" onClick={() => {
                location.hash = '#/Message/Notice/Edit';
              }}>添加通知+</Button>
              <Button
                className="deleteBtn"
                disabled={(this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0) ? false : true}
                onClick={this.deleteHandler}
              >
                删除
              </Button>
            </FormItem>
            <FormItem label="标题">
              {
                getFieldDecorator('title')(<Input />)
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
            rowSelection={{
              onChange: (selectedRowKeys) => {
                console.log(selectedRowKeys);
                this.setState({ selectedRowKeys });
              },
            }}
            pagination={{
              pageSize: PageSize,
              current: this.state.current,
              total: this.state.total,
              showQuickJumper: true,
              onChange: (page) => {
                this.setState({ current: page }, this.requestData);
              },
            }}
            columns={this.columns}
            dataSource={this.state.data}
          />
        </div>
     
    );
  }
}

export default NoticeManagement;