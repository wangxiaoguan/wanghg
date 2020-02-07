/* eslint-disable no-const-assign */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { Button, Checkbox, Input, Row, Col, Form, Radio, Modal, Pagination, message } from 'antd';
import BreadCrumbDetail from '@/components/BreadCrumbDetail';
import { connect } from 'dva';
import { storage } from '@/utils/utils';
import router from 'umi/router';
import styles from './index.less';

const { confirm } = Modal;
const RadioGroup = Radio.Group;

@connect(({ onlineExam }) => ({
  onlineExam,
}))
@Form.create()
class JoinExam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      topicList: '',
      optionNum: ['A', 'B', 'C', 'D', 'E', 'F'],
      allCheckArr: [],
      userInfo: JSON.parse(storage.getLocal('userInfo')),
      isCan: '', // 用户能否参加
      time: '',
      btnChange: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    const { id } = query;
    const { userInfo } = this.state;
    // const activityId = id;
    const that = this;
    const userDetail = {
      userId: userInfo.id,
      msgId: 'APP016',
      department: userInfo.orgid,
      activityId: id,
    };
    dispatch({
      type: 'onlineExam/getJoinExam',
      payload: {
        text: JSON.stringify(userDetail),
      },
      callBack: item => {
        if (item.code === '0') {
          if (item.resultMap.activityInfo.isradomexam === 'true') {
            // 随机题目考试
            const randomDetail = {
              userId: userInfo.id,
              msgId: 'APP101',
              activityId: id,
            };
            dispatch({
              type: 'onlineExam/getJoinRadomExam',
              payload: {
                text: JSON.stringify(randomDetail),
              },
              callBack: item2 => {
                if (item2.code === '0') {
                  const { isCan } = item.resultMap;
                  const { topicList } = item2.resultMap;
                  that.setState({ topicList, isCan });
                  // 随机题目考试设置定时器计时考试时间
                  this.setTimer();
                } else {
                  message.error(item.message);
                }
              },
            });
          } else if (item.resultMap.activityInfo.isradomexam === 'false') {
            // 自定义题目考试
            if (item.resultMap.isCan === false) {
              message.error(item.resultMap.reason);
            } else {
              const { topicList, isCan } = item.resultMap;
              that.setState({ topicList, isCan });
              // 自定义考试设置定时器计时考试时间
              this.setTimer();
            }
          }
        } else {
          message.error(item.message);
        }
      },
    });
  }

  // 定时器计时考试时长
  setTimer = () => {
    let timeStart = 0;
    this.setTimer = setInterval(() => {
      timeStart += 1;
      this.setState({ time: timeStart });
    }, 1000);
  };

  // 清除定时器
  stopSetTime = () => {
    clearInterval(this.setTimer);
  };

  showConfirm = () => {
    const { btnChange } = this.state;
    const me = this;
    confirm({
      title: '提交后无法修改，是否确认提交答卷？',
      okText: '提交',
      cancelText: '取消',
      okButtonProps: { disabled: btnChange, className: 'red-btn' },
      cancelButtonProps: { className: 'btn-cancel' },
      onOk() {
        me.handleSubmit();
      },
      onCancel() {
        me.setState({ btnChange: false });
      },
    });
  };

  handleSubmit = () => {
    const { form } = this.props;
    form.validateFields(err => {
      if (!err) {
        const { allCheckArr, topicList, userInfo, time } = this.state;
        let allCheckArrLen = [];
        allCheckArrLen = [...allCheckArr];
        allCheckArrLen.forEach((items, index) => {
          if (Array.isArray(items.optionId) && items.optionId.length === 0) {
            allCheckArrLen.splice(index, 1);
          }
        });
        if (allCheckArrLen && topicList) {
          if (allCheckArrLen.length === topicList.length) {
            this.setState({ btnChange: true });
            const Newanswer = [];
            allCheckArr.forEach(item => {
              if (Array.isArray(item.optionId)) {
                item.optionId.forEach(item1 => {
                  const newArrLen = {};
                  newArrLen.optionId = item1;
                  newArrLen.topicId = item.topicId;
                  Newanswer.push(newArrLen);
                });
              }
              if (typeof item.optionId === 'string') {
                Newanswer.push({ optionId: item.optionId, topicId: item.topicId });
              }
            });
            const {
              dispatch,
              location: { query },
            } = this.props;
            const { id } = query;
            console.log('Newanswer===', Newanswer);
            const userDetail = {
              userId: userInfo.id,
              msgId: 'APP018',
              activityId: id,
              answerList: Newanswer,
              examDate: time,
            };
            this.stopSetTime();
            dispatch({
              type: 'onlineExam/JoinExamSubmit',
              payload: {
                text: JSON.stringify(userDetail),
              },
              callBack: item => {
                if (item.code === '0') {
                  message.success('提交成功');
                  this.setState({ btnChange: false });
                  router.goBack();
                } else {
                  message.error(item.message);
                }
              },
            });
          } else {
            message.error('题目未答完，请继续答题');
          }
        }
      }
    });
  };

  onChange = value => {
    this.setState({ current: value });
    setTimeout(() => {
      const { allCheckArr } = this.state;
      const { form } = this.props;
      if (allCheckArr.length) {
        // for (let i = (value - 1) * 4; i < value * 4; i += 1) {
        //   if (allCheckArr[i] && allCheckArr[i].topicId) {
        //     form.setFieldsValue({
        //       [allCheckArr[i].topicId]: allCheckArr[i].optionId,
        //     });
        //   }
        // }

        // 解决分页回显问题
        allCheckArr.forEach(item => {
          form.setFieldsValue({
            [item.topicId]: item.optionId,
          });
        });
      }
    }, 0);
  };

  CheckboxOnChange = (value, id) => {
    const { allCheckArr } = this.state;
    const obj = { topicId: id, optionId: value };
    let flag = false;
    for (let i = 0; i < allCheckArr.length; i += 1) {
      if (allCheckArr[i].topicId === id) {
        allCheckArr[i].optionId = value;
        flag = true;
      }
    }
    if (!flag) {
      allCheckArr.push(obj);
    }
    this.setState({ allCheckArr });
  };

  renderItem = (item, index) => {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    const { current, optionNum } = this.state;
    if (item.type === 1) {
      return (
        <Row key={item.id}>
          <Col offset={1}>
            <Col span={22} style={{ marginBottom: '10px' }} className={styles.selectItem}>
              <span style={{ marginRight: 5 }}>{index + 1 + (current - 1) * 4}.</span>
              {item.title}
              <span style={{ color: '#40a9ff' }}>（单选）</span>
            </Col>
          </Col>
          <Col offset={1}>
            <Form.Item>
              {getFieldDecorator(`${item.id}`, {
                initialValue: ``,
              })(
                <RadioGroup
                  style={{ width: '100%' }}
                  onChange={values => {
                    this.CheckboxOnChange(values.target.value, item.id);
                  }}
                >
                  <Row>
                    {item.optionList &&
                      item.optionList.map((items, list) => (
                        <Radio className={styles.radio} value={items.id} key={items.id}>
                          <span className={styles.selectItem}>
                            {optionNum[list]}.{items.content}
                          </span>
                        </Radio>
                      ))}
                  </Row>
                </RadioGroup>
              )}
            </Form.Item>
          </Col>
        </Row>
      );
    }
    if (item.type === 2) {
      return (
        <Row key={item.id}>
          <Col offset={1}>
            <Col span={22} style={{ marginBottom: '10px' }} className={styles.selectItem}>
              <span style={{ marginRight: 5 }}>{index + 1 + (current - 1) * 4}.</span>
              {item.title}
              <span style={{ color: '#40a9ff' }}>（多选）</span>
            </Col>
          </Col>
          <Col offset={1}>
            <Form.Item>
              {getFieldDecorator(`${item.id}`, {
                initialValue: [],
              })(
                <Checkbox.Group
                  style={{ width: '100%' }}
                  onChange={value => {
                    this.CheckboxOnChange(value, item.id);
                  }}
                >
                  <Row>
                    {item.optionList &&
                      item.optionList.map((items, list) => (
                        // <Col >
                        <Checkbox className={styles.Checkbox} value={items.id} key={items.id}>
                          <span className={styles.selectItem}>
                            {optionNum[list]}.{items.content}
                          </span>
                        </Checkbox>
                        // </Col>
                      ))}
                  </Row>
                </Checkbox.Group>
              )}
            </Form.Item>
          </Col>
        </Row>
      );
    }
    return (
      <Row key={item.id}>
        <Col offset={1}>
          <Col span={1}>{index + 1 + (current - 1) * 4}.</Col>
          <Col span={22} style={{ marginBottom: '10px' }} className={styles.selectItem}>
            {item.title}
          </Col>
        </Col>
        <Col offset={1}>
          <Form.Item>
            {getFieldDecorator(`${item.id}`, {
              initialValue: '',
              rules: [
                { required: true, message: '请输入' },
                {
                  max: 20,
                  message: `任务名称字数不要超过${20}`,
                },
              ],
            })(
              <Input
                suffix={
                  <span>
                    {getFieldValue(item.id).length <= item.answerNum
                      ? `${getFieldValue(item.id).length}/${item.answerNum}`
                      : `-${getFieldValue(item.id).length - item.answerNum}`}
                  </span>
                }
              />
            )}
          </Form.Item>
        </Col>
      </Row>
    );
  };

  render() {
    const { current, topicList, isCan } = this.state;
    const getList2 = topicList && topicList.slice((current - 1) * 4, current * 4);
    return (
      <div>
        <Form className={styles.titleNum}>
          <BreadCrumbDetail {...this.props} type="网上课堂" />
          {getList2 && getList2.map((item, index) => this.renderItem(item, index))}
          {topicList && topicList.length > 4 ? (
            <Pagination
              current={current}
              pageSize={1}
              onChange={this.onChange}
              total={Math.ceil(topicList && topicList.length / 4)}
              className={styles.pagination}
            />
          ) : null}
          <Form.Item className={styles.submitBtn} >
            {isCan === true ? (
              <Button onClick={this.showConfirm} className='red-btn'>
                提交
                </Button>
            ) : null}
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default JoinExam;
