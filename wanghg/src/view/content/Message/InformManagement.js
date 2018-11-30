import React, { Component } from 'react';
import { Form, Input, Select, Button, Table, Spin } from 'antd';
import InformReply from './InformReply';
import './IdeaManagement.less';
import { getService } from '../myFetch';
import API_PREFIX from '../apiprefix';

const FormItem = Form.Item;
const PageSize = 20;
const { Option } = Select;
const STATUS = {
  0: '待处理',
  1: '忽略',
  2: '接受未处理',
  3: '接受已处理',
};

const TYPE = {
  1: '评论',
  2: '圈子消息',
};

@Form.create()
class InformManagement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      total: 0,
      current: 1,
    };
    this.columns = [
      {
        title: '举报来源',
        dataIndex: 'type',
        render: (text, record) => {
          return TYPE[record.type];
        },
      },
      {
        title: '举报原因',
        dataIndex: 'reason',
      },
      {
        title: '举报描述',
        dataIndex: 'describle',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (text, record) => {
          return STATUS[record.status];
        },
      },
      {
        title: '举报时间',
        dataIndex: 'createDate',
      },
      {
        title: '处理人',
        dataIndex: 'name',
      },
      {
        title: '处理时间',
        dataIndex: 'reportDate',
      },
      {
        title: '操作',
        dataIndex: '',
        render: (text, record) => {
          return (
            <div className="tdControl">
              <a style={{ display: record.status === 0 ? "" : "none" }} onClick={() => {
                this.setState({ replyId: record.id }, this.refs.replyModal.show);
              }}>处理</a>
            </div>
          );
        },
      },
    ];
  }

  requestData() {
    this.setState({ loading: true });
    let params = [];
    let { searchParams } = this.state;
    if (searchParams) {
      if (searchParams.type) {
        params.push(`type_I_EQ=${searchParams.type}`);
      }
      if (searchParams.status) {
        params.push(`status_I_EQ=${searchParams.status}`);
      }
      if (searchParams.reason) {
        params.push(`reason_S_LK=${searchParams.reason}`);
      }
    }

    let searchStr = (params && params.length > 0) ? `?Q=${params.join('&&Q=')}` : '';

    getService(API_PREFIX + `services/message/report/reportList/get/${this.state.current}/${PageSize}${searchStr}`, (res) => {
      this.setState({ data: res.root.list, total: res.root.totalNum, loading: false });
    });
  }

  componentDidMount() {
    this.requestData();
  }

  searchHandler = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ searchParams: values }, this.requestData);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
     
        <div className="IdeaManagement">
          <Form layout="inline" onSubmit={this.searchHandler}>
            <FormItem label="举报来源">
              {
                getFieldDecorator('type')(
                  <Select allowClear={true}>
                    {
                      Object.keys(TYPE).map((key) => {
                        return <Option key={key} value={key}>{TYPE[key]}</Option>
                      })
                    }
                  </Select>)
              }
            </FormItem>
            <FormItem label="举报原因">
              {
                getFieldDecorator('reason')(<Input />)
              }
            </FormItem>
            <FormItem label="状态">
              {
                getFieldDecorator('status')(
                  <Select allowClear={true}>
                    {
                      Object.keys(STATUS).map((key) => {
                        return <Option key={key} value={key}>{STATUS[key]}</Option>
                      })
                    }
                  </Select>)
              }
            </FormItem>
            <FormItem>
              <Button className="queryBtn" htmlType="submit" >查询</Button>
              <Button className="resetBtn" onClick={() => {
                this.props.form.resetFields();
              }}>重置</Button>
            </FormItem>
          </Form>
          <div className="divTable">
            <Table
              rowKey="id"
              columns={this.columns}
              dataSource={this.state.data}
              pagination={
                {
                  current: this.state.current,
                  total: this.state.total,
                  pageSize: PageSize,
                  showQuickJumper: true,
                  onChange: (page) => {
                    this.setState({ current: page }, this.requestData);
                  },
                }
              }
            />
          </div>
          <InformReply ref="replyModal" id={this.state.replyId} replyHandler={() => {
            this.requestData();
          }} />
        </div>
      
    );
  }
}

export default InformManagement;