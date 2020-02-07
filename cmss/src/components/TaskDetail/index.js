/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import {
  Form,
  Modal,
  Spin,
  Pagination,
  Divider,
  Input,
  Row,
  Col,
  Button,
  Avatar,
  message,
  Radio,
  Rate,
  Checkbox,
  Typography,
  Icon,
} from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
// import Link from 'umi/link';
// import * as QrCode from 'qrcode.react';
import TaskReceipt from './taskReceipt';
import BreadCrumbDetail from '@/components/BreadCrumbDetail';
import ReceitFileList from '@/components/ReceitFileList';
import { storage, debounce } from '@/utils/utils';
// import FileList from '@/components/FileList';
import commenConfig from '../../../config/commenConfig';
import styles from './index.less';

// const { TabPane } = Tabs;
// const QRCode = require('qrcode.react');
const { Paragraph } = Typography;
const FormItem = Form.Item;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

let webUrl = '';

@connect(({ partyTask }) => ({
  partyTask,
}))
@Form.create()
class TaskDetail extends Component {
  constructor(props) {
    super(props);
    this.userInfo = JSON.parse(storage.getLocal('userInfo'));
    this.state = {
      taskDetail: {},
      isTransimit: true, //是否可以转发任务
      current: 1,
      receiptList: [],
      total: 0,
      visible: false,
      addvice: '',
      itemParam: {},
      upTaskList: [],
      loading: false,
      estimateFlag: false,
      completeLoading: false,
      estimateValue: 0,
      fileList: [],
      completeVisible: false,
      taskId: 0,
    };
  }

  componentDidMount() {
    this.refresh();
  }

  // 任务详情跳转到关联任务的详情，需要更新
  componentWillReceiveProps(nextProps) {
    const {
      location: { query },
    } = nextProps;
    const { taskId } = this.state;
    // console.log(taskId, query.taskId);
    if (Number(taskId) !== 0 && Number(taskId) !== Number(query.taskId)) {
      this.refresh(nextProps);
      // this.getIsTransmit();
    }
  }

  componentDidUpdate() {
    const { match, dispatch, location } = this.props;
    const { taskId: id, upPartyId: partyId, isSend: send } = location.query;
    const { listId: type } = match.params;
    const requestDetail = {
      taskId: id,
      msgId: 'TASK_DETAIL_TX',
      userId: this.userInfo.id,
      topicId: type,
      isSend: send === '1',
      partyId,
    };
    webUrl === match.url ||
      dispatch({
        type: 'partyTask/getTaskDetail',
        payload: {
          text: JSON.stringify(requestDetail),
        },
        callback: res => {
          const taskDetail = res.task_tx;
          const upTaskList = taskDetail.upTasks
            ? taskDetail.upTasks.map(item => ({
              label: item.upTaskName,
              value: item.upTaskId,
              disabled: true,
            }))
            : [];
          this.setState({
            loading: false,
            taskDetail,
            upTaskList,
            fileList: taskDetail.attachCount > 0 ? res.attachList : [],
          });
          this.getComment(1, resultMap => {
            this.setState({
              receiptList: resultMap.receiptList,
              total: resultMap.total,
              upTaskList,
            });
          });
        },
      });
    webUrl = webUrl === match.url ? webUrl : match.url;
    // this.getIsTransmit();
  }

  tranEstimate = (param, type) => {
    if (type === 'num') {
      switch (param) {
        case 1:
          return '差';
        case 2:
          return '一般';
        case 3:
          return '良好';
        case 4:
          return '优秀';
        case 5:
          return '杰出';
        default:
          return '';
      }
    } else {
      switch (param) {
        case '差':
          return 1;
        case '一般':
          return 2;
        case '良好':
          return 3;
        case '优秀':
          return 4;
        case '杰出':
          return 5;
        default:
          return 0;
      }
    }
  };

