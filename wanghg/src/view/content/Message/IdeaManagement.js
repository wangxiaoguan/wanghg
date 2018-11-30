import React, { Component } from 'react';
import { Form, Input, DatePicker, Select, Button, Table, Modal, message, Spin } from 'antd';
import IdeaReply from './IdeaReply';
import './IdeaManagement.less';
import { postService, getService } from '../myFetch';
import API_PREFIX from '../apiprefix';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const PageSize = 10;
const { Option } = Select;

@Form.create()
class IdeaManagement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: null,    //选中行的id
      data: [],                 //表格数据源
      total: 0,                 //数据总量
      current: 1,               //当前页码
      searchParams: null,
    };
    this.columns = [
      {
        title: '用户姓名',
        dataIndex: 'name',
      },
      {
        title: '手机号',
        dataIndex: 'mobile',
      },
      {
        title: '意见类型',
        dataIndex: 'nameb',
      },
      {
        title: '意见描述',
        dataIndex: 'content',
      },
      {
        title: '回复人',
        dataIndex: 'namer',
      },
      {
        title: '回复内容',
        dataIndex: 'replycontent',
        width: '30%',
      },
      {
        title: '是否采纳',
        dataIndex: 'isaccept',
        render: (text, record) => {
          return record.isaccept ? '是' : '否';
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
      },
      {
        title: '操作',
        dataIndex: '',
        width: '100px',
        render: (text, record) => {
          return (
            <div className="tdControl">
              <a style={{ display: record.replycontent ? 'none' : '' }} onClick={() => {
                this.setState({ replyId: record.id }, this.refs.replyModal.show);
              }}>回复</a>
              <a style={{ display: record.isaccept ? 'none' : '' }} onClick={() => {
                Modal.confirm({
                  title: '提示',
                  content: '是否采纳意见，若采纳意见\r\n对方将获取奖励积分！',
                  onOk: () => {
                    this.requestAcceptIdea(record.id);
                  },
                });
              }}>采纳意见</a>
            </div >
          );
        },
      },
    ];
  }

  requestTypeData() {
    getService(API_PREFIX + 'services/message/feedback/getOpinionType', (res) => {
      this.setState({ typeData: res.root.list });
    });
  }

  requestData() {
    this.setState({ loading: true });
    let params = [];
    let { searchParams } = this.state;
    if (searchParams) {
      if (searchParams.userName) {
        params.push(`name_S_LK=${searchParams.userName}`);
      }
      if (searchParams.isAccept) {
        params.push(`isaccept_Z_EQ=${searchParams.isAccept}`);
      }
      if (searchParams.createDate && searchParams.createDate.length >= 2) {
        params.push(`createDate_D_GE=${searchParams.createDate[0].format('YYYY-MM-DD 00:00:00')}`);
        params.push(`createDate_D_LE=${searchParams.createDate[1].format('YYYY-MM-DD 23:59:59')}`);
      }
      if (searchParams.ideaType) {
        params.push(`nameb_S_EQ=${searchParams.ideaType}`);
      }
    }

    let searchStr = (params && params.length > 0) ? `?Q=${params.join('&&Q=')}` : '';

    getService(API_PREFIX + `services/message/feedback/feedbackList/get/${this.state.current}/${PageSize}${searchStr}`, (res) => {
      if (res.retCode) {
        this.setState({ data: res.root.list, total: res.root.totalNum });
        this.setState({ loading: false });
      }
    });
  }

  requestDelete() {
    if (this.state.selectedRowKeys && this.state.selectedRowKeys.length > 0) {
      postService(API_PREFIX + `services/message/feedback/deleteFeedbackByIdList/delete`,
        this.state.selectedRowKeys,
        (res) => {
          this.requestData();
        });
    }
  }

  requestAcceptIdea = (id) => {
    postService(API_PREFIX + `services/message/feedback/updateAccept/${id}`, null, (res) => {
      if (res.retCode) {
        this.requestData();
      }
    });
  }

  componentDidMount() {
    this.requestData();
    this.requestTypeData();
  }

  searchHandler = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ searchParams: values }, this.requestData);
      }
    });
  }

  deleteHandler = (event) => {
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
    else {
      message.warn('请选择要删除的数据');
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
    
        <div className="IdeaManagement">
          <Form layout="inline" onSubmit={this.searchHandler}>
            <FormItem label="用户姓名">
              {
                getFieldDecorator('userName')(<Input />)
              }
            </FormItem>
            <FormItem label="意见类型">
              {
                getFieldDecorator('ideaType')(
                  <Select allowClear={true}>
                    {
                      this.state.typeData &&
                      this.state.typeData.map((item) => {
                        return <Option key={item.id} value={item.name}>{item.name}</Option>;
                      })
                    }
                  </Select>)
              }
            </FormItem>
            <FormItem label="是否采纳">
              {
                getFieldDecorator('isAccept')(
                  <Select allowClear={true}>
                    <Option value="true">是</Option>
                    <Option value="false">否</Option>
                  </Select>)
              }
            </FormItem>
            <FormItem label="创建时间">
              {
                getFieldDecorator('createDate')(<RangePicker />)
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
            <Button className="exportBtn">导出</Button>
            <Button className="deleteBtn" disabled={!this.state.selectedRowKeys || this.state.selectedRowKeys.length === 0}
              onClick={this.deleteHandler}
            >
              删除
            </Button>
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
              rowSelection={{
                onChange: (selectedRowKeys) => {
                  this.setState({ selectedRowKeys });
                },
              }}
            />
          </div>
          <IdeaReply ref="replyModal" id={this.state.replyId} replyHandler={() => {
            this.requestData();
          }} />
        </div>
    
    );
  }
}

export default IdeaManagement;