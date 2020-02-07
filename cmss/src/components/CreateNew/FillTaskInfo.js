import React, { Component } from 'react';
import {
  Form,
  Radio,
  Input,
  Select,
  Row,
  Divider,
  Col,
  DatePicker,
  Checkbox,
  Button,
  message,
  Icon,
  Typography,
  InputNumber,
} from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import { connect } from 'dva';
import { storage, getCurrentDate, getMaxRemaindDate } from '@/utils/utils';
import SeekTable from '@/components/SeekTable';
import ActivityTable from '@/components/ActivityTable';
import FileUpload from '@/components/FileUpload';

import styles from './FillTaskInfo.less';

const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const { Paragraph } = Typography;

@connect(({ partyTask }) => ({
  partyTask,
  // loading: loading.effects['partyTask/getSeekTableData'],
}))
@Form.create()
class FillTaskInfo extends Component {
  constructor(props) {
    super(props);
    this.userInfo = JSON.parse(storage.getLocal('userInfo'));
    this.state = {
      isOffline: 0,
      isSign: false,
      fileList: [], //前端回显文件列表数据
      taskAttachList: [], //传给后台文件列表数据
      actList: [],
      seekList: [],
      taskId: 0,
      typeList: [],
      plainOptions: [],
      topicList: [],
      seekVisible: false,
      actVisible: false,
    };
  }

  componentDidMount() {
    const { initIds, dispatch, location, getOrgnationDataByType, partyTask } = this.props;
    const { upPartyId } = partyTask;
    const that = this;
    const arrKeys = location.pathname.split('/');
    // 获取关联上级重要工作部署(主题教育不用关联)
    if (arrKeys[3] !== 'education') {
      const formData1 = {
        id: upPartyId === '' ? this.userInfo.partyid : upPartyId,
        msgId: 'GET_UNTIED_TASK_TX',
        isAll: true,
      };
      dispatch({
        type: 'partyTask/getRelevance',
        payload: {
          text: JSON.stringify(formData1),
        },
        callBack: res => {
          // console.log('res==', res, that.state.plainOptions);
          this.setState({
            plainOptions: [...res, ...that.state.plainOptions],
          });
        },
      });
    }
    // 获取任务类型
    const tansmitDetail = this.props.partyTask.tansmitDetail
    if ( tansmitDetail && JSON.stringify(tansmitDetail) !== '{}' ) {
      this.getTypeList(tansmitDetail.topicId);
    } else {
      this.getTypeList(initIds.topicId);
    }

    //如果是主题教育,任务类型和接收人根据任务主题来选择
    if (arrKeys[3] === 'education' || arrKeys[1] === 'thematic') {
      const formData3 = {
        msgId: 'TASK_TOPIC_LIST_TX',
        eduId: initIds.eduId,
      };
      // 获取任务主题列表
      dispatch({
        type: 'partyTask/getThemTypeList',
        payload: {
          text: JSON.stringify(formData3),
        },
        callBack: topicList => {
          // console.log('topicList', topicList);
          getOrgnationDataByType(upPartyId, topicList.length ? topicList[0].id : '1');
          // this.getTypeList(topicList.length ? topicList[0].id : '1');
          if ( tansmitDetail && JSON.stringify(tansmitDetail) !== '{}' ) {
            this.getTypeList(tansmitDetail.topicId);
          } else {
            this.getTypeList(topicList.length ? topicList[0].id : '1');
          }
          this.setState({
            topicList,
          });
        },
      });
    }
  }

