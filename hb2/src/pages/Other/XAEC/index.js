import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Icon,
  Popconfirm,
  Divider,
  message,
  Table,
  Select,
} from 'antd';
import router from 'umi/router';
import styles from './index.less';
import CreateForm from './AddModal';

const { Option } = Select;
const FormItem = Form.Item;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({ xaec, loading }) => ({
  xaec,
  loading,
}))
@Form.create()
class Xaec extends PureComponent {
  state = {
    formValues: {},
    modalVisible: false,
    curItem: {},
    isAdd: false,
  };

  componentDidMount() {
    const {
      dispatch,
      xaec: {
        data: { pagination },
      },
    } = this.props;
    dispatch({
      type: 'xaec/fetch',
      payload: pagination,
    });
  }

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleModalState = (isAdd, item) => {
    this.setState({
      isAdd,
      curItem: item,
    });
  };

  handle = fields => {
    const { dispatch } = this.props;
    const { isAdd, curItem, formValues } = this.state;
    let type;
    const payload = fields;
    if (isAdd) {
      type = 'xaec/add';
    } else {
      type = 'xaec/update';
      payload.id = curItem.id;
    }
    payload.groupCode = payload.code;
    dispatch({
      type,
      payload,
      callback: resp => {
        if (resp === undefined) {
          return;
        }
        dispatch({
          type: 'xaec/fetch',
          payload: { ...formValues },
        });
        message.success(`${isAdd ? '添加' : '修改'}成功`);
      },
    });
    this.setState({
      modalVisible: false,
    });
  };

  handleSimpleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'xaec/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'xaec/fetch',
      payload: {},
    });
  };

  checkCodeFunc = (code, callback) => {
    const { dispatch } = this.props;
    const { isAdd, curItem } = this.state;

    const payload = { 'Q=code_EQ': code, 'Q=groupCode_EQ': code };
    if (!isAdd) {
      payload['Q=id_L_NE'] = curItem.id;
    }
    dispatch({
      type: 'xaec/check',
      payload,
      callback,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'xaec/fetch',
        payload: values,
      });
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="类型名称">
              {getFieldDecorator('Q=desp_LK')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="类型编码">
              {getFieldDecorator('Q=code_LK')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="类型">
              {getFieldDecorator('Q=type_LK')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">单层级</Option>
                  <Option value="1">多层级</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const {
      xaec: { data },
      loading,
      dispatch,
    } = this.props;

    const { isAdd, curItem, modalVisible } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        render(val, record, index) {
          const { current = 1, pageSize = 10 } = data.pagination;
          return <span>{(current - 1) * pageSize + (index + 1)}</span>;
        },
      },
      {
        title: '数据名称',
        dataIndex: 'desp',
        render: (text, item) => (
          <Fragment>
            <a
              onClick={() => {
                this.handleModalState(false, item);
                this.handleModalVisible(true);
              }}
            >
              {text}
            </a>
          </Fragment>
        ),
      },
      {
        title: '数据编码',
        dataIndex: 'code',
      },
      {
        title: '结构类型',
        dataIndex: 'type',
        render: type => <span>{type === '1' ? '多层级' : '单层级'}</span>,
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
      },
      {
        title: '操作',
        dataIndex: 'ck',
        width: 80,
        render: (text, row) => (
          <Fragment>
            <a
              onClick={() =>
                router.push({
                  pathname: `/other/xaec/${row.id}`,
                  state: {
                    item: row,
                  },
                })
              }
            >
              <Icon type="setting" />
            </a>
            <Divider type="vertical" />
            <Popconfirm
              title="删除该数据将会同时删除该数据类型下维护的所有数据项，确认删除吗？"
              onConfirm={() => {
                dispatch({
                  type: 'xaec/remove',
                  payload: { id: row.id },
                  callback: () => {
                    message.success('删除成功！');
                    dispatch({
                      type: 'xaec/fetch',
                    });
                  },
                });
              }}
            >
              <Icon type="delete" />
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
    const parentMethods = {
      handle: this.handle,
      handleModalVisible: this.handleModalVisible,
      isAdd,
      item: curItem,
      isShowSelect: true,
      checkCodeFunc: this.checkCodeFunc,
    };
    return (
      <PageHeaderWrapper>
        <Fragment>
          <Card bordered={false}>
            <div className={styles.tableList}>
              <div className={styles.tableListForm}>{this.renderForm()}</div>
              <div className={styles.tableListOperator}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={() => {
                    this.handleModalVisible(true);
                    this.handleModalState(true);
                  }}
                >
                  新增
                </Button>
              </div>
              <Table
                rowKey={item => item.id}
                loading={loading.effects['xaec/fecth']}
                dataSource={data.list}
                pagination={data.pagination}
                columns={columns}
                onChange={this.handleSimpleTableChange}
              />
            </div>
          </Card>
          <CreateForm {...parentMethods} modalVisible={modalVisible} />
        </Fragment>
      </PageHeaderWrapper>
    );
  }
}
export default Xaec;
