import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Popover,
  Typography,
  Row,
  Col,
  Button,
  Table,
  message,
  Select,
  Tooltip,
  Spin,
  Icon,
  Popconfirm,
} from 'antd';
import BreadCrumbDetail from '@/components/BreadCrumbDetail';
import { storage } from '@/utils/utils';
import MyFont from '@/utils/myIcon';
import router from 'umi/router';
import commenConfig from '../../../config/commenConfig';
import styles from './CompletionRate.less';

const FormItem = Form.Item;
const { Paragraph } = Typography;
const SelectOption = Select.Option;

@connect(({ partyTask, loading }) => ({
  partyTask,
  loading: loading.effects['partyTask/getTaskComplete'],
  loadingWarn: loading.effects['partyTask/getTaskComplete'],
}))
@Form.create()
class CompletionRate extends Component {
  constructor(props) {
    super(props);
    this.userInfo = JSON.parse(storage.getLocal('userInfo'));
    this.state = {
      tableSumList: [],
      tableDetailList: [],
      partyList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchInfo: {},
      upPartyName: '',
      warnFlag: false, // 一键提醒功能
      exportLoading: false,
      taskId: 0,
    };
  }

  componentDidMount() {
    // console.log('9988');
    const { currentPage, pageSize } = this.state;
    this.getTaskDetail({
      page: currentPage - 1,
      pageSize: pageSize,
    });
    this.getWarnFlag(this.props);
  }

  //
  componentWillReceiveProps(nextProps) {
    const {
      location: { query },
    } = nextProps;
    const { taskId, currentPage, pageSize } = this.state;
    if (Number(taskId) !== 0 && Number(taskId) !== Number(query.taskId)) {
      this.setState({ taskId: query.taskId }, () => {
        this.getTaskDetail({
          page: currentPage - 1,
          pageSize: pageSize,
        });
        this.getWarnFlag(nextProps);
      });
    }
  }

  getTaskDetail = (searchParams, nextprops) => {
    const { dispatch } = this.props;
    let {
      match,
      location: { query },
    } = this.props;
    if (nextprops) {
      match = nextprops.match;
      query = nextprops.location.query;
    }
    const { listId: type } = match.params;
    const newParams = JSON.parse(JSON.stringify(searchParams));
    if (searchParams.isComplete === 3) {
      newParams.isComplete = false;
    } else if (searchParams.isComplete === 2) {
      newParams.isComplete = true;
    } else {
      delete newParams.isComplete;
    }
    if (searchParams.userNo !== undefined && searchParams.userNo.trim() === '') {
      delete newParams.userNo;
    }
    const requestDetail = {
      msgId: 'GET_IMP_TASK',
      topicId: type,
      taskId: query.taskId,
      userId: this.userInfo.id,
      ...newParams,
    };
    this.setState({ taskId: query.taskId });
    dispatch({
      type: 'partyTask/getTaskComplete',
      payload: {
        text: JSON.stringify(requestDetail),
      },
      callback: res => {
        // console.log('09998==', res);
        if (res.topShow && JSON.stringify(res.topShow) !== '{}') {
          this.setState({
            tableSumList: [
              {
                complete: res.topShow.memFinishCount,
                all: res.topShow.allMemCount,
                percentage: res.topShow.memPercentage,
                completeOrg: res.topShow.partyFinishCount,
                allOrg: res.topShow.allPartyCount,
                percentageOrg: res.topShow.partyPercentage,
              },
            ],
          });
        } else {
          this.setState({ tableSumList: [] });
        }
        this.setState({
          tableDetailList: res.partyTaskList && res.partyTaskList.length ? res.partyTaskList : [],
          partyList: res.downParties && res.downParties.length ? res.downParties : [],
          total: res.totleNum,
        });
      },
    });
  };

  handleSearch = e => {
    e.preventDefault();
    const { pageSize } = this.state;
    const { form } = this.props;
    form.validateFields((err, values) => {
      this.setState({
        searchInfo: values,
        currentPage: 1,
      });
      this.getTaskDetail({
        page: 0,
        pageSize: pageSize,
        ...values,
      });
    });
  };