  componentDidUpdate(preProps, preState) {
    const { taskId, plainOptions } = preState;
    const { initData } = preProps;
    // 判断编辑时是否有资讯和活动的回显数据
    if (!taskId && initData.task_tx) {
      if (initData.attachList) {
        const seekList = [];
        const actList = [];
        const fileList = [];
        const taskAttachList = [];
        const { attachList } = initData;
        for (let i = 0; i < attachList.length; i += 1) {
          // 根据任务详情获取seekList，actList，fileList
          if (attachList[i].type === 1) {
            seekList.push({
              title: attachList[i].newsActivity.title,
              id: attachList[i].newsActivity.id,
            });
          } else if (attachList[i].type === 2) {
            actList.push({
              title: attachList[i].newsActivity.title,
              id: attachList[i].newsActivity.id,
            });
          } else if (attachList[i].type >= 3 && attachList[i].type <= 5) {
            fileList.push({
              uid: ` ${attachList[i].attachId}`,
              name: attachList[i].newsActivity.fileName,
              url: attachList[i].newsActivity.fileUrl,
            });
          }
          // 根据任务详情获取taskAttachList
          if (attachList[i].type === 3) {
            taskAttachList.push({
              type: 3,
              content: attachList[i].content,
              url: attachList[i].newsActivity.fileUrl,
            });
          } else if (attachList[i].type === 4) {
            taskAttachList.push({
              type: 4,
              url: attachList[i].newsActivity.fileUrl,
            });
          } else if (attachList[i].type === 5) {
            taskAttachList.push({
              type: 5,
              url: attachList[i].newsActivity.fileUrl,
              fileName: attachList[i].newsActivity.fileName,
              fileSize: attachList[i].newsActivity.fileSize,
              content: attachList[i].content,
            });
          }
        }
        this.setState({
          seekList,
          actList,
          fileList,
          taskAttachList,
        });
      }
      // 判断编辑时是否有关联上级任务的回显数据
      if (initData.task_tx.upTasks) {
        const newOptions = [];
        const opinionIds = [];
        for (let j = 0; j < plainOptions.length; j += 1) {
          opinionIds.push(plainOptions[j].id);
        }
        if (initData.task_tx.upTasks !== undefined) {
          const tasks = initData.task_tx.upTasks;
          for (let i = 0; i < tasks.length; i += 1) {
            if (!opinionIds.includes(tasks[i].upTaskId)) {
              newOptions.push({ name: tasks[i].upTaskName, id: tasks[i].upTaskId });
            }
          }
        }
        // console.log('newOptions', newOptions, initData.task_tx.upTasks);
        this.setState({
          plainOptions: [...plainOptions, ...newOptions],
        });
      }
      this.setState({ taskId: initData.task_tx.taskId });
    }
  }

  // 获取任务类型
  getTypeList = topicId => {
    console.log('getTypeList',topicId);

    const { dispatch } = this.props;
    const formData2 = {
      msgId: 'TASK_TYPE_LIST_TX',
      topicId,
    };
    dispatch({
      type: 'partyTask/getTypeList',
      payload: {
        text: JSON.stringify(formData2),
      },
      callBack: typeList => {
        this.setState({ typeList });
      },
    });
  };

  addTaskAttachList = param => {
    const { taskAttachList } = this.state;
    taskAttachList.push(param);
    this.setState({ taskAttachList });
  };

  setFileList = (param, index) => {
    const { fileList } = this.state;
    fileList.push(param);
    this.setState({ fileList });
    // console.log('setFileList', param, index);
  };

  getForItemLayout = (x, y) => ({
    labelCol: {
      span: x,
    },
    wrapperCol: {
      span: y,
    },
  });

