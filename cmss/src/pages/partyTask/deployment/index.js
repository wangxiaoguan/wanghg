/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-indent */
/* eslint-disable no-plusplus */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import Link from 'umi/link';
import router from 'umi/router';
import { connect } from 'dva';
import {
  Input,
  Button,
  Select,
  Form,
  Table,
  message,
  Popconfirm,
  Popover,
  // Modal,
  // Steps,
  Typography,
} from 'antd';
import MyTabs from './MyTab';
import { storage, getFlagByLevel, judgeIeBower } from '@/utils/utils';
import styles from './index.less';

const { Option } = Select;
const { Paragraph } = Typography;
const FormItem = Form.Item;
//判断是否为ie浏览
const isIe = judgeIeBower();

@Form.create()
@connect(({ partyTask, loading }) => ({
  partyTask,
  loading: loading.effects['partyTask/getTableData'],
  loadingGetUserLevel: loading.effects['partyTask/getUserLevel'],
}))
class Deployment extends Component {
  constructor(props) {
    super(props);
    this.userInfo = JSON.parse(storage.getLocal('userInfo'));
    const {
      partyTask: { isSend, upPartyId, upPartyIdIndex },
    } = props;

    this.state = {
      isSend: isSend,
      upPartyId,
      upPartyIdIndex,
      postList: [],
      currentPage: 1,
      pageSize: 10,
      params: {},
      typeList: [],
      visible: false,
      visibleDetail: false,
      reviewDetail: [],
      record: {},
    };
  }

  componentDidMount() {
    this.refresh(this.props);
  }

  componentDidUpdate(preProps) {
    const { location } = preProps;
    const { location: newLocation } = this.props;
    if (location.pathname !== newLocation.pathname) {
      this.refresh(this.props);
      this.props.form.setFieldsValue({
        keyword: '',
        typeId: 0,
        status: 1,
      });
    }
  }

  refresh = newProps => {
    const { dispatch, partyTask, location } = newProps;
    const { currentUrl } = partyTask;
    const { isSend, upPartyId } = this.state;
    const pathName = location.pathname.split('/');
    let topicId = parseInt(pathName[pathName.length - 1], 10);
    if (pathName[pathName.length - 2] === 'education') {
      topicId = 6;
    }
    const page = {
      currentPage: 1,
      pageSize: 10,
    };
    const formData1 = {
      msgId: 'GET_USER_LEVEL',
      userId: this.userInfo.id,
    };
    const formData2 = {
      msgId: 'TASK_TYPE_LIST_TX',
      topicId,
    };
    // 获取用户组织层级
    dispatch({
      type: 'partyTask/getUserLevel',
      payload: {
        text: JSON.stringify(formData1),
      },
      callBack: res => {
        if (res && res.length > 0) {
          //console.log('res职务===', res);
          // 不同任务主题，isSend和upPartyId改为默认值
          if (currentUrl !== pathName.slice(0, 5).join('/')) {
            const params = {
              isSend: false,
              upPartyId: res[0] && res[0].value,
            };
            this.setState(
              {
                postList: res,
                isSend: false,
                upPartyId: res[0].value,
                upPartyIdIndex: res[0].index,
              },
              () => {
                this.getTableData(page, params);
              }
            );
          } else {
            const params = { isSend, upPartyId };
            this.setState(
              {
                postList: res,
              },
              () => {
                this.getTableData(page, params);
              }
            );
          }
        }
      },
    });

    // 获取任务类型列表
    dispatch({
      type: 'partyTask/getTypeList',
      payload: {
        text: JSON.stringify(formData2),
      },
      callBack: resTypeList => {
        this.setState({
          typeList: resTypeList,
          currentPage: 1,
          pageSize: 10,
        });
      },
    });
  };

