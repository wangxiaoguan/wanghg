import PageHeaderWrapper from "@/components/PageHeaderWrapper"
import StandardTable from "@/components/StandardTable"
import React, { Fragment, PureComponent } from 'react';
import { Button, Card, Dropdown, Form, Icon, Menu, Input, Modal, Divider, message, Switch } from 'antd';
import styles from '../Product/Products.less';
import { connect } from 'dva';
import moment from 'moment';

const FormItem = Form.Item;
const { TextArea } = Input;
const CreateForm = Form.create()(props => {
  const { modalVisible, current, form, handleSubmit, showModal } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      if (!fieldsValue.status) {
        fieldsValue.status = "false"
      }

      form.resetFields();
      handleSubmit(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={`${JSON.stringify(current) === '{}' ? "新增" : "编辑"}培训报名`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => showModal()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="姓名">
        {form.getFieldDecorator('name', {
          initialValue: current.name,
          rules: [{ required: true, message: '姓名必填！' }],
        })(<Input placeholder="请输入姓名" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="手机号">
        {form.getFieldDecorator('phone', {
          initialValue: current.phone,
          rules:[{
            required:true,
            pattern: new RegExp(/^[1-9]\d*$/, "g"),
            message: '请输入正确的手机号码',
          }],
          getValueFromEvent: (event) => event.target.value.replace(/\D/g,''),
        })(<Input placeholder="请输入手机号码" maxLength={11} />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="家庭住址">
        {form.getFieldDecorator('address', {
          initialValue: current.address,
          rules: [{ required: true, message: '家庭住址必填！' }],
        })(<Input placeholder="请输入家庭住址" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="申请理由">
        {form.getFieldDecorator('reason', {
          initialValue: current.reason,
          rules: [{ required: true, message: '申请理由至少5个字！', min: 5 }],
        })(<TextArea rows={5} placeholder="请输入申请理由" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 16 }} label="申请状态">
        {form.getFieldDecorator('status', {
        })(<Switch checkedChildren="已审核" unCheckedChildren="未审核" defaultChecked={current.status === "true" ? 1 : false} />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ train, loading }) => ({
  train,
  loading: loading.models.train,
}))
@Form.create()
class TrainTable extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    current: {},
    // formValues: {},
    // stepFormValues: {},
  };

  columns = [
    {
      title: 'ID',
      dataIndex: 'enrolmentId',
      sorter: (a, b) => a.enrolmentId - b.enrolmentId,
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
    },
    {
      title: '申请状态',
      dataIndex: 'status',
      render: status => <Switch disabled={true} checkedChildren="已审核" unCheckedChildren="未审核" checked={status === 'true'} />
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
    },
    {
      title: '创建时间',
      dataIndex: 'creationTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
    },
    {
      title: '修改人',
      dataIndex: 'modifiedBy',
    },
    {
      title: '修改时间',
      dataIndex: 'modificationTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.showEditModal(record)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={() => this.handleDelete(record)}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'train/queryData',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'train/queryData',
      payload: params,
    });
  };


  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'train/delete',
          payload: {
            id: selectedRows.map(row => row.enrolmentId).join(","),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  showModal = flag => {
    this.setState({
      modalVisible: !!flag,
      current: undefined,
    });
  };

  showEditModal = Item => {
    this.setState({
      modalVisible: true,
      current: Item,
    });
  };

  handleSubmit = fields => {
    const { dispatch } = this.props;
    const { current = {} } = this.state;
    const currentId = JSON.stringify(current) === "{}" ? "" : current.enrolmentId;
    dispatch({
      type: currentId === "" ? 'train/addOne' : 'train/updateOne',
      payload: {
        id: currentId,
        ...fields,
      },
    });

    message.success(`${currentId === "" ? '添加' : '更新'}成功`);
    this.showModal();
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'train/delete',
      payload: {
        id,
      },
    });
  };

  handleDelete = (currentItem) => {
    Modal.confirm({
      title: '删除培训信息',
      content: '确定删除该培训申请吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteItem(currentItem.enrolmentId),
    });
  };

  render() {
    const {
      train: {data},
      loading,
    } = this.props;
    const { selectedRows, modalVisible, current = {} } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleSubmit: this.handleSubmit,
      showModal: this.showModal,
    };
    return (
      <PageHeaderWrapper title="培训管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.showModal(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} current={current} />
      </PageHeaderWrapper>
    );
  }
}

export default TrainTable;