  refresh = newProps => {
    const { dispatch, match } = this.props;
    let { location } = this.props;
    if (newProps) {
      location = newProps.location;
    }
    const { taskId: id, upPartyId: partyId, isSend: send } = location.query;
    const { listId: type } = match.params;
    // console.log(type, id, send, partyId);
    webUrl = match.url;
    this.setState({ loading: true, taskId: id });
    const requestDetail = {
      taskId: id,
      msgId: 'TASK_DETAIL_TX',
      userId: this.userInfo.id,
      topicId: type,
      isSend: send === '1',
      partyId,
    };
    dispatch({
      type: 'partyTask/getTaskDetail',
      payload: {
        text: JSON.stringify(requestDetail),
      },
      callback: res => {
        const taskDetail = res.task_tx;
        // console.log('taskDetail=', taskDetail);
        if (taskDetail.isDelete === 1) {
          message.warning('该任务已被删除！');
          router.goBack();
          return;
        }
        const upTaskList = taskDetail.upTasks
          ? taskDetail.upTasks.map(item => ({
            label: item.upTaskName,
            value: item.upTaskId,
            disabled: true,
          }))
          : [];
        this.setState({
          loading: false,
          taskDetail,
          upTaskList,
          fileList: taskDetail.attachCount > 0 ? res.attachList : [],
        },()=>{
          this.getIsTransmit()
        });
        this.getComment(1, resultMap => {
          this.setState({
            receiptList: resultMap.receiptList,
            total: resultMap.total,
            upTaskList,
          });
        });
      },
    });
  };

  getComment = (page, callBack) => {
    const { dispatch, location } = this.props;
    const { match } = this.props;
    const { taskId: id, isSend: send } = location.query;
    const { listId: type } = match.params;
    const fomData = {
      userId: this.userInfo.id,
      msgId: 'WEB_RECEIPT_LIST_TX',
      taskId: id,
      index: (page - 1) * 5,
      pageSize: 5,
      topicId: type,
      isSend: send === '1',
    };
    dispatch({
      type: 'partyTask/getReceipt',
      payload: {
        text: JSON.stringify(fomData),
      },
      callBack,
    });
  };

  getPathByUrl = (srcStr, numIndex) => {
    const arr = srcStr.split('/');
    const newPath = arr.slice(0, numIndex);
    return newPath.join('/');
  };

  complete = () => {
    const { match, dispatch, location } = this.props;
    const { taskDetail } = this.state;
    const { taskId: id } = location.query;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    if (taskDetail.isNeedReceipt) {
      router.push(`${this.getPathByUrl(match.url, 2)}/receipt`);
    } else {
      this.setState({ completeLoading: true });
      const taskInfoContent = {
        content: '我已完成',
        msgId: 'TASK_RECEIPT_TX',
        taskId: id,
        userId: userInfo.id,
        isSign: false,
      };
      dispatch({
        type: 'partyTask/sendReceipt',
        payload: { text: JSON.stringify(taskInfoContent) },
        callBack: () => {
          this.setState({ completeLoading: false });
          // window.location.reload();
          this.refresh();
        },
      });
    }
  };

  turnCompletionRate = () => {
    const {
      match,
      location: { query },
    } = this.props;
    let param = '?';
    for (let k in query) {
      param = `${param}${k}=${query[k]}&`;
    }
    const { taskDetail } = this.state;
    param = param.slice(0, param.length - 1);
    // console.log(query, param);
    router.push(`${match.url}/completionRate${param}&topicId=${taskDetail.topicId}`);
  };

  getForItemLayout = (x, y) => ({
    labelCol: {
      span: x,
    },
    wrapperCol: {
      span: y,
    },
  });

  back = item => {
    this.setState({ visible: true, itemParam: item, addvice: '' });
  };

  cancelModal = () => {
    this.setState({ visible: false, estimateFlag: false, completeVisible: false });
  };

  complete = () => {
    const {
      dispatch,
      location: { query },
    } = this.props;
    const { taskDetail } = this.state;
    if (taskDetail.isNeedReceipt) {
      this.setState({
        completeVisible: true,
      });
      //router.push(`${this.getPathByUrl(match.url, 4)}/receipt`);
    } else {
      this.setState({ completeLoading: true });
      const taskInfoContent = {
        content: '我已完成',
        msgId: 'TASK_RECEIPT_TX',
        taskId: query.taskId,
        userId: this.userInfo.id,
        isSign: false,
      };
      dispatch({
        type: 'partyTask/sendReceipt',
        payload: { text: JSON.stringify(taskInfoContent) },
        callBack: () => {
          this.setState({ completeLoading: false });
          // window.location.reload();
          this.refresh();
        },
      });
    }
  };