  tabChange = key => {
    const isSend = key === '1';
    const { currentPage, pageSize } = this.state;
    const page = { currentPage, pageSize };
    const { upPartyId } = this.state;
    const params = {
      isSend,
      upPartyId,
    };
    this.setState(
      {
        isSend,
      },
      () => {
        this.getTableData(page, params);
        setTimeout(() => {
          this.props.form.setFieldsValue({
            keyword: '',
            typeId: 0,
            status: 1,
          });
        }, 400);
      }
    );
  };

  // 职务切换
  changeOption = value => {
    if (value.split('#').length < 2) {
      return;
    }
    const upPartyId = Number(value.split('#')[0]);
    const upPartyIdIndex = Number(value.split('#')[1]);
    this.setState(
      {
        upPartyId,
        upPartyIdIndex,
      },
      () => {
        const { isSend, currentPage, pageSize } = this.state;
        const page = { currentPage, pageSize };
        const params = {
          isSend,
          upPartyId,
        };
        this.getTableData(page, params);
      }
    );
  };

  getLevelById = id => {
    const { postList } = this.state;
    const Obj = {
      level: 0,
      subLevel: 0,
    };
    for (let i = 0; i < postList.length; i++) {
      if (postList[i].value === id) {
        Obj.level = postList[i].level;
        Obj.subLevel = postList[i].subLevel;
        break;
      }
    }
    return Obj;
  };

  handleSubmit = e => {
    e.preventDefault();
    this.onSubmit();
  };

  restSubmit = () => {
    this.props.form.setFieldsValue({
      keyword: '',
      typeId: 0,
      status: 1,
    });
    this.onSubmit();
  };

  onSubmit = () => {
    const { isSend, upPartyId, currentPage, pageSize } = this.state;
    this.props.form.validateFields(['keyword', 'typeId', 'status'], (err, values) => {
      if (!err) {
        const page = { currentPage, pageSize };
        this.setState({ params: values }, () => {
          const params = values;
          params.isSend = isSend;
          params.upPartyId = upPartyId;
          this.getTableData(page, params);
        });
      }
    });
  };

  deleteTask = record => {
    const { dispatch } = this.props;
    const { location } = this.props;
    const pathName = location.pathname.split('/');
    const topicId = parseInt(pathName[pathName.length - 1], 10);
    const formData = {
      taskId: record.taskId,
      msgId: 'DELETE_TASK_TX',
      topicId,
    };
    dispatch({
      type: 'partyTask/deleteTask',
      payload: {
        text: JSON.stringify(formData),
      },
      callBack: res => {
        if (res.code === '0') {
          const { params, isSend, upPartyId, currentPage, pageSize } = this.state;
          const page = { currentPage, pageSize };
          params.isSend = isSend;
          params.upPartyId = upPartyId;
          this.getTableData(page, params);
          message.success('删除成功');
        }
      },
    });
  };

  getTableData = (page, params) => {
    const { dispatch, location } = this.props;
    const { upPartyId, isSend, upPartyIdIndex } = this.state;
    const { level } = this.getLevelById(params.upPartyId);
    const pathName = location.pathname.split('/');
    const topicId = parseInt(pathName[pathName.length - 1], 10);
    const formData = {
      upPartyId: params.upPartyId,
      msgId: 'TASK_LIST',
      userId: this.userInfo.id,
      topicId,
      level,
      sendFlag: params.isSend ? 1 : 0,
      index: page.currentPage,
      pageSize: page.pageSize,
      keyword: '',
      status: '1',
    };

    if (params.keyword) {
      formData.keyword = params.keyword;
    }
    if (params.typeId) {
      formData.typeId = params.typeId;
    }
    if (params.status) {
      formData.status = params.status;
    }
    // console.log('params', params);
    if (params.reviewStatus !== undefined && params.reviewStatus !== 3) {
      formData.reviewStatus = params.reviewStatus;
    }
    this.setState({
      currentPage: page.currentPage,
    });
    dispatch({
      type: 'partyTask/getTableData',
      payload: {
        text: JSON.stringify(formData),
      },
    });
    dispatch({
      type: 'partyTask/setUpPartyId',
      payload: {
        upPartyId,
        isSend,
        upPartyIdIndex,
        currentUrl: pathName.slice(0, 5).join('/'),
      },
    });
  };