  handleSubmit = e => {
    const { changeTab, setTaskInfo } = this.props;
    const { seekList, actList, taskAttachList } = this.state;
    const { form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        // console.log('values==', values);
        const seekParams = [];
        const actParams = [];
        for (let i = 0; i < seekList.length; i += 1) {
          const obj = {
            fileName: seekList[i].title,
            type: 1,
            url: seekList[i].id,
          };
          seekParams.push(obj);
        }
        for (let i = 0; i < actList.length; i += 1) {
          const obj = {
            fileName: actList[i].title,
            type: 2,
            url: actList[i].id,
          };
          actParams.push(obj);
        }
        const newTaskAttachList = [...seekParams, ...actParams, ...taskAttachList];
        setTaskInfo({ taskAttachList: newTaskAttachList, ...values });
        changeTab('2');
      }
    });
  };

  // 添加附件
  add = type => {
    const { fileList, seekList, actList } = this.state;
    if (fileList.length + seekList.length + actList.length >= 5) {
      message.warning('附件数量不超过5个');
      return;
    }
    if (type === 'seekList') {
      this.setState({ seekVisible: true });
    } else {
      this.setState({ actVisible: true });
    }
    this.setState({ actList, seekList, fileList });
  };

  getInitValue = (list, type) => {
    const { componentType, initData, transmit } = this.props;
    if (transmit || (componentType && initData.task_tx.taskType)) {
      for (let i = 0; i < list.length; i++) {
        if (type === 'type' && list[i].name === initData.task_tx.taskType) {
          return list[i].id;
        }
        if (type === 'topic' && list[i].name === initData.task_tx.taskTopic) {
          return list[i].id;
        }
      }
      return null;
    }
    return list && list.length > 0 ? list[0].id : null;
  };

  cancelTable = () => {
    this.setState({ seekVisible: false, actVisible: false });
  };

  setSeek = (param, type) => {
    const { seekList, actList } = this.state;
    //资讯，活动分别添加和删除
    if (type === 'seekList') {
      seekList.push(param[0]);
    } else if (type === 'actList') {
      actList.push(param[0]);
    } else if (type === 'removeSeek') {
      const newList = seekList.filter(item => item.id !== param.id);
      this.setState({ seekList: newList });
      return;
    } else if (type === 'removeAct') {
      const newList = actList.filter(item => item.id !== param.id);
      this.setState({ actList: newList });
      return;
    }
    this.setState({ seekList, actList });
  };

  getItems = (item, type) => {
    return (
      <div className={styles.seekItem} key={item.id}>
        <i className={type === 'Seek' ? styles.icon : styles.actIcon} />
        <div className={styles.seekContent}>
          <Paragraph ellipsis={{ rows: 2, expandable: false }}>{item.title}</Paragraph>
        </div>
        <span onClick={() => this.setSeek(item, `remove${type}`)} className={styles.deleteIcon}>
          <Icon type="close-circle" theme="filled" style={{ color: '#d60d0d', fontSize: 20 }} />
        </span>
      </div>
    );
  };

  handleConfirmEndDate = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    if (moment(getFieldValue('endDate')) < moment(getFieldValue('startDate'))) {
      callback('不能小于开始时间！');
    }
    callback();
  };

  handleConfirmStartDate = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    if (moment(getFieldValue('startDate')) < moment(getCurrentDate(0), dateFormat)) {
      callback('不能小于当前时间！');
    }
    callback();
  };

  ChangeDate = date => {
    try {
      const dateFormat = 'YYYY-MM-DD HH:mm:ss';
      const endDate = `${date.format('YYYY-MM-DD')} 17:00:00`;
      this.props.form.setFieldsValue({
        endDate: moment(endDate, dateFormat).add(2, 'day'),
      });
    } catch (e) { }
  };

  changeTheme = value => {
    const { getOrgnationDataByType, partyTask } = this.props;
    const { upPartyId } = partyTask;
    getOrgnationDataByType(upPartyId, value);
    this.getTypeList(value);
  };

  removeFile = file => {
    const { fileList, taskAttachList } = this.state;
    const newAttachList = taskAttachList.filter(item => item.url !== file.url);
    const newFileList = fileList.filter(item => item.url !== file.url);
    this.setState({ taskAttachList: newAttachList, fileList: newFileList });
  };

  render() {
    const { form, componentType, location, initData, cancel, initIds, transmit } = this.props;
    const arrKeys = location.pathname.split('/');
    const { getFieldDecorator, getFieldValue } = form;
    const {
      isOffline,
      // isSign,
      seekList,
      actList,
      seekVisible,
      fileList,
      actVisible,
      typeList,
      plainOptions,
      topicList,
    } = this.state;
    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    const task = initData.task_tx;
    //  console.log('fileList=', fileList);
    // console.log('getInitValue:', this.getInitValue(typeList, 'type'))
    return (
      <div className={styles.fillTaskForm}>
        <Form layout="horizontal" className={styles.stepForm} onSubmit={this.handleSubmit}>
          <FormItem {...this.getForItemLayout(9, 10)} label="任务名称">
            {getFieldDecorator('name', {
              initialValue: componentType || transmit ? task.taskName : '',
              rules: [
                { required: true, message: '请输入任务名称' },
                { max: 16, message: '任务名称字数不要超过16' },
              ],
            })(
              <Input
                placeholder="请输入任务名称"
                style={{ width: 360, textAlign: 'left' }}
                // 新增和转发可修改任务名称，编辑不可改
                disabled={componentType}
                suffix={
                  <span>
                    {getFieldValue('name').length <= 16
                      ? `${getFieldValue('name').length}/16`
                      : `-${getFieldValue('name').length - 16}`}
                  </span>
                }
              />
            )}
          </FormItem>
          {plainOptions.length === 0 || arrKeys[3] === 'education' || arrKeys[1] === 'thematic' ? null : (
            <FormItem {...this.getForItemLayout(9, 14)} label="关联上级工作部署">
              {getFieldDecorator('upTaskId', {
                initialValue:
                  (componentType || transmit) && task.upTasks
                    ? task.upTasks.map(v => v.upTaskId)
                    : [],
              })(
                <CheckboxGroup style={{ width: '100%' }} onChange={this.onChange}>
                  <Row>
                    {plainOptions.map(v => (
                      <Col span={12} key={v.id} style={{ textAlign: 'left' }}>
                        <Checkbox value={v.id}>{v.name}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </CheckboxGroup>
              )}
            </FormItem>
          )}
          {arrKeys[3] === 'education' || arrKeys[1] === 'thematic' ? (
            <FormItem {...this.getForItemLayout(9, 6)} label="任务主题">
              {getFieldDecorator('topicId', {
                initialValue: this.getInitValue(topicList, 'topic'),
                rules: [{ required: true, message: '请选择任务主题' }],
              })(
                <Select style={{ width: 200 }} disabled={componentType} onChange={this.changeTheme}>
                  {topicList.map(v => (
                    <Option value={v.id} key={v.id}>
                      {v.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          ) : null}
          <FormItem {...this.getForItemLayout(9, 6)} label="任务类型">
            {getFieldDecorator('typeId', {
              initialValue: this.getInitValue(typeList, 'type'),
              rules: [{ required: true, message: '请选择任务类型' }],
            })(
              <Select style={{ width: 200 }} disabled={componentType}>
                {typeList.map(v => (
                  <Option value={v.id} key={v.id}>
                    {v.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...this.getForItemLayout(9, 6)} label="是否需要回执">
            {getFieldDecorator('isNeedReceipt', {
              initialValue: componentType ? task.isNeedReceipt : true,
              rules: [{ required: true, message: '请确认是否需要回执' }],
            })(
              <Select style={{ width: 200 }} disabled={componentType && initIds.topicId === '99'}>
                <Option value>是</Option>
                <Option value={false}>否</Option>
              </Select>
            )}
          </FormItem>
          <FormItem {...this.getForItemLayout(9, 6)} label="任务开始时间">
            {getFieldDecorator('startDate', {
              initialValue: componentType ? moment(task.startDate, dateFormat) : null,
              rules:
                // componentType || transmit
                //   ? [
                //     {
                //       type: 'object',
                //       required: true,
                //       message: '请选择任务开始时间',
                //     },
                //   ]
                //   :
                  [
                    {
                      type: 'object',
                      required: true,
                      message: '请选择任务开始时间',
                    },
                    {
                      validator: this.handleConfirmStartDate,
                    },
                  ],
            })(
              <DatePicker
                placeholder="选择时间"
                locale={locale}
                showTime
                onChange={this.ChangeDate}
                style={{ width: 200 }}
                className={styles.datePicker}
              />
            )}
          </FormItem>
          <FormItem {...this.getForItemLayout(9, 6)} label="任务截止时间">
            {getFieldDecorator('endDate', {
              initialValue: componentType ? moment(task.endDate, dateFormat) : null,
              rules: [
                {
                  type: 'object',
                  required: true,
                  message: '请选择任务截止时间',
                },
                {
                  validator: this.handleConfirmEndDate,
                },
              ],
            })(
              <DatePicker
                placeholder="选择时间"
                locale={locale}
                showTime
                style={{ width: 200 }}
                className={styles.datePicker}
              />
            )}
          </FormItem>
          <div className={styles.textArea}>
            <FormItem {...this.getForItemLayout(9, 11)} label="任务内容">
              {getFieldDecorator('content', {
                initialValue: componentType || transmit ? task.content : '',
                rules: [
                  { required: true, message: '请输入任务内容' },
                  { max: 500, message: '内容名称字数不要超过500' },
                ],
              })(<TextArea placeholder="请输入任务内容文字" rows={6} style={{ width: 360 }} />)}
            </FormItem>
          </div>
          <div className={styles.textSuffix}>
            {getFieldValue('content').length <= 500
              ? `${getFieldValue('content').length}/500`
              : `-${getFieldValue('content').length - 500}`}
          </div>
          <Divider />
          <FormItem {...this.getForItemLayout(9, 15)} label="任务附件">
            {getFieldDecorator('taskAttach ', {
              initialValue: '',
              rules: [{ required: false, message: '上传任务附件' }],
            })(
              <div className={styles.taskFile}>
                <div className={styles.addButton}>
                  <Button onClick={() => this.add('seekList')} className={styles.blockButton}>
                    添加资讯
                  </Button>
                  {seekList.map(item => this.getItems(item, 'Seek'))}
                  {seekVisible && <SeekTable
                    setSeek={this.setSeek}
                    visible={seekVisible}
                    seekList = {seekList}
                    cancelTable={this.cancelTable}
                  />
                  }
                  <Button onClick={() => this.add('activityList')} className={styles.blockButton}>
                    添加活动
                  </Button>
                  {actVisible && <ActivityTable
                    setSeek={this.setSeek}
                    acList={actList}
                    visible={actVisible}
                    cancelTable={this.cancelTable}
                  />}
                  {actList.map(item => this.getItems(item, 'Act'))}
                  <div className={styles.fileType}>
                    支持文件类型：jpg、jpeg、bmp、png、doc、docx、xls、xlsx
                    <br />
                    <span>ppt、pptx、pdf、mp4</span>
                  </div>
                  {/* <Button onClick={() => this.add('fileList')}>添加文件</Button> */}
                  <FileUpload
                    value={fileList}
                    attachLength={seekList.length + actList.length}
                    disabled
                    remove={this.removeFile}
                    addTaskAttachList={this.addTaskAttachList}
                    setFileList={this.setFileList}
                  />
                </div>
              </div>
            )}
          </FormItem>
          <FormItem {...this.getForItemLayout(9, 10)} label="提醒">
            {<span style={{ fontSize: '13px' }}>截止前</span>}
            {getFieldDecorator('remindDate', {
              initialValue: componentType || transmit ? task.remindDate : 1,
              rules: [
                {
                  type: 'number',
                  message: '请输入数字',
                },
                { required: true, message: '请输入提醒时间' },
              ],
            })(
              <InputNumber
                placeholder="请输入提醒时间"
                style={{ width: 180, margin: '0 10px' }}
                max={getMaxRemaindDate(getFieldValue('endDate'))}
                min={1}
              />
            )}
            {<span style={{ fontSize: '13px' }}>天</span>}
          </FormItem>
          <Divider />
          {initIds.topicId === '99' ? null : (
            <FormItem {...this.getForItemLayout(9, 6)} label="是否线下会议">
              {getFieldDecorator('isOffline', {
                initialValue: componentType || transmit ? task.isOffline : Number(isOffline),
                rules: [{ required: true, message: '请确认是否线下会议' }],
              })(
                <RadioGroup
                  style={{ width: 200 }}
                  onChange={e => {
                    this.setState({
                      isOffline: e.target.value,
                    });
                  }}
                  disabled={componentType}
                >
                  <Radio value={1}>是</Radio>
                  <Radio value={0}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
          )}
          {/* {isOffline ? (
            <FormItem {...this.getForItemLayout(9, 6)} label="是否线下签到">
              {getFieldDecorator('isSign', {
                initialValue: isSign,
                rules: [{ required: true, message: '请确认是否线下签到' }],
              })(
                <RadioGroup
                  style={{ width: 200 }}
                  onChange={e => {
                    this.setState({
                      isSign: e.target.value,
                    });
                  }}
                  disabled={componentType}
                >
                  <Radio value>是</Radio>
                  <Radio value={false}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
          ) : null}
          {isSign && isOffline ? (
            <FormItem {...this.getForItemLayout(9, 6)} label="签到截止时间">
              {getFieldDecorator('offlineEndDate', {
                initialValue: moment(
                  componentType && task.offlineEndDate !== ''
                    ? task.offlineEndDate
                    : `${getCurrentDate(1)}`,
                  dateFormat
                ),
                rules: [
                  {
                    type: 'object',
                    required: true,
                    message: '请选择签到截止时间',
                  },
                ],
              })(
                <DatePicker
                  placeholder="选择时间"
                  showTime
                  style={{ width: 200 }}
                  format="YYYY-MM-DD HH:mm:ss"
                  className={styles.datePicker}
                />
              )}
            </FormItem>
          ) : null} */}
          <Row>
            <Col span={12} className="global_btn">
              <FormItem style={{ textAlign: 'right' }}>
                <Button onClick={() => cancel()} style={{ width: 100, height: 36 }}>
                  返回
                </Button>
              </FormItem>
            </Col>
            <Col span={12} className="primary_btn">
              <FormItem style={{ textAlign: 'left', marginLeft: 10 }}>
                <Button type="primary" htmlType="submit" style={{ width: 100, height: 36 }}>
                  下一步
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
export default FillTaskInfo;
