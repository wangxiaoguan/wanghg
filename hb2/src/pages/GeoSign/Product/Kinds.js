import PageHeaderWrapper from "@/components/PageHeaderWrapper"
import StandardTable from "@/components/StandardTable"
import React, { Fragment, PureComponent } from 'react';
import { Button, Card, Dropdown, Form, Icon, Menu, Input, Modal, Divider, message, Popconfirm, Table} from 'antd';
import styles from './Products.less';
import { connect } from 'dva';
import moment from 'moment';

const FormItem = Form.Item;
const { TextArea } = Input;
const CreateForm = Form.create()(props => {
  const { modalVisible, current = {}, form, handleSubmit, showModal } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleSubmit(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={`${JSON.stringify(current) === "{}" ? "新增" : "编辑"}类目`}
      visible={modalVisible}
      okText="保存"
      onOk={okHandle}
      onCancel={() => showModal()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类目">
        {form.getFieldDecorator('name', {
          initialValue: current.name,
          rules: [{ required: true, message: '产品类目名至少两个字！', min: 2 }],
        })(<Input placeholder="类目名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('description', {
          initialValue: current.description,
          rules: [{ required: true, message: '类目描述至少两个字！', min: 2}],
        })(<TextArea rows={4} placeholder="类目描述" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ kinds, loading }) => ({
  kinds,
  loading: loading.models.kinds,
}))
@Form.create()
class KindsTable extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    current: {},
  };

  columns = [
    {
      title: 'ID',
      dataIndex: 'kindId',
      sorter: (a, b) => a.kindId - b.kindId,
    },
    {
      title: '类目名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '修改人',
      dataIndex: 'modifiedBy',
    },
    {
      title: '修改时间',
      dataIndex: 'modificationTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
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
      type: 'kinds/queryData',
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
      type: 'kinds/queryData',
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
          type: 'kinds/delete',
          payload: {
            id: selectedRows.map(row => row.kindId).join(","),
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

  handleSubmit = fields => {
    const { dispatch } = this.props;
    const { current = {} } = this.state;
    const currentId = JSON.stringify(current) === "{}" ? "" : current.kindId;
    dispatch({
      type: currentId === "" ? 'kinds/addOne' : 'kinds/updateOne',
      payload: {
        id: currentId,
        ...fields,
      },
    });

    message.success(`${currentId === "" ? '添加' : '更新'}成功`);
    this.showModal();
  };

  showEditModal = Item => {
    this.setState({
      modalVisible: true,
      current: Item,
    });
  };

  deleteItem = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'kinds/delete',
      payload: {
        id,
      },
    });
  };

  handleDelete = (currentItem) => {
    Modal.confirm({
      title: '删除类目',
      content: '确定删除该类目吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteItem(currentItem.kindId),
    });
  };

  render() {
    const {
      kinds: {data},
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
      <PageHeaderWrapper title="类目管理">
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

export default KindsTable;