  createNew = () => {
    const { match } = this.props;
    router.push(`${match.url}/createNew`);
  };

  getEditNode = (tag, arrKeys, record) => {
    // let { isShowEdit } = record;
    // if (arrKeys[4] !== '99') {
    //   isShowEdit = true;
    // }
    const url = arrKeys.slice(0, 5).join('/');
    if (tag) {
      // if (isShowEdit) {
      return (
        <Link to={`${url}/edit?taskId=${record.taskId}`} style={{ marginRight: 5 }}>
          编辑
        </Link>
      );
      // }
      // return <span style={{ color: '#00000040', cursor: 'context-menu' }}>编辑</span>;
    }
    return null;
  };

  getFlag = () => {
    const { postList, upPartyId } = this.state;
    const { location } = this.props;
    const type = location.pathname.split('/')[4];
    let obj = {};
    for (let i = 0; i < postList.length; i += 1) {
      if (postList[i].value === upPartyId) {
        obj = postList[i];
      }
    }
    return getFlagByLevel(obj, type);
  };

  onPageChange = (newpage, size) => {
    const { isSend, upPartyId, params } = this.state;
    const page = {
      currentPage: newpage,
      pageSize: size,
    };
    params.isSend = isSend;
    params.upPartyId = upPartyId;
    this.setState(
      {
        currentPage: newpage,
        pageSize: size,
      },
      () => {
        this.getTableData(page, params);
      }
    );
  };

  getTabPanl = () => {
    const { form, partyTask, loading, location, match } = this.props;
    const { taskList, total, tableList } = partyTask;
    const { getFieldDecorator } = form;
    const { typeList, upPartyId, currentPage, pageSize } = this.state;
    const arrKeys = location.pathname.split('/');
    // console.log('isIeBower=',isIe)
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    const formItemLayout1 = {
      labelCol: { span: 9 },
      wrapperCol: { span: 15 },
    };

    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        width: 50,
      },
      {
        title: '任务名称',
        dataIndex: 'taskName',
        key: 'taskName',
        align: 'center',
        width: 100,
        render: text => {
          return !isIe ? (
            <Popover content={text}>
              <Paragraph ellipsis={{ rows: 2, expandable: false }}>{text}</Paragraph>
            </Popover>
          ) : (
            <Paragraph ellipsis={{ rows: 2, expandable: false }}>{text}</Paragraph>
          );
        },
      },
      {
        title: '任务类型',
        dataIndex: 'taskType',
        key: 'taskType',
        align: 'center',
        width: 70,
      },
      {
        title: '发起人',
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
        width: 65,
      },
      {
        title: '发起人党组织',
        dataIndex: 'upPartyName',
        key: 'upPartyName',
        align: 'center',
        width: 200,
        render: text => {
          return !isIe ? (
            <Popover content={text}>
              <Paragraph ellipsis={{ rows: 2, expandable: false }}>{text}</Paragraph>
            </Popover>
          ) : (
            <Paragraph ellipsis={{ rows: 2, expandable: false }}>{text}</Paragraph>
          );
        },
      },
      {
        title: '任务开始时间',
        dataIndex: 'startDate',
        key: 'startDate',
        align: 'center',
        width: 100,
      },
      {
        title: '任务截止时间',
        dataIndex: 'endDate',
        key: 'endDate',
        align: 'center',
        width: 100,
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        key: 'createDate',
        align: 'center',
        width: 90,
      },
      {
        title: '任务状态',
        dataIndex: 'statusDesp',
        key: 'statusDesp',
        align: 'center',
        width: 70,
        render: text => {
          const color = text === '进行中' ? '#1484E3' : '#333';
          return <span style={{ color }}>{text}</span>;
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        width: 90,
        fixed: 'right',
        // eslint-disable-next-line arrow-body-style
        render: (text, record) => {
          const { isSend } = this.state;
          const tag = isSend && this.userInfo.id === `${record.userId}`;
          return (
            <div className="singlepage-table-operation">
              <Link
                to={`${match.url}/detail?taskId=${record.taskId}&upPartyId=${upPartyId}&isSend=${
                  isSend ? 1 : 0
                }`}
                style={{ marginRight: 5 }}
              >
                详情
              </Link>
              {this.getEditNode(tag, arrKeys, record)}
              {tag && (
                <Popconfirm
                  title="是否确认删除"
                  okText="确认"
                  cancelText="取消"
                  onConfirm={() => this.deleteTask(record)}
                >
                  <a style={{ color: '#D60D0D', display: 'block' }} href="">
                    删除
                  </a>
                </Popconfirm>
              )}
            </div>
          );
        },
      },
    ];

