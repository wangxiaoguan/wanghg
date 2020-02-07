import React, { Component } from 'react';
import { Input, Button, Spin, Select, Form, Typography, Popover, Table } from 'antd';
import { storage, judgeIeBower } from '@/utils/utils';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './index.less';

const FormItem = Form.Item;
const { Paragraph } = Typography;
const { Option } = Select;
//判断是否为ie浏览
const isIe = judgeIeBower();

@Form.create()
@connect(({ thematicEducation, partyTask, loading }) => ({
  thematicEducation,
  partyTask,
  loading: loading.effects['thematicEducation/getTableData'],
  loadingGetUserLevel: loading.effects['thematicEducation/getUserLevel'],
}))
class MyTask extends Component {
  constructor(props) {
    super(props);
    this.userInfo = JSON.parse(storage.getLocal('userInfo'));
    const {
      partyTask: { upPartyId, upPartyIdIndex },
    } = props;
    this.state = {
      typeList: [],
      currentPage: 1,
      pageSize: 10,
      postList: [],
      eduId: '',
      topicList: [],
      upPartyId,
      upPartyIdIndex,
    };
  }

  componentDidMount() {
    const { dispatch, partyTask, location } = this.props;
    const { upPartyId } = this.state;
    const { currentUrl } = partyTask;
    const pathName = location.pathname.split('/');
    const formData1 = {
      msgId: 'GET_USER_LEVEL',
      userId: this.userInfo.id,
    };
    const formData2 = {
      msgId: 'TASK_TYPE_LIST_TX',
      topicId: 1,
    };
    const formData3 = {
      msgId: 'TASK_TOPIC_LIST_TX',
      eduId: 1,
    };
    const page = {
      currentPage: 1,
      pageSize: 10,
    };
    // 获取eduId
    dispatch({
      type: 'thematicEducation/getUserLevel',
      payload: {
        text: JSON.stringify(formData1),
      },
      callBack: (themeList, postList) => {
        // console.log(themeList, postList);
        const ids = [];
        for (let i = 0; themeList && i < themeList.length; i += 1) {
          ids.push(themeList[i].sceneClassifyId);
        }
        if (postList && postList.length) {
          // console.log(currentUrl, pathName.slice(0, 5).join('/'));
          // 不同任务主题，isSend和upPartyId改为默认值
          if (currentUrl !== pathName.slice(0, 5).join('/')) {
            const params = {
              upPartyId: postList[0] && postList[0].value,
            };
            this.setState(
              {
                postList,
                eduId: ids.join(','),
                upPartyId: postList[0] && postList[0].value,
                upPartyIdIndex: postList[0].index,
              },
              () => {
                this.getTableData(page, params);
              }
            );
          } else {
            const params = { upPartyId };
            this.setState(
              {
                postList,
                eduId: ids.join(','),
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
      type: 'thematicEducation/getTypeList',
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

    // 获取任务主题列表
    dispatch({
      type: 'partyTask/getThemTypeList',
      payload: {
        text: JSON.stringify(formData3),
      },
      callBack: topicList => {
        this.setState({
          topicList,
        });
      },
    });
  }

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
        // const type = location.pathname.split('/')[3];
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

  getTableData = (page, params) => {
    const { dispatch, location } = this.props;
    const { eduId, upPartyId, upPartyIdIndex } = this.state;
    const pathName = location.pathname.split('/');
    const { level } = this.getLevelById(params.upPartyId);
    const formData = {
      upPartyId: params.upPartyId,
      msgId: 'TASK_LIST',
      userId: this.userInfo.id,
      topicId: 6,
      level,
      eduId,
      sendFlag: 0,
      index: page.currentPage,
      pageSize: page.pageSize,
      keyword: '',
      status: '1',
      eduTopicId: '',
    };

    if (params.keyword) {
      formData.keyword = params.keyword;
    }
    if (params.typeId) {
      formData.typeId = params.typeId;
    }
    if (params.eduTopicId && Number(params.eduTopicId) !== 6) {
      formData.eduTopicId = Number(params.eduTopicId);
    }
    if (params.status) {
      formData.status = params.status;
    }
    this.setState({
      currentPage: page.currentPage,
    });
    dispatch({
      type: 'thematicEducation/getTableData',
      payload: {
        text: JSON.stringify(formData),
      },
    });
    dispatch({
      type: 'partyTask/setUpPartyId',
      payload: {
        upPartyId,
        upPartyIdIndex,
        currentUrl: pathName.slice(0, 5).join('/'),
      },
    });
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
      restSubmit: 6,
    });
    this.onSubmit();
  };

  onSubmit = () => {
    const { upPartyId, currentPage, pageSize } = this.state;
    this.props.form.validateFields(['keyword', 'typeId', 'status', 'eduTopicId'], (err, values) => {
      if (!err) {
        const page = { currentPage, pageSize };
        const params = values;
        params.upPartyId = upPartyId;
        this.getTableData(page, params);
      }
    });
  };

  onPageChange = (newpage, size) => {
    const { upPartyId } = this.state;
    const page = {
      currentPage: newpage,
      pageSize: size,
    };
    this.setState(
      {
        currentPage: newpage,
        pageSize: size,
      },
      () => {
        this.getTableData(page, { upPartyId });
      }
    );
  };

  getPostValue = () => {
    const { postList, upPartyIdIndex, upPartyId } = this.state;
    const arr = [];
    postList.map(item => {
      arr.push(`${item.value}#${item.index}`);
    });
    if (arr.includes(`${upPartyId}#${upPartyIdIndex}`)) {
      return `${upPartyId}#${upPartyIdIndex}`;
    } else if (arr.length) {
      return arr[0];
    } else {
      return '';
    }
  };

  render() {
    const { form, thematicEducation, loading, match, loadingGetUserLevel } = this.props;
    const { getFieldDecorator } = form;
    const { currentPage, pageSize, upPartyId, postList, topicList } = this.state;
    const { taskList, tableList, total } = thematicEducation;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        align: 'center',
        width: 45,
      },
      {
        title: '任务名称',
        dataIndex: 'taskName',
        key: 'taskName',
        align: 'center',
        width: 100,
        render: text => {
          return (
            <Popover content={text}>
              <Paragraph ellipsis={{ rows: 2, expandable: false }}>{text}</Paragraph>
            </Popover>
          );
        },
      },
      {
        title: '任务主题',
        dataIndex: 'topicName',
        key: 'topicName',
        align: 'center',
        width: 80,
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
        width: 70,
      },
      {
        title: '发起人党组织',
        dataIndex: 'upPartyName',
        key: 'upPartyName',
        align: 'center',
        width: 200,
        render: text => (
          <Popover content={text}>
            <Paragraph ellipsis={{ rows: 2, expandable: false }}>{text}</Paragraph>
          </Popover>
        ),
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
        width: 80,
        render: text => {
          const color = text === '进行中' ? '#1484E3' : '#333';
          return <span style={{ color }}>{text}</span>;
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: 90,
        align: 'center',
        // eslint-disable-next-line arrow-body-style
        render: (text, record) => {
          return (
            <div className="singlepage-table-operation">
              <Link
                to={`${match.url}/detail?taskId=${record.taskId}&upPartyId=${record.upPartyId}&isSend=0`}
                style={{ marginRight: 5 }}
              >
                详情
              </Link>
            </div>
          );
        },
      },
    ];
    const { typeList } = this.state;
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
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
    return (
      <div className={styles.main}>
        <div className={styles.post}>
          <Spin spinning={loadingGetUserLevel}>
            <span>职务: </span>
            <Select
              value={postList.length ? this.getPostValue() : ''}
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
        <div className={styles.selectContent}>
          <Form
            layout="inline"
            onSubmit={this.handleSubmit}
            style={{ width: '100%', display: 'inline-block', paddingLeft: 7 }}
          >
            <FormItem {...formItemLayout} label="任务名称" style={{ width: 250 }}>
              {getFieldDecorator('keyword', {
                initialValue: '',
              })(<Input placeholder="请输入任务关键字" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="任务主题" style={{ width: 250 }}>
              {getFieldDecorator('eduTopicId', {
                initialValue: 6,
              })(
                <Select>
                  <Option key={6} value={6}>
                    全部
                  </Option>
                  {topicList.map(item => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="任务类型" style={{ width: 250 }}>
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
            <FormItem {...formItemLayout} label="任务状态" style={{ width: 250, marginTop: 9 }}>
              {getFieldDecorator('status', {
                initialValue: 1,
              })(
                <Select>
                  {taskList.map(item => (
                    <Option key={item.value} value={item.value}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Form>
          <div className={styles.searchContent}>
            <div className={styles['primary_btn']} style={{ marginLeft: 20 }}>
              <Button onClick={this.handleSubmit} style={{ width: 77 }}>
                搜索
              </Button>
            </div>
            <div className={styles['global-btn']}>
              <Button onClick={this.restSubmit} style={{ width: 77 }}>
                重置
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.tableContent}>
          <Table
            rowKey="index"
            bordered
            loading={loading}
            pagination={pagination}
            columns={columns}
            className={styles.tableStyle}
            dataSource={tableList}
            scroll={{ x: 990 }}
          />
        </div>
      </div>
    );
  }
}
export default MyTask;