  handleOk = () => {
    const { dispatch } = this.props;
    const { addvice, current, itemParam } = this.state;
    if (addvice.trim() === '') {
      message.warning('请填写退回原因！');
      return;
    }
    const fomData = {
      content: addvice,
      msgId: 'RETURN_RECEIPT_TX',
      replyId: itemParam.replyId,
    };
    dispatch({
      type: 'partyTask/returnReceipt',
      payload: {
        text: JSON.stringify(fomData),
      },
      callBack: res => {
        if (res.code === '1') {
          message.warning('任务已经过期');
        } else if (res.code === '0') {
          message.success('退回成功');
          this.getComment(current, resultMap => {
            this.setState({
              receiptList: resultMap.receiptList,
              total: resultMap.total,
              current,
            });
          });
        }
        this.setState({ visible: false });
      },
    });
  };

  handleOkEstimate = () => {
    const { dispatch } = this.props;
    const { estimateValue, itemParam, current } = this.state;
    if (estimateValue === 0) {
      message.warning('请评价此回执！');
    }
    const content = this.tranEstimate(estimateValue, 'num');
    const fomData = {
      content,
      msgId: 'GRADE_RECEIPT_TX',
      replyId: itemParam.replyId,
    };
    dispatch({
      type: 'partyTask/estimate',
      payload: {
        text: JSON.stringify(fomData),
      },
      callBack: res => {
        if (res.code === '0') {
          this.getComment(current, resultMap => {
            this.setState({
              receiptList: resultMap.receiptList,
              total: resultMap.total,
              current,
            });
          });
        }
        this.setState({ estimateFlag: false });
      },
    });
  };

  onchangRadio = e => {
    this.setState({ estimateValue: e.target.value });
  };

  changeAddvice = e => {
    this.setState({ addvice: e.target.value });
  };

  estimate = item => {
    this.setState({ estimateFlag: true, itemParam: item });
  };

  getEsimate = item => {
    const desc = ['1星', '2星', '3星', '4星', '5星'];
    const { taskDetail } = this.state;
    if (item.level && item.level !== '') {
      const value = this.tranEstimate(item.level, 'string');
      return (
        <div className={styles.praice}>
          <Rate tooltips={desc} defaultValue={value} disabled />
          {value ? <span className="ant-rate-text">{desc[value - 1]}</span> : ''}
        </div>
      );
    }
    if (item.returnReason === undefined) {
      return taskDetail.role === 0 ? (
        <div className={styles.make}>
          <div className={styles.cancel} onClick={() => this.back(item)} />
          <span onClick={() => this.back(item)}>退回重做</span>
          <Divider type="vertical" />
          <div className={styles.good} onClick={() => this.estimate(item)} />
          <div className={styles.estimate} onClick={() => this.estimate(item)}>
            评价
          </div>
        </div>
      ) : null;
    }
    return <div className={styles.return}>已退回</div>;
  };

  getAttach = attachs => {
    const values = [];
    for (let i = 0; i < attachs.length; i += 1) {
      const param = {
        fileName: attachs[i].newsActivity.fileName,
        url: attachs[i].newsActivity.fileUrl,
        uid: attachs[i].attachId,
      };
      values.push(param);
    }
    return (
      <div className={styles.attachList}>
        <ReceitFileList value={values} {...this.props} />
      </div>
    );
  };

  getReceipt = item => (
    <div className={styles.commentItem}>
      <Avatar
        size="36px"
        style={{
          backgroundColor: '#3699ff',
          color: '#fff',
          verticalAlign: 'middle',
        }}
      >
        {item.userName.length >= 2 ? item.userName.slice(-2) : item.userName}
      </Avatar>
      <div className={styles.comment}>
        <div className={styles.name}>{item.userName}</div>
        {this.getEsimate(item)}
        <div className={styles.main}>{item.replyContent}</div>
        {item.attachCount !== 0 && this.getAttach(item.attachs)}
        {item.returnReason && item.returnReason !== '' ? (
          <div className={styles.returnresean}>退回原因：{item.returnReason}</div>
        ) : null}
        <div className={styles.time}>{item.replayDate}</div>
      </div>
      <Divider dashed />
    </div>
  );

  onChange = page => {
    this.getComment(page, resultMap => {
      this.setState({
        receiptList: resultMap.receiptList,
        total: resultMap.total,
        current: page,
      });
    });
  };

  showTotal = total => {
    const { current } = this.state;
    return `共 ${total} 条记录 ${' '}第${current}/${Math.ceil(total / 5)}页`;
  };

