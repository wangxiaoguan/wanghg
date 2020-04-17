import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Form, Icon, Button, Dropdown, Menu, Modal, message, Divider, Tag } from 'antd';
import CreateForm from './PopDialog';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ tag, loading }) => ({
  tag,
  loading: loading.models.tag,
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
      dataIndex: 'tagId',
      sorter: (a, b) => a.tagId - b.tagId,
    },
    {
      title: '标题',
      dataIndex: 'name',
    },
    {
      title:'颜色',
      dataIndex:'color',
      render: color => <Tag color={color}>{color}</Tag>
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
      type: 'tag/queryData',
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
      type: 'tag/queryData',
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
          type: 'tag/delete',
          payload: {
            id: selectedRows.map(row => row.tagId).join(","),
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
    const currentId = JSON.stringify(current) === "{}" ? "" : current.tagId;
    dispatch({
      type: currentId === "" ? 'tag/addOne' : 'tag/updateOne',
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
      type: 'tag/delete',
      payload: {
        id,
      },
    });
  };

  handleDelete = (currentItem) => {
    Modal.confirm({
      title: '删除标签',
      content: '确定删除该标签吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => this.deleteItem(currentItem.tagId),
    });
  };

  render() {
    const {
      tag: { data },
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
      <PageHeaderWrapper title="标签管理">
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
