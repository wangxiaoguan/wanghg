import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Input, Icon, Button, Dropdown, Menu, Modal, message, Divider } from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../Product/Products.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, current = {}, form, handleSubmit , handleModalVisible } = props;
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
      title={`${JSON.stringify(current) === "{}" ? "新增" : "编辑"}文章分类`}
      visible={modalVisible}
      okText="保存"
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分类名">
        {form.getFieldDecorator('name', {
          initialValue: current.name,
          rules: [{ required: true, message: '分类名称至少两个字！', min: 2 }],
        })(<Input placeholder="分类名称" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="英文名">
        {form.getFieldDecorator('ename', {
          initialValue: current.ename,
          rules: [{ required: true, message: '英文分类名至少两个字！', min: 2 }],
        })(<Input placeholder="分类英文名" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('description', {
          initialValue: current.description,
          rules: [{ required: true, message: '分类描述至少两个字！', min: 2 }],
        })(<TextArea rows={3} placeholder="类目描述" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ category, loading }) => ({
  category,
  loading: loading.models.category,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    current: {},
  };

  columns = [
    {
      title: 'ID',
      dataIndex: 'categoryId',
      sorter: (a, b) => a.categoryId - b.categoryId,
    },
    {
      title: '分类名',
      dataIndex: 'name',
    },
    {
      title:'英文名',
      dataIndex:'ename',
    },
    {
      title:'描述',
      dataIndex:'description',
    },
    {
      title: '创建人',
      dataIndex: 'createdBy',
    },

    {
      title: '创建时间',
      dataIndex: 'creationTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '修改人',
      dataIndex:'modifiedBy'
    },
    {
      title: '修改时间',
      dataIndex:'modificationTime',
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
      type: 'category/queryData',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'category/queryData',
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
          type: 'category/delete',
          payload: {
            id: selectedRows.map(row => row.categoryId).join(","),
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

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      current: undefined,
    });
  };

  handleSubmit = fields => {
    const { dispatch } = this.props;
    const { current = {} } = this.state;
    const currentId = JSON.stringify(current) === "{}" ? "" : current.categoryId;
    dispatch({
      type: currentId === "" ? 'category/addOne' : 'category/updateOne',
      payload: {
        id: currentId,
        ...fields,
      },
    });

    message.success(`${currentId === "" ? '添加' : '更新'}成功`);
    this.handleModalVisible();
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
      type: 'category/delete',
      payload: {
        id,
      },
    });
  };

  handleDelete = (currentItem) => {
    Modal.confirm({
      title: '删除分类',
      content: '确定删除该分类吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteItem(currentItem.categoryId),
    });
  };

  render() {
    const {
      category: { data },
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
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderWrapper title="分类管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
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

export default TableList;