  handleWarn = nextprops => {
    let {
      dispatch,
      location: {
        query: { taskId },
      },
    } = this.props;
    if (nextprops) {
      taskId = nextprops.location.query.taskId;
    }
    const request = {
      taskId: taskId,
      msgId: 'TASK_REMIND_TX',
    };
    dispatch({
      type: 'partyTask/remindTask',
      payload: {
        text: JSON.stringify(request),
      },
      callback: res => {
        if (res.code === '0') {
          message.success('提醒成功');
        } else {
          message.warning(res.message);
        }
      },
    });
  };

  getWarnFlag = nextProps => {
    const {
      match,
      location: {
        query: { taskId, isSend, upPartyId },
      },
      dispatch,
    } = nextProps;
    const { listId } = match.params;
    const requestDetail = {
      taskId: taskId,
      msgId: 'TASK_DETAIL_TX',
      userId: this.userInfo.id,
      topicId: listId,
      isSend: isSend === '1',
      partyId: upPartyId === '' ? this.userInfo.partyid : upPartyId,
    };
    dispatch({
      type: 'partyTask/getTaskDetail',
      payload: {
        text: JSON.stringify(requestDetail),
      },
      callback: res => {
        const taskDetail = res.task_tx;
        this.setState({
          upPartyName: taskDetail.upPartyName,
        });
        if (
          taskDetail.role === 0 &&
          isSend &&
          taskDetail.status === 2 &&
          taskDetail.timeStatus !== 1
        ) {
          this.setState({
            warnFlag: true,
          });
        } else {
          this.setState({
            warnFlag: false,
          });
        }
      },
    });
  };

  exportExcel = () => {
    const {
      dispatch,
      // match,
      form,
      location: {
        query: { taskId, topicId },
      },
    } = this.props;
    const { currentPage } = this.state;
    const { getFieldValue } = form;
    // const { listId } = match.params;
    this.setState({ exportLoading: true });
    const request = {
      taskId,
      keyword: '',
      page: currentPage,
      userId: this.userInfo.id,
      topicId: Number(topicId),
      msgId: 'EXPORT_IMP_TASK',
      pageSize: 20,
    };
    if (getFieldValue('partyId')) {
      request.partyId = getFieldValue('partyId');
    }
    if (getFieldValue('isComplete') === 2) {
      request.isComplete = true;
    } else if (getFieldValue('isComplete') === 3) {
      request.isComplete = false;
    }
    if (getFieldValue('userName')) {
      request.userName = getFieldValue('userName');
    }
    if (getFieldValue('userNo') && getFieldValue('userNo').trim() !== '') {
      request.userNo = getFieldValue('userNo');
    }
    dispatch({
      type: 'partyTask/exportExcel',
      payload: {
        text: JSON.stringify(request),
      },
      callback: res => {
        console.log(res);
        this.setState({ exportLoading: false });
        if (res.code === '0' && res.resultMap && res.resultMap.fileUrl !== '') {
          message.success('导出成功');
          const $a = document.createElement('a');
          $a.href = `${commenConfig.downPath}/${res.resultMap.fileUrl}`;
          $a.download = res.resultMap.fileName;
          if (navigator.userAgent.indexOf('Firefox') > 0) {
            // 火狐浏览器
            $a.dispatchEvent(
              new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
            );
          } else {
            // 其他浏览器
            $a.click();
          }
        } else {
          message.error(res.message);
        }
      },
    });
  };

