import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import {GetQueryString, postService, getService, exportExcelService} from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';
import { BEGIN, getDataSource, getPageData, getSelectRows } from '../../../../../redux-root/action/table/table';
import {setBasicInfoData, setGranteeData} from '../../../../../redux-root/action/specialPoint/specialPoint';
import AddBasicInfo from './AddBasicInfo';
import AddGrantee from  './AddGrantee';
import { Form, Steps, Row, Col, Input, InputNumber, Select, Modal, Radio, Cascader, Divider, Button, message, Table, Popconfirm} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const Step = Steps.Step;
// import './CarouselDetail.less';

@connect(
  state => ({
    getBasicInfoData: state.specialPoint.getBasicInfoData,
    getGranteeData: state.specialPoint.getGranteeData,
    dataSource: state.table.tableData,
    pageData:state.table.pageData,
    powers: state.powers,
  }),
  dispatch => ({
    setBasicInfoData: n => dispatch(setBasicInfoData(n)),
    setGranteeData: n => dispatch(setGranteeData(n)),
    getData: n => dispatch(BEGIN(n)),
    getPageData:n=>dispatch(getPageData(n)),
    retSetData: n=>dispatch(getDataSource(n)),
    getSelectRowData: n => dispatch(getSelectRows(n)),
  })
)
export default class AddTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0, //当前步骤 从0开始计数
    };
  }

  componentDidMount() {
    //将reducer中的数据置空
    this.props.setBasicInfoData({});
    this.props.setGranteeData({});
  }

  //下一步
  next = () => {
    const current = this.state.current + 1;
    this.setState({current});
  }

  //上一步
  prev = () => {
    const current = this.state.current - 1;
    this.setState({current});
  }

  render() {
    console.log('getBasicInfoData', this.props.getBasicInfoData);
    const steps = [{
      title: '基本信息',
      content: <AddBasicInfo
        next={this.next}
        flowData={this.props.getBasicInfoData} />,
    }, {
      title: '发放对象',
      content: <AddGrantee
        prev={this.prev}
        flowData={this.props.getGranteeData} />,
    }];
    const {current} = this.state;

    //记得 改 1 --> current
    return(
      <div>
        <Steps current={current} >
          {steps.map( (item) =>
            <Step key={item.title} title={item.title} />)}
        </Steps>
        <div>{steps[current].content}</div>
      </div>
    );
  }
}


