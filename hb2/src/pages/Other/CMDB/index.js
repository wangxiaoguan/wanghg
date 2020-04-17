/*
 * @Desc: 消息服务-配置管理
 * @Author: Jackie
 * @Date: 2018-11-16 11:25:42
 * @Last Modified by: Jackie
 * @Last Modified time: 2018-11-16 14:37:44
 */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, InputNumber, Button, Spin, TimePicker, Select } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { formatMessage } from 'umi/locale';
import moment from 'moment';
import styles from './index.less';

const FormItem = Form.Item;

@connect(({ cmdb, loading }) => ({
  cmdb,
  loading,
}))
@Form.create()
class Cmdb extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'cmdb/fetch',
    });
  }

  handleCommit = e => {
    e.preventDefault();
    const {
      dispatch,
      form,
      cmdb: { newRule, newStartTime, newEndTime },
    } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'cmdb/update',
        payload: {
          passwordRule: newRule,
          accessStartTime: newStartTime,
          accessEndTime: newEndTime,
          ...fieldsValue,
        },
      });
    });
  };

  onNumberChange = value => {
    const { dispatch } = this.props;
    const reg = /^[0-9]*$/;
    if (reg.test(value)) {
      if (value > 0) {
        dispatch({
          type: 'cmdb/updateLocal',
          payload: { canModify: false },
        });
      } else {
        dispatch({
          type: 'cmdb/updateLocal',
          payload: { canModify: true },
        });
      }
    } else {
      dispatch({
        type: 'cmdb/updateLocal',
        payload: { canModify: true },
      });
    }
  };

  handleNumberChange = e => {
    const { dispatch } = this.props;
    const key = e.target.id;
    switch (key) {
      case 'accessTime':
        dispatch({
          type: 'cmdb/updateLocal',
          payload: { canModify: false },
        });
        break;
      case 'passwordRule':
        dispatch({
          type: 'cmdb/updateLocal',
          payload: { canModify: false },
        });
        break;
      default:
        break;
    }
  };

  onTimeLeftChange = (time, timeString) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cmdb/updateLocal',
      payload: { canModify: false, newStartTime: timeString },
    });
  };

  onTimeRightChange = (time, timeString) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cmdb/updateLocal',
      payload: { canModify: false, newEndTime: timeString },
    });
  };

  handleOptionChange = value => {
    const {
      dispatch,
      cmdb: { rules },
    } = this.props;
    dispatch({
      type: 'cmdb/updateLocal',
      payload: { canModify: false, newRule: rules[value] },
    });
  };

  render() {
    const {
      form,
      loading,
      cmdb: { data, rules, canModify, newStartTime, newEndTime, newRule },
    } = this.props;
    const children = [];
    for (let i = 0; i < rules.length; i += 1) {
      children.push(<Select.Option key={0 + i}>{rules[i]}</Select.Option>);
    }
    return (
      <div onClick={this.handleCloseMenu}>
        <PageHeaderWrapper>
          <Spin spinning={loading.effects['cmdb/update'] || loading.effects['cmdb/fetch']}>
            <Form onSubmit={this.handleCommit}>
              <Card
                bordered={false}
                title={formatMessage({ id: 'app.PasswordRouleConfiguration' })}
              >
                <Row gutter={24}>
                  <Col span={12}>
                    <FormItem labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} label="密码重试次数">
                      {form.getFieldDecorator('times', {
                        initialValue: data.times,
                        rules: [
                          {
                            required: true,
                            message: '请输入或选择密码重试次数,只允许输入数字',
                          },
                          {
                            pattern: new RegExp(/^[0-9]\d*$/),
                            message: '请输入或选择密码重试次数,只允许输入数字',
                          },
                        ],
                      })(<InputNumber min={1} max={100000} onChange={this.onNumberChange} />)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <div className={styles.timePart}>
                      访问时间段：
                      <TimePicker
                        onChange={this.onTimeLeftChange}
                        value={moment(newStartTime, 'HH:mm:ss')}
                        defaultOpenValue={moment(newStartTime, 'HH:mm:ss')}
                      />
                      &emsp;-&emsp;
                      <TimePicker
                        onChange={this.onTimeRightChange}
                        value={moment(newEndTime, 'HH:mm:ss')}
                        defaultOpenValue={moment(newEndTime, 'HH:mm:ss')}
                      />
                    </div>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={24}>
                    <div className={styles.timePart}>
                      密码规则：
                      <Select
                        style={{ width: '70%' }}
                        placeholder="请选择密码规则"
                        value={newRule}
                        onChange={this.handleOptionChange}
                      >
                        {children}
                      </Select>
                    </div>
                  </Col>
                </Row>
              </Card>
              <Row gutter={24} type="flex" justify="center" className={styles.tempMarinTop}>
                <Button
                  type="primary"
                  disabled={canModify}
                  htmlType="submit"
                  loading={loading.effects['cmdb/update']}
                >
                  修改
                </Button>
              </Row>
            </Form>
          </Spin>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default Cmdb;