    const pagination = {
      total,
      showTotal: totalNum =>
        `共 ${totalNum} 条记录 第 ${currentPage} / ${Math.ceil(totalNum / pageSize)} 页`,
      pageSize,
      showSizeChanger: true,
      onShowSizeChange: this.onPageChange,
      current: currentPage,
      onChange: this.onPageChange,
    };

    const createNewFlag = this.getFlag();
    return (
      <div className={styles.tabStyle}>
        <div className={styles.selectContent}>
          <Form
            layout="inline"
            onSubmit={this.handleSubmit}
            style={{ width: '100%', display: 'inline-block', paddingLeft: 7 }}
          >
            <FormItem {...formItemLayout1} label="任务名称" style={{ width: 240 }}>
              {getFieldDecorator('keyword', {
                initialValue: '',
              })(<Input placeholder="请输入任务关键字" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="任务类型" style={{ width: 270 }}>
              {getFieldDecorator('typeId', {
                initialValue: 0,
              })(
                <Select>
                  <Option key={0} value={0}>
                    全部
                  </Option>
                  {typeList.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="任务状态" style={{ width: 270 }}>
              {getFieldDecorator('status', {
                initialValue: 1,
              })(
                <Select>
                  {taskList.taskStatus.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Form>
          <div className={styles.searchContent} style={{ left: 20, top: 52 }}>
            <div className="primary_btn" style={{ marginLeft: 20 }}>
              <Button onClick={this.handleSubmit} style={{ width: 77 }}>
                搜索
              </Button>
            </div>
            <div className="global_btn" style={{ marginLeft: 15, marginTop: 15 }}>
              <Button onClick={this.restSubmit} style={{ width: 77 }}>
                重置
              </Button>
            </div>
          </div>
        </div>
        <div className="tableContent">
          <div
            className={createNewFlag ? styles['global-btn-disable'] : 'primary_btn'}
            style={{ marginBottom: 10, marginTop: 10, marginLeft: 20 }}
          >
            <Button icon="plus" onClick={() => this.createNew()} disabled={createNewFlag}>
              新建
            </Button>
          </div>
          <Table
            rowKey="index"
            bordered
            loading={loading}
            pagination={pagination}
            columns={columns}
            style={{ width: 815 }}
            className={styles.tableStyle}
            dataSource={tableList}
            scroll={{ x: 930 }}
          />
        </div>
      </div>
    );
  };

  render() {
    const { postList, upPartyId, upPartyIdIndex, isSend } = this.state;
    const { loadingGetUserLevel } = this.props;
    return (
      <div className={styles.main}>
        <MyTabs
          getTabPanl={this.getTabPanl}
          upPartyId={upPartyId}
          postList={postList}
          isSend={isSend}
          loadingGetUserLevel={loadingGetUserLevel}
          changeOption={this.changeOption}
          upPartyIdIndex={upPartyIdIndex}
          tabChange={this.tabChange}
          {...this.props}
        />
      </div>
    );
  }
}
export default Deployment;
