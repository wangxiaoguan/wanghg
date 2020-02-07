import React, { Component } from 'react';
import TableAndSearch from '../../../component/table/TableAndSearch';
import { GetQueryString, postService, getService, exportExcelService ,exportExcelService1} from '../../myFetch';
import API_PREFIX from '../../apiprefix';
import { connect } from 'react-redux';
import { BEGIN, getDataSource, getPageData, getSelectRows } from '../../../../redux-root/action/table/table';
import { Form, Row, Col, Input, Select, DatePicker, Modal, Cascader, Divider, Button, message, Table } from 'antd';
import AlterPoint from './AlterPoint';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
// import './CarouselDetail.less';

@connect(
  state => ({
    dataSource: state.table.tableData,
    pageData: state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    getData: n => dispatch(BEGIN(n)),
    getPageData: n => dispatch(getPageData(n)),
    retSetData: n => dispatch(getDataSource(n)),
    getSelectRowData: n => dispatch(getSelectRows(n)),
  })
)
export default class TreasureInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pointData: [], //列表展示数据
      totalNum: 0,
      pageSize: 10,
      currentPage: 1,
      values: '', //查询条件

      userid: GetQueryString(location.hash,['id']).id
    };
  }

  componentWillUnmount() {
    window.sessionStorage.removeItem('treasure-userid');
    //this.getPageData(1, 10, '');
    this.props.retSetData({ root: { list: [] } });
    this.props.getSelectRowData([]);
  }

  componentDidMount() {
    //获取用户积分管理列表初始数据
    getService(API_PREFIX + `services/web/point/info/getCommonPointList/1/10?Q=userId=${this.state.userid}`, data => {
      console.log('initPoint:', data);
      if (data.status === 1) {
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
        }, () => {
          console.log('pointdata:', this.state.pointData);
        });
      } else if (data.status === 0) {
        message.error(data.retMsg);
      }
    });

  }

  exportExcel = () => {
    let path = API_PREFIX + `services/web/point/info/export/getCommonPointList?Q=userId=${this.state.userid}${this.state.values}`;
    exportExcelService1(path,'普通积分变更详情');
  }

  //当查询条件变化时
  onChangeData = value => {
    this.setState({
      pointData: value.root.list,
      totalNum: value.root.totalNum,
    });
  }

  getParametersFromChild = value => {
    this.setState({
      values: value,
    });
  }

  //刷新列表展示数据
  refreshData = () => {
    getService(API_PREFIX + `services/web/point/info/getCommonPointList/${this.state.currentPage}/${this.state.pageSize}?Q=userId=${this.state.userid}${this.state.values}`, data => {
      if (data.status === 1) {
        this.setState({
          pointData: data.root.list,
          totalNum: data.root.totalNum,
        });
      } else if (data.status === 0) {
        message.error(data.retMsg);
      }
    });
  }

  //页码改变触发
  onPageChange = (current, pageSize) => {
    getService(API_PREFIX + `services/web/point/info/getCommonPointList/${current}/${pageSize}?Q=userId=${this.state.userid}${this.state.values}`, data => {
      if (data.status === 1) {
        this.setState({
          totalNum: data.root.totalNum,
          pointData: data.root.list,
          currentPage: current,
          pageSize: pageSize,
        });
      } else if (data.status === 0) {
        message.error(data.retMsg);
      }
    });
  }

  //页面大小改变触发
  onPageSizeChange = (current, pageSize) => {
    getService(API_PREFIX + `services/web/point/info/getCommonPointList/${current}/${pageSize}?Q=userId=${this.state.userid}${this.state.values}`, data => {
      if (data.status === 1) {
        this.setState({
          totalNum: data.root.totalNum,
          currentPage: current,
          pageSize: pageSize,
          pointData: data.root.list,
        });
      } else if (data.status === 0) {
        message.error(data.retMsg);
      }
    });
  }

  render() {
    let currentPage = this.state.currentPage;
    let pageSize = this.state.pageSize;

    // let powers = this.props.powers;
    // console.log('权限码', powers);
    // let createPowers = powers && powers['20001.21008.001'];
    // let updatePowers = powers && powers['20001.21008.002'];
    // let readPowers = powers && powers['20001.21008.003'];
    // let deletePowers = powers && powers['20001.21008.004'];
    // let list = ['资讯','活动','评论','分享','意见反馈','投稿','盒子开机','观看悠视影片','安装应用','圈子发言',
    // '登录','版本升级','回答问题','烽火知道发表文章','烽火知道问题阅览','烽火知道文章阅览','烽火知道设置最佳','烽火爱学习同步经验值']
    let list = [
      '活动',
      '意见反馈',
      '投稿',
      '升级',
      '观看影片（盒子）',
      '积分商城',
      '菜品预定',
      '观看悠视影片',
      '可伴积分消费或者退款',
      '悬赏积分（扣减）/烽火知道最佳答案（增加）',
      '烽火知道浏',
      '烽火知道点赞（无记录）',
      '精华评论奖励（无记录）',
      '生活圈活跃（无记录）',
      '专项积分发放',
      '我要求助点赞（无记录）',
      '红包入账',
      '红包退回',
      '红包发出',
      '积分充值',
      '积分商城退款（无记录）',
      '奖励积分（导入批量奖励）',
      '后台积分红包发送失败退回',
      '完成党建任务',
      '完成掌上党校必选课程',
      '完成掌上党校可选课程',
      '阅读一篇党建类资讯（非掌上党校）',
      '参加一次党建活动(非考试)',
      '退出一次党建活动(非考试)',
      '参加一次党建考试']
    const columns = [
      {
        title: '序号',
        dataIndex: 'ids',
        key: 'ids',
        render: (text, record, index) => {
          return record.ids = index + 1 + (this.state.currentPage - 1) * (this.state.pageSize);
        },
      },
      {
        title: '变更数值',
        dataIndex: 'changePoint',
        key: 'changePoint',
      },
      {
        title: '普通积分',
        dataIndex: 'countPoint',
        key: 'countPoint',
      },
      {
        title: '变更原因',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '变更时间',
        dataIndex: 'createDate',
        key: 'createDate',
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render:(text,record)=>{
          return <span>{list[text-1]}</span>
        }
      },
      /*{
          title: '是否启用',
          dataIndex: 'isEnabled',
          key: 'isEnabled',
          render: (text, record) => {
            if(record.isEnabled == true){
              return <span>是</span>;
            }else {
              return <span>否</span>;
            }
          },
        },*/
    ];

    this.state.pointData && this.state.pointData.map((item, index) => {
      item['key'] = index + 1;
    });

    let pagination = {
      total: this.state.totalNum,
      pageSize: this.state.pageSize,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '30', '40'],
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageSizeChange,
    };

    //设置formItem的格式
    const formItemLayout = {
      labelCol: {
        xs: { span: 12 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 },
      },
    };

    return <div className="custom-table">
      <div className="custom-table-search">
        <WrappedSearchForm userid={this.state.userid} onChangeData={this.onChangeData}
          currentPage={this.state.currentPage} pageSize={this.state.pageSize}
          getParametersFromChild={this.getParametersFromChild} />
      </div>
      <div className="custom-table-btn">
        <Button className="resetBtn" style={{ order: 1 }} onClick={() => history.back()}>
          返回
        </Button>
        <Button className="exportBtn" style={{ order: 2 }} onClick={this.exportExcel}>
          导出
        </Button>
      </div>
      <Table dataSource={this.state.pointData} columns={columns} pagination={pagination} bordered />
    </div>;
  }
}

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryFilter: '', //查询条件
      userid:this.props.userid,
    };
  }

  componentDidMount() {

  }

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }

      getService(API_PREFIX + `services/web/point/info/getCommonPointList/1/${this.props.pageSize}?Q=userId=${this.state.userid}${this.state.queryFilter}`, data => {
        if (data.status === 1) {
          this.props.onChangeData(data);
          this.props.getParametersFromChild(this.state.queryFilter);
        } else if (data.status === 0) {
          message.error(data.retMsg);
        }
      });
    });
  }

  handleChange = (value) => {
    console.log('value:', value);
    if (value.length != 0) {
      let query = `&Q=startTime=${value[0].format('YYYY-MM-DD HH:mm:ss')}&Q=endTime=${value[1].format('YYYY-MM-DD HH:mm:ss')}`;
      this.setState({
        queryFilter: query,
      }, () => {
        console.log('queryFilter:', this.state.queryFilter);
      });
    } else {
      this.setState({
        queryFilter: '',
      });
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 15,
      },
    };
    const formItemLayout1 = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 13,
      },
    };

    const config = {
      rules: [{
        required: false,
      }],
    };

    return (
      <Form onSubmit={this.handleSubmit} >
        <Row>
          <Col span={9}>
            <FormItem className="RangePicker"  {...formItemLayout1} label="起止时间" >
              {getFieldDecorator('createdate', { initialValue: '' }, config)(
                <RangePicker
                  className="input1"
                  style={{ width: '400px' }}
                  format="YYYY-MM-DD HH:mm:ss"
                  showTime={{ format: 'HH:mm:ss' }}
                  onChange={this.handleChange}
                />
              )}
            </FormItem>
          </Col>
          <Col span="24" className="colBtn">
            <Button
              type="primary"
              htmlType="submit"
              className="queryBtn"
            >
              查询
            </Button>
            <Button
              type="primary"
              className="resetBtn"
              onClick={() => {
                this.props.form.resetFields();
                this.setState({
                  queryFilter: '',
                });
              }}
            >
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
const WrappedSearchForm = Form.create()(SearchForm);