  transmitTask = () => {
    const { match, dispatch } = this.props;
    const { taskDetail, fileList } = this.state;
    // console.log('9988转发', `${this.getPathByUrl(match.url, 5)}/createNew`, taskDetail);
    dispatch({
      type: 'partyTask/setUpPartyId',
      payload: {
        tansmitDetail: taskDetail,
        tansmitAttachList: fileList,
      },
    });
    router.push(`${this.getPathByUrl(match.url, 5)}/createNew`);
  };

  // 判断是否可以转发
  getIsTransmit = () => {
    const { partyTask, dispatch } = this.props;
    const { postInfo, upPartyId } = partyTask;
    const { taskDetail } = this.state;
    const { memReceiverList = [], role } = taskDetail;

    console.log('====',taskDetail);
    console.log('====',this.state);
    console.log(role);

    // 增加一个role字段，标识该任务的角色 0发起者 1观察者 2接受者 3无关者
    if (role !== 2) {
      this.setState({ isTransimit: false });
      return;
    }

    if (upPartyId !== '') {
      // console.log(postInfo, upPartyId);
      for (let i = 0; i < postInfo.length; i += 1) {
        if (upPartyId === postInfo[i].partyId) {
          if (postInfo[i].level === 3) {
            this.setState({ isTransimit: false });
            return;
          }
        }
      }
    } else {
      const formData1 = {
        msgId: 'GET_USER_LEVEL',
        userId: this.userInfo.id,
      };
      // 获取用户组织层级
      dispatch({
        type: 'partyTask/getUserLevel',
        payload: {
          text: JSON.stringify(formData1),
        },
        callBack: res => {
          // console.log('默认最高职务=', res);
          // 默认最高职务
          for (let i = 0; i < res.length; i += 1) {
            if (res[i].value !== 3) {
              return;
            }
          }
          this.setState({ isTransimit: false });
        },
      });
    }
  };

  turnSeekActivity = item => {
    const { match } = this.props;
    if (`${item.newsActivity.type}` === '4' && `${item.type}` === '1') {
      router.push(`${this.getPathByUrl(match.url, 5)}/topics/${item.newsActivity.id}`);
    } else {
      router.push(
        `${this.getPathByUrl(match.url, 5)}/${item.type === 1 ? 'news' : 'activity'}?id=${
        item.newsActivity.id
        }&subType=${item.newsActivity.type}`
      );
    }
  };