  getForItemLayout = (x, y) => ({
    labelCol: {
      span: x,
    },
    wrapperCol: {
      span: y,
    },
  });

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState(
      {
        searchInfo: {},
      },
      () => {
        this.getTaskDetail({
          page: 0,
          pageSize: 10,
        });
      }
    );
  };

  turnDetail = record => {
    const {
      location: { query },
      match: { url },
    } = this.props;
    let arr = url.split('/');
    if (arr.length > 4) {
      arr[4] = record.downTaskType;
    }
    //console.log('arr==', record);
    const newQuery = JSON.parse(JSON.stringify(query));
    newQuery.taskId = record.downTaskId;
    newQuery.upPartyId = record.partyId;
    newQuery.isSend = record.downTaskUserId === this.userInfo.id ? '1' : '0';
    router.push({ pathname: arr.join('/'), query: newQuery });
  };

  render() {
    const { match, loading, form, loadingWarn } = this.props;
    const {
      tableSumList,
      exportLoading,
      partyList,
      warnFlag,
      pageSize,
      total,
      upPartyName,
      tableDetailList,
      searchInfo,
      currentPage,
    } = this.state;
    const { listId: type, org } = match.params;
    const { getFieldDecorator } = form;
    //重要工作部署总体概括表头
    const columnIMPSum = [
      {
        title: '完成组织数',
        dataIndex: 'index',
        key: '1',
        align: 'center',
        render: (text, record) => `${record.completeOrg}/${record.allOrg}`,
      },
      {
        title: '组织完成率',
        dataIndex: 'index',
        key: '2',
        align: 'center',
        render: (text, record) => `${Number(record.percentageOrg).toFixed(2)}%`,
      },
      {
        title: '参与党员数',
        dataIndex: 'index',
        key: '3',
        align: 'center',
        render: (text, record) => `${record.complete}/${record.all}`,
      },
      {
        title: '党员参与率',
        dataIndex: 'index',
        key: '4',
        align: 'center',
        render: (text, record) => `${Number(record.percentage).toFixed(2)}%`,
      },
    ];

    // 非重要工作部署总体概括表头
    const columnSum = [
      {
        title: '参与党员数',
        dataIndex: 'index',
        key: '5',
        align: 'center',
        render: (text, record) => `${record.complete}/${record.all}`,
      },
      {
        title: '党员参与率',
        dataIndex: 'index',
        key: '6',
        align: 'center',
        render: (text, record) => `${Number(record.percentage).toFixed(2)}%`,
      },
    ];

    const code = {
      title: '序号',
      dataIndex: 'code',
      key: 'code',
      align: 'center',
      render: (text, record, index) => `${index + 1}`,
    };

    const isComplete = {
      title: '完成状态',
      dataIndex: 'isComplete',
      key: 'isComplete',
      align: 'center',
      render: (text, record) =>
        record.isComplete === false ? (
          <div style={{ color: '#F13300' }}>未完成 </div>
        ) : (
            <div style={{ color: '#14A700' }}>完成</div>
          ),
    };

    const columnDetail = [
      code,
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        align: 'center',
      },
      {
        title: 'OA账号',
        dataIndex: 'userNo',
        key: 'userNo',
        align: 'center',
      },
      isComplete,
    ];

    const downSubPartiesColumn = [
      code,
      {
        title: '党组织名称',
        dataIndex: 'fullName',
        width: '40%',
        key: 'fullName',
        align: 'center',
        render: text => (
          <Popover content={text}>
            <Paragraph ellipsis={{ rows: 2, expandable: false }}>{text}</Paragraph>
          </Popover>
        ),
      },
      isComplete,
      {
        title: '参与党员数',
        dataIndex: 'allMemCount',
        key: 'allMemCount',
        align: 'center',
        render: (text, record) => `${record.memFinishCount}/${record.allMemCount}`,
      },
      {
        title: '党员参与率',
        dataIndex: 'memPercentage',
        key: 'memPercentage',
        align: 'center',
        render: (text, record) => `${Number(record.memPercentage).toFixed(2)}%`,
      },
    ];

    const downPartiesColumn = [
      ...downSubPartiesColumn,
      {
        title: '操作',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        render: (text, record) =>
          record.isComplete ? (
            <span
              style={{ color: '#40a9ff', cursor: 'pointer' }}
              onClick={() => this.turnDetail(record)}
            >
              详情
            </span>
          ) : (
              <span style={{ color: '#c6c4c4', cursor: 'context-menu' }}>详情</span>
            ),
      },
    ];

    const pagination = {
      total,
      showTotal: totalNum =>
        `共 ${totalNum} 条记录 第 ${currentPage} / ${Math.ceil(totalNum / pageSize)} 页`,
      pageSize: 10,
      defaultCurrent: 1,
      current: currentPage,
      onChange: (current, page) => {
        this.setState({
          currentPage: current,
          pageSize: page,
        });
        this.getTaskDetail({
          page: current - 1,
          pageSize: page,
          ...searchInfo,
        });
      },
    };

    const antIcon = <Icon type="loading" style={{ fontSize: 20, color: '#d60d0d' }} spin />;

    // console.log('tableSumList=', tableSumList);
    return (
      <div className={styles.InfromationPage}>
        <BreadCrumbDetail {...this.props} type="党建任务" />
        <div value="" className={styles.partyBread}>
          <span />
          {upPartyName}
        </div>
        <div className={styles.cpmpletionTitle}>
          <span />
          总体概况
        </div>
        <Table
          columns={type === '99' ? columnIMPSum : columnSum}
          dataSource={tableSumList}
          className={styles.sumTable}
          style={{ width: type === '99' ? '100%' : '50%' }}
          pagination={false}
          loading={loading}
          bordered
        />
        <div className={styles.cpmpletionTitle}>
          <span />
          详细情况
        </div>
        <div className={styles.fliterAround}>
          <Form onSubmit={this.handleSearch} layout="inline">
            <Row>
              <Col span={9}>
                <FormItem
                  {...this.getForItemLayout(8, 15)}
                  label={type === '99' ? '党组织名称' : '员工姓名'}
                  style={{ width: 300 }}
                >
                  {getFieldDecorator(type === '99' ? 'partyId' : 'userName', {
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(
                    type === '99' ? (
                      <Select>
                        {partyList &&
                          partyList.map(item => (
                            <SelectOption key={item.id} value={item.id}>
                              <Tooltip placement="top" title={item.name}>
                                {item.name}
                              </Tooltip>
                            </SelectOption>
                          ))}
                      </Select>
                    ) : (
                        <Input placeholder="请输入" />
                      )
                  )}
                </FormItem>
              </Col>
              <Col span={7}>
                <FormItem {...this.getForItemLayout(8, 16)} label="完成状态" style={{ width: 240 }}>
                  {getFieldDecorator('isComplete', {
                    initialValue: 1,
                    rules: [
                      {
                        required: false,
                      },
                    ],
                  })(
                    <Select>
                      <SelectOption value={1}>全部</SelectOption>
                      <SelectOption value={2}>完成</SelectOption>
                      <SelectOption value={3}>未完成</SelectOption>
                    </Select>
                  )}
                </FormItem>
              </Col>
              {type !== '99' ? (
                <Col span={8}>
                  <FormItem {...this.getForItemLayout(7, 16)} label="OA账号" style={{ width: 240 }}>
                    {getFieldDecorator('userNo', {
                      rules: [
                        {
                          required: false,
                          message: 'Input something!',
                        },
                      ],
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
              ) : null}
              <Col span={8}>
                <div className={styles.buttonSure} style={{ marginTop: type !== '99' ? 18 : 3 }}>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                </div>
                <div className={styles.buttonReset}>
                  <Button onClick={this.handleReset}>重置</Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <Row>
          <Col span={4}>
            <Spin spinning={exportLoading} indicator={exportLoading ? antIcon : null}>
              <div className={styles.exportExcel} onClick={this.exportExcel}>
                {/* <MyFont type={'icon-daochu-copy'} style={{ fontSize: 20, marginRight: 5 }} />
                <span>导出EXCEL</span> */}
              </div>
            </Spin>
          </Col>
          {warnFlag && (
            <Col span={4}>
              <Popconfirm
                title="是否确认提醒"
                okText="确认"
                cancelText="取消"
                onConfirm={() => this.handleWarn()}
              >
                <div className={styles.buttonSure} style={{ marginTop: 0, marginLeft: 0 }}>
                  <Button style={{ textAlign: 'left' }} type="primary" loading={loadingWarn}>
                    一键提醒
                  </Button>
                </div>
              </Popconfirm>
            </Col>
          )}
        </Row>
        <Table
          columns={
            type === '99'
              ? org === undefined
                ? downPartiesColumn
                : downSubPartiesColumn
              : columnDetail
          }
          loading={loading}
          style={{ marginTop: 10 }}
          dataSource={tableDetailList}
          pagination={pagination}
          bordered
        />
      </div>
    );
  }
}
export default CompletionRate;
