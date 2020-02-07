import React, { Component } from 'react';
import { Checkbox, Radio, Row, Col, Pagination, message } from 'antd';
import BreadCrumbDetail from '@/components/BreadCrumbDetail';
import { connect } from 'dva';
import { storage } from '@/utils/utils';
import styles from './index.less';

@connect(({ onlineExam }) => ({
  onlineExam,
}))
class ViewExam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      topiclist: '',
      score: '',
      optionNum: ['A', 'B', 'C', 'D', 'E', 'F'],
      userInfo: JSON.parse(storage.getLocal('userInfo')),
      endtime: '',
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location: { query },
    } = this.props;
    const { id } = query;
    const { userInfo } = this.state;
    const that = this;
    // 查看考试结果带解析
    const userDetail = {
      msgId: 'GET_ANWSER_PARSE',
      objectId: id,
      userId: userInfo.id, // 修改为625071122可查看到数据
    };
    dispatch({
      type: 'onlineExam/viewExam',
      payload: {
        text: JSON.stringify(userDetail),
      },
      callBack: item => {
        if (item.code === '0') {
          const { topiclist } = item.resultMap;
          that.setState({ topiclist });
        } else {
          message.error(item.message);
        }
      },
    });

    // 查看考试分数
    const userScoreDetail = {
      activityId: id,
      department: userInfo.orgid,
      msgId: 'APP045',
      userId: userInfo.id,
    };
    dispatch({
      type: 'onlineExam/viewExamScore',
      payload: {
        text: JSON.stringify(userScoreDetail),
      },
      callBack: item => {
        console.log('获取查看考试的数据', item);
        if (item.code === '0') {
          const { score } = item.resultMap;
          that.setState({ score, endtime: item.resultMap.activityInfo.endtime });
        } else {
          message.error(item.message);
        }
      },
    });
  }

  // 获取当时时间格式为YYYY-MM-DD HH:MM:SS
  getNowFormatDate = () => {
    const date = new Date();
    const seperator1 = '-';
    const seperator2 = ':';
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = `0${month}`;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = `0${strDate}`;
    }
    const currentdate = `${date.getFullYear() +
      seperator1 +
      month +
      seperator1 +
      strDate} ${date.getHours()}${seperator2}${date.getMinutes()}${seperator2}${date.getSeconds()}`;
    return currentdate;
  };

  onChange = value => {
    this.setState({
      current: value,
    });
  };

  equal = (a, b) => {
    // 判断数组的长度
    if (a.length !== b.length) {
      return false;
    }
    // 循环遍历数组的值进行比较
    for (let i = 0; i < a.length; i += 1) {
      if (b.indexOf(a[i]) === -1 || a.indexOf(b[i]) === -1) {
        return false;
      }
    }
    return true;
  };

  render() {
    const { current, topiclist, score, optionNum, endtime } = this.state;
    const getList1 = topiclist && topiclist.slice((current - 1) * 4, current * 4);

    return (
      <div className={styles.titleNum}>
        <BreadCrumbDetail {...this.props} type="网上课堂" />
        <Row className={styles.achievement}>
          <Col>
            <div className={styles.scoreBackground}>
              考试成绩:<span className={styles.score}>{score}</span>分
            </div>
          </Col>
        </Row>
        {getList1 &&
          getList1.map((item, index) => (
            <div>
              <Row className={styles.topicSpacing} key={item.id}>
                <Col offset={1}>
                  {item.type === 2 ? (
                    <Col span={22}>
                      <span style={{ marginRight: 5 }}>{index + 1 + (current - 1) * 4}.</span>
                      {item.title}（多选）
                    </Col>
                  ) : (
                      <Col span={22}>
                        <span style={{ marginRight: 5 }}>{index + 1 + (current - 1) * 4}.</span>
                        {item.title}（单选）
                    </Col>
                    )}
                </Col>
              </Row>
              <Row className={styles.topicSpacing}>
                <Col offset={1}>
                  {item.type === 2 ? (
                    <div>
                      {new Date(this.getNowFormatDate()) > new Date(endtime) ? (
                        <div>
                          <Col span={2}> 你的答案: </Col>
                          {item.options.map((items1, index1) =>
                            item.useranswer.map(items2 =>
                              items1.id === items2 ? (
                                <Checkbox.Group
                                  style={{
                                    width: '100%',
                                  }}
                                  value={items1.id}
                                >
                                  {/* <Col span={16}> */}
                                  <Checkbox
                                    className={styles.Checkbox}
                                    value={items1.id}
                                    disabled
                                    key={items1.id}
                                  >
                                    {optionNum[index1]}.{items1.content}
                                  </Checkbox>
                                  {/* </Col> */}
                                </Checkbox.Group>
                              ) : null
                            )
                          )}
                        </div>
                      ) : (
                          <div key={item.id}>
                            <Col span={2}> 你的答案: </Col>
                            {this.equal(item.useranswer, item.answer) === true ? (
                              <Col span={5} className={styles.correct}>
                                正确
                            </Col>
                            ) : (
                                <Col span={5} className={styles.error}>
                                  错误
                            </Col>
                              )}
                          </div>
                        )}
                    </div>
                  ) : (
                      <div>
                        {new Date(this.getNowFormatDate()) > new Date(endtime) ? (
                          <div>
                            {item.options.map((items3, index3) =>
                              item.useranswer.map(items4 =>
                                items3.id === items4 ? (
                                  <Radio.Group
                                    style={{
                                      width: '100%',
                                    }}
                                    value={items3.id}
                                  >
                                    <Row>
                                      <Col span={2}> 你的答案: </Col>
                                      <Col>
                                        <Radio
                                          className={styles.radio}
                                          value={items3.id}
                                          disabled
                                          key={items3.id}
                                        >
                                          {optionNum[index3]}.{items3.content}
                                        </Radio>
                                      </Col>
                                    </Row>
                                  </Radio.Group>
                                ) : null
                              )
                            )}
                          </div>
                        ) : (
                            <Row key={item.id}>
                              <Col span={2}> 你的答案: </Col>
                              {this.equal(item.useranswer, item.answer) === true ? (
                                <Col span={5} className={styles.correct}>
                                  正确
                            </Col>
                              ) : (
                                  <Col span={5} className={styles.error}>
                                    错误
                            </Col>
                                )}
                            </Row>
                          )}
                      </div>
                    )}
                </Col>
              </Row>
              <Row className={styles.topicSpacing}>
                <Col offset={1}>
                  {item.type === 2 ? (
                    <div>
                      {new Date(this.getNowFormatDate()) > new Date(endtime) ? (
                        <div>
                          <Col span={2} className={styles.answerColor}>
                            正确答案:
                          </Col>
                          {item.options.map((items1, index1) =>
                            item.answer.map(items2 =>
                              items1.id === items2 ? (
                                <Checkbox.Group
                                  style={{
                                    width: '100%',
                                  }}
                                  value={items1.id}
                                >
                                  <Checkbox
                                    className={styles.Checkbox}
                                    value={items1.id}
                                    disabled
                                    key={items1.id}
                                  >
                                    {optionNum[index1]}.{items1.content}
                                  </Checkbox>
                                </Checkbox.Group>
                              ) : null
                            )
                          )}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                      <div>
                        {new Date(this.getNowFormatDate()) > new Date(endtime) ? (
                          <div>
                            {item.options.map((items3, index3) =>
                              item.answer.map(items4 =>
                                items3.id === items4 ? (
                                  <Radio.Group
                                    style={{
                                      width: '100%',
                                    }}
                                    value={items3.id}
                                  >
                                    <Row>
                                      <Col span={2} className={styles.answerColor}>
                                        正确答案:
                                    </Col>
                                      <Col>
                                        <Radio
                                          className={styles.radio}
                                          value={items3.id}
                                          checked
                                          disabled
                                          key={items3.id}
                                        >
                                          {optionNum[index3]}.{items3.content}
                                        </Radio>
                                      </Col>
                                    </Row>
                                  </Radio.Group>
                                ) : null
                              )
                            )}
                          </div>
                        ) : null}
                      </div>
                    )}
                </Col>
              </Row>
              {new Date(this.getNowFormatDate()) > new Date(endtime) ? (
                <Row className={(styles.topicSpacing, styles.answerBackground)}>
                  <Col offset={1}>
                    <Col span={2}> 答案解析: </Col>
                    <Col
                      className={styles.anserParse}
                      dangerouslySetInnerHTML={{ __html: item.anserParse }}
                    />
                  </Col>
                </Row>
              ) : null}
            </div>
          ))}
        {topiclist && topiclist.length > 4 ? (
          <Pagination
            current={current}
            pageSize={1}
            onChange={this.onChange}
            total={Math.ceil(topiclist && topiclist.length / 4)}
            className={styles.pagination}
          />
        ) : null}
      </div>
    );
  }
}
export default ViewExam;