  render() {
    const { form, location } = this.props;
    const { getFieldDecorator } = form;
    const {
      taskDetail,
      receiptList,
      upTaskList,
      visible,
      total,
      current,
      addvice,
      completeLoading,
      loading,
      estimateFlag,
      estimateValue,
      fileList,
      completeVisible,
      isTransimit,
    } = this.state;
    const { match } = this.props;
    const arr = match.url.split('/');
    const { upPartyId: partyId, isSend: send } = location.query;
    const { listId: type } = match.params;
    const userPartyInfo = JSON.parse(storage.getLocal('userPartyInfo'));
    let category;
    // 是否可以转发
    // 权限包括：主题教育或者其他任务主题，有职务，任务已经开始或者截止
    let transmit = false;
    // console.log(isTransimit, taskDetail, '99');
    if (arr.length > 4) {
      category = arr[4];
      transmit =
        (arr[3] === 'education' || arr[3] === 'normalTask' || arr[1] === 'thematic') &&
        isTransimit &&
        !Number(send) &&
        taskDetail.timeStatus !== 1 && userPartyInfo && userPartyInfo.postlist && userPartyInfo.postlist.length > 0;
    }

    // 是否已经完成
    // status 2进行中  3已完成 4未完成(已过期的)
    const completeflag =
      Number(send) === 0 &&
      type !== '99' &&
      taskDetail.status === 2 &&
      taskDetail.role === 2 &&
      taskDetail.timeStatus !== 1;

    // console.error('completeflag-send',send)
    // console.error('completeflag-type',type)
    // console.error('completeflag-taskDetail.status', taskDetail.status)
    // console.error('completeflag-taskDetail.role',taskDetail.role)
    // console.error('completeflag-taskDetail.timeStatus', taskDetail.timeStatus)
    // console.error('completeflag', completeflag)
    return (
      <div className={styles.InfromationPage}>
        <Spin spinning={loading}>
          <BreadCrumbDetail {...this.props} type={arr[1] === 'task' ? '党建任务' : '主题教育'} />
          <div className={styles.InformationContent}>
            <Form layout="horizontal" className={styles.stepForm}>
              <FormItem {...this.getForItemLayout(8, 10)} label="任务名称">
                {getFieldDecorator('taskName', {
                  initialValue: taskDetail.taskName,
                })(<Input disabled />)}
              </FormItem>
              {taskDetail.downTaskId && type === '99' && (
                <FormItem {...this.getForItemLayout(8, 10)} label="关联任务">
                  <Button
                    onClick={() => {
                      const path = `${this.getPathByUrl(match.url, 3)}/normalTask/${
                        taskDetail.downTaskTopicId}/detail?taskId=${taskDetail.downTaskId}&upPartyId=${partyId}&isSend=${
                        send
                        }`;
                      router.push(path);
                    }}
                  >
                    查看关联任务
                  </Button>
                </FormItem>
              )}
              {taskDetail.upTasks && taskDetail.upTasks.length > 0 && (
                <FormItem {...this.getForItemLayout(8, 10)} label="上级重要工作">
                  <CheckboxGroup
                    value={taskDetail.upTasks.map(item => item.upTaskId)}
                    options={upTaskList}
                  />
                </FormItem>
              )}
              <FormItem {...this.getForItemLayout(8, 10)} label="发起人">
                {getFieldDecorator('deployment', {
                  initialValue: taskDetail.userName,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...this.getForItemLayout(8, 10)} label="发起人党组织">
                {getFieldDecorator('isBack', {
                  initialValue: taskDetail.upPartyName,
                })(<TextArea disabled autosize={{ minRows: 1, maxRows: 3 }} />)}
              </FormItem>
              {arr[3] === 'education' ? (
                <FormItem {...this.getForItemLayout(8, 10)} label="任务主题">
                  {getFieldDecorator('topicId', {
                    initialValue: taskDetail.taskTopic,
                  })(<Input disabled />)}
                </FormItem>
              ) : null}
              <FormItem {...this.getForItemLayout(8, 10)} label="任务类型">
                {getFieldDecorator('typeId', {
                  initialValue: taskDetail.taskType,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...this.getForItemLayout(8, 10)} label="是否线下会议记录">
                {getFieldDecorator('content', {
                  initialValue: taskDetail.isOffline ? '是' : '否',
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...this.getForItemLayout(8, 10)} label="是否需要回执">
                {getFieldDecorator('content', {
                  initialValue: taskDetail.isNeedReceipt ? '是' : '否',
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...this.getForItemLayout(8, 10)} label="任务开始时间">
                {getFieldDecorator('startDate', {
                  initialValue: taskDetail.startDate,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...this.getForItemLayout(8, 10)} label="任务截止时间">
                {getFieldDecorator('endDate', {
                  initialValue: taskDetail.endDate,
                })(<Input disabled />)}
              </FormItem>
              <FormItem {...this.getForItemLayout(8, 10)} label="任务内容">
                {getFieldDecorator('content', {
                  initialValue: taskDetail.content,
                })(<TextArea disabled rows={5} />)}
              </FormItem>
              {fileList.length > 0 && (
                <FormItem {...this.getForItemLayout(8, 10)} label="附件">
                  {fileList.map(item =>
                    item.type !== 1 && item.type !== 2 ? (
                      <div className={styles.attachment} key={Math.ceil(Math.random() * 100000)}>
                        <div className={styles.attachmentDiv}>
                          <Icon type="pic-left" className={styles.attachmentIcon} />
                          {/* <div
                            // className={styles.attachmentIcon}
                            // onClick={onDownload}
                          /> */}
                          <a
                            href={
                              item.newsActivity.fileUrl.indexOf('http') > -1
                                ? `${item.newsActivity.fileUrl}`
                                : `${commenConfig.downPath}/${item.newsActivity.fileUrl}`
                            }
                          >
                            {item.newsActivity.fileName}
                          </a>
                        </div>
                      </div>
                    ) : (
                        <div
                          className={styles.seekItem}
                          key={item.id}
                          onClick={() => this.turnSeekActivity(item)}
                        >
                          <i className={type === 'Seek' ? styles.icon : styles.actIcon} />
                          <div className={styles.seekContent}>
                            <Paragraph ellipsis={{ rows: 2, expandable: false }}>
                              {item.newsActivity.title}
                            </Paragraph>
                          </div>
                        </div>
                      )
                  )}
                </FormItem>
              )}
              {taskDetail.role === 0 &&
                taskDetail.isOffline === 1 &&
                taskDetail.isSign &&
                taskDetail.reviewStatus === 1 && (
                  <FormItem {...this.getForItemLayout(8, 10)} label="线下签到二维码">
                    {/* <QRCode value={`task#${id}`} size={120} /> */}
                  </FormItem>
                )}
              {taskDetail.role === 0 &&
                taskDetail.isOffline === 1 &&
                taskDetail.isSign &&
                taskDetail.reviewStatus === 1 && (
                  <FormItem {...this.getForItemLayout(8, 10)} label="线下签到截止时间">
                    {getFieldDecorator('offlineEndDate', {
                      initialValue: taskDetail.offlineEndDate,
                    })(<Input disabled />)}
                  </FormItem>
                )}
              <Row>
                {completeflag ? (
                  <Col span={11}>
                    <FormItem style={{ textAlign: 'right' }}>
                      <div className={styles.buttonSure}>
                        <Button
                          onClick={() => this.complete()}
                          type="primary"
                          loading={completeLoading}
                        >
                          现在完成
                        </Button>
                      </div>
                    </FormItem>
                  </Col>
                ) : null}
                <Col span={completeflag ? 11 : 14}>
                  <FormItem
                    style={
                      completeflag
                        ? { textAlign: 'left' }
                        : {
                          textAlign: 'right',
                          marginRight: transmit ? 0 : 90,
                        }
                    }
                  >
                    <div className={styles.completeRate} style={{ marginLeft: 5 }}>
                      <Button onClick={() => this.turnCompletionRate()}>查看完成率</Button>
                    </div>
                    {transmit ? (
                      <div className={styles.completeRate} style={{ marginLeft: 15 }}>
                        <Button onClick={() => this.transmitTask()}>转发</Button>
                      </div>
                    ) : null}
                  </FormItem>
                </Col>
              </Row>
              {receiptList.length > 0 && category !== '99' ? (
                <div className={styles.taskBack}>
                  <Divider />
                  <span />
                  任务回执
                </div>
              ) : null}
              {receiptList.length > 0 && category !== '99' ? (
                receiptList.map(item => this.getReceipt(item.columns))
              ) : (
                  <div style={{ marginTop: 15 }} />
                )}
              {total > 0 ? (
                <Pagination
                  current={current}
                  pageSize={5}
                  onChange={this.onChange}
                  total={total}
                  showTotal={this.showTotal}
                  className={styles.pagination}
                />
              ) : null}
            </Form>
          </div>
        </Spin>
        <Modal
          visible={completeVisible}
          title={<div style={{ color: '#333', fontWeight: 'bold' }}>填写任务回执</div>}
          onCancel={this.cancelModal}
          width={770}
          maskClosable={false}
          footer={null}
          centered
          destroyOnClose
        >
          <TaskReceipt cancelModal={this.cancelModal} refresh={this.refresh} {...this.props} />
        </Modal>
        <Modal
          visible={visible}
          title="填写退回意见"
          onCancel={this.cancelModal}
          width={450}
          maskClosable={false}
          okText="确定"
          cancelText="取消"
          onOk={debounce(this.handleOk, 500)}
          centered
          destroyOnClose
        >
          <div className={styles.backAddvice}>
            退回原因：
            <TextArea
              rows={6}
              style={{ width: 300 }}
              value={addvice}
              onChange={this.changeAddvice}
            />
          </div>
        </Modal>
        <Modal
          visible={estimateFlag}
          title="评价"
          okText="确定"
          cancelText="取消"
          onCancel={this.cancelModal}
          width={500}
          maskClosable={false}
          onOk={debounce(this.handleOkEstimate, 500)}
          centered
          destroyOnClose
        >
          <div className={styles.backAddvice}>
            评价：
            <RadioGroup
              name="radiogroup"
              value={estimateValue}
              style={{ width: 380 }}
              onChange={this.onchangRadio}
            >
              <Radio value={1}>差</Radio>
              <Radio value={2}>一般</Radio>
              <Radio value={3}>良好</Radio>
              <Radio value={4}>优秀</Radio>
              <Radio value={5}>杰出</Radio>
            </RadioGroup>
          </div>
        </Modal>
      </div>
    );
  }
}

export default TaskDetail;
