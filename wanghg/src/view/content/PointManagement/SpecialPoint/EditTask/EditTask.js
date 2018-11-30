import React, { Component } from 'react';
import TableAndSearch from '../../../../component/table/TableAndSearch';
import {GetQueryString, postService, getService, exportExcelService} from '../../../myFetch';
import API_PREFIX from '../../../apiprefix';
import { connect } from 'react-redux';
import EditBasicInfo from './EditBasicInfo';
import EditGrantee  from './EditGrantee';
import { BEGIN, getDataSource, getPageData, getSelectRows } from '../../../../../redux-root/action/table/table';
import {setBasicInfoData, setGranteeData} from '../../../../../redux-root/action/specialPoint/specialPoint';
import { Tabs, Form, Steps, Row, Col, Input, InputNumber, Select, Modal, Radio, Cascader, Divider, Button, message, Table, Popconfirm} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
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
export default class EditTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id:GetQueryString(location.hash,['id']).id,//编辑时的id
      currentTabsKey:0,//当前标签
      editTaskData:'',//编辑时的数据
    };
  }

  handleChangeTabs=(activeKey)=>{
    this.setState({currentTabsKey:activeKey});
  }

  componentWillMount() {
    let queryFilter = 'Q=id_S_EQ=' + this.state.id;
    //获得编辑时的数据
    getService(API_PREFIX + `services/system/specialTreasureTask/taskList/1/10?${queryFilter}`, data => {
      if(data.retCode === 1){
        this.setState({
          editTaskData: data.root.list[0],
        });
      }
    });
  }

  render(){
    const tabs = [{
      tab:'填写任务信息' ,
      key:'0',
      content: <EditBasicInfo
        editTaskData={this.state.editTaskData} />,
    }, {
      tab:'设置发放对象' ,
      key:'1',
      content: <EditGrantee
        editTaskData={this.state.editTaskData} />,
    }];
    return (
      <Tabs onChange={this.handleChangeTabs} >
        {
          tabs.map((item)=>{
            return (
              <TabPane  tab={item.tab} key={item.key} >
                {
                  item.content
                }
              </TabPane>
            );
          })
        }

      </Tabs>
    );
  }
}


