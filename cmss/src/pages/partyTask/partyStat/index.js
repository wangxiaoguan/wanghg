import React, { Component } from 'react';
import { connect } from 'dva';
import { Select, Button, Spin, Row, Col, message } from 'antd';
// import echarts from 'echarts';
import { storage } from '@/utils/utils';
// 引入 ECharts 主模块

import commenConfig from '../../../../config/commenConfig';
import Link from 'umi/link';
import router from 'umi/router';
import PartyOrgnization from './partyOrgnization';
import PartyMember from './partyMember';
import PartyBranch from './partyBranch';
import { typeList, quarterList, monthList, yearList } from './data';
import styles from './index.less';

// const { FormItem } = Form;
const { Option } = Select;

// @Form.create()
@connect(({ census, loading }) => ({
  census,
  loadingGetUserLevel: loading.effects['census/getUserLevel'],
}))
class PartyStat extends Component {
  constructor(props) {
    super(props);
    this.userInfo = JSON.parse(storage.getLocal('userInfo'));
    const year = yearList()[0].key;
    const now = new Date();
    let month = 1;
    let quarter = 1;
    if (year === Number(now.getFullYear())) {
      month = now.getMonth() + 1;
      quarter = Math.ceil(month / 3);
    }
    this.state = {
      upPartyIdIndex: 1,
      upPartyId: '',
      quarter,
      level: 0,
      postList: [],
      month,
      year,
      typeKey: 0,
      typeList: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const formData1 = {
      msgId: 'GET_NORMAL_LEVEL',
      userId: this.userInfo.id,
    };
    dispatch({
      type: 'census/getUserLevel',
      payload: {
        text: JSON.stringify(formData1),
      },
      callBack: res => {
        const defaultLevel = res[0] && res[0].level;
        // console.log(res);
        if (res && res.length) {
          this.setState(
            {
              postList: res,
              level: defaultLevel,
              upPartyId: res[0].value,
              upPartyIdIndex: res[0].index,
            },
            () => {
              this.getTableData(defaultLevel);
            }
          );
        }
      },
    });
  }

  getTableData = level => {
    const { dispatch } = this.props;
    const { upPartyId } = this.state;
    let keyword = this.getKeyWord();
    const formData = {
      userId: this.userInfo.id,
      partyId: upPartyId,
      level,
      keyword,
      msgId: 'TASK_STATISTIC_TX',
    };
    // console.log('formData', formData);
    const info = { type: '1', ...formData }; //主题教育
    const info1 = { type: '2', ...formData }; //其他任务
    const info2 = { type: '3', ...formData }; //三会一课
    const info3 = { type: '4', ...formData }; //重要工作部署

    dispatch({
      type: 'census/getCensus',
      payload: { text: JSON.stringify(info) },
    });
    dispatch({
      type: 'census/getNormalCensus',
      payload: { text: JSON.stringify(info1) },
    });
    if (level === 2 || level === 3) {
      dispatch({
        type: 'census/getMeetCensus',
        payload: { text: JSON.stringify(info2) },
      });
    }
    if (level === 1) {
      dispatch({
        type: 'census/getImCensus',
        payload: { text: JSON.stringify(info3) },
      });
      const infoDetail = {
        // 各级党组织任务执行情况
        userId: this.userInfo.id,
        partyId: upPartyId,
        level,
        keyword,
        msgId: 'TASK_STAT_TX',
      };
      dispatch({
        type: 'census/getAllRank',
        payload: {
          text: JSON.stringify(infoDetail),
        },
      });
    }
  };

  getKeyWord = () => {
    const { year, month, quarter, typeKey } = this.state;
    let keyword = '';
    if (typeKey === 0) {
      keyword = `${year}`;
    } else if (typeKey === 1) {
      keyword = `${year}-${quarter}`;
    } else {
      const q = Math.ceil(month/3)
      keyword = `${year}-${q}-${Number(month) - (q - 1) * 3}`;
    }
    return keyword;
  };

  // 职务切换
  changeOption = value => {
    const { postList } = this.state;
    if (value.split('#').length < 2) {
      return;
    }
    const upPartyId = Number(value.split('#')[0]);
    const upPartyIdIndex = Number(value.split('#')[1]);
    let level = 0;
    for (let i = 0; i < postList.length; i += 1) {
      if (Number(postList[i].value) === upPartyId && postList[i].index === upPartyIdIndex) {
        level = postList[i].level;
      }
    }
    this.setState(
      {
        upPartyId,
        upPartyIdIndex,
        level,
      },
      () => {
        // console.log('切换职务');
        this.getTableData(level);
      }
    );
  };

  search = () => {
    const { level } = this.state;
    this.getTableData(level);
  };

  exportList = (type, queryType) => {
    const { dispatch } = this.props;
    const { upPartyId, level } = this.state;
    let keyword = this.getKeyWord();
    const expInfo = {
      msgId: 'EXPORT_TASK',
      type,
      partyId: upPartyId,
      userId: this.userInfo.id,
      queryType: queryType || '2',
      level: `${level}`,
      keyword,
    };
    // console.log('9988', expInfo);
    dispatch({
      type: 'census/exportFile',
      payload: {
        text: JSON.stringify(expInfo),
      },
      callBack: item => {
        if (item.code === '0') {
          const { fileUrl } = item.resultMap;
          const $a = document.createElement('a');
          $a.href = `${commenConfig.downPath}/${fileUrl}`;
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
          message.error(item.message);
        }
      },
    });
  };

  changeAllRank = data => {
    const { location } = this.props;
    const keyword = this.getKeyWord();
    const query = `?level=${data.level}&upPartyId=${data.id}&keyword=${keyword}`;
    if (data.hasChild === 1) {
      router.push(`${location.pathname}/allRank${query}`);
    } else {
      router.push(`${location.pathname}/party${query}`);
    }
  };

  setAddUrl = data => {
    const {level} = this.state;
    let url = ''
    if(level === 3){
      url = data.replace(/isSend=1/ig,'isSend=0')
    }

    return url||data;
  }
  getRenderItem = () => {
    const { level, typeList } = this.state;
    const { location } = this.props;
    const arrKeys = location.pathname.split('/');
    const columns1 = [
      {
        title: '党组织名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 200,
      },

      {
        title: '党员人数',
        dataIndex: 'partyMemNum',
        key: 'partyMemNum',
        align: 'center',
        width: 140,
      },
      {
        title: '组织完成率',
        dataIndex: 'partyPercentage',
        key: 'partyPercentage',
        align: 'center',
        width: 150,
        render: text => <span>{`${text}%`}</span>,
      },
      {
        title: '党员参与率',
        dataIndex: 'memPercentage',
        key: 'memPercentage',
        align: 'center',
        width: 150,
        render: text => <span>{`${text}%`}</span>,
      },
      {
        title: '详情',
        dataIndex: 'detail',
        align: 'center',
        key: 'detail',
        width: 60,
        render: (_, data) => {
          return (
            <span className="blueSpan" onClick={() => this.changeAllRank(data)}>
              查看
            </span>
          );
        },
      },
    ];
    const columns2 = [
      {
        title: '任务名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 160,
        render: (text, record) => {
          // console.log(`${arrKeys.slice(0, 3).join('/')}/${record.loopUrl}`);
          return <Link to={`${arrKeys.slice(0, 3).join('/')}/${record.loopUrl}`}>{text}</Link>;
        },
      },
      {
        title: '组织数/党员数',
        dataIndex: 'rate',
        key: 'rate',
        width: 160,
        align: 'center',
      },
      {
        title: '组织完成率',
        dataIndex: 'partyPercentage',
        key: 'partyPercentage',
        align: 'center',
        width: 160,
        render: text => <span>{`${text}%`}</span>,
      },
      {
        title: '党员参与率',
        align: 'center',
        dataIndex: 'memPercentage',
        key: 'memPercentage',
        width: 160,
        render: text => <span>{`${text}%`}</span>,
      },
    ];
    const columns3 = [
      {
        title: '任务名称',
        dataIndex: 'name',
        align: 'center',
        key: 'name',
        render: (text, record) => {
          return <Link to={`${arrKeys.slice(0, 3).join('/')}/`+this.setAddUrl(record.loopUrl)}>{text}</Link>;
        },
      },
      {
        title: '任务主题',
        dataIndex: 'topicName',
        key: 'topicName',
      },

      {
        title: '完成状态',
        dataIndex: 'taskStatus',
        key: 'taskStatus',
      },
    ];
    const pagination = {
      pageSize: 5,
      defaultCurrent: 1,
      showTotal: (total, range) => {
        return `共${total}条记录 第 ${Math.ceil(range[1] / 5)} / ${Math.ceil(total / 5)}页`;
      },
    };
    // console.log('level', level);
    if (level === 1) {
      // 党支部以上组织
      return (
        <PartyOrgnization
          columns1={columns1}
          pagination={pagination}
          columns2={columns2}
          exportList={this.exportList}
        />
      );
    } else if (level === 2) {
      // 党支部
      return (
        <PartyBranch
          columns3={columns3}
          pagination={pagination}
          exportList={this.exportList}
          typeList={typeList}
          columns2={columns2}
        />
      );
    } else {
      // 党员
      return (
        <PartyMember pagination={pagination} columns3={columns3} exportList={this.exportList} />
      );
    }
  };

  render() {
    const { upPartyIdIndex, upPartyId, typeKey, postList, year, month, quarter } = this.state;
    const { loadingGetUserLevel } = this.props;
    return (
      <div className={styles.partyStat}>
        <div className={styles.post}>
          <Spin spinning={loadingGetUserLevel}>
            <span>职务: </span>
            <Select
              value={postList.length ? `${upPartyId}#${upPartyIdIndex}` : ''}
              dropdownMatchSelectWidth={false}
              style={{ maxWidth: 320, minWidth: 200 }}
              onChange={this.changeOption}
            >
              {postList.length ? (
                postList.map(item => (
                  <Option key={`${item.value}#${item.index}`} value={`${item.value}#${item.index}`}>
                    {item.label}
                  </Option>
                ))
              ) : (
                <Option key="" value="">
                  {''}
                </Option>
              )}
            </Select>
          </Spin>
        </div>
        <div className={styles.search}>
          <Row>
            <Col span={5} offset={0}>
              <Select
                style={{ width: 120 }}
                onChange={e => this.setState({ typeKey: e })}
                defaultValue={0}
              >
                {typeList.map(item => (
                  <Option key={item.key} value={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={4} offset={1}>
              <Select
                style={{ width: 100 }}
                onChange={e => this.setState({ year: e })}
                value={year}
              >
                {yearList().map(item => (
                  <Option key={item.key} value={item.key}>
                    {item.value}
                  </Option>
                ))}
              </Select>
            </Col>
            {typeKey === 1 ? (
              <Col span={4} offset={1}>
                <Select
                  style={{ width: 100 }}
                  onChange={e => this.setState({ quarter: e })}
                  value={quarter}
                >
                  {quarterList(year).map(item => (
                    <Option key={item.key} value={item.key}>
                      {item.value}
                    </Option>
                  ))}
                </Select>
              </Col>
            ) : null}
            {typeKey === 2 ? (
              <Col span={4} offset={1}>
                <Select
                  style={{ width: 100 }}
                  onChange={e => this.setState({ month: e })}
                  value={month}
                >
                  {monthList(year).map(item => (
                    <Option key={item.key} value={item.key}>
                      {item.value}
                    </Option>
                  ))}
                </Select>
              </Col>
            ) : null}
            {/* <Col span={9} offset={1}>

            </Col> */}
            <Col span={3} offset={1}>
              <div className="primary_btn">
                <Button onClick={this.search}>查询</Button>
              </div>
            </Col>
          </Row>
        </div>
        {this.getRenderItem()}
      </div>
    );
  }
}
export default PartyStat;
