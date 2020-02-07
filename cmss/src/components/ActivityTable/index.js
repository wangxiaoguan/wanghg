import React, { Component } from 'react';
import { Button, Row, Col, Input, Table, Modal, message } from 'antd';
import { connect } from 'dva';
import { storage } from '@/utils/utils';
import styles from './index.less';

@connect(({ partyTask, loading }) => ({
  partyTask,
  loading: loading.effects['partyTask/getActivityTableData'],
}))
class ActivityTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKey: [],
      dataSource: [],
      total: 0,
      current: 1,
      selectActivity: [],
      searchValue: '',
    };
  }

  componentDidMount = () => {
    this.getTableSOurce('', 1);
  };

  selectActivity = () => {
    this.getTableSOurce('', 1);
  };

  getTableSOurce = (keyword, current) => {
    const { dispatch } = this.props;
    const userInfo = JSON.parse(storage.getLocal('userInfo'));
    const formData = {
      userId: userInfo.id,
      pagesize: '10',
      index: (current - 1) * 10,
      msgId: 'PARTY_WEB_ACTIVITY_LIST',
      keyword,
    };
    dispatch({
      type: 'partyTask/getSeekTableData',
      payload: {
        text: JSON.stringify(formData),
      },
      callBack: res => {
        this.setState({
          dataSource: res.objectList,
          total: res.count,
          current,
        });
      },
    });
  };

  onSelectChange = (key, row) => {
    this.setState({
      selectActivity: row,
    });
  };

  pageChange = page => {
    const { searchValue } = this.state;
    this.getTableSOurce(searchValue, page);
  };
  handleOk = () => {
    const { selectActivity } = this.state;
    const { cancelTable, setSeek } = this.props;
    if (selectActivity.length === 0) {
      message.warning('请选择资讯');
      return;
    }
    cancelTable();
    setSeek(selectActivity, 'actList');
  };

  search = () => {
    const { searchValue } = this.state;
    this.getTableSOurce(searchValue, 1);
  };

  reset = () => {
    this.setState({ searchValue: '' });
    this.getTableSOurce('', 1);
  };

  onCancel = () => {
    const { cancelTable } = this.props;
    this.reset();
    cancelTable && cancelTable();
  }
  isDisable =(id)=>{
    const { acList=[] } = this.props;
    let disable = false;
    acList.forEach(s => {
      if( s.id === id) {
        disable = true
      }
    })
    return disable
  }

  render() {
    const { loading, visible, cancelTable } = this.props;
    const { total, searchValue, current, selectedRowKey, dataSource } = this.state;
    const columns = [
      {
        key: 1,
        title: '活动标题',
        dataIndex: 'title',
        width: 250,
        align: 'center',
        className: styles.tableColStyle,
      },
      {
        key: 3,
        title: '创建时间',
        dataIndex: 'createDate',
        width: 200,
        align: 'center',
        className: styles.tableColStyle,
      },
    ];
    const rowSelection = {
      selectedRowKey,
      type: 'radio',
      onChange: this.onSelectChange,
      columnWidth: 50,
      getCheckboxProps: record => ({
        disabled: this.isDisable(record.id),
        name: record.name,
      }),
    };
    return (
      <div className={styles.seekStyle}>
        <Modal
          visible={visible}
          title="添加活动"
          onCancel={() => this.onCancel()}
          width={650}
          cancelText="取消"
          okText="确认"
          maskClosable={false}
          onOk={this.handleOk}
          centered
          destroyOnClose
        >
          <div>
            <Row>
              <Col span={12}>
                <Input
                  placeholder="请输入活动标题"
                  value={searchValue}
                  style={{ width: 250, marginBottom: 20 }}
                  onChange={e => this.setState({ searchValue: e.target.value })}
                />
              </Col>
              <Col span={3}>
                <Button onClick={this.search} type="primary">
                  搜索
                </Button>
              </Col>
              <Col span={3}>
                <Button onClick={this.reset}>重置</Button>
              </Col>
            </Row>
            <Table
              columns={columns}
              bordered
              loading={loading}
              dataSource={dataSource}
              size="small"
              pagination={{
                total,
                current,
                size: 'small',
                howTotal: () => {
                  return `共${total}条`;
                },
                pageSize: 10,
                onChange: this.pageChange,
              }}
              rowSelection={rowSelection}
              className={styles.table}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default ActivityTable;
